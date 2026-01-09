import json
import time
import uuid
import hmac
import hashlib
import os
import requests
from dotenv import load_dotenv
load_dotenv(override=True)

# -------------------------------------------------
# CONFIG
# -------------------------------------------------
API_URL = "http://localhost:5000/api/interviews"   # Express endpoint
SIGNING_SECRET = os.getenv("INTERVIEW_SIGNING_SECRET")

if not SIGNING_SECRET:
    raise RuntimeError("INTERVIEW_SIGNING_SECRET not set")

# -------------------------------------------------
# 1. FAKE FINAL SUMMARY (same schema as real one)
# -------------------------------------------------
final_summary = {
    "score": 7,
    "strengths": ["clear fundamentals", "good structure"],
    "weaknesses": ["missed edge cases"],
    "missing_points": ["deadlock prevention"],
    "verdict": "borderline",
}

# -------------------------------------------------
# 2. INTERVIEW ID + TIMESTAMP
# -------------------------------------------------
interview_id = str(uuid.uuid4())
timestamp = int(time.time())

# -------------------------------------------------
# 3. SIGN PAYLOAD (must match backend logic)
# -------------------------------------------------
payload_to_sign = {
    "interview_id": interview_id,
    "timestamp": timestamp,
    "summary": final_summary,
}

message = json.dumps(
    payload_to_sign,
    sort_keys=True,
    ensure_ascii=True,
    separators=(",", ":")
).encode("utf-8")
print("Encoded message:")
print(message)

signature = hmac.new(
    SIGNING_SECRET.encode("utf-8"),
    message,
    hashlib.sha256
).hexdigest()

# -------------------------------------------------
# 4. FINAL REQUEST BODY
# -------------------------------------------------
request_body = {
    "interview_id": interview_id,
    "timestamp": timestamp,
    "summary": final_summary,
    "signature": signature,
    "topic": "Operating Systems",
}

print("\n--- SENDING PAYLOAD ---")
print(json.dumps(request_body, indent=2))

# -------------------------------------------------
# 5. SEND TO EXPRESS
# -------------------------------------------------
resp = requests.post(API_URL, json=request_body)

print("\n--- RESPONSE ---")
print("Status:", resp.status_code)
try:
    print("Body:", resp.json())
except Exception:
    print("Raw:", resp.text)