/**
 * ═══════════════════════════════════════════════════════════════════
 *  INDEX — Exports unificado de la biblioteca de patrones
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Importación directa (tree-shakeable):
 *  import { SistemaRAG } from 'patrones-agentes-ia'
 *  import { DefensorPromptInjection } from 'patrones-agentes-ia'
 *
 *  Importación por categoría:
 *  import { agenticos, seguridad, qa } from 'patrones-agentes-ia'
 *
 *  79 patrones exportados en 10 categorías.
 */

// ── Utilidades comunes ────────────────────────────────────────────
export { makeClient, paso, isDirectRun, DEFAULT_MODEL } from "./common.js";

// ── GRUPO 1: Patrones Agénticos Clásicos (1–8) ───────────────────
export { escribirPost } from "./pattern_1_pipeline.js";
export { atenderConsulta } from "./pattern_2_router.js";
export { responderConReflexion } from "./pattern_3_reflection.js";
export { mejorarConCritica } from "./pattern_4_evaluator_optimizer.js";
export { responderConHerramientas } from "./pattern_5_tool_use.js";
export { planificarTarea } from "./pattern_6_planning.js";
export { procesarMultiAgent } from "./pattern_7_multi_agent.js";
export { procesarConAprobacionHumana } from "./pattern_8_human_in_loop.js";

// ── GRUPO 2: Patrones Creacionales GoF (9, 10, 29, 30) ──────────
export { FabricaAgentes } from "./pattern_9_factory.js";
export { ConstructorPrompt } from "./pattern_10_builder.js";
export { FabricaAgentesLLM, FabricaAgentesReglas } from "./pattern_29_abstract_factory.js";
export { AgentePrototype, RegistryPrototipos } from "./pattern_30_prototype.js";

// ── GRUPO 3: Patrones Estructurales GoF (11–19, 31, 32) ──────────
export { GestorAdaptadores } from "./pattern_11_adapter.js";
export { DecoradorLogging, DecoradorRetry, DecoradorCache } from "./pattern_12_decorator.js";
export { GeneradorConEstrategia } from "./pattern_13_strategy.js";
export { CadenaSoporteFactory } from "./pattern_14_chain.js";
export { GestorAgentesGlobal, PoolConexionesLLM } from "./pattern_15_singleton.js";
export { SistemaAgenticoCompleto } from "./pattern_16_facade.js";
export { TareaSimple, TareaCompuesta } from "./pattern_17_composite.js";
export { AgenteObservable, ObservadorLogger, ObservadorMonitor } from "./pattern_18_observer.js";
export { AgenteConEstado } from "./pattern_19_state.js";
export { AgenteAnalisis, AgenteGenerador } from "./pattern_31_bridge.js";
export { PoolAgentes } from "./pattern_32_flyweight.js";

// ── GRUPO 4: Patrones de Comportamiento GoF (20–24, 33–35) ───────
export { ColaComandos, ComandoGenerarTexto } from "./pattern_20_command.js";
export { ProxyAgenteControlado, ProxyAgenteLazy } from "./pattern_21_proxy.js";
export { AgenteConMemento, GestorHistorial } from "./pattern_22_memento.js";
export { MediadorCentral, AgenteConMediator } from "./pattern_23_mediator.js";
export { GeneradorBlog, GeneradorResumen, GeneradorEmail } from "./pattern_24_template_method.js";
export { InterpreteWorkflow, ParserDSL } from "./pattern_33_interpreter.js";
export { HistorialResultados, IteradorResultados } from "./pattern_34_iterator.js";
export { VisitorContador, VisitorEstimador, VisitorDescriptor } from "./pattern_35_visitor.js";

// ── GRUPO 5: Patrones Agénticos Emergentes Core (25–28) ──────────
export { SistemaRAG } from "./pattern_25_rag.js";
export { GeneradorChainOfThought } from "./pattern_26_chain_of_thought.js";
export { AgenteConLoopIterativo } from "./pattern_27_agentic_loop.js";
export { AgenteConFunctionCalling, RegistroFunciones } from "./pattern_28_function_calling.js";

// ── GRUPO 6: Razonamiento Avanzado (36, 42, 54, 55, 61, 62, 68) ──
export { TreeOfThought } from "./pattern_36_tree_of_thought.js";
export { SelfConsistency } from "./pattern_42_self_consistency.js";
export { AgenteREACT, HerramientasREACT } from "./pattern_54_react.js";
export { AgenteConScratchpad } from "./pattern_55_scratchpad.js";
export { FewShotPrompter } from "./pattern_61_few_shot.js";
export { AgenteConstitucional, CONSTITUCION_ESTANDAR } from "./pattern_62_constitutional_ai.js";
export { ZeroShotCoT } from "./pattern_68_zero_shot_cot.js";

