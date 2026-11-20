# 349 — Cross-Model Evaluator Disagreement

**Familia candidata:** Agent Evaluation, Adversarial Testing & Assurance · **Estado:** investigación en `main`, no catálogo principal.

## Problema y contrato

Cross-Model Evaluator Disagreement aporta un mecanismo acotado de evaluación adversarial, detección de fallos o recopilación de evidencia de agentes.

Código: `research/p12/redteam/src/pattern_349_cross_model_evaluator_disagreement.ts`. Pruebas: `tests/p12_redteam_patterns.test.ts`.

## Modelo de amenazas y límites

Riesgos: prompt injection multi-turno, goal hijacking, instrucciones maliciosas en salidas de herramientas, contaminación de benchmarks, cambios de entorno, autonomía excesiva, anulación humana inefectiva y afirmaciones de seguridad sin soporte. Las etiquetas y flags declarados no demuestran detección en vivo; las coincidencias exactas no detectan paráfrasis; el consenso de evaluadores no demuestra veracidad. El safety case no es certificación.

## Criterios de promoción

Revisar solapamientos con `evaluation-qa`, `formal-runtime-assurance`, `ai-governance-assurance` y `safety-security`. Exigir referencias primarias, pruebas adversariales reproducibles, evaluación de falsos positivos y negativos y CI satisfactoria. Madurez experimental, evidencia `needs-review`.
