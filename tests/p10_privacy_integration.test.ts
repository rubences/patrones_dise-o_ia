import test from "node:test";
import assert from "node:assert/strict";
import {PrivateRetrievalPolicy} from "../research/p10/privacy/src/pattern_193_private_retrieval_policy.js";
import {PIIMinimizationPipeline} from "../research/p10/privacy/src/pattern_195_pii_minimization_pipeline.js";
import {ConsentAwareDataProcessing} from "../research/p10/privacy/src/pattern_197_consent_aware_data_processing.js";
import {PrivacyProcessingWorkflow} from "../research/p10/privacy/src/privacy_processing_workflow.js";

const setup=()=>{
 const consent=new ConsentAwareDataProcessing();
 const workflow=new PrivacyProcessingWorkflow(new PrivateRetrievalPolicy(),new PIIMinimizationPipeline(),consent);
 const documents=[
  {id:"d1",tenant:"hospital-a",subject:"s1",classification:"internal" as const,fields:{clinicalCode:"C01",name:"Sensitive"}},
  {id:"d2",tenant:"hospital-b",subject:"s2",classification:"public" as const,fields:{clinicalCode:"C02",name:"Sensitive"}},
  {id:"d3",tenant:"hospital-a",subject:"s3",classification:"restricted" as const,fields:{clinicalCode:"C03",name:"Sensitive"}}
 ];
 return {consent,workflow,documents};
};
test("P10 workflow exposes only authorized tenant, purpose and fields",()=>{
 const {consent,workflow,documents}=setup();
 consent.grant("s1","research");
 const result=workflow.process(documents,{tenant:"hospital-a",clearance:"internal"},"research",new Set(["clinicalCode"]),new Set(["name"]));
 assert.deepEqual(result,[{id:"d1",fields:{clinicalCode:"C01"}}]);
});
test("P10 workflow fails closed when consent is missing or revoked",()=>{
 const {consent,workflow,documents}=setup();
 const invoke=()=>workflow.process(documents,{tenant:"hospital-a",clearance:"internal"},"research",new Set(["clinicalCode"]),new Set(["name"]));
 assert.throws(invoke,/consent denied/);
 consent.grant("s1","research");assert.equal(invoke().length,1);
 consent.revoke("s1","research");assert.throws(invoke,/consent denied/);
});
test("P10 workflow rejects forbidden field even with valid consent",()=>{
 const {consent,workflow,documents}=setup();consent.grant("s1","research");
 assert.throws(()=>workflow.process(documents,{tenant:"hospital-a",clearance:"internal"},"research",new Set(["name"]),new Set(["name"])),/PII field/);
});
test("P10 workflow does not return restricted records at internal clearance",()=>{
 const {consent,workflow,documents}=setup();consent.grant("s1","research");consent.grant("s3","research");
 const result=workflow.process(documents,{tenant:"hospital-a",clearance:"internal"},"research",new Set(["clinicalCode"]),new Set(["name"]));
 assert.deepEqual(result.map(x=>x.id),["d1"]);
});
