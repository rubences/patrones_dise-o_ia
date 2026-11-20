/** PATRÓN 117 — AdaLoRA
 * Referencia pedagógica: contratos e invariantes, no reproducción de benchmarks.
 */
export class AdaLoRAAllocator{allocate(scores:Record<string,number>,budget:number){const e=Object.entries(scores).sort((a,b)=>b[1]-a[1]);const t=e.reduce((s,[,v])=>s+Math.max(v,0),0)||1;return Object.fromEntries(e.map(([k,v])=>[k,Math.max(1,Math.round(budget*Math.max(v,0)/t))]))}}
export const PATTERN_117_META={id:117,name:"AdaLoRA",family:"model-adaptation",maturity:"established"} as const;
