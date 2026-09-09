---
patternId: 11
slug: adapter
title: Adapter
summary: Traduce una interfaz o formato externo a un contrato interno estable para integrar modelos, herramientas y fuentes heterogéneas sin contaminar el dominio.
family: foundations
legacyGroup: 3
level: component
difficulty: beginner
maturity: foundational
llmRequired: true
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_11_adapter.ts
tags: [gof, structural, adapter, interoperability]
related: [16, 31, 59]
combinesWith: [28, 67, 82]
antiPatterns:
  - Propagar peculiaridades del proveedor por toda la aplicación.
  - Convertir el adapter en una capa con reglas de negocio.
references:
  - Gamma et al. (1994), Design Patterns.
---
# Propósito
Adapter permite que componentes incompatibles cooperen mediante traducción explícita. En IA, las diferencias entre proveedores, tool schemas, formatos de salida y stores hacen que esta separación sea crítica.

## Problema
Si el dominio depende directamente del formato de cada SDK o API, cualquier cambio de proveedor obliga a modificar workflows, tests y observabilidad.

## Solución
Introduce un adaptador que reciba el contrato externo y exponga el contrato interno esperado.

```text
Proveedor/API -> Adapter -> Contrato del dominio
```

## Aplicabilidad
Úsalo para integrar LLM providers, vector stores, herramientas, formatos JSON/CSV/XML o sistemas legacy. No lo uses para esconder diferencias semánticas importantes: esas deben modelarse explícitamente.

## Seguridad y observabilidad
La traducción es también un límite de confianza. Valida tipos, tamaños y campos; registra errores de adaptación sin filtrar secretos o PII.

## Implementación del repositorio
`src/pattern_11_adapter.ts` materializa conversiones entre interfaces/formats. La adaptación no garantiza equivalencia semántica entre proveedores.

## Relaciones
**Bridge (31)** separa dos dimensiones variables; **Facade (16)** simplifica un subsistema; **Structured Output (59)** refuerza contratos de salida.