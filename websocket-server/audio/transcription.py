from config.clients import client
from audio import pcm_to_wav_bytes

def transcribe_with_groq(pcm_bytes: bytes):
    wav_bytes = pcm_to_wav_bytes(pcm_bytes)
    response = client.audio.transcriptions.create(
        file=("speech.wav", wav_bytes, "audio/wav"),
        model="whisper-large-v3-turbo",
        response_format="text",
    )
    print("📝 TRANSCRIPT:", response)
    return response
