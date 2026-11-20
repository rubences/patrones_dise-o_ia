/** PATRÓN 134 — CrossProtocolTraceContext
 * Contratos de referencia P8. No es una implementación de transporte MCP/A2A ni certificación de conformidad.
 */
export class CrossProtocolTraceContext{propagate(context:{traceId:string;spanId:string;taskId?:string},protocol:"mcp"|"a2a"){if(!/^[0-9a-f]{32}$/i.test(context.traceId)||!/^[0-9a-f]{16}$/i.test(context.spanId))throw Error("invalid trace context");return {protocol,traceId:context.traceId,spanId:context.spanId,taskId:context.taskId};}}
export const PATTERN_134_META={id:134,name:"CrossProtocolTraceContext",family:"agent-interoperability",maturity:"emerging"} as const;
