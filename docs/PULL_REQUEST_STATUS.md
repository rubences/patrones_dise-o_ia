# Pull Request #1 — Estado de la Fase 1

Este documento resume el alcance funcional del PR `feature/book-web-foundation`.

## Cobertura actual

- 102/102 implementaciones TypeScript inventariadas.
- 102/102 registros en el catálogo maestro.
- 10 macrofamilias editoriales.
- 23 grupos históricos preservados como trazabilidad.
- 9 fichas canónicas publicadas:
  - 1 Pipeline
  - 2 Router
  - 3 Reflection
  - 4 Evaluator-Optimizer
  - 5 Tool Use
  - 6 Planning
  - 7 Multi-Agent
  - 8 Human-in-the-Loop
  - 25 Retrieval-Augmented Generation (RAG)

## Web

La web Astro muestra desde esta fase los 102 patrones. Los patrones con ficha canónica enlazan al capítulo editorial; los que todavía no han pasado revisión editorial enlazan a su implementación TypeScript.

El estado de publicación se deriva de la presencia de `content/patterns/<id>-<slug>.md`, evitando duplicar un flag mutable de publicación.

## Control de calidad

El validador comprueba:

- número de implementaciones;
- continuidad de IDs 1–102;
- catálogo maestro 102/102;
- unicidad de IDs y slugs;
- macrofamilias y grupos históricos válidos;
- existencia y correspondencia de `sourceFile`;
- integridad de las fichas canónicas;
- coherencia entre slug y source del inventario y de la ficha.

Astro valida además el frontmatter mediante Zod durante el build.

## Criterio editorial aplicado al primer bloque

Las fichas distinguen explícitamente patrón conceptual, implementación concreta y simplificaciones pedagógicas. Se han documentado como tales elementos como puntuaciones fijas, confianza aleatoria, herramientas simuladas, clasificación textual de riesgo y estructuras de planificación parcialmente codificadas.

## Deuda no bloqueante para esta fase

- Normalizar el heading histórico `Mapa Completo de 99 Patrones` del README.
- Marcar/archivar `RESUMEN_EJECUTIVO_PLAN_ACCION.md` como material histórico.
- Fijar `web/package-lock.json` en la estabilización del subproyecto web.
- Añadir pipeline PDF/EPUB después de consolidar varios bloques editoriales.

## Próximo bloque

Migración editorial de los 23 patrones GoF reinterpretados para IA: patrones 9–24 y 29–35.
