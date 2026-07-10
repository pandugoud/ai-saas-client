from app.core.config import USE_LOCAL_LLM
from app.core.ollama_client import generate_with_ollama

def answer_question(question: str, docs: list[str]):
    if not docs:
        return "I could not find relevant information in the uploaded documents."

    context = "\n\n".join(docs[:3])

    if not USE_LOCAL_LLM:
        return f"Relevant content from your documents:\n\n{context[:1400]}"

    prompt = f"""
You are a helpful multilingual AI assistant.
Answer only from the provided context.
If the context is insufficient, say you do not know.

Question:
{question}

Context:
{context}

Answer:
""".strip()

    return generate_with_ollama(prompt)