from sqlmodel import Relationship

from . import TodoStatus
from .association_tables import TodoUserLink
from .helpers.base_model import BaseSQLModel
from .helpers.mixins import ModifiedAtMixin


class Todo(BaseSQLModel, ModifiedAtMixin, table=True):
    __tablename__ = 'todos'

    title: str
    description: str | None = None
    status: TodoStatus = TodoStatus.NEW

    users: list["User"] = Relationship(back_populates="todos", link_model=TodoUserLink)
    invites: list["Invite"] = Relationship(back_populates="todo")
