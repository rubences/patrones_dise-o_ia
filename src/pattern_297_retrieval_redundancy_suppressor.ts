/** P12 297: deterministic educational context engineering reference, not LLM safety certification. */
export class Pattern297Contract{deduplicate<T extends {id:string;content:string}>(docs:T[]){if(docs.some(x=>!x.id.trim()||!x.content.trim()))throw Error("invalid document");const seen=new Set<string>();return docs.filter(x=>{const key=x.content.trim();if(seen.has(key))return false;seen.add(key);return true;});}}
export const PATTERN_297_META={id:297,family:"context-engineering",maturity:"experimental"} as const;
