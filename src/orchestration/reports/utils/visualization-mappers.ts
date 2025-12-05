/**
 * BizHealth Visualization Data Mappers
 *
 * Maps IDM (Insights Data Model) data structures to visualization component props.
 * This module serves as the bridge between raw IDM data and visual components.
 *
 * @module visualization-mappers
 */

import type {
  IDM,
  Risk,
  Recommendation,
  Dimension,
  Chapter,
  DimensionCode,
  ChapterCode,
  ScoreBand
} from '../../../types/idm.types.js';
import type { GaugeProps } from '../components/visual/gauge.component.js';
import type { MetricCardProps } from '../components/visual/metric-card.component.js';
import type { RiskItem } from '../components/visual/risk-matrix.component.js';
import type { RoadmapPhase as RoadmapTimelinePhase } from '../components/visual/roadmap-timeline.component.js';
import type { TimelineItem } from '../components/visual/timeline.component.js';
import type { KPIMetric } from '../components/visual/kpi-dashboard.component.js';
import { getScoreBand, type ScoreBand as UtilScoreBand } from './color-utils.js';

/**
 * BizHealth Brand Colors
 */
const BRAND = {
  navy: '#212653',
  green: '#969423',
  critical: '#dc3545',
  warning: '#ffc107',
  caution: '#e67e22',
  success: '#28a745',
  proficiency: '#0d6efd',
  lightBg: '#f8f9fa',
  border: '#e9ecef'
};

/**
 * Risk heatmap data point for visualization
 */
export interface RiskHeatmapDataPoint {
  id: string;
  label: string;
  x: number; // Likelihood 1-4
  y: number; // Severity 1-4
  category: string;
  color: string;
}

/**
 * Timeline phase data for roadmap visualization
 */
export interface TimelinePhaseData {
  id: string;
  name: string;
  startMonth: number;
  endMonth: number;
  color: string;
  milestones: Array<{
    name: string;
    month: number;
    priority: string;
  }>;
}

/**
 * Roadmap timeline data structure
 */
export interface RoadmapTimelineData {
  phases: TimelinePhaseData[];
  totalMonths: number;
}

/**
 * Metric card data for critical metrics dashboard
 */
export interface CriticalMetricData {
  id: string;
  label: string;
  value: number;
  benchmark: number;
  unit: string;
  status: 'critical' | 'warning' | 'proficiency' | 'excellence';
  trend: 'up' | 'down' | 'flat';
  section: string;
}

/**
 * Map IDM dimension score to gauge chart configuration
 *
 * @param dimensionCode - The dimension code (e.g., 'FIN', 'HRS')
 * @param score - The dimension score (0-100)
 * @param benchmark - The benchmark value for comparison
 * @param label - Display label for the gauge
 * @returns GaugeProps configuration for the gauge component
 */
export function mapDimensionToGauge(
  dimensionCode: string,
  score: number,
  benchmark: number,
  label: string
): GaugeProps {
  return {
    score: Math.round(score),
    size: 'medium',
    label: label,
    benchmark: benchmark,
    showStatus: true,
    showAccessibilitySymbol: true
  };
}

/**
 * Map IDM risks to heatmap data points
 * Converts risk severity and likelihood to 4x4 grid positions
 *
 * @param risks - Array of Risk objects from IDM
 * @returns Array of risk heatmap data points for visualization
 */
export function mapRisksToHeatmap(risks: Risk[]): RiskHeatmapDataPoint[] {
  const severityMap: Record<string, number> = {
    'critical': 4,
    'high': 3,
    'medium': 2,
    'low': 1
  };

  const likelihoodMap: Record<string, number> = {
    'high': 4,
    'medium-high': 3,
    'medium': 2,
    'low': 1
  };

  return risks.map(risk => {
    // Handle both string and numeric severity/likelihood
    const severityValue = typeof risk.severity === 'number'
      ? Math.min(4, Math.max(1, Math.ceil(risk.severity / 25)))
      : severityMap[String(risk.severity).toLowerCase()] || 2;

    const likelihoodValue = typeof risk.likelihood === 'number'
      ? Math.min(4, Math.max(1, Math.ceil(risk.likelihood / 25)))
      : likelihoodMap[String(risk.likelihood).toLowerCase()] || 2;

    // Determine color based on combined risk score
    const riskScore = severityValue * likelihoodValue;
    const color = riskScore >= 12 ? BRAND.critical :
                  riskScore >= 6 ? BRAND.warning :
                  BRAND.success;

    return {
      id: risk.id,
      label: risk.narrative?.substring(0, 50) || `Risk ${risk.id}`,
      x: likelihoodValue,
      y: severityValue,
      category: risk.category || risk.dimension_code,
      color
    };
  });
}

