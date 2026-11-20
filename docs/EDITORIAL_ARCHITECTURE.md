# Arquitectura editorial — Patrones IA

## Objetivo

Patrones IA mantiene una única base técnica y editorial capaz de producir, de forma trazable:

1. **270 implementaciones TypeScript**;
2. **270 fichas canónicas**;
3. una **web navegable**;
4. una **edición técnica reproducible** en Markdown/HTML/EPUB/PDF;
5. dos **obras editoriales independientes**;
6. un **Evidence Pack** versionado.

La prioridad es evitar duplicación manual: cuando cambia una ficha, el cambio debe propagarse por build a las superficies derivadas.

## Fuentes de verdad

```text
catalog/taxonomy.json
        └── 34 macrofamilias, vocabulario, niveles y madurez

catalog/patterns.json
        └── inventario maestro 290/290

content/patterns/*.md
        └── ficha editorial canónica de cada patrón

src/pattern_*.ts
        └── implementación ejecutable

catalog/references.json
catalog/pattern-evidence.json
catalog/evidence-baseline.json
        └── evidencia primaria/oficial + scope notes + baseline P7.0

publications/*/publication.json
        └── arquitectura de las dos obras editoriales
```

## Estado actual

- Implementaciones TypeScript: **290/290**.
- Inventario maestro: **290/290**.
- Fichas canónicas: **290/290**.
- Macrofamilias: **26**.
- Grupos de trazabilidad: **39**.
- Evidencia primaria/oficial: **54/290 patrones**.
- Fuentes primarias/oficiales registradas: **51**.
- Baseline: **P7.0**, política `fail-closed`.
- Publicaciones: **2**, ambas en `editor-contact-ready`.
- Edición de referencia: Markdown + HTML + EPUB + PDF.
- Web: Astro + GitHub Pages.

## Taxonomía principal

1. Foundations
2. Agentic Workflows
3. Knowledge & Context
4. Reasoning
5. Multi-Agent
6. Safety & Security
7. Reliability
8. Production & FinOps
9. Evaluation & QA
10. Human Experience
11. AI Platforms & Factories
12. Development & Governance
13. Data & Graph Foundations
14. Model Adaptation & PEFT

Los 27 `legacyGroup` se conservan para trazabilidad histórica y no sustituyen esta navegación editorial.

## Segunda generación 103–122

La ampliación añade:

- AI Factory y Cognitive Core;
- Spec-Driven Development y Graph-Driven Development;
- Open Data Lakehouse, federación de metadatos y grafos tipados;
- GraphRAG, Adaptive GraphRAG, RAPTOR, Self-RAG y Corrective RAG;
- LoRA, QLoRA, AdaLoRA, DoRA, PiSSA, LoRA+, rsLoRA y LoftQ.

Los IDs 1–102 permanecen inmutables. **GDD (106)** es una construcción experimental del proyecto y no se presenta como estándar académico; por ese motivo no forma parte del mínimo de evidencia primaria P7.0.

## Contrato de una ficha canónica

Cada ficha debe mantener, como mínimo:

- `patternId`, `slug`, `title`, `summary`;
- `family` y `legacyGroup`;
- nivel, dificultad y madurez;
- requisitos LLM/estado;
- `evidenceStatus`;
- `sourceFile`;
- tags, relaciones, combinaciones y antipatrón cuando proceda.

El cuerpo editorial debe diferenciar el patrón conceptual de la simplificación concreta de la demo.

## Contrato editorial recomendado

1. propósito;
2. problema y fuerzas;
3. solución;
4. intuición/estructura visual;
5. participantes;
6. flujo;
7. implementación;
8. caso de uso;
9. cuándo usarlo;
10. cuándo no usarlo;
11. ventajas y trade-offs;
12. failure modes;
13. seguridad;
14. observabilidad;
15. coste/latencia;
16. evaluación;
17. variantes;
18. relaciones;
19. composiciones;
20. referencias y límites de evidencia.

## Modelo de evidencia

El repositorio distingue:

- **implementación**: existe código;
- **ficha**: existe contenido editorial;
- **referencia editorial**: fuente relacionada;
- **evidencia primaria/oficial**: paper, estándar, guía gubernamental o documentación oficial con alcance explícito.

El baseline P7.0 exige **54 patrones** y **51 fuentes** como mínimo. El validador bloquea regresiones del baseline.

Una referencia no autoriza a:

- extrapolar un benchmark a cualquier modelo/tarea;
- llamar “seguro” a un control heurístico;
- convertir una configuración en mejora empírica;
- atribuir a una demo garantías que no implementa.

## Productos derivados

### Web

`web/` consume las fichas y catálogos. Las páginas deben derivar conteos de las fuentes de verdad siempre que sea posible.

### Edición de referencia

