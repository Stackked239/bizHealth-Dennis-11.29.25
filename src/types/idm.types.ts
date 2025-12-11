/**
 * BizHealth.ai Insights Data Model (IDM) v1.0
 *
 * This module defines the core data model for BizHealth assessments.
 * The IDM serves as the canonical source of truth for all report generation.
 *
 * Framework Structure:
 * - 4 Chapters: GE (Growth Engine), PH (Performance Health), PL (People & Leadership), RS (Resilience & Safeguards)
 * - 12 Dimensions: STR, SAL, MKT, CXP, OPS, FIN, HRS, LDG, TIN, IDS, RMS, CMP
 * - 3-5 Sub-indicators per dimension
 * - 87 questionnaire questions mapped to dimensions
 */

import { z } from 'zod';
import type {
  CategoryAnalysis,
  ChapterSummary,
  CrossCategoryInsights
} from './phase1-5.types.js';

// ============================================================================
// ENUMS AND CONSTANTS
// ============================================================================

/**
 * Chapter codes representing the 4 main assessment chapters
 */
export const ChapterCodeSchema = z.enum(['GE', 'PH', 'PL', 'RS']);
export type ChapterCode = z.infer<typeof ChapterCodeSchema>;

/**
 * Chapter names for display
 */
export const CHAPTER_NAMES: Record<ChapterCode, string> = {
  GE: 'Growth Engine',
  PH: 'Performance & Health',
  PL: 'People & Leadership',
  RS: 'Resilience & Safeguards'
};

/**
 * Dimension codes representing the 12 assessment dimensions
 */
export const DimensionCodeSchema = z.enum([
  'STR', // Strategy
  'SAL', // Sales
  'MKT', // Marketing
  'CXP', // Customer Experience
  'OPS', // Operations
  'FIN', // Financials
  'HRS', // Human Resources
  'LDG', // Leadership & Governance
  'TIN', // Technology & Innovation
  'IDS', // IT, Data & Systems
  'RMS', // Risk Management & Sustainability
  'CMP'  // Compliance
]);
export type DimensionCode = z.infer<typeof DimensionCodeSchema>;

/**
 * Dimension metadata including name, description, and chapter mapping
 */
export const DIMENSION_METADATA: Record<DimensionCode, { name: string; description: string; chapter: ChapterCode }> = {
  STR: {
    name: 'Strategy',
    description: 'Strategic planning, market positioning, and growth strategy',
    chapter: 'GE'
  },
  SAL: {
    name: 'Sales',
    description: 'Sales effectiveness, pipeline management, and revenue generation',
    chapter: 'GE'
  },
  MKT: {
    name: 'Marketing',
    description: 'Brand awareness, customer acquisition, and marketing ROI',
    chapter: 'GE'
  },
  CXP: {
    name: 'Customer Experience',
    description: 'Customer satisfaction, retention, and experience quality',
    chapter: 'GE'
  },
  OPS: {
    name: 'Operations',
    description: 'Operational efficiency, process optimization, and workflow management',
    chapter: 'PH'
  },
  FIN: {
    name: 'Financials',
    description: 'Financial health, profitability, and fiscal management',
    chapter: 'PH'
  },
  HRS: {
    name: 'Human Resources',
    description: 'Talent management, culture, and employee engagement',
    chapter: 'PL'
  },
  LDG: {
    name: 'Leadership & Governance',
    description: 'Leadership effectiveness, decision-making, and organizational governance',
    chapter: 'PL'
  },
  TIN: {
    name: 'Technology & Innovation',
    description: 'Technology adoption, innovation culture, and digital transformation',
    chapter: 'RS'
  },
  IDS: {
    name: 'IT, Data & Systems',
    description: 'IT infrastructure, data management, and cybersecurity',
    chapter: 'RS'
  },
  RMS: {
    name: 'Risk Management & Sustainability',
    description: 'Risk identification, mitigation, and business continuity',
    chapter: 'RS'
  },
  CMP: {
    name: 'Compliance',
    description: 'Regulatory compliance, policy adherence, and legal requirements',
    chapter: 'RS'
  }
};

/**
 * Finding types
 */
export const FindingTypeSchema = z.enum(['strength', 'gap', 'risk', 'opportunity']);
export type FindingType = z.infer<typeof FindingTypeSchema>;

/**
 * Recommendation horizons
 */
export const RecommendationHorizonSchema = z.enum(['90_days', '12_months', '24_months_plus']);
export type RecommendationHorizon = z.infer<typeof RecommendationHorizonSchema>;

/**
 * Score bands for performance tier classification
 */
export const ScoreBandSchema = z.enum(['Critical', 'Attention', 'Proficiency', 'Excellence']);
export type ScoreBand = z.infer<typeof ScoreBandSchema>;

/**
 * Trajectory indicators
 */
export const TrajectorySchema = z.enum(['Improving', 'Flat', 'Declining']);
export type Trajectory = z.infer<typeof TrajectorySchema>;

