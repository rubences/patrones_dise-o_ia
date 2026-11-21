import type {ArchitectureDiagram} from './architecture-schema';
const safe=(title:string)=>typeof title==='string'&&title.trim().length>0&&title.length<=160&&!/[<>\u0000-\u001f]/.test(title);
export function renameProject(project:ArchitectureDiagram,title:string):ArchitectureDiagram{
 if(!safe(title))throw Error('Nombre de proyecto inválido');
 return {...project,title:title.trim()};
}
export function duplicateProject(project:ArchitectureDiagram,newId:string,newTitle:string):ArchitectureDiagram{
 if(!/^[a-zA-Z0-9_-]{1,80}$/.test(newId)||newId===project.id)throw Error('Identificador de copia inválido');
 return {...structuredClone(project),id:newId,title:renameProject(project,newTitle).title};
}
export function projectIsDirty(saved:ArchitectureDiagram|null,current:ArchitectureDiagram):boolean{
 return saved===null||JSON.stringify(saved)!==JSON.stringify(current);
}
