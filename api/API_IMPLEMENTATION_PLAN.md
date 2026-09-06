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
  requirements.txt
  app/
    __init__.py
    main.py
    config.py
    models.py
    validation.py
    routes/
      __init__.py
      health.py
      professor.py
      suggestions.py
    services/
      __init__.py
      grades.py
      rate_my_professors.py
      suggestions.py
    clients/
      __init__.py
      supabase.py
    utils/
      __init__.py
      names.py
      courses.py
```

File responsibilities:

- `index.py`: Vercel entrypoint that exposes the FastAPI app.
- `requirements.txt`: Python dependencies needed by Vercel.
- `app/main.py`: creates the FastAPI app, registers middleware and routes.
- `app/config.py`: reads environment variables and constants.
- `app/models.py`: response models and shared typed structures.
- `app/validation.py`: request validation for professor and course inputs.
- `app/routes/health.py`: health check route.
- `app/routes/professor.py`: `/professor_info` route.
- `app/routes/suggestions.py`: `/suggestions` route.
- `app/services/grades.py`: grade aggregation queries.
- `app/services/rate_my_professors.py`: live RMP lookup and response normalization.
- `app/services/suggestions.py`: professor and course suggestion queries.
- `app/clients/supabase.py`: Supabase client construction.
- `app/utils/names.py`: professor name normalization helpers.
- `app/utils/courses.py`: course parsing and formatting helpers.

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

1. Add `api/requirements.txt` with the minimal dependencies. Done

2. Add `api/app/__init__.py` and empty package marker files for `routes`, `services`, `clients`, and `utils`. Done

3. Add `api/app/config.py` with environment variable loading for `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, and `ALLOWED_EXTENSION_ORIGIN`. Done

4. Add `api/app/main.py` with a FastAPI app factory and CORS middleware. Done

5. Add `api/index.py` as the Vercel entrypoint that imports the FastAPI app. Done

6. Add `api/app/routes/health.py` with `GET /health`.

7. Wire the health route into `app/main.py`.

8. Run the API locally and verify `GET /health` returns `{ "status": "ok" }`.

9. Add `api/app/utils/courses.py` with course parsing equivalent to the legacy Go validator.

10. Add `api/app/utils/names.py` with professor name normalization and known edge-case aliases.

11. Add `api/app/models.py` with response shapes for grades, professor info, and suggestions.

12. Add `api/app/clients/supabase.py` to create a Supabase client from environment variables.

13. Add `api/app/services/grades.py` with a function that aggregates grades by required professor and course.

14. Add `api/app/services/suggestions.py` with professor suggestions and course suggestions backed by Supabase.

15. Add `api/app/routes/suggestions.py` with `GET /suggestions`.

16. Wire the suggestions route into `app/main.py`.

17. Add `api/app/services/rate_my_professors.py` with the live RMP professor search and details lookup.

18. Add `api/app/routes/professor.py` with `GET /professor_info`.

19. Make `/professor_info` reject missing `teacher`.

20. Make `/professor_info` reject missing `course`.

21. Make `/professor_info` reject invalid professor names.

22. Make `/professor_info` reject invalid course names.

23. Make `/professor_info` return grade data even when RMP lookup fails.

24. Wire the professor route into `app/main.py`.

25. Run local manual checks for:

```text
GET /health
GET /suggestions?teacher=farage&course=cs2305
GET /professor_info?teacher=Timothy%20Farage&course=CS2305
GET /professor_info?teacher=Timothy%20Farage
GET /professor_info?course=CS2305
```

26. Add Vercel config only if the default Python function discovery does not work.

27. Update root scripts only after the local FastAPI API is usable.

28. Keep `legacy-api-go/` until the FastAPI backend has been verified against Supabase and the frontend no longer depends on the old Go server.

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
