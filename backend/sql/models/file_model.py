from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import Relationship
from db.db_connection import Base


# file model
class UploadedFile(Base):
    __tablename__ = "uploaded_files"

    id = Column(
        Integer,
        primary_key=True,
        autoincrement=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id",
                   ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    file_name = Column(
        String,
        nullable=False
    )

    file_path = Column(
        String,
        nullable=False
    )

    upload_date = Column(
        Date,
        nullable=False
    )

    user = Relationship(
        "User",
        back_populates="uploaded_files"
    )

    report = Relationship(
        "ReportDetails",
        back_populates="uploaded_files",
        cascade="all, delete"
    )

    chats = Relationship(
        "Chats",
        back_populates="uploaded_files",
        cascade="all, delete"
    )
