/** Quorum and participant-policy coordinator only. No cryptographic secure aggregation. */
export class SecureAggregationCoordinator {
  authorize(participants:string[],minimum:number){
    if(!Number.isInteger(minimum)||minimum<2||participants.some(x=>typeof x!=="string"||!x.trim())||new Set(participants).size!==participants.length||participants.length<minimum)throw Error("aggregation quorum denied");
    return {quorumMet:true as const,participants:participants.length,requiresCryptographicAggregation:true as const};
  }
  assessDropout(expected:string[],received:string[],minimum:number){
    if(!Number.isInteger(minimum)||minimum<2||expected.length<minimum||new Set(expected).size!==expected.length||expected.some(x=>!x.trim())||new Set(received).size!==received.length||received.some(x=>!x.trim()))throw Error("invalid round");
    const enrolled=new Set(expected);
    if(received.some(x=>!enrolled.has(x)))throw Error("unknown participant");
    const missing=expected.filter(x=>!received.includes(x));
    return {quorumMet:received.length>=minimum,received:received.length,missing,requiresCryptographicAggregation:true as const};
  }
}
export const PATTERN_194_META={id:194,family:"privacy-confidential-ai",maturity:"experimental"} as const;
