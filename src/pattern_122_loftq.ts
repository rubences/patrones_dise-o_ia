/** PATRÓN 122 — LoftQ
 * Referencia pedagógica: contratos e invariantes, no reproducción de benchmarks.
 */
export class LoftQConfig{constructor(public bits:number,public rank:number,public iterations=1){}init(){if(this.bits<2||this.bits>8)throw Error("bits");return{quantizeBase:true,lowRankResidual:true,bits:this.bits,rank:this.rank,iterations:this.iterations}}}
export const PATTERN_122_META={id:122,name:"LoftQ",family:"model-adaptation",maturity:"established"} as const;
