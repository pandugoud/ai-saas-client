from fastapi import APIRouter
from app.schemas.chat import ChatRequest
from app.services.retrieval import retrieve_context
from app.services.generation import answer_question

router = APIRouter()

@router.post("/ask")
def ask_chat(payload: ChatRequest):
    docs, sources = retrieve_context(payload.question, payload.botId)
    answer = answer_question(payload.question, docs)

    return {
        "success": True,
        "answer": answer,
        "sources": sources,
        "matchedChunks": len(docs)
    }