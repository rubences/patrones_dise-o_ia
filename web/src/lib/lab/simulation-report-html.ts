import type {ArchitectureDiagram} from './architecture-schema';
import type {SimulationReport} from './simulation';
import type {StructuralAnalysis} from './structural-analysis';
import type {SimulationStatistics} from './simulation-statistics';
const escape=(s:unknown)=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
export function renderSimulationReportHtml(graph:ArchitectureDiagram,stats:SimulationStatistics,sim:SimulationReport,analysis:StructuralAnalysis):string{
 const rows=sim.steps.map(step=>`<tr><td>${step.sequence}</td><td>${step.wave}</td><td>${escape(step.label)}</td><td>#${step.patternId}</td><td>Simulado</td></tr>`).join('');
 const waves=sim.waves.map(w=>`<li>Oleada ${w.index}: ${w.nodeIds.length} nodos</li>`).join('');
 const edgeKinds=stats.edgeKinds.map(e=>`<li>${escape(e.kind)}: ${e.count}</li>`).join('');
 return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Informe de simulación · ${escape(graph.title)}</title>
<style>
:root{font-family:system-ui,sans-serif;color:#172236;background:#f6f8fb}body{max-width:960px;margin:2rem auto;padding:2rem;background:#fff;line-height:1.6}h1,h2{color:#0b2947}header{border-bottom:3px solid #0f766e;padding-bottom:1rem}table{width:100%;border-collapse:collapse}td,th{border-bottom:1px solid #d6e1e8;padding:.65rem;text-align:left}th{background:#e7f3f3}.facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:1rem}.fact{background:#edf4f9;padding:1rem;border-radius:10px}.note{border-left:4px solid #b45309;padding:1rem;background:#fff7ed}footer{margin-top:2rem;font-size:.85rem;color:#546477}@media print{body{margin:0;padding:.4rem;max-width:none}.fact{break-inside:avoid}tr{break-inside:avoid}}
</style></head><body>
<header><p>Patrones IA · Interactive Lab</p><h1>Informe de arquitectura: ${escape(graph.title)}</h1><p>ID del proyecto: ${escape(graph.id)} · Estado: ${escape(sim.status)}</p></header>
<p class="note"><strong>Alcance:</strong> No se han ejecutado modelos ni herramientas. Los resultados son análisis estructurales deterministas, no benchmarks. No se estiman tiempos, costes ni rendimiento.</p>
<section><h2>Resumen estructural</h2><div class="facts"><div class="fact"><strong>${stats.nodeCount}</strong><p>Nodos</p></div><div class="fact"><strong>${stats.edgeCount}</strong><p>Conexiones</p></div><div class="fact"><strong>${stats.waveSizes.length}</strong><p>Oleadas</p></div><div class="fact"><strong>${analysis.longestPathLength??'—'}</strong><p>Profundidad máxima (nodos)</p></div></div></section>
<section><h2>Oleadas</h2><ul>${waves||'<li>Ninguna</li>'}</ul><h2>Conexiones por tipo</h2><ul>${edgeKinds||'<li>Ninguna</li>'}</ul></section>
<section><h2>Diagnóstico</h2><p>Nodos en ciclos: ${analysis.cyclicNodeIds.length}. Bloqueados aguas abajo: ${analysis.downstreamBlockedNodeIds.length}.</p><p>${escape(analysis.issues.join('; ')||'Sin incidencias estructurales')}</p></section>
<section><h2>Traza de simulación</h2><table><thead><tr><th>Paso</th><th>Oleada</th><th>Patrón</th><th>ID</th><th>Estado</th></tr></thead><tbody>${rows||'<tr><td colspan="5">Sin pasos ejecutables</td></tr>'}</tbody></table></section>
<footer>Informe HTML autónomo. Para imprimir o guardar como PDF utiliza Imprimir (Ctrl+P) en el navegador. No contiene scripts ni recursos externos.</footer>
</body></html>`;
}
