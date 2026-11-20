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
 *  270 patrones exportados en 32 macrofamilias.
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

// ── GRUPO 24: AI Platforms & Factories (103–104) ──
export { AIFactory } from "./pattern_103_ai_factory.js";
export { CognitiveCore } from "./pattern_104_agent_brain_cognitive_core.js";
// ── GRUPO 25: Development Governance (105–106) ──
export { SpecDrivenLifecycle } from "./pattern_105_spec_driven_development.js";
export { GraphDrivenDevelopment } from "./pattern_106_graph_driven_development.js";
// ── GRUPO 26: Data & Graph Foundations / Advanced RAG (107–114) ──
export { OpenDataLakehouse } from "./pattern_107_open_data_lakehouse.js";
export { FederatedMetadataFabric } from "./pattern_108_federated_metadata_fabric.js";
export { TypedKnowledgeGraph } from "./pattern_109_typed_knowledge_graph.js";
export { GraphRAG } from "./pattern_110_graphrag.js";
export { AdaptiveGraphRAGRouter } from "./pattern_111_adaptive_graphrag_router.js";
export { RaptorIndex } from "./pattern_112_hierarchical_retrieval_raptor.js";
export { SelfRAGController } from "./pattern_113_self_rag.js";
export { CorrectiveRAG } from "./pattern_114_corrective_rag.js";
// ── GRUPO 27: Model Adaptation & PEFT (115–122) ──
export { LoRAConfig } from "./pattern_115_lora.js";
export { QLoRAConfig } from "./pattern_116_qlora.js";
export { AdaLoRAAllocator } from "./pattern_117_adalora.js";
export { DoRAConfig } from "./pattern_118_dora.js";
export { PiSSAConfig } from "./pattern_119_pissa.js";
export { LoRAPlusConfig } from "./pattern_120_lora_plus.js";
export { RankStabilizedLoRA } from "./pattern_121_rslora.js";
export { LoftQConfig } from "./pattern_122_loftq.js";

// P8: reference implementations (canonical P8 additions: patterns 123–134)
export { MCPCapabilityAdapter } from "./pattern_123_mcp_capability_adapter.js";
export { MCPPolicyGateway } from "./pattern_124_mcp_policy_gateway.js";
export { TrustedToolRegistry } from "./pattern_125_trusted_tool_registry.js";
export { ExplicitWorkflowHandle } from "./pattern_126_explicit_workflow_handle.js";
export { MRTRHumanElicitation } from "./pattern_127_mrtr_human_elicitation.js";
export { HostControlledSampling } from "./pattern_128_host_controlled_sampling.js";
export { A2AAgentCardTrust } from "./pattern_129_a2a_agent_card_trust.js";
export { A2ATaskLifecycle } from "./pattern_130_a2a_task_lifecycle.js";
export { MCPA2ABridge } from "./pattern_131_mcp_a2a_bridge.js";
export { ToolPoisoningDefense } from "./pattern_132_tool_poisoning_defense.js";
export { ArgumentAwareLeastPrivilege } from "./pattern_133_argument_aware_least_privilege.js";
export { CrossProtocolTraceContext } from "./pattern_134_cross_protocol_trace_context.js";

