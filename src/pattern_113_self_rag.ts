/** PATRÓN 113 — Self-Reflective RAG (Self-RAG)
 * Referencia pedagógica: contratos e invariantes, no reproducción de benchmarks.
 */
export class SelfRAGController{decide(q:{fresh:boolean;risk:"low"|"high"}){return q.fresh||q.risk==="high"?"retrieve":"generate"}critique(relevance:number,support:number){const s=.5*relevance+.5*support;return {score:s,action:s<.5?"retrieve-again":"accept"}}}
export const PATTERN_113_META={id:113,name:"Self-Reflective RAG (Self-RAG)",family:"knowledge-context",maturity:"established"} as const;
