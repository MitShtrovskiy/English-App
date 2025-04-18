from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    
    words = relationship("Word", back_populates="owner")  # 🔁 связь с Word

class Word(Base):
    __tablename__ = "words"
    
    id = Column(Integer, primary_key=True, index=True)
    word = Column(String, index=True)
    translation = Column(String)
    transcription = Column(String)
    example = Column(String)
    learned = Column(Boolean, default=False)
    
    user_id = Column(Integer, ForeignKey("users.id"))  # 🔐 привязка к пользователю
    owner = relationship("User", back_populates="words")
    