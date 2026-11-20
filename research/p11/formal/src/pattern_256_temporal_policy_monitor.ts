/** P11 256: bounded educational runtime assurance, not formal proof or certification. */
export class Pattern256Contract{check(events:{time:number}[],maxGap:number){if(!Number.isFinite(maxGap)||maxGap<0||events.some(e=>!Number.isFinite(e.time)))throw Error("invalid time");return events.every((e,i)=>i===0||e.time>=events[i-1].time&&e.time-events[i-1].time<=maxGap);}}
export const PATTERN_256_META={id:256,family:"formal-runtime-assurance",maturity:"experimental"} as const;
