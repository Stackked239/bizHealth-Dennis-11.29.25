/**
 * BizHealth.ai IDM Consolidator (Phase 3.5)
 *
 * Consolidates Phase 1, 2, and 3 analysis outputs into a validated
 * Insights Data Model (IDM) JSON structure.
 *
 * Responsibilities:
 * - Compute chapter and dimension scores from questionnaire data
 * - Extract findings, recommendations, and risks from analysis phases
 * - Identify quick wins based on impact/effort thresholds
 * - Build implementation roadmap
 * - Validate final IDM against Zod schemas
 */

import { v4 as uuidv4 } from 'uuid';
import {
  IDM,
  IDMSchema,
  Meta,
  Chapter,
  Dimension,
  SubIndicator,
  Question,
  Finding,
  Recommendation,
  QuickWin,
  Risk,
  RoadmapPhase,
  Roadmap,
  ScoresSummary,
  ChapterCode,
  ChapterCodeSchema,
  DimensionCode,
  DimensionCodeSchema,
  ScoreBand,
  Trajectory,
  FindingType,
  RecommendationHorizon,
  Benchmark,
  OverallBenchmark,
  IDMVisualizations,
  VisualizationSpecIDM,
  CHAPTER_NAMES,
  DIMENSION_METADATA,
  SUB_INDICATOR_DEFINITIONS,
  QUESTION_MAPPINGS,
  getScoreBand,
  getChapterForDimension,
  getDimensionsForChapter,
  calculateChapterScore,
  calculateOverallHealthScore,
  getHealthDescriptor,
  determineTrajectory,
  getQuestionsForDimension,
  getQuestionsForSubIndicator
} from '../types/idm.types.js';
import { visualizationExtractor } from '../services/visualization-extractor.service.js';
import { QuestionnaireResponses, CategoryResponses } from '../types/questionnaire.types.js';
import { CompanyProfile } from '../types/company-profile.types.js';
import {
  calculateAllChapterBenchmarks,
  calculateOverallBenchmark,
  getBenchmarkDataForCompany,
  getBandDescription,
  type CompanyBenchmarkProfile,
  type PercentileResult,
} from '../utils/benchmark-calculator.js';
// Safety utilities available for defensive coding patterns
// Import: extractNumericValueSafe, extractStringSafe, extractArraySafe,
//         calculateWeightedScoreSafe, getScoreBandSafe, validatePrioritySafe,
//         validateSeveritySafe, validateProbabilitySafe, isString, isValidDimensionCode,
//         isValidChapterCode, clampScoreSafe, safeReplace, consolidateRecommendationsSafe,
//         compileRisksSafe, enrichQuickWinsSafe, safeGet, safeExecute
// from '../utils/safety.utils.js';
import type {
  NormalizedQuestionnaireResponses,
  NormalizedChapter,
  NormalizedDimension,
  NormalizedQuestionResponse,
  DimensionCode as NormalizedDimensionCode,
} from '../types/normalized.types.js';

// ============================================================================
// BENCHMARK PROFILE EXTRACTION
// ============================================================================

/**
 * Extract benchmark profile from company profile for benchmark lookups
 */
function extractCompanyBenchmarkProfile(companyProfile: CompanyProfile): CompanyBenchmarkProfile {
  // Extract industry from company profile
  const industry = companyProfile.basic_information?.industry?.primary_industry || 'general_smb';

  // Extract employee count - use total workforce or sum components
  let employeeCount = 50; // Default
  if (companyProfile.size_metrics?.workforce) {
    const workforce = companyProfile.size_metrics.workforce;
    employeeCount = workforce.total_workforce ||
      (workforce.full_time_employees || 0) +
      (workforce.part_time_employees || 0) +
      (workforce.contractors_1099 || 0);
  }

  // Extract annual revenue
  let annualRevenue = 1000000; // Default $1M
  if (companyProfile.size_metrics?.revenue) {
    annualRevenue = companyProfile.size_metrics.revenue.last_year_total ||
      companyProfile.size_metrics.revenue.projected_this_year ||
      1000000;
  }

  return {
    industry,
    employeeCount: Math.max(1, employeeCount),
    annualRevenue: Math.max(0, annualRevenue),
  };
}

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * Phase 1 results structure
 */
interface Phase1Results {
  tier1: {
    revenue_engine?: AnalysisResult;
    operational_excellence?: AnalysisResult;
    financial_strategic?: AnalysisResult;
    people_leadership?: AnalysisResult;
    compliance_sustainability?: AnalysisResult;
  };
  tier2: {
    growth_readiness?: AnalysisResult;
    market_position?: AnalysisResult;
    resource_optimization?: AnalysisResult;
    risk_resilience?: AnalysisResult;
    scalability_readiness?: AnalysisResult;
  };
}

/**
 * Phase 2 results structure
 */
interface Phase2Results {
  cross_dimensional?: AnalysisResult;
  strategic_recommendations?: AnalysisResult;
  consolidated_risks?: AnalysisResult;
  growth_opportunities?: AnalysisResult;
  implementation_roadmap?: AnalysisResult;
}

/**
 * Phase 3 results structure
 */
