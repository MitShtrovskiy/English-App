from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, SessionLocal
from app import models, crud
import json
from pathlib import Path

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

# Добавим слова из JSON при старте, если БД пуста
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