// ============================================================================
// META SCHEMA
// ============================================================================

/**
 * IDM Metadata
 */
export const MetaSchema = z.object({
  assessment_run_id: z.string().uuid(),
  company_profile_id: z.string().uuid(),
  created_at: z.string().datetime(),
  methodology_version: z.string().default('1.0.0'),
  scoring_version: z.string().default('1.0.0'),
  idm_schema_version: z.string().default('1.0.0')
});
export type Meta = z.infer<typeof MetaSchema>;

// ============================================================================
// BENCHMARK SCHEMA
// ============================================================================

/**
 * Peer comparison bands for benchmark classification
 */
export const PeerComparisonBandSchema = z.enum([
  'below_average',
  'average',
  'above_average',
  'top_quartile'
]);
export type PeerComparisonBand = z.infer<typeof PeerComparisonBandSchema>;

/**
 * Chapter/Dimension benchmark data for comparative analysis
 */
export const BenchmarkSchema = z.object({
  peer_percentile: z.number().min(0).max(100),
  band_description: z.string(),
  industry_average: z.number().min(0).max(100).optional(),
  peer_comparison_band: PeerComparisonBandSchema.optional(),
  benchmark_narrative: z.string().optional()
}).optional();
export type Benchmark = z.infer<typeof BenchmarkSchema>;

/**
 * Overall benchmark data for scores summary
 */
export const OverallBenchmarkSchema = z.object({
  percentile_rank: z.number().min(0).max(100),
  industry_benchmark: z.number().min(0).max(100),
  peer_group_description: z.string(),
  peer_group_size: z.number().int().positive(),
  benchmark_narrative: z.string()
}).optional();
export type OverallBenchmark = z.infer<typeof OverallBenchmarkSchema>;

// ============================================================================
// CHAPTER SCHEMA
// ============================================================================

/**
 * Chapter representing a major assessment grouping
 */
export const ChapterSchema = z.object({
  chapter_code: ChapterCodeSchema,
  name: z.string(),
  score_overall: z.number().min(0).max(100),
  score_band: ScoreBandSchema,
  benchmark: BenchmarkSchema,
  previous_score_overall: z.number().min(0).max(100).optional()
});
export type Chapter = z.infer<typeof ChapterSchema>;

// ============================================================================
// SUB-INDICATOR SCHEMA
// ============================================================================

/**
 * Sub-indicator representing a specific aspect within a dimension
 */
export const SubIndicatorSchema = z.object({
  id: z.string(),
  dimension_code: DimensionCodeSchema,
  name: z.string(),
  score: z.number().min(0).max(100),
  score_band: ScoreBandSchema.optional(),
  contributing_question_ids: z.array(z.string())
});
export type SubIndicator = z.infer<typeof SubIndicatorSchema>;

// ============================================================================
// DIMENSION SCHEMA
// ============================================================================

/**
 * Dimension representing one of 12 assessment areas
 */
export const DimensionSchema = z.object({
  dimension_code: DimensionCodeSchema,
  chapter_code: ChapterCodeSchema,
  name: z.string(),
  description: z.string(),
  score_overall: z.number().min(0).max(100),
  score_band: ScoreBandSchema,
  sub_indicators: z.array(SubIndicatorSchema),
  benchmark: BenchmarkSchema,
  previous_score_overall: z.number().min(0).max(100).optional()
});
export type Dimension = z.infer<typeof DimensionSchema>;

// ============================================================================
// QUESTION SCHEMA
// ============================================================================

/**
 * Question mapping questionnaire responses to dimensions
 */
export const QuestionSchema = z.object({
  question_id: z.string(),
  dimension_code: DimensionCodeSchema,
  sub_indicator_id: z.string(),
  raw_response: z.unknown(),
  normalized_score: z.number().min(0).max(100).optional()
});
export type Question = z.infer<typeof QuestionSchema>;

// ============================================================================
// EVIDENCE REFERENCES SCHEMA
// ============================================================================

/**
 * Evidence references for findings and recommendations
 */
export const EvidenceRefsSchema = z.object({
  question_ids: z.array(z.string()).optional(),
  metrics: z.array(z.string()).optional(),
  benchmarks: z.array(z.string()).optional()
}).optional();
export type EvidenceRefs = z.infer<typeof EvidenceRefsSchema>;

// ============================================================================
// FINDING SCHEMA
// ============================================================================

/**
 * Finding representing an insight from the analysis
 */
export const FindingSchema = z.object({
  id: z.string(),
  dimension_code: DimensionCodeSchema,
  sub_indicator_id: z.string().optional(),
  type: FindingTypeSchema,
  severity: z.union([z.string(), z.number()]),
  confidence_level: z.union([z.string(), z.number()]),
  short_label: z.string(),
  narrative: z.string(),
  evidence_refs: EvidenceRefsSchema
});
export type Finding = z.infer<typeof FindingSchema>;

// ============================================================================
// RECOMMENDATION SCHEMA
// ============================================================================

