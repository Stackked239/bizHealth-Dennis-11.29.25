/**
 * Manager Report Section Renderers
 *
 * Consolidated section rendering functions for Manager Reports.
 * Each function generates HTML for a specific section type.
 *
 * @module manager-sections
 */

import type { ReportContext, ReportDimension, ReportRecommendation, ReportRisk } from '../../../../types/report.types.js';
import type { DimensionCode } from '../../../../types/idm.types.js';
import type {
  CompanySnapshotSection,
  DimensionDeepDiveSection,
  DepartmentRoadmapSection,
  RiskOverviewSection,
  MetricsDashboardSection,
  ManagerClosingSection,
  QuickWinsHighlightSection,
  ManagerReportRecipe,
} from '../../config/section-types.js';
import {
  safeStringValue,
  safeScore,
  safeScoreBand,
  safeScoreBandColor,
  safeArray,
  safeHtml,
} from '../../utils/safe-extract.js';
import {
  getDimensionsForManager,
  calculateDepartmentScore,
  filterFindingsByDimensions,
  filterRecommendationsByDimensions,
  filterQuickWinsByDimensions,
  filterRisksByDimensions,
  MANAGER_TITLES,
  type ManagerType,
} from '../../utils/dimension-filters.js';
import {
  renderFindingsGrouped,
} from '../cards/finding-card.component.js';
import {
  renderRecommendationRow,
} from '../cards/recommendation-card.component.js';
import {
  renderManagerQuickWinCards,
  renderManagerQuickWinChecklist,
  renderQuickWinsSummaryStats,
} from '../cards/manager-quick-win-card.component.js';

// ============================================================================
// COMPANY SNAPSHOT SECTION
// ============================================================================

/**
 * Render Company Health Snapshot section
 */
