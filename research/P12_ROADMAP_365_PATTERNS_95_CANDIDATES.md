# P12 — Plan de investigación para alcanzar 365 patrones

Fecha: 2026-11-20. **Estado: 95 contratos experimentales implementados en investigación en `main`; integración canónica y CI pendientes.**

## Objetivo cuantificado

Catálogo actual: **280 patrones, 33 macrofamilias**. Objetivo: **365 patrones**, exactamente **95 candidatos nuevos (271–365)** en **10 macrofamilias propuestas**. Estado objetivo condicional: **42 macrofamilias y 55 grupos de trazabilidad**, sujeto a evaluación de solapamientos y CI.

## Principios de calidad

1. No promover una variante superficial a patrón autónomo: diferenciar problema, fuerzas, solución, contrato y amenazas.
2. Implementaciones educativas deben declararse experimentales, sin garantías de seguridad, certificación o eficacia.
3. Ficha canónica, código, pruebas positivas/negativas, evidencia primaria verificada, revisión de licencias y análisis de riesgo.
4. Mantener el baseline actual de evidencia hasta aportar fuentes específicas y contrastadas.
5. Actualizar catálogo, taxonomía, exports, scripts, web, libros y tests en una integración coherente; CI verde confirmado antes de declarar release estable.
6. Revisión transversal de duplicidades contra los 270 patrones y entre candidatos P12.

## Nuevas macrofamilias y patrones

### Inference-Time Compute & Adaptive Reasoning (271–280)

**Familia propuesta:** `inference-compute-optimization` · **Español:** Cómputo en Inferencia y Razonamiento Adaptativo.

**Solapamientos a revisar:** reasoning, production-finops, agent-runtime-harness.

- **271 — Reasoning Effort Budget Scheduler**: candidato; definir contrato, evidencia, tests y diferenciación.
- **272 — Adaptive Test-Time Compute Gate**: candidato; definir contrato, evidencia, tests y diferenciación.
- **273 — Early Exit Confidence Controller**: candidato; definir contrato, evidencia, tests y diferenciación.
- **274 — Speculative Decoding Acceptance Gate**: candidato; definir contrato, evidencia, tests y diferenciación.
- **275 — Reasoning Trace Compression Contract**: candidato; definir contrato, evidencia, tests y diferenciación.
- **276 — Inference Cascade Escalation Policy**: candidato; definir contrato, evidencia, tests y diferenciación.
- **277 — Uncertainty-Triggered Deliberation**: candidato; definir contrato, evidencia, tests y diferenciación.
- **278 — Parallel Candidate Consensus Budget**: candidato; definir contrato, evidencia, tests y diferenciación.
- **279 — Inference Cache Correctness Guard**: candidato; definir contrato, evidencia, tests y diferenciación.
- **280 — Verifier-Guided Search Controller**: candidato; definir contrato, evidencia, tests y diferenciación.

### Agent Identity, Credentials & Delegated Trust (281–290)

**Familia propuesta:** `agent-identity-trust` · **Español:** Identidad, Credenciales y Confianza Delegada.

**Solapamientos a revisar:** safety-security, agent-interoperability, ai-governance-assurance.

- **281 — Agent Workload Identity Binding**: candidato; definir contrato, evidencia, tests y diferenciación.
- **282 — Delegated Credential Scope Attenuation**: candidato; definir contrato, evidencia, tests y diferenciación.
- **283 — Agent-to-Agent Mutual Authentication**: candidato; definir contrato, evidencia, tests y diferenciación.
- **284 — Ephemeral Tool Credential Broker**: candidato; definir contrato, evidencia, tests y diferenciación.
- **285 — Cross-Tenant Delegation Boundary**: candidato; definir contrato, evidencia, tests y diferenciación.
- **286 — Identity-Aware Memory Access**: candidato; definir contrato, evidencia, tests y diferenciación.
- **287 — Credential Rotation Continuity Gate**: candidato; definir contrato, evidencia, tests y diferenciación.
- **288 — Delegation Chain Audit**: candidato; definir contrato, evidencia, tests y diferenciación.
- **289 — Agent Impersonation Detection**: candidato; definir contrato, evidencia, tests y diferenciación.
- **290 — Least-Privilege Capability Discovery**: candidato; definir contrato, evidencia, tests y diferenciación.