/**
 * Map IDM risks to RiskItem format for risk matrix component
 *
 * @param risks - Array of Risk objects from IDM
 * @returns Array of RiskItem for risk matrix component
 */
export function mapRisksToRiskMatrix(risks: Risk[]): RiskItem[] {
  return risks.map(risk => {
    // Convert severity to 1-5 scale
    const severityValue = typeof risk.severity === 'number'
      ? Math.min(5, Math.max(1, Math.ceil(risk.severity / 20))) as 1 | 2 | 3 | 4 | 5
      : mapSeverityToScale(String(risk.severity));

    // Convert likelihood to 1-5 scale
    const likelihoodValue = typeof risk.likelihood === 'number'
      ? Math.min(5, Math.max(1, Math.ceil(risk.likelihood / 20))) as 1 | 2 | 3 | 4 | 5
      : mapLikelihoodToScale(String(risk.likelihood));

    return {
      id: risk.id,
      label: risk.narrative?.substring(0, 100) || `Risk ${risk.id}`,
      likelihood: likelihoodValue,
      impact: severityValue,
      category: risk.category || risk.dimension_code
    };
  });
}

/**
 * Map IDM roadmap phases to timeline data
 *
 * @param roadmap - Roadmap object from IDM containing phases
 * @param recommendations - Array of recommendations to link milestones
 * @returns RoadmapTimelineData for timeline visualization
 */
export function mapRoadmapToTimeline(
  roadmap: { phases: Array<{ id: string; name: string; time_horizon: string; linked_recommendation_ids: string[]; narrative: string }> },
  recommendations: Recommendation[]
): RoadmapTimelineData {
  // Map time horizon strings to month ranges
  const horizonToMonths: Record<string, { start: number; end: number }> = {
    '90_days': { start: 0, end: 3 },
    '0-90 days': { start: 0, end: 3 },
    '90-180 days': { start: 3, end: 6 },
    '6_months': { start: 0, end: 6 },
    '12_months': { start: 6, end: 12 },
    '6-12 months': { start: 6, end: 12 },
    '18_months': { start: 12, end: 18 },
    '12-18 months': { start: 12, end: 18 },
    '24_months_plus': { start: 18, end: 24 },
    '18-24 months': { start: 18, end: 24 }
  };

  const phaseColors = [BRAND.critical, BRAND.caution, BRAND.proficiency, BRAND.success];

  const phases: TimelinePhaseData[] = roadmap.phases.map((phase, index) => {
    // Parse time horizon
    const monthRange = horizonToMonths[phase.time_horizon] ||
                      horizonToMonths[phase.time_horizon?.toLowerCase()] ||
                      { start: index * 6, end: (index + 1) * 6 };

    // Get linked recommendations as milestones
    const linkedRecs = recommendations.filter(rec =>
      phase.linked_recommendation_ids?.includes(rec.id)
    );

    const milestones = linkedRecs.slice(0, 3).map((rec, mIndex) => ({
      name: rec.theme || `Initiative ${mIndex + 1}`,
      month: monthRange.start + Math.floor((monthRange.end - monthRange.start) * (mIndex + 1) / 4),
      priority: rec.priority_rank <= 3 ? 'high' : rec.priority_rank <= 6 ? 'medium' : 'low'
    }));

    return {
      id: phase.id || `phase-${index + 1}`,
      name: phase.name || `Phase ${index + 1}`,
      startMonth: monthRange.start,
      endMonth: monthRange.end,
      color: phaseColors[index % phaseColors.length],
      milestones
    };
  });

  return {
    phases,
    totalMonths: Math.max(24, ...phases.map(p => p.endMonth))
  };
}

/**
 * Map IDM roadmap to roadmap timeline component props
 *
 * @param roadmap - Roadmap from IDM
 * @returns Array of RoadmapPhase for roadmap-timeline component
 */