interface Phase3Results {
  executive_summary?: AnalysisResult;
  scorecard?: AnalysisResult;
  action_matrix?: AnalysisResult;
  investment_roadmap?: AnalysisResult;
  final_recommendations?: AnalysisResult;
}

/**
 * Individual analysis result
 */
interface AnalysisResult {
  analysis_id: string;
  analysis_type: string;
  status: 'complete' | 'failed';
  content: string;
  metadata?: {
    input_tokens: number;
    output_tokens: number;
    thinking_tokens?: number;
    model: string;
    execution_time_ms: number;
  };
}

/**
 * Consolidator input
 *
 * Note: questionnaireResponses can be either the legacy QuestionnaireResponses
 * (with categories) or the new NormalizedQuestionnaireResponses (with chapters/dimensions).
 * The extractQuestions function handles both formats for compatibility.
 */
export interface IDMConsolidatorInput {
  companyProfile: CompanyProfile;
  questionnaireResponses: QuestionnaireResponses | NormalizedQuestionnaireResponses;
  phase1Results: Phase1Results;
  phase2Results: Phase2Results;
  phase3Results: Phase3Results;
  assessmentRunId?: string;
}

/**
 * Consolidator output
 */
export interface IDMConsolidatorOutput {
  idm: IDM;
  validationPassed: boolean;
  validationErrors: string[];
}

// ============================================================================
// SCORE CALCULATION
// ============================================================================

/**
 * Normalize a 1-5 scale response to 0-100
 */
function normalizeScaleResponse(value: number): number {
  // 1-5 scale -> 0-100
  return Math.round(((value - 1) / 4) * 100);
}

/**
 * Calculate sub-indicator score from questions
 */
function calculateSubIndicatorScore(
  subIndicatorId: string,
  questions: Question[]
): number {
  const relatedQuestions = questions.filter(q => q.sub_indicator_id === subIndicatorId);
  if (relatedQuestions.length === 0) return 0;

  const mappings = getQuestionsForSubIndicator(subIndicatorId);
  let weightedSum = 0;
  let totalWeight = 0;

  for (const q of relatedQuestions) {
    const mapping = mappings.find(m => m.question_id === q.question_id);
    const weight = mapping?.weight || 1.0;
    const score = q.normalized_score ?? 0;
    weightedSum += score * weight;
    totalWeight += weight;
  }

  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}

/**
 * Calculate dimension score from sub-indicators
 */
function calculateDimensionScore(subIndicators: SubIndicator[]): number {
  if (subIndicators.length === 0) return 0;
  const sum = subIndicators.reduce((acc, si) => acc + si.score, 0);
  return Math.round(sum / subIndicators.length);
}

// ============================================================================
// DATA EXTRACTION
// ============================================================================

/**
 * Type guard to check if questionnaire responses use the normalized chapters/dimensions structure
 * produced by Phase 0, vs the legacy categories structure.
 */
function isNormalizedQuestionnaireResponses(
  responses: QuestionnaireResponses | NormalizedQuestionnaireResponses
): responses is NormalizedQuestionnaireResponses {
  return 'chapters' in responses && Array.isArray((responses as NormalizedQuestionnaireResponses).chapters);
}

/**
 * Canonical mapping from normalized dimension codes to IDM dimension codes.
 * This is the bridge between the Phase 0 diagnostic dimension taxonomy and the IDM categories.
 *
 * Phase 0 Dimension Codes → IDM Dimension Codes:
 * - GE chapter: STR (Strategy), SAL (Sales), MKT (Marketing), CXP (Customer Experience)
 * - PH chapter: OPS (Operations), FIN (Financials)
 * - PL chapter: HRS (Human Resources), LDG (Leadership & Governance)
 * - RS chapter: TIN (Technology & Innovation), IDS (IT Data & Systems), RMS (Risk Management), CMP (Compliance)
 */
const NORMALIZED_TO_IDM_DIMENSION_CODE: Record<NormalizedDimensionCode, DimensionCode> = {
  'STR': 'STR',
  'SAL': 'SAL',
  'MKT': 'MKT',
  'CXP': 'CXP',
  'OPS': 'OPS',
  'FIN': 'FIN',
  'HRS': 'HRS',
  'LDG': 'LDG',
  'TIN': 'TIN',
  'IDS': 'IDS',
  'RMS': 'RMS',
  'CMP': 'CMP',
};

/**
 * Extract questions from normalized questionnaire responses (chapters/dimensions structure)
 * This handles the Phase 0 output format with chapters → dimensions → questions hierarchy.
 */
