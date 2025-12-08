/**
 * Shared IDM Data Extraction Utilities
 *
 * Used by: Owner's Report, Executive Brief, Comprehensive Report, etc.
 *
 * These utilities provide null-safe extraction of data from IDM objects
 * and ReportContext objects with appropriate fallbacks for missing or
 * malformed data.
 *
 * @module idm-extractors
 */

import type {
  ReportContext,
  ReportChapter,
  ReportDimension,
  ReportRecommendation,
  ReportQuickWin,
  ReportRisk,
  ReportFinding,
} from '../../../types/report.types.js';

// ============================================================================
// NUMERIC VALUE EXTRACTION
// ============================================================================

/**
 * Safely extracts a numeric value from potentially complex objects
 * Handles: number, { value: number }, { score: number }, undefined, null
 *
 * This is critical for fixing NaN issues in radar chart polygon generation
 * and [object Object] display in benchmark labels.
 *
 * @param value - The value to extract from (could be number, object, or undefined)
 * @param fallback - Default value to return if extraction fails
 * @returns Extracted numeric value or fallback
 *
 * @example
 * extractNumericValue(75, 0) // returns 75
 * extractNumericValue({ value: 80 }, 0) // returns 80
 * extractNumericValue({ score: 65 }, 0) // returns 65
 * extractNumericValue(undefined, 50) // returns 50
 * extractNumericValue('[object Object]', 0) // returns 0
 */
