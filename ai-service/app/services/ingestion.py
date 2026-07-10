import os
import uuid
from sentence_transformers import SentenceTransformer

from app.core.config import EMBED_MODEL
from app.db.vector_store import get_collection
from app.utils.file_parsers import extract_text
from app.utils.chunking import chunk_text

embedder = SentenceTransformer(EMBED_MODEL)

def ingest_document(file_path: str, bot_id: str, user_id: str = ""):
    text = extract_text(file_path)

    if not text:
        return {"success": False, "message": "No text extracted from file"}

    chunks = chunk_text(text)
    if not chunks:
        return {"success": False, "message": "No chunks created from file"}

    embeddings = embedder.encode(chunks).tolist()
    ids = [str(uuid.uuid4()) for _ in chunks]

    metadatas = []
    for idx, _ in enumerate(chunks):
        meta = {
            "botId": str(bot_id),
            "source": os.path.basename(file_path),
            "chunkIndex": idx
        }
        if user_id:
            meta["userId"] = str(user_id)
        metadatas.append(meta)

    collection = get_collection(bot_id)
    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=metadatas
    )

    return {
        "success": True,
        "message": "Document indexed successfully",
        "chunks": len(chunks),
        "filename": os.path.basename(file_path)
    }