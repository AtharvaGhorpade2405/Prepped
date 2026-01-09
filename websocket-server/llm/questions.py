from config import SYSTEM_PROMPT, client
import json

def generate_question(topic: str, chat_history: list, difficulty: str) -> str:
    """
    Generates the next interview question using Groq structured outputs.
    Returns ONLY the question text.
    """

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT.format(topics=topic,difficulty=difficulty),
            },
            *chat_history,
            {
                "role": "user",
                "content": "Generate the next interview question."
            }
        ],
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "interview_question",
                "strict": True,
                "schema": {
                    "type": "object",
                    "properties": {
                        "question": {
                            "type": "string",
                            "description": "A single, clear interview question."
                        }
                    },
                    "required": ["question"],
                    "additionalProperties": False
                }
            }
        },
        temperature=0.4,
    )

    raw = response.choices[0].message.content

    if raw is None:
        raise RuntimeError("Groq model returned no content")

    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        raise RuntimeError(f"Invalid JSON from Groq model: {raw}")

    question = data.get("question")

    if not isinstance(question, str) or not question.strip():
        raise RuntimeError(f"Invalid question value: {question}")

    return question.strip()
