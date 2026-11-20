/** PATRÓN 111 — Adaptive GraphRAG Router
 * Referencia pedagógica: contratos e invariantes, no reproducción de benchmarks.
 */
export type RetrievalMode="dense"|"graph"|"hybrid";export class AdaptiveGraphRAGRouter{route(f:{multiHop:number;entities:number;globalIntent:number}):RetrievalMode{const s=.45*f.multiHop+.3*Math.min(f.entities/5,1)+.25*f.globalIntent;return s>=.7?"graph":s<=.35?"dense":"hybrid"}}
export const PATTERN_111_META={id:111,name:"Adaptive GraphRAG Router",family:"knowledge-context",maturity:"emerging"} as const;
