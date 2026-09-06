from fastapi import APIRouter


router = APIRouter()


@router.get("/health_check")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
