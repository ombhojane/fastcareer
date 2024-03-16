import json
import re
import requests
from fastapi import FastAPI, Request, Form, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
import google.generativeai as genai
from fastapi.responses import RedirectResponse



# Placeholder for your API key - securely manage this in your actual application
API_KEY = "AIzaSyCA4__JMC_ZIQ9xQegIj5LOMLhSSrn3pMw"

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/service", response_class=HTMLResponse)
async def read_service(request: Request):
    return templates.TemplateResponse("service.html", {"request": request})

def construct_comprehensive_prompt(data):
    if 'About You' in data:
        about_you_details = data['About You']

    prompt_parts = [
        "Basic information about the user: {}".format(json.dumps(data.get('about_you', {}), ensure_ascii=False)),
        "Given an individual's career aspirations, core values, strengths, preferences, and skills, provide a comprehensive analysis that identifies key strengths, aligns these with career values, and suggests career paths. Then, recommend the top 5 job descriptions that would be a perfect fit based on the analysis. Here are the details:",
        "Career Priorities: {}".format(json.dumps(data.get('career_priorities', {}), ensure_ascii=False)),
        "Core Values: {}".format(json.dumps(data.get('core_values', {}), ensure_ascii=False)),  
        "Rate the user's career priorities out of 100 and provide justification:",
        "Strengths: {}".format(json.dumps(data.get('strengths', {}), ensure_ascii=False)),
        "Rate the user's strengths out of 100 and provide justification:",        
        "Dream Job Information: {}".format(json.dumps(data.get('dream_job', {}), ensure_ascii=False)),
        "Rate the user's dream job alignment out of 100 and provide justification:",               
        "Preferences: {}".format(json.dumps(data.get('preferences', {}), ensure_ascii=False)),
        "Rate the user's preferences out of 100 and provide justification:",
        "Skills and Experience: {}".format(json.dumps(data.get('skills_experience', {}), ensure_ascii=False)),
        "Rate the user's skills and experience out of 100 and provide justification:",
        "Based on the analysis, suggest 2-3 areas for mindful upskilling and professional development for the user, along with relevant certifications that would help strengthen their profile:",
        "Consider the following in the further analysis:",
        "- Given the strengths and dream job aspirations, what are the top industries or roles that would be a perfect fit?",
        "- Based on the preferences, what work environment or company culture would be most suitable?",
        "Conclude with recommendations for the top 5 open job descriptions in India aligned to the user's goals, including any specific industries or companies where these roles may be in demand currently.",
    ]

    prompt = "\n\n".join(prompt_parts)
    return prompt

