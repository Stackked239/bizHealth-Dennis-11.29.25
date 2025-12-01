/**
 * Report Components Index
 *
 * Exports all visual enhancement components for BizHealth reports.
 */

export {
  generateKeyTakeaways,
  generateKeyTakeawaysFromData,
  generateExecutiveHighlights,
  KeyTakeaway,
} from './key-takeaways.component.js';

export {
  generateEvidenceCitation,
  generateEvidenceCitationsForDimension,
  generateEvidenceCitationsFromFindings,
  generateInsightCardWithEvidence,
  EvidenceCitation,
} from './evidence-citation.component.js';

export {
  generateBenchmarkCallout,
  generateChapterBenchmarkCallout,
  generateDimensionBenchmarkCallout,
  generateOverallBenchmarkCallout,
  generateAllChapterBenchmarks,
  generateBenchmarkSummaryTable,
  generateScoreBarWithBenchmark,
  BenchmarkCalloutData,
} from './benchmark-callout.component.js';
