/** PATRÓN 119 — PiSSA
 * Referencia pedagógica: contratos e invariantes, no reproducción de benchmarks.
 */
export class PiSSAConfig{constructor(public rank:number,public iterations=16){}init(shape:[number,number]){if(this.rank>Math.min(...shape))throw Error("rank");return{method:"principal-svd",rank:this.rank,iterations:this.iterations,residualFrozen:true}}}
export const PATTERN_119_META={id:119,name:"PiSSA",family:"model-adaptation",maturity:"emerging"} as const;
