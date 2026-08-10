/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 97 — PREFERENCE LEARNING (APRENDIZAJE DE PREFERENCIAS)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Interacción del usuario con la respuesta del agente]
 *  ├─ Señal explícita: 👍 / 👎
 *  ├─ Señal implícita: edita la respuesta (la acorta, cambia el tono)
 *  └─ Señal implícita: acepta sin cambios
 *       │
 *       ▼
 *  [Ajustar pesos de rasgos]  concision: +0.1, formalidad: -0.05...
 *       │
 *       ▼
 *  [Perfil de preferencias acumulado]
 *       │
 *       ▼
 *  [Próximo prompt] se ajusta con los rasgos de mayor peso
 *
 *  Idea: en vez de una identidad fija, el agente ajusta su
 *  comportamiento con el tiempo según cómo el usuario reacciona a sus
 *  respuestas — sin necesidad de que el usuario configure nada
 *  explícitamente. Las señales implícitas (el usuario editó la
 *  respuesta para acortarla) valen tanto como un 👍/👎 explícito.
 *
 *  Diferencia vs Patrón 64 (Persona): Persona aplica una identidad
 *  PREDEFINIDA y estática elegida de antemano. Preference Learning
 *  AJUSTA el comportamiento dinámicamente a partir de feedback real,
 *  sin que nadie haya definido el perfil resultante de antemano.
 *
 *  Diferencia vs Patrón 51 (Long-Term Memory): Long-Term Memory
 *  guarda HECHOS explícitos ("el usuario se llama Ana"). Preference
 *  Learning ajusta PESOS de rasgos de comportamiento a partir de
 *  señales indirectas — no es un hecho declarado, es un patrón inferido.
 *
 *  Ventajas:
 *  - No requiere que el usuario configure preferencias explícitamente
 *  - Las ediciones del usuario son la señal más rica y menos ambigua
 *  - El perfil es incremental: se ajusta con cada interacción, no de golpe
 *  - Transparente: los pesos son auditables, no una caja negra
 */

import { isDirectRun, paso } from "./common.js";

export type TipoSenal = "explicito_positivo" | "explicito_negativo" | "implicito_edicion" | "implicito_aceptacion";

export interface SenalFeedback {
  tipo: TipoSenal;
  rasgosImplicados: string[];
}

const AJUSTE_POR_TIPO: Record<TipoSenal, number> = {
  explicito_positivo: 0.15,
  explicito_negativo: -0.15,
  implicito_edicion: -0.1, // el usuario tuvo que corregir → señal negativa moderada sobre ese rasgo
  implicito_aceptacion: 0.05,
};

export class AprendizPreferencias {
  private pesos = new Map<string, number>();

  registrarSenal(senal: SenalFeedback): void {
    const ajuste = AJUSTE_POR_TIPO[senal.tipo];
    for (const rasgo of senal.rasgosImplicados) {
      const actual = this.pesos.get(rasgo) ?? 0;
      const nuevo = Math.round(Math.max(-1, Math.min(1, actual + ajuste)) * 100) / 100;
      this.pesos.set(rasgo, nuevo);
    }
  }

  obtenerPerfilActual(): Record<string, number> {
    return Object.fromEntries(this.pesos);
  }

  rasgosDominantes(umbral: number = 0.2): string[] {
    return [...this.pesos.entries()].filter(([, peso]) => Math.abs(peso) >= umbral).map(([rasgo]) => rasgo);
  }

  aplicarAPrompt(promptBase: string): string {
    const dominantes = this.rasgosDominantes();
    if (dominantes.length === 0) return promptBase;

    const instrucciones = dominantes
      .map((rasgo) => {
        const peso = this.pesos.get(rasgo)!;
        return peso > 0 ? `Prioriza ser ${rasgo}.` : `Evita ser ${rasgo}.`;
      })
      .join(" ");

    return `${promptBase}\n\n[Preferencias aprendidas del usuario]: ${instrucciones}`;
  }
}

export async function demostrarPreferenceLearning(): Promise<void> {
  paso("🎯", "Demostrando Preference Learning Pattern");

  const aprendiz = new AprendizPreferencias();

  paso("1️⃣", "El usuario acorta repetidamente las respuestas del agente (señal implícita)");
  aprendiz.registrarSenal({ tipo: "implicito_edicion", rasgosImplicados: ["verboso"] });
  aprendiz.registrarSenal({ tipo: "implicito_edicion", rasgosImplicados: ["verboso"] });
  aprendiz.registrarSenal({ tipo: "implicito_edicion", rasgosImplicados: ["verboso"] });
  console.log(`   Perfil tras 3 ediciones: ${JSON.stringify(aprendiz.obtenerPerfilActual())}`);

  paso("2️⃣", "El usuario da 👍 explícito a una respuesta con lenguaje técnico directo");
  aprendiz.registrarSenal({ tipo: "explicito_positivo", rasgosImplicados: ["tecnico_directo"] });
  aprendiz.registrarSenal({ tipo: "explicito_positivo", rasgosImplicados: ["tecnico_directo"] });
  console.log(`   Perfil actualizado: ${JSON.stringify(aprendiz.obtenerPerfilActual())}`);

  paso("3️⃣", "Rasgos dominantes se inyectan en el próximo prompt");
  const promptAjustado = aprendiz.aplicarAPrompt("Responde la pregunta del usuario sobre la API.");
  console.log(`   Prompt ajustado:\n   "${promptAjustado}"`);

  paso("✅", "Preference Learning adaptando el comportamiento sin configuración explícita");
}

async function main(): Promise<void> {
  await demostrarPreferenceLearning();
}

if (isDirectRun(import.meta.url)) {
  main().catch((e: unknown) => {
    console.error(e);
    process.exitCode = 1;
  });
}
