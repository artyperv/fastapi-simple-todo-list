import uuid
from datetime import datetime

from sqlmodel import SQLModel

from app.models import TodoStatus

from .user import UserOut
from .utils import PaginatedOut


class TodoCreate(SQLModel):
    title: str
    description: str | None = None
    status: TodoStatus = TodoStatus.NEW


class TodoUpdate(TodoCreate):
    user_ids: list[uuid.UUID] | None = None


class TodoOut(SQLModel):
    id: uuid.UUID
    title: str
    description: str | None
    status: TodoStatus
    users: list["UserOut"] = []
    modified_at: datetime


class TodoOutShort(SQLModel):
    id: uuid.UUID
    title: str
    status: TodoStatus


class TodosOut(PaginatedOut):
    data: list[TodoOut]
