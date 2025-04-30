import uuid

from sqlmodel import JSON, Field, SQLModel


class BaseSQLModel(SQLModel):
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False,
    )

    attributes: dict = Field(default_factory=dict, sa_type=JSON)
    is_active: bool = True

    def get_summary(self) -> str:
        return self.__repr__()

    class Config:
        # Необходимо для Column(JSON)/Field(sa_type=JSON)
        # разрешает Pydantic использовать нестандартные поля
        arbitrary_types_allowed = True
