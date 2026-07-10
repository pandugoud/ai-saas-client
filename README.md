# AI Chatbot SaaS - Local First

A local-first AI chatbot SaaS starter built with:

- React + Vite frontend
- Node.js + Express gateway
- FastAPI AI service
- ChromaDB vector store
- Sentence Transformers embeddings
- Optional Ollama local LLM
- DuckDuckGo no-key web search

## Features

- Upload PDF, TXT, DOCX
- Ask questions from uploaded docs
- Lightweight web search
- Local-first architecture
- Optional local LLM generation via Ollama

## Project Structure

- `client/` - React frontend
- `server/` - Node gateway
- `ai-service/` - FastAPI AI engine

## Run

### 1. Start AI service
```bash
cd ai-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 2. Start Node gateway
```bash
cd server
npm install
npm run dev
```

### 3. Start React frontend
```bash
cd client
npm install
npm run dev
```

## Optional Ollama

Install Ollama, pull a small model, then set:

```env
USE_LOCAL_LLM=true
OLLAMA_MODEL=qwen2.5:1.5b
OLLAMA_BASE_URL=http://localhost:11434
```

Example:
```bash
ollama pull qwen2.5:1.5b
```

## Notes

- Best for local development first
- For low-end hardware, keep `USE_LOCAL_LLM=false`
- Move inference to stronger hardware for production