/**
 * Recommendation for business improvement
 */
export const RecommendationSchema = z.object({
  id: z.string(),
  dimension_code: DimensionCodeSchema,
  linked_finding_ids: z.array(z.string()),
  theme: z.string(),
  priority_rank: z.number().int().positive(),
  impact_score: z.number().min(0).max(100),
  effort_score: z.number().min(0).max(100),
  horizon: RecommendationHorizonSchema,
  required_capabilities: z.array(z.string()).optional(),
  action_steps: z.array(z.string()),
  expected_outcomes: z.string()
});
export type Recommendation = z.infer<typeof RecommendationSchema>;

// ============================================================================
// QUICK WIN SCHEMA
// ============================================================================

/**
 * Quick win - a recommendation identified as high impact, low effort
 */
export const QuickWinSchema = z.object({
  recommendation_id: z.string()
});
export type QuickWin = z.infer<typeof QuickWinSchema>;

// ============================================================================
// RISK SCHEMA
// ============================================================================

/**
 * Risk identified in the assessment
 */
export const RiskSchema = z.object({
  id: z.string(),
  dimension_code: DimensionCodeSchema,
  severity: z.union([z.string(), z.number()]),
  likelihood: z.union([z.string(), z.number()]),
  narrative: z.string(),
  linked_recommendation_ids: z.array(z.string()).optional(),
  category: z.string().optional()
});
export type Risk = z.infer<typeof RiskSchema>;

// ============================================================================
// ROADMAP PHASE SCHEMA
// ============================================================================

/**
 * Roadmap phase for implementation planning
 */
export const RoadmapPhaseSchema = z.object({
  id: z.string(),
  name: z.string(),
  time_horizon: z.string(),
  linked_recommendation_ids: z.array(z.string()),
  narrative: z.string()
});
export type RoadmapPhase = z.infer<typeof RoadmapPhaseSchema>;

/**
 * Complete roadmap
 */
export const RoadmapSchema = z.object({
  phases: z.array(RoadmapPhaseSchema)
});
export type Roadmap = z.infer<typeof RoadmapSchema>;

// ============================================================================
// SCORES SUMMARY SCHEMA
// ============================================================================

/**
 * Overall scores summary with benchmark context
 */
export const ScoresSummarySchema = z.object({
  overall_health_score: z.number().min(0).max(100),
  descriptor: z.string(),
  trajectory: TrajectorySchema,
  key_imperatives: z.array(z.string()),
  overall_benchmark: OverallBenchmarkSchema
});
export type ScoresSummary = z.infer<typeof ScoresSummarySchema>;

// ============================================================================
// VISUALIZATION SPEC SCHEMA (for IDM integration)
// ============================================================================

/**
 * Visualization types supported by the rendering engine
 */
export const VisualizationTypeSchema = z.enum([
  'gauge',
  'bar_chart',
  'horizontal_bar',
  'comparison_matrix',
  'score_tiles',
  'timeline',
  'risk_matrix',
  'heatmap',
  'radar_chart',
  'priority_table',
  'progress_indicator',
  'trend_sparkline',
  'kpi_card'
]);
export type VisualizationType = z.infer<typeof VisualizationTypeSchema>;

/**
 * Data point for visualization
 */
export const VisualizationDataPointSchema = z.object({
  label: z.string(),
  value: z.number(),
  unit: z.enum(['%', '$', 'count', 'score', 'days', 'ratio', 'none']).optional(),
  category: z.enum([
    'strength',
    'gap',
    'risk',
    'opportunity',
    'neutral',
    'excellence',
    'proficiency',
    'attention',
    'critical'
  ]).optional(),
  secondaryValue: z.number().optional(),
  trend: z.enum(['up', 'down', 'stable']).optional(),
  benchmark: z.number().optional()
});
export type VisualizationDataPoint = z.infer<typeof VisualizationDataPointSchema>;

/**
 * Visualization specification extracted from AI output
 */
export const VisualizationSpecSchema = z.object({
  vizId: z.string().optional(),
  vizType: VisualizationTypeSchema,
  title: z.string(),
  subtitle: z.string().optional(),
  data: z.array(VisualizationDataPointSchema),
  metadata: z.object({
    source: z.string().optional(),
    assessmentSection: z.string().optional(),
    dimensionCode: z.string().optional(),
    chapterCode: z.string().optional(),
    generatedBy: z.enum(['phase1', 'phase2', 'phase3']).optional(),
    confidenceScore: z.number().min(0).max(1).optional()
  }).optional(),
  renderOptions: z.object({
    showLegend: z.boolean().optional(),
    showValues: z.boolean().optional(),
    colorScheme: z.enum(['default', 'monochrome', 'score_bands']).optional(),
    height: z.enum(['compact', 'standard', 'expanded']).optional()
  }).optional()
});
export type VisualizationSpecIDM = z.infer<typeof VisualizationSpecSchema>;

/**
 * Collection of visualizations from all phases
 */
