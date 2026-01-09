from config import client
import json

def generate_final_summary(evaluations: list[dict]) -> dict:
    """
    Aggregates per-question evaluations into ONE final interview evaluation.
    Uses the SAME schema as individual evaluations.
    """

    if not evaluations:
        return {
            "verdict": "error",
            "reason": "no_evaluations_provided",
        }

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a strict technical interviewer.\n"
                    "You will be given multiple per-question evaluations.\n\n"
                    "Your task:\n"
                    "- Aggregate them into ONE final interview evaluation\n"
                    "- Use the SAME format as the individual evaluations\n"
                    "- Do NOT introduce new criteria\n"
                    "- Base your judgment ONLY on the provided evaluations\n"
                    "- Be as concise as possible.\n"
                ),
            },
            {
                "role": "user",
                "content": (
                    "Per-question evaluations:\n\n"
                    f"{json.dumps(evaluations, indent=2)}"
                ),
            },
        ],
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "final_interview_evaluation",
                "strict": True,
                "schema": {
                    "type": "object",
                    "properties": {
                        "score": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 10,
                        },
                        "strengths": {
                            "type": "array",
                            "items": {"type": "string"},
                        },
                        "weaknesses": {
                            "type": "array",
                            "items": {"type": "string"},
                        },
                        "missing_points": {
                            "type": "array",
                            "items": {"type": "string"},
                        },
                        "verdict": {
                            "type": "string",
                            "enum": ["pass", "borderline", "fail"],
                        },
                    },
                    "required": [
                        "score",
                        "strengths",
                        "weaknesses",
                        "missing_points",
                        "verdict",
                    ],
                    "additionalProperties": False,
                },
            },
        },
        temperature=0.3,
    )

    raw = response.choices[0].message.content

    if raw is None:
        raise RuntimeError("Groq model returned no content")

    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        raise RuntimeError(f"Invalid JSON from Groq model: {raw}")

    return data
