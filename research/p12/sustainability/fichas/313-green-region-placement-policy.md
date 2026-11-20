# 313 — Green Region Placement Policy

**Familia candidata:** Sustainable & Carbon-Aware AI Operations · **Estado:** investigación en `main`, no catálogo principal.

## Problema y contrato

Green Region Placement Policy define un control de planificación, consumo, intensidad de carbono, eficiencia o efecto rebote para sistemas de inferencia de IA.

Código: `research/p12/sustainability/src/pattern_313_green_region_placement_policy.ts`. Pruebas: `tests/p12_sustainability_patterns.test.ts`.

## Modelo de riesgos y límites

Riesgos: desplazamiento de carga a regiones no aptas, estimaciones inexactas de energía y emisiones, degradación de latencia, métricas de utilización engañosas y efecto rebote por aumento de demanda. Los contratos no miden energía física ni emisiones reales: reciben valores externos y operan sobre estimaciones. La intensidad de carbono requiere fuentes verificables, localización y marca temporal; no se modelan aquí emisiones de ciclo de vida del hardware ni criterios de certificación ambiental.

## Criterios de promoción

Revisar solapamientos con `edge-distributed-ai`, `production-finops` y `ai-economics-mechanisms`. Exigir telemetría de energía, intensidad de carbono documentada, experimentos coste-calidad y CI satisfactoria. Madurez experimental, evidencia `needs-review`.
