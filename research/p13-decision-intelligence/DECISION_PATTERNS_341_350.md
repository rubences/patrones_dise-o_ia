# P13 — Agentic Decision Intelligence & Operational Control

**Status:** design proposal, not implemented or evidence-verified. **Target:** IDs 341–350, proposed family `agentic-decision-intelligence`, proposed legacy group 53. **Baseline:** main v21.7.0 / 340 patterns. This file is not a canonical pattern entry and must not increase catalogSize until the implementation gates pass.

## Proposed patterns

### 341 — Decision Provenance Ledger

- **Contract:** Append-only decision records with actor, policy version, input hashes, decision and outcome; never log raw secrets.
- **Acceptance:** Replay and verify immutable identifiers; reject missing provenance.
- **Evidence:** needs-review; no production assurance or scientific validation asserted.

### 342 — Risk-Adaptive Action Authorization

- **Contract:** Authorize action based on impact, reversibility, identity, context and explicit policy; fail closed.
- **Acceptance:** Deny missing policy, expired grants and high-risk unapproved actions.
- **Evidence:** needs-review; no production assurance or scientific validation asserted.

### 343 — Counterfactual Decision Review

- **Contract:** Compare a recorded decision against bounded alternatives without claiming causal identification.
- **Acceptance:** Mark assumptions, prohibit ungrounded causal claims.
- **Evidence:** needs-review; no production assurance or scientific validation asserted.

### 344 — Decision Confidence Calibration

- **Contract:** Compare declared confidence with observed outcomes using held-out evaluation.
- **Acceptance:** Detect overconfidence and insufficient sample sizes.
- **Evidence:** needs-review; no production assurance or scientific validation asserted.

### 345 — Reversible Action Planner

- **Contract:** Construct compensating steps before executing side-effecting actions.
- **Acceptance:** Reject irreversible actions without human approval.
- **Evidence:** needs-review; no production assurance or scientific validation asserted.

### 346 — Policy-Constrained Decision Optimizer

- **Contract:** Choose candidate actions only after hard constraints and policy checks.
- **Acceptance:** Never trade a mandatory policy constraint for utility.
- **Evidence:** needs-review; no production assurance or scientific validation asserted.

### 347 — Multi-Stakeholder Decision Arbitration

- **Contract:** Resolve conflicting stakeholder proposals using documented priority and escalation rules.
- **Acceptance:** Escalate deadlock and never fabricate consensus.
- **Evidence:** needs-review; no production assurance or scientific validation asserted.

### 348 — Decision-to-Outcome Feedback Loop

- **Contract:** Link decisions to later observed outcomes and drift indicators.
- **Acceptance:** Separate observed outcomes from attribution.
- **Evidence:** needs-review; no production assurance or scientific validation asserted.

### 349 — Autonomous Action Budget Controller

- **Contract:** Enforce scoped limits on spending, API calls, side effects and time.
- **Acceptance:** Reject exhausted or mismatched budgets.
- **Evidence:** needs-review; no production assurance or scientific validation asserted.

### 350 — Operational Decision Assurance Gate

- **Contract:** Block action until evidence, approvals, provenance and execution preconditions pass.
- **Acceptance:** Fail closed when any required gate is absent.
- **Evidence:** needs-review; no production assurance or scientific validation asserted.

## Integration checklist

1. Audit duplicates and overlaps against patterns 1–340 before allocating final IDs.
2. Add the family and group to `catalog/taxonomy.json`, then create one `src/pattern_<id>_<slug>.ts` and `content/patterns/<id>-<slug>.md` per pattern.
3. Add inventory entries to `catalog/patterns.json`, scripts to `package.json`, public exports to `src/index.ts`, and synchronize package lock, README and web metadata.
4. Write positive, negative, and boundary tests; ensure authorization and irreversible operations fail closed.
5. Run repository consistency, editorial, evidence, publication and web CI gates before labeling implemented or published.
6. Keep primary evidence mappings separate from educational contracts; do not inflate verified-evidence totals.

## Design invariants

- The policy engine, not the model's confidence, decides whether an action is permitted.
- Observability is not equivalent to authorization or audit integrity.
- Compensating actions are not necessarily true reversals.
- Outcome correlation is not causal proof.
- Missing permissions, evidence or safety preconditions result in refusal or human escalation.
