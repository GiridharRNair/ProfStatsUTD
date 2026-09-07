import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** Merges conditional class names, letting later Tailwind utilities win. */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
