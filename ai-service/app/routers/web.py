from fastapi import APIRouter
from pydantic import BaseModel
from app.services.web_search import duckduckgo_search

router = APIRouter()

class WebQuery(BaseModel):
    query: str

@router.post("/search")
def search_web(payload: WebQuery):
    results = duckduckgo_search(payload.query)

    if not results:
        return {
            "success": True,
            "answer": f"No strong web results found for: {payload.query}",
            "results": []
        }

    top = results[0]
    answer = top.get("snippet") or f"Top result found for: {payload.query}"

    return {
        "success": True,
        "answer": answer,
        "results": results
    }