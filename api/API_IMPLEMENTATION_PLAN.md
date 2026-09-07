# FastAPI Implementation Plan

This document defines the intended API structure and the atomic steps to build the new Python FastAPI backend. No Python implementation should be added until this plan is reviewed.

## Intended API Behavior

The API should replace the legacy Go backend while keeping the frontend migration low-risk.

Initial endpoints:

```text
GET /health
GET /suggestions?teacher=&course=
GET /professor_info?teacher=&course=
```

Important behavior:

- `/professor_info` requires both `teacher` and `course`.
- Professor-only grade distributions are not allowed.
- Course-only grade distributions are not allowed.
- Grade data comes from Supabase.
- RateMyProfessors data is fetched live per professor lookup.
- RateMyProfessors failures should not prevent grade data from returning.
- The API should be deployable as a Vercel Python serverless function.

## Ideal File Structure

```text
api/
  API_IMPLEMENTATION_PLAN.md
  index.py
  app/
    __init__.py
    main.py
    config.py
    models/
      __init__.py
      grades.py
      professor.py
      suggestions.py
    routes/
      __init__.py
      health.py
      professor.py
      suggestions.py
    services/
      __init__.py
      supabase.py
      rate_my_professors.py
```

File responsibilities:

- `index.py`: Vercel entrypoint that exposes the FastAPI app.
- `pyproject.toml`: `[project]` dependencies Vercel installs via uv, plus ruff and mypy configuration.
- `app/main.py`: creates the FastAPI app, registers middleware and routes.
- `app/config.py`: reads environment variables and constants.
- `app/models/`: response models split by API response area.
- `app/routes/health.py`: health check route.
- `app/routes/professor.py`: `/professor_info` route.
- `app/routes/suggestions.py`: `/suggestions` route.
- `app/services/supabase.py`: Supabase client construction, grade aggregation queries, professor suggestions, and course suggestions.
- `app/services/rate_my_professors.py`: live RMP lookup and response normalization.

## Environment Variables

Required for deployed API:

```text
SUPABASE_URL
SUPABASE_SECRET_KEY
```

Optional:

```text
ALLOWED_EXTENSION_ORIGIN
```

The secret key must stay server-side only. It should never be exposed in the Chrome extension.

## Atomic Implementation Steps

1. Declare the minimal runtime dependencies in `api/pyproject.toml`. Done

2. Add `api/app/__init__.py` and empty package marker files for `routes` and `services`. Done

