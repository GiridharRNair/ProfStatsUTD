# ProfStats Modernization Plan

This plan migrates ProfStats incrementally from a Vite React extension plus Go/SQLite/Azure backend to a Plasmo TypeScript extension plus FastAPI/Supabase/Vercel backend.

The guiding rule is to preserve one working path at every step. The extension should continue to return professor ratings and grade distributions while individual pieces are replaced.

## Target Architecture

```text
extension/          Plasmo + React + TypeScript Chrome extension
api/                FastAPI app deployed as Vercel Python serverless functions
scripts/            Python data import and maintenance scripts
supabase/           SQL schema files, indexes, and optional database functions
raw_data/           Source grade distribution files
```

## Product Scope

Keep:

- Professor lookup for a specific course.
- Course-aware professor and course suggestions.
- Grade distribution chart.
- Live RateMyProfessors ratings.
- Links to RateMyProfessors and UTD Grades.

Remove:

- Compare professor mode.
- Standalone course-only grade distribution lookup.
- Professor-only grade distribution lookup.
- Links to UTD Trends.
- Links to UTD profiles.
- Theme toggle.
- Feedback link.
- Review prompt.
- Recent query history.
- The Go backend.
- Startup-time SQLite database generation.
- Azure/Docker deployment path.

Course data remains part of the model because every grade distribution result must be professor-specific and course-specific. The removed behaviors are aggregating a course across all professors and aggregating a professor across all courses.

## Backend Strategy

The Vercel backend should be a thin read layer:

```text
GET /health
GET /suggestions?teacher=&course=
GET /professor_info?teacher=&course=
```

Initial route names should match the existing API to reduce frontend migration risk. Cleaner route names can be introduced later after the Plasmo migration is stable.

Responsibilities:

- Require and validate both professor and course inputs for professor information requests.
- Query Supabase for professor suggestions, course suggestions, and aggregated grades.
- Fetch RateMyProfessors ratings live during professor lookup.
- Return grade data even if RateMyProfessors is unavailable.
- Avoid importing or mutating grade data from serverless request handlers.

RateMyProfessors should remain live for now to keep the system simple. The API should treat RMP data as optional metadata:

```json
{
  "name": "Timothy Farage",
  "department": "Computer Science",
  "rating": 4.2,
  "difficulty": 2.1,
  "would_take_again": 78,
  "tags": ["Amazing Lectures", "Test Heavy"],
  "grades": {
    "aPlus": 1026,
    "a": 1186
  }
}
```

If RMP lookup fails, the response should still include course-specific grades with nullable rating fields and an empty tag list.

## Supabase Data Model

Start with one table that mirrors the useful parts of the current SQLite table, plus import metadata:

```sql
grade_sections (
    id bigint generated always as identity primary key,
    term text not null,
    subject text not null,
    catalog_number text not null,
    section text,
    instructor_name text not null,
    instructor_search_name text not null,
    a_plus integer not null default 0,
    a integer not null default 0,
    a_minus integer not null default 0,
    b_plus integer not null default 0,
    b integer not null default 0,
    b_minus integer not null default 0,
    c_plus integer not null default 0,
    c integer not null default 0,
    c_minus integer not null default 0,
    d_plus integer not null default 0,
    d integer not null default 0,
    d_minus integer not null default 0,
    f integer not null default 0,
    cr integer not null default 0,
    nc integer not null default 0,
    p integer not null default 0,
    w integer not null default 0,
    i integer not null default 0,
    nf integer not null default 0,
    source_file text not null,
    imported_at timestamptz not null default now()
)
```

Recommended indexes:

```sql
create extension if not exists pg_trgm;

create index grade_sections_professor_trgm_idx
    on grade_sections using gin (instructor_search_name gin_trgm_ops);

create index grade_sections_course_idx
    on grade_sections (subject, catalog_number);

create index grade_sections_professor_course_idx
    on grade_sections (instructor_search_name, subject, catalog_number);
```

Add a uniqueness strategy during the importer phase. A practical initial key is:

```text
source_file + subject + catalog_number + section + instructor_name
```

If source files contain duplicate sections or cross-listed sections, revisit this after validating the raw data.

## Import Script Strategy

Create `scripts/import_grades.py`.

Responsibilities:

- Parse current CSV files and future Excel files.
- Normalize grade column variants.
- Normalize professor names using the current edge-case mapping.
- Derive term from filename.
- Upsert or replace rows in Supabase.
- Run idempotently.
- Print import summary counts.

Initial implementation can support the existing CSV files first. Add Excel support with `openpyxl` or `pandas` only when a real XLSX input is available.

The importer should use Supabase service credentials or a direct Postgres connection from local development/CI. These credentials must not be shipped in the extension.

## Incremental Migration Phases

