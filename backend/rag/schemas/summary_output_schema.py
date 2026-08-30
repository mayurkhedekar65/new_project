from pydantic import BaseModel, Field

# blood report summary schema
class ReportSummaryOutput(BaseModel):
    summary: str = Field(
        description="summary about the blood report"
    )

    key_findings: list[str] = Field(
        default_factory=list,
        description="important findings from the blood report"
    )

    recommendations: list[str] = Field(
        default_factory=list,
        description="recommendations based on the blood report findings"
    )

    follow_up: list[str] = Field(
        default_factory=list,
        description="important follow-up actions or tests"
    )