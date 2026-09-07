import { useState, type KeyboardEvent, type ReactElement } from "react"

import { ClearableInput } from "~components/clearable-input"
import { cn } from "~lib/utils"

export interface SuggestionInputProps {
    value: string
    onChange: (value: string) => void
    suggestions: string[]
    placeholder: string
    /** Used for the accessible name and the clear control's label. */
    label: string
    disabled?: boolean
    autoFocus?: boolean
}

/** Text input with a dropdown of backend suggestions. */
export function SuggestionInput({
    value,
    onChange,
    suggestions,
    placeholder,
    label,
    disabled = false,
    autoFocus = false
}: SuggestionInputProps): ReactElement {
    const [open, setOpen] = useState(false)
    const [highlighted, setHighlighted] = useState(-1)

    // Derived so a shorter list cannot leave the highlight out of range.
    const activeIndex = highlighted < suggestions.length ? highlighted : -1

    const isOpen = open && !disabled && suggestions.length > 0

    function select(suggestion: string) {
        onChange(suggestion)
        setOpen(false)
        setHighlighted(-1)
    }

    function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (!isOpen) {
            if (event.key === "ArrowDown" && suggestions.length > 0) {
                setOpen(true)
            }
            return
        }

        if (event.key === "ArrowDown") {
            event.preventDefault()
            setHighlighted((activeIndex + 1) % suggestions.length)
        } else if (event.key === "ArrowUp") {
            event.preventDefault()
            setHighlighted((activeIndex <= 0 ? suggestions.length : activeIndex) - 1)
        } else if (event.key === "Enter" && activeIndex >= 0) {
            // Only intercept Enter while a row is highlighted, so an unhighlighted
            // Enter still submits the form.
            event.preventDefault()
            select(suggestions[activeIndex])
        } else if (event.key === "Escape") {
            setOpen(false)
        }
    }

    return (
        <div className="relative">
            <ClearableInput
                value={value}
                onChange={(event) => {
                    onChange(event.target.value)
                    setOpen(true)
                }}
                onClear={() => {
                    onChange("")
                    setOpen(false)
                }}
                onFocus={() => setOpen(true)}
                onBlur={() => setOpen(false)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                aria-label={label}
                aria-expanded={isOpen}
                aria-autocomplete="list"
                role="combobox"
                autoComplete="off"
                autoFocus={autoFocus}
                disabled={disabled}
            />
            {isOpen && (
                <ul
                    role="listbox"
                    aria-label={`${label} suggestions`}
                    className="absolute inset-x-0 top-full z-10 mt-1 max-h-40 overflow-y-auto rounded-md border border-input bg-popover py-1 shadow-md"
                >
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={suggestion}
                            role="option"
                            aria-selected={index === activeIndex}
                            // Keep the input from blurring before the click lands.
                            onMouseDown={(event) => event.preventDefault()}
                            onMouseEnter={() => setHighlighted(index)}
                            onClick={() => select(suggestion)}
                            className={cn(
                                "cursor-pointer px-3 py-1.5 text-sm",
                                index === activeIndex &&
                                    "bg-accent text-accent-foreground"
                            )}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
