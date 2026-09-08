import { useEffect, useState } from "react"

import { fetchSuggestions } from "~lib/api"
import type { SuggestionsResponse } from "~types/api"

/** Long enough to skip most intermediate keystrokes, short enough to feel live. */
const DEBOUNCE_MS = 100

const EMPTY: SuggestionsResponse = { professors: [], courses: [] }

/**
 * Debounced professor and course suggestions.
 *
 * One request serves both fields: the backend narrows course suggestions by
 * the professor query, so both values are sent together. Failures are
 * swallowed because suggestions are an aid, not a requirement for lookup.
 */
export function useSuggestions(teacher: string, course: string): SuggestionsResponse {
    const [suggestions, setSuggestions] = useState<SuggestionsResponse>(EMPTY)

    const teacherQuery = teacher.trim()
    const courseQuery = course.trim()
    const hasQuery = teacherQuery !== "" || courseQuery !== ""

    useEffect(() => {
        if (!hasQuery) {
            return
        }

        const controller = new AbortController()
        const timer = setTimeout(() => {
            fetchSuggestions(
                { teacher: teacherQuery, course: courseQuery },
                { signal: controller.signal }
            )
                .then(setSuggestions)
                .catch(() => {
                    // Superseded, aborted, or failed: keep whatever is on screen.
                })
        }, DEBOUNCE_MS)

        return () => {
            clearTimeout(timer)
            controller.abort()
        }
    }, [teacherQuery, courseQuery, hasQuery])

    // Derived rather than cleared in the effect, so emptying both fields drops
    // the stale list immediately instead of one render later.
    return hasQuery ? suggestions : EMPTY
}
