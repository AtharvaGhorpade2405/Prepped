from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from config import TOPIC
from llm import *
from ws import *
from audio import *
from security import * 
import uvicorn
import uuid
import time
import json
import asyncio
import audioop

app = FastAPI()

origins = [          
    "https://prepped-3qxo.onrender.com" 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ⏱️ TIMING CONFIGURATION ---
SILENCE_THRESHOLD = 3.0       
INITIAL_SILENCE_LIMIT = 10.0  
MAX_ANSWER_DURATION = 90.0    
VAD_THRESHOLD = 800           
CONSECUTIVE_LOUD_FRAMES = 3   

@app.get("/health")
async def health_check():
    return {"status": "active", "message": "I am awake!"}

@app.websocket("/ws/audio")
async def audio_ws(ws: WebSocket):
    await ws.accept()

    # ---------------- PER-CONNECTION STATE ----------------
    state = {
        "config": None,
        "chat_history": [],
        "evaluations": [],  
        "current_question": None,
        "question_count": 0,
        "question_asked_at": None,
        "interview_id": str(uuid.uuid4()),
        
        # Audio / Timing State
        "speech_buffer": bytearray(), 
        "in_speech": False,           
        "last_speech_time": None,     
        "answer_start_time": None,
        "loud_frame_counter": 0 
    }

    # ------------------------------------------------------
    # 1️⃣ SETUP & CONFIG
    # ------------------------------------------------------
    try:
        first_msg = await ws.receive_text()
        payload = json.loads(first_msg)
        if payload.get("type") != "config":
            raise ValueError("First message must be config")
        state["config"] = payload["data"]
    except Exception:
        await ws.send_text(json.dumps({"type": "error", "message": "Invalid config"}))
        return

    topic = state["config"].get("topic", "General")
    difficulty = state["config"].get("difficulty", "medium")
    max_questions = int(state["config"].get("questions", 3))

    # ------------------------------------------------------
    # 2️⃣ HELPER: MOVE TO NEXT QUESTION OR END
    # ------------------------------------------------------
    async def ask_next_question():
        """Generates next question OR sends final summary if finished."""
        
        if state["question_count"] < max_questions:
            # --- NEXT QUESTION ---
            next_q = generate_question(topic, state["chat_history"],difficulty)
            state["current_question"] = next_q
            state["question_count"] += 1
            state["chat_history"].append({"role": "assistant", "content": next_q})

            await ws.send_text(json.dumps({
                "type": "question", 
                "text": next_q
            }))
            
            # Reset Timers
            state["question_asked_at"] = time.time()
            state["speech_buffer"] = bytearray()
            state["in_speech"] = False
            state["last_speech_time"] = None
            state["answer_start_time"] = None
            state["loud_frame_counter"] = 0
            
            print(f"--- Question {state['question_count']} Asked ---")
        
        else:
            # --- END OF INTERVIEW ---
            print("All questions finished. Generating summary...")
            
            summary_data = state["evaluations"] if state["evaluations"] else [{"info": "No answers provided"}]
            
            # Generate the summary content
            final_summary = generate_final_summary(summary_data)
            print(final_summary)
            
            # 1. Generate Metadata
            timestamp = int(time.time())
            
            # 2. Generate Signature using your function
            signature = sign_payload(state["interview_id"], timestamp, final_summary)
            
            # 3. Send Comprehensive Payload
            await ws.send_text(json.dumps({
                "type": "final_summary",
                "interview_id": state["interview_id"],
                "timestamp": timestamp,
                "topic": topic,
                "data": final_summary, 
                "signature": signature
            }))
            
            await ws.send_text(json.dumps({"type": "end"}))
            raise WebSocketDisconnect()

    # ------------------------------------------------------
    # 3️⃣ HELPER: RECORD SKIP
    # ------------------------------------------------------
    async def process_skip():
        """Records a skipped question."""
        print(f"Skipping Question {state['question_count']} due to silence.")
        
        state["evaluations"].append({
            "question": state["current_question"],
            "answer": "No Answer (Skipped by Timeout)",
            "evaluation": {
                "score": 0,
                "feedback": "The candidate did not provide an answer within the time limit."
            }
        })
        
        await ws.send_text(json.dumps({
            "type": "info", 
            "message": "No response detected. Moving to next question."
        }))
        
        await ask_next_question()

    # ------------------------------------------------------
    # 4️⃣ HELPER: PROCESS ANSWER (EVALUATE)
    # ------------------------------------------------------
    async def process_complete_answer():
        if not state["speech_buffer"]:
            return

        print("Transcribing...")
        transcript = transcribe_with_groq(bytes(state["speech_buffer"]))
        
        state["speech_buffer"] = bytearray()
        state["in_speech"] = False
        state["loud_frame_counter"] = 0

        if not validate_transcript(transcript):
            print("Invalid transcript. Resetting wait timer.")
            state["question_asked_at"] = time.time() 
            return

        state["chat_history"].append({"role": "user", "content": transcript})
        print(f"User Answer: {transcript}")

        evaluation = evaluate_answer(
            question=state["current_question"],
            transcript=transcript,
            # difficulty=difficulty
        )

        state["evaluations"].append({
            "question": state["current_question"],
            "answer": transcript,
            "evaluation": evaluation
        })

        await ws.send_text(json.dumps({
            "type": "evaluation",
            "data": evaluation
        }))

        await ask_next_question()

    # ------------------------------------------------------
    # 5️⃣ START INTERVIEW
    # ------------------------------------------------------
    first_q = generate_question(topic, state["chat_history"], difficulty)
    state["current_question"] = first_q
    state["question_count"] = 1
    state["chat_history"].append({"role": "assistant", "content": first_q})
    
    await ws.send_text(json.dumps({"type": "question", "text": first_q}))
    state["question_asked_at"] = time.time()
    print("--- Interview Started ---")

    # ------------------------------------------------------
    # 6️⃣ MAIN LOOP
    # ------------------------------------------------------
    try:
        while True:
            current_time = time.time()
            data = None

            try:
                data = await asyncio.wait_for(ws.receive_bytes(), timeout=0.1)
            except asyncio.TimeoutError:
                pass 
            except WebSocketDisconnect:
                break 

            if data:
                resampled_chunk = resample_pcm(data, src_rate=48000)
                rms = audioop.rms(resampled_chunk, 2) 
                
                if rms > VAD_THRESHOLD:
                    state["loud_frame_counter"] += 1
                else:
                    state["loud_frame_counter"] = 0

                if state["loud_frame_counter"] >= CONSECUTIVE_LOUD_FRAMES:
                    state["last_speech_time"] = current_time
                    if not state["in_speech"]:
                        print("Speech Detected! Recording started.")
                        state["in_speech"] = True
                        state["answer_start_time"] = current_time
                
                if state["in_speech"]:
                    state["speech_buffer"].extend(resampled_chunk)

            # C: TIMING CHECKS
            if not state["in_speech"] and state["question_asked_at"]:
                wait_time = current_time - state["question_asked_at"]
                if wait_time > INITIAL_SILENCE_LIMIT:
                    await process_skip()
                    continue

            if state["in_speech"] and state["last_speech_time"]:
                silence_duration = current_time - state["last_speech_time"]
                if silence_duration > SILENCE_THRESHOLD:
                    print(f"Silence detected ({silence_duration:.1f}s). Processing answer.")
                    await process_complete_answer()
                    continue

            if state["in_speech"] and state["answer_start_time"]:
                duration = current_time - state["answer_start_time"]
                if duration > MAX_ANSWER_DURATION:
                    print("1.5 min limit reached. Forcing evaluation.")
                    await process_complete_answer()
                    continue

    except WebSocketDisconnect:
        print("User disconnected")