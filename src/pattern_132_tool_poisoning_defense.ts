/** PATRÓN 132 — ToolPoisoningDefense
 * Contratos de referencia P8. No es una implementación de transporte MCP/A2A ni certificación de conformidad.
 */
export class ToolPoisoningDefense{private forbidden=[/ignore (all )?(previous|system) instructions/i,/reveal (the )?(system prompt|secrets)/i,/send .* (api key|password)/i];inspect(description:string){if(typeof description!=="string"||this.forbidden.some(r=>r.test(description)))throw Error("suspicious tool metadata");return {safe:true};}}
export const PATTERN_132_META={id:132,name:"ToolPoisoningDefense",family:"agent-interoperability",maturity:"emerging"} as const;
