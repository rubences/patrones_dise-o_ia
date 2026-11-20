/** PATRÓN 183 — BoundedAgentIteration. Referencia pedagógica: no ejecuta efectos externos. */
export class BoundedAgentIteration{private count=0;constructor(private readonly maxSteps:number){if(!Number.isInteger(maxSteps)||maxSteps<1)throw Error("invalid budget");}step(){if(this.count>=this.maxSteps)throw Error("iteration limit");return ++this.count;}}
export const PATTERN_183_META={id:183,name:"BoundedAgentIteration",family:"agent-runtime-harness",maturity:"emerging"} as const;
