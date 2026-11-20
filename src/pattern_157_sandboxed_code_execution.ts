/** PATRÓN 157 — SandboxedCodeExecution. Referencia pedagógica: no ejecuta efectos externos. */
export class SandboxedCodeExecution{constructor(private readonly allowed:ReadonlySet<string>){}plan(command:string,network:boolean){if(!this.allowed.has(command)||network)throw Error("sandbox policy denied");return {command,network:false,requiresExternalSandbox:true};}}
export const PATTERN_157_META={id:157,name:"SandboxedCodeExecution",family:"agentic-software-engineering",maturity:"emerging"} as const;
