from pydantic import BaseModel, Field

# feedback schema
class FeedbackSchema(BaseModel):
    user_name: str = Field(description="name of the user")
    user_email: str = Field(description="email of the user")
    user_feedback: str = Field(description="user feedback")