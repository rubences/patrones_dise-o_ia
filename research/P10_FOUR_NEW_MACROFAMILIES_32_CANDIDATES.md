# P10 — Cuatro macrofamilias candidatas de nueva generación

Fecha: 2026-11-20. Estado: **propuesta de investigación**. No modifica `catalogSize`, la taxonomía productiva ni el baseline P7.0.

## Objetivo

Evaluar 32 patrones candidatos (IDs reservados 191–222) en cuatro familias nuevas. El objetivo futuro sería **222 patrones y 26 macrofamilias**, exclusivamente tras superar implementación, documentación, CI y revisión editorial. Catálogo vigente: **190 patrones y 22 macrofamilias**.

## Privacy-Preserving & Confidential AI

**ID propuesto:** `privacy-confidential-ai`.

- **191 — Differential Privacy Budget Gate**: candidato sujeto a diferenciación arquitectónica, prueba y evidencia.
- **192 — Confidential Inference Boundary**: candidato sujeto a diferenciación arquitectónica, prueba y evidencia.
- **193 — Private Retrieval Policy**: candidato sujeto a diferenciación arquitectónica, prueba y evidencia.
- **194 — Secure Aggregation Coordinator**: candidato sujeto a diferenciación arquitectónica, prueba y evidencia.
- **195 — PII Minimization Pipeline**: candidato sujeto a diferenciación arquitectónica, prueba y evidencia.
- **196 — Privacy-Preserving Telemetry**: candidato sujeto a diferenciación arquitectónica, prueba y evidencia.
- **197 — Consent-Aware Data Processing**: candidato sujeto a diferenciación arquitectónica, prueba y evidencia.
- **198 — Privacy Attack Evaluation**: candidato sujeto a diferenciación arquitectónica, prueba y evidencia.

## Multimodal & Embodied Agent Systems

**ID propuesto:** `multimodal-embodied-ai`.

- **199 — Sensor Fusion Confidence Gate**: candidato sujeto a diferenciación arquitectónica, prueba y evidencia.
- **200 — Perception-to-Action Contract**: candidato sujeto a diferenciación arquitectónica, prueba y evidencia.
- **201 — Embodied Safety Envelope**: candidato sujeto a diferenciación arquitectónica, prueba y evidencia.
- **202 — Temporal Multimodal Alignment**: candidato sujeto a diferenciación arquitectónica, prueba y evidencia.
- **203 — Robot Skill Invocation**: candidato sujeto a diferenciación arquitectónica, prueba y evidencia.
- **204 — Physical World State Estimator**: candidato sujeto a diferenciación arquitectónica, prueba y evidencia.
- **205 — Simulation-to-Reality Validation**: candidato sujeto a diferenciación arquitectónica, prueba y evidencia.
- **206 — Human Override for Embodied Agents**: candidato sujeto a diferenciación arquitectónica, prueba y evidencia.

## AI Experimentation & Scientific Discovery

**ID propuesto:** `ai-scientific-discovery`.

- **207 — Hypothesis Registry**: candidato sujeto a diferenciación arquitectónica, prueba y evidencia.
- **208 — Experiment Design Agent**: candidato sujeto a diferenciación arquitectónica, prueba y evidencia.
- **209 — Reproducible Run Manifest**: candidato sujeto a diferenciación arquitectónica, prueba y evidencia.
- **210 — Statistical Validity Gate**: candidato sujeto a diferenciación arquitectónica, prueba y evidencia.
- **211 — Automated Replication Workflow**: candidato sujeto a diferenciación arquitectónica, prueba y evidencia.
- **212 — Scientific Provenance Graph**: candidato sujeto a diferenciación arquitectónica, prueba y evidencia.
- **213 — Active Learning Experiment Selector**: candidato sujeto a diferenciación arquitectónica, prueba y evidencia.
- **214 — Evidence-to-Claim Calibration**: candidato sujeto a diferenciación arquitectónica, prueba y evidencia.

