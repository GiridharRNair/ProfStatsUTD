import type { ReactElement } from "react"

import { cn } from "~lib/utils"

/** Indeterminate loading indicator shown in place of button text. */
export function Spinner({ className }: { className?: string }): ReactElement {
    return (
        <svg
            className={cn("h-4 w-4 animate-spin", className)}
            viewBox="0 0 24 24"
            fill="none"
            role="status"
            aria-label="Loading"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
            />
        </svg>
    )
}
