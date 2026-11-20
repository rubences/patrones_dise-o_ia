/** PATRÓN 103 — AI Factory
 * Referencia pedagógica: contratos e invariantes, no reproducción de benchmarks.
 */
export type FactoryState="experiment"|"validated"|"approved"|"production"|"rejected";
export interface FactoryAsset{id:string;kind:"dataset"|"model"|"prompt"|"agent";version:string;owner:string;state:FactoryState;evidence:string[]}
export class AIFactory{private assets=new Map<string,FactoryAsset>();register(a:FactoryAsset){this.assets.set(a.id,{...a})}evaluate(id:string,gates:{name:string;pass:boolean}[]){const a=this.must(id);a.evidence.push(...gates.map(g=>g.name+":"+g.pass));a.state=gates.every(g=>g.pass)?"validated":"rejected";return a.state}approve(id:string,human:string){const a=this.must(id);if(a.state!=="validated")throw Error("validation required");a.evidence.push("approved:"+human);a.state="approved"}promote(id:string){const a=this.must(id);if(a.state!=="approved")throw Error("human approval required");a.state="production";return {...a}}private must(id:string){const a=this.assets.get(id);if(!a)throw Error("unknown asset");return a}}
export const PATTERN_103_META={id:103,name:"AI Factory",family:"ai-platforms",maturity:"emerging"} as const;
