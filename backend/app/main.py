from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import words  # Роутер с эндпоинтами /words
from app.database import SessionLocal
from app import models

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Добавим CORS и заголовки
# CORS: разрешаем фронту обращаться к API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_charset_header(request, call_next):
    response = await call_next(request)
    response.headers["Content-Type"] = "application/json; charset=utf-8"
    return response


# Подключаем роутер
app.include_router(words.router)


# === Тестовые данные ===
def seed_words():
    db = SessionLocal()

    if db.query(models.Word).first():
        db.close()
        return  # уже есть данные

    sample_words = [
        {
            "word": "affectionate",
            "transcription": "[əˈfekʃənət]",
            "translation": "ласковый",
            "example": "She is very affectionate with children.",
            "learned": False,
        },
        {
            "word": "ambitious",
            "transcription": "[æmˈbɪʃəs]",
            "translation": "амбициозный",
            "example": "He's an ambitious young man.",
            "learned": False,
        },
        {
            "word": "honest",
            "transcription": "[ˈɒnɪst]",
            "translation": "честный",
            "example": "She's very honest about her feelings.",
            "learned": True,
        },
        {
            "word": "organized",
            "transcription": "[ˈɔːɡənaɪzd]",
            "translation": "организованный",
            "example": "She's very organized at work.",
            "learned": True,
        },
    ]

    for data in sample_words:
        db.add(models.Word(**data))

    db.commit()
    db.close()


# Выполняем при запуске сервера
@app.on_event("startup")
def on_startup():
    seed_words()