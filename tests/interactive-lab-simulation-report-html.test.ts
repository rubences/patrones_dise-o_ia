import test from 'node:test';
import assert from 'node:assert/strict';
import {renderSimulationReportHtml} from '../web/src/lib/lab/simulation-report-html.ts';
import {newArchitecture,addPatternNode} from '../web/src/lib/lab/editor-operations.ts';
import {simulateArchitecture} from '../web/src/lib/lab/simulation.ts';
import {analyzeArchitecture} from '../web/src/lib/lab/structural-analysis.ts';
import {buildSimulationStatistics} from '../web/src/lib/lab/simulation-statistics.ts';
const ids=new Set([1]);
test('printable report includes structure, disclaimer and safe markup',()=>{
 let g=newArchitecture('demo','Reporte');g=addPatternNode(g,1,'Pipeline');
 const s=simulateArchitecture(g,ids),a=analyzeArchitecture(g,ids),stats=buildSimulationStatistics(g,s,a);
 const html=renderSimulationReportHtml(g,stats,s,a);
 assert.match(html,/<!doctype html>/i);assert.match(html,/Imprimir/);assert.match(html,/Oleadas/);
 assert.match(html,/No se han ejecutado modelos/);assert.match(html,/Pipeline/);
});
test('HTML special characters in labels are escaped',()=>{
 let g=newArchitecture('demo','Prueba');g=addPatternNode(g,1,'Pipeline');
 g.title='<img src=x onerror=alert(1)>';
 const s=simulateArchitecture(g,ids),a=analyzeArchitecture(g,ids),stats=buildSimulationStatistics(g,s,a);
 const html=renderSimulationReportHtml(g,stats,s,a);
 assert.doesNotMatch(html,/<img src=x/);
 assert.match(html,/&lt;img/);
});
