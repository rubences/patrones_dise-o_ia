/** PATRÓN 123 — MCPCapabilityAdapter
 * Contratos de referencia P8. No es una implementación de transporte MCP/A2A ni certificación de conformidad.
 */
export class MCPCapabilityAdapter{constructor(private readonly supported:ReadonlySet<string>){} adapt(version:string,name:string,args:unknown){if(!this.supported.has(version))throw Error("unsupported protocol version");if(!/^[a-zA-Z][\w.-]{0,127}$/.test(name))throw Error("invalid tool name");if(!args||typeof args!=="object"||Array.isArray(args))throw Error("invalid arguments");return {version,name,arguments:structuredClone(args)};}}
export const PATTERN_123_META={id:123,name:"MCPCapabilityAdapter",family:"agent-interoperability",maturity:"emerging"} as const;