export const IDMVisualizationsSchema = z.object({
  /** Visualizations from Phase 1 analyses */
  phase1: z.array(VisualizationSpecSchema).default([]),
  /** Visualizations from Phase 2 syntheses */
  phase2: z.array(VisualizationSpecSchema).default([]),
  /** Visualizations from Phase 3 executive synthesis */
  phase3: z.array(VisualizationSpecSchema).default([]),
  /** Total count of all visualizations */
  totalCount: z.number().int().nonnegative().default(0)
}).optional();
export type IDMVisualizations = z.infer<typeof IDMVisualizationsSchema>;

// ============================================================================
// IDM ROOT SCHEMA
// ============================================================================

/**
 * Complete Insights Data Model (IDM)
 */
export const IDMSchema = z.object({
  meta: MetaSchema,
  chapters: z.array(ChapterSchema),
  dimensions: z.array(DimensionSchema),
  questions: z.array(QuestionSchema),
  findings: z.array(FindingSchema),
  recommendations: z.array(RecommendationSchema),
  quick_wins: z.array(QuickWinSchema),
  risks: z.array(RiskSchema),
  roadmap: RoadmapSchema,
  scores_summary: ScoresSummarySchema,
  /**
   * Extracted visualization specifications from all phases.
   * These are the ONLY source for chart rendering in Phase 5.
   * ASCII visualizations are prohibited and will not appear here.
   */
  visualizations: IDMVisualizationsSchema,

  // ========================================================================
  // Phase 1.5 Integration (optional for backward compatibility)
  // ========================================================================

  /**
   * Category-level analyses from Phase 1.5.
   * Provides granular insights for all 12 business dimensions.
   */
  categoryAnalyses: z.array(z.custom<CategoryAnalysis>()).optional(),

  /**
   * Chapter summaries aggregated from category analyses.
   * Groups insights by the 4 main chapters (GE, PH, PL, RS).
   */
  chapterSummaries: z.array(z.custom<ChapterSummary>()).optional(),

  /**
   * Cross-category insights including systemic patterns,
   * interdependency analysis, and prioritization matrix.
   */
  crossCategoryInsights: z.custom<CrossCategoryInsights>().optional(),

  /**
   * Overall health metrics from Phase 1.5 (more granular than scores_summary).
   * Used when Phase 1.5 data is available for enhanced accuracy.
   */
  phase15OverallHealth: z.object({
    score: z.number().min(0).max(100),
    status: z.string(),
    trajectory: z.enum(['Declining', 'Stable', 'Improving'])
  }).optional()
});
export type IDM = z.infer<typeof IDMSchema>;

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate and parse IDM
 */
export function validateIDM(data: unknown): IDM {
  return IDMSchema.parse(data);
}

/**
 * Safe validate IDM without throwing
 */
export function safeValidateIDM(data: unknown) {
  return IDMSchema.safeParse(data);
}

/**
 * Validate Meta
 */
export function validateMeta(data: unknown): Meta {
  return MetaSchema.parse(data);
}

/**
 * Validate Chapter
 */
export function validateChapter(data: unknown): Chapter {
  return ChapterSchema.parse(data);
}

/**
 * Validate Dimension
 */
export function validateDimension(data: unknown): Dimension {
  return DimensionSchema.parse(data);
}

/**
 * Validate Finding
 */
export function validateFinding(data: unknown): Finding {
  return FindingSchema.parse(data);
}

/**
 * Validate Recommendation
 */
export function validateRecommendation(data: unknown): Recommendation {
  return RecommendationSchema.parse(data);
}

/**
 * Validate Risk
 */
