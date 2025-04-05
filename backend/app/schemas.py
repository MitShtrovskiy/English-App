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

    model_config = {
        "from_attributes": True
    }