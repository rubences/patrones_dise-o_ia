# 283 — Agent-to-Agent Mutual Authentication

**Familia candidata:** Agent Identity, Credentials & Delegated Trust · **Estado:** investigación en `main`, no catálogo principal.

## Problema y contrato

Agent-to-Agent Mutual Authentication introduce un control acotado para identidad de cargas de trabajo, delegación de capacidades, aislamiento entre organizaciones o detección de suplantación.

Código: `research/p12/identity/src/pattern_283_agent_to_agent_mutual_authentication.ts`. Pruebas: `tests/p12_identity_patterns.test.ts`.

## Modelo de amenazas

Suplantación de identidad, credenciales robadas, escalada de privilegios, cadenas de delegación cíclicas, accesos entre tenants, expiración y revocación incorrectas. Los contratos educativos reciben atributos de autenticación declarados: no emiten credenciales, no comprueban cadenas PKI ni sustituyen IAM, SPIFFE/SPIRE, OAuth u otros mecanismos de confianza reales.

## Diferenciación y promoción

Comparar con `safety-security`, `agent-interoperability`, `privacy-confidential-ai` y `agent-runtime-harness`. Antes de incorporar al catálogo principal: referencias primarias contrastadas, pruebas adversariales, integración IAM real, revisión de alcance y CI satisfactoria. Madurez experimental, evidencia `needs-review`.
