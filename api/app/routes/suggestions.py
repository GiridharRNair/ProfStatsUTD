from fastapi import APIRouter, HTTPException

from app.models import SuggestionsResponse
from app.services.supabase import (
    InvalidCourseQueryError,
    SupabaseConfigurationError,
    SupabaseQueryError,
    get_course_suggestions,
    get_professor_suggestions,
)

router = APIRouter()


@router.get("/suggestions", response_model=SuggestionsResponse)
def suggestions(teacher: str = "", course: str = "") -> SuggestionsResponse:
    teacher_query = teacher.strip()
    course_query = course.strip()

    try:
        professors = get_professor_suggestions(teacher_query) if teacher_query else []
        courses = (
            get_course_suggestions(teacher_query, course_query)
            if teacher_query or course_query
            else []
        )
    except InvalidCourseQueryError:
        courses = []
    except SupabaseConfigurationError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except SupabaseQueryError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    return SuggestionsResponse(professors=professors, courses=courses)
