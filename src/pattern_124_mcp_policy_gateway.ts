/** PATRÓN 124 — MCPPolicyGateway
 * Contratos de referencia P8. No es una implementación de transporte MCP/A2A ni certificación de conformidad.
 */
export class MCPPolicyGateway{constructor(private readonly permitted:(actor:string,tool:string,args:Record<string,unknown>)=>boolean){} authorize(actor:string,tool:string,args:Record<string,unknown>){if(!actor||!tool||!this.permitted(actor,tool,args))throw Error("denied");return {actor,tool,allowed:true};}}
export const PATTERN_124_META={id:124,name:"MCPPolicyGateway",family:"agent-interoperability",maturity:"emerging"} as const;
