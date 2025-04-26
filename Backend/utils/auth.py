from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from bson import ObjectId
from typing import Dict, Any
from motor.motor_asyncio import AsyncIOMotorDatabase

from database import get_db
from config import settings
import models
from .security import create_access_token

# OAuth2 setup with correct token URL
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

async def verify_token(token: str):
    """
    Verify the JWT token and extract user_id
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("user_id")
        
        if user_id is None:
            raise credentials_exception
            
        return models.TokenData(id=user_id)
    except JWTError:
        raise credentials_exception

async def get_current_user(
    token: str = Depends(oauth2_scheme), 
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> Dict[str, Any]:
    """
    Get the current authenticated user from the database
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token_data = await verify_token(token)
    
    try:
        user = await db.users.find_one({"_id": ObjectId(token_data.id)})
        if user is None:
            raise credentials_exception
        return user
    except Exception:
        raise credentials_exception