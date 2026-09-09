---
patternId: 50
slug: multimodal
title: Multimodal
summary: Coordina entradas de distintas modalidades mediante procesadores específicos y una síntesis común, manteniendo explícitos los contratos y límites de cada tipo de contenido.
family: agentic-workflows
legacyGroup: 11
level: architecture
difficulty: intermediate
maturity: established
llmRequired: true
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_50_multi_modal.ts
tags: [multimodal, routing, vision, structured-data]
related: [40, 79, 83]
combinesWith: [53, 84, 100]
antiPatterns:
  - Llamar multimodal a un flujo que solo clasifica cadenas de texto.
  - Tratar una URL como contenido recuperado sin hacer fetch ni validar la fuente.
  - Asignar porcentajes de confianza fijos y presentarlos como calibración.
references: []
---
# Propósito
Multimodal permite que un sistema procese varios tipos de entrada bajo un flujo común sin obligar a que todas las modalidades compartan el mismo preprocesamiento, riesgos o modelo.

## Problema
Texto, imágenes, audio, vídeo, código y datos estructurados tienen contratos distintos. Un único handler genérico suele ocultar fallos de parsing, seguridad y capacidad del modelo.

## Solución
Detecta o declara la modalidad, valida el contenido, enruta a un procesador compatible y sintetiza únicamente resultados normalizados.

```text
entrada -> detectar/validar modalidad -> procesador específico -> resultado tipado -> síntesis
```

## Implementación del repositorio
`src/pattern_50_multi_modal.ts` soporta texto, código, JSON/datos, URL y Markdown como **cadenas**. No envía imágenes, audio o vídeo reales a un modelo multimodal. El handler de URL tampoco recupera la página; solo pide al LLM que infiera qué podría representar la URL. Los valores de `confianza` son constantes hardcoded por modalidad.

Por tanto, la demo ilustra routing de formatos textuales heterogéneos, no un pipeline multimodal completo.

## Producción
Valida MIME y tamaño, analiza archivos en sandbox cuando corresponda, separa extracción de contenido de interpretación y conserva provenance. Para imagen/audio/vídeo usa endpoints y modelos que acepten realmente esas modalidades y prueba límites por resolución, duración y formato.

## Seguridad
Una modalidad nueva amplía la superficie de ataque. Aplica antivirus/sandboxing a archivos, SSRF defense a URLs, límites de recursos y sanitización antes de incorporar contenido externo al contexto.

## Relaciones
**Branching (40)** aporta routing condicional; **Code Sandboxing (84)** aísla código; **Tool-Output Sanitization (100)** protege contenido que vuelve al contexto.