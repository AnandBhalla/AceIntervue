from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from database import get_db
from utils import evaluate
from models import EvaluateReq, EvaluateRes

router = APIRouter(tags=["Evaluation"])

@router.post("/", response_model=EvaluateRes)
async def evaluate_candidate(
    data: EvaluateReq,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    result = await evaluate(data.dict())

    await db.interviews.insert_one({
        "questions": data.questions,
        "answers": data.answers,
        "candanswers": data.candidateAnswers,
        "techStack": data.techStack,
        "domain": data.domain,
        "user": data.user,
        "result": result
    })

    return {"results": result}