export function validateRisk(data: unknown): Risk {
  return RiskSchema.parse(data);
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get score band from numeric score
 */
export function getScoreBand(score: number): ScoreBand {
  if (score >= 80) return 'Excellence';
  if (score >= 60) return 'Proficiency';
  if (score >= 40) return 'Attention';
  return 'Critical';
}

/**
 * Get chapter code for a dimension
 */
export function getChapterForDimension(dimensionCode: DimensionCode): ChapterCode {
  return DIMENSION_METADATA[dimensionCode].chapter;
}

/**
 * Get all dimensions for a chapter
 */
export function getDimensionsForChapter(chapterCode: ChapterCode): DimensionCode[] {
  return Object.entries(DIMENSION_METADATA)
    .filter(([_, meta]) => meta.chapter === chapterCode)
    .map(([code, _]) => code as DimensionCode);
}

/**
 * Calculate chapter score from dimensions
 */
export function calculateChapterScore(dimensions: Dimension[], chapterCode: ChapterCode): number {
  const chapterDimensions = dimensions.filter(d => d.chapter_code === chapterCode);
  if (chapterDimensions.length === 0) return 0;
  const sum = chapterDimensions.reduce((acc, d) => acc + d.score_overall, 0);
  return Math.round(sum / chapterDimensions.length);
}

/**
 * Calculate overall health score from chapters
 */
export function calculateOverallHealthScore(chapters: Chapter[]): number {
  if (chapters.length === 0) return 0;
  const sum = chapters.reduce((acc, c) => acc + c.score_overall, 0);
  return Math.round(sum / chapters.length);
}

/**
 * Get health descriptor from score
 */
export function getHealthDescriptor(score: number): string {
  if (score >= 85) return 'Excellent Health';
  if (score >= 75) return 'Good Health';
  if (score >= 65) return 'Fair Health';
  if (score >= 50) return 'Needs Improvement';
  return 'Critical Condition';
}

/**
 * Determine trajectory from current and previous scores
 */
export function determineTrajectory(currentScore: number, previousScore?: number): Trajectory {
  if (previousScore === undefined) return 'Flat';
  const delta = currentScore - previousScore;
  if (delta > 5) return 'Improving';
  if (delta < -5) return 'Declining';
  return 'Flat';
}

// ============================================================================
// QUESTION TO DIMENSION MAPPING
// ============================================================================

/**
 * Sub-indicator definitions for each dimension
 * Each dimension has 3-5 canonical sub-indicators
 */
export const SUB_INDICATOR_DEFINITIONS: Record<DimensionCode, { id: string; name: string }[]> = {
  STR: [
    { id: 'STR_001', name: 'Competitive Differentiation' },
    { id: 'STR_002', name: 'Market Position' },
    { id: 'STR_003', name: 'Growth Planning' },
    { id: 'STR_004', name: 'Strategic Review Process' },
    { id: 'STR_005', name: 'Exit/Growth Strategy' }
  ],
  SAL: [
    { id: 'SAL_001', name: 'Sales Target Alignment' },
    { id: 'SAL_002', name: 'Pipeline Management' },
    { id: 'SAL_003', name: 'Sales Cycle Efficiency' },
    { id: 'SAL_004', name: 'Customer Retention' },
    { id: 'SAL_005', name: 'Upselling Effectiveness' }
  ],
  MKT: [
    { id: 'MKT_001', name: 'Brand Awareness' },
    { id: 'MKT_002', name: 'Customer Targeting' },
    { id: 'MKT_003', name: 'Marketing Economics (CAC/LTV)' },
    { id: 'MKT_004', name: 'Marketing ROI' },
    { id: 'MKT_005', name: 'Channel Strategy' }
  ],
  CXP: [
    { id: 'CXP_001', name: 'Customer Feedback Systems' },
    { id: 'CXP_002', name: 'Customer Satisfaction' },
    { id: 'CXP_003', name: 'Net Promoter Score' },
    { id: 'CXP_004', name: 'Issue Resolution' },
    { id: 'CXP_005', name: 'Response Time' }
  ],
  OPS: [
    { id: 'OPS_001', name: 'Operational Efficiency' },
    { id: 'OPS_002', name: 'Process Documentation' },
    { id: 'OPS_003', name: 'Operational Reliability' },
    { id: 'OPS_004', name: 'Lean Practices' },
    { id: 'OPS_005', name: 'Resource Utilization' }
  ],
  FIN: [
    { id: 'FIN_001', name: 'Financial Controls' },
    { id: 'FIN_002', name: 'Cash Management' },
    { id: 'FIN_003', name: 'Profitability' },
    { id: 'FIN_004', name: 'Financial Planning' },
    { id: 'FIN_005', name: 'Growth Readiness' }
  ],
  HRS: [
    { id: 'HRS_001', name: 'HR Infrastructure' },
    { id: 'HRS_002', name: 'Company Culture' },
    { id: 'HRS_003', name: 'Talent Acquisition' },
    { id: 'HRS_004', name: 'Employee Development' },
    { id: 'HRS_005', name: 'Performance Management' }
  ],
  LDG: [
    { id: 'LDG_001', name: 'Leadership Effectiveness' },
    { id: 'LDG_002', name: 'Decision-Making Structure' },
    { id: 'LDG_003', name: 'Board Oversight' },
    { id: 'LDG_004', name: 'Leadership Culture' },
    { id: 'LDG_005', name: 'Development & Mentorship' }
  ],
  TIN: [
    { id: 'TIN_001', name: 'Technology Investment' },
    { id: 'TIN_002', name: 'Innovation Culture' },
    { id: 'TIN_003', name: 'Technology Adoption' },
    { id: 'TIN_004', name: 'Automation Utilization' },
    { id: 'TIN_005', name: 'Innovation Impact' }
  ],
  IDS: [
    { id: 'IDS_001', name: 'IT Infrastructure' },
    { id: 'IDS_002', name: 'Network Effectiveness' },
    { id: 'IDS_003', name: 'Cybersecurity' },
    { id: 'IDS_004', name: 'Data Management' },
    { id: 'IDS_005', name: 'IT Scalability' }
  ],
  RMS: [
    { id: 'RMS_001', name: 'Risk Outlook' },
    { id: 'RMS_002', name: 'Risk Identification' },
    { id: 'RMS_003', name: 'Risk Mitigation' },
    { id: 'RMS_004', name: 'Business Continuity' },
    { id: 'RMS_005', name: 'Strategic Adaptability' }
  ],
  CMP: [
    { id: 'CMP_001', name: 'Compliance Awareness' },
    { id: 'CMP_002', name: 'Policy Adherence' },
    { id: 'CMP_003', name: 'Compliance Monitoring' },
    { id: 'CMP_004', name: 'Documentation' },
    { id: 'CMP_005', name: 'Incident Reporting' }
  ]
};

/**
 * Question to dimension and sub-indicator mapping
 * Maps each of the 87 questionnaire questions to its dimension and sub-indicator
 */
export interface QuestionMapping {
  question_id: string;
  dimension_code: DimensionCode;
  sub_indicator_id: string;
  weight: number;
}

export const QUESTION_MAPPINGS: QuestionMapping[] = [
  // Strategy (STR) - 7 questions
  { question_id: 'strategy_q1', dimension_code: 'STR', sub_indicator_id: 'STR_001', weight: 1.0 },
  { question_id: 'strategy_q2', dimension_code: 'STR', sub_indicator_id: 'STR_002', weight: 1.0 },
  { question_id: 'strategy_q3', dimension_code: 'STR', sub_indicator_id: 'STR_003', weight: 1.0 },
  { question_id: 'strategy_q4', dimension_code: 'STR', sub_indicator_id: 'STR_003', weight: 1.0 },
  { question_id: 'strategy_q5', dimension_code: 'STR', sub_indicator_id: 'STR_003', weight: 1.5 },
  { question_id: 'strategy_q6', dimension_code: 'STR', sub_indicator_id: 'STR_004', weight: 1.0 },
  { question_id: 'strategy_q7', dimension_code: 'STR', sub_indicator_id: 'STR_005', weight: 1.5 },

  // Sales (SAL) - 8 questions
  { question_id: 'sales_q1', dimension_code: 'SAL', sub_indicator_id: 'SAL_001', weight: 0.5 },
  { question_id: 'sales_q2', dimension_code: 'SAL', sub_indicator_id: 'SAL_001', weight: 1.0 },
  { question_id: 'sales_q3', dimension_code: 'SAL', sub_indicator_id: 'SAL_002', weight: 1.5 },
  { question_id: 'sales_q4', dimension_code: 'SAL', sub_indicator_id: 'SAL_003', weight: 1.0 },
  { question_id: 'sales_q5', dimension_code: 'SAL', sub_indicator_id: 'SAL_003', weight: 1.0 },
  { question_id: 'sales_q6', dimension_code: 'SAL', sub_indicator_id: 'SAL_003', weight: 1.0 },
  { question_id: 'sales_q7', dimension_code: 'SAL', sub_indicator_id: 'SAL_004', weight: 1.0 },
  { question_id: 'sales_q8', dimension_code: 'SAL', sub_indicator_id: 'SAL_005', weight: 1.0 },

  // Marketing (MKT) - 9 questions
  { question_id: 'marketing_q1', dimension_code: 'MKT', sub_indicator_id: 'MKT_001', weight: 1.0 },
  { question_id: 'marketing_q2', dimension_code: 'MKT', sub_indicator_id: 'MKT_005', weight: 0.5 },
  { question_id: 'marketing_q3', dimension_code: 'MKT', sub_indicator_id: 'MKT_005', weight: 0.5 },
  { question_id: 'marketing_q4', dimension_code: 'MKT', sub_indicator_id: 'MKT_005', weight: 0.5 },
  { question_id: 'marketing_q5', dimension_code: 'MKT', sub_indicator_id: 'MKT_002', weight: 1.5 },
  { question_id: 'marketing_q6', dimension_code: 'MKT', sub_indicator_id: 'MKT_003', weight: 1.0 },
  { question_id: 'marketing_q7', dimension_code: 'MKT', sub_indicator_id: 'MKT_003', weight: 1.0 },
  { question_id: 'marketing_q8', dimension_code: 'MKT', sub_indicator_id: 'MKT_003', weight: 1.0 },
  { question_id: 'marketing_q9', dimension_code: 'MKT', sub_indicator_id: 'MKT_004', weight: 1.0 },

  // Customer Experience (CXP) - 7 questions
  { question_id: 'customer_experience_q1', dimension_code: 'CXP', sub_indicator_id: 'CXP_001', weight: 1.0 },
  { question_id: 'customer_experience_q2', dimension_code: 'CXP', sub_indicator_id: 'CXP_002', weight: 1.5 },
  { question_id: 'customer_experience_q3', dimension_code: 'CXP', sub_indicator_id: 'CXP_003', weight: 1.5 },
  { question_id: 'customer_experience_q4', dimension_code: 'CXP', sub_indicator_id: 'CXP_002', weight: 1.0 },
  { question_id: 'customer_experience_q5', dimension_code: 'CXP', sub_indicator_id: 'CXP_002', weight: 1.0 },
  { question_id: 'customer_experience_q6', dimension_code: 'CXP', sub_indicator_id: 'CXP_004', weight: 1.0 },
  { question_id: 'customer_experience_q7', dimension_code: 'CXP', sub_indicator_id: 'CXP_005', weight: 1.0 },

  // Operations (OPS) - 6 questions
  { question_id: 'operations_q1', dimension_code: 'OPS', sub_indicator_id: 'OPS_001', weight: 1.5 },
  { question_id: 'operations_q2', dimension_code: 'OPS', sub_indicator_id: 'OPS_002', weight: 1.0 },
  { question_id: 'operations_q3', dimension_code: 'OPS', sub_indicator_id: 'OPS_005', weight: 1.0 },
  { question_id: 'operations_q4', dimension_code: 'OPS', sub_indicator_id: 'OPS_003', weight: 1.5 },
  { question_id: 'operations_q5', dimension_code: 'OPS', sub_indicator_id: 'OPS_004', weight: 1.0 },
  { question_id: 'operations_q6', dimension_code: 'OPS', sub_indicator_id: 'OPS_005', weight: 1.0 },

  // Financials (FIN) - 12 questions
  { question_id: 'financials_q1', dimension_code: 'FIN', sub_indicator_id: 'FIN_001', weight: 1.0 },
  { question_id: 'financials_q2', dimension_code: 'FIN', sub_indicator_id: 'FIN_002', weight: 1.0 },
  { question_id: 'financials_q3', dimension_code: 'FIN', sub_indicator_id: 'FIN_001', weight: 1.0 },
  { question_id: 'financials_q4', dimension_code: 'FIN', sub_indicator_id: 'FIN_002', weight: 1.0 },
  { question_id: 'financials_q5', dimension_code: 'FIN', sub_indicator_id: 'FIN_002', weight: 1.0 },
  { question_id: 'financials_q6', dimension_code: 'FIN', sub_indicator_id: 'FIN_002', weight: 1.5 },
  { question_id: 'financials_q7', dimension_code: 'FIN', sub_indicator_id: 'FIN_003', weight: 1.5 },
  { question_id: 'financials_q8', dimension_code: 'FIN', sub_indicator_id: 'FIN_003', weight: 1.0 },
  { question_id: 'financials_q9', dimension_code: 'FIN', sub_indicator_id: 'FIN_002', weight: 1.0 },
  { question_id: 'financials_q10', dimension_code: 'FIN', sub_indicator_id: 'FIN_004', weight: 1.0 },
  { question_id: 'financials_q11', dimension_code: 'FIN', sub_indicator_id: 'FIN_004', weight: 1.0 },
  { question_id: 'financials_q12', dimension_code: 'FIN', sub_indicator_id: 'FIN_005', weight: 1.5 },

  // Human Resources (HRS) - 7 questions
  { question_id: 'human_resources_q1', dimension_code: 'HRS', sub_indicator_id: 'HRS_001', weight: 1.5 },
  { question_id: 'human_resources_q2', dimension_code: 'HRS', sub_indicator_id: 'HRS_002', weight: 1.5 },
  { question_id: 'human_resources_q3', dimension_code: 'HRS', sub_indicator_id: 'HRS_003', weight: 1.0 },
  { question_id: 'human_resources_q4', dimension_code: 'HRS', sub_indicator_id: 'HRS_004', weight: 1.0 },
  { question_id: 'human_resources_q5', dimension_code: 'HRS', sub_indicator_id: 'HRS_002', weight: 1.5 },
  { question_id: 'human_resources_q6', dimension_code: 'HRS', sub_indicator_id: 'HRS_002', weight: 1.5 },
  { question_id: 'human_resources_q7', dimension_code: 'HRS', sub_indicator_id: 'HRS_005', weight: 1.0 },

  // Leadership & Governance (LDG) - 7 questions
  { question_id: 'leadership_q1', dimension_code: 'LDG', sub_indicator_id: 'LDG_001', weight: 1.5 },
  { question_id: 'leadership_q2', dimension_code: 'LDG', sub_indicator_id: 'LDG_002', weight: 1.0 },
  { question_id: 'leadership_q3', dimension_code: 'LDG', sub_indicator_id: 'LDG_003', weight: 1.0 },
  { question_id: 'leadership_q4', dimension_code: 'LDG', sub_indicator_id: 'LDG_003', weight: 0.5 },
  { question_id: 'leadership_q5', dimension_code: 'LDG', sub_indicator_id: 'LDG_002', weight: 1.5 },
  { question_id: 'leadership_q6', dimension_code: 'LDG', sub_indicator_id: 'LDG_004', weight: 1.0 },
  { question_id: 'leadership_q7', dimension_code: 'LDG', sub_indicator_id: 'LDG_005', weight: 1.0 },

  // Technology & Innovation (TIN) - 7 questions
  { question_id: 'technology_q1', dimension_code: 'TIN', sub_indicator_id: 'TIN_001', weight: 1.0 },
  { question_id: 'technology_q2', dimension_code: 'TIN', sub_indicator_id: 'TIN_005', weight: 1.0 },
  { question_id: 'technology_q3', dimension_code: 'TIN', sub_indicator_id: 'TIN_002', weight: 1.0 },
  { question_id: 'technology_q4', dimension_code: 'TIN', sub_indicator_id: 'TIN_003', weight: 1.0 },
  { question_id: 'technology_q5', dimension_code: 'TIN', sub_indicator_id: 'TIN_003', weight: 1.0 },
  { question_id: 'technology_q6', dimension_code: 'TIN', sub_indicator_id: 'TIN_004', weight: 1.5 },
  { question_id: 'technology_q7', dimension_code: 'TIN', sub_indicator_id: 'TIN_005', weight: 1.0 },

  // IT, Data & Systems (IDS) - 7 questions
  { question_id: 'it_infrastructure_q1', dimension_code: 'IDS', sub_indicator_id: 'IDS_001', weight: 1.5 },
  { question_id: 'it_infrastructure_q2', dimension_code: 'IDS', sub_indicator_id: 'IDS_002', weight: 1.0 },
  { question_id: 'it_infrastructure_q3', dimension_code: 'IDS', sub_indicator_id: 'IDS_003', weight: 2.0 },
  { question_id: 'it_infrastructure_q4', dimension_code: 'IDS', sub_indicator_id: 'IDS_004', weight: 1.5 },
  { question_id: 'it_infrastructure_q5', dimension_code: 'IDS', sub_indicator_id: 'IDS_004', weight: 1.0 },
  { question_id: 'it_infrastructure_q6', dimension_code: 'IDS', sub_indicator_id: 'IDS_005', weight: 1.5 },
  { question_id: 'it_infrastructure_q7', dimension_code: 'IDS', sub_indicator_id: 'IDS_001', weight: 1.0 },

  // Risk Management & Sustainability (RMS) - 8 questions
  { question_id: 'risk_management_q1', dimension_code: 'RMS', sub_indicator_id: 'RMS_001', weight: 1.5 },
  { question_id: 'risk_management_q2', dimension_code: 'RMS', sub_indicator_id: 'RMS_002', weight: 1.0 },
  { question_id: 'risk_management_q3', dimension_code: 'RMS', sub_indicator_id: 'RMS_003', weight: 1.5 },
  { question_id: 'risk_management_q4', dimension_code: 'RMS', sub_indicator_id: 'RMS_004', weight: 1.5 },
  { question_id: 'risk_management_q5', dimension_code: 'RMS', sub_indicator_id: 'RMS_003', weight: 1.5 },
  { question_id: 'risk_management_q6', dimension_code: 'RMS', sub_indicator_id: 'RMS_004', weight: 1.5 },
  { question_id: 'risk_management_q7', dimension_code: 'RMS', sub_indicator_id: 'RMS_004', weight: 1.0 },
  { question_id: 'risk_management_q8', dimension_code: 'RMS', sub_indicator_id: 'RMS_005', weight: 1.0 },

  // Compliance (CMP) - 8 questions
  { question_id: 'compliance_q1', dimension_code: 'CMP', sub_indicator_id: 'CMP_001', weight: 1.5 },
  { question_id: 'compliance_q2', dimension_code: 'CMP', sub_indicator_id: 'CMP_002', weight: 1.5 },
  { question_id: 'compliance_q3', dimension_code: 'CMP', sub_indicator_id: 'CMP_001', weight: 1.0 },
  { question_id: 'compliance_q4', dimension_code: 'CMP', sub_indicator_id: 'CMP_003', weight: 1.5 },
  { question_id: 'compliance_q5', dimension_code: 'CMP', sub_indicator_id: 'CMP_003', weight: 1.0 },
  { question_id: 'compliance_q6', dimension_code: 'CMP', sub_indicator_id: 'CMP_004', weight: 1.0 },
  { question_id: 'compliance_q7', dimension_code: 'CMP', sub_indicator_id: 'CMP_005', weight: 1.0 },
  { question_id: 'compliance_q8', dimension_code: 'CMP', sub_indicator_id: 'CMP_001', weight: 0.5 }
];

/**
 * Get question mapping by question ID
 */
export function getQuestionMapping(questionId: string): QuestionMapping | undefined {
  return QUESTION_MAPPINGS.find(m => m.question_id === questionId);
}

/**
 * Get all questions for a dimension
 */
export function getQuestionsForDimension(dimensionCode: DimensionCode): QuestionMapping[] {
  return QUESTION_MAPPINGS.filter(m => m.dimension_code === dimensionCode);
}

/**
 * Get all questions for a sub-indicator
 */
export function getQuestionsForSubIndicator(subIndicatorId: string): QuestionMapping[] {
  return QUESTION_MAPPINGS.filter(m => m.sub_indicator_id === subIndicatorId);
}

