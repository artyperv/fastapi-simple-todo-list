import uuid
from typing import Any

from fastapi import APIRouter, HTTPException, Response

from app.api.deps import SessionDep
from app.crud import common as crud

from app.models import Image

router = APIRouter()

@router.get("/{image_id}")
def read_image(session: SessionDep, image_id: uuid.UUID) -> Any:
    image = crud.get_object(session, Image, image_id)

    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    media_type = image.attributes.get("media_type", "image/png")
    return Response(content=image.binary, media_type=media_type)
