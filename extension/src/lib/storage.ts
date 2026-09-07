import type { ProfessorInfoResponse } from "~types/api"

const LAST_PROFESSOR_KEY = "profstats.last-professor"

/**
 * The popup unmounts every time it closes, so the last result is cached to
 * survive a reopen. `chrome.storage.local` is used when available, with a
 * localStorage fallback so the popup also works when opened as a plain page.
 */
function hasChromeStorage(): boolean {
    return typeof chrome !== "undefined" && chrome.storage?.local !== undefined
}

export async function loadLastProfessor(): Promise<ProfessorInfoResponse | null> {
    try {
        if (hasChromeStorage()) {
            const stored = await chrome.storage.local.get(LAST_PROFESSOR_KEY)
            return (stored[LAST_PROFESSOR_KEY] as ProfessorInfoResponse) ?? null
        }

        const raw = localStorage.getItem(LAST_PROFESSOR_KEY)
        return raw === null ? null : (JSON.parse(raw) as ProfessorInfoResponse)
    } catch {
        // A cache miss is not worth surfacing; fall back to the sample.
        return null
    }
}

export async function saveLastProfessor(professor: ProfessorInfoResponse): Promise<void> {
    try {
        if (hasChromeStorage()) {
            await chrome.storage.local.set({ [LAST_PROFESSOR_KEY]: professor })
            return
        }

        localStorage.setItem(LAST_PROFESSOR_KEY, JSON.stringify(professor))
    } catch {
        // Persistence is best effort; the lookup already succeeded.
    }
}
