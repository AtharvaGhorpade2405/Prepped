from fastapi import WebSocket
import json

async def send_event(ws: WebSocket, payload: dict):
    await ws.send_text(json.dumps(payload))
