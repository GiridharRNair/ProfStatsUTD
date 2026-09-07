from pydantic import BaseModel

from app.models.grades import GradeTotals


class ProfessorInfoResponse(BaseModel):
    id: str | None
    name: str
    department: str | None
    grades: GradeTotals
    subject: str
    course_number: str
    rating: float | None
    difficulty: float | None
    would_take_again: int | None
    tags: list[str]