### Context Engineering & Information Economics (291–300)

**Familia propuesta:** `context-engineering` · **Español:** Ingeniería de Contexto y Economía de la Información.

**Solapamientos a revisar:** knowledge-context, continual-learning-memory, agent-runtime-harness.

- **291 — Context Relevance Budget Allocator**: candidato; definir contrato, evidencia, tests y diferenciación.
- **292 — Instruction Hierarchy Conflict Resolver**: candidato; definir contrato, evidencia, tests y diferenciación.
- **293 — Evidence Freshness Context Gate**: candidato; definir contrato, evidencia, tests y diferenciación.
- **294 — Context Window Fragmentation Planner**: candidato; definir contrato, evidencia, tests y diferenciación.
- **295 — Source Diversity Retrieval Selector**: candidato; definir contrato, evidencia, tests y diferenciación.
- **296 — Long-Context Position Bias Auditor**: candidato; definir contrato, evidencia, tests y diferenciación.
- **297 — Retrieval Redundancy Suppressor**: candidato; definir contrato, evidencia, tests y diferenciación.
- **298 — Context Injection Isolation Boundary**: candidato; definir contrato, evidencia, tests y diferenciación.
- **299 — Task-Specific Context Compiler**: candidato; definir contrato, evidencia, tests y diferenciación.
- **300 — Context Sufficiency Stop Rule**: candidato; definir contrato, evidencia, tests y diferenciación.

### Accessible, Inclusive & Multilingual AI (301–310)

**Familia propuesta:** `ai-accessibility-inclusion` · **Español:** IA Accesible, Inclusiva y Multilingüe.

**Solapamientos a revisar:** human-experience, adaptive-human-ai-collaboration, ai-governance-assurance.

- **301 — Accessible Response Modality Router**: candidato; definir contrato, evidencia, tests y diferenciación.
- **302 — Plain Language Fidelity Gate**: candidato; definir contrato, evidencia, tests y diferenciación.
- **303 — Multilingual Intent Preservation**: candidato; definir contrato, evidencia, tests y diferenciación.
- **304 — Locale-Sensitive Tool Contract**: candidato; definir contrato, evidencia, tests y diferenciación.
- **305 — Assistive Technology Compatibility Check**: candidato; definir contrato, evidencia, tests y diferenciación.
- **306 — Cultural Context Assumption Audit**: candidato; definir contrato, evidencia, tests y diferenciación.
- **307 — Reading Complexity Adaptive Output**: candidato; definir contrato, evidencia, tests y diferenciación.
- **308 — Low-Bandwidth Inclusive Experience**: candidato; definir contrato, evidencia, tests y diferenciación.
- **309 — Language Equity Evaluation Harness**: candidato; definir contrato, evidencia, tests y diferenciación.
- **310 — Accessibility Regression Sentinel**: candidato; definir contrato, evidencia, tests y diferenciación.

### Sustainable & Carbon-Aware AI Operations (311–320)

**Familia propuesta:** `ai-energy-sustainability` · **Español:** Operación de IA Sostenible y Consciente del Carbono.

**Solapamientos a revisar:** edge-distributed-ai, production-finops, ai-economics-mechanisms.

- **311 — Carbon-Aware Inference Scheduler**: candidato; definir contrato, evidencia, tests y diferenciación.
- **312 — Energy Budget Per Request Gate**: candidato; definir contrato, evidencia, tests y diferenciación.
- **313 — Green Region Placement Policy**: candidato; definir contrato, evidencia, tests y diferenciación.
- **314 — Compute Carbon Attribution Ledger**: candidato; definir contrato, evidencia, tests y diferenciación.
- **315 — Sustainability SLO Tradeoff Controller**: candidato; definir contrato, evidencia, tests y diferenciación.
- **316 — Hardware Utilization Waste Detector**: candidato; definir contrato, evidencia, tests y diferenciación.
- **317 — Model Efficiency Pareto Selector**: candidato; definir contrato, evidencia, tests y diferenciación.
- **318 — Carbon Intensity Forecast Fallback**: candidato; definir contrato, evidencia, tests y diferenciación.
- **319 — Sustainable Batch Formation**: candidato; definir contrato, evidencia, tests y diferenciación.
- **320 — Energy Rebound Effect Auditor**: candidato; definir contrato, evidencia, tests y diferenciación.

