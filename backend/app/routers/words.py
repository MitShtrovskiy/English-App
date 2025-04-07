from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
import csv, codecs
from database import SessionLocal, engine
from app import models, schemas

models.Base.metadata.create_all(bind=engine)

router = APIRouter(prefix="/words", tags=["words"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ✅ Получить все слова
@router.get("", response_model=list[schemas.WordOut]) # ⬅️ убрали слэш
def get_words(db: Session = Depends(get_db)):
    return db.query(models.Word).all()

# ✅ Получить одно слово по ID
@router.get("/{word_id}", response_model=schemas.WordOut)
def get_word(word_id: int, db: Session = Depends(get_db)):
    word = db.query(models.Word).filter(models.Word.id == word_id).first()
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")
    return word

# ✅ Обновить статус "выучено"
@router.patch("/{word_id}", response_model=schemas.WordOut)
def update_status(word_id: int, update: schemas.WordUpdate, db: Session = Depends(get_db)):
    word = db.query(models.Word).filter(models.Word.id == word_id).first()
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")
    word.learned = update.learned
    db.commit()
    return word

# ✅ Удалить слово
@router.delete("/{word_id}")
def delete_word(word_id: int, db: Session = Depends(get_db)):
    word = db.query(models.Word).get(word_id)
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")
    db.delete(word)
    db.commit()
    return {"detail": "Word deleted"}

@router.put("/{word_id}", response_model=schemas.WordOut)
def update_word(word_id: int, update: schemas.WordUpdateFull, db: Session = Depends(get_db)):
    word = db.query(models.Word).filter(models.Word.id == word_id).first()
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")
        
    for field, value in update.dict().items():
        setattr(word, field, value)
        
    db.commit()
    db.refresh(word)
    return word

# ✅ Загрузить CSV со словами
@router.post("/upload-csv")
def upload_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if file.content_type != 'text/csv':
        raise HTTPException(status_code=400, detail="Invalid file type")
    reader = csv.DictReader(codecs.iterdecode(file.file, 'utf-8'))
    for row in reader:
        word = models.Word(**row)
        db.add(word)
    db.commit()
    return {"detail": "CSV successfully uploaded"}