### Phase 1: Planning and Contract Freeze

- Add this plan.
- Document the current API response shape.
- Add sample JSON fixtures for professor lookup and suggestions.
- Decide whether the public API route names stay legacy-compatible for v1.
- Document that `/professor_info` requires both `teacher` and `course`.

Exit criteria:

- A developer can see exactly which features are being kept and removed.
- The next phase can be implemented without changing frontend behavior.

### Phase 2: Supabase Schema and Importer

- Add `supabase/schemas/grade_sections.sql`.
- Add `scripts/import_grades.py`.
- Verify importer behavior with dry runs against `raw_data/*.csv`.
- Import local `raw_data/*.csv` into a Supabase development project.

Exit criteria:

- Supabase contains the same grade data currently generated into SQLite.
- The import can be rerun without duplicating rows.

### Phase 3: FastAPI Backend Beside Existing Go API

- Add FastAPI implementation under `api/`.
- Keep Go files temporarily if needed, or move the Python API into `server/` during transition to avoid path conflicts.
- Implement:
  - `/health`,
  - `/suggestions`,
  - `/professor_info`.
- Query Supabase for grade data.
- Port professor/course validation.
- Reject professor-only and course-only grade distribution requests.
- Port live RateMyProfessors lookup.
- Make RMP failure non-fatal.
- Verify backend behavior with manual local requests.

Exit criteria:

- FastAPI returns professor and suggestion responses for known professor-plus-course queries.
- FastAPI does not depend on SQLite or Go.
- Local extension can point to FastAPI with an env var.

### Phase 4: Vercel Deployment

- Add `vercel.json` if needed.
- Add Python dependency file.
- Configure environment variables:
  - `SUPABASE_URL`,
  - `SUPABASE_SECRET_KEY` for trusted backend/importer writes, or a publishable key only for explicitly public read paths,
  - allowed extension origins.
- Deploy FastAPI to a Vercel preview environment.
- Smoke test health, suggestions, and professor lookup.

Exit criteria:

- Vercel preview API can serve the existing extension.
- No import path runs inside serverless request handlers.

### Phase 5: Require Professor Plus Course and Remove Compare From Existing UI

- Remove compare button and second lookup form.
- Remove course-only submit behavior.
- Remove professor-only submit behavior.
- Require both professor and course before submit.
- Remove `CourseResults`.
- Remove theme toggle, feedback modal, review prompt, and recent query persistence.
- Remove UTD Trends and UTD profile links from professor details.
- Update validation copy so professor and course are both required.

Exit criteria:

- Current UI works against the new FastAPI backend.
- Users cannot submit a course-only lookup.
- Users cannot submit a professor-only lookup.
- The popup has no compare, theme, feedback, review, or recent-history UI.
- Professor details only link to RateMyProfessors and UTD Grades.
- No compare state is stored or rendered.

### Phase 6: Plasmo TypeScript Migration

- Create Plasmo app structure under `extension/`.
- Port popup UI to TypeScript.
- Define API response types.
- Move shared constants and validation into typed modules.
- Copy extension assets and manifest metadata.
- Keep the popup behavior equivalent to Phase 5 before redesigning.

Exit criteria:

- Plasmo builds a Manifest V3 extension.
- Popup supports professor-plus-course lookup, suggestions, chart, RateMyProfessors links, and UTD Grades links.
- Existing Vite extension can be removed.

### Phase 7: Cleanup

- Remove Go backend and Docker/Azure artifacts.
- Remove SQLite generation from runtime scripts.
- Update README with:
  - Supabase setup,
  - importer usage,
  - FastAPI local development,
  - Vercel deployment,
  - Plasmo extension development.
- Update package scripts for the final repo shape.

Exit criteria:

- The repo no longer advertises or depends on Go, Azure, Docker, or startup SQLite.
- New contributors can run importer, backend, and extension independently.

## Risk Register

RateMyProfessors availability:

- Live RMP lookup can be slow or fail.
- Mitigation: return grades even when ratings fail; add caching later only if needed.

Supabase search quality:

- Professor names may differ across UTD Grades and RMP.
- Mitigation: keep alias/edge-case mapping in Python and reuse it in API normalization.

Serverless cold starts:

- Python FastAPI on Vercel can have cold starts.
- Mitigation: keep dependencies small and move heavy import/data work outside request handlers.

Big-bang migration risk:

- Replacing frontend, backend, database, and deployment all at once would make debugging hard.
- Mitigation: keep legacy-compatible API routes until the backend and data migration are stable.

## First Implementation Slice

The first code slice should be Phase 2 only:

1. Add Supabase migration SQL.
2. Add CSV importer.
3. Validate the imported row count against the current raw data.

This creates the foundation without disturbing the working extension or Go backend.
