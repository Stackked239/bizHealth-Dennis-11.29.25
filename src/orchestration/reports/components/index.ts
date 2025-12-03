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
// NEW VISUAL COMPONENTS (16 Components)
// Tier 1: Core (gauge, score-tile, heatmap, bar-chart, metric-card, table)
// Tier 2: Action (radar-chart, timeline, roadmap-timeline, kpi-dashboard, risk-matrix)
// Tier 3: Specialized (benchmark-bar, waterfall, funnel, sparkline, action-card)
// ============================================================================

export * from './visual/index.js';
