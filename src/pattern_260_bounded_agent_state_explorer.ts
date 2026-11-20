/** P11 260: bounded educational runtime assurance, not formal proof or certification. */
export class Pattern260Contract{explore(start:number,next:(state:number)=>number,limit:number){if(!Number.isInteger(limit)||limit<0||!Number.isFinite(start))throw Error("invalid exploration");const states=[start];for(let i=0;i<limit;i++){const state=next(states.at(-1)!);if(!Number.isFinite(state))throw Error("invalid state");states.push(state);}return states;}}
export const PATTERN_260_META={id:260,family:"formal-runtime-assurance",maturity:"experimental"} as const;