function extractQuestionsFromNormalized(
  responses: NormalizedQuestionnaireResponses
): Question[] {
  const questions: Question[] = [];

  // Validate chapters array exists
  if (!responses.chapters || !Array.isArray(responses.chapters)) {
    console.error('[IDM Consolidator] No chapters found in questionnaire responses – cannot extract questions');
    return questions;
  }

  // Iterate through chapters → dimensions → questions
  for (const chapter of responses.chapters) {
    if (!chapter.dimensions || !Array.isArray(chapter.dimensions)) {
      console.warn(
        `[IDM Consolidator] No dimensions in chapter ${chapter.chapter_code} (${chapter.name}) – skipping`
      );
      continue;
    }

    for (const dimension of chapter.dimensions) {
      // Map the normalized dimension code to IDM dimension code
      const idmDimensionCode = NORMALIZED_TO_IDM_DIMENSION_CODE[dimension.dimension_code];
      if (!idmDimensionCode) {
        console.warn(
          `[IDM Consolidator] Unknown dimension code "${dimension.dimension_code}" in chapter ${chapter.chapter_code} – ` +
          `skipping; please update NORMALIZED_TO_IDM_DIMENSION_CODE mapping if this is a new dimension`
        );
        continue;
      }

      if (!dimension.questions || !Array.isArray(dimension.questions) || dimension.questions.length === 0) {
        console.warn(
          `[IDM Consolidator] No questions in dimension ${dimension.dimension_code} (${dimension.name}) – skipping`
        );
        continue;
      }

      for (const q of dimension.questions) {
        // Find the IDM question mapping for this question
        const mapping = QUESTION_MAPPINGS.find(m => m.question_id === q.question_id);
        if (!mapping) {
          // Not all questions may be in the IDM mapping – this is expected for some questions
          continue;
        }

        // Use normalized_value if available, otherwise compute from raw_response
        let normalizedScore: number | undefined = q.normalized_value;
        if (normalizedScore === undefined && q.raw_response !== null && q.raw_response !== undefined) {
          if (q.response_type === 'scale' && typeof q.raw_response === 'number') {
            normalizedScore = normalizeScaleResponse(q.raw_response);
          } else if (q.response_type === 'percentage' && typeof q.raw_response === 'number') {
            normalizedScore = Math.min(100, Math.max(0, q.raw_response));
          }
        }

        questions.push({
          question_id: q.question_id,
          dimension_code: mapping.dimension_code,
          sub_indicator_id: mapping.sub_indicator_id,
          raw_response: q.raw_response,
          normalized_score: normalizedScore,
        });
      }
    }
  }

  console.log(
    `[IDM Consolidator] Extracted ${questions.length} questions from ${responses.chapters.length} chapters`
  );

  return questions;
}

/**
 * Extract questions from legacy questionnaire responses (categories structure)
 * This handles the legacy format with categories → questions hierarchy.
 */
function extractQuestionsFromLegacy(
  questionnaireResponses: QuestionnaireResponses
): Question[] {
  const questions: Question[] = [];

  // Category ID to questionnaire category key mapping
  const categoryMapping: Record<string, keyof typeof questionnaireResponses.categories> = {
    'strategy': 'strategy',
    'sales': 'sales',
    'marketing': 'marketing',
    'customer_experience': 'customer_experience',
    'operations': 'operations',
    'financials': 'financials',
    'human_resources': 'human_resources',
    'leadership_governance': 'leadership_governance',
    'technology_innovation': 'technology_innovation',
    'it_data_systems': 'it_data_systems',
    'risk_sustainability': 'risk_sustainability',
    'compliance_legal': 'compliance_legal'
  };

  for (const [categoryId, categoryKey] of Object.entries(categoryMapping)) {
    const category = questionnaireResponses.categories[categoryKey];
    if (!category) continue;

    for (const q of category.questions) {
      const mapping = QUESTION_MAPPINGS.find(m => m.question_id === q.question_id);
      if (!mapping) continue;

      // Normalize score based on response type
      let normalizedScore: number | undefined;
      if (q.response_type === 'scale' && typeof q.response_value === 'number') {
        normalizedScore = normalizeScaleResponse(q.response_value);
      } else if (q.response_type === 'percentage' && typeof q.response_value === 'number') {
        normalizedScore = Math.min(100, Math.max(0, q.response_value));
      }

      questions.push({
        question_id: q.question_id,
        dimension_code: mapping.dimension_code,
        sub_indicator_id: mapping.sub_indicator_id,
        raw_response: q.response_value,
        normalized_score: normalizedScore
      });
    }
  }

  return questions;
}

/**
 * Extract questions from questionnaire responses with IDM mapping.
 * Supports both the normalized chapters/dimensions structure (from Phase 0)
 * and the legacy categories structure for backward compatibility.
 */
function extractQuestions(
  questionnaireResponses: QuestionnaireResponses | NormalizedQuestionnaireResponses
): Question[] {
  // Detect and handle the normalized chapters/dimensions format from Phase 0
  if (isNormalizedQuestionnaireResponses(questionnaireResponses)) {
    return extractQuestionsFromNormalized(questionnaireResponses);
  }

  // Fall back to legacy categories format
  return extractQuestionsFromLegacy(questionnaireResponses);
}

/**
 * Build sub-indicators for a dimension
 */
function buildSubIndicators(
  dimensionCode: DimensionCode,
  questions: Question[]
): SubIndicator[] {
  const definitions = SUB_INDICATOR_DEFINITIONS[dimensionCode];
  const dimensionQuestions = questions.filter(q => q.dimension_code === dimensionCode);

  return definitions.map(def => {
    const contributingQuestions = dimensionQuestions.filter(
      q => q.sub_indicator_id === def.id
    );
    const score = calculateSubIndicatorScore(def.id, dimensionQuestions);

    return {
      id: def.id,
      dimension_code: dimensionCode,
      name: def.name,
      score,
      score_band: getScoreBand(score),
      contributing_question_ids: contributingQuestions.map(q => q.question_id)
    };
  });
}

