/**
 * BizHealth.ai Report Chart Integration
 *
 * High-level functions for integrating charts into report builders.
 * Provides ready-to-use chart generation from ReportContext data.
 */

import type { ReportContext, ReportChapter, ReportDimension } from '../../../types/report.types.js';
import type { ChartRenderOptions, ChartAccessibilityConfig, DimensionChartData, ChapterChartData } from './types/chart.types.js';
import { renderChart, generateChartStyles } from './chart-renderer.js';
import {
  generateChapterRadarChart,
  generateDimensionRadarChart,
  generateDimensionScoreChart,
  generateChapterScoreChart,
  generateScoreBandDonut,
  generateBenchmarkComparisonChart,
  generateGapAnalysisChart,
  generateStrengthWeaknessChart,
  generateSemiDonut,
} from './generators/index.js';
import { logger } from '../../../utils/logger.js';

// Default chart dimensions for different contexts
export const CHART_SIZES = {
  small: { width: 300, height: 200 },
  medium: { width: 500, height: 350 },
  large: { width: 700, height: 450 },
  wide: { width: 800, height: 300 },
  square: { width: 400, height: 400 },
} as const;

/**
 * Convert ReportChapter to ChapterChartData
 */
function toChapterChartData(chapter: ReportChapter): ChapterChartData {
  return {
    code: chapter.code,
    name: chapter.name,
    score: chapter.score,
    band: chapter.band,
    benchmark: chapter.benchmark?.peerPercentile,
  };
}

/**
 * Convert ReportDimension to DimensionChartData
 */
function toDimensionChartData(dimension: ReportDimension): DimensionChartData {
  return {
    code: dimension.code,
    name: dimension.name,
    score: dimension.score,
    band: dimension.band,
    benchmark: dimension.benchmark?.peerPercentile,
  };
}

/**
 * Generate chapter overview radar chart
 * Shows all 4 chapters in a spider/radar view
 */
export async function generateChapterOverviewRadar(
  ctx: ReportContext,
  options: Partial<ChartRenderOptions> = {}
): Promise<string> {
  try {
    const chapters = ctx.chapters.map(toChapterChartData);

    // Build benchmark data if available
    const benchmarks: Record<string, number> = {};
    ctx.chapters.forEach(ch => {
      if (ch.benchmark?.peerPercentile) {
        // Estimate benchmark score from percentile (rough approximation)
        benchmarks[ch.code] = estimateBenchmarkScore(ch.score, ch.benchmark.peerPercentile);
      }
    });

    const hasBenchmarks = Object.keys(benchmarks).length > 0;

    const config = generateChapterRadarChart(chapters, hasBenchmarks ? benchmarks : undefined, {
      title: 'Business Health Overview',
      showBenchmark: hasBenchmarks,
      fill: true,
    });

    const rendered = await renderChart(config, {
      ...CHART_SIZES.medium,
      ...options,
    }, {
      generateDataTable: true,
    });

    return rendered.html;
  } catch (error) {
    logger.error({ error }, 'Failed to generate chapter overview radar');
    return generateChartFallback('Chapter Overview', 'radar');
  }
}

/**
 * Generate dimension scores bar chart for a chapter
 */
export async function generateChapterDimensionBars(
  ctx: ReportContext,
  chapterCode: string,
  options: Partial<ChartRenderOptions> = {}
): Promise<string> {
  try {
    const chapter = ctx.chapters.find(ch => ch.code === chapterCode);
    if (!chapter) {
      return generateChartFallback(`${chapterCode} Dimensions`, 'bar');
    }

    // Get dimensions for this chapter
    const chapterDimensions = ctx.dimensions.filter(d => d.chapterCode === chapterCode);
    if (chapterDimensions.length === 0) {
      return generateChartFallback(`${chapter.name} Dimensions`, 'bar');
    }

    const dimensions = chapterDimensions.map(toDimensionChartData);

    const config = generateDimensionScoreChart(dimensions, undefined, {
      title: `${chapter.name} - Dimension Scores`,
      sortBy: 'score',
      sortDirection: 'desc',
      showBenchmark: false,
    });

    const rendered = await renderChart(config, {
      ...CHART_SIZES.wide,
      ...options,
    }, {
      generateDataTable: true,
    });

    return rendered.html;
  } catch (error) {
    logger.error({ error, chapterCode }, 'Failed to generate chapter dimension bars');
    return generateChartFallback('Dimension Scores', 'bar');
  }
}

