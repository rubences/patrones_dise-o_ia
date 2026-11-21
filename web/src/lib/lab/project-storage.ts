import {validateArchitecture} from './architecture-validation';
import type {ArchitectureDiagram} from './architecture-schema';
export interface ProjectStorage {
 list():Promise<ArchitectureDiagram[]>;
 get(id:string):Promise<ArchitectureDiagram|null>;
 put(diagram:ArchitectureDiagram):Promise<void>;
 remove(id:string):Promise<void>;
}
function verified(value:unknown,knownIds:ReadonlySet<number>):ArchitectureDiagram {
 const result=validateArchitecture(value,knownIds);
 if(!result.ok)throw Error('Invalid project: '+result.errors.join('; '));
 return result.diagram;
}
const copy=(p:ArchitectureDiagram):ArchitectureDiagram=>structuredClone(p);
export function createMemoryProjectStorage(knownIds:ReadonlySet<number>):ProjectStorage {
 const items=new Map<string,ArchitectureDiagram>();
 return {
  async list(){return [...items.values()].map(copy).sort((a,b)=>a.id.localeCompare(b.id))},
  async get(id){const p=items.get(id);return p?copy(p):null},
  async put(value){const p=verified(value,knownIds);items.set(p.id,copy(p))},
  async remove(id){items.delete(id)}
 };
}
export function createIndexedDbProjectStorage(knownIds:ReadonlySet<number>,dbName='patrones-ia-lab'):ProjectStorage {
 const open=():Promise<IDBDatabase>=>new Promise((resolve,reject)=>{
  if(typeof indexedDB==='undefined'){reject(Error('IndexedDB is unavailable'));return}
  const request=indexedDB.open(dbName,1);
  request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains('projects'))db.createObjectStore('projects',{keyPath:'id'})};
  request.onerror=()=>reject(request.error??Error('Cannot open local projects'));
  request.onblocked=()=>reject(Error('Local project database is blocked by another tab'));
  request.onsuccess=()=>resolve(request.result);
 });
 const transact=async<T>(mode:IDBTransactionMode,execute:(store:IDBObjectStore)=>IDBRequest<T>):Promise<T>=>{
  const db=await open();
  return new Promise<T>((resolve,reject)=>{
   let done=false;
   const finish=(error?:unknown,value?:T)=>{if(done)return;done=true;db.close();if(error)reject(error);else resolve(value as T)};
   let request:IDBRequest<T>;
   try{const tx=db.transaction('projects',mode);request=execute(tx.objectStore('projects'));
    tx.oncomplete=()=>finish(undefined,request.result);
    tx.onerror=()=>finish(tx.error??Error('Local project transaction failed'));
    tx.onabort=()=>finish(tx.error??Error('Local project transaction aborted'));
   }catch(e){finish(e)}
  });
 };
 return {
  async list(){const rows=await transact<ArchitectureDiagram[]>('readonly',store=>store.getAll());return rows.map(row=>verified(row,knownIds)).sort((a,b)=>a.id.localeCompare(b.id))},
  async get(id){const row=await transact<ArchitectureDiagram|undefined>('readonly',store=>store.get(id));return row?verified(row,knownIds):null},
  async put(value){const p=verified(value,knownIds);await transact<IDBValidKey>('readwrite',store=>store.put(copy(p)))},
  async remove(id){await transact<undefined>('readwrite',store=>store.delete(id))}
 };
}
