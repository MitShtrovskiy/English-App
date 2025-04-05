from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
import csv, codecs
from database import SessionLocal, engine
import models, schemas

models.Base.metadata.create_all(bind=engine)

router = APIRouter(prefix="/words", tags=["words"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[schemas.WordOut])
def get_words(db: Session = Depends(get_db)):
    return db.query(models.Word).all()

@router.patch("/{word_id}", response_model=schemas.WordOut)
def update_status(word_id: int, update: schemas.WordUpdate, db: Session = Depends(get_db)):
    word = db.query(models.Word).filter(models.Word.id == word_id).first()
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")
    word.learned = update.learned
    db.commit()
    return word

@router.delete("/{word_id}")
def delete_word(word_id: int, db: Session = Depends(get_db)):
    word = db.query(models.Word).get(word_id)
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")
    db.delete(word)
    db.commit()
    return {"detail": "Word deleted"}

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

@router.post("/upload-csv-test")
def upload_csv_test(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Нужен CSV-файл")
        
    return {"detail": f"Файл '{file.filename}' успешно получен"}