/**
 * Build dimensions from questions
 */
function buildDimensions(questions: Question[]): Dimension[] {
  const dimensions: Dimension[] = [];

  for (const code of DimensionCodeSchema.options) {
    const metadata = DIMENSION_METADATA[code];
    const subIndicators = buildSubIndicators(code, questions);
    const scoreOverall = calculateDimensionScore(subIndicators);

    dimensions.push({
      dimension_code: code,
      chapter_code: metadata.chapter,
      name: metadata.name,
      description: metadata.description,
      score_overall: scoreOverall,
      score_band: getScoreBand(scoreOverall),
      sub_indicators: subIndicators
    });
  }

  return dimensions;
}

/**
 * Build chapters from dimensions with optional benchmark data
 */
function buildChapters(
  dimensions: Dimension[],
  chapterBenchmarks?: Map<ChapterCode, PercentileResult>
): Chapter[] {
  const chapters: Chapter[] = [];

  for (const code of ChapterCodeSchema.options) {
    const chapterDimensions = dimensions.filter(d => d.chapter_code === code);
    const scoreOverall = calculateChapterScore(dimensions, code);

    // Build benchmark data if available
    let benchmark: Benchmark = undefined;
    if (chapterBenchmarks) {
      const benchmarkResult = chapterBenchmarks.get(code);
      if (benchmarkResult) {
        benchmark = {
          peer_percentile: benchmarkResult.percentile,
          band_description: getBandDescription(benchmarkResult.comparisonBand),
          industry_average: benchmarkResult.industryAverage,
          peer_comparison_band: benchmarkResult.comparisonBand,
          benchmark_narrative: benchmarkResult.narrative,
        };
      }
    }

    chapters.push({
      chapter_code: code,
      name: CHAPTER_NAMES[code],
      score_overall: scoreOverall,
      score_band: getScoreBand(scoreOverall),
      benchmark,
    });
  }

  return chapters;
}

// ============================================================================
// FINDINGS EXTRACTION
// ============================================================================

/**
 * Extract findings from Phase 1-3 content
 */
function extractFindings(
  dimensions: Dimension[],
  phase1Results: Phase1Results,
  phase2Results: Phase2Results,
  phase3Results: Phase3Results
): Finding[] {
  const findings: Finding[] = [];

  // Generate findings based on dimension scores
  for (const dimension of dimensions) {
    // Strengths (Excellence tier)
    if (dimension.score_overall >= 80) {
      findings.push({
        id: `finding-strength-${dimension.dimension_code}`,
        dimension_code: dimension.dimension_code,
        type: 'strength',
        severity: 'Low',
        confidence_level: 'High',
        short_label: `${dimension.name} Excellence`,
        narrative: `${dimension.name} demonstrates strong performance at ${dimension.score_overall}/100, placing it in the Excellence tier. This represents a competitive advantage.`,
        evidence_refs: {
          metrics: [`${dimension.dimension_code}_score`]
        }
      });
    }

    // Gaps (Attention tier)
    if (dimension.score_overall >= 40 && dimension.score_overall < 60) {
      findings.push({
        id: `finding-gap-${dimension.dimension_code}`,
        dimension_code: dimension.dimension_code,
        type: 'gap',
        severity: 'Medium',
        confidence_level: 'High',
        short_label: `${dimension.name} Performance Gap`,
        narrative: `${dimension.name} shows moderate performance at ${dimension.score_overall}/100. This gap presents improvement opportunities that should be addressed within 6-12 months.`,
        evidence_refs: {
          metrics: [`${dimension.dimension_code}_score`]
        }
      });
    }

    // Risks (Critical tier)
    if (dimension.score_overall < 40) {
      findings.push({
        id: `finding-risk-${dimension.dimension_code}`,
        dimension_code: dimension.dimension_code,
        type: 'risk',
        severity: 'Critical',
        confidence_level: 'High',
        short_label: `${dimension.name} Critical Underperformance`,
        narrative: `${dimension.name} is at critical levels with a score of ${dimension.score_overall}/100. Immediate intervention is required to mitigate business risk.`,
        evidence_refs: {
          metrics: [`${dimension.dimension_code}_score`]
        }
      });
    }

    // Sub-indicator level findings
    for (const si of dimension.sub_indicators) {
      if (si.score >= 80) {
        findings.push({
          id: `finding-strength-${si.id}`,
          dimension_code: dimension.dimension_code,
          sub_indicator_id: si.id,
          type: 'strength',
          severity: 'Low',
          confidence_level: 'High',
          short_label: `Strong ${si.name}`,
          narrative: `${si.name} within ${dimension.name} shows exceptional performance at ${si.score}/100.`,
          evidence_refs: {
            question_ids: si.contributing_question_ids
          }
        });
      } else if (si.score < 40) {
        findings.push({
          id: `finding-gap-${si.id}`,
          dimension_code: dimension.dimension_code,
          sub_indicator_id: si.id,
          type: 'gap',
          severity: 'High',
          confidence_level: 'High',
          short_label: `${si.name} Gap`,
          narrative: `${si.name} within ${dimension.name} requires attention with a score of ${si.score}/100.`,
          evidence_refs: {
            question_ids: si.contributing_question_ids
          }
        });
      }
    }
  }

  return findings;
}

