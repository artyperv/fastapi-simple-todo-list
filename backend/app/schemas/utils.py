import uuid

from sqlmodel import SQLModel


class TokenUser(SQLModel):
    id: uuid.UUID


class TokenGuest(SQLModel):
    str: str


# Contents of JWT token
class TokenPayload(SQLModel):
    id: uuid.UUID


# Generic message
class Message(SQLModel):
    message: str


class PaginatedOut(SQLModel):
    count: int
    total: int
    limit: int
    skip: int


class PageParams(SQLModel):
    limit: int
    skip: int
