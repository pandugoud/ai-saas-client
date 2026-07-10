import chromadb
from app.core.config import CHROMA_DIR

client = chromadb.PersistentClient(path=CHROMA_DIR)

def get_collection(bot_id: str):
    return client.get_or_create_collection(name=f"bot_{bot_id}")