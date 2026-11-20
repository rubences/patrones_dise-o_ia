# 329 — Evidence Chain of Custody Validator

**Familia candidata:** AI Incident Response, Forensics & Recovery · **Estado:** investigación en `main`, no catálogo principal.

## Problema y contrato

Evidence Chain of Custody Validator aporta un mecanismo acotado para detección, contención, preservación de evidencias, recuperación o aprendizaje de incidentes que afectan a agentes y modelos de IA.

Código: `research/p12/incident/src/pattern_329_evidence_chain_of_custody_validator.ts`. Pruebas: `tests/p12_incident_patterns.test.ts`.

## Modelo de amenazas y límites

Riesgos: pérdida o manipulación de evidencias, prompt injection, propagación entre agentes, recuperación prematura, falsificación de procedencia y regresiones tras aplicar parches. Los contratos son educativos y no implementan almacenamiento WORM, firma de custodios, autenticación de eventos, aislamiento real de procesos o recuperación automática. Una cadena de hashes declarados no certifica cadena de custodia; los indicadores de compromiso requieren instrumentación independiente.

## Criterios de promoción

Comparar con `safety-security`, `ai-behavioral-observability`, `ai-supply-chain-security` y `formal-runtime-assurance`. Exigir escenarios adversariales, métricas de MTTD/MTTR, trazas verificables, fuentes primarias y CI satisfactoria. Madurez experimental, evidencia `needs-review`.
