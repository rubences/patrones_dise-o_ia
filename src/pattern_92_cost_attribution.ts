/**
 * ═══════════════════════════════════════════════════════════════════
 *  PATRÓN 92 — COST ATTRIBUTION / CHARGEBACK (ATRIBUCIÓN DE COSTES)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  [Cada llamada LLM] ──registrar(tenant, feature, tokens)──▶ [Ledger]
 *       │
 *       ▼
 *  [Ledger de uso: N registros con tenant, feature, tokens, coste]
 *       │
 *       ├──▶ agregarPorTenant()  → coste total por cliente (facturación)
 *       ├──▶ agregarPorFeature() → qué funcionalidad consume más presupuesto
 *       └──▶ facturaPara(tenant) → desglose línea por línea
 *
 *  Idea: en una plataforma multi-tenant (o multi-feature) que usa
 *  LLMs, hace falta saber CUÁNTO cuesta cada cliente/funcionalidad
 *  para poder facturar, priorizar optimización de costes, o detectar
 *  un tenant anómalo. Sin atribución, el coste total es un número
 *  agregado inútil para tomar decisiones.
 *
 *  Diferencia vs Patrón 78 (Token Budget): Token Budget es un control
 *  EN TIEMPO REAL dentro de UNA sesión (deniega/comprime/degrada
 *  cuando se acerca el límite). Este patrón es un REGISTRO AGREGADO
 *  a través de MUCHAS sesiones/tenants/features a lo largo del
 *  tiempo, orientado a FinOps y facturación — no bloquea nada en el
 *  momento, informa después (aunque puede alimentar decisiones de
 *  Token Budget o Rate Limiting por tenant).
 *
 *  Ventajas:
 *  - Facturación precisa por cliente en plataformas multi-tenant
 *  - Visibilidad de qué feature consume el presupuesto de IA
 *  - Detecta anomalías de uso (un tenant que dispara su consumo)
 *  - Datos objetivos para decidir dónde optimizar coste primero
 */

import { isDirectRun, paso } from "./common.js";

export interface RegistroUso {
  tenant: string;
  feature: string;
  tokensEntrada: number;
  tokensSalida: number;
  costoUSD: number;
  timestamp: number;
}

export interface PrecioModelo {
  costoPorMilTokensEntrada: number;
  costoPorMilTokensSalida: number;
}

export class RastreadorCostos {
  private registros: RegistroUso[] = [];

  constructor(private precio: PrecioModelo) {}

  registrar(tenant: string, feature: string, tokensEntrada: number, tokensSalida: number, timestamp: number = Date.now()): RegistroUso {
    const costoUSD =
      (tokensEntrada / 1000) * this.precio.costoPorMilTokensEntrada +
      (tokensSalida / 1000) * this.precio.costoPorMilTokensSalida;

    const registro: RegistroUso = { tenant, feature, tokensEntrada, tokensSalida, costoUSD, timestamp };
    this.registros.push(registro);
    return registro;
  }

  costoPorTenant(): Map<string, number> {
    const totales = new Map<string, number>();
    for (const r of this.registros) {
      totales.set(r.tenant, (totales.get(r.tenant) ?? 0) + r.costoUSD);
    }
    return totales;
  }

  costoPorFeature(): Map<string, number> {
    const totales = new Map<string, number>();
    for (const r of this.registros) {
      totales.set(r.feature, (totales.get(r.feature) ?? 0) + r.costoUSD);
    }
    return totales;
  }

  facturaPara(tenant: string): { lineas: RegistroUso[]; totalUSD: number } {
    const lineas = this.registros.filter((r) => r.tenant === tenant);
    const totalUSD = lineas.reduce((sum, r) => sum + r.costoUSD, 0);
    return { lineas, totalUSD };
  }

  tenantConMayorCosto(): { tenant: string; costoUSD: number } | null {
    const totales = [...this.costoPorTenant()].sort((a, b) => b[1] - a[1]);
    return totales.length > 0 ? { tenant: totales[0][0], costoUSD: totales[0][1] } : null;
  }
}

export async function demostrarCostAttribution(): Promise<void> {
  paso("💰", "Demostrando Cost Attribution / Chargeback Pattern");

  const rastreador = new RastreadorCostos({ costoPorMilTokensEntrada: 0.15, costoPorMilTokensSalida: 0.6 });

  paso("1️⃣", "Registrar uso de varios tenants y features");
  rastreador.registrar("acme-corp", "chat_soporte", 1200, 400);
  rastreador.registrar("acme-corp", "resumen_documentos", 5000, 800);
  rastreador.registrar("acme-corp", "chat_soporte", 900, 350);
  rastreador.registrar("globex-inc", "chat_soporte", 2000, 600);
  rastreador.registrar("globex-inc", "clasificacion_tickets", 300, 50);
  rastreador.registrar("initech", "chat_soporte", 15000, 3000); // tenant con consumo anómalo

  paso("2️⃣", "Coste agregado por tenant (facturación)");
  for (const [tenant, costo] of rastreador.costoPorTenant()) {
    console.log(`   ${tenant}: $${costo.toFixed(4)}`);
  }

  paso("3️⃣", "Coste agregado por feature (dónde optimizar primero)");
  for (const [feature, costo] of rastreador.costoPorFeature()) {
    console.log(`   ${feature}: $${costo.toFixed(4)}`);
  }

  paso("4️⃣", "Factura detallada de un tenant concreto");
  const factura = rastreador.facturaPara("acme-corp");
  factura.lineas.forEach((l) => console.log(`   [${l.feature}] ${l.tokensEntrada}+${l.tokensSalida} tokens → $${l.costoUSD.toFixed(4)}`));
  console.log(`   Total acme-corp: $${factura.totalUSD.toFixed(4)}`);

  paso("5️⃣", "Detectar el tenant de mayor consumo (posible anomalía)");
  const top = rastreador.tenantConMayorCosto();
  console.log(`   Mayor consumo: ${top?.tenant} ($${top?.costoUSD.toFixed(4)})`);

  paso("✅", "Cost Attribution dando visibilidad de coste por cliente y funcionalidad");
}

async function main(): Promise<void> {
  await demostrarCostAttribution();
}

if (isDirectRun(import.meta.url)) {
  main().catch((e: unknown) => {
    console.error(e);
    process.exitCode = 1;
  });
}
