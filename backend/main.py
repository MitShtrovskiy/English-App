from fastapi import FastAPI
from app.routers import words
from app.database import engine, SessionLocal
from app import models
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.include_router(words.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://english-app-nine.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Добавим тестовые слова при старте ---
def seed_words():
    db = SessionLocal()
    if db.query(models.Word).first():
        return  # уже есть данные — пропускаем

    sample_words = [
        {"word": "affectionate", "transcription": "[əˈfekʃənət]", "translation": "ласковый", "example": "She is very affectionate with children.", "learned": False},
        {"word": "ambitious", "transcription": "[æmˈbɪʃəs]", "translation": "амбициозный", "example": "He's an ambitious young man.", "learned": False},
        {"word": "honest", "transcription": "[ˈɒnɪst]", "translation": "честный", "example": "She's very honest about her feelings.", "learned": True},
        {"word": "imaginative", "transcription": "[ɪˈmædʒɪnətɪv]", "translation": "с хорошим воображением", "example": "He writes imaginative stories.", "learned": False},
        {"word": "organized", "transcription": "[ˈɔːɡənaɪzd]", "translation": "организованный", "example": "She's very organized at work.", "learned": True},
    ]

    for data in sample_words:
        db.add(models.Word(**data))
    db.commit()
    db.close()

# Вызываем при запуске
@app.on_event("startup")
def on_startup():
    seed_words()