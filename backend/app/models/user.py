import uuid
from typing import Optional

from sqlalchemy import BigInteger
from sqlmodel import Column, Field, Relationship

from app.models.image import Image

from .association_tables import TodoUserLink
from .helpers.base_model import BaseSQLModel
from .helpers.mixins import ModifiedAtMixin


class User(BaseSQLModel, ModifiedAtMixin, table=True):
    __tablename__ = 'users'

    phone: int = Field(sa_column=Column(BigInteger()))
    email: str | None = Field(index=True, nullable=True, unique=True)
    name: str | None = None

    profile_image_id: uuid.UUID | None = Field(
        default=None, foreign_key="images.id", nullable=True
    )
    profile_image: Optional["Image"] = Relationship()

    todos: list["Todo"] = Relationship(
        back_populates="users",
        link_model=TodoUserLink
    )
    invites: list["Invite"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs=dict(foreign_keys="[Invite.user_id]")
    )
