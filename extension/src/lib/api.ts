/**
 * Typed client for the ProfStats FastAPI backend.
 *
 * The base URL comes from `PLASMO_PUBLIC_API_URL`, which Plasmo inlines at
 * build time. When it is unset — the usual case while developing against a
 * local `uvicorn` process — the client falls back to the local API.
 */
import type {
    ApiErrorResponse,
    LookupQuery,
    ProfessorInfoResponse,
    SuggestionsResponse
} from "~types/api"

/** Default `uvicorn` address used when `PLASMO_PUBLIC_API_URL` is unset. */
export const LOCAL_API_URL = "http://localhost:8000"

/**
 * Requests are given a ceiling because `/professor_info` waits on a live
 * RateMyProfessors lookup, which can hang well past the backend's own timeouts.
 */
const DEFAULT_TIMEOUT_MS = 20000

export interface RequestOptions {
    /** Caller-owned signal, e.g. to drop a suggestion request that is stale. */
    signal?: AbortSignal
    /** Overrides {@link DEFAULT_TIMEOUT_MS}; pass 0 to disable the timeout. */
    timeoutMs?: number
}

/** Any non-2xx response, malformed body, or network failure. */
export class ApiError extends Error {
    /** HTTP status, or 0 when the request never produced a response. */
    readonly status: number

    constructor(message: string, status: number) {
        super(message)
        this.name = "ApiError"
        this.status = status
    }

    /** True when the API could not be reached at all. */
    get isNetworkError(): boolean {
        return this.status === 0
    }
}

/** Resolved base URL, without a trailing slash. */
export function getApiBaseUrl(): string {
    const configured = process.env.PLASMO_PUBLIC_API_URL?.trim()
    return (configured || LOCAL_API_URL).replace(/\/+$/, "")
}

/**
 * `GET /suggestions?teacher=&course=`
 *
 * Both fields are optional: course suggestions are narrowed by the professor
 * query when one is given, and the backend returns empty lists for a blank
 * query rather than an error.
 */
export function fetchSuggestions(
    query: Partial<LookupQuery>,
    options: RequestOptions = {}
): Promise<SuggestionsResponse> {
    return requestJson<SuggestionsResponse>(
        "/suggestions",
        {
            teacher: query.teacher,
            course: query.course
        },
        options
    )
}

/**
 * `GET /professor_info?teacher=&course=`
 *
 * The backend rejects professor-only and course-only lookups with a 400, so
 * callers should validate both fields before calling this.
 */
export function fetchProfessorInfo(
    query: LookupQuery,
    options: RequestOptions = {}
): Promise<ProfessorInfoResponse> {
    return requestJson<ProfessorInfoResponse>(
        "/professor_info",
        {
            teacher: query.teacher,
            course: query.course
        },
        options
    )
}

function buildUrl(path: string, params: Record<string, string | undefined>): string {
    const url = new URL(`${getApiBaseUrl()}${path}`)

    for (const [key, value] of Object.entries(params)) {
        const trimmed = value?.trim()
        if (trimmed) {
            url.searchParams.set(key, trimmed)
        }
    }

    return url.toString()
}

async function requestJson<T>(
    path: string,
    params: Record<string, string | undefined>,
    { signal, timeoutMs = DEFAULT_TIMEOUT_MS }: RequestOptions
): Promise<T> {
    const url = buildUrl(path, params)
    const controller = new AbortController()
    const deadline = linkAbort(controller, signal, timeoutMs)

    let response: Response
    try {
        response = await fetch(url, {
            method: "GET",
            headers: { Accept: "application/json" },
            signal: controller.signal
        })
    } catch (error) {
        // A caller-initiated cancellation is not an API failure; let it through
        // so callers can discard the result without surfacing an error.
        if (signal?.aborted) {
            throw error
        }
        throw new ApiError(
            deadline.expired
                ? `The API did not respond within ${Math.round(timeoutMs / 1000)} seconds.`
                : `Could not reach the API at ${getApiBaseUrl()}.`,
            0
        )
    } finally {
        deadline.clear()
    }

    if (!response.ok) {
        throw new ApiError(await readErrorDetail(response), response.status)
    }

    try {
        return (await response.json()) as T
    } catch {
        throw new ApiError("The API returned a malformed response.", response.status)
    }
}

interface Deadline {
    /** True once the timeout fired, which distinguishes it from a caller abort. */
    readonly expired: boolean
    /** Clears the timer and the caller-signal listener. */
    clear(): void
}

/** Aborts `controller` when the caller's signal aborts or the timeout elapses. */
function linkAbort(
    controller: AbortController,
    signal: AbortSignal | undefined,
    timeoutMs: number
): Deadline {
    let expired = false

    if (signal?.aborted) {
        controller.abort(signal.reason)
    }

    const onAbort = () => controller.abort(signal?.reason)
    signal?.addEventListener("abort", onAbort)

    const timer =
        timeoutMs > 0
            ? setTimeout(() => {
                  expired = true
                  controller.abort()
              }, timeoutMs)
            : undefined

    return {
        get expired() {
            return expired
        },
        clear() {
            signal?.removeEventListener("abort", onAbort)
            if (timer !== undefined) {
                clearTimeout(timer)
            }
        }
    }
}

async function readErrorDetail(response: Response): Promise<string> {
    try {
        const body = (await response.json()) as Partial<ApiErrorResponse>
        if (typeof body?.detail === "string" && body.detail) {
            return body.detail
        }
    } catch {
        // Fall through to the generic message below.
    }

    return `Request failed with status ${response.status}.`
}
