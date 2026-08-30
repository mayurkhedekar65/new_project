import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession,async_sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_async_engine(DATABASE_URL, echo=False)
db_session = async_sessionmaker(autoflush=False,
                          bind=engine, 
                          class_=AsyncSession, 
                          expire_on_commit=False)

Base = declarative_base()

# creates db session
async def create_db_connection():
    db = db_session()
    try:
        yield db
    except Exception as e:
        await db.rollback()
        raise e
    finally:
        await db.close()