### AI Incident Response, Forensics & Recovery (321–330)

**Familia propuesta:** `ai-incident-forensics` · **Español:** Respuesta a Incidentes, Forense y Recuperación de IA.

**Solapamientos a revisar:** safety-security, ai-behavioral-observability, ai-supply-chain-security.

- **321 — Agent Incident Evidence Freeze**: candidato; definir contrato, evidencia, tests y diferenciación.
- **322 — Prompt Injection Incident Triage**: candidato; definir contrato, evidencia, tests y diferenciación.
- **323 — Compromised Agent Containment**: candidato; definir contrato, evidencia, tests y diferenciación.
- **324 — Model Artifact Forensic Timeline**: candidato; definir contrato, evidencia, tests y diferenciación.
- **325 — Agent Recovery Readiness Gate**: candidato; definir contrato, evidencia, tests y diferenciación.
- **326 — Cross-Agent Blast Radius Estimator**: candidato; definir contrato, evidencia, tests y diferenciación.
- **327 — Security Incident Replay Harness**: candidato; definir contrato, evidencia, tests y diferenciación.
- **328 — Post-Incident Policy Patch Verification**: candidato; definir contrato, evidencia, tests y diferenciación.
- **329 — Evidence Chain of Custody Validator**: candidato; definir contrato, evidencia, tests y diferenciación.
- **330 — AI Incident Lessons-to-Controls Loop**: candidato; definir contrato, evidencia, tests y diferenciación.

### AI Data Contracts, Semantics & Interoperability (331–340)

**Familia propuesta:** `ai-data-contracts` · **Español:** Contratos de Datos, Semántica e Interoperabilidad de IA.

**Solapamientos a revisar:** data-centric-ai, data-graph-foundations, autonomous-knowledge-engineering.

- **331 — Semantic Data Contract Registry**: candidato; definir contrato, evidencia, tests y diferenciación.
- **332 — Training Serving Schema Parity Gate**: candidato; definir contrato, evidencia, tests y diferenciación.
- **333 — Feature Definition Version Pinning**: candidato; definir contrato, evidencia, tests y diferenciación.
- **334 — Data Usage Purpose Contract**: candidato; definir contrato, evidencia, tests y diferenciación.
- **335 — Cross-Organization Vocabulary Mapping**: candidato; definir contrato, evidencia, tests y diferenciación.
- **336 — Dataset Temporal Validity Guard**: candidato; definir contrato, evidencia, tests y diferenciación.
- **337 — Data Contract Breaking Change Detector**: candidato; definir contrato, evidencia, tests y diferenciación.
- **338 — Schema-to-Ontology Consistency Gate**: candidato; definir contrato, evidencia, tests y diferenciación.
- **339 — Multimodal Metadata Contract**: candidato; definir contrato, evidencia, tests y diferenciación.
- **340 — Data Lineage Impact Propagator**: candidato; definir contrato, evidencia, tests y diferenciación.

### Agent Evaluation, Adversarial Testing & Assurance (341–350)

**Familia propuesta:** `ai-agent-evaluation-redteam` · **Español:** Evaluación de Agentes y Pruebas Adversariales.

**Solapamientos a revisar:** evaluation-qa, formal-runtime-assurance, ai-governance-assurance.

- **341 — Multi-Turn Agent Attack Harness**: candidato; definir contrato, evidencia, tests y diferenciación.
- **342 — Goal Hijacking Regression Test**: candidato; definir contrato, evidencia, tests y diferenciación.
- **343 — Tool Output Trust Boundary Test**: candidato; definir contrato, evidencia, tests y diferenciación.
- **344 — Agent Benchmark Contamination Sentinel**: candidato; definir contrato, evidencia, tests y diferenciación.
- **345 — Environment Shift Evaluation Matrix**: candidato; definir contrato, evidencia, tests y diferenciación.
- **346 — Agent Autonomy Risk Scorecard**: candidato; definir contrato, evidencia, tests y diferenciación.
- **347 — Task Completion Evidence Checker**: candidato; definir contrato, evidencia, tests y diferenciación.
- **348 — Human Override Effectiveness Test**: candidato; definir contrato, evidencia, tests y diferenciación.
- **349 — Cross-Model Evaluator Disagreement**: candidato; definir contrato, evidencia, tests y diferenciación.
- **350 — Agent Safety Case Evidence Pack**: candidato; definir contrato, evidencia, tests y diferenciación.

