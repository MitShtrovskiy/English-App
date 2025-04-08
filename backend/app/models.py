from sqlalchemy import Column, Integer, String, Boolean
from .database import Base

class Word(Base):
    __tablename__ = "words"

    id = Column(Integer, primary_key=True, index=True)
    word = Column(String, nullable=False)
    transcription = Column(String, nullable=True)
    translation = Column(String, nullable=True)
    example = Column(String, nullable=True)
    learned = Column(Boolean, default=False)