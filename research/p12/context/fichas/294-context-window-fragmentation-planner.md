# 294 — Context Window Fragmentation Planner

**Familia candidata:** Context Engineering & Information Economics · **Estado:** investigación en `main`, no catálogo principal.

## Problema y contrato

Context Window Fragmentation Planner propone un control de selección, ordenación, suficiencia, seguridad o presupuesto del contexto de un agente.

Código: `research/p12/context/src/pattern_294_context_window_fragmentation_planner.ts`. Pruebas: `tests/p12_context_patterns.test.ts`.

## Amenazas y limitaciones

Riesgos: inyección de instrucciones, filtrado insuficiente, contexto obsoleto, sesgos de posición, selección miope y pérdida de evidencia relevante. Las prioridades deben proceder de una autoridad confiable; marcar contenido como no confiable no crea aislamiento técnico por sí solo; la cobertura declarada no garantiza veracidad. Los algoritmos voraces no aseguran selección óptima.

## Criterios de promoción

Comparar con `knowledge-context`, `continual-learning-memory`, `agent-runtime-harness` y `safety-security`. Exigir referencias primarias verificadas, pruebas adversariales de prompt injection, mediciones de coste/precisión y CI satisfactoria. Madurez experimental y evidencia `needs-review`.
