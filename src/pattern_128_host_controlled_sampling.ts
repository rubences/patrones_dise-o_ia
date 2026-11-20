/** PATRÓN 128 — HostControlledSampling
 * Contratos de referencia P8. No es una implementación de transporte MCP/A2A ni certificación de conformidad.
 */
export class HostControlledSampling{constructor(private readonly maxTokens:number,private readonly allowedModels:ReadonlySet<string>){}authorize(model:string,tokens:number,context:string){if(!this.allowedModels.has(model)||!Number.isInteger(tokens)||tokens<1||tokens>this.maxTokens)throw Error("sampling denied");return {model,maxTokens:tokens,context};}}
export const PATTERN_128_META={id:128,name:"HostControlledSampling",family:"agent-interoperability",maturity:"emerging"} as const;
