import io
import wave

def pcm_to_wav_bytes(pcm_bytes: bytes, sample_rate=16000) -> bytes:
    buf = io.BytesIO()
    with wave.open(buf, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(pcm_bytes)
    return buf.getvalue()

def resample_pcm(pcm_bytes: bytes, src_rate: int, target_rate: int = 16000) -> bytes:
    from scipy.signal import resample_poly
    import numpy as np

    audio = np.frombuffer(pcm_bytes, dtype=np.int16)
    audio = audio.astype(np.float32) / 32768.0
    audio_resampled = resample_poly(audio, target_rate, src_rate)
    audio_resampled = (np.clip(audio_resampled, -1.0, 1.0) * 32768).astype(np.int16)

    return bytes(audio_resampled)
