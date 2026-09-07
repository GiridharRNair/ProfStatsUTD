import type { ReactElement } from "react"

import type { GradeKey, GradeTotals } from "~types/api"

/** Display order and labels for the grade columns the API returns. */
const GRADE_LABELS: ReadonlyArray<readonly [GradeKey, string]> = [
    ["a_plus", "A+"],
    ["a", "A"],
    ["a_minus", "A-"],
    ["b_plus", "B+"],
    ["b", "B"],
    ["b_minus", "B-"],
    ["c_plus", "C+"],
    ["c", "C"],
    ["c_minus", "C-"],
    ["d_plus", "D+"],
    ["d", "D"],
    ["d_minus", "D-"],
    ["f", "F"],
    ["cr", "CR"],
    ["nc", "NC"],
    ["p", "P"],
    ["w", "W"],
    ["i", "I"],
    ["nf", "NF"]
]

export function GradeDistribution({
    grades
}: {
    grades: GradeTotals
}): ReactElement | null {
    const rows = GRADE_LABELS.filter(([key]) => grades[key] > 0)
    const total = rows.reduce((sum, [key]) => sum + grades[key], 0)

    if (total === 0) {
        return null
    }

    const max = Math.max(...rows.map(([key]) => grades[key]))

    return (
        <div className="flex flex-col gap-1">
            {rows.map(([key, label]) => {
                const count = grades[key]
                return (
                    <div key={key} className="flex items-center gap-2 text-xs">
                        <span className="w-6 shrink-0 text-muted-foreground">
                            {label}
                        </span>
                        <div className="h-3 flex-1 overflow-hidden rounded-sm bg-secondary">
                            <div
                                className="h-full rounded-sm bg-primary"
                                style={{ width: `${(count / max) * 100}%` }}
                            />
                        </div>
                        <span className="w-10 shrink-0 text-right tabular-nums">
                            {count.toLocaleString()}
                        </span>
                    </div>
                )
            })}
            <p className="pt-1 text-xs text-muted-foreground">
                {total.toLocaleString()} grades
            </p>
        </div>
    )
}
