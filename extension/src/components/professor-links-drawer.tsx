import type { ReactElement } from "react"

import rmpIcon from "../assets/RMPIcon.png"
import utdGradesIcon from "../assets/UTDGradesIcon.png"
import utdTrendsIcon from "../assets/UTDTrendsDark.svg"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "~components/ui/sheet"
import { rateMyProfessorsUrl, utdGradesUrl, utdTrendsUrl } from "~lib/professor-links"
import type { ProfessorInfoResponse } from "~types/api"

function LinkRow({
    href,
    icon,
    children
}: {
    href: string
    icon: string
    children: string
}): ReactElement {
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-md border-input px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
        >
            <img src={icon} alt="" className="h-5 w-5 shrink-0 object-contain" />
            {children}
        </a>
    )
}

export function ProfessorLinksDrawer({
    professor
}: {
    professor: ProfessorInfoResponse
}): ReactElement {
    return (
        <Sheet>
            <SheetTrigger className="text-lg underline underline-offset-2 decoration-1 hover:text-muted-foreground">
                {professor.name}
            </SheetTrigger>
            <SheetContent side="bottom" className="gap-0 p-4">
                {/* Radix needs a title to name the dialog; the design has no
                    visible header, so it is exposed to screen readers only. */}
                <SheetTitle className="sr-only">{professor.name} links</SheetTitle>
                <div className="flex flex-col gap-2">
                    {professor.id !== null && (
                        <LinkRow href={rateMyProfessorsUrl(professor.id)} icon={rmpIcon}>
                            Rate My Professor
                        </LinkRow>
                    )}
                    <LinkRow href={utdGradesUrl(professor)} icon={utdGradesIcon}>
                        UTD Grades
                    </LinkRow>
                    <LinkRow href={utdTrendsUrl(professor)} icon={utdTrendsIcon}>
                        UTD Trends
                    </LinkRow>
                </div>
            </SheetContent>
        </Sheet>
    )
}
