/**
 * BizHealth.ai Visual Components - Color Utilities
 *
 * Provides color calculation and manipulation functions for
 * consistent styling across all visual components.
 */

/**
 * Score band type for health scores (0-100)
 */
export type ScoreBand = 'critical' | 'attention' | 'proficiency' | 'excellence';

/**
 * Color palette interface for status colors
 */
export interface StatusColorPalette {
  main: string;
  background: string;
  border: string;
  text: string;
}

/**
 * Brand colors for BizHealth
 */
export const BRAND_COLORS = {
  navy: '#212653',
  navyLight: '#2D3466',
  navyDark: '#1A1E42',
  green: '#969423',
  greenLight: '#B5B23A',
  greenDark: '#7A7A1D',
} as const;

/**
 * Status color palettes
 */
export const STATUS_COLORS: Record<ScoreBand, StatusColorPalette> = {
  excellence: {
    main: '#22C55E',
    background: '#DCFCE7',
    border: '#86EFAC',
    text: '#166534',
  },
  proficiency: {
    main: '#22C55E',
    background: '#DCFCE7',
    border: '#86EFAC',
    text: '#166534',
  },
  attention: {
    main: '#EAB308',
    background: '#FEF9C3',
    border: '#FDE047',
    text: '#854D0E',
  },
  critical: {
    main: '#EF4444',
    background: '#FEE2E2',
    border: '#FCA5A5',
    text: '#991B1B',
  },
};

/**
 * Neutral colors for non-status elements
 */
export const NEUTRAL_COLORS = {
  main: '#6B7280',
  background: '#F3F4F6',
  border: '#D1D5DB',
  text: '#374151',
} as const;

/**
 * Chart colors for data visualization
 */
export const CHART_COLORS = {
  primary: '#212653',
  secondary: '#969423',
  tertiary: '#3B82F6',
  quaternary: '#8B5CF6',
  benchmark: '#6B7280',
  benchmarkLine: '#9CA3AF',
  positive: '#22C55E',
  negative: '#EF4444',
} as const;

/**
 * Get score band from numeric score (0-100)
 */
export function getScoreBand(score: number): ScoreBand {
  if (score >= 80) return 'excellence';
  if (score >= 60) return 'proficiency';
  if (score >= 40) return 'attention';
  return 'critical';
}

/**
 * Get status color palette for a given score
 */
export function getStatusColorPalette(score: number): StatusColorPalette {
  return STATUS_COLORS[getScoreBand(score)];
}

/**
 * Get status color palette for a given band
 */
export function getBandColorPalette(band: ScoreBand): StatusColorPalette {
  return STATUS_COLORS[band];
}

/**
 * Get main color for a score
 */
export function getScoreColor(score: number): string {
  return getStatusColorPalette(score).main;
}

/**
 * Get background color for a score
 */
export function getScoreBackgroundColor(score: number): string {
  return getStatusColorPalette(score).background;
}

/**
 * Get text color for a score (for use on colored backgrounds)
 */
export function getScoreTextColor(score: number): string {
  return getStatusColorPalette(score).text;
}

/**
 * Convert a score band to its display name
 */
export function bandToDisplayName(band: ScoreBand): string {
  const displayNames: Record<ScoreBand, string> = {
    excellence: 'Excellence',
    proficiency: 'Proficiency',
    attention: 'Needs Attention',
    critical: 'Critical',
  };
  return displayNames[band];
}

/**
 * Get CSS class suffix for a score band
 */
export function bandToClass(band: ScoreBand): string {
  return band;
}

/**
 * Get CSS class suffix for a score
 */
export function scoreToClass(score: number): string {
  return bandToClass(getScoreBand(score));
}

/**
 * Determine if score is above, below, or at benchmark
 */
export function getBenchmarkComparison(
  score: number,
  benchmark: number,
  threshold: number = 5
): 'above' | 'below' | 'at' {
  const delta = score - benchmark;
  if (delta > threshold) return 'above';
  if (delta < -threshold) return 'below';
  return 'at';
}

/**
 * Get delta color (positive = green, negative = red)
 */
export function getDeltaColor(delta: number): string {
  if (delta > 0) return CHART_COLORS.positive;
  if (delta < 0) return CHART_COLORS.negative;
  return NEUTRAL_COLORS.main;
}

/**
 * Get trend color based on direction
 */
export function getTrendColor(trend: 'improving' | 'flat' | 'declining'): string {
  switch (trend) {
    case 'improving':
      return CHART_COLORS.positive;
    case 'declining':
      return CHART_COLORS.negative;
    default:
      return NEUTRAL_COLORS.main;
  }
}

/**
 * Calculate risk level from likelihood and impact (5x5 matrix)
 */
export function getRiskLevel(
  likelihood: 1 | 2 | 3 | 4 | 5,
  impact: 1 | 2 | 3 | 4 | 5
): 'low' | 'medium' | 'high' {
  const riskScore = likelihood * impact;
  if (riskScore >= 15) return 'high';
  if (riskScore >= 8) return 'medium';
  return 'low';
}

/**
 * Get risk level color
 */
export function getRiskLevelColor(level: 'low' | 'medium' | 'high'): StatusColorPalette {
  switch (level) {
    case 'high':
      return STATUS_COLORS.critical;
    case 'medium':
      return STATUS_COLORS.attention;
    default:
      return STATUS_COLORS.excellence;
  }
}

/**
 * Generate a color gradient between two colors
 * @param startColor Hex color code
 * @param endColor Hex color code
 * @param steps Number of gradient steps
 */
export function generateColorGradient(
  startColor: string,
  endColor: string,
  steps: number
): string[] {
  const start = hexToRgb(startColor);
  const end = hexToRgb(endColor);

  if (!start || !end) return Array(steps).fill(startColor);

  const gradient: string[] = [];
  for (let i = 0; i < steps; i++) {
    const ratio = i / (steps - 1);
    const r = Math.round(start.r + (end.r - start.r) * ratio);
    const g = Math.round(start.g + (end.g - start.g) * ratio);
    const b = Math.round(start.b + (end.b - start.b) * ratio);
    gradient.push(rgbToHex(r, g, b));
  }
  return gradient;
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
}

/**
 * Get a lighter shade of a color
 * @param hex Hex color code
 * @param percent Percentage to lighten (0-100)
 */
export function lightenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const factor = percent / 100;
  const r = Math.round(rgb.r + (255 - rgb.r) * factor);
  const g = Math.round(rgb.g + (255 - rgb.g) * factor);
  const b = Math.round(rgb.b + (255 - rgb.b) * factor);

  return rgbToHex(r, g, b);
}

/**
 * Get a darker shade of a color
 * @param hex Hex color code
 * @param percent Percentage to darken (0-100)
 */
export function darkenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const factor = 1 - percent / 100;
  const r = Math.round(rgb.r * factor);
  const g = Math.round(rgb.g * factor);
  const b = Math.round(rgb.b * factor);

  return rgbToHex(r, g, b);
}

/**
 * Add alpha/opacity to a hex color
 */
export function addAlpha(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

/**
 * Check if a color is light (for determining text contrast)
 */
export function isLightColor(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;

  // Calculate relative luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5;
}

/**
 * Get contrasting text color (black or white)
 */
export function getContrastingTextColor(backgroundHex: string): string {
  return isLightColor(backgroundHex) ? '#111827' : '#FFFFFF';
}
