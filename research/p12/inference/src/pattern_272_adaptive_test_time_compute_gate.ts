/** P12 272: educational inference-time control; not model-quality or sampling guarantee. */
export class Pattern272Contract{decide(uncertainty:number,remainingTokens:number,threshold:number){if(![uncertainty,threshold].every(Number.isFinite)||uncertainty<0||uncertainty>1||threshold<0||threshold>1||!Number.isInteger(remainingTokens)||remainingTokens<0)throw Error("invalid compute gate");return uncertainty>=threshold&&remainingTokens>0?"deliberate" as const:"respond" as const;}}
export const PATTERN_272_META={id:272,family:"inference-compute-optimization",maturity:"experimental"} as const;
