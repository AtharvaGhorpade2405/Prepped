from config import client
import json

def evaluate_answer(question: str | None, transcript: str | None) -> dict:
    """
    Evaluates a candidate answer using Groq structured outputs.
    Returns STRICT structured evaluation.
    """

    if not question or not transcript:
        return {
            "verdict": "error",
            "reason": "missing_input",
        }

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a strict technical interviewer.\n"
                    "Evaluate answers objectively.\n"
                    "Do NOT be lenient.\n"
                    "Do NOT explain your reasoning.\n"
                    "Be concise.\n"
                    "Do not expect code examples from the candidate since the candidate's answer is converted to text using their speech. \n"
                    "You may occasionally encounter words that might not fit right in the answer, that's because of the speech to text, so, go easy with it.\n"
                    "The answer would not be very long since the maximum time allowed to answer is 90 seconds, so they might not be able to cover all topics in that time frame.\n"
                    "Keep all these points in mind and then evaluate the answer.\n"
                    "Keep the evaluation as short as possible."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"Question:\n{question}\n\n"
                    f"Candidate Answer:\n{transcript}\n"
                ),
            },
        ],
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "answer_evaluation",
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
