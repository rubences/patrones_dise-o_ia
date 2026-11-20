/** P12 287: educational identity-policy contract, not real credential issuance or cryptographic authentication. */
export class Pattern287Contract{assess(previous:{expiresAt:number},next:{validFrom:number;expiresAt:number},now:number){if(![previous.expiresAt,next.validFrom,next.expiresAt,now].every(Number.isFinite)||next.validFrom>=next.expiresAt)throw Error("invalid rotation");return {continuous:next.validFrom<=previous.expiresAt&&next.validFrom<=now&&next.expiresAt>now};}}
export const PATTERN_287_META={id:287,family:"agent-identity-trust",maturity:"experimental"} as const;
