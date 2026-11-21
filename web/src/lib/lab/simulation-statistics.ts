import type {ArchitectureDiagram,EdgeKind} from './architecture-schema';
import type {SimulationReport,SimulationStatus} from './simulation';
import type {StructuralAnalysis} from './structural-analysis';
export interface SimulationStatistics {
 schemaVersion:1;projectId:string;status:SimulationStatus;nodeCount:number;edgeCount:number;
 waveSizes:number[];longestPathLength:number|null;cyclicNodeCount:number;downstreamBlockedCount:number;
 edgeKinds:{kind:EdgeKind;count:number}[];executedModels:false;executedTools:false;
}
export function buildSimulationStatistics(graph:ArchitectureDiagram,simulation:SimulationReport,analysis:StructuralAnalysis):SimulationStatistics {
 const kinds=new Map<EdgeKind,number>();
 for(const edge of graph.edges)kinds.set(edge.kind,(kinds.get(edge.kind)??0)+1);
 return {schemaVersion:1,projectId:simulation.projectId,status:simulation.status,
 nodeCount:analysis.nodeCount,edgeCount:analysis.edgeCount,
 waveSizes:[...analysis.waveSizes],longestPathLength:analysis.longestPathLength,
 cyclicNodeCount:analysis.cyclicNodeIds.length,downstreamBlockedCount:analysis.downstreamBlockedNodeIds.length,
 edgeKinds:[...kinds].sort(([a],[b])=>a.localeCompare(b)).map(([kind,count])=>({kind,count})),
 executedModels:false,executedTools:false};
}
