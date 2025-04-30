import uuid
from typing import Annotated, Any

from fastapi import Depends, HTTPException
from fastapi.params import Path
from faststream.redis.fastapi import RedisRouter

from app.api.deps import CurrentUser, PageParamsDep, SessionDep
from app.core.config import settings
from app.crud import common
from app.crud import invites as invites_crud
from app.crud import users as users_crud
from app.schemas.invite import (
    InviteOut,
    InvitesOut,
)

from app.models.invite import Invite

from app.models import Todo
from app.schemas.todo import TodoOut
from app.schemas.utils import Message

router = RedisRouter(settings.REDIS_DATABASE_URI)


@router.get("/", response_model=InvitesOut)
def read_invites(current_user: CurrentUser, session: SessionDep, q: PageParamsDep) -> Any:
    """
    Retrieve invites.
    """

    invites, total = invites_crud.read_objects(session, current_user, q)

    return InvitesOut(
        data=invites,
        count=len(invites),
        total=total,
        limit=q.limit,
        skip=q.skip,
    )


@router.post("/", response_model=InviteOut)
async def create_invite(
    session: SessionDep,
    todo_id: uuid.UUID,
    user_phone: int,
    current_user: CurrentUser,
) -> Message | None:
    """
    Create new invite.
    """
    user = users_crud.get_user_by_phone(session, user_phone)
    todo = common.get_object(session, Todo, todo_id)

    if todo and current_user in todo.users and user and user.is_active == True and user not in todo.users:
        db_invite = invites_crud.get_unique_invite(session, todo_id, user.id)
        if not db_invite:
            common.create_object(session, None, Invite(todo_id=todo_id, user_id=user.id))

    return Message(message="OK")


def get_user_invite(session: SessionDep, current_user: CurrentUser, invite_id: uuid.UUID = Path()) -> Invite:
    invite = common.get_object(session, Invite, invite_id)
    if not invite or current_user.id != invite.user_id:
        raise HTTPException(status_code=404, detail="Invite not found")
    return invite


UserInvite = Annotated[Invite, Depends(get_user_invite)]


@router.post("/{invite_id}/accept", response_model=Message)
async def accept_invite(session: SessionDep, invite: UserInvite) -> Message | None:
    """
    Accept invite by ID.
    """
    invites_crud.accept_invite(session, invite)
    await router.broker.publish({"todo_id": str(invite.todo_id)}, channel="todo_update")
    return Message(message="OK")


@router.post("/{invite_id}/decline", response_model=Message)
def decline_invite(session: SessionDep, invite: UserInvite) -> Message | None:
    """
    Accept invite by ID.
    """
    common.delete_object(session, invite)
    return Message(message="OK")
