# 335 — Cross-Organization Vocabulary Mapping

**Familia candidata:** AI Data Contracts, Semantics & Interoperability · **Estado:** investigación en `main`, no catálogo principal.

## Problema y contrato

Cross-Organization Vocabulary Mapping aporta un mecanismo de gobierno de esquemas, compatibilidad, interoperabilidad semántica o trazabilidad de datos para sistemas de IA.

Código: `research/p12/data-contracts/src/pattern_335_cross_organization_vocabulary_mapping.ts`. Pruebas: `tests/p12_data_contracts_patterns.test.ts`.

## Modelo de amenazas y límites

Riesgos: desviación entre entrenamiento e inferencia, incompatibilidad de esquemas, uso no autorizado de datos, ambigüedad terminológica, registros obsoletos, procedencia incompleta y cambios disruptivos. La coincidencia de nombres o tipos no demuestra equivalencia semántica; las autorizaciones por finalidad requieren identidad y controles jurídicos externos; la trazabilidad declarada no constituye certificación de linaje.

## Criterios de promoción

Revisar solapamientos con `data-centric-ai`, `data-graph-foundations`, `autonomous-knowledge-engineering` y `ai-governance-assurance`. Exigir ejemplos interoperables, pruebas de cambios incompatibles, evidencia primaria contrastada y CI satisfactoria. Madurez experimental, evidencia `needs-review`.
