from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime
from jose import JWTError, jwt
from database import get_db
from config import settings
import models
from utils.security import create_access_token, verify_password, get_password_hash
from utils.email import send_verification_email
from utils.auth import get_current_user

router = APIRouter(tags=["Authentication"])

# signup route
@router.post("/signup", response_model=models.UserOut, status_code=status.HTTP_201_CREATED)
async def create_user(user: models.UserCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    hashed_password = await get_password_hash(user.password)

    user_dict = user.dict()
    user_dict.update({
        "password": hashed_password,
        "created_at": datetime.utcnow(),
        "is_verified": False,
        "model": models.UserModel.free
    })

    result = await db.users.insert_one(user_dict)

    if not result.acknowledged:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )

    created_user = await db.users.find_one({"_id": result.inserted_id})

    access_token = create_access_token(data={"user_id": str(created_user["_id"])})

    email_sent = await send_verification_email(user.email, access_token)
    if not email_sent:
        pass

    user_data = {
        "_id": str(created_user["_id"]),
        "email": created_user["email"],
        "name": created_user["name"],
        "model": created_user.get("model", "free"),
        "is_verified": created_user["is_verified"],
        "created_at": created_user["created_at"]
    }

    return models.UserOut(**user_data)

# login route
@router.post("/login", response_model=models.Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = await db.users.find_one({"email": form_data.username})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    if not await verify_password(form_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    if not user.get("is_verified", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified"
        )
    
    user_id = str(user["_id"])
    access_token = create_access_token(data={"user_id": user_id})
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user_id": user_id,
    }

# email verification route
@router.get("/verify-email")
async def verify_email(token: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("user_id")
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid verification token"
            )
        
        result = await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"is_verified": True}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User not found or already verified"
            )
        
        return {"message": "Email verified successfully"}
        
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token"
        )

# resend verification route
@router.post("/resend-verification")
async def resend_verification(email: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    user = await db.users.find_one({"email": email})
    
    if not user:
        return {"message": "If your email is registered, a verification link has been sent"}
    
    if user.get("is_verified", False):
        return {"message": "Email is already verified"}
    
    access_token = create_access_token(data={"user_id": str(user["_id"])})
    
    await send_verification_email(email, access_token)
    
    return {"message": "Verification email sent"}


# current user route
@router.get("/me", response_model=models.UserOut)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    user_data = {
        "_id": str(current_user["_id"]),
        "email": current_user["email"],
        "name": current_user["name"],
        "model": current_user.get("model", "free"),
        "is_verified": current_user.get("is_verified", False),
        "created_at": current_user["created_at"]
    }
    
    return models.UserOut(**user_data)