/**
 * Generate all chapter bar charts
 */
export async function generateAllChapterScoreBars(
  ctx: ReportContext,
  options: Partial<ChartRenderOptions> = {}
): Promise<string> {
  try {
    const chapters = ctx.chapters.map(toChapterChartData);

    const config = generateChapterScoreChart(chapters, undefined, {
      title: 'Chapter Performance Overview',
      sortBy: 'score',
      sortDirection: 'desc',
    });

    const rendered = await renderChart(config, {
      ...CHART_SIZES.wide,
      ...options,
    }, {
      generateDataTable: true,
    });

    return rendered.html;
  } catch (error) {
    logger.error({ error }, 'Failed to generate chapter score bars');
    return generateChartFallback('Chapter Scores', 'bar');
  }
}

/**
 * Generate score band distribution donut
 */
export async function generateScoreBandDistribution(
  ctx: ReportContext,
  options: Partial<ChartRenderOptions> = {}
): Promise<string> {
  try {
    // Count dimensions by score band
    const bandCounts: Record<string, number> = {
      excellence: 0,
      proficiency: 0,
      attention: 0,
      critical: 0,
    };

    ctx.dimensions.forEach(d => {
      const band = d.band.toLowerCase();
      if (band in bandCounts) {
        bandCounts[band]++;
      }
    });

    const bands = Object.entries(bandCounts)
      .filter(([_, count]) => count > 0)
      .map(([band, count]) => ({ band, count }));

    if (bands.length === 0) {
      return generateChartFallback('Score Distribution', 'donut');
    }

    const config = generateScoreBandDonut(bands, {
      title: 'Dimension Score Distribution',
      showLegend: true,
      showPercentages: true,
    });

    const rendered = await renderChart(config, {
      ...CHART_SIZES.square,
      ...options,
    }, {
      generateDataTable: true,
    });

    return rendered.html;
  } catch (error) {
    logger.error({ error }, 'Failed to generate score band distribution');
    return generateChartFallback('Score Distribution', 'donut');
  }
}

/**
 * Generate benchmark comparison chart
 */
export async function generateBenchmarkComparison(
  ctx: ReportContext,
  options: Partial<ChartRenderOptions> = {}
): Promise<string> {
  try {
    // Build comparison data from chapters with benchmarks
    const items = ctx.chapters
      .filter(ch => ch.benchmark)
      .map(ch => ({
        label: ch.name,
        score: ch.score,
        benchmark: estimateBenchmarkScore(ch.score, ch.benchmark!.peerPercentile),
      }));

    if (items.length === 0) {
      return generateChartFallback('Benchmark Comparison', 'bar');
    }

    const config = generateBenchmarkComparisonChart(items, {
      title: 'Your Scores vs Industry Benchmark',
    });

    const rendered = await renderChart(config, {
      ...CHART_SIZES.wide,
      ...options,
    }, {
      generateDataTable: true,
    });

    return rendered.html;
  } catch (error) {
    logger.error({ error }, 'Failed to generate benchmark comparison');
    return generateChartFallback('Benchmark Comparison', 'bar');
  }
}

/**
 * Generate gap analysis chart showing delta from benchmarks
 */
export async function generateGapAnalysis(
  ctx: ReportContext,
  options: Partial<ChartRenderOptions> = {}
): Promise<string> {
  try {
    const items = ctx.chapters
      .filter(ch => ch.benchmark)
      .map(ch => ({
        label: ch.name,
        score: ch.score,
        benchmark: estimateBenchmarkScore(ch.score, ch.benchmark!.peerPercentile),
      }));

    if (items.length === 0) {
      return generateChartFallback('Gap Analysis', 'bar');
    }

    const config = generateGapAnalysisChart(items, {
      title: 'Gap Analysis vs Industry Benchmark',
    });

    const rendered = await renderChart(config, {
      ...CHART_SIZES.wide,
      ...options,
    }, {
      generateDataTable: true,
    });

    return rendered.html;
  } catch (error) {
    logger.error({ error }, 'Failed to generate gap analysis');
    return generateChartFallback('Gap Analysis', 'bar');
  }
}

