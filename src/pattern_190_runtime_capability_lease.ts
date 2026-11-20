/** PATRÓN 190 — RuntimeCapabilityLease. Referencia pedagógica: no ejecuta efectos externos. */
export class RuntimeCapabilityLease{authorize(actor:string,resource:string,lease:{actor:string;resource:string;expires:number},now=Date.now()){if(actor!==lease.actor||resource!==lease.resource||lease.expires<=now)throw Error("lease denied");return true;}}
export const PATTERN_190_META={id:190,name:"RuntimeCapabilityLease",family:"agent-runtime-harness",maturity:"emerging"} as const;
