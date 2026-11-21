import type {ArchitectureDiagram} from './architecture-schema';
import type {SimulationReport} from './simulation';
import type {StructuralAnalysis} from './structural-analysis';
export type NodeVisualState='normal'|'path'|'active'|'cyclic'|'blocked';
export function simulationNodeStates(graph:ArchitectureDiagram,simulation:SimulationReport,analysis:StructuralAnalysis,wave:number):Map<string,NodeVisualState>{
 const path=new Set(analysis.longestPathNodeIds),active=new Set(simulation.waves.find(w=>w.index===wave)?.nodeIds??[]);
 const cycles=new Set(analysis.cyclicNodeIds),blocked=new Set(analysis.downstreamBlockedNodeIds);
 return new Map(graph.nodes.map(n=>[n.id,cycles.has(n.id)?'cyclic':blocked.has(n.id)?'blocked':active.has(n.id)?'active':path.has(n.id)?'path':'normal']));
}
