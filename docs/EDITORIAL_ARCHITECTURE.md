# Arquitectura editorial: libro + web

## Objetivo

Convertir el repositorio en una obra de referencia abierta sobre patrones de diseño para sistemas de IA, con una sola fuente de contenido que alimente:

- la web navegable;
- el libro (PDF/EPUB en fases posteriores);
- la documentación técnica del repositorio;
- el catálogo y el grafo de relaciones entre patrones.

## Principio rector

**Single source of truth.** Cada patrón se documenta una sola vez en `content/patterns/` mediante Markdown con frontmatter validado. La web y los futuros generadores editoriales consumen ese contenido.

## Arquitectura de directorios

```text
catalog/
  taxonomy.json
  pattern.schema.json
content/
  patterns/
  templates/
web/
  src/content.config.ts
  src/pages/
  src/layouts/
  src/styles/
scripts/
  validate-editorial.mjs
src/
  pattern_*.ts
```

## Taxonomía canónica

La navegación editorial utiliza 10 macrofamilias:

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

Los 23 grupos históricos del README se conservan como `legacyGroup` para mantener trazabilidad con la evolución previa del repositorio.

## Contrato editorial por patrón

Toda ficha debe cubrir, como mínimo:

1. Propósito
2. Problema
3. Solución
4. Intuición visual
5. Estructura y participantes
6. Flujo de ejecución
7. Implementación
8. Caso de uso
9. Aplicabilidad
10. Cuándo no usarlo
11. Ventajas y trade-offs
12. Failure modes
13. Seguridad
14. Observabilidad
15. Coste y latencia
16. Evaluación
17. Variantes
18. Patrones relacionados
19. Combinaciones recomendadas
20. Referencias

## Política de evidencia

Las cifras cuantitativas no deben publicarse como hechos generales sin una referencia verificable o un benchmark reproducible. Cada patrón declara `evidenceStatus`:

- `verified`: las afirmaciones principales están respaldadas por referencias o medidas reproducibles;
- `partially-verified`: parte de la evidencia está verificada y parte permanece cualitativa;
- `needs-review`: ficha técnicamente válida pero pendiente de revisión bibliográfica/empírica.

## Fases

### Fase 0 — Normalización

- [x] Taxonomía canónica
- [x] Esquema de metadatos
- [x] Plantilla editorial
- [x] Primera ficha de referencia (RAG)
- [ ] Auditar 102/102 patrones
- [ ] Eliminar referencias editoriales obsoletas a 24, 47, 94 o 99 patrones cuando describan el estado actual
- [ ] Revisar claims cuantitativos

### Fase 1 — Web mínima viable

- [x] Astro + Content Collections
- [x] Home
- [x] Catálogo
- [x] Página dinámica por patrón
- [x] Diseño base responsive
- [ ] Buscador
- [ ] Filtros
- [ ] Grafo de patrones
- [ ] Learning paths

### Fase 2 — Conversión completa del catálogo

- [ ] Migrar los 101 patrones restantes a fichas canónicas
- [ ] Generar diagramas propios
- [ ] Añadir referencias científicas/técnicas
- [ ] Construir matrices de combinación y anti-patrones

### Fase 3 — Libro

- [ ] Índice narrativo por partes
- [ ] Front matter y prólogo
- [ ] Generación PDF
- [ ] Generación EPUB
- [ ] Bibliografía consolidada
- [ ] Revisión editorial final

## Criterio de Definition of Done por patrón

Una ficha se considera publicable cuando:

- pasa el esquema de contenido;
- enlaza al fichero TypeScript real;
- describe al menos un caso de uso concreto;
- incluye riesgos/failure modes;
- incluye observabilidad y evaluación;
- declara su estado de evidencia;
- no contiene métricas no atribuibles presentadas como hechos universales;
- declara relaciones con otros patrones.
