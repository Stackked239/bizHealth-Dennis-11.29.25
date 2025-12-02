/**
 * Report Components Index
 *
 * Exports all visual enhancement components for BizHealth reports.
 */

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
