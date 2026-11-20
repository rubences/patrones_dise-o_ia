/** P11 264: educational knowledge engineering contract; no semantic correctness certification. */
export class Pattern264Contract{assess(a:{id:string;aliases:string[]},b:{id:string;aliases:string[]}){if(!a.id.trim()||!b.id.trim()||[...a.aliases,...b.aliases].some(x=>!x.trim()))throw Error("invalid entity");const shared=a.aliases.filter(x=>b.aliases.includes(x));return {candidateMatch:a.id===b.id||shared.length>0,sharedAliases:[...new Set(shared)],requiresReview:true as const};}}
export const PATTERN_264_META={id:264,family:"autonomous-knowledge-engineering",maturity:"experimental"} as const;