export function renderCompanySnapshotSection(
  ctx: ReportContext,
  section: CompanySnapshotSection,
  recipe: ManagerReportRecipe
): string {
  const overallScore = safeScore(ctx.overallHealth?.score, 0);
  const overallBand = safeScoreBand(overallScore);
  const companyName = safeStringValue(ctx.companyProfile?.name, 'Your Company');
  const trajectory = ctx.overallHealth?.trajectory || 'Flat';

  // Get department-specific data
  const managerType = recipe.managerType as ManagerType;
  const dimensions = getDimensionsForManager(ctx, managerType);
  const { score: deptScore, band: deptBand } = calculateDepartmentScore(dimensions);

  const managerTitle = MANAGER_TITLES[managerType] || 'Your Department';

  // Get key company highlights
  const strengths = safeArray(ctx.executiveSummary?.keyStrengths).slice(0, 3);
  const priorities = safeArray(ctx.executiveSummary?.keyPriorities).slice(0, 3);

  return `
    <section id="${section.id}" class="report-section company-snapshot-section" style="padding: 2rem; margin-bottom: 2rem; page-break-inside: avoid;">
      <h2 style="
        font-family: 'Montserrat', sans-serif;
        font-size: 1.5rem;
        font-weight: 700;
        color: #212653;
        margin: 0 0 1.5rem 0;
        padding-bottom: 0.5rem;
        border-bottom: 3px solid #969423;
      ">${safeHtml(section.title)}</h2>

      <!-- Score Comparison Grid -->
      <div style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      ">
        <!-- Overall Company Health -->
        <div style="
          background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
        ">
          <h3 style="
            font-family: 'Montserrat', sans-serif;
            font-size: 0.875rem;
            font-weight: 600;
            color: #6b7280;
            margin: 0 0 1rem 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          ">Overall Company Health</h3>
          <div style="
            font-size: 3.5rem;
            font-weight: 700;
            color: ${safeScoreBandColor(overallScore)};
            margin-bottom: 0.5rem;
          ">${overallScore}</div>
          <div style="
            display: inline-block;
            padding: 0.375rem 1rem;
            background: ${safeScoreBandColor(overallScore)};
            color: white;
            border-radius: 1.5rem;
            font-size: 0.875rem;
            font-weight: 600;
          ">${overallBand}</div>
          ${section.showTrajectory ? `
            <div style="margin-top: 0.75rem; font-size: 0.875rem; color: #6b7280;">
              Trajectory: <span style="font-weight: 600; color: ${trajectory === 'Improving' ? '#059669' : trajectory === 'Declining' ? '#dc2626' : '#6b7280'};">
                ${trajectory === 'Improving' ? '↑' : trajectory === 'Declining' ? '↓' : '→'} ${trajectory}
              </span>
            </div>
          ` : ''}
        </div>

        <!-- Department Health -->
        <div style="
          background: linear-gradient(135deg, ${deptBand === 'Excellence' ? '#f0fdf4' : deptBand === 'Proficiency' ? '#eff6ff' : deptBand === 'Attention' ? '#fffbeb' : '#fef2f2'} 0%, #ffffff 100%);
          border: 2px solid ${safeScoreBandColor(deptScore)};
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
        ">
          <h3 style="
            font-family: 'Montserrat', sans-serif;
            font-size: 0.875rem;
            font-weight: 600;
            color: #6b7280;
            margin: 0 0 1rem 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          ">${safeHtml(managerTitle)} Health</h3>
          <div style="
            font-size: 3.5rem;
            font-weight: 700;
            color: ${safeScoreBandColor(deptScore)};
            margin-bottom: 0.5rem;
          ">${deptScore}</div>
          <div style="
            display: inline-block;
            padding: 0.375rem 1rem;
            background: ${safeScoreBandColor(deptScore)};
            color: white;
            border-radius: 1.5rem;
            font-size: 0.875rem;
            font-weight: 600;
          ">${deptBand}</div>
          <div style="margin-top: 0.75rem; font-size: 0.8125rem; color: #6b7280;">
            Based on ${dimensions.length} focus dimension${dimensions.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <!-- Interpretation -->
      <div style="
        background: #f9fafb;
        border-radius: 8px;
        padding: 1.25rem;
        margin-bottom: 1.5rem;
      ">
        <h4 style="
          font-family: 'Montserrat', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          color: #212653;
          margin: 0 0 0.75rem 0;
        ">What This Means for ${safeHtml(managerTitle)}</h4>
        <p style="margin: 0; color: #374151; line-height: 1.6;">
          ${generateDepartmentInterpretation(overallScore, deptScore, deptBand, managerTitle, companyName)}
        </p>
      </div>

      <!-- Company Context -->
      ${strengths.length > 0 || priorities.length > 0 ? `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
          ${strengths.length > 0 ? `
            <div style="
              background: #f0fdf4;
              border-left: 4px solid #059669;
              border-radius: 0 8px 8px 0;
              padding: 1rem;
            ">
              <h4 style="
                font-size: 0.875rem;
                font-weight: 600;
                color: #059669;
                margin: 0 0 0.75rem 0;
              ">✓ Company Strengths</h4>
              <ul style="margin: 0; padding-left: 1.25rem; color: #374151; font-size: 0.875rem; line-height: 1.6;">
                ${strengths.map(s => `<li>${safeHtml(s)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          ${priorities.length > 0 ? `
            <div style="
              background: #eff6ff;
              border-left: 4px solid #2563eb;
              border-radius: 0 8px 8px 0;
              padding: 1rem;
            ">
              <h4 style="
                font-size: 0.875rem;
                font-weight: 600;
                color: #2563eb;
                margin: 0 0 0.75rem 0;
              ">↗ Company Priorities</h4>
              <ul style="margin: 0; padding-left: 1.25rem; color: #374151; font-size: 0.875rem; line-height: 1.6;">
                ${priorities.map(p => `<li>${safeHtml(p)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      ` : ''}
    </section>
  `;
}

function generateDepartmentInterpretation(
  overallScore: number,
  deptScore: number,
  deptBand: string,
  managerTitle: string,
  companyName: string
): string {
  const diff = deptScore - overallScore;
  const diffText = diff >= 0
    ? `${diff} points above the company average`
    : `${Math.abs(diff)} points below the company average`;

  if (deptBand === 'Excellence') {
    return `${managerTitle} is performing at an excellent level (${deptScore}/100), ${diffText}. Your team's strong performance is contributing positively to ${companyName}'s overall health. Focus on sustaining these strengths while identifying opportunities to mentor other areas of the business.`;
  } else if (deptBand === 'Proficiency') {
    return `${managerTitle} shows solid performance (${deptScore}/100), ${diffText}. There's room for targeted improvements to elevate from Proficiency to Excellence. The recommendations in this report identify specific opportunities to drive measurable improvement.`;
  } else if (deptBand === 'Attention') {
    return `${managerTitle} requires focused attention (${deptScore}/100), ${diffText}. Several areas need improvement to reach competitive benchmarks. Prioritize the quick wins identified in this report for rapid progress, then address longer-term strategic initiatives.`;
  } else {
    return `${managerTitle} faces critical challenges (${deptScore}/100) that require immediate action. Focus on stabilization initiatives first, then systematic improvement. The roadmap section provides a structured approach to recovery and growth.`;
  }
}

// ============================================================================
// DIMENSION DEEP DIVE SECTION
// ============================================================================

/**
 * Render Dimension Deep Dive section
 */
export function renderDimensionDeepDiveSection(
  ctx: ReportContext,
  section: DimensionDeepDiveSection
): string {
  const dimensions = getDimensionsByCodes(ctx, section.dimensionCodes);

  if (dimensions.length === 0) {
    return renderEmptySection(section, 'Dimension data not available in current assessment.');
  }

  const dimensionBlocks = dimensions.map(dim =>
    renderDimensionBlock(ctx, dim, section)
  ).join('');

  return `
    <section id="${section.id}" class="report-section deep-dive-section" style="padding: 2rem; margin-bottom: 2rem;">
      <h2 style="
        font-family: 'Montserrat', sans-serif;
        font-size: 1.5rem;
        font-weight: 700;
        color: #212653;
        margin: 0 0 1.5rem 0;
        padding-bottom: 0.5rem;
        border-bottom: 3px solid #969423;
      ">${safeHtml(section.title)}</h2>

      ${dimensionBlocks}
    </section>
  `;
}

function getDimensionsByCodes(ctx: ReportContext, codes: DimensionCode[]): ReportDimension[] {
  return safeArray(ctx.dimensions).filter(dim => codes.includes(dim.code as DimensionCode));
}

function renderDimensionBlock(
  ctx: ReportContext,
  dimension: ReportDimension,
  section: DimensionDeepDiveSection
): string {
  const dimName = safeStringValue(dimension.name, 'Dimension');
  const dimCode = safeStringValue(dimension.code, 'DIM');
  const dimScore = safeScore(dimension.score, 0);
  const dimBand = safeScoreBand(dimScore);
  const dimDescription = safeStringValue(dimension.description, '');

  // Get findings for this dimension
  const findings = filterFindingsByDimensions(ctx.findings, [dimension.code as DimensionCode]);

  // Get quick wins if enabled
  const quickWins = section.showQuickWins
    ? filterQuickWinsByDimensions(ctx.quickWins, [dimension.code as DimensionCode], ctx)
    : [];

  // Get benchmark data if available
  const benchmarkPercentile = dimension.benchmark?.peerPercentile;

  return `
    <div class="dimension-block" style="
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      page-break-inside: avoid;
    ">
      <!-- Dimension Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
        <div>
          <h3 style="
            font-family: 'Montserrat', sans-serif;
            font-size: 1.25rem;
            font-weight: 600;
            color: #212653;
            margin: 0;
          ">${safeHtml(dimName)} <span style="font-size: 0.875rem; color: #6b7280; font-weight: 400;">(${dimCode})</span></h3>
          ${dimDescription ? `<p style="margin: 0.5rem 0 0 0; color: #6b7280; font-size: 0.875rem;">${safeHtml(dimDescription)}</p>` : ''}
        </div>
        <div style="text-align: right;">
          <div style="
            font-size: 2.5rem;
            font-weight: 700;
            color: ${safeScoreBandColor(dimScore)};
            line-height: 1;
          ">${dimScore}</div>
          <div style="
            display: inline-block;
            padding: 0.25rem 0.75rem;
            background: ${safeScoreBandColor(dimScore)};
            color: white;
            border-radius: 1rem;
            font-size: 0.75rem;
            font-weight: 600;
            margin-top: 0.25rem;
          ">${dimBand}</div>
        </div>
      </div>

      ${section.showBenchmarks && benchmarkPercentile !== undefined ? `
        <!-- Benchmark Comparison -->
        <div style="
          background: #f9fafb;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
        ">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span style="font-size: 0.8125rem; color: #6b7280;">Industry Benchmark</span>
            <span style="font-size: 0.875rem; font-weight: 600; color: #212653;">${benchmarkPercentile}th percentile</span>
          </div>
          <div style="
            height: 8px;
            background: #e5e7eb;
            border-radius: 4px;
            overflow: hidden;
          ">
            <div style="
              width: ${benchmarkPercentile}%;
              height: 100%;
              background: ${safeScoreBandColor(dimScore)};
              border-radius: 4px;
            "></div>
          </div>
        </div>
      ` : ''}

      ${section.showSubIndicators && dimension.subIndicators?.length > 0 ? `
        <!-- Sub-Indicators -->
        <div style="margin-bottom: 1rem;">
          <h4 style="font-size: 0.875rem; font-weight: 600; color: #374151; margin: 0 0 0.75rem 0;">Sub-Indicators</h4>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${safeArray(dimension.subIndicators).map(sub => {
              const subScore = safeScore(sub.score, 0);
              return `
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <span style="flex: 1; font-size: 0.8125rem; color: #374151;">${safeHtml(sub.name)}</span>
                  <div style="width: 100px; height: 6px; background: #e5e7eb; border-radius: 3px; overflow: hidden;">
                    <div style="width: ${subScore}%; height: 100%; background: ${safeScoreBandColor(subScore)};"></div>
                  </div>
                  <span style="width: 2rem; text-align: right; font-size: 0.8125rem; font-weight: 600; color: ${safeScoreBandColor(subScore)};">${subScore}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Findings -->
      ${findings.length > 0 ? `
        <div style="margin-bottom: ${quickWins.length > 0 ? '1rem' : '0'};">
          <h4 style="font-size: 0.875rem; font-weight: 600; color: #374151; margin: 0 0 0.75rem 0;">Key Findings</h4>
          ${renderFindingsGrouped(findings, {
            maxStrengths: section.maxFindings || 3,
            maxGaps: section.maxFindings || 3,
            showDimension: false,
          })}
        </div>
      ` : ''}

      <!-- Quick Wins -->
      ${quickWins.length > 0 ? `
        <div>
          <h4 style="font-size: 0.875rem; font-weight: 600; color: #059669; margin: 0 0 0.75rem 0;">⚡ Quick Wins for ${safeHtml(dimName)}</h4>
          ${renderManagerQuickWinChecklist(quickWins, { maxItems: 3 })}
        </div>
      ` : ''}
    </div>
  `;
}

// ============================================================================
// QUICK WINS HIGHLIGHT SECTION
// ============================================================================

/**
 * Render Quick Wins Highlight section
 */
export function renderQuickWinsHighlightSection(
  ctx: ReportContext,
  section: QuickWinsHighlightSection
): string {
  const quickWins = filterQuickWinsByDimensions(ctx.quickWins, section.dimensionCodes, ctx);

  if (quickWins.length === 0) {
    return renderEmptySection(section, 'No quick wins identified for this department. Quick wins are high-impact, low-effort initiatives that can be implemented within 90 days.');
  }

  return `
    <section id="${section.id}" class="report-section quick-wins-section" style="padding: 2rem; margin-bottom: 2rem;">
      <h2 style="
        font-family: 'Montserrat', sans-serif;
        font-size: 1.5rem;
        font-weight: 700;
        color: #212653;
        margin: 0 0 1.5rem 0;
        padding-bottom: 0.5rem;
        border-bottom: 3px solid #969423;
      ">${safeHtml(section.title)}</h2>

      ${renderQuickWinsSummaryStats(quickWins)}

      ${section.showChecklist
        ? renderManagerQuickWinChecklist(quickWins, { maxItems: section.maxQuickWins || 5 })
        : renderManagerQuickWinCards(quickWins, { maxCount: section.maxQuickWins || 5 })
      }
    </section>
  `;
}

// ============================================================================
// DEPARTMENT ROADMAP SECTION
// ============================================================================

/**
 * Render Department Roadmap section
 */
export function renderDepartmentRoadmapSection(
  ctx: ReportContext,
  section: DepartmentRoadmapSection
): string {
  const horizonDays = section.horizonDays || 180;
  const recommendations = filterRecommendationsByDimensions(ctx.recommendations, section.dimensionCodes);

  // Group by horizon
  const immediate = recommendations.filter(r => r.horizon === '90_days');
  const shortTerm = recommendations.filter(r => r.horizon === '12_months');
  const longTerm = recommendations.filter(r => r.horizon === '24_months_plus');

  const hasContent = immediate.length > 0 || shortTerm.length > 0 || (horizonDays > 180 && longTerm.length > 0);

  if (!hasContent) {
    return renderEmptySection(section, 'No specific roadmap items identified for your department. See the Company Roadmap Report for organization-wide initiatives.');
  }

  return `
    <section id="${section.id}" class="report-section roadmap-section" style="padding: 2rem; margin-bottom: 2rem;">
      <h2 style="
        font-family: 'Montserrat', sans-serif;
        font-size: 1.5rem;
        font-weight: 700;
        color: #212653;
        margin: 0 0 1.5rem 0;
        padding-bottom: 0.5rem;
        border-bottom: 3px solid #969423;
      ">${safeHtml(section.title)}</h2>

      <p style="color: #6b7280; margin-bottom: 1.5rem; font-size: 0.9375rem;">
        The following initiatives are prioritized for your department over the next ${horizonDays} days.
        Focus on completing Phase 1 items before advancing to later phases.
      </p>

      ${immediate.length > 0 ? renderRoadmapPhase(immediate, 'Phase 1: Next 90 Days', '#059669', section.maxItemsPerPhase || 5) : ''}
      ${shortTerm.length > 0 ? renderRoadmapPhase(shortTerm, 'Phase 2: 3-12 Months', '#2563eb', section.maxItemsPerPhase || 5) : ''}
      ${horizonDays > 180 && longTerm.length > 0 ? renderRoadmapPhase(longTerm, 'Phase 3: 12-24+ Months', '#7c3aed', section.maxItemsPerPhase || 5) : ''}

      <div style="
        margin-top: 1.5rem;
        padding: 1rem;
        background: #f9fafb;
        border-radius: 8px;
        font-size: 0.875rem;
        color: #6b7280;
      ">
        <strong>See also:</strong> <a href="roadmap.html" style="color: #2563eb; text-decoration: none; font-weight: 600;">Full Implementation Roadmap</a> for company-wide initiatives and dependencies.
      </div>
    </section>
  `;
}

function renderRoadmapPhase(
  recommendations: ReportRecommendation[],
  phaseName: string,
  color: string,
  maxItems: number
): string {
  const items = recommendations.slice(0, maxItems);

  return `
    <div style="margin-bottom: 1.5rem;">
      <h3 style="
        font-family: 'Montserrat', sans-serif;
        font-size: 1.125rem;
        font-weight: 600;
        color: ${color};
        margin: 0 0 1rem 0;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid ${color}30;
      ">${phaseName}</h3>
      <div>
        ${items.map(rec => renderRecommendationRow(rec)).join('')}
      </div>
    </div>
  `;
}

// ============================================================================
// RISK OVERVIEW SECTION
// ============================================================================

/**
 * Render Risk Overview section
 */
export function renderRiskOverviewSection(
  ctx: ReportContext,
  section: RiskOverviewSection
): string {
  const risks = filterRisksByDimensions(ctx.risks, section.dimensionCodes);

  if (risks.length === 0) {
    return `
      <section id="${section.id}" class="report-section risk-section" style="padding: 2rem; margin-bottom: 2rem;">
        <h2 style="
          font-family: 'Montserrat', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #212653;
          margin: 0 0 1.5rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 3px solid #969423;
        ">${safeHtml(section.title)}</h2>

        <div style="
          padding: 2rem;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 8px;
          text-align: center;
        ">
          <span style="font-size: 2rem; display: block; margin-bottom: 0.5rem;">✓</span>
          <p style="margin: 0 0 0.5rem 0; color: #166534; font-weight: 600;">No critical department-specific risks identified</p>
          <p style="margin: 0; color: #6b7280; font-size: 0.875rem;">
            See the <a href="risk.html" style="color: #2563eb;">Full Risk Assessment</a> for company-wide risk analysis.
          </p>
        </div>
      </section>
    `;
  }

  // Sort by severity
  const sortedRisks = [...risks].sort((a, b) => {
    const getSeverityValue = (sev: string | number): number => {
      if (typeof sev === 'number') return sev;
      const lower = String(sev).toLowerCase();
      if (lower.includes('critical') || lower === '10') return 10;
      if (lower.includes('high')) return 8;
      if (lower.includes('medium')) return 5;
      return 3;
    };
    return getSeverityValue(b.severity) - getSeverityValue(a.severity);
  }).slice(0, section.maxRisks || 5);

  return `
    <section id="${section.id}" class="report-section risk-section" style="padding: 2rem; margin-bottom: 2rem;">
      <h2 style="
        font-family: 'Montserrat', sans-serif;
        font-size: 1.5rem;
        font-weight: 700;
        color: #212653;
        margin: 0 0 1.5rem 0;
        padding-bottom: 0.5rem;
        border-bottom: 3px solid #969423;
      ">${safeHtml(section.title)}</h2>

      ${section.showHeatmap ? renderRiskHeatmapSummary(sortedRisks) : ''}

      <div style="margin-top: 1.5rem;">
        ${sortedRisks.map((risk, i) => renderRiskCard(risk, i)).join('')}
      </div>

      <div style="
        margin-top: 1.5rem;
        padding: 1rem;
        background: #f9fafb;
        border-radius: 8px;
        font-size: 0.875rem;
        color: #6b7280;
      ">
        <strong>See also:</strong> <a href="risk.html" style="color: #2563eb; text-decoration: none; font-weight: 600;">Full Risk Assessment Report</a> for comprehensive analysis and mitigation strategies.
      </div>
    </section>
  `;
}

function renderRiskHeatmapSummary(risks: ReportRisk[]): string {
  const counts = { critical: 0, high: 0, medium: 0, low: 0 };

  risks.forEach(risk => {
    const sev = typeof risk.severity === 'number' ? risk.severity : parseInt(String(risk.severity)) || 5;
    if (sev >= 9) counts.critical++;
    else if (sev >= 7) counts.high++;
    else if (sev >= 4) counts.medium++;
    else counts.low++;
  });

  return `
    <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
      <div style="
        flex: 1;
        min-width: 100px;
        padding: 0.75rem;
        background: #dc2626;
        color: white;
        border-radius: 8px;
        text-align: center;
      ">
        <div style="font-size: 1.5rem; font-weight: 700;">${counts.critical}</div>
        <div style="font-size: 0.75rem; text-transform: uppercase;">Critical</div>
      </div>
      <div style="
        flex: 1;
        min-width: 100px;
        padding: 0.75rem;
        background: #ea580c;
        color: white;
        border-radius: 8px;
        text-align: center;
      ">
        <div style="font-size: 1.5rem; font-weight: 700;">${counts.high}</div>
        <div style="font-size: 0.75rem; text-transform: uppercase;">High</div>
      </div>
      <div style="
        flex: 1;
        min-width: 100px;
        padding: 0.75rem;
        background: #d97706;
        color: white;
        border-radius: 8px;
        text-align: center;
      ">
        <div style="font-size: 1.5rem; font-weight: 700;">${counts.medium}</div>
        <div style="font-size: 0.75rem; text-transform: uppercase;">Medium</div>
      </div>
      <div style="
        flex: 1;
        min-width: 100px;
        padding: 0.75rem;
        background: #059669;
        color: white;
        border-radius: 8px;
        text-align: center;
      ">
        <div style="font-size: 1.5rem; font-weight: 700;">${counts.low}</div>
        <div style="font-size: 0.75rem; text-transform: uppercase;">Low</div>
      </div>
    </div>
  `;
}

function renderRiskCard(risk: ReportRisk, index: number): string {
  const narrative = safeStringValue(risk.narrative, 'Risk details pending');
  const dimensionName = safeStringValue(risk.dimensionName, '');
  const mitigation = safeStringValue(risk.mitigationSummary || '', '');

  const sevValue = typeof risk.severity === 'number' ? risk.severity : parseInt(String(risk.severity)) || 5;
  let sevLabel: string, sevColor: string;
  if (sevValue >= 9) { sevLabel = 'Critical'; sevColor = '#dc2626'; }
  else if (sevValue >= 7) { sevLabel = 'High'; sevColor = '#ea580c'; }
  else if (sevValue >= 4) { sevLabel = 'Medium'; sevColor = '#d97706'; }
  else { sevLabel = 'Low'; sevColor = '#059669'; }

  return `
    <div style="
      background: white;
      border: 1px solid #e5e7eb;
      border-left: 4px solid ${sevColor};
      border-radius: 0 8px 8px 0;
      padding: 1rem;
      margin-bottom: 0.75rem;
    ">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
        <div>
          <span style="
            display: inline-block;
            padding: 0.25rem 0.5rem;
            background: ${sevColor};
            color: white;
            border-radius: 4px;
            font-size: 0.7rem;
            font-weight: 600;
            text-transform: uppercase;
          ">${sevLabel}</span>
          ${dimensionName ? `<span style="margin-left: 0.5rem; font-size: 0.8125rem; color: #6b7280;">${safeHtml(dimensionName)}</span>` : ''}
        </div>
        <span style="font-size: 0.8125rem; color: #6b7280;">#${index + 1}</span>
      </div>
      <p style="margin: 0 0 ${mitigation ? '0.75rem' : '0'} 0; color: #374151; font-size: 0.9375rem; line-height: 1.5;">
        ${safeHtml(narrative)}
      </p>
      ${mitigation ? `
        <div style="
          padding: 0.75rem;
          background: #f0fdf4;
          border-radius: 6px;
        ">
          <span style="font-weight: 600; color: #166534; font-size: 0.8125rem;">Recommended Action:</span>
          <span style="color: #374151; font-size: 0.8125rem;"> ${safeHtml(mitigation)}</span>
        </div>
      ` : ''}
    </div>
  `;
}

// ============================================================================
// METRICS DASHBOARD SECTION
// ============================================================================

/**
 * Render Metrics Dashboard section
 */
export function renderMetricsDashboardSection(
  ctx: ReportContext,
  section: MetricsDashboardSection
): string {
  const dimensions = getDimensionsByCodes(ctx, section.dimensionCodes);

  if (dimensions.length === 0) {
    return renderEmptySection(section, 'Metrics data not available for this assessment.');
  }

  return `
    <section id="${section.id}" class="report-section metrics-section" style="padding: 2rem; margin-bottom: 2rem;">
      <h2 style="
        font-family: 'Montserrat', sans-serif;
        font-size: 1.5rem;
        font-weight: 700;
        color: #212653;
        margin: 0 0 1.5rem 0;
        padding-bottom: 0.5rem;
        border-bottom: 3px solid #969423;
      ">${safeHtml(section.title)}</h2>

      <div style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 1rem;
      ">
        ${dimensions.map(dim => renderMetricCard(dim, section)).join('')}
      </div>

      <!-- Legend -->
      <div style="
        display: flex;
        gap: 1.5rem;
        justify-content: center;
        margin-top: 1.5rem;
        flex-wrap: wrap;
        font-size: 0.8125rem;
        color: #6b7280;
      ">
        <span style="display: flex; align-items: center; gap: 0.375rem;">
          <span style="width: 12px; height: 12px; background: #059669; border-radius: 50%;"></span>
          Excellence (80-100)
        </span>
        <span style="display: flex; align-items: center; gap: 0.375rem;">
          <span style="width: 12px; height: 12px; background: #2563eb; border-radius: 50%;"></span>
          Proficiency (60-79)
        </span>
        <span style="display: flex; align-items: center; gap: 0.375rem;">
          <span style="width: 12px; height: 12px; background: #d97706; border-radius: 50%;"></span>
          Attention (40-59)
        </span>
        <span style="display: flex; align-items: center; gap: 0.375rem;">
          <span style="width: 12px; height: 12px; background: #dc2626; border-radius: 50%;"></span>
          Critical (0-39)
        </span>
      </div>
    </section>
  `;
}

function renderMetricCard(dimension: ReportDimension, section: MetricsDashboardSection): string {
  const name = safeStringValue(dimension.name, 'Metric');
  const code = safeStringValue(dimension.code, '');
  const score = safeScore(dimension.score, 0);
  const band = safeScoreBand(score);

  const benchmarkPercentile = dimension.benchmark?.peerPercentile;
  const showBenchmark = section.showBenchmark && benchmarkPercentile !== undefined;

  return `
    <div style="
      background: #f9fafb;
      border-radius: 10px;
      padding: 1.25rem;
      text-align: center;
    ">
      <div style="
        font-size: 0.75rem;
        color: #6b7280;
        margin-bottom: 0.25rem;
      ">${code}</div>
      <div style="
        font-family: 'Montserrat', sans-serif;
        font-size: 0.875rem;
        font-weight: 600;
        color: #212653;
        margin-bottom: 0.75rem;
      ">${safeHtml(name)}</div>
      <div style="
        font-size: 2.5rem;
        font-weight: 700;
        color: ${safeScoreBandColor(score)};
        line-height: 1;
      ">${score}</div>
      <div style="
        display: inline-block;
        padding: 0.25rem 0.75rem;
        background: ${safeScoreBandColor(score)};
        color: white;
        border-radius: 1rem;
        font-size: 0.75rem;
        font-weight: 600;
        margin-top: 0.5rem;
      ">${band}</div>
      ${showBenchmark ? `
        <div style="
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid #e5e7eb;
          font-size: 0.75rem;
          color: #6b7280;
        ">
          Industry: ${benchmarkPercentile}th percentile
        </div>
      ` : ''}
    </div>
  `;
}

// ============================================================================
// MANAGER CLOSING SECTION
// ============================================================================

/**
 * Render Manager Closing section
 */
export function renderManagerClosingSection(
  ctx: ReportContext,
  section: ManagerClosingSection,
  _recipe: ManagerReportRecipe
): string {
  const companyName = safeStringValue(ctx.companyProfile?.name, 'your organization');
  const content = getClosingContent(section.managerType, companyName);

  return `
    <section id="${section.id}" class="report-section closing-section" style="padding: 2rem; margin-bottom: 2rem;">
      <h2 style="
        font-family: 'Montserrat', sans-serif;
        font-size: 1.5rem;
        font-weight: 700;
        color: #212653;
        margin: 0 0 1.5rem 0;
        padding-bottom: 0.5rem;
        border-bottom: 3px solid #969423;
      ">${safeHtml(section.title)}</h2>

      <!-- Acknowledgement -->
      <div style="margin-bottom: 1.5rem;">
        <h3 style="
          font-family: 'Montserrat', sans-serif;
          font-size: 1.125rem;
          font-weight: 600;
          color: #212653;
          margin: 0 0 0.75rem 0;
        ">Your Role in ${safeHtml(companyName)}'s Success</h3>
        <p style="color: #374151; line-height: 1.6; margin: 0;">${content.acknowledgement}</p>
      </div>

      <!-- Next Steps -->
      ${section.showNextSteps !== false ? `
        <div style="margin-bottom: 1.5rem;">
          <h3 style="
            font-family: 'Montserrat', sans-serif;
            font-size: 1.125rem;
            font-weight: 600;
            color: #212653;
            margin: 0 0 0.75rem 0;
          ">Recommended Next 30-90 Days</h3>
          <ol style="
            padding-left: 1.25rem;
            color: #374151;
            line-height: 1.7;
            margin: 0;
          ">
            ${content.nextSteps.map(step => `<li style="margin-bottom: 0.5rem;">${step}</li>`).join('')}
          </ol>
        </div>
      ` : ''}

      <!-- Resources -->
      ${section.showResources !== false ? `
        <div style="margin-bottom: 1.5rem;">
          <h3 style="
            font-family: 'Montserrat', sans-serif;
            font-size: 1.125rem;
            font-weight: 600;
            color: #212653;
            margin: 0 0 0.75rem 0;
          ">Additional Resources</h3>
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="padding: 0.5rem 0; border-bottom: 1px solid #f3f4f6;">
              <a href="comprehensive.html" style="color: #2563eb; text-decoration: none; font-weight: 600;">Comprehensive Assessment Report</a>
              <span style="color: #6b7280;"> — Full company analysis</span>
            </li>
            <li style="padding: 0.5rem 0; border-bottom: 1px solid #f3f4f6;">
              <a href="owner.html" style="color: #2563eb; text-decoration: none; font-weight: 600;">Owner's Report</a>
              <span style="color: #6b7280;"> — Executive strategic overview</span>
            </li>
            <li style="padding: 0.5rem 0; border-bottom: 1px solid #f3f4f6;">
              <a href="roadmap.html" style="color: #2563eb; text-decoration: none; font-weight: 600;">Implementation Roadmap</a>
              <span style="color: #6b7280;"> — Company-wide initiative timeline</span>
            </li>
            <li style="padding: 0.5rem 0;">
              <a href="risk.html" style="color: #2563eb; text-decoration: none; font-weight: 600;">Risk Assessment</a>
              <span style="color: #6b7280;"> — Complete risk analysis</span>
            </li>
          </ul>
        </div>
      ` : ''}

      <!-- Empowerment Message -->
      <div style="
        padding: 1.5rem;
        background: #f9fafb;
        border-left: 4px solid #969423;
        border-radius: 0 8px 8px 0;
      ">
        <p style="
          font-size: 1.0625rem;
          font-style: italic;
          color: #212653;
          margin: 0;
          line-height: 1.6;
        ">"${content.empowerment}"</p>
      </div>
    </section>
  `;
}

interface ClosingContent {
  acknowledgement: string;
  nextSteps: string[];
  empowerment: string;
}

function getClosingContent(managerType: string, companyName: string): ClosingContent {
  const contentMap: Record<string, ClosingContent> = {
    operations: {
      acknowledgement: `As Operations leader, you are the backbone of ${companyName}'s ability to deliver on promises to customers. Your focus on efficiency, quality, and continuous improvement directly impacts every aspect of business performance.`,
      nextSteps: [
        'Review the quick wins identified in this report and select 2-3 for immediate implementation',
        'Schedule a team meeting to discuss the key findings and gather frontline input',
        'Establish baseline metrics for the top improvement areas identified',
        'Coordinate with other department heads on cross-functional dependencies',
        'Set up a 30-day check-in to assess progress on priority initiatives'
      ],
      empowerment: 'Your operational excellence creates the foundation for sustainable growth. The improvements you drive will ripple across the entire organization.'
    },
    salesMarketing: {
      acknowledgement: `As the driver of ${companyName}'s revenue engine, your strategic decisions about market positioning, customer acquisition, and sales effectiveness directly shape the company's growth trajectory.`,
      nextSteps: [
        'Analyze the Growth Engine dimension scores and identify the largest gaps',
        'Review customer experience metrics and develop targeted improvement plans',
        'Align sales and marketing initiatives for maximum impact',
        'Implement quick wins that can accelerate pipeline velocity',
        'Schedule strategy sessions with leadership to align on growth priorities'
      ],
      empowerment: 'Your ability to connect the company with customers and drive revenue is essential to achieving strategic goals. Lead with confidence and focus on high-impact opportunities.'
    },
    financials: {
      acknowledgement: `As the steward of ${companyName}'s financial health, your analysis and guidance ensures the company has the resources to execute its strategy and weather challenges.`,
      nextSteps: [
        'Review financial health metrics against industry benchmarks',
        'Identify opportunities to improve cash flow and working capital',
        'Assess risk exposure and ensure appropriate mitigation strategies',
        'Align budget allocations with strategic priorities identified in this assessment',
        'Develop financial models for key improvement initiatives'
      ],
      empowerment: 'Your financial acumen and discipline provides the stability and insight needed for confident decision-making. Your guidance turns strategy into sustainable results.'
    },
    strategy: {
      acknowledgement: `As the architect of ${companyName}'s strategic direction, your vision and leadership alignment ensures all efforts across the organization drive toward shared goals.`,
      nextSteps: [
        'Review strategy and leadership scores in context of competitive position',
        'Facilitate leadership alignment on top 3-5 strategic priorities',
        'Develop communication plan to cascade strategic focus across organization',
        'Establish governance mechanisms to track progress on key initiatives',
        'Schedule quarterly strategy reviews to adapt to changing conditions'
      ],
      empowerment: 'Your strategic clarity creates the north star that guides every team member. Lead with vision, communicate with purpose, and adapt with agility.'
    },
    itTechnology: {
      acknowledgement: `As the enabler of ${companyName}'s digital capabilities, your technology decisions create the infrastructure for efficiency, innovation, and competitive advantage.`,
      nextSteps: [
        'Assess technology and data security scores against evolving threats',
        'Prioritize technology modernization initiatives by business impact',
        'Review data management practices and identify improvement opportunities',
        'Develop technology roadmap aligned with business strategy',
        'Ensure adequate resources for security and compliance requirements'
      ],
      empowerment: 'Your technology leadership transforms how the business operates and competes. Build the digital foundation that enables everyone to do their best work.'
    }
  };

  return contentMap[managerType] || contentMap.operations;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Render empty section placeholder
 */
function renderEmptySection(section: { id: string; title: string }, message: string): string {
  return `
    <section id="${section.id}" class="report-section" style="padding: 2rem; margin-bottom: 2rem;">
      <h2 style="
        font-family: 'Montserrat', sans-serif;
        font-size: 1.5rem;
        font-weight: 700;
        color: #212653;
        margin: 0 0 1.5rem 0;
        padding-bottom: 0.5rem;
        border-bottom: 3px solid #969423;
      ">${safeHtml(section.title)}</h2>

      <div style="
        padding: 2rem;
        background: #f9fafb;
        border: 1px dashed #d1d5db;
        border-radius: 8px;
        text-align: center;
        color: #6b7280;
      ">
        <p style="margin: 0;">${message}</p>
      </div>
    </section>
  `;
}
