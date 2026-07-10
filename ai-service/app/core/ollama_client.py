import requests
from app.core.config import OLLAMA_BASE_URL, OLLAMA_MODEL


def generate_with_ollama(prompt: str) -> str:
    response = requests.post(
        f"{OLLAMA_BASE_URL}/api/generate",
        json={
            "model": OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False
        },
        timeout=180
    )
    response.raise_for_status()
    data = response.json()
    return data.get("response", "").strip()


def list_ollama_models():
    response = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=60)
    response.raise_for_status()
    data = response.json()
    return data.get("models", [])