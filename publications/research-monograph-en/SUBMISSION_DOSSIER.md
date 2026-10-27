# Submission Dossier — Research Monograph (EN)

## Working title

**Architectural Design Patterns for Edge and Generative AI**  
*A Pattern Language for Agentic, Distributed, Reliable and Secure AI Systems*

## One-sentence pitch

A research-oriented pattern language for engineering AI-intensive systems in which probabilistic model behaviour is constrained by explicit architectural boundaries for tools, evidence, distributed execution, security, reliability and evaluation.

## 150-word editor pitch

Generative-AI systems are increasingly assembled from retrieval, tools, agent loops, multi-agent coordination, external protocols and distributed infrastructure, yet the literature and practitioner ecosystem still describe many of these mechanisms as isolated techniques. This monograph proposes a coherent architectural pattern language for AI-intensive systems. It connects agentic control, Model Context Protocol and tool boundaries, context and RAG architectures, reasoning/evaluator loops, multi-agent coordination, resilience, security, observability and cost governance. The contribution is not a catalogue translation: patterns are treated as composable architectural hypotheses with explicit forces, failure modes, evidence boundaries and validation strategies. Two original application domains—Edge–Mesh–Cloud placement and high-dependability vehicular/C-V2X systems—are used to expose latency, trust, recovery and coordination trade-offs that are difficult to see in cloud-only demos. The companion open repository provides 102 executable TypeScript implementations, tests and an evidence registry, enabling reproducibility while the book develops the independent research argument.

## Primary readership

- researchers in generative AI, AI agents and AI engineering;
- software and solution architects designing production AI systems;
- distributed-systems and edge-computing researchers;
- security/reliability researchers working on AI-enabled systems;
- doctoral and advanced postgraduate students.

## Unique contribution

The USP is the **system-level composition** of AI patterns. Existing material often explains prompting, RAG, agents, reliability or security separately. This book studies how those concerns interact and where deterministic controls must surround probabilistic components. Each chapter asks a research question, defines architectural forces, maps patterns to measurable properties, identifies invalid extrapolations and ends with a validation protocol.

## Planned evidence model

The monograph distinguishes four evidence levels:

1. **Primary literature or standard** — supports origin, terminology or a bounded empirical result.
2. **Repository implementation** — demonstrates executable feasibility, not universal superiority.
3. **Controlled experiment** — measures a defined composition under a declared workload and environment.
4. **Cross-case synthesis** — supports a more general architectural claim only when evidence from multiple cases justifies it.

No benchmark percentage is promoted to a general pattern claim without an identified experiment and reproducible context.

## Proposed sample chapters

### Sample A — Chapter 3: Tool Ecosystems and Model Context Protocol

Why this is a strong acquisitions sample: it is timely, technically concrete and demonstrates the book's core method. It links Tool Use, Function Calling, Agent Registry, MCP Server, Dynamic Tool Discovery, Code Sandboxing, Tool Output Sanitization and Tool Call Validation. The chapter treats MCP as a protocol boundary rather than a security guarantee and develops capability, validation and provenance controls around it.

Prepared file: `samples/03-tool-ecosystems-and-mcp.md`.

### Sample B — Chapter 10: Edge–Mesh–Cloud AI Architectures

Why this is a strong second sample: it shows original differentiation from generic agent books. It develops placement, coordination, observability, fallback and resilience decisions across edge, mesh and cloud layers and defines a validation plan for latency, availability, bandwidth and semantic quality.

Prepared file: `samples/10-edge-mesh-cloud-ai-architectures.md`.

## Publisher-specific routing

### Springer Nature

Initial package: adapt `BOOK_PROPOSAL.md` to the current Springer Nature book-idea form, using this dossier for the short pitch, audience, differentiation and author expertise. Do not force an LNCS label at first contact; request the publishing editor's recommendation on monograph/series fit.

### CRC Press / Taylor & Francis

Initial action: identify the current Commissioning Editor for AI/computer science/software systems and submit to one editor. Convert this dossier into the subject-specific form supplied by the editor. Emphasize USP, demand, market, competing works and the book's research/practitioner bridge.

### Wiley-IEEE Press

Initial package: map this dossier into the current **IEEE Press Professional Book Proposal Form**. Emphasize systems engineering, dependable AI, distributed/edge architecture and the vehicular/C-V2X case. Use the current IEEE Author Center submission address/form, not a copied historical contact.

## Manuscript targets for proposal purposes

These are planning ranges, not publisher commitments:

- 12 research chapters plus front/back matter;
- approximately 95,000–115,000 words;
- approximately 70–100 original figures/tables, depending on final experimental content;
- code excerpts kept selective; full executable code remains in the companion repository;
- delivery target: 9–12 months after contract, subject to the agreed publisher schedule and experimental workload.

## Competing-title analysis protocol

Before each external submission, add at least five current books from the target publisher and wider market, then compare them on: audience, scope, treatment of agents, MCP/tools, distributed execution, security, reliability, empirical validation and open companion artefacts. The final proposal should never claim “there are no competing books”. The defensible claim is that this project combines concerns that are normally fragmented and validates their composition at system level.

## Author-positioning points

The author bio used for acquisitions should foreground only verifiable, relevant credentials: teaching/research in cybersecurity, AI, distributed systems and software engineering; doctoral research related to distributed/AI architectures; peer-reviewed publications relevant to AI/edge/distributed systems; and experience building or supervising real technical systems. Institution names and current roles must be checked immediately before submission so the proposal reflects the author's then-current affiliations.

## Submission gate

The proposal is ready to send only when:

- the publisher's current submission page/form has been rechecked;
- the proposal is adapted to that publisher rather than reused unchanged;
- two sample chapters have passed technical and language review;
- all claims in the samples are referenced or clearly marked as proposed experiments;
- competing-title analysis has been updated in the preceding 30 days;
- figures have provenance and rights metadata;
- the rights checklist has been reviewed;
- no active exclusive submission/contract conflicts with the route.
