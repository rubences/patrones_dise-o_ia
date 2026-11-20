/** PATRÓN 130 — A2ATaskLifecycle
 * Contratos de referencia P8. No es una implementación de transporte MCP/A2A ni certificación de conformidad.
 */
export class A2ATaskLifecycle{private states=new Map<string,string>();private allowed:Record<string,string[]>={submitted:["working","rejected","canceled"],working:["completed","failed","canceled","input-required","auth-required"],"input-required":["working","canceled"],"auth-required":["working","canceled"]};submit(id:string){if(!id||this.states.has(id))throw Error("duplicate task");this.states.set(id,"submitted");}transition(id:string,next:string){const prev=this.states.get(id);if(!prev||!this.allowed[prev]?.includes(next))throw Error("invalid transition");this.states.set(id,next);return next;}state(id:string){return this.states.get(id);}}
export const PATTERN_130_META={id:130,name:"A2ATaskLifecycle",family:"agent-interoperability",maturity:"emerging"} as const;
