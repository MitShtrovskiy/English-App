from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base

class Word(Base):
    __tablename__ = "words"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, index=True)
    transcription = Column(String)
    translation = Column(String)
    example = Column(String)
    is_learned = Column(Boolean, default=False)