from sqlalchemy.orm import Session
from app import models, schemas

def get_words(db: Session):
    return db.query(models.Word).all()

def create_word(db: Session, word: dict):
    db_word = models.Word(**word)
    db.add(db_word)
    db.commit()
    db.refresh(db_word)
    return db_word