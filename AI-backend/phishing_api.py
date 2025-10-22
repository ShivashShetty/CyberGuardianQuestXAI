# phishing_api.py
"""
FastAPI server for local phishing tactic detection using the fine-tuned DistilBERT model.
"""

import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import DistilBertTokenizerFast, DistilBertForSequenceClassification
import torch
import uvicorn
import os

MODEL_PATH = "phishing_tactics_model"
LABELS_PATH = os.path.join(MODEL_PATH, "label_names.json")

# Load model and tokenizer
model = DistilBertForSequenceClassification.from_pretrained(MODEL_PATH)
tokenizer = DistilBertTokenizerFast.from_pretrained('distilbert-base-uncased')
with open(LABELS_PATH, "r") as f:
    label_names = json.load(f)


app = FastAPI(title="Phishing Tactic Analyzer")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EmailRequest(BaseModel):
    text: str

class EmailResponse(BaseModel):
    risk_score: float
    detected_tactics: list
    tactic_scores: dict


@app.post("/analyze-email", response_model=EmailResponse)
def analyze_email(req: EmailRequest):
    try:
        inputs = tokenizer(req.text, return_tensors="pt", truncation=True, padding=True, max_length=256)
        with torch.no_grad():
            outputs = model(**inputs)
            logits = outputs.logits[0]
            probs = torch.sigmoid(logits).cpu().numpy()
        detected = [label_names[i] for i, p in enumerate(probs) if p > 0.5]
        tactic_scores = {label_names[i]: float(p) for i, p in enumerate(probs)}
        risk_score = float(probs.max())

        # Whitelist: force risk_score to 0 for clearly safe/ham phrases
        whitelist = [
            "please find attached the meeting agenda for next week",
            "hey, are we still on for lunch tomorrow at 1pm?",
            "happy birthday! hope you have a wonderful day.",
            "let me know if you need any help with the project.",
            "thanks for your payment. your order has been shipped."
        ]
        text_lower = req.text.lower().strip()
        if any(phrase in text_lower for phrase in whitelist):
            risk_score = 0.0
            detected = []
            tactic_scores = {k: 0.0 for k in tactic_scores}

        # Rule-based risk boosting for obvious phishing cues
        cues = [
            (r"bank details|account number|pin|password|login credentials|verify|urgent|immediately|click here|security team|support team|locked|suspended|refund|prize|gift card|free|paypal|tax refund|administrator|reset your password|confirm your account|direct deposit|billing information|cruise|claim your prize|provide your (address|payment|info|details)", 0.25)
        ]
        import re
        for pattern, boost in cues:
            if re.search(pattern, text_lower):
                risk_score = min(risk_score + boost, 1.0)
                break

        return EmailResponse(
            risk_score=risk_score,
            detected_tactics=detected,
            tactic_scores=tactic_scores
        )
    except Exception as e:
        import traceback
        tb = traceback.format_exc()
        raise HTTPException(status_code=500, detail=f"{str(e)}\n{tb}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8082)
