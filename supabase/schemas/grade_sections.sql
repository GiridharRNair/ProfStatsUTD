create extension if not exists pg_trgm;

create table if not exists public.grade_sections (
    id bigint generated always as identity primary key,
    term text not null,
    subject text not null,
    catalog_number text not null,
    section text not null,
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
    imported_at timestamptz not null default now(),
    constraint grade_sections_source_row_key unique (
        source_file,
        subject,
        catalog_number,
        section,
        instructor_name
    )
);

create index if not exists grade_sections_professor_trgm_idx
    on public.grade_sections using gin (instructor_search_name gin_trgm_ops);

create index if not exists grade_sections_course_idx
    on public.grade_sections (subject, catalog_number);

create index if not exists grade_sections_professor_course_idx
    on public.grade_sections (instructor_search_name, subject, catalog_number);
