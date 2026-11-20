/** P11 225: deterministic observability reference, not production tracing. */
export class Pattern225Contract{detect(baseline:string[],current:string[]){if([...baseline,...current].some(x=>!x.trim()))throw Error("invalid tool");const known=new Set(baseline);return [...new Set(current.filter(x=>!known.has(x)))];}}
export const PATTERN_225_META={id:225,family:"ai-behavioral-observability",maturity:"experimental"} as const;
