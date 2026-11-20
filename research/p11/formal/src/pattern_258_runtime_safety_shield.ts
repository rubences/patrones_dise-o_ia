/** P11 258: bounded educational runtime assurance, not formal proof or certification. */
export class Pattern258Contract{shield(command:number,min:number,max:number){if(![command,min,max].every(Number.isFinite)||min>max)throw Error("invalid bounds");if(command<min||command>max)throw Error("unsafe command");return command;}}
export const PATTERN_258_META={id:258,family:"formal-runtime-assurance",maturity:"experimental"} as const;
