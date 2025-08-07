import logging.config

import yaml
from fastapi import FastAPI
from fastapi.routing import APIRoute

from app.api.main import api_router
from app.core.config import settings

DEBUG = settings.DEBUG


# generate unique ids for openapi.json
# needed for typescript api at the front
def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"


api_description = """
## Login Instructions
2. **Request OTP Code**: To log in, request an OTP code by posting to `login/code/` with your phone number.
3. **Submit Phone and Code**: Finally, post your phone number and the received OTP code to complete the login process.
"""

app = FastAPI(
    title="Simple FastAPI ToDo List API v1",
    description=api_description,
    openapi_url=f"{settings.service.API_PREFIX}/openapi.json"
    if DEBUG
    else None,
    generate_unique_id_function=custom_generate_unique_id,
    docs_url=f"{settings.service.API_PREFIX}/docs"
    if DEBUG
    else None,
    redoc_url=None,
)

app.include_router(api_router, prefix=settings.service.API_PREFIX)
