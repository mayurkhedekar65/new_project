from pydantic import BaseModel, Field

# reset mail schema
class ResetMailSchema(BaseModel):
    user_email: str = Field(description="user email")
