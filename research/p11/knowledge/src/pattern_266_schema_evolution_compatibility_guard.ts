/** P11 266: educational knowledge engineering contract; no semantic correctness certification. */
export class Pattern266Contract{assess(previous:{required:string[]},next:{fields:string[]}){if([...previous.required,...next.fields].some(x=>!x.trim()))throw Error("invalid schema");const available=new Set(next.fields),missing=[...new Set(previous.required)].filter(x=>!available.has(x));return {compatible:missing.length===0,missing};}}
export const PATTERN_266_META={id:266,family:"autonomous-knowledge-engineering",maturity:"experimental"} as const;
