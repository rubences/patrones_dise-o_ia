---
patternId: 83
slug: dynamic-tool-discovery
title: Dynamic Tool Discovery
summary: Descubre herramientas y sus contratos en runtime para desacoplar el agente del catálogo estático, manteniendo autorización y trust como decisiones separadas del descubrimiento.
family: agentic-workflows
legacyGroup: 19
level: architecture
difficulty: advanced
maturity: emerging
llmRequired: false
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_83_dynamic_tool_discovery.ts
tags: [tools, discovery, mcp, runtime]
related: [5, 28, 82]
combinesWith: [72, 100, 101]
antiPatterns:
  - Interpretar tool descubierta como tool autorizada.
  - Aceptar schemas remotos sin trust policy ni versionado.
  - Exponer automáticamente todas las tools descubiertas al modelo.
references: []
---
# Propósito
Dynamic Tool Discovery obtiene en tiempo de ejecución nombres, descripciones y schemas de herramientas y construye a partir de ellos el catálogo que un agente puede considerar.

## Implementación del repositorio
`src/pattern_83_dynamic_tool_discovery.ts` conecta mediante el SDK de MCP al servidor del patrón 82 usando `InMemoryTransport`, ejecuta `tools/list`, transforma el `inputSchema` a una definición de function calling y demuestra una invocación con `callTool`.

La parte de descubrimiento es real dentro del protocolo MCP, pero la demo no conecta un LLM que seleccione la función; esa elección se simula buscando `listar_categorias` en el array. Tampoco hay autenticación, allowlist por principal o trust negotiation porque el transporte es local in-memory.

## Producción
Introduce catálogo permitido por tenant/rol, identidad del servidor, versionado, cache con expiración y revisión de cambios de schema. No pases automáticamente al LLM herramientas sensibles solo porque un servidor las anuncie.

## Seguridad
Aplica **Tool Call Validation Gate (101)** antes de dispatch y **Tool-Output Sanitization (100)** al resultado. Discovery determina disponibilidad técnica, no permiso.

## Relaciones
**MCP Server (82)** expone herramientas; **Function Calling (28)** representa la selección estructurada; **Agent Registry (65)** descubre agentes.