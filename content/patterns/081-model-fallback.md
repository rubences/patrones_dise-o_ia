---
patternId: 81
slug: model-fallback
title: Model Fallback
summary: Conmuta a proveedores o despliegues alternativos cuando la dependencia principal falla, preservando el contrato del llamador y registrando la degradación.
family: reliability
legacyGroup: 19
level: architecture
difficulty: intermediate
maturity: established
llmRequired: false
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_81_model_fallback.ts
tags: [fallback, provider, redundancy, availability]
related: [39, 45, 47]
combinesWith: [11, 31, 77]
antiPatterns:
  - Suponer que proveedores distintos tienen semántica idéntica.
  - Hacer fallback por errores de autorización o validación del cliente.
  - Perder provenance sobre qué proveedor respondió.
references: []
---
# Propósito
Model Fallback aumenta disponibilidad intentando proveedores alternativos cuando el actual no puede atender la solicitud.

## Implementación del repositorio
`src/pattern_81_model_fallback.ts` modela correctamente el patrón con una interfaz `ProveedorLLM` y proveedores simulados. Todos los errores hacen avanzar al siguiente proveedor, sin clasificación entre errores transitorios, permanentes o errores del request.

## Producción
Clasifica fallos, usa circuit breakers por proveedor, normaliza capacidades mediante adapters y registra proveedor/model/version. Valida equivalencia de safety y structured outputs en cada alternativa.

## Diferencia con Cascade
Cascade escala por calidad/suficiencia de una respuesta exitosa; Fallback conmuta por fallo/disponibilidad.