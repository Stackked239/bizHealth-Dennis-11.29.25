/**
 * Report Utilities
 *
 * Shared utility functions for all BizHealth report builders.
 */

// ============================================================================
// SAFE STRING UTILITIES (Type-safe string operations)
// ============================================================================

// Safe string utilities - prevent "text.replace is not a function" errors
export {
  safeString,
  safeReplace,
  safeTrim,
  safeLowerCase,
  safeUpperCase,
  extractNarrativeSection,
  isNonEmptyString,
  isString,
  safeEscapeHtml,
  safeJoin,
  safeExtract,
  safeTruncate,
  safeNormalizeWhitespace,
  safeDefault,
} from './safe-string.utils.js';

// ============================================================================
// SHARED IDM EXTRACTION & FORMATTING UTILITIES
// ============================================================================

// IDM data extraction utilities (null-safe, with fallbacks)
export {
  extractNumericValue,
  formatBenchmark,
  formatK,
  formatInvestmentRange,
  formatReturnEstimate,
  calculateROIDisplay,
  mapDimensionToOwner,
  getDimensionName,
  formatOrdinal,
  formatDate,
  getScoreBandFromScore,
  getScoreBandColor,
  buildQuickWinCardData,
  generateSafePolygonPoints,
} from './idm-extractors.js';

// Formatting utilities (investment, dates, owners, etc.)
export {
  formatDateShort,
  formatHorizon,
  horizonToDeadline,
  formatSeverity,
  getSeverityColor,
  truncateText,
} from './format-helpers.js';

// ============================================================================
// LEGACY UTILITIES
// ============================================================================

// Legacy markdown sanitizer (basic conversion)
export {
  convertMarkdownToHtml,
  processNarrativeForReport,
  processNarrativeContent,
  validateNoRawMarkdown,
} from './markdown-sanitizer.js';

// Enhanced markdown parser with normalization
export {
  parseMarkdownToHTML,
  parseMarkdownWithValidation,
  processNarrativeForReport as processNarrativeWithNormalization,
  validateParsedHTML,
  cleanupRemainingMarkdown,
} from './markdown-parser.js';
export type { ParseOptions, ParseResult, ValidationResult } from './markdown-parser.js';

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

// Content validation utilities
export {
  validateReportContent,
  logValidationResults,
  generateValidationReport,
  checkQualityThresholds,
  DEFAULT_THRESHOLDS,
} from './content-validator.js';
export type {
  ContentValidationSummary,
  QualityThresholds,
} from './content-validator.js';

// Data sanitization utilities (prevents undefined in templates)
export {
  sanitizeForTemplate,
  resolveDimensionName,
  validateNoUndefined,
  sanitizeQuickWins,
  sanitizeRecommendations,
  safeGet,
  formatImpactEffort,
} from './data-sanitizer.js';
export type {
  SanitizedQuickWin,
  SanitizedRecommendation,
} from './data-sanitizer.js';

// ============================================================================
// PHASE 0: PREMIUM REPORT NARRATIVE UTILITIES
// ============================================================================

// Narrative personalization utilities
export {
  personalizeNarrative,
  ensureCompanyNameFrequency,
  generateCompanySpecificCallout,
  generateChapterOpeningNarrative,
  generateEvidenceIntegratedParagraph,
  generateWhyThisMatters,
  generateRiskOfInaction,
  createPersonalizationContext,
  getScoreBandInterpretation,
  describeChapterPattern,
  getGapImpact,
} from './narrative-personalizer.js';

export type {
  PersonalizationContext,
  ChapterNarrativeContext,
  EvidenceSource,
} from './narrative-personalizer.js';

// ============================================================================
// WORLD-CLASS VISUAL COMPONENTS INTEGRATION (Phase 1.5-2)
// ============================================================================

export {
  // 12-Dimension Executive Radar integration
  contextToExecutiveRadarData,
  // 4-Chapter Radar integration
  contextToChapterRadarData,
  // Section Header integration
  dimensionToSectionHeader,
  chapterToSectionHeader,
  // Financial Impact Dashboard integration
  contextToFinancialImpactData,
  // Action Plan Cards integration
  contextToActionPlanCards,
  // Quick Wins Cards integration
  contextToQuickWinCards,
  // Convenience bundle generator
  generateWorldClassVisualsBundle,
} from './world-class-visual-integration.js';

// ============================================================================
// IDM DATA EXTRACTION UTILITIES (Phase 1 Bug Fixes)
// NOTE: All IDM extractor exports are already included above in lines 33-48
// ============================================================================

// ============================================================================
// MANAGER REPORT UTILITIES (Phase 1 Enhancement)
// ============================================================================

// Safe extraction utilities - prevent undefined/null in rendered output
export {
  safeExtractValue,
  safeStringValue,
  safeNumber,
  safeScore,
  safeArray,
  safeGetPath,
  safeScoreBand,
  safeScoreBandClass,
  safeScoreBandColor,
  safeEffortLevel,
  safeImpactLevel,
  safeSeverity,
  safePercentage,
  safeDelta,
  safeDate,
  safeTruncate as safeTruncateManager,
  safeAttr,
  safeHtml,
  safeBoolean,
  safeFirst,
  safeCount,
  safeObject,
  createSafeExtractor,
} from './safe-extract.js';

// Dimension filter utilities - filter content by manager type
export {
  MANAGER_DIMENSIONS,
  MANAGER_TITLES,
  DIMENSION_CHAPTER_MAP,
  DIMENSION_KEYWORDS,
  getDimensionsForManager,
  filterFindingsByDimensions,
  filterRecommendationsByDimensions,
  filterQuickWinsByDimensions,
  filterRisksByDimensions,
  filterRoadmapByDimensions,
  calculateDepartmentScore,
  getDepartmentData,
} from './dimension-filters.js';

export type { ManagerType, ManagerDimensionMap } from './dimension-filters.js';
