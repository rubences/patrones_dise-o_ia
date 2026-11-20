/** P11 224: deterministic observability reference, not production tracing. */
export class Pattern224Contract{attribute(v:{actor:string;weight:number}[]){if(!v.length||v.some(x=>!x.actor?.trim()||!Number.isFinite(x.weight)||x.weight<0))throw Error("invalid attribution");const total=v.reduce((a,x)=>a+x.weight,0);if(!Number.isFinite(total)||total<=0)throw Error("invalid total");return v.map(x=>({actor:x.actor,share:x.weight/total}));}}
export const PATTERN_224_META={id:224,family:"ai-behavioral-observability",maturity:"experimental"} as const;
