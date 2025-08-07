import os
import secrets

from pydantic import (
    BaseModel,
    PostgresDsn,
    RedisDsn,
    computed_field,
)
from pydantic_core import MultiHostUrl
from pydantic_settings import (
    BaseSettings,
    PydanticBaseSettingsSource,
    SettingsConfigDict,
    YamlConfigSettingsSource,
)


def get_config_path() -> str:
    env_config_name = os.getenv("CONFIG_NAME")
    base_dir = os.path.dirname(__file__)
    if not env_config_name:
        return base_dir + "/../../config.yaml"
    if os.path.exists(env_config_name):
        return env_config_name
    if os.path.exists(base_dir + "/../../" + env_config_name):
        return base_dir + "/../../" + env_config_name
    raise ValueError("There is no config")


class DatabaseSettings(BaseModel):
    SERVER: str
    PORT: int = 5432
    USER: str | None = None
    PASSWORD: str | None = None
    DB: str = ""


class SecuritySettings(BaseModel):
    SECRET_KEY: str = secrets.token_urlsafe(32)  # openssl rand -hex 32
    # 60 minutes * 24 hours * 30 days = 30 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 30
    VERIFICATION_CODE_EXPIRE_MINUTES: int = 5
    ALGORITHM: str = "HS256"
    JWT_COOKIE_NAME: str = "session_id"


class ServiceSettings(BaseModel):
    API_PREFIX: str = "/api/v1"


class ContentSettings(BaseModel):
    SPAWN_GREETING_TODOS: bool = True


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        yaml_file=get_config_path(),
        env_ignore_empty=True,
        extra="ignore",
    )

    service: ServiceSettings
    database: DatabaseSettings
    redis: DatabaseSettings
    security: SecuritySettings
    content: ContentSettings = ContentSettings()

    DEBUG: bool = False

    @computed_field  # type: ignore[misc]
    @property
    def MAIN_DATABASE_URI(self) -> PostgresDsn:
        return MultiHostUrl.build(
            scheme="postgresql+psycopg",
            username=self.database.USER,
            password=self.database.PASSWORD,
            host=self.database.SERVER,
            port=self.database.PORT,
            path=self.database.DB,
        )

    @computed_field  # type: ignore[misc]
    @property
    def REDIS_DATABASE_URI(self) -> RedisDsn:
        return str(
            MultiHostUrl.build(
                scheme="redis",
                username=self.redis.USER,
                password=self.redis.PASSWORD,
                host=self.redis.SERVER,
                port=self.redis.PORT,
                path=self.redis.DB,
            )
        )

    @classmethod
    def settings_customise_sources(
        cls,
        settings_cls: type[BaseSettings],
        init_settings: PydanticBaseSettingsSource,
        env_settings: PydanticBaseSettingsSource,
        dotenv_settings: PydanticBaseSettingsSource,
        file_secret_settings: PydanticBaseSettingsSource,
    ) -> tuple[PydanticBaseSettingsSource, ...]:
        return (YamlConfigSettingsSource(settings_cls),)


settings = Settings()  # type: ignore
