# Publications — Patrones IA

Este directorio organiza las **dos obras editoriales independientes** derivadas del mismo sustrato técnico de Patrones IA.

## Modelo editorial

El repositorio mantiene tres capas deliberadamente separadas:

1. **Referencia abierta y ejecutable**: `content/patterns/`, `catalog/`, `src/`, web y Evidence Pack. Es la fuente técnica trazable de los 102 patrones.
2. **Monografía internacional de investigación (EN)**: una obra de síntesis y contribución arquitectónica para investigadores, arquitectos de software y especialistas en sistemas de IA.
3. **Manual universitario (ES)**: una obra didáctica basada en resultados de aprendizaje, laboratorios, ejercicios, rúbricas y un proyecto integrador.

Las publicaciones 2 y 3 **no son traducciones entre sí**. Comparten IDs de patrón, implementaciones, taxonomía y registro de evidencia, pero deben mantener narrativa, selección, secuencia, casos, figuras y aportaciones originales diferenciadas.

## Vías

| ID | Idioma | Naturaleza | Título de trabajo | Estado |
|---|---|---|---|---|
| `research-monograph-en` | Inglés | Monografía de investigación | *Architectural Design Patterns for Edge and Generative AI* | Proposal development |
| `teaching-manual-es` | Español | Manual universitario | *Patrones de Diseño en Inteligencia Artificial: Manual Práctico y Laboratorios* | Desarrollo de propuesta |

## Fuente compartida, obra distinta

Se puede reutilizar de forma trazable el **sustrato factual y técnico**: identificadores, interfaces, código, terminología, referencias, resultados reproducibles y clasificación. No se debe asumir reutilización automática del texto narrativo entre manuscritos.

Antes de entregar a una editorial, revisar `common/EDITORIAL_REUSE_AND_RIGHTS.md` y el contrato propuesto. Las condiciones sobre traducción, adaptación, territorio, figuras, material suplementario, web complementaria, repositorios, acceso abierto y versiones aceptadas dependen del contrato concreto.

## Validación

```bash
node scripts/validate-publications.mjs
```

El validador comprueba estructura, IDs, idiomas, independencia declarada, capítulos, patrones referenciados y política de revisión de derechos. Es un **guardrail editorial**, no una evaluación jurídica ni un detector de similitud textual.
