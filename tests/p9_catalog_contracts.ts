import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { IssueToPatchWorkflow } from "../src/pattern_151_issue_to_patch_workflow.js";
import { IndependentCodeVerifier } from "../src/pattern_154_independent_code_verifier.js";
import { ControlledWriteBarrier } from "../src/pattern_185_controlled_write_barrier.js";
import { BoundedAgentIteration } from "../src/pattern_183_bounded_agent_iteration.js";
import { Pattern135Contract } from "../src/pattern_135_episodic_memory_consolidation.js";
const catalog=JSON.parse(readFileSync("catalog/patterns.json","utf8"));
const taxonomy=JSON.parse(readFileSync("catalog/taxonomy.json","utf8"));
assert.ok(catalog.catalogSize>=190);assert.equal(taxonomy.catalogSize,catalog.catalogSize);assert.ok(taxonomy.families.length>=22);assert.equal(catalog.patterns.length,catalog.catalogSize);
for(let id=135;id<=190;id++){const record=catalog.patterns.find((x:{id:number})=>x.id===id);assert.ok(record);assert.ok(existsSync(record.sourceFile));assert.ok(existsSync(record.canonicalContent));assert.equal(record.evidenceStatus,"needs-review");}
const flow=new IssueToPatchWorkflow();assert.throws(()=>flow.advance("reviewed"));flow.advance("patched");flow.advance("tested");flow.advance("reviewed");
assert.throws(()=>new IndependentCodeVerifier().verify("same","same",true));assert.equal(new IndependentCodeVerifier().verify("author","reviewer",true),true);
const barrier=new ControlledWriteBarrier();barrier.prepare("write-1");assert.throws(()=>barrier.commit("write-1",false));assert.equal(barrier.commit("write-1",true),true);
const bounded=new BoundedAgentIteration(1);bounded.step();assert.throws(()=>bounded.step());
const memory=new Pattern135Contract();memory.put("m","alice","value");assert.throws(()=>memory.get("m","bob"));assert.equal(memory.get("m","alice"),"value");
console.log("P9 catalog structure and representative negative contract tests passed");
