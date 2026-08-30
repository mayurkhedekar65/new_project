from sqlalchemy import Column, Integer, Text, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Relationship
from db.db_connection import Base


# comparison model
class ReportComparison(Base):
    __tablename__ = "comparisons"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id",
                   ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    previous_report_id = Column(Integer,
                                ForeignKey("report_details.id",
                                           ondelete="CASCADE"),
                                nullable=False,
                                index=True)

    new_report_id = Column(Integer,
                           ForeignKey("report_details.id",
                                      ondelete="CASCADE"),
                           nullable=False,
                           index=True)

    summary = Column(Text, nullable=False)
    key_changes = Column(JSONB, nullable=True)
    recommendations = Column(JSONB, nullable=True)
    follow_up = Column(JSONB, nullable=True)

    user = Relationship(
        "User",
        back_populates="report_comparisons"
    )
