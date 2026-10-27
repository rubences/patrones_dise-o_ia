# Detailed Outline — Research Monograph (EN)

The open catalogue contains 102 patterns. The monograph does **not** give all 102 equal chapter weight; it selects and composes them around research questions. Pattern IDs remain stable so readers can move from the book to the web and executable repository.

## Part I — Foundations and Agentic Architecture

### Chapter 1. Pattern Languages for AI-Intensive Systems

Research question: how can recurring AI-system structures be represented so that intent, forces, quality attributes, evidence and interactions remain comparable?

Core patterns: 1, 2, 9, 10, 11, 13, 16.

Original material: terminology, pattern meta-model, architecture quality model, composition notation, evidence levels and distinction between probabilistic components and deterministic controls.

### Chapter 2. Agentic Control and Orchestration

Research question: which control structures make autonomous workflows bounded, inspectable and recoverable?

Core patterns: 1, 2, 3, 4, 5, 6, 27, 28, 54, 60.

Original material: agentic control plane, termination contracts, evaluator feedback, authority transitions, comparison of centralized and distributed orchestration.

### Chapter 3. Tool Ecosystems and Model Context Protocol

Research question: how should capabilities be discovered, authorized, invoked and isolated when models can act on external systems?

Core patterns: 5, 28, 65, 82, 83, 84, 100, 101.

Original material: MCP capability architecture, trust boundaries, input/output validation model, sandboxing, lifecycle and protocol-version traceability.

## Part II — Cognition, Knowledge and Coordination

### Chapter 4. Knowledge and Context Architectures

Research question: how should knowledge selection and provenance be engineered independently from model generation?

Core patterns: 25, 37, 41, 48, 49, 51, 52, 66, 86, 98.

Original material: context supply chain, provenance graph, freshness and retrieval failure model, token/latency budget allocation.

### Chapter 5. Reasoning and Evaluator Architectures

Research question: when do additional inference paths improve system-level decisions, and how can this be verified externally?

Core patterns: 3, 4, 26, 36, 42, 54, 55, 68, 73.

Original material: taxonomy of reasoning-time compute, evaluator independence, stopping policies, benchmark design and failure cases.

### Chapter 6. Multi-Agent Coordination

Research question: when is multi-agent decomposition superior to a single orchestrated agent, after communication and failure costs are counted?

Core patterns: 7, 23, 56, 57, 60, 63, 65, 87.

Original material: coordination topologies, delegation contracts, shared-state consistency, dispute resolution and observability requirements.

## Part III — Dependability

### Chapter 7. Reliability and Resilience

Research question: how can conventional resilience mechanisms be adapted to probabilistic AI services without hiding semantic failures?

Core patterns: 44, 45, 46, 47, 58, 81, 85, 90, 93, 94.

Original material: semantic versus transport failure, retry safety, idempotency, rollback boundaries, health semantics and graceful degradation.

### Chapter 8. Security and Safety by Architecture

Research question: which architectural controls reduce the authority of untrusted model output and external context?

Core patterns: 53, 62, 69, 70, 71, 72, 74, 84, 89, 100, 101, 102.

Original material: layered threat model, capability authorization, prompt/data boundaries, tool-output sanitization, adversarial evaluation and recovery loops.

### Chapter 9. Observability, Evaluation and FinOps

Research question: which measurements are necessary to compare AI architecture choices rather than isolated model scores?

Core patterns: 73, 75, 76, 77, 78, 80, 88, 92.

Original material: cross-layer telemetry schema, experiment integrity, regression gates, cost attribution, service-level indicators and decision dashboards.

## Part IV — Distributed Research Exemplars

### Chapter 10. Edge-Mesh-Cloud AI Architectures

Research question: how should inference, coordination, data and safety controls be placed under latency, connectivity and resource constraints?

Core patterns: 2, 7, 38, 39, 45, 46, 56, 65, 77, 81, 88, 93, 94.

Planned original case study: hierarchical Edge–Mesh–Cloud architecture with controlled placement, model fallback, fault domains, observability and resource-aware routing. Experiments must report topology, workload, latency distribution, failure injection and cost/resource metrics.

### Chapter 11. High-Dependability Vehicular and C-V2X Systems

Research question: how does the pattern language behave in a dynamic distributed environment with strict latency and trust constraints?

Core patterns: 7, 45, 46, 47, 57, 65, 72, 77, 85, 90, 94.

Planned original case study: vehicular/C-V2X decision pipeline combining distributed coordination, access control, failure containment and evidence. Any empirical values included in the final book require a reproducible dataset or cited primary study.

### Chapter 12. Empirical Validation and Research Agenda

Research question: how can the field test whether a pattern or composition actually improves a stated quality attribute?

Core patterns: 42, 43, 73, 74, 75, 76, 77, 99, 102.

Original material: experiment templates, ablations, counterfactual baselines, adversarial scenarios, reproducibility checklist, threats to validity and a roadmap for an evidence-backed pattern language.

## Appendices under consideration

- Machine-readable pattern index.
- Composition graph.
- Reproducibility checklist.
- Security review checklist.
- Evidence registry snapshot with version/hash.
- Mapping between pattern IDs and repository implementations.

Appendices may move to the companion website if publisher page limits make a print version inefficient.
