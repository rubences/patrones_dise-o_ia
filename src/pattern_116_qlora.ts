/** PATRÓN 116 — QLoRA
 * Referencia pedagógica: contratos e invariantes, no reproducción de benchmarks.
 */
export class QLoRAConfig{constructor(public rank:number,public bits=4,public quantType="NF4"){if(bits<2||bits>8)throw Error("bits")}describe(){return{baseFrozen:true,bits:this.bits,quantType:this.quantType,rank:this.rank}}}
export const PATTERN_116_META={id:116,name:"QLoRA",family:"model-adaptation",maturity:"established"} as const;
