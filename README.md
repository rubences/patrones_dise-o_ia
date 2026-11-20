# Patrones IA — 190 patrones de diseño para sistemas inteligentes

[![Editorial, Hardening, Publication and Web CI](https://github.com/rubences/patrones_dise-o_ia/actions/workflows/web-ci.yml/badge.svg)](https://github.com/rubences/patrones_dise-o_ia/actions/workflows/web-ci.yml)
[![Deploy Patrones IA Web](https://github.com/rubences/patrones_dise-o_ia/actions/workflows/deploy-web.yml/badge.svg)](https://github.com/rubences/patrones_dise-o_ia/actions/workflows/deploy-web.yml)

**Patrones IA** es una biblioteca abierta y un lenguaje de patrones para diseñar sistemas de inteligencia artificial: agentes, RAG y grafos, AI Factories, seguridad, fiabilidad, evaluación, operación y adaptación eficiente de modelos.

**Web:** https://rubences.github.io/patrones_dise-o_ia/

> **Estado actual — v19.0.0 / P7.0:** 190/190 implementaciones · 190/190 fichas canónicas · 22 macrofamilias · 35 grupos de trazabilidad · 54/190 patrones con evidencia primaria/oficial · 51 fuentes primarias/oficiales registradas.

## Qué mantiene el repositorio

| Capa | Fuente de verdad | Propósito |
|---|---|---|
| Código | `src/pattern_*.ts` | 190 implementaciones TypeScript de referencia |
| Inventario | `catalog/patterns.json` | ID, slug, familia, grupo histórico y fichero fuente |
| Taxonomía | `catalog/taxonomy.json` | 22 macrofamilias, niveles, madurez y vocabulario editorial |
| Fichas | `content/patterns/*.md` | contenido canónico para web y edición de referencia |
| Evidencia | `catalog/references.json` + `catalog/pattern-evidence.json` | fuentes primarias/oficiales y límites de interpretación |
| Web | `web/` | catálogo Astro, evidencia, libro y publicaciones |
| Edición técnica | `book/` + `scripts/build-book.mjs` | Markdown/HTML/EPUB/PDF reproducibles |
| Publicaciones | `publications/` | dos obras editoriales independientes |
| Investigación | `research/` | ampliaciones y terminología experimental |

La regla editorial es **single source of truth**: código, catálogo, fichas, Evidence Pack, web y libro técnico deben poder reconstruirse sin mantener copias manuales divergentes.

## 22 macrofamilias

| # | Familia | Patrones | Alcance |
|---:|---|---:|---|
| 1 | Foundations | 23 | GoF y principios reutilizables reinterpretados para IA |
| 2 | Agentic Workflows | 11 | tools, planning, reflexión y orquestación |
| 3 | Knowledge & Context | 12 | RAG, memoria, grounding y retrieval avanzado |
| 4 | Reasoning | 8 | CoT, ToT, Self-Consistency y evaluadores |
| 5 | Multi-Agent | 7 | coordinación, delegación y estado compartido |
| 6 | Safety & Security | 11 | guardrails, permisos, sandboxing y defensa adversarial |
| 7 | Reliability | 12 | retry, circuit breaker, checkpointing y fallback |
| 8 | Production & FinOps | 11 | observabilidad, coste, rendimiento y operación |
| 9 | Evaluation & QA | 6 | judge, A/B, regresión, red teaming y evidencia |
| 10 | Human Experience | 6 | escalado, aclaración, preferencias y atribución |
| 11 | AI Platforms & Factories | 2 | AI Factory y Cognitive Core |
| 12 | Development & Governance | 2 | SDD y GDD |
| 13 | Data & Graph Foundations | 3 | Open Data Lakehouse, metadata fabric y typed graphs |
| 14 | Model Adaptation & PEFT | 8 | LoRA, QLoRA y variantes de adaptación eficiente |

## Segunda generación — patrones 103–122

- **103–104:** AI Factory y Agent Brain / Cognitive Core.
- **105–106:** Spec-Driven Development y Graph-Driven Development.
- **107–109:** Open Data Lakehouse, Federated Metadata Fabric y Typed Knowledge Graph.
- **110–114:** GraphRAG, Adaptive GraphRAG Router, RAPTOR, Self-RAG y Corrective RAG.
- **115–122:** LoRA, QLoRA, AdaLoRA, DoRA, PiSSA, LoRA+, rsLoRA y LoftQ.

**GDD (106)** es terminología experimental definida por este proyecto; no se presenta como metodología académica estandarizada y por eso queda fuera del mínimo de evidencia primaria P7.0. Para el concepto que en algunos contextos se abrevia de forma ambigua como “RGA”, el catálogo utiliza nombres explícitos como **GraphRAG / Graph-Augmented Generation**.

## Evidencia y rigor

El Evidence Pack separa cuatro cosas que no deben confundirse:

1. que exista una implementación;
2. que exista una ficha editorial;
3. que haya una referencia relacionada;
4. que exista evidencia primaria/oficial aplicable al alcance concreto del patrón.

El baseline **P7.0** es fail-closed y exige como mínimo **54 patrones** con evidencia primaria/oficial y **51 fuentes** registradas. Cada relación patrón–fuente incorpora un `scopeNote` para evitar extrapolar benchmarks, garantías de seguridad o resultados experimentales fuera del contexto estudiado.

Medium y otras fuentes de práctica industrial pueden orientar investigación, pero **no sustituyen evidencia primaria, estándares o documentación oficial**.

## Web y catálogo

La web pública ofrece catálogo, filtros, fichas, Evidence Pack, edición de referencia y estado de las publicaciones:

- Inicio: https://rubences.github.io/patrones_dise-o_ia/
- Catálogo: https://rubences.github.io/patrones_dise-o_ia/patterns/
- Evidencia: https://rubences.github.io/patrones_dise-o_ia/evidence/
- Libro técnico: https://rubences.github.io/patrones_dise-o_ia/book/
- Publicaciones: https://rubences.github.io/patrones_dise-o_ia/publications/

Desarrollo local:

```bash
cd web
npm install
npm run dev
```

> Deuda conocida: `web/` todavía no dispone de `package-lock.json`; la dependencia directa de Astro está fijada a una versión exacta, pero las dependencias transitivas no quedan totalmente reproducibles hasta incorporar el lockfile.

## Código

Requisitos usados por CI: **Node.js 24**.

```bash
npm ci
npm run pattern:25
npm run pattern:82
npm run pattern:110
npm run pattern:115
```

La API pública unificada está en `src/index.ts`. Los gates de consistencia verifican que todos los IDs del catálogo tengan implementación, script ejecutable y export público.

## Validación

Los principales gates son:

```bash
node scripts/validate-editorial.mjs
node scripts/validate-repository-consistency.mjs
node scripts/validate-publications.mjs
node scripts/validate-submission-readiness.mjs
node scripts/validate-evidence-registry.mjs
node scripts/build-evidence-pack.mjs
node scripts/build-book.mjs
```

CI añade además la suite de regresión/hardening, el build Astro, el render Quarto/Typst, el paquete RA-MA y los artefactos distribuibles del libro.

## Edición técnica reproducible

La edición de referencia se deriva de las 190 fichas canónicas; **no es ninguno de los dos manuscritos comerciales**.

```bash
node scripts/build-evidence-pack.mjs
node scripts/build-book.mjs
quarto render dist/book/patrones-ia-manuscript.md
```

El pipeline genera Markdown, HTML, EPUB y PDF, además de manifests y hashes SHA-256. Las releases estables usan tags `book-v*`.

## Dos publicaciones independientes

### Research EN

**Architectural Design Patterns for Edge and Generative AI**  
*A Pattern Language for Agentic, Distributed, Reliable and Secure AI Systems*

Estado: **editor-contact-ready**, no `submission-ready`. La propuesta mantiene blockers fail-closed sobre perfil/afiliaciones aprobadas, selección de publicaciones, calendario, figuras y verificación del formulario editorial.

### Teaching ES

**Patrones de Diseño en Inteligencia Artificial: Manual Práctico y Laboratorios**  
*De agentes y RAG a arquitecturas seguras, observables y desplegables*

Estado: **editor-contact-ready**, no `submission-ready`. El paquete RA-MA se genera y valida en CI; los datos privados nunca se versionan en el repositorio.

Ambas obras comparten IDs, código, taxonomía y Evidence Pack, pero **no son traducciones entre sí**: tesis, estructura, prosa, casos, figuras, ejercicios y validación son independientes.

## Documentación histórica

Los siguientes documentos de la primera etapa se conservan por trazabilidad, pero **no describen el estado actual**:

- `INDEX_DOCUMENTOS_INVESTIGACION.md`
- `INVESTIGACION_EXHAUSTIVA_PATRONES.md`
- `PRESENTACION_VISUAL_PATRONES.md`
- `REFERENCIA_RAPIDA_PATRONES.md`

Para estado operativo utiliza este README, `docs/EDITORIAL_ARCHITECTURE.md`, `catalog/` y los reportes generados por CI.

## Deuda técnica y próximos cierres

- ampliar la evidencia primaria más allá de 54/190 sin rebajar el criterio de alcance;
- generar y versionar `web/package-lock.json`;
- activar una ruleset/branch protection para que `main` exija CI desde GitHub, no solo por convención;
- resolver blockers de submission y derechos de figuras antes de cualquier envío externo;
- convertir GDD en una contribución formal evaluable o mantenerlo explícitamente como patrón experimental;
- ejecutar y publicar benchmarks de composiciones completas antes de introducir claims cuantitativos.

## Licencia y derechos

El código se publica bajo **MIT** salvo indicación contraria. Las publicaciones, figuras, materiales docentes y futuras cesiones editoriales se gobiernan mediante `publications/common/CONTRACT_RIGHTS_GATE.md`.

---

**Principio del proyecto:** una ausencia de evidencia permanece visible; nunca se transforma en una cifra, una garantía o una referencia inventada.

## P8 — Interoperabilidad MCP y A2A (123–134)

Doce implementaciones y fichas canónicas de referencia: capability adapter, policy gateway, trusted tool registry, workflow handle, MRTR elicitation, host-controlled sampling, Agent Card trust, task lifecycle, MCP–A2A bridge, tool poisoning defense, argument-aware least privilege y cross-protocol tracing. **No son implementaciones completas ni certificadas de los protocolos.** La evidencia primaria P7.0 continúa en 54 patrones; P8 permanece `needs-review` hasta vincular referencias oficiales con alcance validado. Ver `research/p8-patterns/INTEROPERABILIDAD_12_FICHAS.md`.

## P9 — Siete macrofamilias y 56 contratos experimentales

Los IDs 135–190 cuentan con implementación de contrato TypeScript y ficha canónica, clasificados como **experimentales** y `needs-review`. No constituyen algoritmos completos de aprendizaje, gobierno certificado, DevOps autónomo, ingeniería de datos, inferencia edge ni razonamiento causal. La evidencia primaria validada permanece en 54 patrones / 51 fuentes (P7.0). Los benchmarks y las pruebas de integración deben completarse antes de alegar prestaciones o conformidad.
