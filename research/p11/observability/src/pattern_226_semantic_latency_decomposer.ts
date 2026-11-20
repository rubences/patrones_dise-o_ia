/** P11 226: deterministic observability reference, not production tracing. */
export class Pattern226Contract{decompose(stages:{name:string;duration:number}[]){if(!stages.length||stages.some(x=>!x.name?.trim()||!Number.isFinite(x.duration)||x.duration<0))throw Error("invalid latency");const total=stages.reduce((a,x)=>a+x.duration,0);if(!Number.isFinite(total))throw Error("overflow");return {total,stages:stages.map(x=>({...x,share:total?x.duration/total:0}))};}}
export const PATTERN_226_META={id:226,family:"ai-behavioral-observability",maturity:"experimental"} as const;
