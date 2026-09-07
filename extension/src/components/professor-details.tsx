import type { ReactElement } from "react"

import { GradeDistribution } from "~components/grade-distribution"
import { Badge } from "~components/ui/badge"
import type { ProfessorInfoResponse } from "~types/api"

function Metric({ label, value }: { label: string; value: string }): ReactElement {
    return (
        <div className="flex flex-col items-center">
            <span className="text-sm tabular-nums">{value}</span>
            <span className="text-xs text-muted-foreground">{label}</span>
        </div>
    )
}

export function ProfessorDetails({
    professor,
    isSample = false
}: {
    professor: ProfessorInfoResponse
    /** Marks the placeholder shown before any lookup has been made. */
    isSample?: boolean
}): ReactElement {
    const hasRatings =
        professor.rating !== null ||
        professor.difficulty !== null ||
        professor.would_take_again !== null

    return (
        <section className="flex flex-col gap-3">
            <div className="text-center">
                <h2 className="text-sm">{professor.name}</h2>
                {professor.department && (
                    <p className="text-xs text-muted-foreground">
                        {professor.department}
                    </p>
                )}
                {isSample && (
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        Sample
                    </p>
                )}
            </div>

            {professor.tags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1">
                    {professor.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="font-light">
                            {tag}
                        </Badge>
                    ))}
                </div>
            )}

            {hasRatings ? (
                <div className="grid grid-cols-3 gap-2">
                    <Metric
                        label="Quality"
                        value={professor.rating === null ? "--" : `${professor.rating}/5`}
                    />
                    <Metric
                        label="Difficulty"
                        value={
                            professor.difficulty === null
                                ? "--"
                                : `${professor.difficulty}/5`
                        }
                    />
                    <Metric
                        label="Would take again"
                        value={
                            professor.would_take_again === null
                                ? "--"
                                : `${professor.would_take_again}%`
                        }
                    />
                </div>
            ) : (
                <p className="text-center text-xs text-muted-foreground">
                    No RateMyProfessors ratings found.
                </p>
            )}

            <GradeDistribution grades={professor.grades} />
        </section>
    )
}
