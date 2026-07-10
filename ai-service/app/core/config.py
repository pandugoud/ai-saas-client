import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_DIR = os.path.join(BASE_DIR, "data")
UPLOAD_DIR = os.path.join(DATA_DIR, "uploads")
CHROMA_DIR = os.path.join(DATA_DIR, "chroma")
CACHE_DIR = os.path.join(DATA_DIR, "cache")

for path in [DATA_DIR, UPLOAD_DIR, CHROMA_DIR, CACHE_DIR]:
    os.makedirs(path, exist_ok=True)

EMBED_MODEL = os.getenv("EMBED_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:1.5b")
USE_LOCAL_LLM = os.getenv("USE_LOCAL_LLM", "false").lower() == "true"