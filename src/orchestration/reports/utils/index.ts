/**
 * Report Utilities
 */

export {
  convertMarkdownToHtml,
  processNarrativeForReport,
  processNarrativeContent,
  validateNoRawMarkdown,
} from './markdown-sanitizer.js';

export {
  referenceLogger,
} from './reference-logger.js';

export type { ReferenceUsage } from './reference-logger.js';

export {
  transformToOwnerVoice,
  truncateToSentences,
  truncateToWords,
  capitalizeFirst,
  normalizeWhitespace,
} from './voice-transformer.js';

// Visual component utilities
export {
  BRAND_COLORS,
  SCORE_THRESHOLDS,
  SCORE_COLORS,
  getScoreBand,
  getScoreColor,
  getScoreColorRGB,
  interpolateColor,
  getRiskLevel,
  getRiskColor,
  getChapterColor,
  hexToRgb,
  rgbToHex,
} from './color-utils.js';

export type { ScoreBand, RGB } from './color-utils.js';

export {
  STATUS_SYMBOLS,
  getAccessibleSymbol,
  getColorblindSafeIndicator,
  getGaugeAriaLabel,
  getScoreTileAriaLabel,
  getHeatmapCellAriaLabel,
  getBarChartAriaLabel,
  getRadarChartAriaLabel,
  getRiskMatrixAriaLabel,
  getTableAriaLabel,
  createScreenReaderOnlyText,
} from './accessibility-utils.js';

// Number formatting utilities (fixes floating point display bug)
export {
  formatScore,
  formatScoreInt,
  formatPercentage,
  formatBenchmarkComparison,
  formatScoreWithMax,
  formatDelta,
  formatCurrency,
  formatCompactNumber,
  formatROI,
  safeRound,
  clampScore,
} from './number-formatter.js';

// Conditional rendering utilities
export {
  renderConditional,
  renderConditionalWithResult,
  createConditionalRenderer,
  renderIfHasItems,
  renderIfValidNumber,
  renderIfNonEmptyString,
  renderIfValidScore,
  renderIfMinItems,
  getValueByPath,
  isValidValue,
  hasMinLength,
  generateConditionalStyles,
  generateDataNotAvailableBox,
  generateComingSoonBox,
} from './conditional-renderer.js';

export type { ConditionalConfig, ConditionalRenderResult } from './conditional-renderer.js';

// ============================================================================
// PHASE 5 VISUALIZATION UTILITIES
// ============================================================================

// Content sanitizer for orphaned visualization headers
export {
  sanitizeOrphanedVisualizationHeaders,
  validateNoOrphanedHeaders,
  processNarrativeForVisualization,
  checkVisualizationIssues,
} from './content-sanitizer.js';
export type { SanitizationResult } from './content-sanitizer.js';

// Visualization data mappers (IDM to component props)
export {
  mapDimensionToGauge,
  mapRisksToHeatmap,
  mapTopRisksToHeatmap,
  mapRisksToRiskMatrix,
  mapRoadmapToTimeline,
  mapRoadmapToRoadmapPhases,
  mapCriticalMetrics,
  mapToKPIMetrics,
  mapRecommendationsToTimeline,
  mapDimensionsToGauges,
  mapChaptersToGauges,
} from './visualization-mappers.js';
export type {
  RiskHeatmapDataPoint,
  TimelinePhaseData,
  RoadmapTimelineData,
  CriticalMetricData,
} from './visualization-mappers.js';

// Visualization renderers (generate all visualizations)
export {
  renderExecutiveDashboard,
  renderRiskHeatmapSection,
  renderRiskSummarySection,
  renderRoadmapTimelineSection,
  renderSimplifiedRoadmapSection,
  renderQuickWinsTimelineSection,
  renderOverallHealthGaugeSection,
  renderChapterGaugesSection,
  renderDimensionGauge,
  renderKeyStatsRowSection,
  renderBenchmarkBarsSection,
  renderBenchmarkComparison,
  generateAllVisualizations,
  countVisualizations,
} from './render-visualizations.js';
export type { VisualizationBundle } from './render-visualizations.js';