// P9 experimental architectural contracts (not production-grade integrations)
export { Pattern135Contract } from "./pattern_135_episodic_memory_consolidation.js";
export { Pattern136Contract } from "./pattern_136_semantic_memory_distillation.js";
export { Pattern137Contract } from "./pattern_137_experience_replay.js";
export { Pattern138Contract } from "./pattern_138_selective_forgetting.js";
export { Pattern139Contract } from "./pattern_139_memory_provenance.js";
export { Pattern140Contract } from "./pattern_140_temporal_memory_decay.js";
export { Pattern141Contract } from "./pattern_141_continual_learning_gate.js";
export { Pattern142Contract } from "./pattern_142_cross_trajectory_abstraction.js";
export { Pattern143Contract } from "./pattern_143_ai_risk_register.js";
export { Pattern144Contract } from "./pattern_144_evidence_backed_assurance_case.js";
export { Pattern145Contract } from "./pattern_145_policy_to_control_traceability.js";
export { Pattern146Contract } from "./pattern_146_human_accountability_gate.js";
export { Pattern147Contract } from "./pattern_147_model_and_data_card_registry.js";
export { Pattern148Contract } from "./pattern_148_regulatory_change_impact.js";
export { Pattern149Contract } from "./pattern_149_conformity_evidence_ledger.js";
export { Pattern150Contract } from "./pattern_150_independent_safety_review.js";
export { IssueToPatchWorkflow } from "./pattern_151_issue_to_patch_workflow.js";
export { RepositoryContextMapper } from "./pattern_152_repository_context_mapper.js";
export { TestFirstRepairAgent } from "./pattern_153_test_first_repair_agent.js";
export { IndependentCodeVerifier } from "./pattern_154_independent_code_verifier.js";
export { AgenticPRReviewGate } from "./pattern_155_agentic_pr_review_gate.js";
export { CIFailureTriage } from "./pattern_156_ci_failure_triage.js";
export { SandboxedCodeExecution } from "./pattern_157_sandboxed_code_execution.js";
export { ControlledDeploymentPromotion } from "./pattern_158_controlled_deployment_promotion.js";
export { Pattern159Contract } from "./pattern_159_data_contract_gate.js";
export { Pattern160Contract } from "./pattern_160_dataset_lineage_graph.js";
export { Pattern161Contract } from "./pattern_161_schema_drift_sentinel.js";
export { Pattern162Contract } from "./pattern_162_label_quality_audit.js";
export { Pattern163Contract } from "./pattern_163_data_contamination_firewall.js";
export { Pattern164Contract } from "./pattern_164_synthetic_data_quality_gate.js";
export { Pattern165Contract } from "./pattern_165_dataset_version_pinning.js";
export { Pattern166Contract } from "./pattern_166_distribution_shift_monitor.js";
export { Pattern167Contract } from "./pattern_167_adaptive_edge_inference.js";
export { Pattern168Contract } from "./pattern_168_model_partitioning.js";
export { Pattern169Contract } from "./pattern_169_offline_first_agent.js";
export { Pattern170Contract } from "./pattern_170_energy_aware_model_router.js";
export { Pattern171Contract } from "./pattern_171_federated_update_gate.js";
export { Pattern172Contract } from "./pattern_172_edge_cache_consistency.js";
export { Pattern173Contract } from "./pattern_173_bandwidth_aware_context.js";
export { Pattern174Contract } from "./pattern_174_edge_to_cloud_failover.js";
export { Pattern175Contract } from "./pattern_175_causal_intervention_planner.js";
export { Pattern176Contract } from "./pattern_176_structural_causal_model_adapter.js";
export { Pattern177Contract } from "./pattern_177_neural_symbolic_constraint_gate.js";
export { Pattern178Contract } from "./pattern_178_counterfactual_evaluation.js";
export { Pattern179Contract } from "./pattern_179_symbolic_proof_trace.js";
export { Pattern180Contract } from "./pattern_180_world_model_rollout.js";
export { Pattern181Contract } from "./pattern_181_causal_confounder_check.js";
export { Pattern182Contract } from "./pattern_182_uncertainty_aware_planning.js";
export { BoundedAgentIteration } from "./pattern_183_bounded_agent_iteration.js";
export { ReadOnlyParallelFanout } from "./pattern_184_read_only_parallel_fanout.js";
export { ControlledWriteBarrier } from "./pattern_185_controlled_write_barrier.js";
export { ResumableAgentSession } from "./pattern_186_resumable_agent_session.js";
export { TwoStageContextCompaction } from "./pattern_187_two_stage_context_compaction.js";
export { ToolOutputArtifactStore } from "./pattern_188_tool_output_artifact_store.js";
export { TrajectoryRetentionPolicy } from "./pattern_189_trajectory_retention_policy.js";
export { RuntimeCapabilityLease } from "./pattern_190_runtime_capability_lease.js";

