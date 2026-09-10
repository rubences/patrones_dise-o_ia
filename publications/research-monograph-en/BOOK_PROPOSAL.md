# Book Proposal — Research Monograph (EN)

## Working title

**Architectural Design Patterns for Edge and Generative AI**  
*A Pattern Language for Agentic, Distributed, Reliable and Secure AI Systems*

## One-sentence proposition

A research monograph that turns recurring solutions for generative and agentic AI into an explicit architectural pattern language spanning reasoning, tools, knowledge, multi-agent coordination, reliability, security, evaluation and Edge-Mesh-Cloud execution.

## Why this book now

Generative AI engineering has moved from isolated prompts toward systems composed of retrieval, tools, evaluators, memory, agents, safety controls and distributed runtime infrastructure. The field has many frameworks and rapidly changing APIs, but architectural decisions remain difficult to compare, reproduce and validate. This book addresses that gap by treating recurring structures as composable patterns with explicit forces, quality attributes, failure modes, evidence and validation boundaries.

The work is not a catalogue dump and is not an English translation of the Spanish teaching manual. It develops a research argument: **AI-intensive systems require a pattern language that connects probabilistic model behavior to deterministic software controls and distributed-systems quality attributes.**

## Distinctive contribution

The monograph will:

- define a normalized pattern language for AI-intensive architecture;
- connect agentic patterns with classical architecture and distributed-systems mechanisms;
- separate empirical evidence from illustrative implementation;
- define composition rules and incompatibilities between patterns;
- model authority boundaries for tool-using agents and MCP ecosystems;
- treat security, observability, resilience and cost as architectural concerns rather than appendices;
- develop original Edge-Mesh-Cloud and high-dependability vehicular/C-V2X case studies;
- propose benchmark, ablation and adversarial methods for validating both individual patterns and pattern compositions.

## Audience

Primary readers are AI/ML systems researchers, software and solution architects, distributed-systems engineers, security engineers, and researchers working on agentic AI. Secondary readers include doctoral students, advanced postgraduate students, technical leads and practitioners who need a rigorous bridge between AI research and production architecture.

## Reader prerequisites

Readers should understand software architecture, APIs and basic machine learning/LLM concepts. Distributed systems, Kubernetes and security knowledge are useful for later chapters but are introduced at the level needed to follow the architectural argument.

## Competing and adjacent literature

The market contains books on prompt engineering, LLM application development, MLOps, distributed systems and classical software design patterns. The proposed differentiation is the **cross-layer pattern language**: it does not organize the material around one framework or vendor and does not stop at prompt techniques. It links model-level uncertainty to control flow, evidence, security, observability, failure containment, cost and distributed placement.

A formal competing-title analysis will be refreshed immediately before proposal submission because the GenAI book market changes rapidly.

## Structure

The planned 12-chapter structure is maintained in `publication.json` and `OUTLINE.md`. The progression is:

1. pattern language and research method;
2. agentic control;
3. tools and MCP;
4. knowledge/context;
5. reasoning/evaluation;
6. multi-agent coordination;
7. reliability;
8. security/safety;
9. observability/evaluation/FinOps;
10. Edge-Mesh-Cloud;
11. vehicular/C-V2X high-dependability exemplar;
12. empirical validation and research agenda.

## Evidence and methodology

The repository maintains a versioned primary-evidence registry and explicit scope notes. The book will distinguish four evidence classes: normative standards/official specifications, primary research papers, reproducible repository demonstrations, and new experiments produced for the monograph. Benchmark results will be reported with model/runtime configuration, datasets, metrics, uncertainty where applicable and threats to validity.

No benchmark result will be presented as a universal property of a pattern.

## Companion artefacts

Subject to the publishing contract, the companion project will provide:

- the 102-pattern open reference website;
- TypeScript reference implementations;
- machine-readable taxonomy and relationships;
- evidence registry;
- reproducible tests and selected experiments;
- versioned release manifests and hashes.

The commercial manuscript remains editorially distinct from the generated open reference edition.

## Author profile

Rubén Juárez Cádiz works across cybersecurity, artificial intelligence, distributed systems, software engineering and higher education. His research and applied work includes generative AI, agentic architectures, blockchain/distributed services, Edge-Mesh-Cloud systems and secure high-dependability environments. The final proposal will include the publisher-specific short biography, selected publications, ORCID and evidence most relevant to the target series.

## Proposed length and illustrations

Target planning range: **90,000–115,000 words**, approximately 250–350 final pages depending on format, with 50–80 original diagrams/tables and a curated subset of executable examples. Exact length will be negotiated with the commissioning editor.

## Development plan

- Proposal package and competing-title refresh.
- Two sample chapters: Chapter 3 (MCP/tool ecosystems) and Chapter 10 (Edge-Mesh-Cloud).
- Evidence expansion and systematic source verification.
- Full first draft.
- Technical review by AI architecture, security and distributed-systems reviewers.
- Reproducibility pass and rights/figure audit.
- Publisher submission and revision.

A detailed delivery schedule will only be committed after an editor confirms scope and target length.

## Candidate routes

Initial routes to evaluate are Springer Nature's Computer Science book programme, CRC Press/Routledge, and a Wiley/IEEE Press route where subject fit is confirmed. Series selection is an editorial-fit decision; inclusion here is not a claim of acceptance or ranking.

## Related work disclosure

A separate Spanish university manual is planned from the same open technical substrate. It has a different audience, chapter architecture, examples, code stack, exercises, figures and pedagogical purpose. Both proposals will disclose the related project when requested and will be checked against `../common/EDITORIAL_REUSE_AND_RIGHTS.md` before contract signature.
