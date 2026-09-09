---
patternId: 99
slug: synthetic-data
title: Synthetic Data Generation
summary: Genera casos artificiales reproducibles para ampliar cobertura de pruebas o entrenamiento, validando realismo, diversidad y etiquetas antes de mezclarlos con evidencia real.
family: evaluation-qa
legacyGroup: 22
level: workflow
difficulty: intermediate
maturity: established
llmRequired: false
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_99_synthetic_data.ts
tags: [synthetic-data, datasets, testing, coverage]
related: [74, 76, 102]
combinesWith: [75, 73]
antiPatterns:
  - Sustituir un conjunto de evaluación real por datos sintéticos del mismo generador.
  - Asumir que una etiqueta es correcta solo porque proviene de la plantilla.
  - Permitir leakage entre datos sintéticos usados para optimizar y el conjunto final de evaluación.
references: []
---
# Propósito
Synthetic Data Generation crea casos reproducibles para cubrir combinaciones poco frecuentes, inicializar suites o aumentar variedad sin autoría manual caso a caso.

## Implementación del repositorio
`src/pattern_99_synthetic_data.ts` usa plantillas parametrizadas y un generador pseudoaleatorio con semilla. Produce una cantidad fija por categoría y etiqueta cada caso con la categoría de la plantilla.

El muestreo es con reemplazo, por lo que puede generar duplicados aunque existan combinaciones disponibles. La etiqueta de categoría viene por construcción, pero no se valida que la combinación resultante sea natural, no ambigua o representativa del tráfico real.

El comentario propone parafraseo con LLM en producción. Esa etapa puede introducir **label drift** o cambiar la dificultad, así que los casos deberían revalidarse después de la generación.

## Producción
Mide diversidad y duplicados, separa synthetic-train de holdout real, versiona plantilla/seed/generador y revisa leakage. Para seguridad, conserva un baseline manual de ataques críticos que no dependa del generador.

## Relaciones
**Regression Testing (76)** consume datasets estables; **Red Teaming (74)** aporta casos reales/curados; Synthetic Data amplía cobertura, no sustituye evidencia real.