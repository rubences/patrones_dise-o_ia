import type {ArchitectureDiagram,ArchitectureEdge,EdgeKind} from './architecture-schema';
export function filterArchitectureEdges(graph:ArchitectureDiagram,kind:EdgeKind|null):ArchitectureEdge[]{
 return kind===null?[...graph.edges]:graph.edges.filter(edge=>edge.kind===kind);
}
