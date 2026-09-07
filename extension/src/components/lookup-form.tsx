import { useState, type FormEvent, type ReactElement } from "react"

import { Spinner } from "~components/spinner"
import { SuggestionInput } from "~components/suggestion-input"
import { Button } from "~components/ui/button"
import { useSuggestions } from "~lib/use-suggestions"
import type { LookupQuery } from "~types/api"

export interface LookupFormProps {
    /** Called with the trimmed pair once both fields are filled in. */
    onSubmit: (query: LookupQuery) => void
    pending: boolean
}

export function LookupForm({ onSubmit, pending }: LookupFormProps): ReactElement {
    const [teacher, setTeacher] = useState("")
    const [course, setCourse] = useState("")
    const suggestions = useSuggestions(teacher, course)

    // The API rejects professor-only and course-only lookups, so require both.
    const canSubmit = teacher.trim() !== "" && course.trim() !== ""

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!canSubmit || pending) {
            return
        }
        onSubmit({ teacher: teacher.trim(), course: course.trim() })
    }

    return (
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
            <SuggestionInput
                value={teacher}
                onChange={setTeacher}
                suggestions={suggestions.professors}
                placeholder="Enter teacher name"
                label="teacher name"
                disabled={pending}
                autoFocus
            />
            <SuggestionInput
                value={course}
                onChange={setCourse}
                suggestions={suggestions.courses}
                placeholder="Enter course name"
                label="course name"
                disabled={pending}
            />
            <Button type="submit" disabled={!canSubmit || pending}>
                {pending ? <Spinner /> : "Look up"}
            </Button>
        </form>
    )
}
