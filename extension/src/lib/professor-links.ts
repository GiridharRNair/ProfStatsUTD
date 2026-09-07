import type { ProfessorInfoResponse } from "~types/api"

/**
 * External links for a looked-up professor, matching the URLs the legacy
 * extension used. URLSearchParams handles the encoding, which also fixes
 * names of three or more parts: the old code called `name.replace(" ", "+")`,
 * and a string pattern only replaces the first match.
 */
export function rateMyProfessorsUrl(id: string): string {
    return `https://www.ratemyprofessors.com/professor/${encodeURIComponent(id)}`
}

export function utdGradesUrl(professor: ProfessorInfoResponse): string {
    const course = `${professor.subject}${professor.course_number}`
    const search = new URLSearchParams({ search: `${course} ${professor.name}` })
    return `https://utdgrades.com/results?${search}`
}

/**
 * UTD Trends wants "SUBJECT NUMBER,Name" where UTD Grades wants
 * "SUBJECTNUMBER Name", so the course is formatted differently here.
 */
export function utdTrendsUrl(professor: ProfessorInfoResponse): string {
    const course = `${professor.subject} ${professor.course_number}`
    const search = new URLSearchParams({ searchTerms: `${course},${professor.name}` })
    return `https://trends.utdnebula.com/dashboard?${search}`
}
