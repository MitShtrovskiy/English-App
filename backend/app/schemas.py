from pydantic import BaseModel

class WordBase(BaseModel):
    text: str
    transcription: str
    translation: str
    example: str
    is_learned: bool = False

class WordCreate(WordBase):
    pass

class Word(WordBase):
    id: int

    class Config:
        from_attributes = True