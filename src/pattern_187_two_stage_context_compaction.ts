/** PATRÓN 187 — TwoStageContextCompaction. Referencia pedagógica: no ejecuta efectos externos. */
export class TwoStageContextCompaction{compact(chunks:string[],limit:number){if(limit<1)throw Error("invalid limit");const unique=[...new Set(chunks.map(x=>x.trim()).filter(Boolean))];return {chunks:unique.slice(-limit),requiresSummary:unique.length>limit};}}
export const PATTERN_187_META={id:187,name:"TwoStageContextCompaction",family:"agent-runtime-harness",maturity:"emerging"} as const;
