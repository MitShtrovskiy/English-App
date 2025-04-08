from pydantic import BaseModel
from typing import Optional

class WordBase(BaseModel):
    word: str
    transcription: Optional[str] = ""
    translation: str
    example: str

class WordCreate(WordBase):
    learned: bool = False  # ⬅️ обязательно, иначе FastAPI даст 422

    
class WordUpdateFull(BaseModel):
    word: str
    translation: str
    transcription: Optional[str] = ""
    example: str
    learned: bool
    
class WordUpdate(BaseModel):
    learned: bool

class WordOut(WordBase):
    id: int
    learned: bool

    model_config = {
        "from_attributes": True
    }