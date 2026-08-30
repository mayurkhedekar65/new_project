import os
from dotenv import load_dotenv
from redis.asyncio import Redis

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL")

# redis connection
def redis_connection():
    connection = Redis.from_url(REDIS_URL or "redis://localhost:6379")
    return connection