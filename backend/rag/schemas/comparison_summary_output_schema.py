from pydantic import BaseModel, Field

# blood report comparison summary schema
class ReportComparisonOutput(BaseModel):
    summary: str = Field(
        description="summary of the changes between the latest and previous reports."
    )

    key_changes: list[str] = Field(
        default_factory=list,
        description="important changes between the two reports."
    )

    recommendations: list[str] = Field(
        default_factory=list,
        description="recommendations based on the report comparison."
    )

    follow_up: list[str] = Field(
        default_factory=list,
        description="important follow-up actions or tests."
    )