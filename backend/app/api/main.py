from fastapi import APIRouter

from app.api.routes import login, users, todos, images

api_router = APIRouter()

api_router.include_router(login.router, prefix="/auth", tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])

api_router.include_router(images.router, prefix="/images", tags=["images"])

api_router.include_router(todos.router, prefix="/todos", tags=["todos"])
