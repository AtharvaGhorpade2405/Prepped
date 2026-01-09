from .settings import (
    SAMPLE_RATE,
    FRAME_DURATION_MS,
    MAX_SILENCE_FRAMES,
    RESPONSE_TIMEOUT_SECONDS,
)

from .interview import (
    TOPIC,
    MAX_QUESTIONS,
    MAX_REPROMPTS,
    SYSTEM_PROMPT,
    MAX_ANSWER_SECONDS
)

from .clients import client

__all__ = [
    "SAMPLE_RATE",
    "FRAME_DURATION_MS",
    "MAX_SILENCE_FRAMES",
    "RESPONSE_TIMEOUT_SECONDS",

    "TOPIC",
    "MAX_QUESTIONS",
    "MAX_REPROMPTS",
    "SYSTEM_PROMPT",
    "MAX_ANSWER_SECONDS"

    "client",
]
