from fastapi import APIRouter, HTTPException
from typing import List
from models import InterviewResponse  # your Pydantic response model
from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from database import get_db

router = APIRouter()

router = APIRouter(tags=["Profile"])

@router.get("/{user_id}", response_model=List[InterviewResponse])
async def get_user_interviews(user_id: str,db: AsyncIOMotorDatabase = Depends(get_db)):
    # Query all interviews where "user" field matches user_id
    interviews_cursor = db.interviews.find({"user": user_id})

    interviews = []
    async for interview in interviews_cursor:
        interviews.append({
            "techStack": interview.get("techStack"),
            "domain": interview.get("domain"),
            "result": interview.get("result")
        })
    # print(interviews[0])
    return interviews