// ── GRUPO 7: Recuperación de Información (37, 41, 66) ────────────
export { GrafoConocimiento, AgenteConKnowledgeGraph } from "./pattern_37_knowledge_graph.js";
export { RecuperadorConReranking } from "./pattern_41_retrieval_ranking.js";
export { CompresorContextual } from "./pattern_66_contextual_compression.js";

// ── GRUPO 8: Especialización y Routing (38–40) ───────────────────
export { MixtureOfExperts } from "./pattern_38_mixture_of_experts.js";
export { CascadaModelos } from "./pattern_39_cascade.js";
export { SistemaBranching } from "./pattern_40_branching.js";

// ── GRUPO 9: Confiabilidad y Resiliencia (43–47) ─────────────────
export { EnsembleAgentes } from "./pattern_43_ensemble.js";
export { AgenteConCheckpointing, GestorCheckpoints } from "./pattern_44_checkpointing.js";
export { CircuitBreaker, GestorCircuitBreakers } from "./pattern_45_circuit_breaker.js";
export { Bulkhead, GestorBulkheads } from "./pattern_46_bulkhead.js";
export { RetryWithBackoff, conRetry } from "./pattern_47_retry_backoff.js";

// ── GRUPO 10: Optimización de Costos (48, 49, 67) ────────────────
export { AgenteConCacheSemantica, CacheSemantica } from "./pattern_48_semantic_cache.js";
export { CompresorContexto } from "./pattern_49_prompt_compression.js";
export { OutputParserRegistry, ListParser, KeyValueParser, TableParser } from "./pattern_67_output_parsers.js";

// ── GRUPO 11: Versatilidad (50) ────────────────────────────────────
export { ProcesadorMultiModal } from "./pattern_50_multi_modal.js";

// ── GRUPO 12: Memoria y Contexto (51, 52) ─────────────────────────
export { AgenteConMemoriaLP, MemoriaLargoPlazo } from "./pattern_51_long_term_memory.js";
export { AgenteConGrounding, VerificadorGrounding } from "./pattern_52_grounding.js";

// ── GRUPO 13: Seguridad y Fiabilidad (53, 58, 59) ─────────────────
export { AgenteConGuardrails, GuardrailInput, GuardrailOutput } from "./pattern_53_guardrails.js";
export { GestorRollback } from "./pattern_58_rollback.js";
export { ValidadorEstructurado, SchemaPlan, SchemaAnalisis } from "./pattern_59_structured_output.js";

// ── GRUPO 14: Coordinación Multi-Agente Avanzada (56, 57, 60, 63, 65) ─
export { SwarmCoordinador, AgenteSwarm } from "./pattern_56_agent_swarm.js";
export { GestorDelegacion } from "./pattern_57_task_delegation.js";
export { Orquestador, WorkerEspecializado } from "./pattern_60_orchestrator_workers.js";
export { SistemaDebate } from "./pattern_63_debate.js";
export { AgentRegistry } from "./pattern_65_agent_registry.js";

// ── GRUPO 15: Personalización (64) ────────────────────────────────
export { AgenteConPersona, PERSONAS } from "./pattern_64_persona.js";

// ── GRUPO 16: Ciberseguridad (69–72) ─────────────────────────────
export { DefensorPromptInjection, AgenteSeguro } from "./pattern_69_prompt_injection_defense.js";
export { TestadorRobustez, GeneradorAdversarial } from "./pattern_70_adversarial_robustness.js";
export { DetectorSecretos, PipelineSecureLog } from "./pattern_71_secret_detection.js";
export { MotorControlAcceso } from "./pattern_72_access_control.js";

// ── GRUPO 17: QA y Calidad (73–76) ────────────────────────────────
export { JuezLLM, RUBRICA_ESTANDAR } from "./pattern_73_llm_as_judge.js";
export { RedTeamAgent } from "./pattern_74_red_teaming.js";
export { ABTestingPrompts } from "./pattern_75_ab_testing.js";
export { SuiteRegresionLLM } from "./pattern_76_regression_testing.js";

// ── GRUPO 18: Producción (77–79) ──────────────────────────────────
export { Tracer, AgenteInstrumentado } from "./pattern_77_observability.js";
export { GestorTokenBudget, AgenteConBudget } from "./pattern_78_token_budget.js";
export { StreamProcessor, AgenteConStreaming, TRANSFORMADORES } from "./pattern_79_streaming.js";

