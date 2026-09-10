# Chapter 3 — Tool Ecosystems and Model Context Protocol

> **Submission sample · draft 0.1.** This chapter is intentionally written as research-monograph prose, not as a catalogue entry or tutorial. Quantitative results are not invented: planned measurements are identified as experiments to be executed before final manuscript submission.

## 3.1 From language generation to delegated action

A language model that only produces text is already difficult to evaluate, but a language model that can invoke tools changes the engineering problem qualitatively. The output is no longer merely content; it can become an instruction that crosses a trust boundary and affects a database, a file system, an API, a workflow engine or another software agent. In that setting, the central architectural question is not whether the model can produce a syntactically valid tool call. It is whether the system can constrain **what authority the model is allowed to exercise, under which evidence, and with which recovery semantics**.

This chapter treats tool use as a capability architecture. It composes eight patterns from the companion catalogue: Tool Use (5), Function Calling (28), Agent Registry (65), MCP Server (82), Dynamic Tool Discovery (83), Code Sandboxing (84), Tool Output Sanitization (100) and Tool Call Validation (101). The patterns are not assumed to be universally beneficial. Their purpose is to expose explicit design forces so that a system can justify why a capability exists, how it is selected, how its inputs and outputs are validated, and how execution is contained.

## 3.2 The capability-boundary thesis

The chapter advances the following thesis:

> A tool-enabled AI system should be modelled as a set of capability boundaries around an untrusted probabilistic decision component, not as a model with a convenient list of functions.

The model can propose. Deterministic components must decide what can be executed.

This distinction separates four responsibilities that are often collapsed in demonstrations:

1. **Discovery:** what capabilities exist?
2. **Selection:** which capability is appropriate for the current task?
3. **Authorization and validation:** is this invocation allowed and well formed in the current context?
4. **Execution and evidence:** what happened, what was returned, and what can be trusted about the result?

When those responsibilities are collapsed into a single model prompt, the system becomes difficult to audit and difficult to fail closed. When they are separated, each boundary can be tested independently.

## 3.3 A reference architecture

A minimal capability-safe architecture can be expressed as the following flow:

```text
User / Upstream Event
        |
        v
+---------------------+
| Intent / Plan Layer |
+---------------------+
        |
        v
+----------------------+        +------------------+
| Capability Discovery |<------>| Agent/Tool       |
| & Registry            |        | Registry         |
+----------------------+        +------------------+
        |
        v
+----------------------+
| Policy + Tool Call   |
| Validation Gate      |
+----------------------+
        |
   deny | allow
        v
+----------------------+
| Sandboxed / Scoped   |
| Execution Adapter    |
+----------------------+
        |
        v
+----------------------+
| Output Sanitization  |
| + Provenance         |
+----------------------+
        |
        v
+----------------------+
| Model / Orchestrator |
| consumes evidence    |
+----------------------+
```

The model is intentionally absent from the authorization decision. It may generate a candidate invocation, but the validator compares that candidate against a deterministic schema, an allowlist and the current execution context.

## 3.4 Function calling is an interface, not an authority model

Function-calling APIs solve a valuable interface problem: they let the application describe callable operations and obtain structured arguments instead of parsing free text. That is an important reduction in ambiguity, but it should not be confused with authorization.

Consider an application exposing the following conceptual operation:

```ts
interface ToolCall {
  name: string;
  arguments: Record<string, unknown>;
}

interface ToolPolicy {
  allowedTools: Set<string>;
  validate(name: string, args: unknown): ValidationResult;
  authorize(name: string, args: unknown, context: ExecutionContext): Decision;
}
```

The structured call is only the first object. The security property appears only when validation and authorization are implemented outside the model and can reject the request regardless of how confidently the model produced it.

The distinction becomes more important when tools have side effects. A weather lookup and a payment operation are both “functions” at the syntax layer, but they differ radically in blast radius, evidence requirements, reversibility and human-approval needs.

## 3.5 MCP as an interoperability boundary

The Model Context Protocol provides a standardized way to connect AI applications with external capabilities and context providers. The companion evidence registry anchors this chapter to the MCP specification version recorded as `mcp-2026-07-28`. The standard is treated here as an interoperability source, not as evidence that every MCP deployment is secure by construction.

Architecturally, MCP increases the importance of separating protocol correctness from policy correctness. A client can successfully discover a tool, understand its schema and invoke it according to protocol while still making a decision that violates the application's security policy. Therefore an MCP-aware architecture should preserve at least three independent layers:

- **protocol layer:** transport, discovery and message semantics;
- **capability layer:** what the exposed server/tool is allowed to do;
- **application policy layer:** whether this particular user, agent, workflow and incident state may invoke that capability now.

This layered view avoids a common category error: treating successful protocol negotiation as successful authorization.

## 3.6 Dynamic discovery and the expanding attack surface

Dynamic Tool Discovery (Pattern 83) improves extensibility because agents do not need every capability hard-coded at design time. The same property expands the decision surface. A newly discoverable capability may have unfamiliar semantics, excessive privileges or a deceptively benign description.

For this reason, discovery should produce **candidates**, not executable authority. Each discovered tool should be resolved into a registry record containing at least:

