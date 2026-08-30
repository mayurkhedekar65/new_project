from pydantic import BaseModel, Field

# model chat schema
class ChatResponse(BaseModel):
    user: str = Field(description="user message")
    ai: str = Field(description="ai message based on user message")
