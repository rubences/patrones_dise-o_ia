/** P14 354: deterministic evaluation-integrity reference contract; domain validation required. */
export class Pattern354Contract {
 disagreement(scores:number[][],threshold=0.25){if(scores.some(s=>!s.length||s.some(v=>!Number.isFinite(v))))throw Error('invalid scores');const spreads=scores.map(s=>Math.max(...s)-Math.min(...s));return {spreads,flagged:spreads.map((v,i)=>v>threshold?i:-1).filter(i=>i>=0)};}
}
export const PATTERN_354_META={id:354,family:"ai-evaluation-integrity",maturity:"experimental"} as const;
