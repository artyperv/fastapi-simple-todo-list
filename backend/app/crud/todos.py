from fastapi import HTTPException
from sqlalchemy import func, true
from sqlmodel import Session, select

from app.models import TodoUserLink, User
from app.models.todo import Todo
from app.schemas.todo import TodoUpdate
from app.schemas.utils import PageParams


def read_objects(
        session: Session, user: User, q: PageParams | None = None
) -> tuple[list[Todo], int]:
    statement = (
        select(Todo, func.count(Todo.id).over().label("total"))
        .join(TodoUserLink, Todo.id == TodoUserLink.todo_id)
        .where(TodoUserLink.user_id == user.id)
        .where(Todo.is_active == true())
    )
    if q:
        statement = statement.offset(q.skip).limit(q.limit)
    db_results = session.exec(statement).all() or []

    db_objects = [object_db for object_db, total in db_results]
    db_total = db_results[0][1] if len(db_results) > 0 else 0
    return db_objects, db_total


def create_object(
        session: Session,
        object_create: Todo,
        user: User,
) -> Todo:
    db_todo = Todo.model_validate(object_create)
    db_todo.users = [user]
    session.add(db_todo)
    session.commit()
    return db_todo


def update_object(
        session: Session,
        db_todo: Todo,
        todo_in: TodoUpdate,
) -> Todo:
    todo_data = todo_in.model_dump(exclude_unset=True)
    db_todo.sqlmodel_update(todo_data)

    if todo_in.user_ids is None:
        pass
    elif len(todo_in.user_ids) == 0:
        raise HTTPException(
            status_code=400, detail="Can not delete all users from todo."
        )
    else:
        statement = select(User).where(User.id.in_(todo_in.user_ids))
        db_users = session.exec(statement).all()
        new_users_appeared = set(db_users) - set(db_todo.users)
        if len(db_users) != len(todo_in.user_ids) or new_users_appeared:
            raise HTTPException(
                status_code=400, detail="One or more user IDs are invalid."
            )
        db_todo.users = db_users

    session.add(db_todo)
    session.commit()
    return db_todo