// ============================================================================
// RECOMMENDATIONS EXTRACTION
// ============================================================================

/**
 * Extract and generate recommendations
 */
function extractRecommendations(
  dimensions: Dimension[],
  findings: Finding[],
  phase2Results: Phase2Results,
  phase3Results: Phase3Results
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  let priorityRank = 1;

  // Sort dimensions by score (lowest first for prioritization)
  const sortedDimensions = [...dimensions].sort((a, b) => a.score_overall - b.score_overall);

  for (const dimension of sortedDimensions) {
    if (dimension.score_overall >= 80) continue; // Skip excellence tier

    const linkedFindings = findings
      .filter(f => f.dimension_code === dimension.dimension_code && (f.type === 'gap' || f.type === 'risk'))
      .map(f => f.id);

    if (linkedFindings.length === 0) continue;

    // Determine horizon based on severity
    let horizon: RecommendationHorizon;
    if (dimension.score_overall < 40) {
      horizon = '90_days';
    } else if (dimension.score_overall < 60) {
      horizon = '12_months';
    } else {
      horizon = '24_months_plus';
    }

    // Calculate impact and effort scores
    const impactScore = 100 - dimension.score_overall; // Higher gap = higher potential impact
    const effortScore = dimension.score_overall < 40 ? 70 : 50; // Critical issues often need more effort

    // Generate action-oriented theme based on score and dimension
    const themePrefix = dimension.score_overall < 40
      ? 'Strengthen'
      : dimension.score_overall < 60
        ? 'Optimize'
        : 'Enhance';
    const theme = `${themePrefix} ${dimension.name.toLowerCase()} capabilities and processes`;

    recommendations.push({
      id: `rec-${dimension.dimension_code}-${priorityRank}`,
      dimension_code: dimension.dimension_code,
      linked_finding_ids: linkedFindings,
      theme,
      priority_rank: priorityRank,
      impact_score: impactScore,
      effort_score: effortScore,
      horizon,
      required_capabilities: [dimension.name, 'Change Management'],
      action_steps: [
        `Conduct detailed ${dimension.name.toLowerCase()} assessment`,
        `Develop improvement plan with measurable KPIs`,
        `Implement quick wins within first 30 days`,
        `Monitor progress and adjust approach`,
        `Document and share best practices`
      ],
      expected_outcomes: `Improve ${dimension.name} score from ${dimension.score_overall} to ${Math.min(100, dimension.score_overall + 20)} within the target horizon.`
    });

    priorityRank++;
  }

  return recommendations;
}

// ============================================================================
// QUICK WINS IDENTIFICATION
// ============================================================================

/**
 * Identify quick wins from recommendations
 */
function identifyQuickWins(recommendations: Recommendation[]): QuickWin[] {
  // Quick wins: high impact (>60), low effort (<50), short horizon (90_days)
  const quickWinRecommendations = recommendations.filter(r =>
    r.impact_score >= 60 &&
    r.effort_score < 50 &&
    r.horizon === '90_days'
  );

  // Also include top 3 by impact/effort ratio if we don't have enough
  if (quickWinRecommendations.length < 3) {
    const byRatio = [...recommendations]
      .sort((a, b) => (b.impact_score / b.effort_score) - (a.impact_score / a.effort_score))
      .slice(0, 5);

    for (const rec of byRatio) {
      if (!quickWinRecommendations.find(qw => qw.id === rec.id)) {
        quickWinRecommendations.push(rec);
      }
      if (quickWinRecommendations.length >= 5) break;
    }
  }

  return quickWinRecommendations.map(r => ({
    recommendation_id: r.id
  }));
}

// ============================================================================
// RISKS EXTRACTION
// ============================================================================

/**
 * Generate mitigation suggestion based on dimension and severity
 */
function generateMitigationSuggestion(
  dimensionCode: DimensionCode,
  severity: string | number
): string {
  const dimensionName = DIMENSION_METADATA[dimensionCode]?.name || 'this area';
  const isCritical = severity === 'Critical' || (typeof severity === 'number' && severity >= 4);

  const mitigationTemplates: Record<DimensionCode, string> = {
    STR: `Develop a comprehensive strategic review process. ${isCritical ? 'Engage external strategic advisors immediately.' : 'Schedule quarterly strategy sessions.'}`,
    SAL: `Implement sales performance tracking and coaching programs. ${isCritical ? 'Review sales team structure and compensation.' : 'Optimize pipeline management processes.'}`,
    MKT: `Conduct marketing effectiveness audit and ROI analysis. ${isCritical ? 'Reallocate marketing spend to highest-performing channels.' : 'Test new customer acquisition strategies.'}`,
    CXP: `Establish customer feedback loops and satisfaction monitoring. ${isCritical ? 'Launch customer retention initiative.' : 'Enhance customer journey mapping.'}`,
    OPS: `Review and optimize operational processes for efficiency. ${isCritical ? 'Conduct comprehensive process redesign.' : 'Implement continuous improvement practices.'}`,
    FIN: `Strengthen financial controls and forecasting accuracy. ${isCritical ? 'Engage financial advisors for turnaround strategy.' : 'Improve cash flow management practices.'}`,
    HRS: `Enhance talent management and employee engagement programs. ${isCritical ? 'Address critical retention and culture issues.' : 'Develop succession planning.'}`,
    LDG: `Improve governance structures and leadership effectiveness. ${isCritical ? 'Conduct leadership assessment and development.' : 'Establish clearer decision-making frameworks.'}`,
    TIN: `Accelerate technology adoption and innovation culture. ${isCritical ? 'Prioritize critical digital transformation initiatives.' : 'Build innovation capabilities systematically.'}`,
    IDS: `Strengthen IT infrastructure and data management. ${isCritical ? 'Address cybersecurity vulnerabilities immediately.' : 'Develop data governance frameworks.'}`,
    RMS: `Enhance risk identification and business continuity planning. ${isCritical ? 'Implement comprehensive risk management program.' : 'Regular risk assessment reviews.'}`,
    CMP: `Strengthen compliance monitoring and policy adherence. ${isCritical ? 'Conduct compliance audit and remediation.' : 'Enhance compliance training programs.'}`,
  };

  return mitigationTemplates[dimensionCode] ||
    `Develop targeted improvement plan for ${dimensionName}. Monitor progress through regular reviews.`;
}

