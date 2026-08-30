from pydantic import BaseModel, Field

# verify otp schema
class VerifyOtpSchema(BaseModel):
    user_email: str = Field(description="user email")
    otp: int = Field(description="otp")
