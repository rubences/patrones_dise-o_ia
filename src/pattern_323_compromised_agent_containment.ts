/** P12 323: educational incident response reference; no forensic chain-of-custody certification. */
export class Pattern323Contract{decide(agent:{id:string;compromised:boolean;quarantined:boolean}){if(!agent.id.trim())throw Error("invalid agent");return {agentId:agent.id,denyTools:agent.compromised||agent.quarantined,denyDelegation:agent.compromised||agent.quarantined};}}
export const PATTERN_323_META={id:323,family:"ai-incident-forensics",maturity:"experimental"} as const;
