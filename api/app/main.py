from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routes.health import router as health_router
from app.routes.suggestions import router as suggestions_router


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(title="ProfStats API")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_methods=["GET"],
        allow_headers=["*"],
    )

    app.include_router(health_router)
    app.include_router(suggestions_router)

    return app


app = create_app()
