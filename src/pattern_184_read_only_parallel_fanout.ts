/** PATRÓN 184 — ReadOnlyParallelFanout. Referencia pedagógica: no ejecuta efectos externos. */
export class ReadOnlyParallelFanout{plan(actions:{name:string;effect:"read"|"write"}[]){if(actions.some(a=>a.effect!=="read"||!a.name))throw Error("write cannot fan out");return actions.map(a=>a.name);}}
export const PATTERN_184_META={id:184,name:"ReadOnlyParallelFanout",family:"agent-runtime-harness",maturity:"emerging"} as const;
