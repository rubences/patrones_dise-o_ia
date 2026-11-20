# 263 — Ontology Change Proposal Agent

**Familia candidata:** Autonomous Knowledge Engineering · **Estado:** investigación en main, no catálogo canónico.

## Problema y contrato

Ontology Change Proposal Agent introduce un mecanismo acotado de gobierno, resolución, evolución o reparación de conocimiento estructurado.

Código: `research/p11/knowledge/src/pattern_263_ontology_change_proposal_agent.ts`. Pruebas: `tests/p11_knowledge_patterns.test.ts`.

## Amenazas y límites

Riesgos: fusiones erróneas de entidades, contradicciones semánticas, obsolescencia, degradación del esquema, procedencia falsificada y reparaciones no autorizadas. Coincidencia de alias no demuestra identidad; diferencias entre valores no demuestran inconsistencia lógica; las puntuaciones de alineación son heurísticas. La autorización humana debe verificarse en un sistema de identidad externo.

## Criterios de promoción

Revisar solapamientos con `knowledge-context`, `data-graph-foundations` y `data-centric-ai`. Exigir evidencia primaria, pruebas adversariales y de integración, revisión ontológica y ejecución CI satisfactoria antes de publicar en catálogo.
