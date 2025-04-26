import logging
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from config import settings
import certifi
import ssl
from typing import Optional

# Initialize the client connection
client: Optional[AsyncIOMotorClient] = None
db: Optional[AsyncIOMotorDatabase] = None

logger = logging.getLogger(__name__)

async def connect_db() -> AsyncIOMotorDatabase:
    """
    Connect to MongoDB and return database instance
    """
    global client, db
    
    try:
        # Create SSL context with certificate verification
        ssl_context = ssl.create_default_context(cafile=certifi.where())
        
        # Create MongoDB client
        client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            tls=True,
            tlsCAFile=certifi.where(),
            connectTimeoutMS=10000,
            socketTimeoutMS=30000,
            serverSelectionTimeoutMS=10000
        )
        
        # Get database
        db = client[settings.MONGODB_DB_NAME]
        
        logger.info("MongoDB client initialized")
        return db
    
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {str(e)}")
        raise

async def ping_server() -> bool:
    """
    Test MongoDB connection by sending a ping command
    """
    try:
        if not client:
            await connect_db()
        
        await client.admin.command('ping')
        logger.info("MongoDB connection successful!")
        return True
    
    except Exception as e:
        logger.error(f"MongoDB connection failed: {str(e)}")
        return False

def get_db() -> AsyncIOMotorDatabase:
    """
    Get database instance
    """
    if db is None:
        raise RuntimeError("Database not initialized. Call connect_db() first.")
    return db