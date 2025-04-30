import uuid

from sqlmodel import SQLModel, Field


class TodoUserLink(SQLModel, table=True):
    user_id: uuid.UUID | None = Field(
        default=None, foreign_key="users.id", primary_key=True
    )
    todo_id: uuid.UUID | None = Field(
        default=None, foreign_key="todos.id", primary_key=True
    )
