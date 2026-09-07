import re

from fastapi import APIRouter, HTTPException

from app.models import GradeTotals, ProfessorInfoResponse
from app.services.rate_my_professors import get_professor_rating
from app.services.supabase import (
    InvalidCourseQueryError,
    SupabaseConfigurationError,
    SupabaseQueryError,
    get_aggregated_grades,
    parse_course_query,
)

router = APIRouter()

INVALID_TEACHER_NAME_REGEX = re.compile(r"[^a-zA-Z\s.\-]|.*\-.*\-")


@router.get("/professor_info", response_model=ProfessorInfoResponse)
def professor_info(teacher: str = "", course: str = "") -> ProfessorInfoResponse:
    teacher_query = teacher.strip()
    course_query = course.strip()

    if not teacher_query:
        raise HTTPException(status_code=400, detail="Teacher name not provided")

    if INVALID_TEACHER_NAME_REGEX.search(teacher_query):
        raise HTTPException(status_code=400, detail="Invalid teacher name")

    if not course_query:
        raise HTTPException(status_code=400, detail="Course name not provided")

    try:
        subject, course_number = parse_course_query(course_query)
    except InvalidCourseQueryError as exc:
        raise HTTPException(status_code=400, detail="Invalid course name") from exc

    try:
        grade_totals = GradeTotals(**get_aggregated_grades(teacher_query, subject, course_number))
    except SupabaseConfigurationError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except SupabaseQueryError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    rating = get_professor_rating(teacher_query)
    if rating is None:
        return ProfessorInfoResponse(
            id=None,
            name=teacher_query,
            department=None,
            grades=grade_totals,
            subject=subject,
            course_number=course_number,
            rating=None,
            difficulty=None,
            would_take_again=None,
            tags=[],
        )

    return ProfessorInfoResponse(
        id=rating.id,
        name=rating.name,
        department=rating.department,
        grades=grade_totals,
        subject=subject,
        course_number=course_number,
        rating=rating.rating,
        difficulty=rating.difficulty,
        would_take_again=rating.would_take_again,
        tags=rating.tags,
    )