function extractRisks(
  dimensions: Dimension[],
  findings: Finding[],
  phase2Results: Phase2Results
): Risk[] {
  const risks: Risk[] = [];

  // Generate risks from critical findings
  const riskFindings = findings.filter(f => f.type === 'risk' || f.severity === 'Critical');

  for (const finding of riskFindings) {
    const mitigation = generateMitigationSuggestion(finding.dimension_code, finding.severity);
    risks.push({
      id: `risk-${finding.id}`,
      dimension_code: finding.dimension_code,
      severity: finding.severity,
      likelihood: 'High',
      narrative: finding.narrative,
      category: DIMENSION_METADATA[finding.dimension_code].name,
      mitigation,
    } as Risk);
  }

  // Add systemic risks for very low-scoring dimensions
  const criticalDimensions = dimensions.filter(d => d.score_overall < 40);
  for (const dim of criticalDimensions) {
    const existingRisk = risks.find(r =>
      r.dimension_code === dim.dimension_code &&
      r.id.includes('finding-risk')
    );

    if (!existingRisk) {
      const mitigation = generateMitigationSuggestion(dim.dimension_code, 'High');
      risks.push({
        id: `risk-systemic-${dim.dimension_code}`,
        dimension_code: dim.dimension_code,
        severity: 'High',
        likelihood: 'Medium',
        narrative: `Systemic risk identified in ${dim.name} due to critical performance level (${dim.score_overall}/100).`,
        category: 'Systemic',
        mitigation,
      } as Risk);
    }
  }

  return risks;
}

// ============================================================================
// ROADMAP BUILDING
// ============================================================================

/**
 * Build implementation roadmap from recommendations
 */
function buildRoadmap(recommendations: Recommendation[]): Roadmap {
  const phases: RoadmapPhase[] = [];

  // Phase 1: Quick Wins (0-90 days)
  const phase1Recs = recommendations.filter(r => r.horizon === '90_days');
  if (phase1Recs.length > 0) {
    phases.push({
      id: 'phase-1',
      name: 'Foundation & Quick Wins',
      time_horizon: '0-90 days',
      linked_recommendation_ids: phase1Recs.map(r => r.id),
      narrative: 'Focus on immediate value creation through quick wins and critical risk mitigation. Build momentum with visible early successes.'
    });
  }

  // Phase 2: Core Improvements (3-12 months)
  const phase2Recs = recommendations.filter(r => r.horizon === '12_months');
  if (phase2Recs.length > 0) {
    phases.push({
      id: 'phase-2',
      name: 'Core Capability Building',
      time_horizon: '3-12 months',
      linked_recommendation_ids: phase2Recs.map(r => r.id),
      narrative: 'Implement foundational improvements across key dimensions. Establish new processes and capabilities.'
    });
  }

  // Phase 3: Strategic Transformation (12-24+ months)
  const phase3Recs = recommendations.filter(r => r.horizon === '24_months_plus');
  if (phase3Recs.length > 0) {
    phases.push({
      id: 'phase-3',
      name: 'Strategic Transformation',
      time_horizon: '12-24+ months',
      linked_recommendation_ids: phase3Recs.map(r => r.id),
      narrative: 'Execute long-term strategic initiatives. Transform organizational capabilities for sustained competitive advantage.'
    });
  }

  // Add a continuous improvement phase if no phases
  if (phases.length === 0) {
    phases.push({
      id: 'phase-continuous',
      name: 'Continuous Improvement',
      time_horizon: 'Ongoing',
      linked_recommendation_ids: recommendations.slice(0, 3).map(r => r.id),
      narrative: 'Maintain focus on continuous improvement across all dimensions to sustain excellence.'
    });
  }

  return { phases };
}

// ============================================================================
// VISUALIZATION EXTRACTION
// ============================================================================

/**
 * Extract visualizations from all phase outputs
 * This collects visualization specifications from AI-generated content
 */
