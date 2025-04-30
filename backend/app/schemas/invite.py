import uuid
from typing import Optional

from sqlmodel import SQLModel

from .todo import TodoOutShort
from .utils import PaginatedOut


class InviteOut(SQLModel):
    id: uuid.UUID
    todo: Optional["TodoOutShort"]


class InvitesOut(PaginatedOut):
    data: list[InviteOut]
