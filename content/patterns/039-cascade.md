---
patternId: 39
slug: cascade
title: Cascade
summary: Intenta resolver primero con una configuración más barata o rápida y escala solo cuando una señal de calidad fiable indica que es necesario.
family: production-finops
legacyGroup: 8
level: architecture
difficulty: intermediate
maturity: established
llmRequired: true
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_39_cascade.ts
tags: [routing, cascade, cost, models]
related: [2, 38, 81]
combinesWith: [73, 78, 92]
antiPatterns:
  - Usar autoconfianza del modelo como único criterio de escalado.
  - Prometer un ahorro fijo de coste sin medir distribución real de consultas.
  - Escalar después de haber producido efectos externos irreversibles.
references: []
---
# Propósito
Cascade ordena niveles de servicio de menor a mayor coste/capacidad y detiene el flujo cuando se alcanza una calidad aceptable.

```text
request -> cheap/fast -> quality gate -> medium -> quality gate -> strong
```

## Implementación del repositorio
`src/pattern_39_cascade.ts` usa el mismo `DEFAULT_MODEL` con esfuerzos `low`, `medium` y `high`. El propio modelo imprime `CONFIANZA: N`; si no se parsea, se asigna una confianza por defecto creciente.

La demo muestra la mecánica de escalado, pero **no implementa una cascada de modelos distintos ni una señal calibrada de calidad**. El claim histórico de `-80%` de coste no es una garantía general.

## Producción
El gate debería basarse en señales evaluadas: clasificador de complejidad, verifier, retrieval coverage, reglas deterministas o calibración obtenida en un conjunto de evaluación. Registra qué nivel resolvió cada consulta y calcula ahorro/quality delta real.

## Relaciones
**Model Fallback (81)** cambia por fallo; Cascade cambia por suficiencia/calidad. **LLM-as-Judge (73)** puede aportar una señal de gate si está evaluada.