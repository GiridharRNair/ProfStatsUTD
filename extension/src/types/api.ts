/**
 * Response shapes for the ProfStats FastAPI backend.
 *
 * These mirror `api/app/models/*.py`. Keys stay snake_case because FastAPI
 * serializes the Pydantic field names as declared, without aliases.
 */

/** Aggregated grade counts for one professor teaching one course. */
export interface GradeTotals {
    a_plus: number
    a: number
    a_minus: number
    b_plus: number
    b: number
    b_minus: number
    c_plus: number
    c: number
    c_minus: number
    d_plus: number
    d: number
    d_minus: number
    f: number
    cr: number
    nc: number
    p: number
    w: number
    i: number
    nf: number
}

export type GradeKey = keyof GradeTotals

/**
 * `GET /professor_info?teacher=&course=`
 *
 * Grade fields are always present. RateMyProfessors metadata is optional: when
 * the live RMP lookup fails or finds no match, `id`, `department`, `rating`,
 * `difficulty`, and `would_take_again` are null and `tags` is empty.
 */
export interface ProfessorInfoResponse {
    /** RateMyProfessors professor id, used to build the RMP link. */
    id: string | null
    name: string
    department: string | null
    grades: GradeTotals
    /** Subject code the grades were aggregated for, e.g. `CS`. */
    subject: string
    /** Catalog number the grades were aggregated for, e.g. `3345`. */
    course_number: string
    /** Average rating out of 5. */
    rating: number | null
    /** Average difficulty out of 5. */
    difficulty: number | null
    /** Percentage of students who would take the professor again, 0-100. */
    would_take_again: number | null
    tags: string[]
}

/**
 * `GET /suggestions?teacher=&course=`
 *
 * Either list may be empty; the backend returns empty lists rather than an
 * error for blank or unparseable queries.
 */
export interface SuggestionsResponse {
    professors: string[]
    courses: string[]
}

/** FastAPI's `HTTPException` body. */
export interface ApiErrorResponse {
    detail: string
}

/** Query pair accepted by both endpoints. */
export interface LookupQuery {
    teacher: string
    course: string
}
