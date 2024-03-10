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
        f"Basic information about theus user: {json.dumps(data['about_you'], ensure_ascii=False)}"
        "Given an individual's career aspirations, core values, strengths, preferences, and skills, provide a comprehensive analysis that identifies key strengths, aligns these with career values, and suggests career paths. Then, recommend the top 5 job descriptions that would be a perfect fit based on the analysis. Here are the details:",
        f"Career Priorities: {json.dumps(data['career_priorities'], ensure_ascii=False)}",
        f"Core Values: {json.dumps(data['core_values'], ensure_ascii=False)}",  
        "Rate the user's career priorities out of 100 and provide justification:",
        f"Strengths: {json.dumps(data['strengths'], ensure_ascii=False)}",
        "Rate the user's strengths out of 100 and provide justification:",        
        f"Dream Job Information: {json.dumps(data['dream_job'], ensure_ascii=False)}",
        "Rate the user's dream job alignment out of 100 and provide justification:",               
        f"Preferences: {json.dumps(data['preferences'], ensure_ascii=False)}",
        "Rate the user's preferences out of 100 and provide justification:",
        f"Skills and Experience: {json.dumps(data['skills_experience'], ensure_ascii=False)}",
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

@app.post('/analyze')
async def analyze(request: Request):
    try:
        data = await request.json()
        prompt = construct_comprehensive_prompt(data)
        print("Constructed prompt:", prompt)        
        analysis_result = call_gemini(prompt)
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

    resumes = format_gemini_response(resume_content)
    
    return {"resumeContent": resumes}


  
if __name__ == '__main__':
    app.run(debug=True)