# P10.1 — Privacy-Preserving & Confidential AI: implementation notes

Fecha: 2026-11-20. Estado: **ocho implementaciones educativas y pruebas añadidas, todavía no promovidas al catálogo canónico**. No se ha verificado CI.

| ID | Mecanismo TypeScript | Alcance y limitación |
|---|---|---|
| 191 | Composición aditiva y límite de epsilon/delta por sujeto | Contabilidad conservadora; **no añade ruido** ni implementa un mecanismo diferencialmente privado |
| 192 | Gate sobre afirmaciones de atestación, cifrado y medición permitida | No verifica atestaciones criptográficas ni enclaves reales |
| 193 | Filtrado de documentos por tenant y nivel | No es cifrado ni privacidad diferencial |
| 194 | Control de quórum y unicidad de participantes | No realiza agregación criptográfica segura |
| 195 | Proyección de campos permitidos y bloqueo de PII declarada | Requiere un inventario correcto de campos sensibles; no detecta PII en texto libre |
| 196 | Supresión de grupos con pocos registros y medias | No garantiza anonimato ni privacidad diferencial |
| 197 | Consentimiento por propósito con revocación | No es un sistema de gestión jurídica ni de consentimiento persistente |
| 198 | Matriz de confusión y accuracy de un ataque de inferencia | No certifica privacidad, requiere protocolo de amenaza y datos representativos |

Pruebas: `tests/p10_privacy_patterns.test.ts`. Fuentes preliminares y criterios de promoción: `research/P10_FOUR_NEW_MACROFAMILIES_32_CANDIDATES.md`.

## Gates antes de promoción

- Revisar duplicidades con seguridad, gobernanza y datos.
- Añadir ocho fichas completas con amenazas, contratos, ejemplos y referencias verificadas.
- Ejecutar `tsc --noEmit` y tests P10 en CI y documentar resultado.
- Solo después modificar `catalog/patterns.json`, `catalog/taxonomy.json`, `src/index.ts`, Astro, README y publicaciones de manera consistente.
- No declarar 198 patrones o 23 familias como estado productivo antes de superar esos gates.
