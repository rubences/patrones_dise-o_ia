/** PATRÓN 105 — Spec-Driven Development (SDD)
 * Referencia pedagógica: contratos e invariantes, no reproducción de benchmarks.
 */
export type SpecStage="constitution"|"specify"|"clarify"|"plan"|"tasks"|"implement"|"validate";export class SpecDrivenLifecycle{private a=new Map<SpecStage,string>();set(s:SpecStage,v:string){if(!v.trim())throw Error("empty artifact");this.a.set(s,v)}readyFor(s:SpecStage){const o:SpecStage[]=["constitution","specify","clarify","plan","tasks","implement","validate"];return o.slice(0,o.indexOf(s)).every(x=>this.a.has(x))}}
export const PATTERN_105_META={id:105,name:"Spec-Driven Development (SDD)",family:"development-governance",maturity:"emerging"} as const;
