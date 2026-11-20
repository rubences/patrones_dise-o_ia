/** P12 298: deterministic educational context engineering reference, not LLM safety certification. */
export class Pattern298Contract{wrap(text:string,origin:"trusted"|"untrusted"){if(!text.trim()||!["trusted","untrusted"].includes(origin))throw Error("invalid context");return {content:text,origin,mayIssueInstructions:origin==="trusted",limitation:"metadata alone cannot enforce prompt injection isolation" as const};}}
export const PATTERN_298_META={id:298,family:"context-engineering",maturity:"experimental"} as const;
