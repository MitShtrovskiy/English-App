from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
import csv, codecs
from app.database import SessionLocal, engine
from app import models, schemas
from app.auth import get_current_user  # ✅ Добавили зависимость текущего пользователя
from app.models import User  # ✅ Для типизации

models.Base.metadata.create_all(bind=engine)

router = APIRouter(prefix="/words", tags=["words"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ✅ Получить все слова, принадлежащие текущему пользователю
@router.get("/", response_model=list[schemas.WordOut])
def get_words(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # ⬅️ Только авторизованные пользователи
):
    return db.query(models.Word).filter(models.Word.user_id == current_user.id).all()

# ✅ Получить одно слово (только своё)
@router.get("/{word_id}", response_model=schemas.WordOut)
def get_word(
    word_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    word = db.query(models.Word).filter(
        models.Word.id == word_id,
        models.Word.user_id == current_user.id
    ).first()
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")
    return word

# ✅ Обновить статус "выучено" (только своё)
@router.patch("/{word_id}", response_model=schemas.WordOut)
def update_status(
    word_id: int,
    update: schemas.WordUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    word = db.query(models.Word).filter(
        models.Word.id == word_id,
        models.Word.user_id == current_user.id
    ).first()
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")
    word.learned = update.learned
    db.commit()
    return word

# ✅ Удалить слово (только своё)
@router.delete("/{word_id}")
def delete_word(
    word_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    word = db.query(models.Word).filter(
        models.Word.id == word_id,
        models.Word.user_id == current_user.id
    ).first()
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")
    db.delete(word)
    db.commit()
    return {"detail": "Word deleted"}

# ✅ Добавить новое слово, привязав к пользователю
@router.post("/", response_model=schemas.WordOut)
def create_word(
    word: schemas.WordCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = db.query(models.Word).filter(
        models.Word.word == word.word,
        models.Word.user_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Такое слово уже есть.")
    new_word = models.Word(**word.dict(), user_id=current_user.id)  # ⬅️ Добавили user_id
    db.add(new_word)
    db.commit()
    db.refresh(new_word)
    return new_word

# ✅ Обновить слово (только своё)
@router.put("/{word_id}", response_model=schemas.WordOut)
def update_word(
    word_id: int,
    update: schemas.WordUpdateFull,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    word = db.query(models.Word).filter(
        models.Word.id == word_id,
        models.Word.user_id == current_user.id
    ).first()
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")
    for field, value in update.dict().items():
        setattr(word, field, value)
    db.commit()
    db.refresh(word)
    return word

# ✅ Загрузить CSV — только новые слова, сохранить user_id
@router.post("/upload-csv")
def upload_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if file.content_type != 'text/csv':
        raise HTTPException(status_code=400, detail="Invalid file type")
    reader = csv.DictReader(codecs.iterdecode(file.file, 'utf-8'))
    for row in reader:
        # Проверка дубликатов для текущего пользователя
        existing = db.query(models.Word).filter(
            models.Word.word == row["word"],
            models.Word.user_id == current_user.id
        ).first()
        if not existing:
            word = models.Word(**row, user_id=current_user.id)
            db.add(word)
    db.commit()
    return {"detail": "CSV successfully uploaded"}
