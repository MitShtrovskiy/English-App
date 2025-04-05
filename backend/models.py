from sqlalchemy import Column, Integer, String, Boolean
from database import Base

class Word(Base):
    __tablename__ = "words"

    id = Column(Integer, primary_key=True, index=True)
    word = Column(String, unique=True, index=True)
    transcription = Column(String)
    translation = Column(String)
    example = Column(String)
    learned = Column(Boolean, default=False)
