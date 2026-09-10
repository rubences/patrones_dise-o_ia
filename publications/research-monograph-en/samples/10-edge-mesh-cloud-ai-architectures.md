# Chapter 10 — Edge–Mesh–Cloud AI Architectures

> **Submission sample · draft 0.1.** This chapter is a research-oriented architectural draft. Performance values are deliberately left as experimental targets until measured in a versioned testbed.

## 10.1 Why placement becomes an AI design decision

In conventional cloud applications, deployment placement is often treated as an infrastructure optimization performed after the application architecture is already defined. AI-intensive systems weaken that separation. Model size, context volume, sensor rate, privacy, tool access, response deadlines and the cost of moving data all influence where inference, retrieval, coordination and validation can occur.

An Edge–Mesh–Cloud architecture therefore requires more than “running the same service in three places”. It needs explicit rules for **what must remain local, what may move, what can be delegated, how state is reconciled, and how semantic quality degrades when infrastructure changes**.

This chapter uses the project pattern language to model those decisions. Relevant patterns include Router (2), Multi-Agent (7), Mixture of Experts (38), Cascade (39), Circuit Breaker (45), Bulkhead (46), Agent Swarm (56), Agent Registry (65), Observability (77), Model Fallback (81), Batching (88), Speculative Execution (93) and Health Check (94).

## 10.2 Three planes, not three locations

The proposed architecture distinguishes three logical planes:

### Edge plane

The edge plane is closest to the physical event or user. It is responsible for tasks whose value decays quickly with latency or whose data should not be exported unnecessarily. Typical functions include sensor preprocessing, lightweight inference, safety checks, local caching and emergency fallback.

### Mesh plane

The mesh plane coordinates nearby edge nodes and regional services. Its purpose is not simply to add another hop. It enables cooperative context, workload redistribution, local consensus or arbitration, model/service discovery and resilience when direct cloud connectivity is intermittent.

### Cloud plane

The cloud plane provides elastic compute, global knowledge, heavy models, cross-region analytics, training/retraining pipelines and long-horizon state. It is the natural location for operations that benefit from aggregation and are not constrained by immediate deadlines.

The three planes can be deployed using many technologies. The architectural contribution is independent of a specific Kubernetes distribution or transport protocol.

## 10.3 Placement as a constrained decision

For a workload component `w`, placement can be described as a constrained decision over candidate locations `L = {edge, mesh, cloud}`. A practical controller may consider:

```text
latency_budget(w)
privacy_class(w)
bandwidth_cost(w, l)
compute_need(w)
model_availability(w, l)
energy_budget(l)
connectivity_state(l)
failure_domain(l)
required_evidence(w)
```

The goal is not to produce a universal scalar score. Different systems prioritize different invariants. A safety-critical local detection path may treat the latency budget as a hard constraint; an analytical summarization path may optimize cost subject to a much looser deadline.

The Router pattern becomes a placement router when its decision inputs include operational state rather than only semantic intent.

## 10.4 Fast path and deliberative path

A central composition in this chapter separates a low-latency **fast path** from a richer **deliberative path**.

```text
                  +---------------------+
Sensor / Request ->  Edge Fast Path     |----> immediate bounded action
                  | small model/rules   |
                  +----------+----------+
                             |
                       evidence/event
                             v
                  +---------------------+
                  | Mesh Coordination   |
                  | peers / aggregation |
                  +----------+----------+
                             |
                    enriched context
                             v
                  +---------------------+
                  | Cloud Deliberation  |
                  | large model / RAG   |
                  +----------+----------+
                             |
                      policy-approved
                         feedback
```

The fast path is not a lower-quality copy of the cloud pipeline. It has a different contract: bounded latency, bounded authority and enough local evidence to make a safe immediate decision. The deliberative path can later enrich, explain, correct or update the global state.

## 10.5 Cascades and model fallback

Cascade (39) and Model Fallback (81) are used here as two related but distinct mechanisms.

A **cascade** intentionally escalates from cheaper/faster processing to a more capable model when a confidence or complexity criterion is not satisfied. A **fallback** is primarily a resilience mechanism used when the preferred model/service is unavailable or violates an operational constraint.

A system that confuses them may silently change quality expectations during an outage. The architecture should therefore record why a model transition occurred:

```text
transition_reason = {
  complexity_escalation,
  confidence_escalation,
  deadline_protection,
  service_failure,
  resource_exhaustion,
  policy_constraint
}
```

This reason becomes part of observability and later evaluation.

## 10.6 Mesh coordination and failure domains

The mesh layer creates opportunities for cooperative behaviour but also new failure modes: stale peer state, split-brain decisions, duplicate actions, uneven load and cascading retries. Multi-Agent (7), Agent Registry (65), Bulkhead (46) and Health Check (94) can be composed to make coordination explicit.

A mesh registry should describe both semantic capability and operational reachability. A node that advertises a vision model but is overloaded, disconnected or running an incompatible version should not remain an eligible target merely because the semantic capability matches.

