from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from bson import ObjectId
from typing import Dict, Any
from motor.motor_asyncio import AsyncIOMotorDatabase

from database import get_db
from config import settings
import models

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

async def verify_token(token: str):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    user_id: str = payload.get("user_id")
    if user_id is None:
        raise credentials_exception
    return models.TokenData(id=user_id)

async def get_current_user(
    token: str = Depends(oauth2_scheme), 
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> Dict[str, Any]:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token_data = await verify_token(token)
    user = await db.users.find_one({"_id": ObjectId(token_data.id)})
    if user is None:
        raise credentials_exception
    return user
