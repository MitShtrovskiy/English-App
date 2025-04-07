from pydantic import BaseModel

class WordBase(BaseModel):
    word: str
    transcription: str
    translation: str
    example: str

class WordCreate(WordBase):
    pass

class WordUpdate(BaseModel):
    learned: bool

class WordOut(WordBase):
    id: int
    learned: bool

    class Config:
        orm_mode = True

class WordUpdateFull(BaseModel):
    word: str
    translation: str
    transcription: Optional[str] = ''
    example: str
    learned: bool