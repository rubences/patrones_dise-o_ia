export type EdgeKind = 'data'|'control'|'tool-call'|'delegation'|'evidence';
export interface ArchitecturePort {id:string;direction:'input'|'output';kind:EdgeKind}
export interface ArchitectureNode {id:string;patternId:number;label:string;position:{x:number;y:number};ports:ArchitecturePort[]}
export interface ArchitectureEdge {id:string;source:string;sourcePort:string;target:string;targetPort:string;kind:EdgeKind}
export interface ArchitectureDiagram {schemaVersion:1;id:string;title:string;patternIds:number[];nodes:ArchitectureNode[];edges:ArchitectureEdge[]}
