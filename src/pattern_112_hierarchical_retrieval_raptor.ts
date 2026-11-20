/** PATRÓN 112 — Hierarchical Retrieval (RAPTOR)
 * Referencia pedagógica: contratos e invariantes, no reproducción de benchmarks.
 */
export interface RaptorNode{id:string;level:number;summary:string;children:string[]}export class RaptorIndex{constructor(private nodes:RaptorNode[]){}retrieve(terms:string[],limit=5){const q=terms.map(x=>x.toLowerCase());return this.nodes.map(n=>({node:n,score:q.filter(t=>n.summary.toLowerCase().includes(t)).length/(q.length||1)})).sort((a,b)=>b.score-a.score).slice(0,limit)}}
export const PATTERN_112_META={id:112,name:"Hierarchical Retrieval (RAPTOR)",family:"knowledge-context",maturity:"established"} as const;
