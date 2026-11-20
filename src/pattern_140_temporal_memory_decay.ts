/** Pattern 140: differentiated, deterministic reference implementation; no LLM training is performed. */
export class Pattern140Contract {score(initial:number,createdAt:number,now:number,halfLifeMs:number){if(!Number.isFinite(initial)||initial<0||!Number.isFinite(createdAt)||!Number.isFinite(now)||now<createdAt||!Number.isFinite(halfLifeMs)||halfLifeMs<=0)throw Error("invalid decay");return initial*Math.pow(0.5,(now-createdAt)/halfLifeMs);}}
export const PATTERN_140_META={id:140,name:"Temporal Memory Decay",family:"continual-learning-memory",maturity:"experimental"} as const;
