/** P12 293: deterministic educational context engineering reference, not LLM safety certification. */
export class Pattern293Contract{filter(items:{id:string;observedAt:number}[],now:number,maxAge:number){if(!Number.isFinite(now)||!Number.isFinite(maxAge)||maxAge<0||items.some(x=>!x.id.trim()||!Number.isFinite(x.observedAt)||x.observedAt>now))throw Error("invalid evidence");return items.filter(x=>now-x.observedAt<=maxAge);}}
export const PATTERN_293_META={id:293,family:"context-engineering",maturity:"experimental"} as const;
