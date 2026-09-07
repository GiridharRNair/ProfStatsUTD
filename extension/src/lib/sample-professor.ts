import type { ProfessorInfoResponse } from "~types/api"

/**
 * Shown on a first ever open so the popup demonstrates what a result looks
 * like instead of appearing empty. Replaced by the real cached result as soon
 * as one lookup succeeds.
 */
export const SAMPLE_PROFESSOR: ProfessorInfoResponse = {
    id: null,
    name: "Timothy Farage",
    department: "Computer Science",
    subject: "CS",
    course_number: "3345",
    rating: 4.2,
    difficulty: 2.1,
    would_take_again: 78,
    tags: ["Amazing lectures", "Caring", "Inspirational"],
    grades: {
        a_plus: 1026,
        a: 1186,
        a_minus: 612,
        b_plus: 430,
        b: 502,
        b_minus: 244,
        c_plus: 168,
        c: 190,
        c_minus: 96,
        d_plus: 44,
        d: 52,
        d_minus: 28,
        f: 210,
        cr: 0,
        nc: 0,
        p: 0,
        w: 148,
        i: 6,
        nf: 0
    }
}
