from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from database import get_db
from utils import evaluate
from utils.auth import get_current_user
from bson import ObjectId

router = APIRouter(tags=["Evaluation"])

@router.post("/", response_model=dict)
async def evaluate_candidate(
    data: dict,
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    # Evaluate answers
    result = await evaluate(data)

    # Update latest interview document for the user
    update_result = await db.interviews.find_one_and_update(
        {"userid": str(current_user["_id"])},
        {"$set": {
            "candanswers": data.get("candidateAnswers", []),
            "result": result
        }},
        sort=[("_id", -1)],  # Most recent interview
        return_document=True
    )

    if not update_result:
        raise HTTPException(status_code=404, detail="Interview not found for the user")

    return {"message": "Evaluation completed and saved", "result": result}
