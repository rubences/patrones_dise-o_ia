/** P10 integration reference: policy + consent + minimization before exposing a record.
 * All decisions are in memory; never use as a production authorization boundary.
 */
import {PrivateRetrievalPolicy,type Classification} from "./pattern_193_private_retrieval_policy.js";
import {PIIMinimizationPipeline} from "./pattern_195_pii_minimization_pipeline.js";
import {ConsentAwareDataProcessing} from "./pattern_197_consent_aware_data_processing.js";

export type PrivacyDocument={id:string;tenant:string;subject:string;classification:Classification;fields:Record<string,unknown>};
export type PrivacyActor={tenant:string;clearance:Classification};
export class PrivacyProcessingWorkflow {
  constructor(
    private readonly retrieval:PrivateRetrievalPolicy,
    private readonly minimizer:PIIMinimizationPipeline,
    private readonly consent:ConsentAwareDataProcessing
  ){}
  process(documents:PrivacyDocument[],actor:PrivacyActor,purpose:string,allowlist:ReadonlySet<string>,forbidden:ReadonlySet<string>){
    if(!purpose.trim())throw Error("purpose required");
    const eligible=this.retrieval.filter(documents,actor);
    const output:{id:string;fields:Record<string,unknown>}[]=[];
    for(const document of eligible){
      if(!document.id.trim()||!document.subject.trim())throw Error("invalid document");
      this.consent.authorize(document.subject,purpose);
      output.push({id:document.id,fields:this.minimizer.project(document.fields,allowlist,forbidden)});
    }
    return output;
  }
}
