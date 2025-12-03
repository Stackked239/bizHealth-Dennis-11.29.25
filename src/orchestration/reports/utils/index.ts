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