// ── GRUPO 19: Resiliencia Multi-Proveedor e Interoperabilidad (80–84) ─
export { RateLimiter } from "./pattern_80_rate_limiting.js";
export { FallbackMultiProveedor, RateLimitError } from "./pattern_81_model_fallback.js";
export { crearServidorPatrones, CATALOGO_PATRONES } from "./pattern_82_mcp_server.js";
export { descubrirHerramientas, aEsquemaFunctionCalling } from "./pattern_83_dynamic_tool_discovery.js";
export { ejecutarEnSandbox } from "./pattern_84_code_sandboxing.js";

// ── GRUPO 20: Coordinación Emergente y Privacidad (85–89) ────────
export { RegistroIdempotencia } from "./pattern_85_idempotency_keys.js";
export { CompactadorContexto } from "./pattern_86_context_compaction.js";
export { Blackboard } from "./pattern_87_blackboard.js";
export { BatchProcessor } from "./pattern_88_batching.js";
export { AnonimizadorPII } from "./pattern_89_pii_redaction.js";

// ── GRUPO 21: Operación en Producción (90–94) ────────────────────
export { CanaryRelease } from "./pattern_90_canary_release.js";
export { OptimizadorPrompts } from "./pattern_91_meta_prompting.js";
export { RastreadorCostos } from "./pattern_92_cost_attribution.js";
export { ejecutarSpeculativo } from "./pattern_93_speculative_execution.js";
export { MonitorSalud } from "./pattern_94_health_check.js";

// ── GRUPO 22: Experiencia de Usuario (95–99) ─────────────────────
export { MotorEscalacion } from "./pattern_95_human_escalation.js";
export { GestorClarificacion } from "./pattern_96_clarification_loop.js";
export { AprendizPreferencias } from "./pattern_97_preference_learning.js";
export { GestorCitas } from "./pattern_98_citation_attribution.js";
export { GeneradorDatosSinteticos } from "./pattern_99_synthetic_data.js";

// ── GRUPO 23: Seguridad de Agentes Autónomos (100–102) ───────────
export { SanitizadorSalidaHerramienta } from "./pattern_100_tool_output_sanitization.js";
export { ValidadorLlamadasHerramienta } from "./pattern_101_tool_call_validation.js";
export { ArenaAdversarial, AgenteAtacante, AgenteJuez } from "./pattern_102_adversarial_training_loop.js";

// ── Re-exports agrupados por dominio ─────────────────────────────
export const seguridad = {
  DefensorPromptInjection: "pattern_69",
  TestadorRobustez: "pattern_70",
  DetectorSecretos: "pattern_71",
  MotorControlAcceso: "pattern_72",
} as const;

export const qa = {
  JuezLLM: "pattern_73",
  RedTeamAgent: "pattern_74",
  ABTestingPrompts: "pattern_75",
  SuiteRegresionLLM: "pattern_76",
} as const;

export const produccion = {
  Tracer: "pattern_77",
  GestorTokenBudget: "pattern_78",
  StreamProcessor: "pattern_79",
} as const;

export const interoperabilidad = {
  RateLimiter: "pattern_80",
  FallbackMultiProveedor: "pattern_81",
  crearServidorPatrones: "pattern_82",
  descubrirHerramientas: "pattern_83",
  ejecutarEnSandbox: "pattern_84",
} as const;

export const coordinacionYPrivacidad = {
  RegistroIdempotencia: "pattern_85",
  CompactadorContexto: "pattern_86",
  Blackboard: "pattern_87",
  BatchProcessor: "pattern_88",
  AnonimizadorPII: "pattern_89",
} as const;

export const operacionProduccion = {
  CanaryRelease: "pattern_90",
  OptimizadorPrompts: "pattern_91",
  RastreadorCostos: "pattern_92",
  ejecutarSpeculativo: "pattern_93",
  MonitorSalud: "pattern_94",
} as const;

export const experienciaUsuario = {
  MotorEscalacion: "pattern_95",
  GestorClarificacion: "pattern_96",
  AprendizPreferencias: "pattern_97",
  GestorCitas: "pattern_98",
  GeneradorDatosSinteticos: "pattern_99",
} as const;

export const seguridadAgentes = {
  SanitizadorSalidaHerramienta: "pattern_100",
  ValidadorLlamadasHerramienta: "pattern_101",
  ArenaAdversarial: "pattern_102",
} as const;