`scripts/build-book.mjs` ensambla el corpus canónico. Quarto genera HTML/EPUB/PDF. Los manifests incorporan hashes y métricas de cobertura.

### Research monograph EN

La monografía organiza el material por preguntas de investigación y composición arquitectónica. No es una traducción del catálogo.

### Teaching manual ES

El manual convierte el sustrato técnico en secuencias didácticas, laboratorios, ejercicios y rúbricas. Tampoco es una traducción de la monografía.

## Gates

Antes de merge:

- `validate-editorial.mjs`;
- `validate-repository-consistency.mjs`;
- `validate-publications.mjs`;
- `validate-submission-readiness.mjs`;
- `validate-evidence-registry.mjs`;
- Evidence Pack;
- ensamblado/render del libro;
- tests de hardening/regresión;
- build Astro;
- paquete editorial RA-MA.

## Documentación histórica

`INDEX_DOCUMENTOS_INVESTIGACION.md`, `INVESTIGACION_EXHAUSTIVA_PATRONES.md`, `PRESENTACION_VISUAL_PATRONES.md` y `REFERENCIA_RAPIDA_PATRONES.md` se conservan únicamente como trazabilidad de fases previas. Deben llevar un aviso histórico y no pueden usarse como estado operativo.

## Deuda conocida

1. **Web lockfile**: `web/` no dispone todavía de `package-lock.json`; se fija Astro a versión exacta, pero queda pendiente fijar transitivas.
2. **Protección de `main`**: el repositorio aún no tiene branch protection/ruleset que haga obligatorio el CI a nivel de GitHub.
3. **Cobertura de evidencia**: 54/290 es un baseline, no cobertura completa.
4. **Submission blockers**: las dos publicaciones siguen en `editor-contact-ready`; ningún envío debe saltarse el gate de derechos/datos.
5. **GDD**: mantener como experimental hasta disponer de formalización/evaluación propia o evidencia directa.

## Próximos pasos

- ampliar cobertura primaria con prioridad en patrones sin fuente;
- cerrar la reproducibilidad del subproyecto web;
- activar ruleset de `main`;
- resolver blockers editoriales y derechos de figuras;
- ejecutar experimentos de composición antes de introducir claims cuantitativos;
- mantener la ampliación 103–122 integrada en ambas publicaciones sin convertir el corpus técnico en una copia de los manuscritos.

## P8 — Interoperabilidad agéntica

Patrones 123–134 incorporan contratos pedagógicos MCP/A2A. Nueva macrofamilia `agent-interoperability` y grupo histórico 28. No se atribuyen pruebas de conformidad ni resultados empíricos a estas referencias; el baseline de evidencia P7.0 permanece sin cambios.

## P9 — Siete macrofamilias y 56 contratos experimentales

Los IDs 135–190 cuentan con implementación de contrato TypeScript y ficha canónica, clasificados como **experimentales** y `needs-review`. No constituyen algoritmos completos de aprendizaje, gobierno certificado, DevOps autónomo, ingeniería de datos, inferencia edge ni razonamiento causal. La evidencia primaria validada permanece en 54 patrones / 51 fuentes (P7.0). Los benchmarks y las pruebas de integración deben completarse antes de alegar prestaciones o conformidad.

## Ampliación P10

23. Privacy-Preserving & Confidential AI
24. Multimodal & Embodied Agent Systems
25. AI Experimentation & Scientific Discovery
26. AI Economics, Markets & Mechanism Design

Los patrones 191–222 están incorporados al catálogo principal con madurez `experimental` y evidencia `needs-review`. La integración en `main` no certifica seguridad ni equivale a una ejecución satisfactoria de CI.

## P11 — Macrofamilias 27–32

27. AI Observability & Behavioral Diagnostics
28. Trustworthy Synthetic Data & Simulation
29. AI Supply Chain & Model Artifact Security
30. Adaptive Human–AI Collaboration
31. Formal Verification & Runtime Assurance
32. Autonomous Knowledge Engineering

Los patrones 223–270 son contratos experimentales con `evidenceStatus: needs-review`; la incorporación al catálogo no certifica seguridad ni prueba CI satisfactoria.

## P12.1 — Integración canónica parcial

Los patrones 271–280 de inferencia adaptativa se integraron en `src/`, `content/patterns/`, `catalog/`, `src/index.ts` y scripts. Estado experimental; evidencia `needs-review`. Los 85 candidatos restantes P12 continúan en investigación. CI no verificada.

## P12.2 — Integración canónica de identidad

Los patrones 281–290 de identidad y confianza delegada se integraron en `src/`, `content/patterns/`, catálogo, taxonomía, exportaciones y scripts. Estado experimental; evidencia `needs-review`. Quedan 75 candidatos P12 en investigación. CI no verificada.
