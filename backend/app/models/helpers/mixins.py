from datetime import datetime

from sqlalchemy import event
from sqlmodel import Field


class ModifiedAtMixin:
    created_at: datetime = Field(default=datetime.now, nullable=False)
    modified_at: datetime = Field(default=datetime.now, nullable=False)


@event.listens_for(ModifiedAtMixin, "before_insert", propagate=True)
def timestamp_before_insert(mapper, connection, target):
    target.created_at = datetime.now()
    target.modified_at = datetime.now()


@event.listens_for(ModifiedAtMixin, "before_update", propagate=True)
def timestamp_before_update(mapper, connection, target):
    target.modified_at = datetime.now()
