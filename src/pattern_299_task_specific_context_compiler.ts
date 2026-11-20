/** P12 299: deterministic educational context engineering reference, not LLM safety certification. */
export class Pattern299Contract{compile(task:string,sections:{id:string;content:string;tasks:string[]}[]){if(!task.trim()||sections.some(x=>!x.id.trim()||!x.content.trim()||x.tasks.some(t=>!t.trim())))throw Error("invalid context");return sections.filter(x=>x.tasks.includes(task)).map(x=>({id:x.id,content:x.content}));}}
export const PATTERN_299_META={id:299,family:"context-engineering",maturity:"experimental"} as const;
