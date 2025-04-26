from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
import models
from database import get_db

router = APIRouter(tags=["Domains"])

@router.get("/", response_model=List[models.Domain])
async def get_all_domains(db: AsyncIOMotorDatabase = Depends(get_db)):
    """
    Get all available domains
    """
    domains_cursor = db.domains.find()
    domains = []
    async for domain in domains_cursor:
        domain["_id"] = str(domain["_id"])
        # Fix field name mismatch
        domain["techStacks"] = domain.pop("techstack")
        domains.append(models.Domain(**domain))
    
    return domains
