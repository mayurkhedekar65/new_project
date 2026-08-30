from sqlalchemy import Column, Integer, Text, ForeignKey
from sqlalchemy.orm import Relationship
from db.db_connection import Base


# chat model
class Chats(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id",
                   ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    file_id = Column(
        Integer,
        ForeignKey("uploaded_files.id",
                   ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    user_msg = Column(Text, nullable=False)
    ai_msg = Column(Text, nullable=False)

    user = Relationship(
        "User",
        back_populates="chats"
    )

    uploaded_files = Relationship(
        "UploadedFile",
        back_populates="chats"
    )
