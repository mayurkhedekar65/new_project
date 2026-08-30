from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import Relationship
from db.db_connection import Base


# user model
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    gender = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    password = Column(String, nullable=False)

    uploaded_files = Relationship(
        "UploadedFile",
        back_populates="user",
        cascade="all, delete"
    )

    report_comparisons = Relationship(
        "ReportComparison",
        back_populates="user",
        cascade="all, delete"
    )

    chats = Relationship(
        "Chats",
        back_populates="user",
        cascade="all, delete"
    )
