import os
import jwt
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from jwt import InvalidKeyError
from sql.models.user_model import User
from db.db_connection import create_db_connection
from sqlalchemy import select

load_dotenv()
SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = "HS256"

# creates jwt token
def create_token(data: dict):
    payload = data.copy()
    payload["exp"] = datetime.now(timezone.utc)+timedelta(hours=1)
    token =  jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

oauth2scheme = OAuth2PasswordBearer(tokenUrl="login")

# get's the current loggedIn user
async def get_current_user(token: str = Depends(oauth2scheme), db: AsyncSession = Depends(create_db_connection)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        user_query = await db.execute(select(User).where(User.email == email))
        is_user = user_query.mappings().first()
        if is_user is not None:
            user = is_user["User"]
            return user
    except Exception as e:
        print(e)
        raise HTTPException(status_code=401)
