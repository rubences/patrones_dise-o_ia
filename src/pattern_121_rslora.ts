/** PATRÓN 121 — Rank-Stabilized LoRA (rsLoRA)
 * Referencia pedagógica: contratos e invariantes, no reproducción de benchmarks.
 */
export class RankStabilizedLoRA{constructor(public rank:number,public alpha:number){}scale(){if(this.rank<1)throw Error("rank");return this.alpha/Math.sqrt(this.rank)}}
export const PATTERN_121_META={id:121,name:"Rank-Stabilized LoRA (rsLoRA)",family:"model-adaptation",maturity:"emerging"} as const;
