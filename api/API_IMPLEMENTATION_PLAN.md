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
- `requirements.txt`: Python dependencies needed by Vercel.
- `app/main.py`: creates the FastAPI app, registers middleware and routes.
- `app/config.py`: reads environment variables and constants.
- `app/models.py`: response models and shared typed structures.
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

1. Add `api/requirements.txt` with the minimal dependencies. Done

2. Add `api/app/__init__.py` and empty package marker files for `routes` and `services`. Done

3. Add `api/app/config.py` with environment variable loading for `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, and `ALLOWED_EXTENSION_ORIGIN`. Done

4. Add `api/app/main.py` with a FastAPI app factory and CORS middleware. Done

5. Add `api/index.py` as the Vercel entrypoint that imports the FastAPI app. Done

6. Add `api/app/routes/health.py` with `GET /health`. Done

7. Wire the health route into `app/main.py`. Done

8. Run the API locally and verify `GET /health` returns `{ "status": "ok" }`. Done

9. Add inline course input normalization in the relevant route handlers:
   - accept values like `CS 2305` and `CS2305`,
   - derive `subject` and `catalog_number`,
   - reject missing or invalid course values,
   - do not fetch course names,
   - do not fetch course catalog pages.

10. Add inline professor input normalization in the relevant route handlers.

11. Add `api/app/models.py` with response shapes for grades, professor info, and suggestions.

12. Add `api/app/services/supabase.py` to create a Supabase client from environment variables.

13. Add grade aggregation logic to `api/app/services/supabase.py`.

14. Add professor suggestion and course suggestion logic to `api/app/services/supabase.py`.

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
