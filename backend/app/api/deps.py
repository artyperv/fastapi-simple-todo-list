from collections.abc import Generator
from typing import Annotated

from fastapi import Depends, HTTPException, Query
from redis import asyncio as aioredis
from sqlmodel import Session

from app.core.db import engine, redis_db
from app.core.security import TokenDataDep
from app.crud import common
from app.models import User
from app.schemas.utils import PageParams, TokenUser


def get_db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_db)]


def get_redis_db() -> aioredis.Redis:
    return redis_db


RedisSessionDep = Annotated[aioredis.Redis, Depends(get_redis_db)]


def get_current_user(session: SessionDep, token_data: TokenDataDep) -> User:
    user = common.get_object(session, User, token_data.id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


def get_current_token_user(token_data: TokenDataDep) -> TokenUser:
    user = TokenUser(id=token_data.id)
    return user


CurrentTokenUser = Annotated[TokenUser, Depends(get_current_token_user)]


def get_page_params(
    skip: int = Query(0, ge=0), limit: int = Query(100, ge=1)
) -> PageParams:
    return PageParams(
        skip=skip,
        limit=limit,
    )


PageParamsDep = Annotated[PageParams, Depends(get_page_params)]
