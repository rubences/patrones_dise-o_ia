/** PATRÓN 110 — Graph-Augmented Generation (GraphRAG)
 * Referencia pedagógica: contratos e invariantes, no reproducción de benchmarks.
 */
export interface Entity{id:string;label:string;community?:string}export interface Relation{from:string;to:string;predicate:string}export class GraphRAG{constructor(private e:Entity[],private r:Relation[],private summaries:Record<string,string>){}local(id:string){const ids=new Set([id]);this.r.forEach(x=>{if(x.from===id)ids.add(x.to);if(x.to===id)ids.add(x.from)});return this.e.filter(x=>ids.has(x.id))}global(){return Object.entries(this.summaries)}}
export const PATTERN_110_META={id:110,name:"Graph-Augmented Generation (GraphRAG)",family:"knowledge-context",maturity:"established"} as const;
