import base64
import re
from collections import Counter
from dataclasses import dataclass
from typing import Any

import httpx

UTD_SCHOOL_ID = "1273"
RATE_MY_PROFESSORS_GRAPHQL_URL = "https://www.ratemyprofessors.com/graphql"
RATE_MY_PROFESSORS_SEARCH_URL = "https://www.ratemyprofessors.com/search/professors/{school_id}"
REQUEST_TIMEOUT_SECONDS = 10
SPECIAL_CASE_PROFESSOR_IDS = {
    "bopark": "2680140",
}


@dataclass(frozen=True)
class RateMyProfessorsResult:
    id: str
    name: str
    department: str | None
    rating: float | None
    difficulty: float | None
    would_take_again: int | None
    tags: list[str]


def get_professor_rating(professor_name: str) -> RateMyProfessorsResult | None:
    try:
        professor_id = _get_professor_id(professor_name)
        if professor_id is None:
            return None

        summary = _fetch_professor_summary(professor_id)
        if summary is None:
            return None

        if not _is_special_case_professor(professor_name) and not _summary_matches_query(
            professor_name, summary
        ):
            return None

        tags = _fetch_professor_tags(professor_id, summary.num_ratings)
        return RateMyProfessorsResult(
            id=professor_id,
            name=_display_name(summary.first_name, summary.last_name),
            department=summary.department,
            rating=_cap_float(summary.avg_rating, 5),
            difficulty=_cap_float(summary.avg_difficulty, 5),
            would_take_again=_cap_int(summary.would_take_again_percent, 100),
            tags=tags,
        )
    except (httpx.HTTPError, KeyError, TypeError, ValueError):
        return None


@dataclass(frozen=True)
class _ProfessorSummary:
    first_name: str
    last_name: str
    department: str | None
    avg_rating: float | None
    avg_difficulty: float | None
    would_take_again_percent: float | None
    num_ratings: int


def _get_professor_id(professor_name: str) -> str | None:
    cleaned_name = _clean_professor_id_search_name(professor_name)
    if cleaned_name in SPECIAL_CASE_PROFESSOR_IDS:
        return SPECIAL_CASE_PROFESSOR_IDS[cleaned_name]

    response = httpx.get(
        RATE_MY_PROFESSORS_SEARCH_URL.format(school_id=UTD_SCHOOL_ID),
        params={"q": professor_name},
        headers=_headers(),
        timeout=REQUEST_TIMEOUT_SECONDS,
        follow_redirects=True,
    )
    response.raise_for_status()

    match = re.search(r'"legacyId":(\d+)', response.text)
    if match is None or match.group(1) == UTD_SCHOOL_ID:
        return None

    return match.group(1)


def _fetch_professor_summary(professor_id: str) -> _ProfessorSummary | None:
    data = _post_graphql(_professor_query(professor_id), professor_id)
    node = _nested_dict(data, "data", "node")
    if node is None:
        return None

    first_name = _optional_str(node.get("firstName"))
    last_name = _optional_str(node.get("lastName"))
    if first_name is None or last_name is None:
        return None

    return _ProfessorSummary(
        first_name=first_name,
        last_name=last_name,
        department=_optional_str(node.get("department")),
        avg_rating=_optional_float(node.get("avgRating")),
        avg_difficulty=_optional_float(node.get("avgDifficulty")),
        would_take_again_percent=_optional_float(node.get("wouldTakeAgainPercent")),
        num_ratings=_optional_int(node.get("numRatings")) or 0,
    )


def _fetch_professor_tags(professor_id: str, num_ratings: int) -> list[str]:
    if num_ratings <= 0:
        return []

    data = _post_graphql(_ratings_query(professor_id, num_ratings), professor_id)
    ratings = _nested_list(data, "data", "node", "ratings", "edges")
    if ratings is None:
        return []

    tags_counter: Counter[str] = Counter()
    for rating in ratings:
        node = _nested_dict(rating, "node")
        if node is None:
            continue

        raw_tags = _optional_str(node.get("ratingTags"))
        if raw_tags is None:
            continue

        for tag in raw_tags.split("--"):
            normalized_tag = _title_case_tag(tag)
            if normalized_tag:
                tags_counter[normalized_tag] += 1

    top_tags = [tag for tag, _count in tags_counter.most_common(5)]
    return sorted(top_tags)


def _post_graphql(payload: dict[str, object], professor_id: str) -> dict[str, Any]:
    response = httpx.post(
        RATE_MY_PROFESSORS_GRAPHQL_URL,
        json=payload,
        headers=_headers(professor_id),
        timeout=REQUEST_TIMEOUT_SECONDS,
    )
    response.raise_for_status()

    data = response.json()
    if not isinstance(data, dict):
        raise TypeError("RMP GraphQL response was not a JSON object")

    return data


