# 🏛️ Patrones de Diseño para Sistemas Agénticos de IA — Biblioteca Exhaustiva

Una biblioteca de **84 patrones de diseño** implementados en TypeScript: los 23 patrones Gang of Four completos, más patrones agénticos, de ciberseguridad, QA, producción y resiliencia/interoperabilidad multi-proveedor.

```
84 patrones implementados
```

---

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Configurar API Key
export OPENAI_API_KEY=sk-...

# Ejecutar cualquier patrón
npm run pattern:25   # RAG
npm run pattern:54   # ReAct
npm run pattern:68   # Zero-Shot CoT

# Ejecutar todos
for i in {1..84}; do npm run pattern:$i; done
```

Nota: los patrones 80–84 (Rate Limiting, Model Fallback, MCP Server Exposure, Dynamic Tool Discovery, Code Sandboxing) no requieren `OPENAI_API_KEY` — su lógica es independiente del LLM y se ejecutan igual sin la variable configurada.

---

## 📊 Mapa Completo de 68 Patrones

### 🎯 GRUPO 1 — Patrones Agénticos Clásicos (1–8)
*Flujos de trabajo fundamentales para agentes IA*

| # | Patrón | Propósito |
|---|--------|----------|
| 1 | **Pipeline** | Transformación secuencial multi-etapa LLM |
| 2 | **Router** | Enrutamiento inteligente a especialistas |
| 3 | **Reflection** | Autoevaluación e iteración de mejora |
| 4 | **Evaluator-Optimizer** | Refinamiento con rúbricas explícitas |
| 5 | **Tool Use** | Invocación dinámica de herramientas |
| 6 | **Planning** | Descomposición de objetivos en subtareas |
| 7 | **Multi-Agent** | Ejecución paralela de agentes especializados |
| 8 | **Human-in-Loop** | Aprobación humana por niveles de riesgo |

### 🏭 GRUPO 2 — Patrones Creacionales GoF (9–10, 29–30)
*Creación flexible de agentes y configuraciones*

| # | Patrón | Propósito |
|---|--------|----------|
| 9 | **Factory** | Agentes especializados (Experto, Auditor...) |
| 10 | **Builder** | Construcción fluida de prompts complejos |
| 29 | **Abstract Factory** | Familias coherentes de agentes (LLM vs Rules) |
| 30 | **Prototype** | Clonación rápida de configuraciones |

### 🏗️ GRUPO 3 — Patrones Estructurales GoF (11–19, 31–32)
*Composición y acceso a sistemas complejos*

| # | Patrón | Propósito |
|---|--------|----------|
| 11 | **Adapter** | Conversión a múltiples formatos (JSON, CSV, XML...) |
| 12 | **Decorator** | Stack de capacidades transversales (retry, cache...) |
| 13 | **Strategy** | Estrategias intercambiables de prompting |
| 14 | **Chain of Responsibility** | Enrutamiento jerárquico de manejadores |
| 15 | **Singleton** | Instancias globales únicas |
| 16 | **Facade** | Interfaz simplificada de subsistemas |
| 17 | **Composite** | Composición jerárquica de tareas |
| 18 | **Observer** | Notificación reactiva de cambios |
| 19 | **State** | Máquina de estados para ciclo de vida |
| 31 | **Bridge** | Desacoplar abstracción de implementación LLM |
| 32 | **Flyweight** | Compartir objetos → **-60% tokens** |

### 🎭 GRUPO 4 — Patrones de Comportamiento GoF (20–24, 33–35)
*Comunicación y algoritmos personalizables*

| # | Patrón | Propósito |
|---|--------|----------|
| 20 | **Command** | Cola de tareas con undo/redo |
| 21 | **Proxy** | Control de acceso y rate limiting |
| 22 | **Memento** | Snapshots de estado e historial |
| 23 | **Mediator** | Hub central de comunicación |
| 24 | **Template Method** | Algoritmo personalizable en pasos |
| 33 | **Interpreter** | DSL para definir workflows agénticos |
| 34 | **Iterator** | Recorrido transparente de colecciones |
| 35 | **Visitor** | Operaciones sobre árboles de tareas |

### ⭐ GRUPO 5 — Patrones Agénticos Emergentes Core (25–28)
*Base de las aplicaciones IA modernas*

| # | Patrón | Impacto | Uso |
|---|--------|--------|-----|
| 25 | **RAG** | **80% de apps** | Recuperación + contexto específico |
| 26 | **Chain of Thought** | **+30–40% precisión** | Razonamiento paso a paso |
| 27 | **Agentic Loop** | **Autonomía real** | Plan→Act→Observe→Reflect |
| 28 | **Function Calling** | **+50% confiabilidad** | Invocación determinística |

### 🧠 GRUPO 6 — Razonamiento Avanzado (36, 42, 54, 55, 61, 62, 68)
*Técnicas de prompting y razonamiento*

| # | Patrón | Propósito |
|---|--------|----------|
| 36 | **Tree of Thought** | Explorar N ramas, elegir la mejor → +70% precisión |
| 42 | **Self-Consistency** | N ejecuciones + votación → +18–35% fiabilidad |
| 54 | **ReAct** | Thought/Act/Observe intercalado (base de LangChain) |
| 55 | **Scratchpad** | Bloc de notas interno para razonamiento |
| 61 | **Few-Shot** | Guiar con ejemplos en el prompt |
| 62 | **Constitutional AI** | Auto-crítica contra principios éticos |
| 68 | **Zero-Shot CoT** | "Piensa paso a paso" → razonamiento sin ejemplos |

### 🕸️ GRUPO 7 — Recuperación de Información (37, 41, 66)
*Patrones de retrieval y contexto*

| # | Patrón | Propósito |
|---|--------|----------|
| 37 | **Knowledge Graph** | Contexto estructurado con relaciones semánticas |
| 41 | **Retrieval with Ranking** | RAG + re-ranking → +25% precisión |
| 66 | **Contextual Compression** | Extraer sólo lo relevante → -80% tokens en RAG |

### 🧪 GRUPO 8 — Especialización y Routing (38–40)
*Activación selectiva de expertos*

| # | Patrón | Propósito |
|---|--------|----------|
| 38 | **Mixture of Experts** | Activar sólo top-K expertos eficientemente |
| 39 | **Cascade** | Escalar de modelo rápido→potente → **-80% costo** |
| 40 | **Branching** | Flujos condicionales paralelos/alternativos |

### 🛡️ GRUPO 9 — Confiabilidad y Resiliencia (43–47)
*Producción robusta*

| # | Patrón | Propósito |
|---|--------|----------|
| 43 | **Ensemble** | Múltiples estrategias → respuestas más robustas |
| 44 | **Checkpointing** | Guardar progreso para reanudar tras fallos |
| 45 | **Circuit Breaker** | Prevenir fallos en cascada con fallback |
| 46 | **Bulkhead** | Aislar recursos por componente |
| 47 | **Retry with Backoff** | Reintentos con espera exponencial + jitter |

### ⚡ GRUPO 10 — Optimización de Costos (48–49, 67)
*Reducción de tokens y latencia*

| # | Patrón | Ahorro |
|---|--------|--------|
| 48 | **Semantic Cache** | **-40–60% llamadas LLM** |
| 49 | **Prompt Compression** | **-60–80% tokens** |
| 67 | **Output Parsers** | Parseo tipado de salidas sin structured outputs |

### 🎨 GRUPO 11 — Versatilidad (50)
*Múltiples modalidades de entrada*

| # | Patrón | Propósito |
|---|--------|----------|
| 50 | **Multi-Modal** | Pipeline unificado texto + código + datos + URLs |

### 🧠 GRUPO 12 — Memoria y Contexto (51–52)
*Persistencia y verificación*

| # | Patrón | Propósito |
|---|--------|----------|
| 51 | **Long-Term Memory** | Memoria persistente entre sesiones |
| 52 | **Grounding** | Verificar claims LLM → **-60% alucinaciones** |

### 🔐 GRUPO 13 — Seguridad y Fiabilidad (53, 58–59)
*Producción segura y confiable*

| # | Patrón | Propósito |
|---|--------|----------|
| 53 | **Guardrails** | Barreras input/output: PII, contenido dañino |
| 58 | **Rollback** | Reversión transaccional multi-paso |
| 59 | **Structured Output** | Validación Zod con auto-corrección |

### 👥 GRUPO 14 — Coordinación Multi-Agente Avanzada (56–57, 60, 63, 65)
*Patrones de coordinación distribuida*

| # | Patrón | Propósito |
|---|--------|----------|
| 56 | **Agent Swarm** | Enjambre auto-organizado sin coordinador |
| 57 | **Task Delegation** | Asignación óptima por habilidad y carga |
| 60 | **Orchestrator-Workers** | Planificación adaptativa + workers especializados |
| 63 | **Debate** | Dos agentes debaten → juez veredicta |
| 65 | **Agent Registry** | Descubrimiento dinámico de agentes |

### 🎭 GRUPO 15 — Personalización y Parsing (64, 66)
*Experiencia de usuario e integración*

| # | Patrón | Propósito |
|---|--------|----------|
| 64 | **Persona** | Identidad consistente en toda la conversación |

---

## 🏗️ Estructura del Proyecto

```
src/
├── common.ts                              # Utilidades: makeClient, paso, isDirectRun
├── pattern_01–08_*.ts                     # Agénticos clásicos
├── pattern_09–10_*.ts                     # Creacionales GoF (1/2)
├── pattern_11–19_*.ts                     # Estructurales GoF
├── pattern_20–24_*.ts                     # Comportamiento GoF (1/2)
├── pattern_25–28_*.ts                     # Agénticos emergentes core ⭐
├── pattern_29–30_*.ts                     # Creacionales GoF (2/2)
├── pattern_31–32_*.ts                     # Estructurales GoF (2/2)
├── pattern_33–35_*.ts                     # Comportamiento GoF (2/2) ← GoF COMPLETO
├── pattern_36_tree_of_thought.ts          # Razonamiento avanzado
├── pattern_37_knowledge_graph.ts          # Knowledge Graph
├── pattern_38_mixture_of_experts.ts       # MoE
├── pattern_39_cascade.ts                  # Cascade
├── pattern_40_branching.ts               # Branching
├── pattern_41_retrieval_ranking.ts        # Retrieval+Ranking
├── pattern_42_self_consistency.ts         # Self-Consistency
├── pattern_43_ensemble.ts                 # Ensemble
├── pattern_44_checkpointing.ts            # Checkpointing
├── pattern_45_circuit_breaker.ts          # Circuit Breaker
├── pattern_46_bulkhead.ts                 # Bulkhead
├── pattern_47_retry_backoff.ts            # Retry with Backoff
├── pattern_48_semantic_cache.ts           # Semantic Cache
├── pattern_49_prompt_compression.ts       # Prompt Compression
├── pattern_50_multi_modal.ts              # Multi-Modal
├── pattern_51_long_term_memory.ts         # Long-Term Memory
├── pattern_52_grounding.ts               # Grounding
├── pattern_53_guardrails.ts              # Guardrails
├── pattern_54_react.ts                   # ReAct
├── pattern_55_scratchpad.ts              # Scratchpad
├── pattern_56_agent_swarm.ts             # Agent Swarm
├── pattern_57_task_delegation.ts          # Task Delegation
├── pattern_58_rollback.ts                # Rollback
├── pattern_59_structured_output.ts        # Structured Output
├── pattern_60_orchestrator_workers.ts     # Orchestrator-Workers
├── pattern_61_few_shot.ts                # Few-Shot Prompting ⭐ FASE FINAL
├── pattern_62_constitutional_ai.ts        # Constitutional AI ⭐ FASE FINAL
├── pattern_63_debate.ts                  # Debate ⭐ FASE FINAL
├── pattern_64_persona.ts                 # Persona ⭐ FASE FINAL
├── pattern_65_agent_registry.ts          # Agent Registry ⭐ FASE FINAL
├── pattern_66_contextual_compression.ts   # Contextual Compression ⭐ FASE FINAL
├── pattern_67_output_parsers.ts          # Output Parsers ⭐ FASE FINAL
└── pattern_68_zero_shot_cot.ts           # Zero-Shot CoT ⭐ FASE FINAL
```

---

## 📈 Progresión por Versiones

| Versión | Patrones | Cobertura | Fase |
|---------|----------|-----------|------|
| v1.0.0 | 1 | 1.4% | Base |
| v2.0.0 | 8 | 11.3% | Agénticos core |
| v3.0.0 | 14 | 19.7% | +Clásicos |
| v4.0.0 | 24 | 33.8% | +10 estructurales |
| v5.0.0 | 35 | 49.3% | **FASE 1** |
| v6.0.0 | 42 | 59.2% | **FASE 2** |
| v7.0.0 | 50 | 70.4% | **FASE 3** |
| v8.0.0 | 60 | 84.5% | **FASE 4** |
| v9.0.0 | 68 | 95.8% | FASE FINAL |
| v10.0.0 | 76 | — | +Ciberseguridad (69–72) y QA (73–76) |
| v11.0.0 | 79 | — | +Producción (77–79) |
| **v12.0.0** | **84** | **—** | **+Resiliencia e Interoperabilidad (80–84)** |

*Desde v10.0.0 el catálogo superó la estimación inicial de "71 patrones conocidos" usada para calcular cobertura — el % se dejó de calcular porque el propio dominio (patrones agénticos de IA) sigue expandiéndose.*

---

## 🎯 Guía de Selección Rápida

| Necesidad | Patrón |
|-----------|--------|
| **Contexto de dominio** | 25 (RAG) + 66 (Contextual Compression) |
| **Mejor razonamiento** | 26 (CoT) + 68 (Zero-Shot CoT) + 36 (ToT) |
| **Múltiples perspectivas** | 42 (Self-Consistency) + 43 (Ensemble) + 63 (Debate) |
| **Agente autónomo** | 27 (Agentic Loop) + 54 (ReAct) + 55 (Scratchpad) |
| **Bajar costos** | 32 (Flyweight) + 39 (Cascade) + 48 (Semantic Cache) + 49 (Prompt Compression) |
| **Seguridad** | 53 (Guardrails) + 52 (Grounding) + 62 (Constitutional AI) |
| **Múltiples agentes** | 7 (Multi-Agent) + 56 (Swarm) + 60 (Orchestrator) + 57 (Delegation) |
| **Confiabilidad** | 45 (Circuit Breaker) + 46 (Bulkhead) + 47 (Retry) + 44 (Checkpoint) |
| **Recuperar de fallos** | 44 (Checkpoint) + 58 (Rollback) |
| **Personalización** | 64 (Persona) + 51 (Long-Term Memory) |
| **Crear agentes dinámicamente** | 9 (Factory) + 29 (Abstract Factory) + 65 (Registry) |
| **Añadir capacidades** | 12 (Decorator) + 21 (Proxy) |

---

## 🔧 Configuración

```bash
# Variables de entorno
export OPENAI_API_KEY=sk-...
export OPENAI_MODEL=gpt-4-turbo  # opcional