3. Add `api/app/config.py` with environment variable loading for `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, and `ALLOWED_EXTENSION_ORIGIN`. Done

4. Add `api/app/main.py` with a FastAPI app factory and CORS middleware. Done

5. Add `api/index.py` as the Vercel entrypoint that imports the FastAPI app. Done

6. Add `api/app/routes/health.py` with `GET /health`. Done

7. Wire the health route into `app/main.py`. Done

8. Run the API locally and verify `GET /health` returns `{ "status": "ok" }`. Done

9. Add API development tooling and runtime dependencies (runtime in `api/pyproject.toml`, local tooling in `requirements-dev.txt`): Done
   - `httpx` for outbound RateMyProfessors requests,
   - `supabase` for Supabase access,
   - `ruff` for linting and formatting,
   - `mypy` for static type checking.

10. Add API tool configuration: Done
    - configure Ruff for the `api/` package,
    - configure mypy for the `api/` package,
    - keep configuration local to the API so it does not accidentally lint the legacy Go API or existing frontend.

11. Run the initial API quality checks before adding more code: Done
    - Ruff lint,
    - Ruff format check,
    - mypy.

12. Add `api/app/services/rate_my_professors.py`. Done

13. In `rate_my_professors.py`, define a `RateMyProfessorsResult` structure with these fields: Done
    - `id`,
    - `name`,
    - `department`,
    - `rating`,
    - `difficulty`,
    - `would_take_again`,
    - `tags`.

14. In `rate_my_professors.py`, port the legacy UTD school id constant: Done
    - `UTD_SCHOOL_ID = "1273"`.

15. In `rate_my_professors.py`, add a function that searches RateMyProfessors for a professor id from a professor name. Done

16. In `rate_my_professors.py`, preserve the current special-case id mapping for known RMP search misses, including Bo Park. Done

17. In `rate_my_professors.py`, add a function that fetches the professor summary from RMP GraphQL by professor id. Done

18. In `rate_my_professors.py`, add a function that fetches professor tags from RMP GraphQL. Done

19. In `rate_my_professors.py`, normalize RMP output to match the API response shape: Done
    - rating and difficulty capped at `5`,
    - would-take-again capped at `100`,
    - tags title-cased and limited to the five most frequent tags,
    - middle names removed from the display name where needed.

20. In `rate_my_professors.py`, expose one public function: Done
    - `get_professor_rating(professor_name: str) -> RateMyProfessorsResult | None`.

21. Make `get_professor_rating` return `None` for not-found or RMP failures instead of raising route-level errors. Done

22. Run Ruff and mypy after the RMP service is added. Done

23. Manually verify the RMP service from a Python shell with at least: Done
    - `Timothy Farage`,
    - one professor that should not be found or should fail gracefully.

24. Add `api/app/services/supabase.py`. Done

25. In `supabase.py`, create a Supabase REST query helper from: Done
    - `SUPABASE_URL`,
    - `SUPABASE_SECRET_KEY`.

26. In `supabase.py`, fail clearly if either Supabase environment variable is missing. Done

27. In `supabase.py`, add `normalize_professor_search_name(name: str) -> str` for database search only. Done

28. In `supabase.py`, add `get_professor_suggestions(teacher_query: str) -> list[str]` using normalized Supabase/Postgres search against `instructor_search_name`. Done

29. Keep professor suggestions on normalized `ilike` matching for now. Done
    Start with normalized `ilike` matching. If quality is weak later, replace it with a Postgres RPC that uses the existing `pg_trgm` index.

30. In `supabase.py`, add `parse_course_query(course_query: str) -> tuple[str, str]`. Done

31. Keep course parsing narrow: Done
    - accept `CS 2305` and `CS2305`,
    - return `("CS", "2305")`,
    - reject missing values,
    - reject values without a subject and catalog number,
    - do not fetch course names,
    - do not fetch course catalog pages.

32. In `supabase.py`, add `get_course_suggestions(teacher_query: str, course_query: str) -> list[str]`. Done

33. Implement course suggestions using Supabase/Postgres search against `subject` and `catalog_number`. Done
    The query should support partial course input like `CS`, `CS 2`, and `CS2305`.

34. In `supabase.py`, add `get_aggregated_grades(teacher: str, subject: str, catalog_number: str) -> dict`. Done

35. Make grade aggregation require all three values: Done
    - normalized professor search name,
    - subject,
    - catalog number.

36. Make grade aggregation sum every grade column from `grade_sections` and return the database grade field names unchanged: Done
    - `a_plus`,
    - `a`,
    - `a_minus`,
    - `b_plus`,
    - `b`,
    - `b_minus`,
    - `c_plus`,
    - `c`,
    - `c_minus`,
    - `d_plus`,
    - `d`,
    - `d_minus`,
    - `f`,
    - `cr`,
    - `nc`,
    - `p`,
    - `w`,
    - `i`,
    - `nf`.

37. Run Ruff and mypy after the Supabase service is added. Done

38. Add `api/app/routes/suggestions.py` with a route skeleton for `GET /suggestions`. Done

39. The suggestions route should read `teacher` and `course` query parameters as optional strings. Done

40. The suggestions route should call only `app/services/supabase.py`; do not add a separate suggestions service module. Done

41. The suggestions route should return: Done
    - `professors`,
    - `courses`.

42. Wire the suggestions route into `app/main.py`. Done

43. Run Ruff and mypy after the suggestions route skeleton is wired. Done

44. Manually verify `GET /suggestions` returns a valid response shape before tuning search behavior. Done

45. Add `api/app/routes/professor.py` with a route skeleton for `GET /professor_info`. Done
    Request parameter normalization should start here, after the route handler exists.

46. The professor route should normalize and validate the `teacher` request parameter inline. Done

47. The professor route should reject missing `teacher` with HTTP 400 and a clear `detail` message. Done

48. The professor route should reject invalid professor names inline using the legacy validation rule: Done
    - letters,
    - spaces,
    - periods,
    - hyphens,
    - no repeated hyphen patterns.

49. The professor route should normalize and validate the `course` request parameter by calling `parse_course_query` from `app/services/supabase.py`. Done

50. The professor route should reject missing or invalid `course` with HTTP 400 and a clear `detail` message. Done

51. Add `api/app/models/`. Done

52. In `models/grades.py`, define the response shape for grade totals using the database grade field names: Done
    - `a_plus`,
    - `a`,
    - `a_minus`,
    - and so on.

53. In `models/professor.py`, define the response shape for professor info: Done
    - `id`,
    - `name`,
    - `department`,
    - `grades`,
    - `subject`,
    - `course_number`,
    - `rating`,
    - `difficulty`,
    - `would_take_again`,
    - `tags`.

54. In `models/suggestions.py`, define the response shape for suggestions: Done
    - `professors`,
    - `courses`.

55. Finish the professor route by calling `get_aggregated_grades`. Done

56. Finish the professor route by calling `get_professor_rating`. Done

57. Make the professor route return grades even if `get_professor_rating` returns `None`. Done

58. If RMP data is unavailable, return nullable rating metadata: Done
    - `id: null`,
    - `department: null`,
    - `rating: null`,
    - `difficulty: null`,
    - `would_take_again: null`,
    - `tags: []`.

59. Wire the professor route into `app/main.py`. Done

60. Run Ruff and mypy after the professor route is wired. Done

61. Run local manual checks for: Done

```text
GET /health
GET /suggestions?teacher=farage&course=cs2305
GET /professor_info?teacher=Timothy%20Farage&course=CS2305
GET /professor_info?teacher=Timothy%20Farage
GET /professor_info?course=CS2305
```

62. Confirm the missing-parameter requests return HTTP 400: Done
    - `/professor_info?teacher=Timothy%20Farage`,
    - `/professor_info?course=CS2305`.

63. Confirm `/professor_info?teacher=Timothy%20Farage&course=CS2305` returns: Done
    - course-specific grade totals from Supabase,
    - live RMP metadata when available,
    - the agreed top-level API field names.

64. Add Vercel config only if the default Python function discovery does not work.

65. Update root scripts only after the local FastAPI API is usable. Done: the root package.json was removed with the legacy Vite app; the importer is invoked directly with python3.

66. Keep `legacy-api-go/` until the FastAPI backend has been verified against Supabase and the frontend no longer depends on the old Go server. Done: verified against production, then deleted.

## Manual Verification Checklist

Before deleting the legacy Go API:

- Health route works locally.
- Suggestions route returns professor and course suggestions from Supabase.
- Professor route requires both professor and course.
- Professor route returns course-specific grade totals.
- Professor route includes live RMP metadata when available.
- Professor route still returns grades when RMP metadata is unavailable.
- CORS allows the extension origin.
- Vercel preview deployment can reach Supabase.
