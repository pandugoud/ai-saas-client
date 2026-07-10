from pydantic import BaseModel

class TrainResponse(BaseModel):
    success: bool
    message: str
    chunks: int | None = None
    filename: str | None = None