import re
from typing import Any

from supabase import Client, create_client

from app.config import get_settings

PROFESSOR_SUGGESTION_LIMIT = 5
COURSE_SUGGESTION_LIMIT = 5
GRADE_COLUMNS = (
    "a_plus",
    "a",
    "a_minus",
    "b_plus",
    "b",
    "b_minus",
    "c_plus",
    "c",
    "c_minus",
    "d_plus",
    "d",
    "d_minus",
    "f",
    "cr",
    "nc",
    "p",
    "w",
    "i",
    "nf",
)


class SupabaseConfigurationError(RuntimeError):
    pass


class InvalidCourseQueryError(ValueError):
    pass


def create_supabase_client() -> Client:
    settings = get_settings()
    if not settings.supabase_url or not settings.supabase_secret_key:
        raise SupabaseConfigurationError("Set SUPABASE_URL and SUPABASE_SECRET_KEY.")

    return create_client(settings.supabase_url, settings.supabase_secret_key)


def normalize_professor_search_name(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", name.lower()).strip()


def get_professor_suggestions(teacher_query: str) -> list[str]:
    normalized_query = normalize_professor_search_name(teacher_query)
    if not normalized_query:
        return []

    response = (
        create_supabase_client()
        .table("grade_sections")
        .select("instructor_name")
        .ilike("instructor_search_name", _contains_words_pattern(normalized_query))
        .limit(100)
        .execute()
    )

    suggestions: list[str] = []
    for record in _records(response.data):
        instructor_name = record.get("instructor_name")
        if not isinstance(instructor_name, str) or not instructor_name:
            continue

        suggestion = _professor_suggestion_name(instructor_name)
        if suggestion not in suggestions:
            suggestions.append(suggestion)

        if len(suggestions) == PROFESSOR_SUGGESTION_LIMIT:
            break

    return suggestions


def parse_course_query(course_query: str) -> tuple[str, str]:
    subject, catalog_number = _split_course_query(course_query)
    if not subject or not catalog_number:
        raise InvalidCourseQueryError("Course must include a subject and catalog number.")

    return subject, catalog_number


def get_course_suggestions(teacher_query: str, course_query: str) -> list[str]:
    subject, catalog_number = _split_course_query(course_query)
    professor_search_name = normalize_professor_search_name(teacher_query)

    query = (
        create_supabase_client()
        .table("grade_sections")
        .select("subject,catalog_number")
        .order("subject")
        .order("catalog_number")
    )

    if subject:
        query = query.ilike("subject", f"{subject}%")

    if catalog_number:
        query = query.ilike("catalog_number", f"{catalog_number}%")

    if professor_search_name:
        query = query.ilike(
            "instructor_search_name", _contains_words_pattern(professor_search_name)
        )

    response = query.limit(100).execute()

    suggestions: list[str] = []
    for record in _records(response.data):
        record_subject = record.get("subject")
        record_catalog_number = record.get("catalog_number")
        if not isinstance(record_subject, str) or not isinstance(record_catalog_number, str):
            continue

        suggestion = f"{record_subject} {record_catalog_number}"
        if suggestion not in suggestions:
            suggestions.append(suggestion)

        if len(suggestions) == COURSE_SUGGESTION_LIMIT:
            break

    return suggestions


def get_aggregated_grades(teacher: str, subject: str, catalog_number: str) -> dict[str, int]:
    professor_search_name = normalize_professor_search_name(teacher)
    if not professor_search_name or not subject or not catalog_number:
        raise ValueError("Teacher, subject, and catalog number are required for grade aggregation.")

    response = (
        create_supabase_client()
        .table("grade_sections")
        .select(",".join(GRADE_COLUMNS))
        .eq("subject", subject.upper())
        .eq("catalog_number", catalog_number.upper())
        .ilike("instructor_search_name", _contains_words_pattern(professor_search_name))
        .execute()
    )

    totals = {column: 0 for column in GRADE_COLUMNS}
    for record in _records(response.data):
        for column in GRADE_COLUMNS:
            totals[column] += _int_record_value(record, column)

    return totals


def _professor_suggestion_name(name: str) -> str:
    name_parts = name.split()
    if len(name_parts) < 2:
        return name

    return f"{name_parts[0]} {name_parts[-1]}"


def _contains_words_pattern(search_name: str) -> str:
    return f"%{'%'.join(search_name.split())}%"


def _split_course_query(course_query: str) -> tuple[str, str]:
    formatted_query = course_query.replace(" ", "").upper().strip()
    if not formatted_query:
        return "", ""

    match = re.fullmatch(r"([A-Z]*)([0-9V]*)", formatted_query)
    if match is None:
        raise InvalidCourseQueryError("Invalid course.")

    return match.group(1), match.group(2)


def _int_record_value(record: dict[str, Any], key: str) -> int:
    value = record.get(key)
    if isinstance(value, int):
        return value

    if isinstance(value, float):
        return int(value)

    return 0


def _records(data: object) -> list[dict[str, Any]]:
    if not isinstance(data, list):
        return []

    return [record for record in data if isinstance(record, dict)]
