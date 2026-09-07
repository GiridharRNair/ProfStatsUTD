import type { ProfessorInfoResponse } from "~types/api"

/**
 * Shown on a first ever open so the popup demonstrates a result instead of
 * appearing empty. Replaced by the real cached result as soon as one lookup
 * succeeds.
 *
 * Captured from GET /professor_info?teacher=Timothy%20Farage&course=CS%202305
 * against production, so the figures are real rather than invented. It is a
 * snapshot: grade totals drift as new terms are imported.
 */
export const SAMPLE_PROFESSOR: ProfessorInfoResponse = {
    id: "138341",
    name: "Timothy Farage",
    department: "Computer Science",
    subject: "CS",
    course_number: "2305",
    rating: 4.2,
    difficulty: 2.1,
    would_take_again: 78,
    tags: [
        "Amazing Lectures",
        "Graded By Few Things",
        "Hilarious",
        "Respected",
        "Test Heavy"
    ],
    grades: {
        a_plus: 269,
        a: 406,
        a_minus: 102,
        b_plus: 76,
        b: 122,
        b_minus: 42,
        c_plus: 27,
        c: 82,
        c_minus: 26,
        d_plus: 16,
        d: 24,
        d_minus: 18,
        f: 31,
        cr: 20,
        nc: 5,
        p: 0,
        w: 25,
        i: 0,
        nf: 0
    }
}
