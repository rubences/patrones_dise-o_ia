# 238 — Synthetic Dataset Release Gate

**Familia candidata:** Trustworthy Synthetic Data & Simulation · **Estado:** investigación en main, no catálogo canónico.

## Problema y contrato

Synthetic Dataset Release Gate propone un control específico de procedencia, fuga, calidad, cobertura o simulación para conjuntos de datos sintéticos.

Implementación: `research/p11/synthetic/src/pattern_238_synthetic_dataset_release_gate.ts`. Pruebas: `tests/p11_synthetic_patterns.test.ts`.

## Modelo de amenazas y límites

Riesgos: memorización de registros personales, ataques de inferencia de pertenencia, distribuciones sesgadas, escenarios omitidos, etiquetado erróneo, procedencia no autenticada y falsa confianza en métricas agregadas. Las comprobaciones de coincidencia exacta no prueban ausencia de fuga; comparar medias no demuestra equivalencia de distribuciones; una intervención numérica no identifica efectos causales. El gate de publicación consume declaraciones externas y no las certifica.

## Criterios de promoción

Revisión de solapamientos con `data-centric-ai`, `ai-scientific-discovery` y `multimodal-embodied-ai`; fichas canónicas completas; evidencia primaria contrastada; pruebas adversariales y métricas reproducibles; CI verde y revisión de privacidad/licencias.
