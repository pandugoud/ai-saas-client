import os
import shutil
from fastapi import APIRouter, UploadFile, File, Form
from app.core.config import UPLOAD_DIR
from app.services.ingestion import ingest_document

router = APIRouter()

@router.post("/train")
def train_document(
    file: UploadFile = File(...),
    botId: str = Form(...),
    userId: str = Form(default="")
):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = ingest_document(file_path, botId, userId)
    return result