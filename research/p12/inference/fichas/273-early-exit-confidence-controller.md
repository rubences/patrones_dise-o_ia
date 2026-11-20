# 273 — Early Exit Confidence Controller

**Familia candidata:** Inference-Time Compute & Adaptive Reasoning · **Estado:** investigación en `main`, no catálogo principal.

## Problema y contrato

Early Exit Confidence Controller propone un control de presupuesto, confianza, verificación o selección durante la inferencia de sistemas de IA.

Código: `research/p12/inference/src/pattern_273_early_exit_confidence_controller.ts`. Pruebas: `tests/p12_inference_patterns.test.ts`.

## Riesgos y límites

Los valores de confianza, incertidumbre y verificación son entradas declaradas: no equivalen a calibración empírica ni demuestran corrección. Las reglas de consenso no garantizan verdad; la comparación literal de tokens no implementa el algoritmo probabilístico de speculative decoding; los presupuestos de tokens no estiman necesariamente el coste real. Revisar ataques de caché, información obsoleta, fuga de trazas y degradación de calidad.

## Criterios de promoción

Comparar con `reasoning`, `production-finops`, `agent-runtime-harness` y `evaluation-qa`. Exigir benchmarks de coste-calidad, tests adversariales, evidencia primaria contrastada y CI satisfactoria. Madurez experimental y evidencia `needs-review`.
