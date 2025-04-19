from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, words
from app.database import SessionLocal
from app import models

app = FastAPI()

# ✅ 1. CORS Middleware — строго до роутеров!
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # на проде лучше указать конкретный фронт
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ 2. Установка заголовка charset (опционально)
@app.middleware("http")
async def add_charset_header(request, call_next):
    response = await call_next(request)
    response.headers["Content-Type"] = "application/json; charset=utf-8"
    return response

# ✅ 3. Подключение роутеров
app.include_router(auth.router)
app.include_router(words.router)

# === Тестовые слова ===
def seed_words():
    db = SessionLocal()
    if db.query(models.Word).first():
        db.close()
        return

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

@app.on_event("startup")
def on_startup():
    seed_words()