def call_gemini(prompt):
    """Calls the Gemini API with the given prompt and returns the response."""
    # Configure the API with your key
    genai.configure(api_key=API_KEY)

    # Set up the model configuration
    generation_config = {
        "temperature": 0.7,
        "top_p": 0.95,
        "max_output_tokens": 4096,
    }

    safety_settings = [
        {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    ]

    # Create the model instance
    model = genai.GenerativeModel(model_name="gemini-1.0-pro",
                                  generation_config=generation_config,
                                  safety_settings=safety_settings)

    # Generate content
    response = model.generate_content([prompt])
    response_text = response.text
    return response_text

analysis_data_store = {}    

def format_gemini_response(text):
   
    # Use regular expressions to replace **text** with <strong>text</strong>
    formatted_text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', text)
    return formatted_text

def format_response_for_html(response_text):
    # Replace newline characters with <br> for HTML
    formatted_text = response_text.replace("\n", "<br>")
    
    # Replace * (markdown bullet points) with HTML unordered list tags
    bullet_point_pattern = r"\* (.*?)<br>"
    formatted_text = re.sub(bullet_point_pattern, r"<li>\1</li>", formatted_text)
    formatted_text = formatted_text.replace("<li>", "<ul><li>").replace("</li><br>", "</li></ul><br>")
    
    # Optionally, if you detect JSON structures, you can format them prettily
    # Note: This part is optional and can be removed if not needed
    json_pattern = r"{.*?}"
    def format_json(match):
        json_obj = json.loads(match.group())
        return "<pre>" + json.dumps(json_obj, ensure_ascii=False, indent=4) + "</pre>"
    
    formatted_text = re.sub(json_pattern, format_json, formatted_text, flags=re.DOTALL)
    
    # Ensure any unclosed HTML tags are properly closed (simple approach)
    if '<ul>' in formatted_text and '</ul>' not in formatted_text:
        formatted_text += '</ul>'
    
    return formatted_text



def format_response(response_text):
    # Replace \n with newline characters
    formatted_text = response_text.replace('\\n', '\n')

    # Replace \* with bullet points
    formatted_text = re.sub(r'\\(\*)', r'• ', formatted_text)

    # Replace _text_ with *text*
    formatted_text = re.sub(r'_([^_]+)_', r'*\1*', formatted_text)

    # Replace \\*\\* with **
    formatted_text = re.sub(r'\\(\*\\*)', r'**', formatted_text)

    # Replace \\_ with _
    formatted_text = re.sub(r'\\(_)', r'_', formatted_text)

    return formatted_text

@app.post('/analyze')
async def analyze(request: Request):
    try:
        data = await request.json()
        prompt = construct_comprehensive_prompt(data)
        print("Constructed prompt:", prompt)        
        analysis_result = call_gemini(prompt)
        analysis_result = format_response_for_html(analysis_result)
        print("Analysis result:", analysis_result)
        analysis_data_store['latest_analysis'] = analysis_result
        return {"analysis": analysis_result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post('/generate-linkedin-profile')
async def generate_linkedin_profile():
    analysis_result = analysis_data_store.get('latest_analysis', None)
    if not analysis_result:
        raise HTTPException(status_code=404, detail="No analysis data found.")
    
    linkedin_prompt = f"""
    Based on the following inputs, generate a professional bio and a short header bio that could be used on LinkedIn.
    {analysis_result}
    Provide optimized content for a LinkedIn Bio, Header Bio, Experience, Skills, Certifications. (dont give education section)
    """
    
    linkedin_content = call_gemini(linkedin_prompt) 
    linkedin_content = format_response_for_html(linkedin_content)
    return {"linkedinContent": linkedin_content}

@app.post('/generate-resume')
async def generate_resume():
    analysis_result = analysis_data_store.get('latest_analysis', None)
    if not analysis_result:
        raise HTTPException(status_code=404, detail="No analysis data found.")

    about_you_data = analysis_data_store.get('about_you', {})
    about_you_prompt_part = f"Basic information about the user: {json.dumps(about_you_data, ensure_ascii=False)}"

    resume_prompt = f"""
    {about_you_prompt_part}

    Based on the following inputs, print the basic details in proper manner line by line (name, github url, etc), generate a professional resume that includes sections for a Summary, Experience, Skills, Certifications (dont give education section).
    {analysis_result}
    Provide optimized content for each section of the resume to highlight the individual's qualifications, achievements, and career progression.
    """
    
    resume_content = call_gemini(resume_prompt) 

    resumes = format_response_for_html(resume_content)
    
    return {"resumeContent": resumes}

@app.post('/save_responses')
async def save_responses(request: Request):
    data = await request.json()
    analysis_data_store['user_responses'] = data
    return {"message": "Responses saved successfully"}

@app.get("/show_responses", response_class=HTMLResponse)
async def show_responses(request: Request):
    user_responses = analysis_data_store.get('user_responses', {})
    return templates.TemplateResponse("show_responses.html", {"request": request, "user_responses": user_responses})


@app.post("/process")
async def process(request: Request):
    form_data = await request.form()
    # Process the form data as needed, for example, save it to a database
    # For simplicity, we're just passing it along to the template
    return templates.TemplateResponse("results_page.html", {"request": request, "data": form_data})

@app.get("/results", response_class=HTMLResponse)
async def results(request: Request):
    # Assuming you have some logic to fetch the processed data
    processed_data = {}  # Replace with actual data retrieval logic
    return templates.TemplateResponse("results_page.html", {"request": request, "data": processed_data})
  
if __name__ == '__main__':
    app.run(debug=True)
