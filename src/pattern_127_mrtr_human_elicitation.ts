/** PATRÓN 127 — MRTRHumanElicitation
 * Contratos de referencia P8. No es una implementación de transporte MCP/A2A ni certificación de conformidad.
 */
export class MRTRHumanElicitation{private pending=new Map<string,{actor:string;prompt:string}>();request(id:string,actor:string,prompt:string){if(!id||!actor||!prompt||this.pending.has(id))throw Error("invalid request");this.pending.set(id,{actor,prompt});return {resultType:"input_required" as const,id,prompt};}resume(id:string,actor:string,input:string){const p=this.pending.get(id);if(!p||p.actor!==actor)throw Error("unauthorized response");this.pending.delete(id);return {id,input};}}
export const PATTERN_127_META={id:127,name:"MRTRHumanElicitation",family:"agent-interoperability",maturity:"emerging"} as const;
