import os
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="Electrical AI Troubleshooter")

# CORS Enable karein taaki Frontend connect ho sake
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock Database: Chat history aur file details store karne ke liye
session_db = {}

MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB

@app.post("/api/upload")
async def upload_drawing(
    file: UploadFile = File(...),
    problem: str = Form(...),
    language: str = Form(...)
):
    # 100MB size validation
    file_size = 0
    contents = await file.read()
    file_size = len(contents)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds 100MB limit!")

    # Ek unique session ID create karein (Real app me UUID use karein)
    session_id = "session_123"
    
    # System instruction based on language preference
    lang_instruction = {
        "hinglish": "Respond in technical Hinglish (mix of Hindi and English). Keep electrical terms like 'breaker', 'relay' in English.",
        "hindi": "Respond strictly in Hindi language using simple terms.",
        "english": "Respond in formal technical English."
    }.get(language.lower(), "english")

    # Initial AI Prompt Simulation (Yahan actual LLM Vision API call hogi)
    initial_ai_response = (
        f"[Language: {language.upper()}]\n\n"
        f"Drawing '{file.filename}' successfully analyzed.\n"
        f"Aapne bataya: '{problem}'.\n\n"
        f"**STEP 1:** Sabse pehle main panel ka Main Circuit Breaker (MCB) check kijiye. "
        f"Kya wahan short-circuit ya trip ka indicator on hai? Check karke mujhe bataiye."
    )

    # State save karein loop chalane ke liye
    session_db[session_id] = {
        "filename": file.filename,
        "language": language,
        "history": [{"role": "user", "text": problem}, {"role": "ai", "text": initial_ai_response}],
        "step": 1
    }

    return {"session_id": session_id, "response": initial_ai_response}

class ChatInput(BaseModel):
    session_id: str
    user_input: str

@app.post("/api/chat")
async def chat_loop(data: ChatInput):
    session = session_db.get(data.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session["history"].append({"role": "user", "text": data.user_input})
    session["step"] += 1
    
    # Iterative Logic: Jab tak user 'solved' nahi bolta
    if "solved" in data.user_input.lower() or "theek ho gaya" in data.user_input.lower():
        ai_response = "🎉 Great! Mujhe khushi hai ki aapka problem solve ho gaya. Safety rules follow karte rahiye!"
    else:
        ai_response = (
            f"Aapke input '{data.user_input}' ke basis par, ab hum agle step par chalte hain.\n\n"
            f"**STEP {session['step']}:** Ab transformer ke secondary terminals par multimeter se voltage check kijiye "
            f"aur dekhiye kya wo nominal range me hai? Mujhe reading bataiye."
        )
        
    session["history"].append({"role": "ai", "text": ai_response})
    return {"response": ai_response}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)