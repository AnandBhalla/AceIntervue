from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from database import get_db
from models import QnARequest, QnAResponse
from utils.generate_qna import generate_qna
from bson import ObjectId
import traceback
from typing import List
import time

router = APIRouter(tags=["QnA"])

@router.post("/", response_model=QnAResponse)
async def generate_qna_from_input(
    data: QnARequest,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    PROCESS_START = time.time()
    try:
        # ===== [1] Input Validation =====
        print(f"\n[1/{time.time()-PROCESS_START:.2f}s] Validating input...")
        if not all([data.domain, data.techStack, data.user]):
            raise HTTPException(422, "Missing required fields")
        if len(data.techStack) == 0:
            raise HTTPException(422, "Tech stack cannot be empty")
        if data.questionCount <= 0 or data.questionCount > 20:
            raise HTTPException(422, "Question count must be 1-20")

        # ===== [2] Generate QnA =====
        print(f"[2/{time.time()-PROCESS_START:.2f}s] Generating QnA...")
        try:
            questions, answers = await generate_qna(data)
            if len(questions) != data.questionCount:
                raise HTTPException(422, f"Expected {data.questionCount} questions, got {len(questions)}")
        except Exception as e:
            print(f"Generation failed: {traceback.format_exc()}")
            raise HTTPException(422, f"QnA generation failed: {str(e)}")

        # ===== [3] Database Operations =====
        print(f"[3/{time.time()-PROCESS_START:.2f}s] Saving to DB...")
        interview_doc = {
            "userid": data.user,
            "questions": questions,
            "answers": answers,
            "candanswers": [""] * len(questions),
            "result": {},
            "questionCount": data.questionCount,
            "createdAt": time.time()
        }
        
        try:
            result = await db.interviews.insert_one(interview_doc)
            print(f"Inserted ID: {result.inserted_id}")
        except Exception as e:
            print(f"DB Error: {traceback.format_exc()}")
            raise HTTPException(500, "Database operation failed")

        # ===== [4] Return Response =====
        print(f"[4/{time.time()-PROCESS_START:.2f}s] Returning response")
        return {
            "questions": questions,
            "answers": answers,
            "interviewId": str(result.inserted_id)
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error: {traceback.format_exc()}")
        raise HTTPException(500, "Internal server error")