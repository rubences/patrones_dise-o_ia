import { strict as assert } from "node:assert";
import { test } from "node:test";
import { Pattern341Contract } from "../src/pattern_341_decision_provenance_ledger.js";
import { Pattern342Contract } from "../src/pattern_342_risk_adaptive_action_authorization.js";
import { Pattern343Contract } from "../src/pattern_343_counterfactual_decision_review.js";
import { Pattern344Contract } from "../src/pattern_344_decision_confidence_calibration.js";
import { Pattern345Contract } from "../src/pattern_345_reversible_action_planner.js";
import { Pattern346Contract } from "../src/pattern_346_policy_constrained_decision_optimizer.js";
import { Pattern347Contract } from "../src/pattern_347_multi_stakeholder_decision_arbitration.js";
import { Pattern348Contract } from "../src/pattern_348_decision_to_outcome_feedback_loop.js";
import { Pattern349Contract } from "../src/pattern_349_autonomous_action_budget_controller.js";
import { Pattern350Contract } from "../src/pattern_350_operational_decision_assurance_gate.js";
const contracts=[Pattern341Contract,Pattern342Contract,Pattern343Contract,Pattern344Contract,Pattern345Contract,Pattern346Contract,Pattern347Contract,Pattern348Contract,Pattern349Contract,Pattern350Contract];
for (const [i,Contract] of contracts.entries()) {
 test(`P13 ${341+i}: valid and invalid decisions`,()=>{
  const gate=new Contract();
  const valid={decisionId:"d1",actor:"agent",risk:0.2,evidence:["record"],approved:true,cost:1,budget:2};
  assert.equal(gate.evaluate(valid).allowed,true);
  assert.equal(gate.evaluate({...valid,approved:false}).allowed,false);
  assert.equal(gate.evaluate({...valid,risk:Number.NaN}).allowed,false);
  assert.equal(gate.evaluate({...valid,cost:3}).allowed,false);
  assert.equal(gate.evaluate({...valid,evidence:[]}).allowed,false);
  assert.equal(gate.evaluate(valid).audit.patternId,341+i);
 });
}
