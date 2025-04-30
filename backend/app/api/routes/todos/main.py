import json
import uuid
from typing import Any

from fastapi import HTTPException
from faststream.redis.fastapi import RedisRouter
from starlette.websockets import WebSocket, WebSocketDisconnect, WebSocketState

from app.api.deps import CurrentUser, PageParamsDep, SessionDep
from app.core.config import settings
from app.crud import common as crud
from app.crud import todos as todos_crud
from app.schemas.todo import (
    TodoCreate,
    TodoOut,
    TodosOut,
    TodoUpdate,
)

from app.models.todo import Todo
from app.schemas.utils import Message
from .invites import router as invites_router

router = RedisRouter(settings.REDIS_DATABASE_URI)

router.include_router(invites_router, prefix="/invites", tags=["invites"])

active_connections: dict[uuid.UUID, list[WebSocket]] = {}

async def broadcast_to_user(user_id: uuid.UUID, data: Any):
    if user_id in active_connections:
        for connection in active_connections[user_id]:
            await connection.send_json(data)


@router.get("/", response_model=TodosOut)
def read_todos(current_user: CurrentUser, session: SessionDep, q: PageParamsDep) -> Any:
    """
    Retrieve todos.
    """

    todos, total = todos_crud.read_objects(session, current_user, q)

    return TodosOut(
        data=todos,
        count=len(todos),
        total=total,
        limit=q.limit,
        skip=q.skip,
    )


@router.get(
    "/{todo_id}",
    response_model=TodoOut,
)
def read_todo(current_user: CurrentUser, session: SessionDep, todo_id: uuid.UUID) -> TodoOut | None:
    """
    Get todo by ID.
    """
    todo = crud.get_object(session, Todo, todo_id)

    if not todo or current_user not in todo.users:
        raise HTTPException(status_code=404, detail="Todo not found")

    return todo


@router.post("/", response_model=TodoOut)
async def create_todo(
    session: SessionDep,
    todo_in: TodoCreate,
    current_user: CurrentUser,
) -> TodoOut | None:
    """
    Create new todo.
    """
    todo = todos_crud.create_object(session, todo_in, current_user)

    todo_out = TodoOut.model_validate(todo)
    for user in todo.users:
        await broadcast_to_user(user.id, todo_out.model_dump_json())

    return todo_out


@router.put("/{todo_id}", response_model=TodoOut)
async def update_todo(
    session: SessionDep,
    todo_id: uuid.UUID,
    todo_in: TodoUpdate,
    current_user: CurrentUser,
) -> TodoOut | None:
    """
    Update a todo.
    """
    todo = crud.get_object(session, Todo, todo_id)

    if not todo or current_user not in todo.users:
        raise HTTPException(status_code=404, detail="Todo not found")

    todo = todos_crud.update_object(session, todo, todo_in)

    todo_out = TodoOut.model_validate(todo)
    for user in todo.users:
        await broadcast_to_user(user.id, todo_out.model_dump_json())

    return todo_out


@router.delete("/{todo_id}", response_model=Message)
async def delete_todo(
    session: SessionDep,
    todo_id: uuid.UUID,
    current_user: CurrentUser,
) -> Message:
    """
    Delete a todo.
    """
    todo = crud.get_object(session, Todo, todo_id)
    todo_users = todo.users

    if not todo or current_user not in todo_users:
        raise HTTPException(status_code=404, detail="Todo not found")

    crud.delete_object(session, todo)

    for user in todo_users:
        await broadcast_to_user(user.id, json.dumps({"id": str(todo.id)}))

    return Message(message="Item deleted successfully")


@router.websocket(
    "/ws",
)
async def todo_ws(
    websocket: WebSocket,
    user: CurrentUser,
):
    await websocket.accept()

    if user.id not in active_connections:
        active_connections[user.id] = []
    active_connections[user.id].append(websocket)

    try:
        while True:
            _message = await websocket.receive_json()
    except WebSocketDisconnect:
        # Handle disconnection
        active_connections[user.id].remove(websocket)
        if not active_connections[user.id]:  # No active connections left
            active_connections.pop(user.id)
    finally:
        if websocket.client_state is not WebSocketState.DISCONNECTED:
            await websocket.close()


@router.subscriber("todo_update")
async def todo_update_event(todo_id: str, session: SessionDep):
    todo = crud.get_object(session, Todo, uuid.UUID(todo_id))
    if todo:
        todo_out = TodoOut.model_validate(todo)
        for user in todo.users:
            await broadcast_to_user(user.id, todo_out.model_dump_json())
