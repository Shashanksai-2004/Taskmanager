import logging
from motor.motor_asyncio import AsyncIOMotorClient
from app.config.settings import settings

logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_helper = Database()

def connect_db():
    try:
        db_helper.client = AsyncIOMotorClient(settings.MONGO_URI)
        # Extract database name from URI, default to 'taskflow'
        db_name = settings.MONGO_URI.split('/')[-1].split('?')[0] or "taskflow"
        db_helper.db = db_helper.client[db_name]
        logger.info(f"Successfully connected to MongoDB database: '{db_name}'")
        print(f"Connected to MongoDB Atlas: '{db_name}'")
    except Exception as e:
        logger.error(f"Error connecting to MongoDB: {e}")
        raise e

def close_db():
    if db_helper.client:
        db_helper.client.close()
        logger.info("Closed MongoDB connection")
