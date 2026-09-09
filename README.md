# 🏛️ Patrones de Diseño para Sistemas Agénticos de IA

Biblioteca abierta de **102 patrones de diseño para sistemas de IA y agentes**, implementados en TypeScript y acompañados por una ficha editorial canónica orientada a aprendizaje, arquitectura y producción.

El proyecto combina los **23 patrones Gang of Four** con patrones modernos de agentes, RAG, razonamiento, multiagente, seguridad, evaluación, resiliencia, FinOps, interoperabilidad, privacidad y experiencia de usuario.

> Estado editorial: **102/102 implementaciones · 102/102 fichas canónicas**.

## 🌐 Web

La versión navegable del catálogo se publica con Astro y GitHub Pages:

**https://rubences.github.io/patrones_dise-o_ia/**

La web es la superficie principal de lectura. Cada ficha canónica vive en `content/patterns/` y documenta propósito, aplicabilidad, relaciones, limitaciones de la implementación actual y consideraciones de producción.

## 📚 Qué contiene el repositorio

- `src/` — 102 implementaciones ejecutables en TypeScript.
- `content/patterns/` — 102 capítulos/fichas canónicas para libro y web.
- `catalog/patterns.json` — catálogo maestro y taxonomía de cada patrón.
- `catalog/taxonomy.json` — familias editoriales y grupos históricos.
- `web/` — sitio Astro generado desde el contenido canónico.
- `scripts/validate-editorial.mjs` — gate de integridad entre código, catálogo y publicación.

## 🧭 Familias del catálogo

| Familia | Ejemplos |
|---|---|
| Gang of Four | Factory, Adapter, Observer, Command, State, Visitor |
| Agentic Workflows | Pipeline, Router, Tool Use, Planning, Agentic Loop, Function Calling, MCP |
| Reasoning | Chain of Thought, Tree of Thought, Self-Consistency, ReAct, Debate, Meta-Prompting |
| Knowledge & Context | RAG, Knowledge Graph, Retrieval Ranking, Long-Term Memory, Grounding, Context Compaction |
| Multi-Agent | Multi-Agent, Agent Swarm, Task Delegation, Orchestrator-Workers, Agent Registry, Blackboard |
| Reliability | Checkpointing, Circuit Breaker, Bulkhead, Retry, Rollback, Structured Output, Idempotency |
| Safety & Security | Guardrails, Prompt Injection Defense, Access Control, Code Sandboxing, PII Redaction, Tool Validation |
| Evaluation & QA | LLM-as-Judge, Red Teaming, A/B Testing, Regression Testing, Synthetic Data |
| Production & FinOps | Semantic Cache, Prompt Compression, Observability, Token Budget, Streaming, Canary Release, Cost Attribution |
| Human Experience | Persona, Human Handoff, Clarification Loop, Preference Learning, Citation Attribution |

## 🚀 Inicio rápido

Requisitos: Node.js compatible con el proyecto y, para los ejemplos que llaman a un LLM, `OPENAI_API_KEY`.

```bash
npm install
export OPENAI_API_KEY=sk-...

# Ejecutar un patrón concreto
npm run pattern:25   # RAG
npm run pattern:45   # Circuit Breaker
npm run pattern:54   # ReAct
npm run pattern:101  # Tool Call Validation Gate

# Ejecutar el catálogo completo
for i in {1..102}; do npm run pattern:$i; done
```

No todos los patrones requieren una API key: varias implementaciones de resiliencia, privacidad, coordinación y operación son deterministas o simuladas localmente.

## 🧪 Validación editorial y web

El repositorio incluye un gate que comprueba que las 102 implementaciones, los 102 registros del catálogo y las 102 fichas editoriales permanezcan alineados.

```bash
node scripts/validate-editorial.mjs

cd web
npm install
npm run build
```

Los pull requests editoriales ejecutan ambos pasos en CI antes de fusionarse a `main`.

## 📖 Cómo leer cada patrón

La ficha canónica no replica sin más el comentario del código. Distingue cuatro niveles:

1. **Patrón conceptual** — qué problema resuelve y por qué existe.
2. **Implementación del repositorio** — qué hace realmente el ejemplo TypeScript.
3. **Límites y evidencia** — qué claims no deben generalizarse sin benchmark o verificación.
4. **Producción** — controles, observabilidad, seguridad, persistencia o evaluación necesarios para un sistema real.

Esta distinción es intencional. Cifras de precisión, ahorro de tokens, coste o fiabilidad dependen del modelo, dataset, tráfico, configuración y benchmark; por ello no se presentan en el README como propiedades universales del patrón.

## 🧱 Principios editoriales

- **Código y documentación deben coincidir.** Una demo pedagógica se identifica como tal.
- **Los porcentajes requieren contexto experimental.** No se convierten en promesas generales.
- **Seguridad no es prompting.** Autorización, aislamiento, validación y auditoría se tratan como controles separados.
- **Los scores de un LLM no son verdad calibrada por defecto.** Se documentan los límites de jueces, confianza y consenso.
- **La web y el futuro libro se generan desde las fichas canónicas**, evitando mantener dos narrativas independientes.

## 🗺️ Ruta recomendada de aprendizaje

Para una primera lectura:

`1 Pipeline → 2 Router → 5 Tool Use → 6 Planning → 25 RAG → 27 Agentic Loop → 28 Function Calling → 45 Circuit Breaker → 53 Guardrails → 77 Observability → 101 Tool Call Validation`

Después puede profundizarse por familia desde la web.

## 🛠️ Estado y siguiente fase

La fase de **cobertura editorial** está completada: 102/102.

La siguiente etapa del proyecto es de **hardening técnico y evidencia**: corregir defectos descubiertos durante la auditoría, ampliar tests, sustituir simplificaciones pedagógicas por contratos más robustos donde aporte valor y añadir benchmarks reproducibles para cualquier claim cuantitativo.

El estado operativo y prioridades se mantienen en [`RESUMEN_EJECUTIVO_PLAN_ACCION.md`](RESUMEN_EJECUTIVO_PLAN_ACCION.md).

## 🤝 Contribución

Las contribuciones deberían incluir, según corresponda:

- cambios de implementación;
- tests que reproduzcan el comportamiento esperado o el bug corregido;
- actualización de la ficha canónica si cambia el comportamiento;
- evidencia o benchmark reproducible para nuevos claims cuantitativos.

Antes de abrir un PR, ejecuta el validador editorial y el build de la web.

## 📄 Licencia

MIT.
