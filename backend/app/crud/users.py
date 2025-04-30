from datetime import datetime

from alembic.util import status
from redis import asyncio as aioredis
from sqlalchemy.testing.suite.test_reflection import users
from sqlmodel import Session, select

from app.core.config import settings
from app.crud import common
from app.core.security import get_code_hash, verify_code
from app.models import Todo, TodoStatus, User
from app.schemas.user import UserCreate


def get_user_by_phone(session: Session, phone: int | str) -> User | None:
    # Un active user is needed in routers/login/get_sms_code
    # Consider to change un active user registration behaviour there
    # statement = select(User).where(User.phone == int(phone), User.is_active is True)
    statement = select(User).where(User.phone == int(phone))
    session_user = session.exec(statement).first()
    return session_user


async def authenticate(
    session: Session, phone: int, code: str, redis: aioredis.Redis
) -> User | None:
    phone_key = f"verification:phone:{phone}"
    stored_code = await redis.get(phone_key)
    if not stored_code:
        return None

    if not verify_code(code, str(stored_code)):
        return None

    await redis.delete(phone_key)

    db_user = get_user_by_phone(session=session, phone=phone)
    if not db_user:
        user_create = UserCreate(phone=phone)
        db_user = common.create_object(session, User, user_create)
        if settings.content.SPAWN_GREETING_TODOS:
            common.create_object(session, Todo, Todo(title="Register in Todos", status=TodoStatus.DONE, users=[db_user], created_at=datetime.now(), modified_at=datetime.now()))
            common.create_object(session, Todo, Todo(title="Login in Todos", status=TodoStatus.DONE, users=[db_user], created_at=datetime.now(), modified_at=datetime.now()))
            common.create_object(session, Todo, Todo(title="Learn how to use Todos", status=TodoStatus.IN_PROGRESS, users=[db_user], created_at=datetime.now(), modified_at=datetime.now()))
            common.create_object(session, Todo, Todo(title="Make a new Todo", status=TodoStatus.NEW, users=[db_user], created_at=datetime.now(), modified_at=datetime.now()))
    return db_user


async def set_verification(
    phone: int, code: str, expiration: datetime, redis: aioredis.Redis
) -> None:
    await redis.set(f"verification:phone:{phone}", get_code_hash(code), exat=expiration)
