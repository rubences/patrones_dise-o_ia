/** PATRÓN 153 — TestFirstRepairAgent. Referencia pedagógica: no ejecuta efectos externos. */
export class TestFirstRepairAgent{private failing=new Set<string>();recordFailure(testId:string){if(!testId)throw Error("missing test");this.failing.add(testId);}authorizeRepair(testId:string){if(!this.failing.has(testId))throw Error("no failing regression");return true;}}
export const PATTERN_153_META={id:153,name:"TestFirstRepairAgent",family:"agentic-software-engineering",maturity:"emerging"} as const;
