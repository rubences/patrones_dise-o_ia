/** Purpose-scoped in-memory consent state; no legal basis or identity verification. */
export class ConsentAwareDataProcessing {
  private grants=new Map<string,Map<string,{expiresAt:number}>>();
  grant(subject:string,purpose:string,expiresAt=Number.MAX_SAFE_INTEGER){
    if(!subject.trim()||!purpose.trim()||!Number.isFinite(expiresAt)||expiresAt<=Date.now())throw Error("invalid grant");
    const purposes=this.grants.get(subject)||new Map<string,{expiresAt:number}>();
    purposes.set(purpose,{expiresAt});this.grants.set(subject,purposes);
  }
  revoke(subject:string,purpose:string){this.grants.get(subject)?.delete(purpose);}
  authorize(subject:string,purpose:string,at=Date.now()){
    if(!subject.trim()||!purpose.trim()||!Number.isFinite(at))throw Error("invalid request");
    const grant=this.grants.get(subject)?.get(purpose);
    if(!grant||at>=grant.expiresAt)throw Error("consent denied");
    return true;
  }
}
export const PATTERN_197_META={id:197,family:"privacy-confidential-ai",maturity:"experimental"} as const;
