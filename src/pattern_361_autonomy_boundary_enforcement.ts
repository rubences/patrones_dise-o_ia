/** P15 361: bounded-autonomy reference contract; external verification required. */
export class Pattern361Contract { check(requested:string[],allowed:string[]){const permitted=new Set(allowed);const denied=requested.filter(x=>!permitted.has(x));return {pass:denied.length===0,denied};} }
export const PATTERN_361_META={id:361,family:"bounded-agentic-autonomy",maturity:"experimental"} as const;
