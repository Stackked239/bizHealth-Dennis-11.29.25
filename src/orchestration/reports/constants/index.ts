/**
 * Report Constants Index
 *
 * Exports all constants for BizHealth reports.
 */

export {
  DIMENSION_ICONS,
  CHAPTER_ICONS,
  CHAPTER_NAMES,
  DIMENSION_NAMES,
  CHAPTER_DIMENSIONS,
  FINDING_TYPE_ICONS,
  PRIORITY_ICONS,
  BAND_ICONS,
  TRAJECTORY_ICONS,
  getDimensionIcon,
  getChapterIcon,
  getChapterName,
  getDimensionName,
  generateDimensionHeaderHtml,
  generateChapterHeaderHtml,
  getFindingTypeIcon,
  getPriorityIcon,
  getBandIcon,
  getTrajectoryIconEmoji,
} from './dimension-icons.js';

// Brand Standards
export {
  BIZHEALTH_COLORS,
  BIZHEALTH_TYPOGRAPHY,
  BIZHEALTH_BRAND,
  SCORE_BAND_THRESHOLDS,
  GAUGE_SIZES,
  CHART_SERIES_COLORS,
  getScoreBandColor,
  getScoreBandName,
  getScoreBandLabel,
  getChartColor,
  getRiskLevelColor,
} from './brand.js';
export type { ScoreBandType, GaugeSizeType } from './brand.js';
