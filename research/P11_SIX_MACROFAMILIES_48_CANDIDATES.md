# P11 — Evaluación de seis macrofamilias y 48 patrones candidatos

Fecha: 2026-11-20. **Estado: investigación, no integración en catálogo.**

El catálogo principal actual registra **222 patrones, 26 macrofamilias y 39 grupos**. Esta propuesta reserva los IDs **223–270** y estudia **6 familias** nuevas; el objetivo eventual sería **270 patrones, 32 macrofamilias**, sujeto a validación.

## Criterios de selección

Cada candidato debe diferenciarse por invariantes, interfaz y prueba adversarial. Si se solapa con un patrón existente, se fusionará como variante o extensión. La bibliografía deberá verificarse con fuentes primarias y notas de alcance, sin inflar el baseline de evidencia.

## AI Observability & Behavioral Diagnostics

- ID de familia propuesto: `ai-behavioral-observability`
- Solapamientos a revisar: production-finops, evaluation-qa, agent-runtime-harness
- Diferenciación exigida: Trazas semánticas de decisiones y atribución causal operativa, no solo métricas o logging

- **223 — Agent Behavior Trace Schema**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **224 — Decision Attribution Probe**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **225 — Tool-Call Drift Detector**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **226 — Semantic Latency Decomposer**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **227 — Agent Failure Taxonomy Mapper**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **228 — Behavioral Regression Sentinel**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **229 — Multi-Agent Causal Trace Joiner**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **230 — Observability Coverage Gate**: candidato; definir contrato específico, amenazas, métricas y evidencia.

## Trustworthy Synthetic Data & Simulation

- ID de familia propuesto: `trustworthy-synthetic-simulation`
- Solapamientos a revisar: data-centric-ai, ai-scientific-discovery, multimodal-embodied-ai
- Diferenciación exigida: Gobierno del origen sintético y pruebas de transferencia, fuga y cobertura

- **231 — Synthetic Data Provenance Tag**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **232 — Privacy Leakage Similarity Gate**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **233 — Synthetic-to-Real Distribution Audit**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **234 — Scenario Coverage Generator**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **235 — Counterfactual Scenario Sampler**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **236 — Synthetic Label Quality Gate**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **237 — Simulation Fidelity Contract**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **238 — Synthetic Dataset Release Gate**: candidato; definir contrato específico, amenazas, métricas y evidencia.

## AI Supply Chain & Model Artifact Security

- ID de familia propuesto: `ai-supply-chain-security`
- Solapamientos a revisar: safety-security, development-governance, ai-governance-assurance
- Diferenciación exigida: Cadena de custodia verificable de pesos, datos, prompts y dependencias

- **239 — Model Artifact Provenance Attestation**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **240 — Dataset Lineage Signature Gate**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **241 — Prompt Package Integrity Lock**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **242 — Inference Dependency SBOM**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **243 — Model Weight Tamper Sentinel**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **244 — Third-Party Model License Gate**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **245 — Secure Model Rollback**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **246 — Training Pipeline Attestation**: candidato; definir contrato específico, amenazas, métricas y evidencia.

## Adaptive Human–AI Collaboration

- ID de familia propuesto: `adaptive-human-ai-collaboration`
- Solapamientos a revisar: human-experience, multi-agent, agentic-workflows
- Diferenciación exigida: Ajuste medible de autonomía, delegación y explicaciones según capacidades humanas

- **247 — Cognitive Load Aware Delegation**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **248 — Human Expertise Routing**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **249 — Explanation Depth Negotiation**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **250 — Human Disagreement Escalation**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **251 — Adaptive Autonomy Lease**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **252 — Operator Trust Calibration**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **253 — Collaborative Decision Provenance**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **254 — Human Feedback Bias Sentinel**: candidato; definir contrato específico, amenazas, métricas y evidencia.

## Formal Verification & Runtime Assurance

- ID de familia propuesto: `formal-runtime-assurance`
- Solapamientos a revisar: reliability, safety-security, agent-runtime-harness
- Diferenciación exigida: Propiedades formales, invariantes y monitores ejecutables con contraejemplos

- **255 — Agent Transition Invariant Checker**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **256 — Temporal Policy Monitor**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **257 — Model Output Contract Proof Obligation**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **258 — Runtime Safety Shield**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **259 — Formal Tool Effect Specification**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **260 — Bounded Agent State Explorer**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **261 — Policy Conflict Satisfiability Gate**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **262 — Proof-Carrying Agent Action**: candidato; definir contrato específico, amenazas, métricas y evidencia.

## Autonomous Knowledge Engineering

- ID de familia propuesto: `autonomous-knowledge-engineering`
- Solapamientos a revisar: knowledge-context, data-graph-foundations, data-centric-ai
- Diferenciación exigida: Ciclo gobernado de evolución ontológica y reparación semántica, no solo GraphRAG

- **263 — Ontology Change Proposal Agent**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **264 — Entity Resolution Evidence Gate**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **265 — Knowledge Graph Contradiction Resolver**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **266 — Schema Evolution Compatibility Guard**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **267 — Knowledge Freshness Decay Policy**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **268 — Graph Provenance Reconciliation**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **269 — Ontology Alignment Confidence Gate**: candidato; definir contrato específico, amenazas, métricas y evidencia.
- **270 — Knowledge Repair Human Approval**: candidato; definir contrato específico, amenazas, métricas y evidencia.

## Priorización

1. **Formal Verification & Runtime Assurance (255–262):** formalizar invariantes y generar contraejemplos; aplicar a seguridad y runtime ya existentes.
2. **AI Supply Chain & Model Artifact Security (239–246):** integridad de artefactos y procedencia verificable; evitar confundir hashes con atestación.
3. **AI Observability & Behavioral Diagnostics (223–230):** métricas semánticas y trazas de decisiones con privacidad.
4. **Trustworthy Synthetic Data & Simulation (231–238):** fuga de privacidad, cobertura y distancia sintético-real.
5. **Autonomous Knowledge Engineering (263–270):** reparación de grafos, ontologías y gobierno de cambios.
6. **Adaptive Human–AI Collaboration (247–254):** medir carga cognitiva y calibración de confianza, sin inferencias sensibles injustificadas.

## Gates antes de promoción

- Auditoría de duplicados contra los 222 patrones existentes y mapa de dependencias.
- Ficha técnica por patrón: problema, fuerzas, contrato, antipatrón, límites, referencias verificadas.
- Implementación diferenciada en TypeScript, con tests unitarios, negativos, integración y métricas.
- Evaluación de seguridad, privacidad y licencias aplicables.
- Actualización coordinada de catálogo, taxonomía, Astro, README, índices y libro.
- Ejecución satisfactoria y verificable de CI; **no asumirla** por estar el código en `main`.

## Estado de la versión 20.0.0

La integración de P10 en `main` no equivale a una release validada: el resultado completo de CI y generación editorial continúa pendiente de confirmación. P11 no debe aumentar `catalogSize` hasta cerrar los gates.
