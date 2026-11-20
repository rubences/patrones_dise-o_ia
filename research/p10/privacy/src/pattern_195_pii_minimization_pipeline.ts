/** Field allowlist demonstration, not free-text PII discovery or anonymization. */
export class PIIMinimizationPipeline {
  project(record:Record<string,unknown>,allowlist:ReadonlySet<string>,forbidden:ReadonlySet<string>){
    if(!record||typeof record!=="object"||Array.isArray(record))throw Error("invalid record");
    if([...allowlist].some(k=>forbidden.has(k)||k==="__proto__"||k==="constructor"||k==="prototype"))throw Error("PII field not allowed");
    const output:Record<string,unknown>={};
    for(const [key,value] of Object.entries(record)){
      if(allowlist.has(key)&&!forbidden.has(key))output[key]=structuredClone(value);
    }
    return output;
  }
}
export const PATTERN_195_META={id:195,family:"privacy-confidential-ai",maturity:"experimental"} as const;
