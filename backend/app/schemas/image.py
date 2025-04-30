import uuid

from pydantic import computed_field
from sqlmodel import SQLModel

from app.core.config import settings


class ImageCreate(SQLModel):
    binary: bytes


class ImageOutShort(SQLModel):
    id: uuid.UUID
    blur_hash: str

    @computed_field  # type: ignore
    @property
    def url(self) -> str:
        return settings.service.API_PREFIX + "/images/" + str(self.id)
