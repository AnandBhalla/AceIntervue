from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from contextlib import asynccontextmanager

from database import connect_db, ping_server
from config import settings
from routers import api_router  # Import the main API router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for FastAPI app startup and shutdown events
    """
    # Startup
    try:
        # Connect to the database
        logger.info("Connecting to MongoDB...")
        await connect_db()
        
        # Check the connection
        if not await ping_server():
            logger.error("Failed to connect to MongoDB")
            raise RuntimeError("Failed to connect to MongoDB")
        
        logger.info("Connected to MongoDB successfully")
        yield
    except Exception as e:
        logger.error(f"Startup error: {str(e)}")
        raise
    
    # Shutdown
    finally:
        logger.info("Application shutting down")

# Initialize FastAPI app
app = FastAPI(
    title="InterVue API",
    description="Backend API for InterVue application",
    version="0.1.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router)

@app.get("/")
async def root():
    """
    Root endpoint for health check
    """
    return {
        "status": "online",
        "message": "Welcome to the InterVue API",
        "version": "0.1.0"
    }