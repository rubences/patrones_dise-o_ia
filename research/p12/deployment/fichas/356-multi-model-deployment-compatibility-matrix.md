# 356 — Multi-Model Deployment Compatibility Matrix

**Familia candidata:** AI Release Engineering & Continuous Deployment · **Estado:** investigación en `main`, no catálogo principal.

## Problema y contrato

Multi-Model Deployment Compatibility Matrix define un mecanismo delimitado de validación de versiones, despliegue progresivo, comparación en sombra, recuperación o trazabilidad de entregas de IA.

Código: `research/p12/deployment/src/pattern_356_multi_model_deployment_compatibility_matrix.ts`. Pruebas: `tests/p12_deployment_patterns.test.ts`.

## Modelo de amenazas y límites

Riesgos: regresiones silenciosas, promoción de versiones inseguras, incompatibilidad de capacidades, cambios de configuración, rollback a artefactos comprometidos, falsos positivos en canarios y pérdida de procedencia. Los contratos no despliegan servicios reales ni autentican manifiestos; los indicadores de salud son entradas externas. La comparación de decisiones no garantiza equivalencia de comportamiento.

## Criterios de promoción

Revisar solapamientos con `agentic-software-engineering`, `development-governance`, `ai-supply-chain-security` y `production-finops`. Exigir pruebas de despliegue reproducibles, políticas de rollback, evidencias primarias y CI satisfactoria. Madurez experimental, evidencia `needs-review`.
