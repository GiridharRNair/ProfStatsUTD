import re
from typing import Any

import httpx

from app.config import get_settings

PROFESSOR_SUGGESTION_LIMIT = 5
COURSE_SUGGESTION_LIMIT = 5
SUPABASE_REST_TIMEOUT_SECONDS = 10
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


class SupabaseQueryError(RuntimeError):
    pass


class InvalidCourseQueryError(ValueError):
    pass


def normalize_professor_search_name(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", name.lower()).strip()


def get_professor_suggestions(teacher_query: str) -> list[str]:
    normalized_query = normalize_professor_search_name(teacher_query)
    if not normalized_query:
        return []

    records = _get_grade_sections(
        {
            "select": "instructor_name",
            "instructor_search_name": _contains_words_filter(normalized_query),
            "limit": "100",
        }
    )

    suggestions: list[str] = []
    for record in records:
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

    params = {
        "select": "subject,catalog_number",
        "order": "subject.asc,catalog_number.asc",
        "limit": "100",
    }

    if subject:
        params["subject"] = _starts_with_filter(subject)

    if catalog_number:
        params["catalog_number"] = _starts_with_filter(catalog_number)

    if professor_search_name:
        params["instructor_search_name"] = _contains_words_filter(professor_search_name)

    records = _get_grade_sections(params)

    suggestions: list[str] = []
    for record in records:
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

    records = _get_grade_sections(
        {
            "select": ",".join(GRADE_COLUMNS),
            "subject": _equals_filter(subject.upper()),
            "catalog_number": _equals_filter(catalog_number.upper()),
            "instructor_search_name": _contains_words_filter(professor_search_name),
        }
    )

    totals = {column: 0 for column in GRADE_COLUMNS}
    for record in records:
        for column in GRADE_COLUMNS:
            totals[column] += _int_record_value(record, column)

    return totals


def _professor_suggestion_name(name: str) -> str:
    name_parts = name.split()
    if len(name_parts) < 2:
        return name

    return f"{name_parts[0]} {name_parts[-1]}"


def _get_grade_sections(params: dict[str, str]) -> list[dict[str, Any]]:
    settings = get_settings()
    if not settings.supabase_url or not settings.supabase_secret_key:
        raise SupabaseConfigurationError("Set SUPABASE_URL and SUPABASE_SECRET_KEY.")

    try:
        response = httpx.get(
            f"{settings.supabase_url.rstrip('/')}/rest/v1/grade_sections",
            params=params,
            headers={
                "apikey": settings.supabase_secret_key,
                "Authorization": f"Bearer {settings.supabase_secret_key}",
            },
            timeout=SUPABASE_REST_TIMEOUT_SECONDS,
        )
        response.raise_for_status()
    except httpx.HTTPError as exc:
        raise SupabaseQueryError("Supabase query failed.") from exc

    return _records(response.json())


def _contains_words_filter(search_name: str) -> str:
    return f"ilike.*{'*'.join(search_name.split())}*"


def _starts_with_filter(value: str) -> str:
    return f"ilike.{value}*"


def _equals_filter(value: str) -> str:
    return f"eq.{value}"


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
