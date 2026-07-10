from sentence_transformers import SentenceTransformer

from app.core.config import EMBED_MODEL
from app.db.vector_store import get_collection

embedder = SentenceTransformer(EMBED_MODEL)

def retrieve_context(question: str, bot_id: str, top_k: int = 3):
    collection = get_collection(bot_id)
    q_emb = embedder.encode([question]).tolist()[0]

    results = collection.query(
        query_embeddings=[q_emb],
        n_results=top_k
    )

    docs = results.get("documents", [[]])[0]
    metas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0] if results.get("distances") else []

    sources = []
    for i, meta in enumerate(metas):
        sources.append({
            "source": meta.get("source"),
            "chunkIndex": meta.get("chunkIndex"),
            "distance": distances[i] if i < len(distances) else None
        })

    return docs, sources