/** PATRÓN 188 — ToolOutputArtifactStore. Referencia pedagógica: no ejecuta efectos externos. */
export class ToolOutputArtifactStore{private entries=new Map<string,{owner:string;value:string}>();put(id:string,owner:string,value:string){if(!id||!owner)throw Error("invalid artifact");this.entries.set(id,{owner,value});}get(id:string,owner:string){const v=this.entries.get(id);if(!v||v.owner!==owner)throw Error("artifact denied");return v.value;}}
export const PATTERN_188_META={id:188,name:"ToolOutputArtifactStore",family:"agent-runtime-harness",maturity:"emerging"} as const;
