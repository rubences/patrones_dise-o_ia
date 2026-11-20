/** P11 231: educational synthetic-data contract; not privacy or fidelity certification. */
export class Pattern231Contract{tag(datasetId:string,generator:string,sourceDigests:string[]){if(!datasetId.trim()||!generator.trim()||sourceDigests.some(d=>!/^[a-f0-9]{64}$/i.test(d)))throw Error("invalid provenance");return {datasetId,generator,synthetic:true as const,sourceDigests:[...new Set(sourceDigests.map(d=>d.toLowerCase()))]};}}
export const PATTERN_231_META={id:231,family:"trustworthy-synthetic-simulation",maturity:"experimental"} as const;
