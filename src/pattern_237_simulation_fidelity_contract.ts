/** P11 237: educational synthetic-data contract; not privacy or fidelity certification. */
export class Pattern237Contract{assess(simulated:number[],observed:number[],maxError:number){if(!simulated.length||simulated.length!==observed.length||![...simulated,...observed,maxError].every(Number.isFinite)||maxError<0)throw Error("invalid fidelity");const mae=simulated.reduce((s,x,i)=>s+Math.abs(x-observed[i]),0)/simulated.length;return {mae,accepted:mae<=maxError};}}
export const PATTERN_237_META={id:237,family:"trustworthy-synthetic-simulation",maturity:"experimental"} as const;
