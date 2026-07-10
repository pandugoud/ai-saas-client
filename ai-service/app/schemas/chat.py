from pydantic import BaseModel

class ChatRequest(BaseModel):
    question: str
    botId: str = "default-bot"
    userId: str = ""

class ChatResponse(BaseModel):
    success: bool
    answer: str
    sources: list = []