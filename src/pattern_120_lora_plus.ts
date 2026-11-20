/** PATRÓN 120 — LoRA+
 * Referencia pedagógica: contratos e invariantes, no reproducción de benchmarks.
 */
export class LoRAPlusConfig{constructor(public lrA:number,public ratio:number){}groups(){if(this.lrA<=0||this.ratio<=0)throw Error("lr");return[{matrix:"A",lr:this.lrA},{matrix:"B",lr:this.lrA*this.ratio}]}}
export const PATTERN_120_META={id:120,name:"LoRA+",family:"model-adaptation",maturity:"emerging"} as const;
