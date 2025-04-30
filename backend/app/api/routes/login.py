from datetime import datetime, timedelta
from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordRequestForm
from starlette.responses import Response

from app.api.deps import RedisSessionDep, SessionDep
from app.core import security
from app.core.config import settings
from app.crud import users as crud
from app.schemas.user import UserCreateOpen, UserOut, UserPublicOutShort
from app.schemas.utils import Message
from app.utils import send_verification_code, validate_phone

router = APIRouter()


@router.post("/login/code", response_model=UserPublicOutShort)
async def get_sms_code(
    session: SessionDep, user_in: UserCreateOpen, redis: RedisSessionDep
) -> Any:
    user_phone = validate_phone(user_in.phone)
    user = crud.get_user_by_phone(session=session, phone=user_phone)

    if user and not user.is_active:
        raise HTTPException(status_code=400, detail="User not found")

    code = send_verification_code(user_phone)
    if not code:
        raise HTTPException(status_code=400, detail="Can not send code")

    await crud.set_verification(
        user_phone,
        code,
        expiration=datetime.now()
        + timedelta(minutes=settings.security.VERIFICATION_CODE_EXPIRE_MINUTES),
        redis=redis,
    )

    if not user:
        return UserPublicOutShort(phone=user_phone)
    return UserPublicOutShort.model_validate(
        user,
        update={
            "profile_image": user.profile_image
            if getattr(user.profile_image, "is_active", None)
            else None,
        },
    )


@router.post("/login", response_model=UserOut)
async def login(
    session: SessionDep,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    response: Response,
    request: Request,
    redis: RedisSessionDep,
) -> Any:
    user = await crud.authenticate(
        session=session,
        phone=validate_phone(form_data.username),
        code=form_data.password,
        redis=redis,
    )
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect phone or code")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="User not found")

    security.set_cookie_session(request, response, user)
    return UserOut.model_validate(
        user,
        update={
            "profile_image": user.profile_image
            if getattr(user.profile_image, "is_active", None)
            else None,
        },
    )


@router.post("/logout/", response_model=Message)
def logout(request: Request, response: Response) -> Any:
    security.delete_cookie_session(request, response)
    return Message(message="Logged out")
