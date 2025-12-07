/**
 * Report Components Index
 *
 * Exports all visual enhancement components for BizHealth reports.
 * Includes both existing narrative components and the new 16 visual components.
 */

// ============================================================================
// EXISTING NARRATIVE COMPONENTS
// ============================================================================

export {
  generateKeyTakeaways,
  generateKeyTakeawaysFromData,
  generateExecutiveHighlights,
} from './key-takeaways.component.js';

export type { KeyTakeaway } from './key-takeaways.component.js';

export {
  generateEvidenceCitation,
  generateEvidenceCitationsForDimension,
  generateEvidenceCitationsFromFindings,
  generateInsightCardWithEvidence,
} from './evidence-citation.component.js';

export type { EvidenceCitation } from './evidence-citation.component.js';

export {
  generateBenchmarkCallout,
  generateChapterBenchmarkCallout,
  generateDimensionBenchmarkCallout,
  generateOverallBenchmarkCallout,
  generateAllChapterBenchmarks,
  generateBenchmarkSummaryTable,
  generateScoreBarWithBenchmark,
} from './benchmark-callout.component.js';

export type { BenchmarkCalloutData } from './benchmark-callout.component.js';

export {
  renderComprehensiveReference,
  renderInlineReference,
  renderWhereToGoForDetail,
  renderComprehensiveRelationshipStatement,
  QUICK_REFS,
} from './comprehensive-reference.component.js';

export type { ReferenceOptions } from './comprehensive-reference.component.js';

// ============================================================================
// SCORE BAR COMPONENT
// ============================================================================

export {
  renderScoreBar,
  renderScoreBarList,
  renderDimensionScoreBars,
  renderChapterScoreBars,
  generateScoreBarStyles,
} from './score-bar.component.js';

export type { ScoreBarConfig, ScoreBarListConfig } from './score-bar.component.js';

// ============================================================================
// LEGAL TERMS & DISCLAIMERS COMPONENT
// ============================================================================

export {
  buildLegalTermsPage,
  getLegalTermsStyles,
} from './legal-terms-disclaimers.component.js';

export type { LegalTermsContext } from './legal-terms-disclaimers.component.js';

// ============================================================================
// NEW VISUAL COMPONENTS (16 Components)
// Tier 1: Core (gauge, score-tile, heatmap, bar-chart, metric-card, table)
// Tier 2: Action (radar-chart, timeline, roadmap-timeline, kpi-dashboard, risk-matrix)
// Tier 3: Specialized (benchmark-bar, waterfall, funnel, sparkline, action-card)
// ============================================================================

export * from './visual/index.js';

// ============================================================================
// PHASE 5 VISUAL COMPONENTS LIBRARY
// Server-side HTML generators for Phase 4 layout patterns
// ============================================================================

export {
  // Scorecard Grid
  generateScorecardGrid,
  chaptersToScorecardItems,
  // Dimension Detail
  generateDimensionDetailCard,
  dimensionToDetailProps,
  // Findings Grid
  generateFindingsGrid,
  findingsToGridProps,
  // Risk Matrix
  generateRiskMatrix,
  risksToMatrixItems,
  // Recommendations
  generateRecommendationCard,
  generateRecommendationsList,
  recommendationsToCardProps,
  // Roadmap Timeline
  generateRoadmapTimeline,
  roadmapPhasesToDisplay,
  // Executive Highlights
  generateExecutiveHighlightsRow,
  generateKeyTakeawaysBox,
  // Chapter Summary
  generateChapterSummary,
  // Quick Wins
  generateQuickWinsSummary,
  // Benchmark
  generateBenchmarkComparisonTable,
} from './visual-components.js';

export type {
  ScorecardGridItem,
  SubIndicatorDisplay,
  DimensionDetailProps,
  FindingDisplay,
  FindingsGridProps,
  RiskMatrixItem,
  RecommendationCardProps,
  RoadmapPhaseDisplay,
  ExecutiveHighlight,
  KeyTakeaway,
  ChapterSummaryProps,
  QuickWinDisplay,
  BenchmarkComparisonItem,
} from './visual-components.js';

// ============================================================================
// LEGAL COMPONENTS (Acceptance Banner, Legal Accordion)
// ============================================================================

export {
  generateAcceptanceBanner,
  getAcceptanceBannerStyles,
  generateLegalAccordion,
  getLegalAccordionStyles,
  parseLegalContent,
  getDefaultLegalContent,
} from './legal/index.js';

export type {
  AcceptanceBannerOptions,
  LegalSection,
  LegalAccordionOptions,
} from './legal/index.js';

// ============================================================================
// EXECUTIVE DASHBOARD COMPONENTS
// ============================================================================

export {
  generateExecutiveDashboard,
  generateHealthGauge,
  generateChapterKPITiles,
  generateDimensionRadar,
  generateDimensionHeatmap,
  generateRoadmapTimeline as generateExecutiveRoadmapTimeline,
  generateInvestmentDonut,
  generateRiskTable,
  getDashboardStyles,
} from './executive/index.js';
