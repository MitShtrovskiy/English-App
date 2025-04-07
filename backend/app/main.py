from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import words  # Роутер с эндпоинтами /words
from app.database import SessionLocal
from app import models

app = FastAPI()

# ✅ Разрешаем доступ фронтенду
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # локальная разработка
        "https://english-app-nine.vercel.app",  # твой Vercel домен
        "https://english-app-git-main-mitshtrovskiy-projects.vercel.app"  # fallback домен для других deploy preview
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Добавляем заголовок с кодировкой
@app.middleware("http")
async def add_charset_header(request, call_next):
    response = await call_next(request)
    response.headers["Content-Type"] = "application/json; charset=utf-8"
    return response

# ✅ Подключаем роуты
app.include_router(words.router)


# === 📦 Демо-слова при запуске сервера ===
def seed_words():
    db = SessionLocal()

    if db.query(models.Word).first():
        db.close()
        return  # если уже есть слова — не заполняем

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


# ✅ Выполняем при запуске сервера
@app.on_event("startup")
def on_startup():
    seed_words()