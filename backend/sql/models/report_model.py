from sqlalchemy import Column, Integer, Float, Text, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Relationship
from db.db_connection import Base


# report model
class ReportDetails(Base):
    __tablename__ = "report_details"

    id = Column(Integer, primary_key=True, index=True)
    file_id = Column(
        Integer,
        ForeignKey("uploaded_files.id",
                   ondelete="CASCADE"),
        nullable=False,
        unique=True
    )
    extracted_text = Column(Text, nullable=True)
    summary = Column(Text, nullable=True)
    key_findings = Column(JSONB, nullable=True)
    recommendations = Column(JSONB, nullable=True)
    follow_up = Column(JSONB, nullable=True)
    hemoglobin = Column(Float, nullable=True)
    wbc_count = Column(Float, nullable=True)
    platelet_count = Column(Float, nullable=True)
    blood_sugar = Column(Float, nullable=True)
    hba1c = Column(Float, nullable=True)
    total_cholesterol = Column(Float, nullable=True)
    hdl_cholesterol = Column(Float, nullable=True)
    ldl_cholesterol = Column(Float, nullable=True)
    triglycerides = Column(Float, nullable=True)
    creatinine = Column(Float, nullable=True)
    egfr = Column(Float, nullable=True)
    ast_sgot = Column(Float, nullable=True)
    alt_sgpt = Column(Float, nullable=True)
    tsh = Column(Float, nullable=True)
    vitamin_d = Column(Float, nullable=True)

    uploaded_files = Relationship(
        "UploadedFile",
        back_populates="report"
    )
