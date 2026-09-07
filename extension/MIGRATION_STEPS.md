# Plasmo Extension Migration Steps

## Goal

Migrate the Chrome extension to Plasmo with React and TypeScript while simplifying the popup workflow to require both professor and course before lookup.

Make sure to use Shadcn components.

## Steps

1. Create the Plasmo app structure under `extension/`. Done
2. Create a new Chrome extension manifest for the Plasmo app, including fresh metadata, permissions, and popup configuration. Existing icon artwork can be reused. Done
3. Add TypeScript API types for `/suggestions` and `/professor_info`. Done
4. Implement a typed API client using `PLASMO_PUBLIC_API_URL`, with a local API fallback. Done
5. Build one popup form with professor and course inputs.
6. Fetch professor and course suggestions from `/suggestions?teacher=&course=`.
7. Validate that both professor and course are present before submit.
8. Submit only to `/professor_info?teacher=&course=`.
9. Render professor details, ratings, tags, and grade distribution.
10. Keep only RateMyProfessors and UTD Grades links in professor details.
11. Remove compare UI, second lookup form, course-only lookup, professor-only lookup, `CourseResults`, theme toggle, feedback modal, review prompt, and recent-query persistence.
12. Replace Chakra UI with shadcn components where useful; use a chart library for the grade graph.
13. Delete the legacy Vite/CRX extension after the new Plasmo extension is complete.
14. Verify with TypeScript checks, Plasmo build, and a local smoke test against the FastAPI backend.

## API Contract

The popup should call only these backend endpoints:

```text
GET /suggestions?teacher=<professor query>&course=<course query>
GET /professor_info?teacher=<professor name>&course=<course code>
```

`/professor_info` requires both `teacher` and `course`. The frontend should prevent professor-only and course-only submissions before sending a request.
