# Arquitectura editorial — Patrones IA

## Objetivo

Convertir el repositorio de 102 implementaciones TypeScript en una única fuente de conocimiento capaz de alimentar tres productos sincronizados:

1. **Web navegable** — catálogo, búsqueda, filtros, learning paths y relaciones.
2. **Libro** — narrativa técnica, capítulos, arquitecturas compuestas y referencias.
3. **Código ejecutable** — implementación TypeScript asociada a cada patrón.

## Fuentes de verdad

```text
catalog/taxonomy.json
        |
        +--> macrofamilias y vocabulario editorial

catalog/patterns.json
        |
        +--> inventario maestro 102/102: identidad, slug, familia, grupo histórico y sourceFile

content/patterns/*.md
        |
        +--> presencia del fichero = ficha editorial publicada
        +--> metadatos y contenido canónico para web/libro

src/pattern_*.ts
        |
        +--> implementación ejecutable
```

El **estado de publicación se deriva de la presencia de una ficha canónica en `content/patterns/`**. No se mantiene un segundo flag mutable para evitar divergencias entre inventario y contenido.

## Estado de la Fase 1

- Implementaciones TypeScript: **102/102**.
- Inventario maestro: **102/102**.
- Fichas canónicas publicadas: **9/102**.
- Primer bloque editorial cerrado: patrones **1–8**.
- Ficha de referencia de Knowledge & Context: patrón **25 — RAG**.

### Fichas publicadas

1. Pipeline
2. Router
3. Reflection
4. Evaluator-Optimizer
5. Tool Use
6. Planning
7. Multi-Agent
8. Human-in-the-Loop
25. Retrieval-Augmented Generation (RAG)

## Taxonomía principal

La navegación pública utiliza diez macrofamilias:

- Foundations
- Agentic Workflows
- Knowledge & Context
- Reasoning
- Multi-Agent
- Safety & Security
- Reliability
- Production & FinOps
- Evaluation & QA
- Human Experience

Los 23 grupos históricos del README se conservan como `legacyGroup` para trazabilidad, pero no constituyen la navegación principal del libro.

## Contrato mínimo de una ficha

Toda ficha canónica debe declarar:

- `patternId`
- `slug`
- `title`
- `summary`
- `family`
- `legacyGroup`
- `level`
- `difficulty`
- `maturity`
- `llmRequired`
- `stateful`
- `evidenceStatus`
- `sourceFile`
- `tags`
- `related`
- `combinesWith`
- `antiPatterns`
- `references`

Astro valida este contrato durante el build mediante Content Collections y Zod.

## Estructura recomendada de capítulo

Cada patrón debe cubrir, como mínimo:

1. Propósito.
2. Problema.
3. Solución.
4. Estructura o arquitectura.
5. Implementación existente en el repositorio.
6. Aplicabilidad.
7. Cuándo no utilizarlo.
8. Failure modes.
9. Seguridad.
10. Observabilidad.
11. Coste y latencia.
12. Evaluación.
13. Patrones relacionados y combinaciones.
14. Estado editorial/evidencia.

Los capítulos más maduros pueden ampliar este núcleo con variantes, pseudocódigo, ejemplos end-to-end, benchmarks y bibliografía comentada.

## Política de evidencia

Tres estados controlan qué afirmaciones pueden presentarse como consolidadas:

- `verified`: afirmaciones materiales respaldadas por evidencia revisada y trazable.
- `partially-verified`: núcleo sustentado, pero existen claims, métricas o variantes pendientes de revisión.
- `needs-review`: ficha técnicamente útil, pero todavía no apta para presentar métricas o afirmaciones empíricas como verificadas.

Una métrica presente en comentarios o documentación histórica del repositorio **no se convierte automáticamente en evidencia editorial**.

## Separación patrón / demo

La edición debe distinguir siempre entre:

- la definición conceptual del patrón;
- las propiedades de la implementación TypeScript concreta;
- simplificaciones pedagógicas de la demo;
- requisitos adicionales para producción.

Ejemplos detectados en el primer bloque:

- Reflection usa puntuaciones numéricas demostrativas fijas.
- Planning materializa parte del plan mediante estructuras codificadas.
- Multi-Agent genera la confianza de la demo con aleatoriedad.
- Human-in-the-Loop simula la decisión humana y simplifica la clasificación de riesgo.
- Tool Use simula herramientas y detección textual en vez de despacho estructurado real.

Estas simplificaciones se documentan de forma explícita en las fichas para evitar convertirlas en propiedades generales del patrón.

## Definition of Done editorial

Una ficha está lista para publicarse cuando:

- existe su implementación TypeScript y el `sourceFile` coincide;
- ID, slug, familia y grupo histórico son coherentes con el inventario maestro;
- el build de Astro valida el frontmatter;
- problema y solución están expresados en términos de fuerzas de diseño, no solo de código;
- las limitaciones de la demo están separadas del patrón conceptual;
- se documentan failure modes y seguridad cuando sean relevantes;
- las relaciones con otros patrones son justificables;
- las métricas cuantitativas disponen de evidencia o se omiten;
- el validador editorial finaliza en PASS.

## Roadmap editorial inmediato

### Bloque 2 — Foundations / GoF

Normalizar los 23 patrones clásicos reinterpretados para IA: 9–24 y 29–35.

### Bloque 3 — Knowledge & Context

Completar RAG con Knowledge Graph, Retrieval Ranking, Long-Term Memory, Grounding, Contextual Compression y Context Compaction.

### Bloque 4 — Reasoning y Multi-Agent

Migrar Tree of Thought, Self-Consistency, ReAct, Scratchpad, Few-Shot, Zero-Shot CoT y las variantes multiagente avanzadas.

### Bloques posteriores

Safety & Security, Reliability, Production & FinOps, Evaluation & QA y Human Experience.

## Deuda conocida no bloqueante

- El README histórico conserva un heading residual `Mapa Completo de 99 Patrones`.
- `RESUMEN_EJECUTIVO_PLAN_ACCION.md` describe una fase anterior y debe tratarse como documento histórico.
- `web/package-lock.json` debe fijarse cuando se cierre la primera estabilización del subproyecto web.
- El libro PDF/EPUB se añadirá una vez estabilizada la convención de capítulos en varios bloques.
