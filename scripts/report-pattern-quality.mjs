import {readFileSync,mkdirSync,writeFileSync} from "node:fs";
import {join,resolve} from "node:path";
const root=resolve(import.meta.dirname,"..");
const json=p=>JSON.parse(readFileSync(join(root,p),"utf8"));
const catalog=json("catalog/patterns.json"),taxonomy=json("catalog/taxonomy.json"),evidence=json("catalog/pattern-evidence.json"),refs=json("catalog/references.json");
const linked=new Set(evidence.patterns.map(x=>x.patternId));
const counts={};
for(const family of taxonomy.families){
 const patterns=catalog.patterns.filter(p=>p.family===family.id);
 counts[family.id]={total:patterns.length,withPrimaryEvidenceMapping:patterns.filter(p=>linked.has(p.id)).length,needsReview:patterns.filter(p=>p.evidenceStatus==="needs-review").length,partiallyVerified:patterns.filter(p=>p.evidenceStatus==="partially-verified").length,verified:patterns.filter(p=>p.evidenceStatus==="verified").length};
}
const summary={generatedAt:new Date().toISOString(),catalogSize:catalog.patterns.length,families:taxonomy.families.length,legacyGroups:taxonomy.legacyGroups.length,primaryEvidenceMappings:evidence.patterns.length,primaryReferences:refs.references.length,evidenceStatusCounts:catalog.patterns.reduce((a,p)=>(a[p.evidenceStatus]=(a[p.evidenceStatus]||0)+1,a),{}),familiesBreakdown:counts,interpretation:"Evidence mapping is bibliographic support, not an empirical validation of the TypeScript implementation."};
const lines=["# Estado de calidad y evidencia — Patrones IA","",`Generado: ${summary.generatedAt}`,"",`Patrones: **${summary.catalogSize}** · Macrofamilias: **${summary.families}** · Grupos: **${summary.legacyGroups}**`,"",`Mapeos de evidencia primaria: **${summary.primaryEvidenceMappings}** · Referencias: **${summary.primaryReferences}**`,"","| Macrofamilia | Total | Evidencia mapeada | Needs review | Partially verified | Verified |","|---|---:|---:|---:|---:|---:|"];
for(const [name,row] of Object.entries(counts))lines.push(`| ${name} | ${row.total} | ${row.withPrimaryEvidenceMapping} | ${row.needsReview} | ${row.partiallyVerified} | ${row.verified} |`);
lines.push("","**Alcance:** la evidencia bibliográfica no certifica la implementación. Los tests y builds deben verificarse por separado.","");
mkdirSync(join(root,"dist","quality"),{recursive:true});
writeFileSync(join(root,"dist","quality","pattern-quality.json"),JSON.stringify(summary,null,2)+"\n");
writeFileSync(join(root,"dist","quality","PATTERN_QUALITY_REPORT.md"),lines.join("\n"));
console.log(JSON.stringify({patterns:summary.catalogSize,families:summary.families,primaryEvidenceMappings:summary.primaryEvidenceMappings,primaryReferences:summary.primaryReferences}));
