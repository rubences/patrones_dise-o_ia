/** PATRÓN 115 — LoRA
 * Referencia pedagógica: contratos e invariantes, no reproducción de benchmarks.
 */
export interface LoRAAdapter{rank:number;alpha:number;targets:string[]}export class LoRAConfig{constructor(public c:LoRAAdapter){if(c.rank<1)throw Error("rank")}scale(){return this.c.alpha/this.c.rank}params(i:number,o:number){return this.c.rank*(i+o)*this.c.targets.length}}
export const PATTERN_115_META={id:115,name:"LoRA",family:"model-adaptation",maturity:"foundational"} as const;
