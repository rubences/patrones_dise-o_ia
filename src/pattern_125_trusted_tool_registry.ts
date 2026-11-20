/** Trusted tool registry: HTTPS origin and expiry policy, not signature verification or attestation. */
export class TrustedToolRegistry {
  private tools=new Map<string,{origin:string;expires:number}>();
  private normalize(origin:string){
    let url:URL;
    try{url=new URL(origin);}catch{throw Error("untrusted origin");}
    if(url.protocol!=="https:"||!url.hostname||url.username||url.password||url.search||url.hash||url.pathname!=="/")throw Error("untrusted origin");
    return url.origin;
  }
  register(name:string,origin:string,expires:number){
    if(!name||!Number.isFinite(expires)||expires<=Date.now())throw Error("untrusted");
    const canonical=this.normalize(origin);
    this.tools.set(name,{origin:canonical,expires});
  }
  resolve(name:string,origin:string){
    const canonical=this.normalize(origin);
    const item=this.tools.get(name);
    if(!item||item.origin!==canonical||item.expires<=Date.now())throw Error("untrusted tool");
    return {...item};
  }
}
export const PATTERN_125_META={id:125,name:"TrustedToolRegistry",family:"agent-interoperability",maturity:"emerging"} as const;
