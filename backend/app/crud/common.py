import uuid
from typing import Protocol

from sqlalchemy import true
from sqlmodel import SQLModel, Session, select


def get_object(session: Session, model: SQLModel, object_id: uuid.UUID) -> SQLModel | None:
    statement = select(model).where(model.id == object_id, model.is_active == true())
    db_object = session.exec(statement).first()
    return db_object


def create_object(
    session: Session,
    model: SQLModel | None,
    object_create: SQLModel,
    commit: bool = True,
) -> SQLModel:
    if model:
        db_object = model.model_validate(object_create)
    else:
        db_object = object_create
    session.add(db_object)
    if commit:
        session.commit()
    else:
        session.flush()
    return db_object


def update_object(
    session: Session,
    db_object: SQLModel,
    object_in: SQLModel | None = None,
) -> SQLModel:
    """
    Updates an object in the database.

    Args:
        session (Session): The database session to use for updating the object.
        db_object (SQLModel): An instance of the model that you want to update.
        object_in (like SQLModelUpdate): An instance of the model with the data to update the object.

    Returns:
        _T0: The updated database object.
    """
    if object_in:
        object_data = object_in.model_dump(exclude_unset=True)
        db_object.sqlmodel_update(object_data)
    session.add(db_object)
    session.commit()

    return db_object


class HasIsActive(Protocol):
    is_active: bool


def delete_object(
    session: Session,
    object_in: HasIsActive,
) -> None:
    object_in.is_active = False
    session.add(object_in)
    session.commit()
