/** P12 336: educational semantic data contract; not production interoperability certification. */
export class Pattern336Contract{validate(dataset:{validFrom:number;validUntil:number;observedAt:number},asOf:number){if(![dataset.validFrom,dataset.validUntil,dataset.observedAt,asOf].every(Number.isFinite)||dataset.validFrom>=dataset.validUntil)throw Error("invalid temporal metadata");return dataset.validFrom<=asOf&&asOf<dataset.validUntil&&dataset.observedAt<=asOf;}}
export const PATTERN_336_META={id:336,family:"ai-data-contracts",maturity:"experimental"} as const;