```text
capability_id
provider_identity
version
input_schema
side_effect_class
required_scopes
network/data boundaries
human_approval_policy
sandbox profile
output trust level
provenance metadata
```

A production registry can then deny unknown versions, quarantine newly discovered capabilities or require explicit review before promotion to an executable allowlist.

## 3.7 Tool-call validation as a deterministic gate

Pattern 101 formalizes the point at which a probabilistic suggestion becomes an executable request. A strong validator checks more than JSON shape. Depending on risk, it can enforce:

- exact tool identity and version;
- required and forbidden arguments;
- value ranges and enum membership;
- resource identifiers scoped to the current user or workflow;
- maximum batch sizes;
- path, URL or domain constraints;
- rate and cost ceilings;
- freshness of approvals;
- idempotency requirements;
- human confirmation for irreversible actions.

Validation must also distinguish **invalid**, **unauthorized** and **temporarily unavailable**. Conflating these outcomes encourages retry loops that can transform a policy denial into repeated pressure on the execution layer.

## 3.8 Sandboxing and constrained execution

Code Sandboxing (84) becomes relevant when the capability can execute generated code or commands. A sandbox does not make arbitrary code safe; it reduces the reachable resources and therefore the expected blast radius.

The chapter uses sandboxing as a compositional control with Bulkhead (46), Rate Limiting (80), Idempotency Keys (85) and Observability (77). A sandbox profile should specify CPU/memory/time limits, filesystem visibility, network policy, secrets exposure, process capabilities and outbound destinations. The resulting execution record becomes part of the evidence trail.

The research question is not “does sandboxing work?” in the abstract. It is: **how much failure containment is achieved for a declared workload and adversarial set, and what functionality or latency does that containment cost?**

## 3.9 Tool outputs are untrusted inputs

Tool Output Sanitization (100) addresses the return path. External tools can return malformed, stale, adversarial or instruction-like content. Retrieval systems, browsers, issue trackers and APIs may all expose text that attempts to influence subsequent model behaviour.

The correct architectural stance is symmetrical:

```text
model -> candidate call -> validation -> execution
execution -> untrusted result -> sanitization -> model
```

Sanitization can include schema validation, size limits, MIME/type checks, HTML/script removal, provenance labelling and separation between **data fields** and **instructions**. In high-risk workflows, the model should receive a normalized representation rather than raw external content.

## 3.10 Provenance and observability

A defensible tool ecosystem needs an execution ledger. For every invocation the system should be able to reconstruct:

- initiating user/workflow;
- model and orchestration version;
- selected capability and version;
- policy decision and reason;
- normalized arguments;
- execution timestamp and duration;
- side effects or resource identifiers;
- sanitized result hash or reference;
- retry/fallback path;
- human approvals, if any.

This is not logging for its own sake. It is the basis for regression analysis, incident reconstruction and experimental evaluation.

## 3.11 Planned empirical validation

The final chapter will evaluate competing capability architectures rather than report unverified percentages. The planned experiment compares at least three configurations:

**C0 — direct function calling:** model selects and invokes from a static list, with schema validation only.

**C1 — policy-gated tools:** static list plus deterministic authorization, argument constraints and provenance.

**C2 — governed dynamic ecosystem:** dynamic discovery plus registry trust state, policy gate, sandboxing, output sanitization and execution ledger.

The workload will contain benign tasks and adversarial cases such as over-privileged requests, malformed arguments, tool-description manipulation, hostile tool output and repeated side-effect requests. Measurements will include task completion, denied unsafe actions, false denials, latency overhead, cost, policy-decision explainability and recovery behaviour.

No numerical outcome is asserted in this draft. The manuscript will include results only after the benchmark harness, workload and environment have been versioned in the companion repository.

## 3.12 Design consequences

The main consequence of this architecture is conceptual: tool use stops being a prompting feature and becomes a distributed authorization problem with probabilistic intent generation at its front end.

The pattern composition proposed in this chapter is therefore:

```text
Agent Registry (65)
      -> Dynamic Tool Discovery (83)
      -> MCP Server / protocol adapter (82)
      -> Tool Call Validation (101)
      -> Code Sandboxing / scoped execution (84)
      -> Tool Output Sanitization (100)
      -> Observability / evidence ledger (77)
```

Tool Use (5) and Function Calling (28) remain essential, but they sit inside this larger control architecture rather than defining it.

## 3.13 Evidence anchors

Primary sources currently registered by the project and relevant to this sample include:

- Model Context Protocol Core Maintainers. *Model Context Protocol Specification 2026-07-28*. Registry ID `mcp-2026-07-28`.
- Timo Schick et al. *Toolformer: Language Models Can Teach Themselves to Use Tools*. NeurIPS 2023. Registry ID `schick-2023-toolformer`.
- NIST. *Adversarial Machine Learning: A Taxonomy and Terminology of Attacks and Mitigations*. NIST AI 100-2e2025. Registry ID `nist-ai-100-2e2025`.

These sources support protocol context, tool-use research context and adversarial terminology respectively. They do not, by themselves, validate the complete architecture proposed in this chapter; that claim requires the planned system-level experiments.
