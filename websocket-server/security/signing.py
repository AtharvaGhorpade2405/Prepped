import hmac
import hashlib
import json
from config.settings import SIGNING_SECRET

def sign_payload(interview_id: str, timestamp: int, summary: dict) -> str:
    """
    Signs interview_id + timestamp + summary together.
    """

    payload_string = f"{interview_id}|{timestamp}|{json.dumps(summary, separators=(',', ':'), sort_keys=True)}"
    signature = hmac.new(
        SIGNING_SECRET.encode("utf-8"),
        payload_string.encode("utf-8"),
        hashlib.sha256
    ).hexdigest()
    return signature