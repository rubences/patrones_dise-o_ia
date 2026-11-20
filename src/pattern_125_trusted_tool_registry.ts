/** PATRÓN 125 — TrustedToolRegistry
 * Contratos de referencia P8. No es una implementación de transporte MCP/A2A ni certificación de conformidad.
 */
export class TrustedToolRegistry{private tools=new Map<string,{origin:string;expires:number}>();register(name:string,origin:string,expires:number){if(!name||!origin.startsWith("https://")||expires<=Date.now())throw Error("untrusted");this.tools.set(name,{origin,expires});}resolve(name:string,origin:string){const item=this.tools.get(name);if(!item||item.origin!==origin||item.expires<=Date.now())throw Error("untrusted tool");return item;}}
export const PATTERN_125_META={id:125,name:"TrustedToolRegistry",family:"agent-interoperability",maturity:"emerging"} as const;
