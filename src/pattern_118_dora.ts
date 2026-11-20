/** PATRÓN 118 — DoRA
 * Referencia pedagógica: contratos e invariantes, no reproducción de benchmarks.
 */
export class DoRAConfig{constructor(public rank:number){}decompose(norm:number){return{magnitude:norm,directionAdapter:{kind:"LoRA",rank:this.rank},learnMagnitude:true}}}
export const PATTERN_118_META={id:118,name:"DoRA",family:"model-adaptation",maturity:"established"} as const;