export * from "./pattern_191_differential_privacy_budget_gate.js";
export * from "./pattern_192_confidential_inference_boundary.js";
export * from "./pattern_193_private_retrieval_policy.js";
export * from "./pattern_194_secure_aggregation_coordinator.js";
export * from "./pattern_195_pii_minimization_pipeline.js";
export * from "./pattern_196_privacy_preserving_telemetry.js";
export * from "./pattern_197_consent_aware_data_processing.js";
export * from "./pattern_198_privacy_attack_evaluation.js";
export * from "./pattern_199_sensor_fusion_confidence_gate.js";
export * from "./pattern_200_perception_to_action_contract.js";
export * from "./pattern_201_embodied_safety_envelope.js";
export * from "./pattern_202_temporal_multimodal_alignment.js";
export * from "./pattern_203_robot_skill_invocation.js";
export * from "./pattern_204_physical_world_state_estimator.js";
export * from "./pattern_205_simulation_to_reality_validation.js";
export * from "./pattern_206_human_override_for_embodied_agents.js";
export * from "./pattern_207_hypothesis_registry.js";
export * from "./pattern_208_experiment_design_agent.js";
export * from "./pattern_209_reproducible_run_manifest.js";
export * from "./pattern_210_statistical_validity_gate.js";
export * from "./pattern_211_automated_replication_workflow.js";
export * from "./pattern_212_scientific_provenance_graph.js";
export * from "./pattern_213_active_learning_experiment_selector.js";
export * from "./pattern_214_evidence_to_claim_calibration.js";
export * from "./pattern_215_multi_agent_budget_allocation.js";
export * from "./pattern_216_incentive_compatible_task_auction.js";
export * from "./pattern_217_agent_cost_attribution.js";
export * from "./pattern_218_resource_bidding_policy.js";
export * from "./pattern_219_fair_allocation_constraint.js";
export * from "./pattern_220_market_manipulation_sentinel.js";
export * from "./pattern_221_value_of_information_router.js";
export * from "./pattern_222_economic_outcome_audit.js";

