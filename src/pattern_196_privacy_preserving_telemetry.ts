/** Small-group suppression is disclosure reduction, NOT differential privacy or anonymity. */
export class PrivacyPreservingTelemetry {
  aggregate(events:{tenant:string;metric:string;value:number}[],minimumCount:number){
    if(!Number.isInteger(minimumCount)||minimumCount<2)throw Error("invalid threshold");
    const groups=new Map<string,{sum:number;count:number}>();
    for(const event of events){
      if(!event.tenant.trim()||!event.metric.trim()||!Number.isFinite(event.value))throw Error("invalid event");
      const key=JSON.stringify([event.tenant,event.metric]);
      const prev=groups.get(key)||{sum:0,count:0};
      const next={sum:prev.sum+event.value,count:prev.count+1};
      if(!Number.isFinite(next.sum))throw Error("invalid aggregate");
      groups.set(key,next);
    }
    return [...groups].filter(([,v])=>v.count>=minimumCount).map(([key,v])=>({group:JSON.parse(key) as [string,string],count:v.count,mean:v.sum/v.count}));
  }
}
export const PATTERN_196_META={id:196,family:"privacy-confidential-ai",maturity:"experimental"} as const;
