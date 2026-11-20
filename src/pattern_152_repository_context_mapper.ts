/** PATRÓN 152 — RepositoryContextMapper. Referencia pedagógica: no ejecuta efectos externos. */
export class RepositoryContextMapper{map(paths:string[],allowedPrefix:string){if(!allowedPrefix||paths.some(p=>p.includes("..")||!p.startsWith(allowedPrefix)))throw Error("path denied");return [...new Set(paths)].sort();}}
export const PATTERN_152_META={id:152,name:"RepositoryContextMapper",family:"agentic-software-engineering",maturity:"emerging"} as const;
