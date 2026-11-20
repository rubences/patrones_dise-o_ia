/** P12 277: educational inference-time control; not model-quality or sampling guarantee. */
export class Pattern277Contract{shouldDeliberate(scores:number[],threshold:number){if(!scores.length||!Number.isFinite(threshold)||threshold<0||threshold>1||scores.some(x=>!Number.isFinite(x)||x<0||x>1))throw Error("invalid uncertainty");return Math.max(...scores)-Math.min(...scores)>threshold;}}
export const PATTERN_277_META={id:277,family:"inference-compute-optimization",maturity:"experimental"} as const;