### AI Release Engineering & Continuous Deployment (351–360)

**Familia propuesta:** `ai-deployment-lifecycle` · **Español:** Ingeniería de Entrega y Despliegue Continuo de IA.

**Solapamientos a revisar:** agentic-software-engineering, development-governance, ai-supply-chain-security.

- **351 — Model Release Candidate Gate**: candidato; definir contrato, evidencia, tests y diferenciación.
- **352 — Canary Agent Policy Rollout**: candidato; definir contrato, evidencia, tests y diferenciación.
- **353 — Shadow Agent Behavior Comparator**: candidato; definir contrato, evidencia, tests y diferenciación.
- **354 — Prompt Version Rollback Controller**: candidato; definir contrato, evidencia, tests y diferenciación.
- **355 — Agent Configuration Drift Reconciler**: candidato; definir contrato, evidencia, tests y diferenciación.
- **356 — Multi-Model Deployment Compatibility Matrix**: candidato; definir contrato, evidencia, tests y diferenciación.
- **357 — Online Evaluation Release Stopper**: candidato; definir contrato, evidencia, tests y diferenciación.
- **358 — Reproducible Agent Environment Snapshot**: candidato; definir contrato, evidencia, tests y diferenciación.
- **359 — Model Endpoint Failback Contract**: candidato; definir contrato, evidencia, tests y diferenciación.
- **360 — Agent Release Provenance Manifest**: candidato; definir contrato, evidencia, tests y diferenciación.

### Public-Interest & High-Stakes AI Governance (361–365)

**Familia propuesta:** `ai-public-interest-governance` · **Español:** Gobernanza de IA de Alto Impacto e Interés Público.

**Solapamientos a revisar:** ai-governance-assurance, privacy-confidential-ai, adaptive-human-ai-collaboration.

- **361 — High-Stakes Decision Appeal Route**: candidato; definir contrato, evidencia, tests y diferenciación.
- **362 — Affected Party Notification Contract**: candidato; definir contrato, evidencia, tests y diferenciación.
- **363 — Public Sector AI Transparency Record**: candidato; definir contrato, evidencia, tests y diferenciación.
- **364 — Human Contestability Evidence Gate**: candidato; definir contrato, evidencia, tests y diferenciación.
- **365 — Impact Assessment Update Trigger**: candidato; definir contrato, evidencia, tests y diferenciación.

## Orden de implementación

1. Identidad y confianza delegada (281–290), por sus dependencias de seguridad.
2. Ingeniería de contexto (291–300) e inferencia adaptativa (271–280), por impacto en calidad y coste.
3. Evaluación adversarial (341–350) y respuesta a incidentes (321–330), para endurecer las familias existentes.
4. Contratos de datos (331–340) y entrega continua (351–360), para interoperabilidad operativa.
5. Accesibilidad (301–310), sostenibilidad (311–320) y gobernanza de alto impacto (361–365).

## Riesgos de solapamiento detectados

- Inferencia adaptativa frente a `reasoning` y `production-finops`.
- Ingeniería de contexto frente a `knowledge-context` y compaction existente.
- Identidad frente a `safety-security` y leases del runtime.
- Evaluación adversarial frente a `evaluation-qa` y P11 de aseguramiento.
- Gobernanza de alto impacto frente a `ai-governance-assurance`.

**Decisión editorial:** los 95 IDs quedan reservados para investigación; si un candidato no supera la diferenciación, sustituirlo por otro justificado, sin inflar artificialmente el catálogo.

## Hito de implementación (20-11-2026)

Los diez grupos P12 (271–365) disponen de fuentes TypeScript, fichas de investigación, pruebas y proyectos de typecheck aislados. Los IDs 271–280 ya se han integrado en catálogo, taxonomía, exportaciones y fichas canónicas. Los otros 85 candidatos P12 siguen en investigación; el catálogo canónico está en 280. No se ha verificado CI verde. El siguiente hito consiste en auditoría de duplicidades, migración canónica, actualización de scripts y versión, validación editorial y comprobación de la web.
