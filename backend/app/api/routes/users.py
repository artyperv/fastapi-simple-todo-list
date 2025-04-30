import io
import uuid
from typing import Any

import blurhash
from fastapi import APIRouter, HTTPException, Request, UploadFile
from PIL import Image as ImagePIL
from starlette.responses import Response
from starlette.websockets import WebSocket

from app.api.deps import (
    CurrentUser,
    SessionDep,
)
from app.core import security
from app.crud.images import create_image, delete_image
from app.crud import common
from app.models import Image
from app.schemas.user import (
    UserOut,
    UserUpdateMe,
)
from app.schemas.utils import Message

router = APIRouter()

@router.get("/me", response_model=UserOut)
def read_user_me(
    current_user: CurrentUser,
    response: Response,
    request: Request,
) -> UserOut | None:
    """
    Get current user and refresh token
    """
    security.set_cookie_session(request, response, current_user)

    client_out = UserOut.model_validate(
        current_user,
        update={
            "profile_image": current_user.profile_image
            if getattr(current_user.profile_image, "is_active", None)
            else None,
        },
    )
    return client_out


@router.patch("/me", response_model=UserOut)
def update_user_me(
    response: Response,
    request: Request,
    session: SessionDep,
    user_in: UserUpdateMe,
    current_user: CurrentUser,
) -> Any:
    """
    Update own user and refresh token
    """

    updated_user = common.update_object(session, current_user, user_in)
    security.set_cookie_session(request, response, updated_user)

    return UserOut.model_validate(
        updated_user,
        update={
            "profile_image": current_user.profile_image
            if getattr(current_user.profile_image, "is_active", None)
            else None,
        },
    )


@router.delete("/me")
def delete_user_me(
    response: Response, session: SessionDep, current_user: CurrentUser
) -> Message:
    """
    Delete a user and refresh token
    """
    common.delete_object(session, current_user)
    security.delete_cookie_session(response)
    return Message(message="User deleted successfully")


@router.post("/me/image", response_model=UserOut)
async def set_profile_image(
    session: SessionDep, current_user: CurrentUser, file: UploadFile
) -> Any:
    allowed_content_type = ["image/jpeg", "image/png"]
    if file.content_type not in allowed_content_type:
        raise HTTPException(status_code=400, detail="Allowed formats are: jpeg, png")

    data = await file.read()

    image_file = ImagePIL.open(io.BytesIO(data))
    blur_hash = blurhash.encode(image_file, x_components=4, y_components=3)

    image = Image(binary=data, blur_hash=blur_hash)
    db_image = create_image(session=session, image=image)

    if not db_image:
        raise HTTPException(status_code=400, detail="Can not add image")

    old_image = current_user.profile_image
    if old_image:
        delete_image(session, old_image)

    current_user.profile_image = db_image
    updated_user = common.update_object(session, current_user)

    return UserOut.model_validate(
        updated_user,
        update={
            "profile_image": current_user.profile_image
            if getattr(current_user.profile_image, "is_active", None)
            else None,
        },
    )
