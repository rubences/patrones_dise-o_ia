# 🤖 Cuatro Patrones de Diseño para Agentes IA

Una colección de patrones de diseño prácticos y educativos para construir agentes inteligentes robustos con **OpenAI**, TypeScript y un toque de reflexión sistemática.

## 📚 Tabla de Contenidos

- [Patrones](#patrones)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura](#estructura)
- [Conceptos Clave](#conceptos-clave)
- [Casos de Uso](#casos-de-uso)
- [Referencia](#referencia)

## 🎯 Patrones

### Pattern 1: PIPELINE — Cadena de Montaje
**Concepto:** Divide un trabajo complejo en pasos **secuenciales**, donde cada paso recibe la salida del anterior.

```
tema → [esquema] → [borrador] → [título]
```

**Características:**
- Uso de Structured Outputs (Zod validation)
- Prompts especializados en cada paso
- Salida anterior = entrada siguiente

**Caso de uso:** Escribir un blog post en tres pasos.
- Paso 1: Generar esquema de 3 puntos clave (Zod + Structured Outputs)
- Paso 2: Escribir borrador basado en esquema
- Paso 3: Inventar título basado en borrador

**Archivo:** `src/pattern_1_pipeline.ts`

**Ventajas:**
- Divide problemas complejos en subproblemas más manejables
- Cada paso puede ser optimizado independientemente
- Control fino sobre outputs intermedios

---

### Pattern 2: ROUTER — Centralita Telefónica  
**Concepto:** Una primera llamada **CLASIFICA** el mensaje, luego se activa **UN único especialista**.

```
mensaje → [router] → {facturación | técnico | devoluciones | humano}
```

**Características:**
- Clasificación con medida de confianza (0-1)
- Derivación a humano si confianza baja
- Especialización por departamento

**Caso de uso:** Soporte al cliente en una tienda online.
- Paso 1: Clasificar mensaje y medir confianza
- Paso 2: Si confianza < 0.7 → derivar a humano
- Paso 3: Si confianza suficiente → responder con especialista

**Archivo:** `src/pattern_2_router.ts`

**Ventajas:**
- Especialización: cada equipo usa instrucciones óptimas
- Ahorro de tokens: se activa solo un especialista
- Seguridad: duda → humano, no alucinaciones

---

### Pattern 3: REFLECTION — Auto-revisión y Mejora
**Concepto:** El modelo genera una respuesta, luego **reflexiona críticamente** sobre ella y la mejora.

```
pregunta → [v1] → [crítica] → [v2]
```

**Características:**
- Multi-turn: el modelo se evalúa a sí mismo
- Metacognición: pensar sobre el propio pensamiento
- Mejora iterativa sin costo exponencial

**Caso de uso:** Responder preguntas técnicas complejas con auto-revisión.
- Paso 1: Generar respuesta inicial
- Paso 2: Reflexionar críticamente (¿claridad? ¿corrección? ¿completitud?)
- Paso 3: Mejorar basado en reflexión

**Archivo:** `src/pattern_3_reflection.ts`

**Ventajas:**
- Mejora significativa de calidad
- Detecta y corrige errores propios
- Computable: puede iterar hasta converger

---

### Pattern 4: EVALUATOR-OPTIMIZER — Escritor y Crítico
**Concepto:** El modelo genera un borrador, luego **se evalúa a sí mismo** usando una rúbrica y revisa iterativamente.

```
                  ┌─────────────────────┐
                  ▼                     │
   borrador ──▶ 🧐 crítico ──▶ ✍️ reescribir
                  │
                  └─▶ ✅ aprobado o ⛔ límite de rondas
```

**Características:**
- Dos roles del mismo modelo: escritor y crítico
- Rúbrica concreta (puntuaciones)
- Control de coste: límite de rondas

**Caso de uso:** Pulir descripción de productos o documentación.
- Paso 1: Generar borrador
- Paso 2: Evaluar con rúbrica (claridad, corrección, completitud)
- Paso 3: Revisar solo los problemas identificados
- Se repite hasta aprobación o límite de iteraciones

**Archivo:** `src/pattern_4_evaluator_optimizer.ts`

**Ventajas:**
- Calidad final muy alta
- Feedback concreto (no vago)
- Control de coste: máximo N rondas
- Explainable: se ve cada mejora

---

## 🚀 Instalación

### Requisitos
- **Node.js** 18+
- **TypeScript** 6+
- **API key de OpenAI** (variable de entorno `OPENAI_API_KEY`)

### Setup

```bash
# 1. Clonar el repositorio
git clone https://github.com/rubences/patrones_dise-o_ia.git
cd patrones_dise-o_ia

# 2. Instalar dependencias
npm install

# 3. Configurar API key
export OPENAI_API_KEY="sk-..."  # Linux/Mac
# O en Windows PowerShell:
$env:OPENAI_API_KEY = "sk-..."
```

### Verificar instalación

```bash
npm run pattern:1 --help
```

---

## 📖 Uso

### Ejecutar un patrón completo

```bash
# Patrón 1: Pipeline
npm run pattern:1

# Patrón 2: Router  
npm run pattern:2

# Patrón 3: Reflection
npm run pattern:3

# Patrón 4: Evaluator-Optimizer
npm run pattern:4
```

### Con Node.js directo

```bash
node --loader ts-node/esm src/pattern_1_pipeline.ts
```

### En tu código

```typescript
import { escribirPost } from "./src/pattern_1_pipeline.js";

const post = await escribirPost("mi tema interesante");
console.log(`# ${post.titulo}\n\n${post.borrador}`);
```

---

## 📁 Estructura

```
.
├── src/
│   ├── common.ts                    # Utilidades: makeClient, paso, isDirectRun
│   ├── pattern_1_pipeline.ts        # Patrón 1: Pipeline
│   ├── pattern_2_router.ts          # Patrón 2: Router
│   ├── pattern_3_reflection.ts      # Patrón 3: Reflection
│   └── pattern_4_evaluator_optimizer.ts # Patrón 4: Evaluator-Optimizer
├── package.json                     # Dependencias y scripts
├── tsconfig.json                    # Configuración TypeScript
├── README.md                        # Este archivo
└── .git/                            # Control de versiones
```

---

## 💡 Conceptos Clave

### Structured Outputs (Zod)
Obliga al modelo a devolver JSON válido según esquema:

```typescript
const respuesta = await client.responses.parse({
  text: { format: zodTextFormat(MiSchema, "nombre") },
});
```

### Fan-out / Fan-in
- **Fan-out:** Lanzar múltiples llamadas en paralelo (`Promise.all`)
- **Fan-in:** Reunir resultados y procesarlos

### Prompts Especializados
Cada especialista recibe instrucciones óptimas para su dominio:

```typescript
export const DEPARTAMENTOS = {
  facturacion: "Eres del equipo de facturación...",
  tecnico: "Eres soporte técnico...",
  // ...
};
```

### Reasoning y Effort Levels
El modelo razona antes de responder:

```typescript
reasoning: { effort: "low" }  // "low" o "medium"
```

---

## 🎯 Casos de Uso en Producción

| Patrón | Caso Real |
|--------|-----------|
| **Pipeline** | Generación de contenido (blogs, emails, reportes) |
| **Router** | Soporte técnico, clasificación de tickets |
| **Reflection** | Mejora iterativa de respuestas, QA automático |
| **Evaluator-Optimizer** | Documentación, descripciones de productos, copywriting |

---

## 📚 Ruta de Aprendizaje Recomendada

1. **Pipeline** — Empiezas aquí, es el más simple
2. **Router** — Agregar lógica condicional y especialización
3. **Reflection** — Entender auto-evaluación y metacognición
4. **Evaluator-Optimizer** — Masterizar refinamiento iterativo

Cada patrón es **independiente**. Puedes usarlos solo o combinarlos.

---

## 🔐 Seguridad

✅ **Lo correcto:**
- Usar variables de entorno para API keys
- Validar todas las salidas con Zod
- Implementar timeouts en llamadas a API
- Loguear pasos importantes

❌ **Lo incorrecto:**
- Incluir API keys en el código
- Asumir que el modelo siempre devuelve formato correcto
- Llamadas síncronas bloqueantes

---

## 🐛 Troubleshooting

### Error: `OPENAI_API_KEY not found`

```bash
# Linux/Mac
export OPENAI_API_KEY="sk-..."

# Windows PowerShell
$env:OPENAI_API_KEY = "sk-..."
```

### Error: `Cannot find module 'ts-node'`

```bash
npm install --save-dev ts-node tsx
```

### Error: ESM import issues

Asegúrate de:
- `"type": "module"` en `package.json`
- Usar extensión `.js` en imports: `from "./file.js"`

### Error: Timeout en OpenAI

Aumenta el timeout en llamadas o implementa retry logic.

---

## 📡 Tecnologías

| Tech | Versión | Uso |
|------|---------|-----|
| OpenAI SDK | ^6.48.0 | Llamadas a GPT con reasoning |
| TypeScript | ^6.0.3 | Type safety |
| Zod | ^4.4.3 | Validación y structured outputs |
| Node.js | >=14.17 | Runtime |

---

## 🤝 Contribuciones

¿Ideas de mejoras o nuevos patrones?

1. Fork el repositorio
2. Crea rama: `git checkout -b feature/nuevo-patron`
3. Commit: `git commit -am 'Agrega patrón X'`
4. Push: `git push origin feature/nuevo-patron`
5. Pull Request

---

## 📝 Licencia

MIT - Libre de usar, modificar y distribuir.

---

## 👤 Autor

**rubences** — Patrones de IA con OpenAI

---

## 📚 Referencias

- [OpenAI API Docs](https://platform.openai.com/docs)
- [Zod Docs](https://zod.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)

---

**Última actualización:** Agosto 2026  
**Versión:** 1.0.0  
**Estado:** ✅ Completo y listo para producción
