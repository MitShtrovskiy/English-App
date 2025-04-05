from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, SessionLocal
from app import models, crud, schemas
from pathlib import Path
import json

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Создание таблиц
Base.metadata.create_all(bind=engine)

# Автозагрузка слов
@app.on_event("startup")
def populate_initial_data():
    db = SessionLocal()
    if not crud.get_words(db):
        file_path = Path(__file__).parent / "sample_words.json"
        with open(file_path, encoding="utf-8") as f:
            words = json.load(f)
            for word in words:
                crud.create_word(db, word)
    db.close()

# Проверочный маршрут
@app.get("/")
def root():
    return {"message": "Backend is working"}

# Получить список всех слов
@app.get("/words/", response_model=list[schemas.Word])
def get_all_words():
    db = SessionLocal()
    words = crud.get_words(db)
    db.close()
    return words