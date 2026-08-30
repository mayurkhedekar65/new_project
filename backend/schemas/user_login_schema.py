from pydantic import BaseModel, Field

# user login schema
class UserLoginSchema(BaseModel):
    email: str = Field(description="user email id")
    password: str = Field(description="user password")
