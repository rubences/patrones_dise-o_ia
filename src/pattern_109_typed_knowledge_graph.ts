/** PATRÓN 109 — Typed Knowledge Graph
 * Referencia pedagógica: contratos e invariantes, no reproducción de benchmarks.
 */
export type TNode={id:string;type:string};export type TEdge={from:string;to:string;type:string};export class TypedKnowledgeGraph{private n=new Map<string,TNode>();constructor(private rules:Set<string>){}private e:TEdge[]=[];addNode(x:TNode){this.n.set(x.id,x)}addEdge(x:TEdge){const a=this.n.get(x.from),b=this.n.get(x.to);if(!a||!b||!this.rules.has(a.type+"-["+x.type+"]->"+b.type))throw Error("edge rejected");this.e.push(x)}}
export const PATTERN_109_META={id:109,name:"Typed Knowledge Graph",family:"data-graph-foundations",maturity:"emerging"} as const;
