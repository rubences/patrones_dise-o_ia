---
patternId: 82
slug: mcp-server
title: MCP Server
summary: Expone herramientas y recursos mediante un contrato de protocolo descubrible para desacoplar consumidores agénticos de implementaciones y APIs ad hoc.
family: production-finops
legacyGroup: 19
level: architecture
difficulty: advanced
maturity: emerging
llmRequired: false
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_82_mcp_server.ts
tags: [mcp, tools, protocol, interoperability]
related: [5, 28, 83]
combinesWith: [72, 77, 101]
antiPatterns:
  - Exponer tools sin autenticación, autorización y límites.
  - Confundir schema de entrada con permiso para ejecutar.
  - Publicar datos sensibles como recursos sin policy.
references: []
---
# Propósito
MCP Server convierte capacidades en tools/resources descubribles mediante Model Context Protocol, permitiendo interoperabilidad entre clientes y servidores.

## Implementación del repositorio
`src/pattern_82_mcp_server.ts` usa el SDK real de MCP, registra dos tools con Zod y conecta cliente/servidor mediante `InMemoryTransport`. El catálogo expuesto contiene solo cinco patrones de demostración.

La demo valida argumentos estructurales en el servidor, pero no implementa autenticación, scopes, rate limits o transporte de red real.

## Producción
Añade identidad, autorización por tool/resource, audit logs, límites de payload, timeouts y manejo de versiones. Separa discovery de permissioning.

## Relaciones
**Dynamic Tool Discovery (83)** descubre; **Tool Call Validation (101)** valida cada llamada; **Access Control (72)** autoriza.