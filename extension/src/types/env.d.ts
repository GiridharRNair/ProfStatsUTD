/**
 * Plasmo inlines `process.env.PLASMO_PUBLIC_*` at build time and regenerates
 * `.plasmo/process.env.d.ts` from the local `.env` file. That generated file
 * only augments `NodeJS.ProcessEnv`, and it is absent before the first build,
 * so declare both the interface members we rely on and the `process` global
 * here to keep `tsc --noEmit` working on a clean checkout.
 */
declare namespace NodeJS {
    interface ProcessEnv {
        /** Base URL of the ProfStats API, e.g. `https://profstats.vercel.app`. */
        PLASMO_PUBLIC_API_URL?: string
    }
}

declare const process: {
    env: NodeJS.ProcessEnv
}
