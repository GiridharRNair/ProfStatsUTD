import { useState, type FormEvent, type ReactElement } from "react"

import { ClearableInput } from "~components/clearable-input"
import { Spinner } from "~components/spinner"
import { Button } from "~components/ui/button"
import type { LookupQuery } from "~types/api"

export interface LookupFormProps {
    /** Called with the trimmed pair once both fields are filled in. */
    onSubmit: (query: LookupQuery) => void
    pending: boolean
}

export function LookupForm({ onSubmit, pending }: LookupFormProps): ReactElement {
    const [teacher, setTeacher] = useState("")
    const [course, setCourse] = useState("")

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
            <ClearableInput
                value={teacher}
                onChange={(event) => setTeacher(event.target.value)}
                onClear={() => setTeacher("")}
                placeholder="Enter teacher name"
                aria-label="teacher name"
                autoComplete="off"
                autoFocus
                disabled={pending}
            />
            <ClearableInput
                value={course}
                onChange={(event) => setCourse(event.target.value)}
                onClear={() => setCourse("")}
                placeholder="Enter course name"
                aria-label="course name"
                autoComplete="off"
                disabled={pending}
            />
            <Button type="submit" disabled={!canSubmit || pending}>
                {pending ? <Spinner /> : "Look up"}
            </Button>
        </form>
    )
}