/**
 * Generate strengths and weaknesses chart
 */
export async function generateStrengthsWeaknessesChart(
  ctx: ReportContext,
  options: Partial<ChartRenderOptions> = {}
): Promise<string> {
  try {
    const dimensions = ctx.dimensions.map(toDimensionChartData);

    if (dimensions.length === 0) {
      return generateChartFallback('Strengths & Improvements', 'bar');
    }

    const config = generateStrengthWeaknessChart(dimensions, 60, {
      title: 'Strengths & Areas for Improvement',
    });

    const rendered = await renderChart(config, {
      width: 700,
      height: Math.max(300, dimensions.length * 35),
      ...options,
    }, {
      generateDataTable: true,
    });

    return rendered.html;
  } catch (error) {
    logger.error({ error }, 'Failed to generate strengths/weaknesses chart');
    return generateChartFallback('Strengths & Improvements', 'bar');
  }
}

/**
 * Generate overall health score gauge
 */
export async function generateHealthScoreGauge(
  ctx: ReportContext,
  options: Partial<ChartRenderOptions> = {}
): Promise<string> {
  try {
    const config = generateSemiDonut(ctx.overallHealth.score, 100, {
      title: 'Overall Business Health',
    });

    const rendered = await renderChart(config, {
      width: 300,
      height: 200,
      ...options,
    }, {
      altText: `Overall Business Health Score: ${ctx.overallHealth.score}/100`,
    });

    return rendered.html;
  } catch (error) {
    logger.error({ error }, 'Failed to generate health score gauge');
    return generateChartFallback('Health Score', 'gauge');
  }
}

/**
 * Generate dimension radar for a specific chapter
 */
export async function generateChapterDimensionRadar(
  ctx: ReportContext,
  chapterCode: string,
  options: Partial<ChartRenderOptions> = {}
): Promise<string> {
  try {
    const chapter = ctx.chapters.find(ch => ch.code === chapterCode);
    if (!chapter) {
      return generateChartFallback(`${chapterCode} Radar`, 'radar');
    }

    const chapterDimensions = ctx.dimensions.filter(d => d.chapterCode === chapterCode);
    if (chapterDimensions.length < 3) {
      // Need at least 3 dimensions for a meaningful radar
      return generateChartFallback(`${chapter.name}`, 'radar');
    }

    const dimensions = chapterDimensions.map(toDimensionChartData);

    const config = generateDimensionRadarChart(dimensions, undefined, {
      title: `${chapter.name} Dimensions`,
      fill: true,
    });

    const rendered = await renderChart(config, {
      ...CHART_SIZES.square,
      ...options,
    }, {
      generateDataTable: true,
    });

    return rendered.html;
  } catch (error) {
    logger.error({ error, chapterCode }, 'Failed to generate chapter dimension radar');
    return generateChartFallback('Dimension Overview', 'radar');
  }
}

/**
 * Generate a grid of chapter mini-radars
 */
