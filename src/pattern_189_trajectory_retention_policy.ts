/** PATRÓN 189 — TrajectoryRetentionPolicy. Referencia pedagógica: no ejecuta efectos externos. */
export class TrajectoryRetentionPolicy{shouldRetain(createdAt:number,now:number,ttlMs:number){if(ttlMs<0||createdAt>now)throw Error("invalid retention");return now-createdAt<ttlMs;}}
export const PATTERN_189_META={id:189,name:"TrajectoryRetentionPolicy",family:"agent-runtime-harness",maturity:"emerging"} as const;
