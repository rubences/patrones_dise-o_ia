# Investigación P8 — Interoperabilidad y seguridad de agentes (20-11-2026)

**Estado:** investigación y propuesta editorial; NO constituye evidencia incorporada al baseline P7.0. **Rama de publicación:** main. **Catálogo vigente:** 122 patrones / 14 familias. No se asignan IDs ni se alteran los gates hasta completar fichas, implementaciones y validación integral.

## Hallazgo principal

El catálogo cubre tool use, multi-agent, seguridad y gobernanza, pero no identifica de manera independiente los contratos de interoperabilidad MCP y A2A. Es necesario distinguir **protocolo** (especificación de intercambio) de **patrón** (solución arquitectónica reutilizable). No todo elemento de una especificación merece un ID nuevo.

## Fuentes primarias oficiales

1. MCP, especificación 2026-07-28 y changelog: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/changelog.mdx
2. MCP, descripción de capas: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/basic/index.mdx
3. MCP, elicitation: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/client/elicitation.mdx
4. A2A, especificación (atención: URL dev, fijar versión estable antes de un release): https://a2aproject.github.io/A2A/dev/specification/
5. Google Developers, colaboración entre agentes ADK/A2A: https://developers.googleblog.com/build-cross-language-multi-agent-team-with-google-adk-and-a2a/

**Compatibilidad:** la versión MCP 2026-07-28 elimina el handshake initialize y las sesiones de transporte de nivel protocolo; usa metadatos por solicitud, admite interacciones de múltiples viajes (MRTR), routing por cabeceras y resultados cacheables. La implementación debe negociar explícitamente versiones y no mezclar silenciosamente contratos de revisiones anteriores. Los servicios pueden seguir manteniendo estado de aplicación mediante identificadores explícitos.

## Evidencia científica (no extrapolar resultados)

- Huang et al. (2026), *Model Context Protocol Threat Modeling and Analysis of Vulnerabilities to Prompt Injection with Tool Poisoning*, Journal of Cybersecurity and Privacy, DOI: https://doi.org/10.3390/jcp6030084 — STRIDE/DREAD y evaluación de clientes; alcance limitado a clientes y escenarios ensayados.
- Park et al. (2026), *Beyond Tool Poisoning: Attack Surfaces of Malicious Remote MCP Servers Across LLM Platforms*, Electronics, DOI y artículo: https://www.mdpi.com/2079-9292/15/10/2214 — superficie de servidores remotos maliciosos; no generalizar tasas de ataque.
- Nouman et al. (2026), *Argument-Aware Runtime Least-Privilege Enforcement Against Tool-Poisoning-Induced Actions in MCP-Based Agentic Systems*, Future Internet, https://www.mdpi.com/1999-5903/18/11/606 — control de capacidades basado en argumentos, validado en un conjunto limitado de llamadas.
- *Confused Deputy Attack Against Model Context Protocol*, https://doi.org/10.1145/3830467 — secuestro de selección de herramientas mediante metadatos; no extrapolar porcentajes a otros hosts/modelos.
- *A systematic mapping study of AI agent–Tool communication: protocols, security, and orchestration*, https://www.sciencedirect.com/science/article/pii/S2667305326001079 — revisión comparativa de MCP, A2A, ACP, ANP y marcos de orquestación.

## Medium — señales industriales secundarias

- Rost Glukhov (25-06-2026), *A2A vs MCP: Do AI Agents Really Need Both Protocols?*, https://medium.com/practical-llm-systems/a2a-vs-mcp-do-ai-agents-really-need-both-protocols-b0b12e919d0e
- *MCP, A2A, UCP, AP2… Confused? A Simple Map of AI Agent Protocols* (noviembre 2026), https://profdrmafya.medium.com/mcp-a2a-ucp-ap2-confused-a-simple-map-of-ai-agent-protocols-dd6811b6771c

Los artículos de Medium orientan ejemplos y casos de uso, pero **no** aumentan el contador de evidencia primaria.

## Candidatos a nuevas fichas (IDs pendientes de asignación)

| Candidato | Problema / solución | Contratos verificables |
|---|---|---|
| MCP Capability Adapter | Integrar tools/resources/prompts sin acoplar agentes a SDK | esquema, versión, tipado, errores |
| MCP Gateway & Policy Enforcement | Mediar múltiples servidores y aplicar autorización | allowlist, identidad, scopes, auditoría |
| MCP Tool Discovery & Trust Registry | Descubrir herramientas sin confiar ciegamente en metadatos | firma/procedencia, revisión, pinning, caducidad |
| MCP Stateful Workflow Handle | Mantener estado de negocio sobre núcleo sin sesiones | handle explícito, TTL, propietario, revocación |
| MCP Elicitation & Human Approval | Solicitar datos/aprobaciones sin exponer credenciales | separación form/url, consentimiento, trazas |
| MCP Sampling Boundary | Delegar inferencia con control del host | límites de contexto, costes y autorización |
| A2A Agent Discovery & Card Validation | Descubrir agentes autónomos interoperables | identidad, capabilities, endpoints, confianza |
| A2A Task Lifecycle & Delegation | Delegar trabajo asíncrono y recuperar artefactos | idempotencia, estados, cancelación, reintentos |
| MCP–A2A Bridge | Conectar herramientas y agentes sin confundir confianza | traducción de identidad, scopes, errores |
| Tool Poisoning Defense | Rechazar instrucciones maliciosas en metadatos/resultados | análisis estático, políticas de acciones, pruebas adversarias |
| Argument-Aware Least Privilege | Decidir sobre herramienta **y argumentos** | clasificación de efectos, denegación por defecto |
| Agent Protocol Observability | Correlacionar invocaciones y tareas entre protocolos | trace IDs, costes, causalidad, redacción de secretos |

## Diseño de laboratorio transversal

- Implementar host MCP de prueba, servidor de herramientas de solo lectura, servidor de escritura simulada y dos agentes A2A con tareas largas.
- Probar descubrimiento, invocación, negociación de versiones, reintentos, cancelación, estados, consentimiento, aislamiento entre usuarios y propagación de trazas.
- Inyectar metadatos maliciosos, parámetros peligrosos, respuestas contaminadas, endpoints falsos, tokens fuera de alcance y herramientas con nombres solapados.
- Comparar autorización por nombre de herramienta frente a autorización por argumentos y efecto real.
- Registrar matriz de versiones, conjunto de pruebas, semilla, dataset, falsos positivos/negativos, latencia p50/p95, coste, éxito de ataques y porcentaje de trazas completas.
- Mantener los resultados como **pendientes** hasta ejecutar pruebas reproducibles; ninguna mejora cuantitativa se presupone.

## Política editorial de integración

1. Verificar si cada candidato ya está cubierto por IDs existentes (5, 7, 28, 60, 72, 73, 74, 77, 98, 103–104) y ampliar antes de duplicar.
2. Fijar versión de especificaciones y fuente primaria con scopeNote; distinguir documentación oficial de evidencia empírica.
3. Para cada nuevo ID: ficha canónica, TypeScript, export, script de ejecución, test, taxonomía, evidencia y compatibilidad web/libros.
4. Ejecutar validadores de consistencia, evidencia, publicaciones, libro y CI antes de subir el baseline P7.0 o declarar release.
5. Evitar afirmaciones de conformidad MCP/A2A sin pruebas de interoperabilidad con versiones y SDK concretos.

**Prioridad recomendada:** MCP Gateway/Policy, Tool Discovery/Trust, A2A Task Lifecycle, MCP–A2A Bridge y Tool Poisoning Defense.
