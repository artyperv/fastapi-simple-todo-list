import uuid

from fastapi import HTTPException
from sqlalchemy import func, true
from sqlalchemy.orm import joinedload
from sqlmodel import Session, select

from app.models import Invite, TodoUserLink, User
from app.models.todo import Todo
from app.schemas.todo import TodoUpdate
from app.schemas.utils import PageParams


def read_objects(
        session: Session, user: User, q: PageParams | None = None
) -> tuple[list[Invite], int]:
    statement = (
        select(Invite, func.count(Invite.id).over().label("total"))
        .where(Invite.user_id == user.id)
        .where(Invite.is_active == true())
        .distinct(Invite.id)
    )
    if q:
        statement = statement.offset(q.skip).limit(q.limit)
    db_results = session.exec(statement).all() or []

    db_objects = [object_db for object_db, total in db_results]
    db_total = db_results[0][1] if len(db_results) > 0 else 0
    return db_objects, db_total


def get_unique_invite(session: Session, todo_id: uuid.UUID, user_id: uuid.UUID) -> Invite:
    statement = select(Invite).where(
        Invite.todo_id == todo_id,
        Invite.user_id == user_id,
        Invite.is_active == true()
    )
    db_object = session.exec(statement).first()
    return db_object


def accept_invite(
    session: Session,
    invite: Invite,
):
    invite.todo.users.append(invite.user)
    session.add(invite.todo)
    invite.is_active = False
    session.add(invite)
    session.commit()
