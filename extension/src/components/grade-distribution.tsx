import type { ReactElement } from "react"

import { cn } from "~lib/utils"
import type { GradeKey, GradeTotals } from "~types/api"

/**
 * Display order, label, and bar colour for each grade column the API returns.
 * Colour classes are written out in full so Tailwind's content scanner keeps
 * them.
 */
const GRADE_COLUMNS: ReadonlyArray<readonly [GradeKey, string, string]> = [
    ["a_plus", "A+", "bg-green-500"],
    ["a", "A", "bg-green-500"],
    ["a_minus", "A-", "bg-green-500"],
    ["b_plus", "B+", "bg-yellow-400"],
    ["b", "B", "bg-yellow-400"],
    ["b_minus", "B-", "bg-yellow-400"],
    ["c_plus", "C+", "bg-orange-400"],
    ["c", "C", "bg-orange-400"],
    ["c_minus", "C-", "bg-orange-400"],
    ["d_plus", "D+", "bg-red-400"],
    ["d", "D", "bg-red-400"],
    ["d_minus", "D-", "bg-red-400"],
    ["f", "F", "bg-red-600"],
    ["cr", "CR", "bg-neutral-400"],
    ["nc", "NC", "bg-neutral-400"],
    ["p", "P", "bg-neutral-400"],
    ["w", "W", "bg-neutral-400"],
    ["i", "I", "bg-neutral-400"],
    ["nf", "NF", "bg-neutral-400"]
]

export function GradeDistribution({
    grades
}: {
    grades: GradeTotals
}): ReactElement | null {
    const columns = GRADE_COLUMNS.filter(([key]) => grades[key] > 0)
    const total = columns.reduce((sum, [key]) => sum + grades[key], 0)

    if (total === 0) {
        return null
    }

    const max = Math.max(...columns.map(([key]) => grades[key]))

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-stretch gap-0.5">
                {columns.map(([key, label, color]) => {
                    const count = grades[key]
                    return (
                        <div
                            key={key}
                            className="flex flex-1 flex-col items-center gap-1"
                            title={`${label}: ${count.toLocaleString()}`}
                        >
                            <div className="flex h-20 w-full items-end">
                                <div
                                    className={cn("w-full rounded-sm", color)}
                                    // A floor keeps a small but non-zero count
                                    // from rendering as an invisible sliver.
                                    style={{
                                        height: `${(count / max) * 100}%`,
                                        minHeight: "3px"
                                    }}
                                />
                            </div>
                            <span className="text-[9px] leading-none text-muted-foreground">
                                {label}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
