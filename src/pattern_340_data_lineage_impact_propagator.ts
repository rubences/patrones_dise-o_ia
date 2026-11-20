/** P12 340: educational semantic data contract; not production interoperability certification. */
export class Pattern340Contract{affected(source:string,edges:{from:string;to:string}[]){if(!source.trim()||edges.some(x=>!x.from.trim()||!x.to.trim()))throw Error("invalid lineage");const seen=new Set([source]),queue=[source];for(let i=0;i<queue.length;i++)for(const e of edges)if(e.from===queue[i]&&!seen.has(e.to)){seen.add(e.to);queue.push(e.to);}return [...seen].sort();}}
export const PATTERN_340_META={id:340,family:"ai-data-contracts",maturity:"experimental"} as const;
