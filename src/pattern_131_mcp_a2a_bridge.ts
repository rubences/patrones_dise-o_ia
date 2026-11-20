/** PATRÓN 131 — MCPA2ABridge
 * Contratos de referencia P8. No es una implementación de transporte MCP/A2A ni certificación de conformidad.
 */
export class MCPA2ABridge{constructor(private readonly authorize:(actor:string,agent:string)=>boolean){}delegate(actor:string,agent:string,tool:string,args:Record<string,unknown>,traceId:string){if(!actor||!agent||!tool||!traceId||!this.authorize(actor,agent))throw Error("bridge denied");return {actor,agent,task:{tool,args:structuredClone(args)},traceId};}}
export const PATTERN_131_META={id:131,name:"MCPA2ABridge",family:"agent-interoperability",maturity:"emerging"} as const;
