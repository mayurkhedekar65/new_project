from pydantic import BaseModel

# text request model
class TextRequest(BaseModel):
    text: str
    num_of_questions:str