function extractVisualizations(
  phase1Results: Phase1Results,
  phase2Results: Phase2Results,
  phase3Results: Phase3Results
): IDMVisualizations {
  const phase1Vizs: VisualizationSpecIDM[] = [];
  const phase2Vizs: VisualizationSpecIDM[] = [];
  const phase3Vizs: VisualizationSpecIDM[] = [];

  // Extract from Phase 1 Tier 1 analyses
  const tier1Analyses = Object.entries(phase1Results.tier1 || {});
  for (const [analysisKey, analysis] of tier1Analyses) {
    if (analysis?.status === 'complete' && analysis.content) {
      try {
        const extraction = visualizationExtractor.extract(
          analysis.content,
          `phase1_tier1_${analysisKey}`
        );
        // Add metadata to each visualization
        for (const viz of extraction.visualizations) {
          phase1Vizs.push({
            ...viz,
            metadata: {
              ...viz.metadata,
              generatedBy: 'phase1',
              assessmentSection: `tier1_${analysisKey}`
            }
          });
        }
      } catch (error) {
        console.warn(`[IDM Consolidator] Failed to extract visualizations from tier1 ${analysisKey}:`, error);
      }
    }
  }

  // Extract from Phase 1 Tier 2 analyses
  const tier2Analyses = Object.entries(phase1Results.tier2 || {});
  for (const [analysisKey, analysis] of tier2Analyses) {
    if (analysis?.status === 'complete' && analysis.content) {
      try {
        const extraction = visualizationExtractor.extract(
          analysis.content,
          `phase1_tier2_${analysisKey}`
        );
        for (const viz of extraction.visualizations) {
          phase1Vizs.push({
            ...viz,
            metadata: {
              ...viz.metadata,
              generatedBy: 'phase1',
              assessmentSection: `tier2_${analysisKey}`
            }
          });
        }
      } catch (error) {
        console.warn(`[IDM Consolidator] Failed to extract visualizations from tier2 ${analysisKey}:`, error);
      }
    }
  }

  // Extract from Phase 2 analyses
  const phase2Analyses = Object.entries(phase2Results || {});
  for (const [analysisKey, analysis] of phase2Analyses) {
    if (analysis?.status === 'complete' && analysis.content) {
      try {
        const extraction = visualizationExtractor.extract(
          analysis.content,
          `phase2_${analysisKey}`
        );
        for (const viz of extraction.visualizations) {
          phase2Vizs.push({
            ...viz,
            metadata: {
              ...viz.metadata,
              generatedBy: 'phase2',
              assessmentSection: analysisKey
            }
          });
        }
      } catch (error) {
        console.warn(`[IDM Consolidator] Failed to extract visualizations from phase2 ${analysisKey}:`, error);
      }
    }
  }

  // Extract from Phase 3 analyses
  const phase3Analyses = Object.entries(phase3Results || {});
  for (const [analysisKey, analysis] of phase3Analyses) {
    if (analysis?.status === 'complete' && analysis.content) {
      try {
        const extraction = visualizationExtractor.extract(
          analysis.content,
          `phase3_${analysisKey}`
        );
        for (const viz of extraction.visualizations) {
          phase3Vizs.push({
            ...viz,
            metadata: {
              ...viz.metadata,
              generatedBy: 'phase3',
              assessmentSection: analysisKey
            }
          });
        }
      } catch (error) {
        console.warn(`[IDM Consolidator] Failed to extract visualizations from phase3 ${analysisKey}:`, error);
      }
    }
  }

  const totalCount = phase1Vizs.length + phase2Vizs.length + phase3Vizs.length;

  console.log(
    `[IDM Consolidator] Extracted ${totalCount} visualizations ` +
    `(Phase 1: ${phase1Vizs.length}, Phase 2: ${phase2Vizs.length}, Phase 3: ${phase3Vizs.length})`
  );

  return {
    phase1: phase1Vizs,
    phase2: phase2Vizs,
    phase3: phase3Vizs,
    totalCount
  };
}

// ============================================================================
// SCORES SUMMARY
// ============================================================================

/**
 * Build scores summary with optional overall benchmark
 */
function buildScoresSummary(
  chapters: Chapter[],
  dimensions: Dimension[],
  findings: Finding[],
  overallBenchmarkResult?: {
    percentileRank: number;
    industryBenchmark: number;
    peerGroupDescription: string;
    peerGroupSize: number;
    benchmarkNarrative: string;
  } | null
): ScoresSummary {
  const overallScore = calculateOverallHealthScore(chapters);
  const descriptor = getHealthDescriptor(overallScore);
  const trajectory = determineTrajectory(overallScore);

  // Extract key imperatives from lowest-scoring dimensions
  const sortedDimensions = [...dimensions].sort((a, b) => a.score_overall - b.score_overall);
  const keyImperatives = sortedDimensions
    .slice(0, 3)
    .map(d => `Improve ${d.name} (currently ${d.score_overall}/100)`);

  // Build overall benchmark if available
  let overall_benchmark: OverallBenchmark = undefined;
  if (overallBenchmarkResult) {
    overall_benchmark = {
      percentile_rank: overallBenchmarkResult.percentileRank,
      industry_benchmark: overallBenchmarkResult.industryBenchmark,
      peer_group_description: overallBenchmarkResult.peerGroupDescription,
      peer_group_size: overallBenchmarkResult.peerGroupSize,
      benchmark_narrative: overallBenchmarkResult.benchmarkNarrative,
    };
  }

  return {
    overall_health_score: overallScore,
    descriptor,
    trajectory,
    key_imperatives: keyImperatives,
    overall_benchmark,
  };
}

