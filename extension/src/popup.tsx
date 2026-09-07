import { useEffect, useState, type ReactElement } from "react"

import { LookupForm } from "~components/lookup-form"
import { ProfessorDetails } from "~components/professor-details"
import { ApiError, fetchProfessorInfo } from "~lib/api"
import { SAMPLE_PROFESSOR } from "~lib/sample-professor"
import { loadLastProfessor, saveLastProfessor } from "~lib/storage"
import type { LookupQuery, ProfessorInfoResponse } from "~types/api"

import "./styles/globals.css"

export default function Popup(): ReactElement {
    const [professor, setProfessor] = useState<ProfessorInfoResponse | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [pending, setPending] = useState(false)

    // Restore the previous result, or show the sample on a first ever open.
    useEffect(() => {
        let cancelled = false

        loadLastProfessor().then((saved) => {
            if (cancelled) {
                return
            }
            setProfessor(saved ?? SAMPLE_PROFESSOR)
        })

        return () => {
            cancelled = true
        }
    }, [])

    async function handleSubmit(query: LookupQuery) {
        setPending(true)
        setError(null)

        try {
            const result = await fetchProfessorInfo(query)
            setProfessor(result)
            void saveLastProfessor(result)
        } catch (caught) {
            setError(
                caught instanceof ApiError ? caught.message : "Something went wrong."
            )
        } finally {
            setPending(false)
        }
    }

    return (
        <main className="flex w-[340px] flex-col gap-3 p-3">
            <LookupForm onSubmit={handleSubmit} pending={pending} />
            {error && <p className="text-xs text-destructive">{error}</p>}
            {professor && <ProfessorDetails professor={professor} />}
        </main>
    )
}
