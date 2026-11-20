/** P11 227: deterministic observability reference, not production tracing. */
export class Pattern227Contract{classify(code:string){if(!code?.trim())throw Error("invalid failure");if(/timeout|deadline/i.test(code))return "timeout";if(/permission|denied|unauthoriz/i.test(code))return "authorization";if(/rate.limit|quota/i.test(code))return "capacity";return "unclassified";}}
export const PATTERN_227_META={id:227,family:"ai-behavioral-observability",maturity:"experimental"} as const;
