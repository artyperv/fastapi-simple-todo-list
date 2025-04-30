from redis import asyncio as aioredis
from sqlmodel import create_engine

from app.core.config import settings

engine = create_engine(str(settings.MAIN_DATABASE_URI))

redis_db = aioredis.from_url(settings.REDIS_DATABASE_URI, decode_responses=True)
