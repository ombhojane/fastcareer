from fastapi import FastAPI, Request, Form
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/service", response_class=HTMLResponse)
async def read_service(request: Request):
    return templates.TemplateResponse("service.html", {"request": request})

@app.post("/submit_about_you/")
async def submit_about_you(request: Request, name: str = Form(...), mobile: str = Form(...), email: str = Form(...)):
    # Here you would process the form data (e.g., validate, save to database)
    print(name, mobile, email)  # For demonstration, just printing to the console

    # Simulate progression logic and response
    return JSONResponse(content={"progress": "100%", "nextSection": "Hair Health", "message": "About You section completed. Proceed to Hair Health."})
