/** PATRÓN 129 — A2AAgentCardTrust
 * Contratos de referencia P8. No es una implementación de transporte MCP/A2A ni certificación de conformidad.
 */
export class A2AAgentCardTrust{constructor(private readonly trustedOrigins:ReadonlySet<string>){}validate(card:{name:string;url:string;skills?:unknown[]}){const u=new URL(card.url);if(u.protocol!=="https:"||!this.trustedOrigins.has(u.origin)||!card.name||!Array.isArray(card.skills))throw Error("untrusted agent card");return {name:card.name,url:u.toString(),skills:card.skills.length};}}
export const PATTERN_129_META={id:129,name:"A2AAgentCardTrust",family:"agent-interoperability",maturity:"emerging"} as const;
