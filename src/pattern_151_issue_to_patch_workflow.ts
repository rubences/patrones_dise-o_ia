/** PATRÓN 151 — IssueToPatchWorkflow. Referencia pedagógica: no ejecuta efectos externos. */
export class IssueToPatchWorkflow{private state="specified";advance(next:"patched"|"tested"|"reviewed"){const order=["specified","patched","tested","reviewed"];if(order.indexOf(next)!==order.indexOf(this.state)+1)throw Error("invalid transition");this.state=next;return this.state;}}
export const PATTERN_151_META={id:151,name:"IssueToPatchWorkflow",family:"agentic-software-engineering",maturity:"emerging"} as const;
