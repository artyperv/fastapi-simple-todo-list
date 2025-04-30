import datetime
import uuid

from sqlmodel import Session, select

from app.models import Image


def read_image(session: Session, image_id: uuid.UUID) -> Image | None:
    statement = select(Image).where(
        Image.id == image_id,
        Image.is_active == True,
    )
    db_image = session.exec(statement).first()
    return db_image


def create_image(session: Session, image: Image) -> Image:
    db_image = Image.model_validate(
        image,
        update={
            "created_at": datetime.datetime.now(),
            "modified_at": datetime.datetime.now(),
        },
    )
    session.add(db_image)
    session.commit()
    return db_image


def delete_image(session: Session, db_image: Image) -> None:
    db_image.is_active = False
    session.add(db_image)
    session.commit()
