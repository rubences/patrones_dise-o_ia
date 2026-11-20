/** PATRÓN 126 — ExplicitWorkflowHandle
 * Contratos de referencia P8. No es una implementación de transporte MCP/A2A ni certificación de conformidad.
 */
export class ExplicitWorkflowHandle{private entries=new Map<string,{owner:string;expires:number;state:string}>();create(id:string,owner:string,ttlMs:number){if(!id||!owner||ttlMs<=0||this.entries.has(id))throw Error("invalid handle");this.entries.set(id,{owner,expires:Date.now()+ttlMs,state:"pending"});}read(id:string,owner:string){const v=this.entries.get(id);if(!v||v.owner!==owner||v.expires<=Date.now())throw Error("invalid handle");return {...v};}revoke(id:string,owner:string){this.read(id,owner);this.entries.delete(id);}}
export const PATTERN_126_META={id:126,name:"ExplicitWorkflowHandle",family:"agent-interoperability",maturity:"emerging"} as const;
