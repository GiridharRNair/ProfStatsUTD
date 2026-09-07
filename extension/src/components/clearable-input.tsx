import { useRef, type ComponentProps, type ReactElement } from "react"

import { Input } from "~components/ui/input"

export interface ClearableInputProps extends ComponentProps<"input"> {
    value: string
    /** Resets the field; the clear control only appears once it is dirty. */
    onClear: () => void
}

/** Text input with an inline clear control shown while it has a value. */
export function ClearableInput({
    value,
    onClear,
    disabled,
    ...props
}: ClearableInputProps): ReactElement {
    const inputRef = useRef<HTMLInputElement>(null)

    function handleClear() {
        onClear()
        inputRef.current?.focus()
    }

    return (
        <div className="relative">
            <Input
                ref={inputRef}
                value={value}
                disabled={disabled}
                // h-8 trims shadcn's default h-9; pr-8 leaves room so long
                // values do not run under the clear control.
                className="h-8 pr-8 text-sm"
                {...props}
            />
            {value !== "" && !disabled && (
                <button
                    type="button"
                    onClick={handleClear}
                    aria-label={`Clear ${props["aria-label"] ?? "field"}`}
                    className="absolute right-1 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                    <svg
                        className="h-3.5 w-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        aria-hidden="true"
                    >
                        <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    )
}
