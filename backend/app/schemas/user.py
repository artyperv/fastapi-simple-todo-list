import uuid
from typing import Optional

from sqlmodel import SQLModel

from .image import ImageOutShort


class UserUpdateMe(SQLModel):
    name: str | None = None
    email: str | None = None


class UserCreateOpen(SQLModel):
    phone: str


class UserCreate(UserUpdateMe):
    phone: int


class UserOut(SQLModel):
    id: uuid.UUID
    phone: int
    name: str | None = None
    email: str | None = None
    profile_image: Optional["ImageOutShort"] = None


class UserPublicOutShort(SQLModel):
    phone: int
    name: str | None = None
    profile_image: Optional["ImageOutShort"] = None


class QRStringOut(SQLModel):
    string: str
    valid_for_minutes: int = 5
