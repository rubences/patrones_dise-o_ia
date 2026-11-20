/** Educational basic (epsilon,delta) additive accountant. No noise mechanism or concurrency safety. */
export class DifferentialPrivacyBudgetGate {
  private spent=new Map<string,{epsilon:number;delta:number}>();
  constructor(private readonly limits:{epsilon:number;delta:number}){
    if(!Number.isFinite(limits.epsilon)||limits.epsilon<=0||!Number.isFinite(limits.delta)||limits.delta<0||limits.delta>=1)throw Error("invalid limits");
  }
  reserve(subject:string,epsilon:number,delta:number){
    if(!subject.trim()||!Number.isFinite(epsilon)||epsilon<0||!Number.isFinite(delta)||delta<0||epsilon===0&&delta===0)throw Error("invalid request");
    const prev=this.usage(subject);
    const next={epsilon:prev.epsilon+epsilon,delta:prev.delta+delta};
    const tolerance=Number.EPSILON*8;
    if(next.epsilon>this.limits.epsilon+tolerance||next.delta>this.limits.delta+tolerance)throw Error("privacy budget exceeded");
    this.spent.set(subject,next);return {...next};
  }
  usage(subject:string){return {...(this.spent.get(subject)||{epsilon:0,delta:0})};}
  remaining(subject:string){const spent=this.usage(subject);return {epsilon:Math.max(0,this.limits.epsilon-spent.epsilon),delta:Math.max(0,this.limits.delta-spent.delta)};}
}
export const PATTERN_191_META={id:191,family:"privacy-confidential-ai",maturity:"experimental"} as const;
