from pydantic import BaseModel
from typing import Optional


class WordBase(BaseModel):
    word: str
    transcription: Optional[str] = ""
    translation: Optional[str] = ""
    example: Optional[str] = ""


# ✅ Схема для создания нового слова (используется в POST)
class WordCreate(WordBase):
    learned: bool = False


# ✅ Схема для обновления слова целиком (используется в PUT)
class WordUpdateFull(BaseModel):
    word: str
    translation: str
    transcription: Optional[str] = ""
    example: str
    learned: bool


# ✅ Схема для обновления только статуса выучено (используется в PATCH)
class WordUpdate(BaseModel):
    learned: bool


# ✅ Схема для вывода (используется в GET)
class WordOut(WordBase):
    id: int
    learned: bool

    model_config = {
        "from_attributes": True
    }