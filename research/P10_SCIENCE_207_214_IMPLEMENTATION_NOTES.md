# P10.3 — AI Experimentation & Scientific Discovery

Fecha: 2026-11-20. Estado: **investigación**. Ocho contratos 207–214 y pruebas integrados en GitHub; no se ha confirmado una ejecución verde de CI ni validación científica independiente.

| ID | Contrato de referencia | Limitación crítica |
|---|---|---|
| 207 | Registro de hipótesis falsables y estado | No demuestra validez ni pre-registro externo |
| 208 | Asignación equilibrada determinista por semilla | PRNG educativo, no aleatorización criptográfica ni garantía de ocultación |
| 209 | Manifiesto reproducible con SHA-256 | No firma, ancla ni verifica la existencia de artefactos |
| 210 | Procedimiento Holm-Bonferroni sobre p-values | No verifica supuestos, tamaño muestral, potencia ni análisis preespecificado |
| 211 | Comparación de métricas y digests de replicación | No reejecuta experimentos ni establece equivalencia científica |
| 212 | Grafo de procedencia con detección de ciclos | No persiste ni autentica el origen de nodos |
| 213 | Selección por incertidumbre/coste | Heurística voraz, no garantiza óptimo global ni aprendizaje activo real |
| 214 | Gate de evidencia declarada frente a fuerza de claim | Heurística editorial, no inferencia causal ni revisión metodológica |

Código: `research/p10/science/src/`. Pruebas: `tests/p10_science_patterns.test.ts`. Typecheck: `research/p10/science/tsconfig.json`.

## Riesgos metodológicos

Sesgo de selección, HARKing, p-hacking, fuga de datos, mala calibración de hipótesis, replicación no independiente y uso indebido de significación estadística. Los gates de software son ayudas de proceso y **no sustituyen** diseño estadístico, revisión ética, registro previo ni validación externa.

## Evidencia a contrastar

- King et al., *The Automation of Science* (2009).
- Holm, *A Simple Sequentially Rejective Multiple Test Procedure* (1979).
- Literatura primaria de procedencia científica, reproducibilidad y aprendizaje activo; confirmar DOI y alcance antes de registrar referencias.

## Gates de promoción

Revisión de solapamientos con `evaluation-qa`, fichas canónicas, tests negativos y de integración, reproducibilidad del pipeline, verificación de evidencia primaria y resultados de CI. Mantener el catálogo publicado en 190 patrones y 22 macrofamilias hasta superar estos controles.