export function mapRoadmapToRoadmapPhases(
  roadmap: { phases: Array<{ id: string; name: string; time_horizon: string; narrative: string; linked_recommendation_ids: string[] }> },
  recommendations: Recommendation[]
): RoadmapTimelinePhase[] {
  return roadmap.phases.map((phase, index) => {
    const phaseNum = (index + 1) as 1 | 2 | 3;

    // Get linked recommendations for deliverables
    const linkedRecs = recommendations.filter(rec =>
      phase.linked_recommendation_ids?.includes(rec.id)
    );

    return {
      phaseNumber: phaseNum,
      name: phase.name || `Phase ${phaseNum}`,
      timeframe: formatTimeHorizon(phase.time_horizon, index),
      focus: phase.narrative?.substring(0, 150) || 'Strategic implementation',
      keyDeliverables: linkedRecs.slice(0, 4).map(rec => rec.theme || rec.expected_outcomes),
      successMetrics: linkedRecs.slice(0, 2).map(rec => rec.expected_outcomes?.substring(0, 60))
    };
  });
}

/**
 * Generate critical metrics data from IDM for executive dashboard
 *
 * @param idm - The full IDM object
 * @returns Array of critical metric data for dashboard display
 */
export function mapCriticalMetrics(idm: IDM): CriticalMetricData[] {
  const metrics: CriticalMetricData[] = [];

  // Overall Health Score
  metrics.push({
    id: 'overall-health',
    label: 'Business Health Score',
    value: Math.round(idm.scores_summary.overall_health_score),
    benchmark: 65,
    unit: '/100',
    status: getMetricStatus(idm.scores_summary.overall_health_score),
    trend: mapTrajectory(idm.scores_summary.trajectory),
    section: 'Overall'
  });

  // Find critical dimensions
  const criticalDimensions = idm.dimensions
    .filter(d => d.score_overall < 50)
    .sort((a, b) => a.score_overall - b.score_overall)
    .slice(0, 4);

  criticalDimensions.forEach(dim => {
    metrics.push({
      id: dim.dimension_code.toLowerCase(),
      label: dim.name,
      value: Math.round(dim.score_overall),
      benchmark: dim.benchmark?.industry_average || 65,
      unit: '/100',
      status: getMetricStatus(dim.score_overall),
      trend: 'flat',
      section: dim.chapter_code
    });
  });

  // Add chapter scores if we have room
  if (metrics.length < 6) {
    const sortedChapters = [...idm.chapters].sort((a, b) => a.score_overall - b.score_overall);
    sortedChapters.slice(0, 6 - metrics.length).forEach(chapter => {
      metrics.push({
        id: `chapter-${chapter.chapter_code.toLowerCase()}`,
        label: chapter.name,
        value: Math.round(chapter.score_overall),
        benchmark: chapter.benchmark?.industry_average || 65,
        unit: '/100',
        status: getMetricStatus(chapter.score_overall),
        trend: 'flat',
        section: 'Chapter'
      });
    });
  }

  return metrics;
}

/**
 * Map IDM data to KPI metrics for dashboard
 *
 * @param idm - The full IDM object
 * @returns Array of KPIMetric for KPI dashboard component
 */
export function mapToKPIMetrics(idm: IDM): KPIMetric[] {
  const metrics: KPIMetric[] = [];

  // Overall score
  metrics.push({
    label: 'Overall Health',
    value: Math.round(idm.scores_summary.overall_health_score),
    status: getScoreBand(idm.scores_summary.overall_health_score) as UtilScoreBand,
    trend: mapTrajectory(idm.scores_summary.trajectory),
    unit: '/100'
  });

  // Chapter scores
  idm.chapters.forEach(chapter => {
    metrics.push({
      label: chapter.name,
      value: Math.round(chapter.score_overall),
      status: getScoreBand(chapter.score_overall) as UtilScoreBand,
      unit: '/100'
    });
  });

  return metrics;
}

/**
 * Map recommendations to timeline items for quick wins timeline
 *
 * @param recommendations - Array of recommendations from IDM
 * @param quickWinIds - Array of recommendation IDs marked as quick wins
 * @returns Array of TimelineItem for timeline component
 */
