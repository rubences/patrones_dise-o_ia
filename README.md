# 🤖 Ocho Patrones de Diseño para Agentes IA Agénticos

Una colección completa y profesional de patrones de diseño para construir **flujos de trabajo agénticos** robustos con OpenAI, TypeScript y arquitecturas multiagente.

## 📚 Tabla de Contenidos

- [¿Qué son los Flujos Agénticos?](#qué-son-los-flujos-agénticos)
- [Los 8 Patrones](#los-8-patrones)
- [Comparativa de Patrones](#comparativa)
- [Instalación](#instalación)
- [Uso](#uso)
- [Orquestación Multiagente](#orquestación-multiagente)
- [Referencia](#referencia)

---

## ¿Qué son los Flujos Agénticos?

Un **flujo de trabajo agéntico** es un proceso impulsado por IA donde agentes autónomos toman decisiones, realizan acciones y coordinan tareas con **intervención humana mínima**. A diferencia de la automatización tradicional (RPA), estos flujos son **dinámicos y flexibles**, adaptándose a datos en tiempo real y condiciones inesperadas.

### Diferencias Clave

| Tipo | Características | Ejemplo |
|------|---|---|
| **Automatización Tradicional** | Reglas fijas, sin toma de decisiones | Bot RPA que completa formularios |
| **IA No-Agéntica** | LLM genera salidas, rutas predefinidas | Chatbot con flujo fijo |
| **Agéntica** | Razonamiento, planificación, uso de herramientas, coordinación | Agente que autonomiza workflows complejos |

---

## Los 8 Patrones

### **Nivel 1: Patrones Fundamentales**

#### **Pattern 1: PIPELINE — Cadena de Montaje** 
```
tema → [esquema] → [borrador] → [título]
```
- **Caso de uso:** Generación de contenido (blogs, emails, reportes)
- **Ventaja:** Divide problemas complejos en subproblemas manejables
- **Ejecución:** `npm run pattern:1`

#### **Pattern 2: ROUTER — Centralita Telefónica**
```
mensaje → [clasificar] → [especialista] o [humano]
```
- **Caso de uso:** Soporte técnico, clasificación de tickets
- **Ventaja:** Especialización, ahorro de tokens, derivación a humano si hay duda
- **Ejecución:** `npm run pattern:2`

#### **Pattern 3: REFLECTION — Auto-Revisión**
```
pregunta → [v1] → [reflexión crítica] → [v2 mejorada]
```
- **Caso de uso:** QA automático, mejora iterativa
- **Ventaja:** Metacognición, detección y corrección de errores propios
- **Ejecución:** `npm run pattern:3`

#### **Pattern 4: EVALUATOR-OPTIMIZER — Escritor y Crítico**
```
borrador → [evalúa] → [mejora] → [aprueba o itera]
```
- **Caso de uso:** Documentación, copywriting, descripciones
- **Ventaja:** Calidad final muy alta, feedback concreto
- **Ejecución:** `npm run pattern:4`

---

### **Nivel 2: Patrones Agénticos Avanzados**

#### **Pattern 5: TOOL-USE — Uso de Herramientas**
```
pregunta → [LLM decide] → [invoca APIs/búsqueda/BD] → [integra resultado] → respuesta
```
- **Caso de uso:** Consultas con datos en tiempo real, acceso a sistemas externos
- **Ventaja:** Información actual, acceso a recursos especializados
- **Ejemplo:** "¿Cuál es el precio del Bitcoin?" → busca web → integra precio actual
- **Ejecución:** `npm run pattern:5`

#### **Pattern 6: PLANNING — Planificación Adaptativa**
```
objetivo → [descompone en subtareas] → [evalúa] → [refina plan]
```
- **Caso de uso:** Desarrollo de software, proyectos complejos, investigación
- **Ventaja:** Descomposición dinámica, replanificación automática
- **Ejemplo:** "Crear API REST" → análisis → diseño → implementación → testing
- **Ejecución:** `npm run pattern:6`

#### **Pattern 7: MULTI-AGENT — Orquestación Multiagente**
```
tarea → [agentes en paralelo] → [orquestador sintetiza]
```
- **Caso de uso:** Análisis multidisciplinario, desarrollo en equipo
- **Ventaja:** Especialización, perspectivas diversas, velocidad
- **Ejemplo:** Evaluar migración a microservicios (tech, finanzas, operaciones, seguridad)
- **Ejecución:** `npm run pattern:7`

#### **Pattern 8: HUMAN-IN-THE-LOOP (HITL) — Supervisión Humana**
```
propuesta IA → [¿requiere aprobación?] → humano {aprueba|rechaza|solicita cambios}
```
- **Caso de uso:** Transacciones financieras, cambios críticos, decisiones médicas
- **Ventaja:** Garantiza precisión y seguridad, trazabilidad
- **Ejemplo:** Transferencia de $50k → evalúa riesgo → pide aprobación humana
- **Ejecución:** `npm run pattern:8`

---

## Comparativa

| Patrón | Complejidad | Velocidad | Precisión | Mejor Para |
|--------|---|---|---|---|
| Pipeline | ⭐ | ⭐⭐⭐ | ⭐⭐⭐ | Tareas lineales |
| Router | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ | Clasificación/enrutamiento |
| Reflection | ⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | Control de calidad |
| Evaluator-Optimizer | ⭐⭐⭐ | ⭐ | ⭐⭐⭐⭐⭐ | Contenido de alto valor |
| Tool-Use | ⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | Datos en tiempo real |
| Planning | ⭐⭐⭐ | ⭐ | ⭐⭐⭐⭐ | Proyectos complejos |
| Multi-Agent | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | Análisis multifacético |
| HITL | ⭐⭐⭐ | ⭐ | ⭐⭐⭐⭐⭐ | Decisiones críticas |

---

## 🚀 Instalación

### Requisitos
- Node.js 18+
- TypeScript 6+
- API key de OpenAI (variable de entorno `OPENAI_API_KEY`)

### Setup

```bash
# Clonar el repositorio
git clone https://github.com/rubences/patrones_dise-o_ia.git
cd patrones_dise-o_ia

# Instalar dependencias
npm install

# Configurar API key
export OPENAI_API_KEY="sk-..."  # Linux/Mac
$env:OPENAI_API_KEY = "sk-..."  # Windows PowerShell
```

---

## 📖 Uso

### Ejecutar un patrón

```bash
# Patrones fundamentales
npm run pattern:1  # Pipeline
npm run pattern:2  # Router
npm run pattern:3  # Reflection
npm run pattern:4  # Evaluator-Optimizer

# Patrones agénticos avanzados
npm run pattern:5  # Tool-Use
npm run pattern:6  # Planning
npm run pattern:7  # Multi-Agent
npm run pattern:8  # Human-in-Loop
```

### En tu código TypeScript

```typescript
// Ejemplo: Pipeline
import { escribirPost } from "./src/pattern_1_pipeline.js";

const post = await escribirPost("Por qué los agentes IA transforman el trabajo");
console.log(`# ${post.titulo}\n\n${post.borrador}`);

// Ejemplo: Tool-Use
import { responderConHerramientas } from "./src/pattern_5_tool_use.js";

const respuesta = await responderConHerramientas(
  "¿Cuál es el precio actual del Bitcoin?"
);
console.log(respuesta.respuestaFinal);

// Ejemplo: Multi-Agent
import { procesarMultiAgent } from "./src/pattern_7_multi_agent.js";

const analisis = await procesarMultiAgent(
  "¿Deberíamos migrar a la nube?"
);
console.log(analisis.sintesis_orquestador);
```

---

## 📁 Estructura

```
.
├── src/
│   ├── common.ts                       # Utilidades compartidas
│   ├── pattern_1_pipeline.ts           # Patrón: Pipeline
│   ├── pattern_2_router.ts             # Patrón: Router
│   ├── pattern_3_reflection.ts         # Patrón: Reflection
│   ├── pattern_4_evaluator_optimizer.ts # Patrón: Evaluator-Optimizer
│   ├── pattern_5_tool_use.ts           # Patrón: Tool-Use (NUEVO)
│   ├── pattern_6_planning.ts           # Patrón: Planning (NUEVO)
│   ├── pattern_7_multi_agent.ts        # Patrón: Multi-Agent (NUEVO)
│   └── pattern_8_human_in_loop.ts      # Patrón: HITL (NUEVO)
├── package.json
├── tsconfig.json
└── README.md
```

---

## Orquestación Multiagente

Cuando los patrones individuales no son suficientes, los agentes pueden orquestarse para coordinar trabajo complejo:

### **Orquestación Secuencial**
```
Agente 1 → Agente 2 → Agente 3 → Resultado
```
- Uso: Procesamiento en fases (análisis → diseño → implementación)

### **Orquestación Simultánea**
```
         ┌─ Agente 1 ─┐
Input ──┤─ Agente 2 ├→ Agregación → Resultado
         └─ Agente 3 ─┘
```
- Uso: Análisis paralelo desde múltiples perspectivas

### **Orquestación de Entrega (Handoff)**
```
Agente 1 → {¿puedo?} → No → Agente 2 → ... → Resultado
           ↓ Sí
         Ejecuta
```
- Uso: Enrutamiento dinámico según contexto

### **Chat en Grupo (Group Chat)**
```
Agentes participan en conversación con administrador de chat
Para: lluvia de ideas, validación iterativa, debates
```

### **Orquestación Magnética**
```
Agente Manager crea y refina plan dinámicamente
Invoca otros agentes según sea necesario
Para: problemas abiertos, complejos, sin ruta predeterminada
```

---

## 💡 Conceptos Clave

### Structured Outputs
```typescript
const respuesta = await client.responses.parse({
  text: { format: zodTextFormat(MiSchema, "nombre") },
});
```
Obliga al modelo a devolver JSON válido.

### Fan-out / Fan-in
- **Fan-out:** Lanzar múltiples llamadas en paralelo
- **Fan-in:** Reunir y agregar resultados

### Reasoning y Effort Levels
```typescript
reasoning: { effort: "low" }  // "low" o "medium"
```
El modelo razona internamente antes de responder.

### Tool Use
El modelo decide dinámicamente si necesita herramientas externas.

### Planning
Descomponer objetivos grandes en subtareas lógicas.

---

## 🎯 Caso de Uso Completo

**Escenario:** Procesar una solicitud de cambio crítica en una aplicación de producción

1. **HITL:** Solicitud llega, sistema evalúa riesgo → requiere aprobación
2. **Multi-Agent:** Agentes de seguridad, operaciones y desarrollo evalúan en paralelo
3. **Planning:** Agente de operaciones crea plan de deployment
4. **Tool-Use:** Invoca APIs de monitoreo para verificar estado actual
5. **Router:** Clasifica si es escalable o requiere intervención de SRE
6. **Reflection:** Evalúa propuesta de rollback en caso de fallo
7. **Pipeline:** Genera documentación automática de cambios

**Resultado:** Sistema completamente automatizado pero con supervisión humana en puntos críticos.

---

## 🔐 Seguridad

✅ **Lo correcto:**
- Variables de entorno para API keys
- Validación con Zod
- Timeouts en llamadas
- Logging y auditoría

❌ **Lo incorrecto:**
- API keys en código
- Asumir formato correcto del modelo
- Sin límites de iteración

---

## 🐛 Troubleshooting

```bash
# Error: OPENAI_API_KEY not found
export OPENAI_API_KEY="sk-..."

# Error: Cannot find module
npm install ts-node tsx --save-dev

# Error: ESM imports
Asegúrate de "type": "module" en package.json
```

---

## 📚 Referencias

- [OpenAI API Docs](https://platform.openai.com/docs)
- [Zod Docs](https://zod.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Agentic AI Patterns](https://learn.microsoft.com/es-es/azure/architecture/ai-ml/guide/ai-agent-design-patterns)

---

**Última actualización:** Agosto 2026
**Versión:** 2.0.0
**Estado:** ✅ 8 patrones listos para producción