# Stack técnico
# TypeScript 6.0.3 (strict, ESM)
# OpenAI SDK v6.48.0
# Zod v4.4.3
# Node.js 18+ (ESM native)
```

---

## 📚 Referencias

- **Gang of Four**: [refactoring.guru/design-patterns](https://refactoring.guru/design-patterns)
- **AIMultiple Agentic Workflows**: [aimultiple.com/agentic-workflows](https://aimultiple.com/agentic-workflows)
- **OpenAI Cookbook**: [github.com/openai/openai-cookbook](https://github.com/openai/openai-cookbook)
- **Constitutional AI**: Anthropic (2022) — Self-critique alignment
- **ReAct**: Yao et al. (2022) — Synergizing Reasoning and Acting
- **Tree of Thoughts**: Yao et al. (2023) — Deliberate Problem Solving
- **Prompt Injection Defense**: OWASP LLM Top 10 (2024) — LLM01
- **Adversarial Robustness**: Goodfellow et al. — Adversarial Examples
- **Constitutional AI**: Anthropic (2022) — CAI Framework

---

## 🔐 SECCIÓN CIBERSEGURIDAD — Patrones de Seguridad (69–72)

Proteger sistemas agénticos contra amenazas, ataques y uso indebido.

| # | Patrón | Amenaza | Técnica |
|---|--------|---------|---------|
| **69** | **Prompt Injection Defense** | Inyección, jailbreak, prompt leaking | Heurístico multicapa + LLM meta-evaluador |
| **70** | **Adversarial Robustness** | Entradas perturbadas, evasión | Suite adversarial + score de estabilidad |
| **71** | **Secret Detection & Masking** | Leaks: API keys, tokens, PII, credenciales | Regex + enmascaramiento automático |
| **72** | **Access Control for Agents** | Escalada de privilegios, acceso no autorizado | RBAC/ABAC por rol de agente |

### Stack defensivo recomendado

```
Input → [P69: Prompt Injection Defense]
      → [P72: Access Control]
      → LLM
      → [P71: Secret Masking]
      → Output

