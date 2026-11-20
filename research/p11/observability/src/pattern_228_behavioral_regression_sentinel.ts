/** P11 228: deterministic observability reference, not production tracing. */
export class Pattern228Contract{compare(previous:number[],current:number[],tolerance:number){if(!previous.length||previous.length!==current.length||!Number.isFinite(tolerance)||tolerance<0||[...previous,...current].some(x=>!Number.isFinite(x)))throw Error("invalid regression");return current.map((value,i)=>({index:i,delta:value-previous[i],regression:value<previous[i]-tolerance}));}}
export const PATTERN_228_META={id:228,family:"ai-behavioral-observability",maturity:"experimental"} as const;
