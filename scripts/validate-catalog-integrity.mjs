import {readFileSync,existsSync,readdirSync} from "node:fs";
import {join,resolve} from "node:path";
const root=resolve(import.meta.dirname,"..");
const read=(p)=>JSON.parse(readFileSync(join(root,p),"utf8"));
const catalog=read("catalog/patterns.json"),tax=read("catalog/taxonomy.json"),mapping=read("catalog/pattern-evidence.json"),refs=read("catalog/references.json"),baseline=read("catalog/evidence-baseline.json");
const errors=[];
const assert=(ok,message)=>{if(!ok)errors.push(message);};
const ids=new Set(),slugs=new Set(),families=new Set(tax.families.map(x=>x.id)),groups=new Set(tax.legacyGroups.map(x=>x.id));
assert(catalog.catalogSize===tax.catalogSize,"catalog/taxonomy size mismatch");
assert(catalog.patterns.length===tax.catalogSize,"catalog count mismatch");
assert(families.size===tax.families.length,"duplicate family");
assert(groups.size===tax.legacyGroups.length,"duplicate group");
const referenceIds=new Set(refs.references.map(x=>x.id));
const sheetNames=readdirSync(join(root,"content/patterns")).filter(x=>x.endsWith(".md"));
const sheetById=new Map();
for(const filename of sheetNames){
  const match=filename.match(/^(\d+)-/);
  if(!match){errors.push("unrecognized sheet name "+filename);continue;}
  const id=Number(match[1]);
  if(sheetById.has(id))errors.push("duplicate canonical sheet for "+id);
  sheetById.set(id,join("content/patterns",filename));
}
const evidenceIds=new Set(mapping.patterns.map(x=>x.patternId));
for(const record of catalog.patterns){
  const {id,slug,sourceFile,canonicalContent,family,legacyGroup,evidenceStatus}=record;
  assert(!ids.has(id),"duplicate ID "+id);ids.add(id);
  assert(!slugs.has(slug),"duplicate slug "+slug);slugs.add(slug);
  assert(families.has(family),"unknown family "+id);
  assert(groups.has(legacyGroup),"unknown group "+id);
  assert(existsSync(join(root,sourceFile)),"missing source "+id);
  const resolvedSheet=canonicalContent??sheetById.get(id);
  assert(!!resolvedSheet&&existsSync(join(root,resolvedSheet)),"missing sheet "+id);
  if(!resolvedSheet||!existsSync(join(root,resolvedSheet)))continue;
  if(canonicalContent)assert(canonicalContent===sheetById.get(id),"canonical path mismatch "+id);
  const sheet=readFileSync(join(root,resolvedSheet),"utf8");
  for(const [key,value] of Object.entries({patternId:id,slug,family,legacyGroup,sourceFile,evidenceStatus})){
    const line=sheet.match(new RegExp("^"+key+":\\s*(.*)$","m"))?.[1]?.trim().replace(/^["']|["']$/g,"");
    assert(line===String(value),"frontmatter mismatch "+id+" "+key);
  }
  const references=sheet.match(/^references:\s*\[([^\]]*)\]/m)?.[1]?.split(",").map(x=>x.trim()).filter(Boolean)||[];
  for(const ref of references)assert(referenceIds.has(ref),"unregistered reference "+id+" "+ref);
}
for(let id=1;id<=tax.catalogSize;id++)assert(ids.has(id),"missing ID "+id);
for(const entry of mapping.patterns){
  assert(ids.has(entry.patternId),"evidence references unknown pattern "+entry.patternId);
  for(const ref of entry.references)assert(referenceIds.has(ref),"missing evidence ref "+ref);
  assert(typeof entry.scopeNote==="string"&&entry.scopeNote.length>20,"missing scope note "+entry.patternId);
}
assert(evidenceIds.size===mapping.patterns.length,"duplicate evidence mapping");
assert(mapping.patterns.length>=baseline.minimumPrimaryPatterns,"evidence baseline regression");
assert(refs.references.length>=baseline.minimumPrimaryReferences,"reference baseline regression");
const sourceFiles=readdirSync(join(root,"src")).filter(x=>/^pattern_\d+_.*\.ts$/.test(x));
const sheets=readdirSync(join(root,"content/patterns")).filter(x=>x.endsWith(".md"));
assert(sourceFiles.length===tax.catalogSize,"source count mismatch");
assert(sheets.length===tax.catalogSize,"sheet count mismatch");
console.log("Catalog integrity:",{patterns:catalog.patterns.length,families:families.size,groups:groups.size,evidenceMappings:mapping.patterns.length,references:refs.references.length,errors:errors.length});
if(errors.length){for(const error of errors)console.error("ERROR:",error);process.exitCode=1;}
else console.log("Catalog integrity PASS");
