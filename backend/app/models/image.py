from sqlmodel import Column, Field, LargeBinary

from .helpers.base_model import BaseSQLModel
from .helpers.mixins import ModifiedAtMixin


class Image(BaseSQLModel, ModifiedAtMixin, table=True):
    __tablename__ = 'images'

    blur_hash: str
    binary: bytes = Field(default_factory=bytes, sa_column=Column(LargeBinary))
