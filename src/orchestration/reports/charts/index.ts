/**
 * BizHealth.ai Server-Side Chart Visualization System
 *
 * This module provides server-side chart rendering using Chart.js
 * and chartjs-node-canvas for generating static chart images
 * suitable for PDF export and print media.
 *
 * Features:
 * - Server-side PNG/SVG rendering without browser dependency
 * - BizHealth brand-consistent styling
 * - Accessibility support (ARIA labels, alt text, data tables)
 * - Print-optimized output
 *
 * @example
 * ```typescript
 * import {
 *   renderChart,
 *   generateDimensionScoreChart,
 *   BIZHEALTH_CHART_THEME
 * } from './charts/index.js';
 *
 * const config = generateDimensionScoreChart(dimensions, benchmarks, {
 *   title: 'Dimension Scores',
 *   showBenchmark: true
 * });
 *
 * const rendered = await renderChart(config, { width: 600, height: 400 });
 * const html = rendered.html; // <figure> with embedded PNG
 * ```
 */

// Core renderer
export {
  renderChart,
  renderChartToBuffer,
  renderChartToDataUrl,
  generateChartStyles,
  clearRendererCache,
} from './chart-renderer.js';

// Theme and styling
export {
  BIZHEALTH_CHART_THEME,
  DEFAULT_CHART_OPTIONS,
  getScoreBandColor,
  getScoreBand,
  colorWithOpacity,
  BAR_CHART_DEFAULTS,
  SCORE_BAND_COLORS,
} from './chart-theme.js';

// Accessibility utilities
export {
  generateChartAriaLabel,
  generateChartAltText,
  generateChartDataTable,
  generateDataTableStyles,
} from './chart-accessibility.js';

// All generators
export * from './generators/index.js';

// Report integration utilities
export {
  generateChapterOverviewRadar,
  generateChapterDimensionBars,
  generateAllChapterScoreBars,
  generateScoreBandDistribution,
  generateBenchmarkComparison,
  generateGapAnalysis,
  generateStrengthsWeaknessesChart,
  generateHealthScoreGauge,
  generateChapterDimensionRadar,
  generateChapterRadarGrid,
  generateExecutiveDashboard,
  getReportChartStyles,
  CHART_SIZES,
} from './report-chart-integration.js';

// Types
export type {
  ChartOutputFormat,
  ChartRenderOptions,
  RenderedChart,
  ChartDataPoint,
  ScoreBarChartConfig,
  RadarChartConfig,
  DonutChartConfig,
  ComparisonBarChartConfig,
  GaugeChartConfig,
  DimensionChartData,
  ChapterChartData,
  RiskChartData,
  DistributionChartData,
  ChartTheme,
  ChartAccessibilityConfig,
  ChartGenerator,
  ChartRenderer,
} from './types/chart.types.js';