export function mapRecommendationsToTimeline(
  recommendations: Recommendation[],
  quickWinIds: string[]
): TimelineItem[] {
  // Filter to quick wins and sort by priority
  const quickWins = recommendations
    .filter(rec => quickWinIds.includes(rec.id))
    .sort((a, b) => a.priority_rank - b.priority_rank);

  return quickWins.map((rec, index) => ({
    label: rec.theme || `Initiative ${index + 1}`,
    startDay: index * 15, // Stagger starts
    endDay: (index + 1) * 30,
    priority: mapPriorityToLevel(rec.priority_rank),
    description: rec.expected_outcomes
  }));
}

/**
 * Map dimension scores for gauge display
 *
 * @param dimensions - Array of dimensions from IDM
 * @returns Map of dimension code to gauge configuration
 */
export function mapDimensionsToGauges(
  dimensions: Dimension[]
): Record<DimensionCode, GaugeProps> {
  const gauges: Record<string, GaugeProps> = {};

  dimensions.forEach(dim => {
    gauges[dim.dimension_code] = {
      score: Math.round(dim.score_overall),
      size: 'small',
      label: dim.name,
      benchmark: dim.benchmark?.industry_average,
      showStatus: true,
      showAccessibilitySymbol: false
    };
  });

  return gauges as Record<DimensionCode, GaugeProps>;
}

/**
 * Map chapter data to chapter gauges
 *
 * @param chapters - Array of chapters from IDM
 * @returns Array of chapter gauge data for renderChapterGauges
 */
export function mapChaptersToGauges(chapters: Chapter[]): Array<{ name: string; score: number; code?: string }> {
  return chapters.map(chapter => ({
    name: chapter.name,
    score: Math.round(chapter.score_overall),
    code: chapter.chapter_code
  }));
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Map severity string to 1-5 scale
 */
function mapSeverityToScale(severity: string): 1 | 2 | 3 | 4 | 5 {
  const map: Record<string, 1 | 2 | 3 | 4 | 5> = {
    'critical': 5,
    'high': 4,
    'medium-high': 3,
    'medium': 3,
    'low-medium': 2,
    'low': 2,
    'minimal': 1
  };
  return map[severity.toLowerCase()] || 3;
}

/**
 * Map likelihood string to 1-5 scale
 */
function mapLikelihoodToScale(likelihood: string): 1 | 2 | 3 | 4 | 5 {
  const map: Record<string, 1 | 2 | 3 | 4 | 5> = {
    'almost certain': 5,
    'high': 4,
    'likely': 4,
    'medium-high': 3,
    'medium': 3,
    'possible': 3,
    'low-medium': 2,
    'low': 2,
    'unlikely': 2,
    'rare': 1
  };
  return map[likelihood.toLowerCase()] || 3;
}

/**
 * Get metric status from score
 */
function getMetricStatus(score: number): 'critical' | 'warning' | 'proficiency' | 'excellence' {
  if (score < 40) return 'critical';
  if (score < 60) return 'warning';
  if (score < 80) return 'proficiency';
  return 'excellence';
}

/**
 * Map trajectory to trend direction
 */
function mapTrajectory(trajectory: string): 'up' | 'down' | 'flat' {
  const lower = trajectory?.toLowerCase() || '';
  if (lower === 'improving' || lower === 'up') return 'up';
  if (lower === 'declining' || lower === 'down') return 'down';
  return 'flat';
}

/**
 * Map priority rank to priority level
 */
function mapPriorityToLevel(rank: number): 'critical' | 'high' | 'medium' | 'low' {
  if (rank <= 2) return 'critical';
  if (rank <= 5) return 'high';
  if (rank <= 8) return 'medium';
  return 'low';
}

/**
 * Format time horizon for display
 */
function formatTimeHorizon(horizon: string, index: number): string {
  const formats: Record<string, string> = {
    '90_days': 'Months 1-3',
    '0-90 days': 'Months 1-3',
    '6_months': 'Months 1-6',
    '12_months': 'Months 7-12',
    '6-12 months': 'Months 7-12',
    '18_months': 'Months 13-18',
    '12-18 months': 'Months 13-18',
    '24_months_plus': 'Months 19-24',
    '18-24 months': 'Months 19-24'
  };
  return formats[horizon] || formats[horizon?.toLowerCase()] || `Phase ${index + 1}`;
}
