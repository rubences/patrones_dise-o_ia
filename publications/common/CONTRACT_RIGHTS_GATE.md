# Contract, Rights and Overlap Gate

This checklist protects the open technical ecosystem and the independence of the two planned books. It is an editorial risk-control document, not legal advice.

## 1. Assets that must be identified separately

Before signing any publishing agreement, classify each asset instead of treating “the book” as one undifferentiated object:

- canonical pattern metadata and IDs;
- TypeScript source code and tests;
- website source and generated website;
- Evidence Pack and reference registry;
- diagrams created specifically for the international monograph;
- diagrams created specifically for the Spanish manual;
- international-monograph narrative text;
- Spanish-manual narrative text;
- datasets, benchmark outputs and experimental artefacts;
- laboratory instructions, rubrics and teaching resources;
- companion repositories, notebooks, Docker assets and n8n workflows;
- future translations, adaptations, revised editions and derivative works.

## 2. Contract clauses that require explicit review

Do not accept ambiguity around the following items:

### Scope and exclusivity

- Is exclusivity limited to the specific manuscript, language, territory, format and edition?
- Does the clause unintentionally cover the open web catalogue or source repository?
- Does it restrict a second book that uses the same underlying technical ideas but different prose, structure, cases and audience?

### Translation and adaptation rights

- Who controls Spanish/English translation rights?
- Can the author independently create a distinct pedagogical or research work based on the same public technical substrate?
- Is permission required for excerpts, figures or adapted tables in the companion work?

### Open repository and companion website

- Can the 102-pattern catalogue remain public?
- Can code remain under its existing open-source licence?
- Can errata, updates, notebooks, examples and datasets remain openly accessible?
- Is there an embargo, and if so, exactly which files does it affect and for how long?

### Figures, tables and code

- Are author-created diagrams licensed to the publisher exclusively or non-exclusively?
- Can figures be reused in teaching, talks, papers and the other independent book?
- Does the contract distinguish code listings from book prose?

### Teaching rights

- Can chapters/excerpts be used in the author's own courses and virtual campus?
- Can laboratories, slides, assignments and rubrics be distributed to students?
- Can a reduced teaching version be deposited in an institutional repository when permitted?

### Research reuse

- Can material from prior papers be adapted with correct citation and permissions?
- Can results later appear in journal articles or conference papers without assigning away future research publication rights?
- Are datasets and experimental protocols outside the exclusive book grant?

### Author versions and repositories

- Which version, if any, may be deposited?
- Where may it be deposited?
- What acknowledgement or DOI/ISBN link is required?
- Does the policy differ for individual chapters and the full work?

## 3. Independence test between the two books

At every major manuscript milestone, record the following evidence for both works:

| Dimension | Research monograph EN | Teaching manual ES |
|---|---|---|
| Primary audience | researchers / architects | students / instructors / practitioners in training |
| Organising principle | research questions and architectural claims | competencies, modules and laboratories |
| Main contribution | pattern language + validation boundaries | reproducible learning pathway + assessment |
| Core cases | Edge–Mesh–Cloud, C-V2X, high-dependability systems | classroom services, RAG, tools, cyberlabs, capstone |
| Evidence style | literature, experiments, ablations, threats to validity | learning objectives, lab evidence, tests, rubrics |
| Code role | research prototype / architectural evidence | guided implementation / exercise substrate |
| Figures | research architecture and evaluation figures | teaching diagrams, procedures and lab screenshots |

A shared pattern ID or shared source-code file is acceptable. A copied chapter narrative, copied figure set or one-to-one translated structure is a red flag and must be reviewed before submission.

## 4. Provenance record

For every non-trivial figure/table/excerpt, keep:

- asset ID;
- creator/source;
- date;
- licence or permission basis;
- original publication, if any;
- modifications made;
- books/website where reused;
- permission evidence where required.

## 5. Contract decision states

Use one of these states in the project log:

- `CLEAR` — clause explicitly preserves the required ecosystem rights;
- `NEGOTIATE` — wording is ambiguous or broader than needed;
- `BLOCK` — clause would prevent the companion work, open technical substrate, teaching use or necessary research reuse;
- `COUNSEL_REVIEW` — specialist publishing/IP advice is required before signature.

No book status should move from `submitted` to `contracted` until every scope, translation, repository, code, figure, teaching and derivative-work item has an explicit state.
