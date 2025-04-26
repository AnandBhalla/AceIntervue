# This file makes routers a proper Python package
from fastapi import APIRouter

# Create main API router
api_router = APIRouter(prefix="/api")

# Import all router modules here to add them to api_router
from .auth import router as auth_router

# Include all routers
api_router.include_router(auth_router, prefix="/auth")

__all__ = ['api_router']