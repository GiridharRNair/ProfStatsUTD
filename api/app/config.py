import os
from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    supabase_url: str | None
    supabase_secret_key: str | None
    allowed_extension_origin: str | None

    @property
    def allowed_origins(self) -> list[str]:
        if self.allowed_extension_origin:
            return [self.allowed_extension_origin]

        return ["*"]


def get_settings() -> Settings:
    return Settings(
        supabase_url=os.environ.get("SUPABASE_URL"),
        supabase_secret_key=os.environ.get("SUPABASE_SECRET_KEY"),
        allowed_extension_origin=os.environ.get("ALLOWED_EXTENSION_ORIGIN"),
    )
