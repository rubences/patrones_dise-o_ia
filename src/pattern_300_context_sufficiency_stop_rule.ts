/** P12 300: deterministic educational context engineering reference, not LLM safety certification. */
export class Pattern300Contract{assess(required:string[],covered:string[]){if([...required,...covered].some(x=>!x.trim()))throw Error("invalid evidence");const have=new Set(covered),missing=[...new Set(required)].filter(x=>!have.has(x));return {sufficient:missing.length===0,missing,limitation:"coverage of named requirements is not factual correctness" as const};}}
export const PATTERN_300_META={id:300,family:"context-engineering",maturity:"experimental"} as const;
