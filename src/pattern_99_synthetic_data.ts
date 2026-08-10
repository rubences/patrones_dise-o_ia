/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 99 — SYNTHETIC DATA GENERATION (GENERACIÓN DE DATOS SINTÉTICOS)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Plantilla por categoría]
 *  "Mi {producto} no {problema} desde {tiempo}"
 *  variables: producto=[laptop, router, impresora], problema=[enciende, conecta, imprime], tiempo=[ayer, esta mañana, la semana pasada]
 *       │
 *       ▼
 *  [Expansión combinatoria + muestreo]
 *       │
 *       ▼
 *  "Mi router no conecta desde ayer" (categoria: soporte_tecnico)
 *  "Mi impresora no imprime desde la semana pasada" (categoria: soporte_tecnico)
 *  ... N casos ...
 *       │
 *       ▼
 *  [Alimenta a Regression Testing (76) o Red Teaming (74)]
 *
 *  Idea: generar automáticamente casos de prueba o entrenamiento a
 *  partir de plantillas parametrizadas, en vez de escribirlos a mano
 *  uno por uno. Útil para poblar un dataset golden inicial, ampliar
 *  cobertura de categorías poco representadas, o generar variaciones
 *  de un ataque conocido.
 *
 *  Diferencia vs Patrón 76 (Regression Testing): Regression Testing
 *  CONSUME un dataset golden ya existente para detectar degradación
 *  entre versiones. Este patrón GENERA ese dataset (o lo amplía) —
 *  son etapas distintas del mismo pipeline: generar → luego, con el
 *  tiempo, usar como regresión.
 *
 *  Diferencia vs Patrón 74 (Red Teaming): Red Teaming ejecuta un
 *  catálogo FIJO de ataques conocidos contra un agente. Este patrón
 *  puede generar VARIACIONES paramétricas de esos ataques a escala
 *  (mismo intento, distinta redacción) para ampliar cobertura sin
 *  escribir cada variante a mano.
 *
 *  Ventajas:
 *  - Cobertura de categorías a un coste marginal casi nulo
 *  - Reproducible con semilla fija (mismos casos, mismo orden)
 *  - Escala mucho más rápido que la autoría manual de casos
 *  - Etiqueta de categoría/ground-truth ya viene incluida por diseño
 */

import { isDirectRun, paso } from "./common.js";

export interface PlantillaCaso {
  categoria: string;
  plantilla: string; // usa {variable} como placeholder
  variables: Record<string, string[]>;
}

export interface CasoSintetico {
  id: string;
  input: string;
  categoria: string;
}

// Generador determinista con semilla simple (LCG) — mismos parámetros,
// mismos casos, para que el dataset generado sea reproducible.
function crearGeneradorPseudoaleatorio(semilla: number): () => number {
  let estado = semilla;
  return () => {
    estado = (estado * 1103515245 + 12345) & 0x7fffffff;
    return estado / 0x7fffffff;
  };
}

export class GeneradorDatosSinteticos {
  constructor(private plantillas: PlantillaCaso[]) {}

  generar(cantidadPorCategoria: number, semilla: number = 42): CasoSintetico[] {
    const azar = crearGeneradorPseudoaleatorio(semilla);
    const casos: CasoSintetico[] = [];

    for (const plantilla of this.plantillas) {
      for (let i = 0; i < cantidadPorCategoria; i++) {
        let texto = plantilla.plantilla;
        for (const [variable, opciones] of Object.entries(plantilla.variables)) {
          const eleccion = opciones[Math.floor(azar() * opciones.length)];
          texto = texto.replace(`{${variable}}`, eleccion);
        }
        casos.push({ id: `${plantilla.categoria}-${i + 1}`, input: texto, categoria: plantilla.categoria });
      }
    }

    return casos;
  }
}

export async function demostrarSyntheticDataGeneration(): Promise<void> {
  paso("🧬", "Demostrando Synthetic Data Generation Pattern");
  console.log(
    "   Nota: en esta demo las variables se combinan literalmente. En producción,\n" +
      "   un LLM parafrasearía cada caso generado para variar la redacción\n" +
      "   manteniendo la categoría y el ground truth intactos.",
  );

  const plantillas: PlantillaCaso[] = [
    {
      categoria: "soporte_tecnico",
      plantilla: "Mi {producto} no {problema} desde {tiempo}",
      variables: {
        producto: ["laptop", "router", "impresora"],
        problema: ["enciende", "conecta a internet", "imprime"],
        tiempo: ["ayer", "esta mañana", "la semana pasada"],
      },
    },
    {
      categoria: "facturacion",
      plantilla: "Se me cobró {cantidad} de más en la factura de {mes}",
      variables: {
        cantidad: ["10€", "25€", "50€"],
        mes: ["enero", "marzo", "julio"],
      },
    },
  ];

  const generador = new GeneradorDatosSinteticos(plantillas);

  paso("1️⃣", "Generar 3 casos por categoría, reproducible con semilla=42");
  const casos = generador.generar(3, 42);
  casos.forEach((c) => console.log(`   [${c.id}] (${c.categoria}) "${c.input}"`));

  paso("2️⃣", "Misma semilla → mismos casos (reproducibilidad)");
  const casosRepetidos = generador.generar(3, 42);
  const sonIdenticos = JSON.stringify(casos) === JSON.stringify(casosRepetidos);
  console.log(`   Casos idénticos con la misma semilla: ${sonIdenticos}`);

  paso("3️⃣", "Semilla distinta → variación distinta, misma cobertura de categorías");
  const casosOtraSemilla = generador.generar(2, 7);
  console.log(`   Total generado: ${casosOtraSemilla.length} (2 por categoría × ${plantillas.length} categorías)`);

  paso("✅", "Synthetic Data Generation poblando datasets a escala sin autoría manual caso a caso");
}

async function main(): Promise<void> {
  await demostrarSyntheticDataGeneration();
}

if (isDirectRun(import.meta.url)) {
  main().catch((e: unknown) => {
    console.error(e);
    process.exitCode = 1;
  });
}