export function extractNumericValue(value: unknown, fallback: number): number {
  // Direct number check
  if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
    return value;
  }

  // Object with nested value properties
  if (typeof value === 'object' && value !== null) {
    const obj = value as Record<string, unknown>;

    // Try common property names
    if (typeof obj.value === 'number' && !isNaN(obj.value)) {
      return obj.value;
    }
    if (typeof obj.score === 'number' && !isNaN(obj.score)) {
      return obj.score;
    }
    if (typeof obj.percentile === 'number' && !isNaN(obj.percentile)) {
      return obj.percentile;
    }
    if (typeof obj.score_overall === 'number' && !isNaN(obj.score_overall)) {
      return obj.score_overall;
    }
    if (typeof obj.overall_health_score === 'number' && !isNaN(obj.overall_health_score)) {
      return obj.overall_health_score;
    }
    if (typeof obj.peer_percentile === 'number' && !isNaN(obj.peer_percentile)) {
      return obj.peer_percentile;
    }
    if (typeof obj.peerPercentile === 'number' && !isNaN(obj.peerPercentile)) {
      return obj.peerPercentile;
    }
  }

  // String that might be a number
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    if (!isNaN(parsed) && isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

// ============================================================================
// BENCHMARK FORMATTING
// ============================================================================

/**
 * Formats benchmark data for display - prevents [object Object] errors
 *
 * Handles: number, { value: number }, { percentile: number },
 * { peerPercentile: number }, object, undefined
 *
 * @param benchmark - Benchmark data in various formats
 * @returns Human-readable benchmark string
 *
 * @example
 * formatBenchmark(75) // returns "75/100"
 * formatBenchmark({ percentile: 80 }) // returns "80th percentile"
 * formatBenchmark({ peerPercentile: 65 }) // returns "65th percentile"
 * formatBenchmark(undefined) // returns "N/A"
 */
export function formatBenchmark(benchmark: unknown): string {
  if (benchmark === null || benchmark === undefined) {
    return 'N/A';
  }

  if (typeof benchmark === 'number' && !isNaN(benchmark)) {
    return `${benchmark}/100`;
  }

  if (typeof benchmark === 'object' && benchmark !== null) {
    const benchObj = benchmark as Record<string, unknown>;

    // Check for percentile properties first (most common in benchmarks)
    if (typeof benchObj.peer_percentile === 'number' && !isNaN(benchObj.peer_percentile)) {
      return `${formatOrdinal(benchObj.peer_percentile)} percentile`;
    }
    if (typeof benchObj.peerPercentile === 'number' && !isNaN(benchObj.peerPercentile)) {
      return `${formatOrdinal(benchObj.peerPercentile)} percentile`;
    }
    if (typeof benchObj.percentile === 'number' && !isNaN(benchObj.percentile)) {
      return `${formatOrdinal(benchObj.percentile)} percentile`;
    }
    if (typeof benchObj.percentile_rank === 'number' && !isNaN(benchObj.percentile_rank)) {
      return `${formatOrdinal(benchObj.percentile_rank)} percentile`;
    }

    // Check for value properties
    if (typeof benchObj.value === 'number' && !isNaN(benchObj.value)) {
      return `${benchObj.value}/100`;
    }
    if (typeof benchObj.industry_average === 'number' && !isNaN(benchObj.industry_average)) {
      return `${benchObj.industry_average}/100 (industry avg)`;
    }

    // Check for description
    if (typeof benchObj.band_description === 'string' && benchObj.band_description) {
      return benchObj.band_description;
    }
    if (typeof benchObj.description === 'string' && benchObj.description) {
      return benchObj.description;
    }

    // Prevent [object Object]
    return 'N/A';
  }

  // Try string conversion only if it looks reasonable
  const strValue = String(benchmark);
  if (strValue && strValue !== '[object Object]' && strValue.length < 50) {
    return strValue;
  }

  return 'N/A';
}

/**
 * Formats numbers as ordinals (1st, 2nd, 3rd, etc.)
 */
function formatOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// ============================================================================
// SCORE BAND UTILITIES
// ============================================================================

/**
 * Determines score band from numeric score
 *
 * @param score - Numeric score (0-100)
 * @returns Score band classification
 */
export function getScoreBandFromValue(score: number): 'Excellence' | 'Proficiency' | 'Attention' | 'Critical' {
  if (score >= 80) return 'Excellence';
  if (score >= 60) return 'Proficiency';
  if (score >= 40) return 'Attention';
  return 'Critical';
}

/**
 * Gets band color for styling based on band name
 *
 * @param band - Score band name
 * @returns Hex color code
 */
export function getBandColorFromName(band: string): string {
  const colors: Record<string, string> = {
    'excellence': '#28a745',
    'proficiency': '#0d6efd',
    'attention': '#ffc107',
    'critical': '#dc3545',
  };
  return colors[band.toLowerCase()] || '#6c757d';
}

// ============================================================================
// CHAPTER EXTRACTION
// ============================================================================

/**
 * Gets chapter display name from code
 */
export function getChapterName(code: string): string {
  const names: Record<string, string> = {
    'GE': 'Growth Engine',
    'PH': 'Performance & Health',
    'PL': 'People & Leadership',
    'RS': 'Resilience & Safeguards',
  };
  return names[code] || code;
}

/**
 * Gets chapter metadata for visual styling
 */
export function getChapterMeta(code: string): { name: string; icon: string; color: string } {
  const meta: Record<string, { name: string; icon: string; color: string }> = {
    'GE': { name: 'Growth Engine', icon: '🚀', color: '#28a745' },
    'PH': { name: 'Performance & Health', icon: '📊', color: '#0d6efd' },
    'PL': { name: 'People & Leadership', icon: '👥', color: '#ffc107' },
    'RS': { name: 'Resilience & Safeguards', icon: '🛡️', color: '#dc3545' },
  };
  return meta[code] || { name: code, icon: '📈', color: '#212653' };
}

/**
 * Extracts chapter scores with fallbacks from ReportContext
 * Ensures all 4 chapters are represented even if data is missing
 *
 * @param ctx - Report context containing chapters
 * @returns Array of chapter data with guaranteed values
 */
export function extractChapterScores(ctx: ReportContext): ReportChapter[] {
  const { chapters } = ctx;
  const expectedChapters = ['GE', 'PH', 'PL', 'RS'];

  return expectedChapters.map(code => {
    const found = chapters.find(ch => ch.code === code);
    if (found) {
      return {
        ...found,
        score: extractNumericValue(found.score, 0),
        band: found.band || getScoreBandFromValue(extractNumericValue(found.score, 0)),
      };
    }

    // Return placeholder if chapter not found
    return {
      code: code as 'GE' | 'PH' | 'PL' | 'RS',
      name: getChapterName(code),
      score: 0,
      band: 'Critical' as const,
      keyFindings: [],
      keyRisks: [],
      keyOpportunities: [],
    };
  });
}

/**
 * Extracts overall score with fallbacks from ReportContext
 *
 * @param ctx - Report context
 * @returns Object with score, band, and optional percentile
 */
export function extractOverallScore(ctx: ReportContext): { score: number; band: string; percentile?: number } {
  const { overallHealth } = ctx;

  const score = extractNumericValue(overallHealth.score, 0);
  const band = overallHealth.band || getScoreBandFromValue(score);
  const percentile = overallHealth.benchmarks?.percentile;

  return { score, band, percentile };
}

// ============================================================================
// RECOMMENDATIONS EXTRACTION
// ============================================================================

/**
 * Extracts recommendations with fallbacks from ReportContext
 *
 * @param ctx - Report context
 * @returns Array of recommendations
 */
export function extractRecommendations(ctx: ReportContext): ReportRecommendation[] {
  return ctx.recommendations || [];
}

/**
 * Extracts high-impact recommendations (impact score >= 70)
 *
 * @param ctx - Report context
 * @returns Filtered array of high-impact recommendations
 */
export function extractHighImpactRecommendations(ctx: ReportContext): ReportRecommendation[] {
  return (ctx.recommendations || []).filter(r => r.impactScore >= 70);
}

// ============================================================================
// QUICK WINS EXTRACTION
// ============================================================================

/**
 * Extracts quick wins with fallbacks from ReportContext
 *
 * @param ctx - Report context
 * @returns Array of quick wins
 */
export function extractQuickWins(ctx: ReportContext): ReportQuickWin[] {
  return ctx.quickWins || [];
}

// ============================================================================
// RISKS EXTRACTION
// ============================================================================

/**
 * Extracts risks with fallbacks from ReportContext
 *
 * @param ctx - Report context
 * @returns Array of risks
 */
export function extractRisks(ctx: ReportContext): ReportRisk[] {
  return ctx.risks || [];
}

/**
 * Extracts critical and high severity risks
 *
 * @param ctx - Report context
 * @returns Filtered array of critical/high risks
 */
export function extractCriticalRisks(ctx: ReportContext): ReportRisk[] {
  return (ctx.risks || []).filter(r => {
    const severity = typeof r.severity === 'number' ? r.severity : parseInt(String(r.severity)) || 0;
    return severity >= 7;
  });
}

// ============================================================================
// FINDINGS EXTRACTION
// ============================================================================

/**
 * Extracts findings with fallbacks from ReportContext
 *
 * @param ctx - Report context
 * @returns Array of findings
 */
export function extractFindings(ctx: ReportContext): ReportFinding[] {
  return ctx.findings || [];
}

/**
 * Extracts strengths from findings
 *
 * @param ctx - Report context
 * @returns Filtered array of strength findings
 */
export function extractStrengths(ctx: ReportContext): ReportFinding[] {
  return (ctx.findings || []).filter(f => f.type === 'strength');
}

/**
 * Extracts gaps from findings
 *
 * @param ctx - Report context
 * @returns Filtered array of gap findings
 */
export function extractGaps(ctx: ReportContext): ReportFinding[] {
  return (ctx.findings || []).filter(f => f.type === 'gap');
}

// ============================================================================
// ROADMAP EXTRACTION
// ============================================================================

/**
 * Extracts roadmap phases from ReportContext
 *
 * @param ctx - Report context
 * @returns Roadmap object with phases
 */
export function extractRoadmap(ctx: ReportContext): { phases: Array<{ id: string; name: string; timeHorizon: string; narrative: string; keyMilestones?: string[] }> } {
  if (ctx.roadmap && ctx.roadmap.phases && ctx.roadmap.phases.length > 0) {
    return ctx.roadmap;
  }

  // Return empty roadmap structure
  return { phases: [] };
}

// ============================================================================
// DIMENSION EXTRACTION
// ============================================================================

/**
 * Extracts dimensions with fallbacks from ReportContext
 *
 * @param ctx - Report context
 * @returns Array of dimensions
 */
export function extractDimensions(ctx: ReportContext): ReportDimension[] {
  return ctx.dimensions || [];
}

/**
 * Gets the lowest scoring dimension
 *
 * @param ctx - Report context
 * @returns Lowest scoring dimension or undefined
 */
export function getLowestScoringDimension(ctx: ReportContext): ReportDimension | undefined {
  const dimensions = ctx.dimensions || [];
  if (dimensions.length === 0) return undefined;

  return dimensions.reduce((lowest, current) =>
    extractNumericValue(current.score, 100) < extractNumericValue(lowest.score, 100) ? current : lowest
  , dimensions[0]);
}

/**
 * Gets the highest scoring dimension
 *
 * @param ctx - Report context
 * @returns Highest scoring dimension or undefined
 */
export function getHighestScoringDimension(ctx: ReportContext): ReportDimension | undefined {
  const dimensions = ctx.dimensions || [];
  if (dimensions.length === 0) return undefined;

  return dimensions.reduce((highest, current) =>
    extractNumericValue(current.score, 0) > extractNumericValue(highest.score, 0) ? current : highest
  , dimensions[0]);
}
