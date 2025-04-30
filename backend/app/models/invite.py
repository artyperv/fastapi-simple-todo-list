import uuid
from typing import Optional

from sqlmodel import Field, Relationship

from .helpers.base_model import BaseSQLModel
from .helpers.mixins import ModifiedAtMixin


class Invite(BaseSQLModel, ModifiedAtMixin, table=True):
    __tablename__ = 'invites'

    user_id: uuid.UUID | None = Field(
        default=None, foreign_key="users.id"
    )
    user: Optional["User"] = Relationship(
        sa_relationship_kwargs=dict(foreign_keys="[Invite.user_id]")
    )
    owner_id: uuid.UUID | None = Field(
        default=None, foreign_key="users.id"
    )
    owner: Optional["User"] = Relationship(
        sa_relationship_kwargs=dict(foreign_keys="[Invite.owner_id]")
    )
    todo_id: uuid.UUID | None = Field(
        default=None, foreign_key="todos.id"
    )
    todo: Optional["Todo"] = Relationship()