// ============================================================================
// MAIN CONSOLIDATOR
// ============================================================================

/**
 * IDM Consolidator class
 */
export class IDMConsolidator {
  private input: IDMConsolidatorInput;

  constructor(input: IDMConsolidatorInput) {
    this.input = input;
  }

  /**
   * Consolidate all inputs into a validated IDM
   */
  consolidate(): IDMConsolidatorOutput {
    const {
      companyProfile,
      questionnaireResponses,
      phase1Results,
      phase2Results,
      phase3Results,
      assessmentRunId
    } = this.input;

    // Build meta
    const meta: Meta = {
      assessment_run_id: assessmentRunId || uuidv4(),
      company_profile_id: companyProfile.metadata.profile_id,
      created_at: new Date().toISOString(),
      methodology_version: '1.0.0',
      scoring_version: '1.0.0',
      idm_schema_version: '1.0.0'
    };

    // Extract company benchmark profile for benchmark calculations
    const benchmarkProfile = extractCompanyBenchmarkProfile(companyProfile);

    // Extract questions from questionnaire
    const questions = extractQuestions(questionnaireResponses);

    // Build dimensions from questions
    const dimensions = buildDimensions(questions);

    // Build preliminary chapters to get scores for benchmark calculation
    const preliminaryChapters = buildChapters(dimensions);

    // Calculate chapter benchmarks using company profile
    let chapterBenchmarks: Map<ChapterCode, PercentileResult> | undefined;
    let overallBenchmarkResult: ReturnType<typeof calculateOverallBenchmark> = null;

    try {
      // Calculate benchmarks for each chapter
      chapterBenchmarks = calculateAllChapterBenchmarks(
        preliminaryChapters.map(c => ({
          chapter_code: c.chapter_code,
          name: c.name,
          score_overall: c.score_overall,
        })),
        benchmarkProfile
      );

      // Calculate overall health benchmark
      const overallScore = preliminaryChapters.reduce((sum, c) => sum + c.score_overall, 0) / preliminaryChapters.length;
      overallBenchmarkResult = calculateOverallBenchmark(Math.round(overallScore), benchmarkProfile);

      console.log(`[IDM Consolidator] Benchmark data calculated for ${benchmarkProfile.industry} industry`);
    } catch (error) {
      console.warn('[IDM Consolidator] Failed to calculate benchmarks, proceeding without benchmark data:', error);
    }

    // Build chapters with benchmark data
    const chapters = buildChapters(dimensions, chapterBenchmarks);

    // Extract findings
    const findings = extractFindings(dimensions, phase1Results, phase2Results, phase3Results);

    // Extract recommendations
    const recommendations = extractRecommendations(dimensions, findings, phase2Results, phase3Results);

    // Identify quick wins
    const quickWins = identifyQuickWins(recommendations);

    // Extract risks
    const risks = extractRisks(dimensions, findings, phase2Results);

    // Build roadmap
    const roadmap = buildRoadmap(recommendations);

    // Build scores summary with overall benchmark
    const scoresSummary = buildScoresSummary(chapters, dimensions, findings, overallBenchmarkResult);

    // Extract visualizations from all phases
    const visualizations = extractVisualizations(phase1Results, phase2Results, phase3Results);

    // Construct IDM
    const idmData: IDM = {
      meta,
      chapters,
      dimensions,
      questions,
      findings,
      recommendations,
      quick_wins: quickWins,
      risks,
      roadmap,
      scores_summary: scoresSummary,
      visualizations
    };

    // Validate against schema
    const validationResult = IDMSchema.safeParse(idmData);

    if (validationResult.success) {
      return {
        idm: validationResult.data,
        validationPassed: true,
        validationErrors: []
      };
    } else {
      // Extract validation errors
      const errors = validationResult.error.errors.map(e =>
        `${e.path.join('.')}: ${e.message}`
      );

      console.error('IDM Validation Failed:', errors);

      // Return the IDM anyway but flag validation failure
      return {
        idm: idmData,
        validationPassed: false,
        validationErrors: errors
      };
    }
  }
}

/**
 * Convenience function to consolidate IDM
 */
export function consolidateIDM(input: IDMConsolidatorInput): IDMConsolidatorOutput {
  const consolidator = new IDMConsolidator(input);
  return consolidator.consolidate();
}

/**
 * Export for testing
 */
export const testExports = {
  normalizeScaleResponse,
  calculateSubIndicatorScore,
  calculateDimensionScore,
  extractQuestions,
  extractQuestionsFromNormalized,
  extractQuestionsFromLegacy,
  isNormalizedQuestionnaireResponses,
  NORMALIZED_TO_IDM_DIMENSION_CODE,
  buildSubIndicators,
  buildDimensions,
  buildChapters,
  extractFindings,
  extractRecommendations,
  identifyQuickWins,
  extractRisks,
  buildRoadmap,
  buildScoresSummary,
  extractCompanyBenchmarkProfile,
  extractVisualizations,
};
