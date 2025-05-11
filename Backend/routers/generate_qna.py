from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from database import get_db
from models import QnARequest, QnAResponse
from utils.generate_qna import generate_qna
<<<<<<< HEAD
from bson import ObjectId
from typing import List
=======
>>>>>>> f24259810ef05b3e252e900de1ddc2b2ebb41f38

router = APIRouter(tags=["QnA"])

@router.post("/", response_model=QnAResponse)
async def generate_qna_from_input(
    data: QnARequest,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    if not all([data.domain, data.techStack, data.user]):
        raise HTTPException(422, "Missing required fields")
    if len(data.techStack) == 0:
        raise HTTPException(422, "Tech stack cannot be empty")
<<<<<<< HEAD
    if data.questionCount <= 0 or data.questionCount > 10:
        raise HTTPException(422, "Question count must be 1-10")
=======
    if data.questionCount <= 0 or data.questionCount > 20:
        raise HTTPException(422, "Question count must be 1-20")
>>>>>>> f24259810ef05b3e252e900de1ddc2b2ebb41f38

    questions, answers = await generate_qna(data)
    if len(questions) != data.questionCount:
        raise HTTPException(422, f"Expected {data.questionCount} questions, got {len(questions)}")

    return {
        "questions": questions,
        "answers": answers
<<<<<<< HEAD
    }
=======
    }
>>>>>>> f24259810ef05b3e252e900de1ddc2b2ebb41f38