export async function generateChapterRadarGrid(
  ctx: ReportContext,
  options: Partial<ChartRenderOptions> = {}
): Promise<string> {
  const chartPromises = ctx.chapters.map(ch =>
    generateChapterDimensionRadar(ctx, ch.code, { width: 280, height: 280 })
  );

  const charts = await Promise.all(chartPromises);

  return `
    <div class="chart-grid" role="group" aria-label="Chapter dimension radar charts">
      ${charts.map((chart, i) => `
        <div class="chart-cell">
          ${chart}
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Generate complete visual dashboard for executive summary
 */
export async function generateExecutiveDashboard(
  ctx: ReportContext
): Promise<string> {
  try {
    const [overviewRadar, scoreBars, distribution] = await Promise.all([
      generateChapterOverviewRadar(ctx, CHART_SIZES.medium),
      generateAllChapterScoreBars(ctx, { width: 600, height: 250 }),
      generateScoreBandDistribution(ctx, { width: 300, height: 300 }),
    ]);

    return `
      <div class="executive-dashboard" role="region" aria-label="Executive dashboard visualizations">
        <div class="dashboard-row">
          <div class="dashboard-main">
            ${overviewRadar}
          </div>
          <div class="dashboard-side">
            ${distribution}
          </div>
        </div>
        <div class="dashboard-full">
          ${scoreBars}
        </div>
      </div>
      <style>
        .executive-dashboard {
          margin: 2rem 0;
        }
        .dashboard-row {
          display: flex;
          gap: 2rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        .dashboard-main {
          flex: 2;
          min-width: 400px;
        }
        .dashboard-side {
          flex: 1;
          min-width: 280px;
        }
        .dashboard-full {
          width: 100%;
        }
        @media (max-width: 768px) {
          .dashboard-row {
            flex-direction: column;
          }
          .dashboard-main,
          .dashboard-side {
            min-width: 100%;
          }
        }
        @media print {
          .dashboard-row {
            page-break-inside: avoid;
          }
        }
      </style>
    `;
  } catch (error) {
    logger.error({ error }, 'Failed to generate executive dashboard');
    return '<div class="chart-error">Dashboard visualization unavailable</div>';
  }
}

/**
 * Get all chart CSS styles needed for reports
 */
export function getReportChartStyles(): string {
  return `
    ${generateChartStyles()}

    /* Executive Dashboard Styles */
    .executive-dashboard {
      margin: 2rem 0;
    }

    .dashboard-row {
      display: flex;
      gap: 2rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .dashboard-main {
      flex: 2;
      min-width: 400px;
    }

    .dashboard-side {
      flex: 1;
      min-width: 280px;
    }

    .dashboard-full {
      width: 100%;
    }

    /* Chart error fallback */
    .chart-error,
    .chart-fallback {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: #f8f9fa;
      border: 2px dashed #dee2e6;
      border-radius: 8px;
      color: #6c757d;
      min-height: 200px;
      text-align: center;
    }

    .chart-fallback-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    @media print {
      .executive-dashboard,
      .chart-grid,
      .biz-chart-container {
        page-break-inside: avoid;
      }
    }

    @media (max-width: 768px) {
      .dashboard-row {
        flex-direction: column;
      }

      .dashboard-main,
      .dashboard-side {
        min-width: 100%;
      }

      .chart-grid {
        grid-template-columns: 1fr !important;
      }
    }
  `;
}

// Helper functions

/**
 * Estimate benchmark score from percentile
 * (Simplified estimation assuming normal distribution)
 */
function estimateBenchmarkScore(score: number, percentile: number): number {
  if (percentile === 50) return score;

  // Estimate using typical business health distributions
  const estimatedSD = 15;
  const zScore = percentileToZScore(percentile);
  const estimatedMedian = score - (zScore * estimatedSD);

  return Math.max(20, Math.min(80, Math.round(estimatedMedian)));
}

/**
 * Convert percentile to z-score (approximation)
 */
function percentileToZScore(percentile: number): number {
  const zScores: Record<number, number> = {
    5: -1.645, 10: -1.282, 15: -1.036, 20: -0.842,
    25: -0.674, 30: -0.524, 35: -0.385, 40: -0.253,
    45: -0.126, 50: 0, 55: 0.126, 60: 0.253,
    65: 0.385, 70: 0.524, 75: 0.674, 80: 0.842,
    85: 1.036, 90: 1.282, 95: 1.645,
  };

  const closest = Object.keys(zScores)
    .map(Number)
    .reduce((prev, curr) =>
      Math.abs(curr - percentile) < Math.abs(prev - percentile) ? curr : prev
    );

  return zScores[closest] || 0;
}

/**
 * Generate fallback HTML when chart rendering fails
 */
function generateChartFallback(title: string, type: string): string {
  const icons: Record<string, string> = {
    radar: '🕸️',
    bar: '📊',
    donut: '🍩',
    gauge: '🎯',
    default: '📈',
  };

  return `
    <div class="chart-fallback" role="img" aria-label="${title} chart unavailable">
      <div>
        <div class="chart-fallback-icon">${icons[type] || icons.default}</div>
        <div><strong>${title}</strong></div>
        <div style="font-size: 0.85rem;">Chart visualization unavailable</div>
      </div>
    </div>
  `;
}
