/** PATRÓN 133 — ArgumentAwareLeastPrivilege
 * Contratos de referencia P8. No es una implementación de transporte MCP/A2A ni certificación de conformidad.
 */
export class ArgumentAwareLeastPrivilege{constructor(private readonly policy:(subject:string,resource:string,effect:string,args:Record<string,unknown>)=>boolean){}check(subject:string,resource:string,effect:string,args:Record<string,unknown>){if(!subject||!resource||!effect||!args||typeof args!=="object"||!this.policy(subject,resource,effect,args))throw Error("least privilege denied");return true;}}
export const PATTERN_133_META={id:133,name:"ArgumentAwareLeastPrivilege",family:"agent-interoperability",maturity:"emerging"} as const;
