/**
 * Executive Components Index
 *
 * Exports all executive dashboard components for BizHealth reports.
 */

// Dashboard Layout - Main executive dashboard generator
export {
  generateExecutiveDashboard,
  generateHealthGauge,
  generateChapterKPITiles,
  generateDimensionRadar,
  generateDimensionHeatmap,
  generateRoadmapTimeline,
  generateInvestmentDonut,
  generateRiskTable,
  // Additional visualizations (11 total for premium dashboard)
  generateBenchmarkBars,
  generateChapterSparklines,
  generateScoreDistribution,
  generatePerformanceWaterfall,
  generateFinancialSummary,
  getDashboardStyles,
} from './dashboard-layout.component.js';
