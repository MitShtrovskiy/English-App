from fastapi import FastAPI
from app.routers import words  # <-- проверь этот импорт

app = FastAPI()
app.include_router(words.router)