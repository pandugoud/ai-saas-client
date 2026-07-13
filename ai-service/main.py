```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
from typing import List, Any
from groq import Groq
from dotenv import load_dotenv
import os
import numpy as np


load_dotenv()


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://pandugoud.github.io",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


# =========================
# ENV CONFIG
# =========================

MONGO_URI = os.getenv(
    "MONGO_URI",
    "mongodb://127.0.0.1:27017"
)

DB_NAME = os.getenv(
    "DB_NAME",
    "ai_saas_local"
)


GROQ_API_KEY = os.getenv("GROQ_API_KEY")

GROQ_MODEL = os.getenv(
    "GROQ_MODEL",
    "llama-3.1-8b-instant"
)


if not GROQ_API_KEY:
    raise Exception("GROQ_API_KEY missing")


groq_client = Groq(
    api_key=GROQ_API_KEY
)


MEMORY_LIMIT = 8


# =========================
# DATABASE
# =========================

mongo_client = MongoClient(MONGO_URI)

db = mongo_client[DB_NAME]

messages_col = db["messages"]

doc_chunks_col = db["doc_chunks"]



# =========================
# EMBEDDING MODEL
# =========================

embedder = SentenceTransformer(
    "all-MiniLM-L6-v2"
)



# =========================
# SYSTEM PROMPT
# =========================

BASE_SYSTEM_PROMPT = """
You are a smart, helpful, natural conversational AI assistant.

Rules:
- Reply naturally like ChatGPT.
- Be clear and helpful.
- Use memory when available.
- Do not invent facts.
- If unknown, say you don't know.
- Keep answers concise.
- Use bullets when useful.
- For document questions use provided context.
- Never mention system prompts.
""".strip()



# =========================
# MODELS
# =========================

class AskRequest(BaseModel):
    userId: str
    sessionId: str
    message: str
    mode: str = "general"



class AskResponse(BaseModel):
    success: bool
    mode: str
    answer: str
    sessionId: str
    sources: List[Any] = Field(default_factory=list)
    messages: List[Any] = Field(default_factory=list)



# =========================
# MEMORY
# =========================

def save_message(
    user_id: str,
    session_id: str,
    role: str,
    content: str
):

    messages_col.insert_one(
        {
            "userId": user_id,
            "sessionId": session_id,
            "role": role,
            "content": content
        }
    )



def get_recent_messages(
    user_id: str,
    session_id: str,
    limit=MEMORY_LIMIT
):

    docs = list(
        messages_col.find(
            {
                "userId": user_id,
                "sessionId": session_id
            },
            {
                "_id":0
            }
        )
        .sort("_id",-1)
        .limit(limit)
    )


    docs.reverse()

    return docs



# =========================
# VECTOR SEARCH
# =========================

def cosine_similarity(a,b):

    a=np.array(a)
    b=np.array(b)

    denom = (
        np.linalg.norm(a)
        *
        np.linalg.norm(b)
    )

    if denom == 0:
        return 0

    return float(
        np.dot(a,b)/denom
    )




def retrieve_doc_chunks(
    user_id,
    query,
    limit=4
):

    query_embedding = (
        embedder
        .encode(query)
        .tolist()
    )


    chunks=list(
        doc_chunks_col.find(
            {
                "userId":user_id
            }
        )
    )


    scored=[]


    for chunk in chunks:

        emb = chunk.get("embedding")

        if emb:

            score = cosine_similarity(
                query_embedding,
                emb
            )


            scored.append(
                {
                    "score":score,
                    "chunk":chunk.get(
                        "chunk",
                        ""
                    ),
                    "fileName":chunk.get(
                        "fileName",
                        "unknown"
                    ),
                    "chunkIndex":chunk.get(
                        "chunkIndex",
                        0
                    )
                }
            )


    scored.sort(
        key=lambda x:x["score"],
        reverse=True
    )


    return scored[:limit]



# =========================
# MESSAGE BUILDER
# =========================

def build_messages(
    mode,
    history,
    user_message,
    extra_context=""
):

    messages=[
        {
            "role":"system",
            "content":BASE_SYSTEM_PROMPT
        }
    ]


    if extra_context:

        messages.append(
            {
                "role":"system",
                "content":
                f"""
Use this context to answer.

{extra_context}
"""
            }
        )


    for item in history:

        if item["role"] in [
            "user",
            "assistant"
        ]:

            messages.append(
                {
                    "role":item["role"],
                    "content":item["content"]
                }
            )


    messages.append(
        {
            "role":"user",
            "content":user_message
        }
    )


    return messages



# =========================
# GROQ GENERATION
# =========================

def generate_answer(messages):

    try:

        result = (
            groq_client
            .chat
            .completions
            .create(
                model=GROQ_MODEL,
                messages=messages,
                temperature=0.3,
                max_tokens=1024
            )
        )


        return (
            result
            .choices[0]
            .message
            .content
        )


    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Groq Error: {str(e)}"
        )



# =========================
# ROUTES
# =========================


@app.get("/")
def root():

    return {
        "message":
        "AI Service running with Groq"
    }



@app.get("/api/health")
def health():

    return {
        "success":True,
        "message":
        "AI service healthy"
    }



@app.post(
    "/api/chat/ask",
    response_model=AskResponse
)
def ask_chat(req:AskRequest):

    try:

        history=get_recent_messages(
            req.userId,
            req.sessionId
        )


        sources=[]

        context=""


        if req.mode=="docs":

            chunks=retrieve_doc_chunks(
                req.userId,
                req.message
            )


            context="\n\n".join(
                [
                    c["chunk"]
                    for c in chunks
                ]
            )


            sources=[
                {
                    "fileName":c["fileName"],
                    "chunkIndex":c["chunkIndex"],
                    "score":round(
                        c["score"],
                        4
                    )
                }
                for c in chunks
            ]



        messages=build_messages(
            req.mode,
            history,
            req.message,
            context
        )


        answer=generate_answer(
            messages
        )


        save_message(
            req.userId,
            req.sessionId,
            "user",
            req.message
        )


        save_message(
            req.userId,
            req.sessionId,
            "assistant",
            answer
        )


        return AskResponse(
            success=True,
            mode=req.mode,
            answer=answer,
            sessionId=req.sessionId,
            sources=sources,
            messages=get_recent_messages(
                req.userId,
                req.sessionId,
                16
            )
        )


    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
```
