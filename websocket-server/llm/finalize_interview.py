from llm import generate_final_summary
from security import sign_payload
from ws import send_event
import time

async def finalize_interview(ws, state):
    try:
        final_summary = generate_final_summary(state["evaluations"])
    except Exception as e:
        final_summary = {
            "verdict": "error",
            "reason": "final_summary_failed",
            "details": str(e),
        }

    timestamp = int(time.time())
    signature = sign_payload(
        interview_id=state["interview_id"],
        timestamp=timestamp,
        summary=final_summary,
    )

    await send_event(ws, {
        "type": "final_summary",
        "interview_id": state["interview_id"],
        "timestamp": timestamp,
        "data": final_summary,
        "signature": signature,
    })

    await send_event(ws, { "type": "end" })
