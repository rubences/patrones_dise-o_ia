/** P13 349: experimental operational decision contract; no autonomous authorization guarantee. */
export type Decision349Input = {decisionId:string; actor:string; risk:number; evidence:string[]; approved:boolean; cost:number; budget:number};
export type Decision349Result = {allowed:boolean; reasons:string[]; audit:{patternId:number; decisionId:string; actor:string; evidence:string[]}};
/** Fail-closed deterministic reference gate; policy and evidence verification remain external. */
export class Pattern349Contract {
 evaluate(input:Decision349Input):Decision349Result {
  const reasons:string[]=[];
  if(!input.decisionId?.trim()||!input.actor?.trim()) reasons.push("missing identity");
  if(!Number.isFinite(input.risk)||input.risk<0||input.risk>1) reasons.push("invalid risk");
  if(!Array.isArray(input.evidence)||!input.evidence.length||input.evidence.some(x=>typeof x!=="string"||!x.trim())) reasons.push("missing evidence");
  if(!input.approved) reasons.push("approval required");
  if(!Number.isFinite(input.cost)||!Number.isFinite(input.budget)||input.cost<0||input.budget<0||input.cost>input.budget) reasons.push("budget exceeded or invalid");
  if(input.risk>0.5) reasons.push("risk exceeds reference threshold");
  return {allowed:reasons.length===0,reasons,audit:{patternId:349,decisionId:input.decisionId,actor:input.actor,evidence:Array.isArray(input.evidence)?input.evidence.filter(x=>typeof x==="string"):[]}};
 }
}
export const PATTERN_349_META={id:349,family:"agentic-decision-control",maturity:"experimental"} as const;