Auditoría: P70 (Adversarial) + P74 (Red Team) periódicamente
```

```bash
npm run pattern:69   # Prompt Injection Defense
npm run pattern:70   # Adversarial Robustness
npm run pattern:71   # Secret Detection & Masking
npm run pattern:72   # Access Control for Agents
```

---

## 🧪 SECCIÓN QA — Patrones de Calidad (73–76)

Garantizar, medir y mantener calidad de agentes IA en el tiempo.

| # | Patrón | Propósito | Cuándo usarlo |
|---|--------|----------|---------------|
| **73** | **LLM-as-Judge** | Evaluar respuestas con rúbricas multi-dimensionales | Monitoreo continuo en producción |
| **74** | **Red Teaming** | Probar brechas de seguridad sistemáticamente | Antes de cada release |
| **75** | **A/B Testing for Prompts** | Comparar variantes de prompts con métricas | Al cambiar system prompts |
| **76** | **Regression Testing** | Detectar degradación de calidad entre versiones | En cada PR / deploy |

### Pipeline CI/CD de calidad

```
PR abierto    → P76 Regression Tests (golden tests automáticos)
Release        → P74 Red Teaming (seguridad) + P73 LLM-Judge (calidad)
Prod monitor   → P73 LLM-as-Judge continuo
Cambio prompt  → P75 A/B Testing
```

```bash
npm run pattern:73   # LLM-as-Judge
npm run pattern:74   # Red Teaming
npm run pattern:75   # A/B Testing for Prompts
npm run pattern:76   # Regression Testing
```

---

## 🏭 SECCIÓN PRODUCCIÓN — Patrones de Infraestructura (77–79)

Instrumentar y operar agentes IA de forma profesional en entornos reales.

| # | Patrón | Propósito | Beneficio |
|---|--------|----------|-----------|
| **77** | **Observability & Tracing** | Trazar cada paso del agente con spans anidados | Visibilidad completa del flujo en producción |
| **78** | **Token Budget** | Presupuesto de tokens por sesión con degradación elegante | Control de costos en tiempo real |
| **79** | **Streaming** | Entrega de tokens en tiempo real con pipeline configurable | Latencia percibida ~0ms, interrupción temprana |

```bash
npm run pattern:77   # Observability & Tracing
npm run pattern:78   # Token Budget
npm run pattern:79   # Streaming
```

### Stack de producción completo

```typescript
// Composición de patrones para producción robusta
import {
  AgenteInstrumentado,    // P77: Trazar todo
  AgenteConBudget,        // P78: Controlar costos
  AgenteConStreaming,     // P79: Respuesta en tiempo real
  AgenteSeguro,           // P69: Bloquear inyecciones
  AgenteConCacheSemantica, // P48: Cache semántica (-60% llamadas)
  CircuitBreaker,         // P45: Evitar fallos en cascada
  RetryWithBackoff,       // P47: Recuperar fallos transitorios
} from 'patrones-agentes-ia'
```

---

## 🔀 SECCIÓN RESILIENCIA E INTEROPERABILIDAD — Patrones 80–84

Sobrevivir a la caída de un proveedor concreto y exponer/descubrir herramientas mediante un protocolo estándar en vez de contratos ad-hoc. Ninguno de estos 5 patrones requiere `OPENAI_API_KEY` para ejecutarse — su lógica central es independiente del LLM.

| # | Patrón | Propósito | Diferencia con patrones existentes |
|---|--------|----------|--------------------------------------|
| **80** | **Rate Limiting** | Token bucket real con recarga continua por tiempo transcurrido, aislado por clave (usuario/API key/IP) | El Patrón 21 (Proxy) solo tiene un contador fijo sin recarga temporal real |
| **81** | **Model Fallback / Multi-Provider Redundancy** | Conmuta a un proveedor alternativo cuando el actual falla o está rate-limited | El Patrón 39 (Cascade) escala por coste/confianza dentro del MISMO proveedor, no por fallo |
| **82** | **MCP Server Exposure** | Expone herramientas como servidor Model Context Protocol estándar (`@modelcontextprotocol/sdk`) | Ningún patrón previo trata la exposición de tools como un contrato de protocolo versionado |
| **83** | **Dynamic Tool Discovery** | El agente descubre tools vía `tools/list` en runtime y construye el schema de function-calling dinámicamente | El Patrón 65 (Agent Registry) descubre AGENTES en memoria, no tools de un servidor de protocolo |
| **84** | **Code Execution Sandboxing** | Aísla código generado por el agente en un contexto `node:vm` con timeout y sin acceso a `require`/`process`/red | Ningún patrón de seguridad (69–72) cubría ejecución aislada de código |

```bash
npm run pattern:80   # Rate Limiting
npm run pattern:81   # Model Fallback
npm run pattern:82   # MCP Server Exposure
npm run pattern:83   # Dynamic Tool Discovery
npm run pattern:84   # Code Execution Sandboxing
```

Los patrones 82 y 83 se componen entre sí: 83 importa `crearServidorPatrones` de 82 y lo consume como cliente, en vez de duplicar la definición de herramientas — así se demuestra un round-trip MCP real (servidor + cliente en memoria, sin subprocess/stdio) en vez de una simulación.

---

## 📦 Uso como Librería npm

### Importación directa (tree-shakeable)

```typescript
import { SistemaRAG } from './src/index.js'
import { DefensorPromptInjection } from './src/index.js'
import { JuezLLM, RUBRICA_ESTANDAR } from './src/index.js'
```

### Importación por categoría semántica

```typescript
// Sólo patrones de seguridad
import { seguridad } from './src/index.js'

// Sólo QA
import { qa } from './src/index.js'

// Sólo producción
import { produccion } from './src/index.js'
```

### Ejemplo de combinación de patrones

```typescript
import { SistemaRAG, JuezLLM, DefensorPromptInjection } from './src/index.js'
import { makeClient } from './src/index.js'

const client = makeClient()
const rag    = new SistemaRAG(client)
const juez   = new JuezLLM(client)
const defensor = new DefensorPromptInjection(client)

async function procesarSolicitud(consulta: string) {
  // 1. Verificar seguridad
  const analisis = await defensor.analizar(consulta)
  if (analisis.bloqueado) return { error: analisis.razon }

  // 2. RAG para respuesta fundamentada
  const { respuesta } = await rag.responderConRAG(consulta)

  // 3. Evaluar calidad automáticamente
  const { scorePonderado, veredicto } = await juez.juzgar(consulta, respuesta)

  return { respuesta, calidad: { score: scorePonderado, veredicto } }
}
```

---

## 📝 Licencia

MIT — Libre para uso comercial y personal

## 👤 Autor

**rubences** — [github.com/rubences](https://github.com/rubences)

---

*v11.0.0 — 79 Patrones — Observabilidad, Token Budget, Streaming + src/index.ts ✅*
