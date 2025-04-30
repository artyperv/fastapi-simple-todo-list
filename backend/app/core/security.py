import uuid
from collections.abc import Mapping
from datetime import datetime, timedelta
from typing import Annotated, Any

from fastapi import Depends, HTTPException, Request, status
from fastapi.params import Cookie
from jose import JWTError, jwt
from passlib.context import CryptContext
from starlette.responses import Response

from app.core.config import settings
from app.models import User
from app.schemas.utils import TokenPayload

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

error_403 = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail="Could not validate credentials",
)


def decode_access_token(
        session_id: str = Cookie(
            alias=settings.security.JWT_COOKIE_NAME,
            title="Session Id",
            include_in_schema=False,
        ),
) -> TokenPayload | None:
    try:
        payload = jwt.decode(
            session_id,
            settings.security.SECRET_KEY,
            algorithms=[settings.security.ALGORITHM],
        )
        payload["id"] = uuid.UUID(payload["id"])
        return TokenPayload(**payload)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )


TokenDataDep = Annotated[TokenPayload, Depends(decode_access_token)]


def create_access_token(token_data: TokenPayload) -> str:
    expire = datetime.now() + timedelta(
        minutes=settings.security.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode = {
        "exp": expire,
        "id": str(token_data.id),
    }
    encoded_jwt = jwt.encode(
        to_encode, settings.security.SECRET_KEY, algorithm=settings.security.ALGORITHM
    )
    return encoded_jwt


def get_domain_name(request: Request) -> str | None:
    domain_name = None
    try:
        host = request.headers.get("X-Forwarded-Host", None)
        if host:
            domain_parts = host.split(".")
            domain_name = f"{domain_parts[-2]}.{domain_parts[-1]}"
    except Exception:
        pass
    return domain_name


# Generate JWT and store it in cookie
def set_cookie_session(
        request: Request, response: Response, user: User
) -> Response:
    token_data = TokenPayload(id=user.id)
    access_token = create_access_token(token_data)
    response.set_cookie(
        settings.security.JWT_COOKIE_NAME,
        access_token,
        max_age=settings.security.ACCESS_TOKEN_EXPIRE_MINUTES * 60,  # in seconds
        domain=get_domain_name(request),
        httponly=True,
        secure=not settings.DEBUG,
        samesite="strict",
    )
    return response


def delete_cookie_session(request: Request, response: Response) -> Response:
    response.delete_cookie(
        settings.security.JWT_COOKIE_NAME,
        domain=get_domain_name(request),
        httponly=True,
        secure=not settings.DEBUG,
        samesite="strict",
    )
    return response


def verify_code(plain_code: str, hashed_code: str) -> bool:
    if settings.DEBUG:
        return True
    return pwd_context.verify(plain_code, hashed_code)


def get_code_hash(code: str) -> str:
    return pwd_context.hash(code)