## AI Economics, Markets & Mechanism Design

**ID propuesto:** `ai-economics-mechanisms`.

- **215 — Multi-Agent Budget Allocation**: candidato sujeto a diferenciación arquitectónica, prueba y evidencia.
- **216 — Incentive-Compatible Task Auction**: candidato sujeto a diferenciación arquitectónica, prueba y evidencia.
- **217 — Agent Cost Attribution**: candidato sujeto a diferenciación arquitectónica, prueba y evidencia.
- **218 — Resource Bidding Policy**: candidato sujeto a diferenciación arquitectónica, prueba y evidencia.
- **219 — Fair Allocation Constraint**: candidato sujeto a diferenciación arquitectónica, prueba y evidencia.
- **220 — Market Manipulation Sentinel**: candidato sujeto a diferenciación arquitectónica, prueba y evidencia.
- **221 — Value-of-Information Router**: candidato sujeto a diferenciación arquitectónica, prueba y evidencia.
- **222 — Economic Outcome Audit**: candidato sujeto a diferenciación arquitectónica, prueba y evidencia.

## Diferenciación respecto al catálogo actual

- **Privacidad:** distinguir garantías formales (presupuesto epsilon, composición, auditoría) de autorización y seguridad de herramientas. Comparar con `safety-security`, `ai-governance-assurance` y `data-centric-ai`.
- **Multimodal y embodied:** exigir acoplamiento temporal, percepción-acción y seguridad física, no solo tratamiento de entradas multimodales. Comparar con patrón 50 y `edge-distributed-ai`.
- **Descubrimiento científico:** separar control experimental, inferencia estadística, replicación y trazabilidad de hipótesis de `evaluation-qa` y `agentic-software-engineering`.
- **Economía de agentes:** modelar incentivos, presupuestos, mecanismos de asignación y manipulación; diferenciar de `production-finops` y `multi-agent`.

## Fuentes primarias a verificar antes de promoción

- Dwork et al., *Calibrating Noise to Sensitivity in Private Data Analysis* (TCC 2006): privacidad diferencial y sensibilidad.
- Bonawitz et al., *Practical Secure Aggregation for Privacy-Preserving Machine Learning* (CCS 2017): agregación segura.
- Brohan et al., *RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control* (2023): acciones robóticas y modelos multimodales.
- Ahn et al., *Do As I Can, Not As I Say: Grounding Language in Robotic Affordances* (2022): planificación y affordances.
- King et al., *The Automation of Science* (Science 2009): experimentación automatizada.
- Yao et al., *Tree of Thoughts* (NeurIPS 2023): exploración deliberada; antecedente metodológico, no prueba directa de descubrimiento científico.
- Vickrey, *Counterspeculation, Auctions, and Competitive Sealed Tenders* (1961): incentivos y subastas.
- Myerson, *Optimal Auction Design* (1981): diseño de mecanismos; teoría de base, no evidencia de sistemas LLM.

Las referencias anteriores son puntos de partida bibliográficos; deben contrastarse DOI, versión, alcance y relación exacta con cada patrón antes de registrarlas como evidencia primaria.

## Gates de aceptación

1. Identificar solapamientos con los 190 patrones actuales y eliminar o fusionar duplicados.
2. Especificar problema, fuerzas, solución, antipatrón y contrato de seguridad de cada candidato.
3. Implementar mecanismo específico con pruebas positivas, negativas y métricas; evitar clases genéricas renombradas.
4. Añadir ficha canónica, referencias con `scopeNote`, pruebas CI y validación de compilación TypeScript.
5. Actualizar catálogo, taxonomía, Astro, README y publicaciones solo tras integración verificable.
6. No declarar versión estable sin ejecución verde de los workflows técnico y editorial.

## Secuencia recomendada

P10.1 privacidad (191–198); P10.2 embodied (199–206); P10.3 ciencia (207–214); P10.4 economía (215–222). Priorizar casos de uso y pruebas de integración representativas.
