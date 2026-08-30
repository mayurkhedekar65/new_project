from pydantic import BaseModel, Field

# set new password schema
class SetNewPasswordSchema(BaseModel):
    user_email: str = Field(description="user email")
    user_password: str = Field(description="user new password")
