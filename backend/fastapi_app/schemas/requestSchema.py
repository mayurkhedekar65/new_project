from pydantic import BaseModel


class TextRequest(BaseModel):
    text: str
    num_of_questions:str