def _professor_query(professor_id: str) -> dict[str, object]:
    return {
        "query": (
            "query RatingsListQuery($id: ID!) {"
            "node(id: $id) {"
            "... on Teacher {"
            "school {id} courseCodes {courseName courseCount} firstName lastName "
            "numRatings avgDifficulty avgRating department wouldTakeAgainPercent"
            "}"
            "}"
            "}"
        ),
        "variables": {
            "id": _graphql_teacher_id(professor_id),
        },
    }


def _ratings_query(professor_id: str, num_ratings: int) -> dict[str, object]:
    return {
        "query": (
            "query RatingsListQuery($count: Int! $id: ID! $courseFilter: String $cursor: String) {"
            "node(id: $id) {"
            "... on Teacher {"
            "ratings(first: $count, after: $cursor, courseFilter: $courseFilter) {"
            "edges {node {ratingTags}}"
            "}"
            "}"
            "}"
            "}"
        ),
        "variables": {
            "id": _graphql_teacher_id(professor_id),
            "count": num_ratings,
        },
    }


def _headers(professor_id: str | None = None) -> dict[str, str]:
    headers = {
        "Authorization": "Basic dGVzdDp0ZXN0",
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
        ),
        "Content-Type": "application/json",
    }

    if professor_id is not None:
        headers["Referer"] = f"https://www.ratemyprofessors.com/ShowRatings.jsp?tid={professor_id}"

    return headers


def _graphql_teacher_id(professor_id: str) -> str:
    return base64.b64encode(f"Teacher-{professor_id}".encode()).decode()


def _clean_professor_id_search_name(professor_name: str) -> str:
    return re.sub(r"[^a-zA-Z0-9]+", "", professor_name).lower()


def _display_name(first_name: str, last_name: str) -> str:
    name = f"{first_name.split()[0]} {last_name.split()[-1]}".strip()
    if name == "Chitturi Bhadrachalam":
        return "Bhadrachalam Chitturi"

    return name


def _cap_float(value: float | None, maximum: float) -> float | None:
    if value is None:
        return None

    return min(maximum, value)


def _cap_int(value: float | None, maximum: int) -> int | None:
    if value is None or value < 0:
        return None

    return min(maximum, round(value))


def _title_case_tag(tag: str) -> str:
    return " ".join(word.capitalize() for word in tag.strip().split())


def _nested_dict(data: object, *keys: str) -> dict[str, Any] | None:
    current = data
    for key in keys:
        if not isinstance(current, dict):
            return None
        current = current.get(key)

    if not isinstance(current, dict):
        return None

    return current


def _nested_list(data: object, *keys: str) -> list[Any] | None:
    current = data
    for key in keys:
        if not isinstance(current, dict):
            return None
        current = current.get(key)

    if not isinstance(current, list):
        return None

    return current


def _is_special_case_professor(professor_name: str) -> bool:
    return _clean_professor_id_search_name(professor_name) in SPECIAL_CASE_PROFESSOR_IDS


def _summary_matches_query(professor_name: str, summary: _ProfessorSummary) -> bool:
    query_parts = _normalized_name_parts(professor_name)
    if not query_parts:
        return False

    first_name_parts = _normalized_name_parts(summary.first_name)
    last_name_parts = _normalized_name_parts(summary.last_name)
    if not first_name_parts or not last_name_parts:
        return False

    result_first_name = first_name_parts[0]
    result_last_name = last_name_parts[-1]
    if len(query_parts) == 1:
        query_name = query_parts[0]
        return query_name in {
            result_first_name,
            result_last_name,
            f"{result_first_name}{result_last_name}",
        }

    return _name_part_matches(result_first_name, query_parts) and _name_part_matches(
        result_last_name, query_parts
    )


def _name_part_matches(result_part: str, query_parts: list[str]) -> bool:
    return any(
        result_part.startswith(query_part) or query_part.startswith(result_part)
        for query_part in query_parts
    )


def _normalized_name_parts(name: str) -> list[str]:
    return re.findall(r"[a-z0-9]+", name.lower())


def _optional_str(value: object) -> str | None:
    if isinstance(value, str):
        return value

    return None


def _optional_float(value: object) -> float | None:
    if isinstance(value, int | float):
        return float(value)

    return None


def _optional_int(value: object) -> int | None:
    if isinstance(value, int | float):
        return int(value)

    return None
