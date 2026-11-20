/** P12 349: educational adversarial evaluation contract; no safety certification. */
export class Pattern349Contract{measure(scores:number[],maxSpread:number){if(scores.length<2||!Number.isFinite(maxSpread)||maxSpread<0||scores.some(x=>!Number.isFinite(x)||x<0||x>1))throw Error("invalid scores");const spread=Math.max(...scores)-Math.min(...scores);return {spread,disagreement:spread>maxSpread,limitation:"evaluator agreement is not ground truth" as const};}}
export const PATTERN_349_META={id:349,family:"ai-agent-evaluation-redteam",maturity:"experimental"} as const;
