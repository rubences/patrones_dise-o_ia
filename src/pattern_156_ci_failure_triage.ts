/** PATRÓN 156 — CIFailureTriage. Referencia pedagógica: no ejecuta efectos externos. */
export class CIFailureTriage{classify(exitCode:number,logs:string){if(exitCode===0)return "pass";if(/timeout/i.test(logs))return "timeout";if(/permission|denied/i.test(logs))return "security";return "failure";}}
export const PATTERN_156_META={id:156,name:"CIFailureTriage",family:"agentic-software-engineering",maturity:"emerging"} as const;