export * from "./pattern_223_agent_behavior_trace_schema.js";
export * from "./pattern_224_decision_attribution_probe.js";
export * from "./pattern_225_tool_call_drift_detector.js";
export * from "./pattern_226_semantic_latency_decomposer.js";
export * from "./pattern_227_agent_failure_taxonomy_mapper.js";
export * from "./pattern_228_behavioral_regression_sentinel.js";
export * from "./pattern_229_multi_agent_causal_trace_joiner.js";
export * from "./pattern_230_observability_coverage_gate.js";
export * from "./pattern_231_synthetic_data_provenance_tag.js";
export * from "./pattern_232_privacy_leakage_similarity_gate.js";
export * from "./pattern_233_synthetic_to_real_distribution_audit.js";
export * from "./pattern_234_scenario_coverage_generator.js";
export * from "./pattern_235_counterfactual_scenario_sampler.js";
export * from "./pattern_236_synthetic_label_quality_gate.js";
export * from "./pattern_237_simulation_fidelity_contract.js";
export * from "./pattern_238_synthetic_dataset_release_gate.js";
export * from "./pattern_239_model_artifact_provenance_attestation.js";
export * from "./pattern_240_dataset_lineage_signature_gate.js";
export * from "./pattern_241_prompt_package_integrity_lock.js";
export * from "./pattern_242_inference_dependency_sbom.js";
export * from "./pattern_243_model_weight_tamper_sentinel.js";
export * from "./pattern_244_third_party_model_license_gate.js";
export * from "./pattern_245_secure_model_rollback.js";
export * from "./pattern_246_training_pipeline_attestation.js";
export * from "./pattern_247_cognitive_load_aware_delegation.js";
export * from "./pattern_248_human_expertise_routing.js";
export * from "./pattern_249_explanation_depth_negotiation.js";
export * from "./pattern_250_human_disagreement_escalation.js";
export * from "./pattern_251_adaptive_autonomy_lease.js";
export * from "./pattern_252_operator_trust_calibration.js";
export * from "./pattern_253_collaborative_decision_provenance.js";
export * from "./pattern_254_human_feedback_bias_sentinel.js";
export * from "./pattern_255_agent_transition_invariant_checker.js";
export * from "./pattern_256_temporal_policy_monitor.js";
export * from "./pattern_257_model_output_contract_proof_obligation.js";
export * from "./pattern_258_runtime_safety_shield.js";
export * from "./pattern_259_formal_tool_effect_specification.js";
export * from "./pattern_260_bounded_agent_state_explorer.js";
export * from "./pattern_261_policy_conflict_satisfiability_gate.js";
export * from "./pattern_262_proof_carrying_agent_action.js";
export * from "./pattern_263_ontology_change_proposal_agent.js";
export * from "./pattern_264_entity_resolution_evidence_gate.js";
export * from "./pattern_265_knowledge_graph_contradiction_resolver.js";
export * from "./pattern_266_schema_evolution_compatibility_guard.js";
export * from "./pattern_267_knowledge_freshness_decay_policy.js";
export * from "./pattern_268_graph_provenance_reconciliation.js";
export * from "./pattern_269_ontology_alignment_confidence_gate.js";
export * from "./pattern_270_knowledge_repair_human_approval.js";
export * from "./pattern_271_reasoning_effort_budget_scheduler.js";
export * from "./pattern_272_adaptive_test_time_compute_gate.js";
export * from "./pattern_273_early_exit_confidence_controller.js";
export * from "./pattern_274_speculative_decoding_acceptance_gate.js";
export * from "./pattern_275_reasoning_trace_compression_contract.js";
export * from "./pattern_276_inference_cascade_escalation_policy.js";
export * from "./pattern_277_uncertainty_triggered_deliberation.js";
export * from "./pattern_278_parallel_candidate_consensus_budget.js";
export * from "./pattern_279_inference_cache_correctness_guard.js";
export * from "./pattern_280_verifier_guided_search_controller.js";
export * from "./pattern_281_agent_workload_identity_binding.js";
export * from "./pattern_282_delegated_credential_scope_attenuation.js";
export * from "./pattern_283_agent_to_agent_mutual_authentication.js";
export * from "./pattern_284_ephemeral_tool_credential_broker.js";
export * from "./pattern_285_cross_tenant_delegation_boundary.js";
export * from "./pattern_286_identity_aware_memory_access.js";
export * from "./pattern_287_credential_rotation_continuity_gate.js";
export * from "./pattern_288_delegation_chain_audit.js";
export * from "./pattern_289_agent_impersonation_detection.js";
export * from "./pattern_290_least_privilege_capability_discovery.js";
export * from "./pattern_291_context_relevance_budget_allocator.js";
export * from "./pattern_292_instruction_hierarchy_conflict_resolver.js";
export * from "./pattern_293_evidence_freshness_context_gate.js";
export * from "./pattern_294_context_window_fragmentation_planner.js";
export * from "./pattern_295_source_diversity_retrieval_selector.js";
export * from "./pattern_296_long_context_position_bias_auditor.js";
export * from "./pattern_297_retrieval_redundancy_suppressor.js";
export * from "./pattern_298_context_injection_isolation_boundary.js";
export * from "./pattern_299_task_specific_context_compiler.js";
export * from "./pattern_300_context_sufficiency_stop_rule.js";
export * from "./pattern_301_accessible_response_modality_router.js";
export * from "./pattern_302_plain_language_fidelity_gate.js";
export * from "./pattern_303_multilingual_intent_preservation.js";
export * from "./pattern_304_locale_sensitive_tool_contract.js";
export * from "./pattern_305_assistive_technology_compatibility_check.js";
export * from "./pattern_306_cultural_context_assumption_audit.js";
export * from "./pattern_307_reading_complexity_adaptive_output.js";
export * from "./pattern_308_low_bandwidth_inclusive_experience.js";
export * from "./pattern_309_language_equity_evaluation_harness.js";
export * from "./pattern_310_accessibility_regression_sentinel.js";
