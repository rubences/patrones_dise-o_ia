/** PATRÓN 114 — Corrective RAG (CRAG)
 * Referencia pedagógica: contratos e invariantes, no reproducción de benchmarks.
 */
export type Correction="accept"|"refine"|"fallback";export class CorrectiveRAG{decide(m:{relevance:number;coverage:number;conflict:number}):Correction{const s=.5*m.relevance+.4*m.coverage-.3*m.conflict;return s>=.65?"accept":s>=.35?"refine":"fallback"}}
export const PATTERN_114_META={id:114,name:"Corrective RAG (CRAG)",family:"knowledge-context",maturity:"emerging"} as const;
