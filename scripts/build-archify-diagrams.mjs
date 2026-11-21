import {execFileSync} from 'node:child_process';
import {copyFileSync,existsSync,mkdirSync,mkdtempSync,readFileSync,rmSync,statSync,writeFileSync} from 'node:fs';
import {join,resolve,dirname} from 'node:path';
import {tmpdir} from 'node:os';
import {ARCHIFY_RELEASE_SHA,curatedDiagrams} from '../web/src/data/archify-diagrams.mjs';
import {patternDiagramRegistry,patternSourceOverview} from '../web/scripts/pattern-archify-registry.mjs';
import catalog from '../catalog/patterns.json' with {type:'json'};

const root=resolve(import.meta.dirname,'..');
const archifyDir=join(root,'.tooling','archify');
const cli=join(archifyDir,'archify','bin','archify.mjs');
const siteOutput=join(root,'web','dist','archify');
const git=(cwd)=>execFileSync('git',['rev-parse','HEAD'],{cwd,encoding:'utf8'}).trim();

if(!existsSync(cli))throw Error('Pinned Archify checkout missing: '+cli);
const archifySha=git(archifyDir);
if(archifySha!==ARCHIFY_RELEASE_SHA)throw Error('Archify commit mismatch: '+archifySha);
const revision=git(root);
if(!/^[a-f0-9]{40}$/.test(revision))throw Error('Invalid repository revision');

mkdirSync(siteOutput,{recursive:true});
const temp=mkdtempSync(join(tmpdir(),'patrones-archify-'));
try{
 for(const entry of curatedDiagrams){
  if(!/^[a-z0-9-]+\.html$/.test(entry.output)||!/^[a-z0-9-]+$/.test(entry.id))
   throw Error('Unsafe curated diagram entry '+entry.id);
  const input=JSON.parse(readFileSync(join(root,entry.candidate),'utf8'));
  if(input.diagram_type!==entry.type||input.meta.output!==`dist/archify-build/${entry.output}`)
   throw Error('Diagram type or output mismatch '+entry.id);
  if(input.meta.repository?.url!=='https://github.com/rubences/patrones_dise-o_ia')
   throw Error('Unexpected source repository '+entry.id);
  input.meta.repository.revision=revision;
  const tempCandidate=join(temp,`${entry.id}.json`);
  writeFileSync(tempCandidate,JSON.stringify(input,null,2)+'\n');
  const output=join(root,input.meta.output);
  mkdirSync(dirname(output),{recursive:true});
  console.log('Archify finalize:',entry.id,'revision:',revision);
  execFileSync(process.execPath,[cli,'finalize',entry.type,tempCandidate,input.meta.output,
   '--repo-root',root,'--quality','showcase','--json'],{cwd:root,stdio:'inherit'});
  if(!existsSync(output)||statSync(output).size<1000)throw Error('Archify did not produce a usable HTML: '+entry.id);
  const published=join(siteOutput,entry.output);
  copyFileSync(output,published);
  console.log('Published:',published);
 }
 const curatedIds=new Set(curatedDiagrams.filter(d=>d.patternId).map(d=>d.patternId));
 const generated=patternDiagramRegistry().filter(d=>!curatedIds.has(d.patternId));
 const patterns=new Map(catalog.patterns.map(p=>[p.id,p]));
 for(const entry of generated){
  const pattern=patterns.get(entry.patternId);
  if(!pattern||!existsSync(join(root,pattern.sourceFile)))throw Error('Missing pattern source '+entry.patternId);
  const input=patternSourceOverview(pattern,revision);
  const candidate=join(temp,`generated-${entry.patternId}.json`);
  writeFileSync(candidate,JSON.stringify(input,null,2)+'\n');
  const output=join(root,input.meta.output);
  mkdirSync(dirname(output),{recursive:true});
  execFileSync(process.execPath,[cli,'finalize','workflow',candidate,input.meta.output,
   '--repo-root',root,'--quality','showcase','--json'],{cwd:root,stdio:'inherit'});
  if(!existsSync(output)||statSync(output).size<1000)throw Error('Missing generated Archify '+entry.id);
  copyFileSync(output,join(siteOutput,entry.output));
  console.log('Generated pattern Archify',entry.patternId,'/',catalog.patterns.length);
 }
}finally{
 rmSync(temp,{recursive:true,force:true});
}