Bulkheads partition workloads so that a failure in one class of task cannot consume the resources required by a higher-priority path. In a vehicular or industrial scenario, for example, non-urgent summarization must not starve the local anomaly-detection path.

## 10.7 Evidence movement instead of raw-data movement

One of the strongest motivations for edge processing is reducing unnecessary data transfer. The architecture therefore distinguishes **raw observations** from **derived evidence**.

An edge node may transform a high-rate signal into:

- a feature vector;
- an anomaly event;
- a confidence interval;
- a signed provenance record;
- a bounded time window of retained raw data referenced by hash.

The mesh/cloud layers can reason over the derived evidence and request raw data only when policy and diagnostic need justify it. This can reduce bandwidth and privacy exposure, although the magnitude must be measured per workload rather than assumed.

## 10.8 Semantic degradation as a first-class failure mode

Traditional distributed-systems monitoring focuses on availability, latency and error codes. AI systems can remain technically available while semantic quality degrades. A smaller fallback model may answer on time but with lower calibration; a local cache may be reachable but stale; a mesh peer may return structurally valid but low-quality context.

For that reason, Health Check (94) should have two layers:

1. **operational health:** process reachable, dependencies responsive, resource budget acceptable;
2. **semantic health:** canary tasks or reference probes remain within defined quality bounds.

The semantic check must be lightweight enough not to destabilize the system it monitors. It is not intended to prove correctness; it detects material drift or degradation that pure liveness checks cannot see.

## 10.9 Speculative execution under deadlines

Speculative Execution (93) can reduce tail latency when several candidate paths are plausible, but it trades compute and cost for response time. An Edge–Mesh–Cloud controller may launch a local path immediately while starting a remote path in parallel, then accept the first result that satisfies policy and quality criteria.

This is only safe when side effects are separated from speculative inference. Two speculative reasoning branches may execute concurrently; two speculative payment or control actions must not both commit. Idempotency and an explicit commit point are therefore necessary around side-effecting operations.

## 10.10 Observability model

The architecture proposes a cross-plane trace with fields such as:

```text
request_id
workload_class
placement_decision
placement_reason
model_id / model_version
input_evidence_refs
edge_latency
mesh_latency
cloud_latency
network_bytes
fallback_or_cascade_reason
semantic_health_state
policy_decisions
final_commit_location
quality_measure
estimated_cost
```

A single end-to-end trace permits architectural questions that are otherwise difficult to answer: Was a late response caused by networking, model inference or repeated coordination? Did quality drop because a fallback model was used? Did a more expensive cloud call actually improve the measured result?

## 10.11 Planned experimental design

The final monograph will validate the architecture in a reproducible testbed with controlled network and resource conditions. At minimum, four deployment strategies will be compared:

- **D0 Cloud-only:** all inference and coordination in the cloud.
- **D1 Edge + Cloud:** local fast path with cloud escalation.
- **D2 Edge + Mesh + Cloud:** regional coordination and dynamic placement.
- **D3 Governed adaptive placement:** D2 plus health-aware routing, model fallback, bulkheads and explicit semantic-health gates.

Workloads will include at least one streaming/sensor scenario and one tool/RAG scenario. Perturbations will include latency injection, bandwidth reduction, node loss, model-service failure and stale-context conditions.

Primary measurements:

- end-to-end latency distribution, including tail latency;
- deadline-miss rate;
- task/semantic quality under each degradation mode;
- bytes transferred across planes;
- compute and model cost;
- recovery time;
- unsafe or duplicate side effects;
- placement stability and oscillation;
- fraction of requests successfully served during partial failures.

The experimental harness must publish workload definitions, environment versions and raw result artefacts. Until those experiments are executed, this draft does not contain invented performance improvements.

## 10.12 Vehicular and high-dependability bridge

The next chapter applies the architecture to vehicular/C-V2X scenarios. That domain is deliberately challenging because connectivity changes quickly and some decisions have strict latency or safety constraints. The Edge–Mesh–Cloud model provides a vocabulary for separating immediate local action, cooperative regional evidence and global analytical intelligence.

The vehicular chapter will not assume that an LLM belongs in a safety-critical control loop. Instead, it will identify where probabilistic AI may support perception, explanation, planning or coordination and where deterministic safeguards must dominate the execution boundary.

## 10.13 Architectural consequences

The pattern composition developed here is:

```text
Router (2)
  -> Health Check (94)
  -> Edge/mesh/cloud placement decision
      -> Cascade (39) for planned capability escalation
      -> Model Fallback (81) for resilience
      -> Bulkhead (46) for failure containment
      -> Circuit Breaker (45) for failing dependencies
      -> Speculative Execution (93) for bounded latency cases
  -> Observability (77)
```

Multi-Agent (7), Agent Registry (65) and Batching (88) become optional composition points when coordination, discovery or throughput requirements justify them.

The broader research claim is that placement, semantic quality and resilience cannot be optimized independently in AI-intensive systems. They form a coupled architectural decision. The final evidence for that claim will come from the controlled experiments described above, not from the pattern catalogue alone.
