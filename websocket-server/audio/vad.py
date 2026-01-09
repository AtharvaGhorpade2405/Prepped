import webrtcvad
from config.settings import BYTES_PER_FRAME, SAMPLE_RATE, MAX_SILENCE_FRAMES

vad = webrtcvad.Vad(2)

def process_resampled_audio(pcm16_bytes: bytes, state: dict):
    audio_buffer = state["audio_buffer"]
    speech_buffer = state["speech_buffer"]

    in_speech = state["in_speech"]
    silence_frames = state["silence_frames"]

    segments = []
    audio_buffer.extend(pcm16_bytes)

    while len(audio_buffer) >= BYTES_PER_FRAME:
        frame = bytes(audio_buffer[:BYTES_PER_FRAME])
        del audio_buffer[:BYTES_PER_FRAME]

        if vad.is_speech(frame, SAMPLE_RATE):
            if not in_speech:
                # 🔥 USER JUST STARTED SPEAKING
                state["question_asked_at"] = None
                state["reprompt_count"] = 0
                print("🎙️ User started speaking")

            speech_buffer.extend(frame)
            in_speech = True
            silence_frames = 0
        else:
            if in_speech:
                silence_frames += 1
                if silence_frames > MAX_SILENCE_FRAMES:
                    segments.append(bytes(speech_buffer))
                    speech_buffer.clear()
                    in_speech = False
                    silence_frames = 0

    state["in_speech"] = in_speech
    state["silence_frames"] = silence_frames

    return segments

def validate_transcript(transcript: str) -> bool:
    return len(transcript.split()) >= 5
