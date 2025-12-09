/**
 * Executive Brief Builder - "Executive Health Snapshot"
 *
 * Premium 2-3 page executive overview designed as board packet cover page.
 * Ultra-scannable, data-backed C-suite overview with:
 * - Page 1: Executive Health Snapshot (30-second absorption)
 * - Page 2: Action Focus & Navigation
 * - Page 3: Methods & Legal Appendix
 *
 * Target: Under 5 minutes to absorb for C-suite executives, board members, and PE/M&A teams.
 *
 * @version 2.0.0 - Complete transformation from sparse brief to premium snapshot
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import type {
  ReportContext,
  ReportRenderOptions,
  GeneratedReport,
  ReportMeta,
  ReportChapter,
  ReportRecommendation,
  ReportQuickWin,
  ReportRisk,
  ReportFinding,
} from '../../types/report.types.js';
import {
  wrapHtmlDocument,
  generateReportFooter,
  escapeHtml,
} from './html-template.js';

// Import chart integration for visual charts
import {
  getReportChartStyles,
  render4ChapterRadar,
} from './charts/index.js';

// Import legal terms component
import { buildLegalTermsPage } from './components/index.js';

// Import world-class integration utilities and shared utilities
import {
  contextToChapterRadarData,
  // Shared IDM extraction utilities
  extractNumericValue,
  formatBenchmark,
  getScoreBandFromScore,
  getScoreBandColor,
  // Shared formatting utilities
  formatK,
  formatOrdinal,
  formatDate,
  formatInvestmentRange,
  formatReturnEstimate,
  mapDimensionToOwner,
} from './utils/index.js';
import { logger } from '../../utils/logger.js';

// ============================================================================
// LOCAL UTILITY WRAPPERS (for backward compatibility)
// ============================================================================

/**
 * Get score band from numeric score (wrapper for shared utility)
 */
function getScoreBand(score: number): string {
  return getScoreBandFromScore(score);
}

/**
 * Get band color for styling (wrapper for shared utility)
 */
function getBandColor(band: string): string {
  return getScoreBandColor(band);
}

// ============================================================================
// PHASE 2: PAGE 1 - EXECUTIVE HEALTH SNAPSHOT
// ============================================================================

/**
 * Generate the main executive snapshot page (Page 1)
 * Designed for 30-second absorption - single printed page
 */
function generateExecutiveSnapshot(ctx: ReportContext, options: ReportRenderOptions): string {
  const { companyProfile, overallHealth, chapters } = ctx;
  const overallScore = extractNumericValue(overallHealth.score, 0);
  const overallBand = overallHealth.band || getScoreBand(overallScore);
  const percentile = overallHealth.benchmarks?.percentile;

  return `
    <section class="executive-snapshot" style="page-break-after: always; min-height: 100vh;">

      <!-- HEADER BAR -->
      <div class="snapshot-header" style="
        background: linear-gradient(135deg, #212653 0%, #1a1f42 100%);
        color: white;
        padding: 20px 24px;
        border-radius: 12px 12px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      ">
        <div>
          <h1 style="font-family: 'Montserrat', sans-serif; margin: 0; font-size: 22px; font-weight: 700;">
            Executive Health Snapshot
          </h1>
          <p style="margin: 4px 0 0 0; opacity: 0.85; font-size: 14px;">
            ${escapeHtml(companyProfile.name)} | ${escapeHtml(companyProfile.industry || 'Business Assessment')}
          </p>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 11px; opacity: 0.7; text-transform: uppercase; letter-spacing: 0.5px;">
            Assessment Date
          </div>
          <div style="font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 14px;">
            ${formatDate(ctx.metadata.generatedAt)}
          </div>
        </div>
      </div>

      <!-- MAIN CONTENT AREA -->
      <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 12px 12px;">

        <!-- ROW 1: Health Score + Trajectory + Investment Summary -->
        <div style="display: grid; grid-template-columns: 200px 1fr 260px; gap: 16px; margin-bottom: 16px;">

          <!-- Overall Health Gauge -->
          ${generateHealthGaugeCompact(overallScore, overallBand, percentile)}

          <!-- Trajectory + Pillar Summary -->
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${generateTrajectoryIndicator(ctx)}
            ${generatePillarStrip(chapters)}
          </div>

          <!-- Investment & ROI Summary -->
          ${generateInvestmentSummaryCompact(ctx)}
        </div>

        <!-- ROW 2: Four Pillar Tiles -->
        <div style="margin-bottom: 16px;">
          ${generatePillarTiles(chapters)}
        </div>

        <!-- ROW 3: Executive Headlines -->
        ${generateExecutiveHeadlines(ctx)}

        <!-- Important Limitations (minimal) -->
        <div style="
          margin-top: 16px;
          padding: 8px 12px;
          background: #fff;
          border-left: 3px solid #969423;
          font-size: 10px;
          color: #666;
          border-radius: 0 4px 4px 0;
        ">
          <strong>Important:</strong> This assessment is based on self-reported data and AI-powered analysis.
          Use findings with professional judgment. See Legal Terms in appendix for full disclaimers.
        </div>
      </div>
    </section>
  `;
}

/**
 * Generate compact health gauge (SVG-based)
 */
function generateHealthGaugeCompact(score: number, band: string, percentile?: number): string {
  const bandColor = getBandColor(band);

  // Calculate arc for the gauge (semicircle from 180 to 0 degrees)
  const scorePercent = Math.min(100, Math.max(0, score));
  const dashArray = scorePercent * 1.57; // ~157 is half circumference

  return `
    <div style="
      background: linear-gradient(135deg, #212653 0%, #1a1f42 100%);
      border-radius: 12px;
      padding: 16px;
      text-align: center;
      color: white;
    ">
      <!-- SVG Gauge -->
      <svg width="120" height="80" viewBox="0 0 120 80" style="margin-bottom: 8px;" role="img" aria-label="Health Score: ${score} out of 100, ${band}">
        <!-- Background arc -->
        <path d="M 10 70 A 50 50 0 0 1 110 70" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="10" stroke-linecap="round"/>
        <!-- Score arc -->
        <path d="M 10 70 A 50 50 0 0 1 110 70" fill="none" stroke="${bandColor}" stroke-width="10" stroke-linecap="round"
              stroke-dasharray="${dashArray} 157" style="transition: stroke-dasharray 0.5s;"/>
        <!-- Score text -->
        <text x="60" y="55" text-anchor="middle" font-family="Montserrat, sans-serif" font-size="28" font-weight="700" fill="white">
          ${score}
        </text>
        <text x="60" y="72" text-anchor="middle" font-family="Open Sans, sans-serif" font-size="10" fill="rgba(255,255,255,0.7)">
          / 100
        </text>
      </svg>

      <div style="
        background: ${bandColor};
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        display: inline-block;
      ">
        ${escapeHtml(band)}
      </div>

      ${percentile ? `
        <div style="margin-top: 6px; font-size: 10px; opacity: 0.8;">
          ${formatOrdinal(percentile)} percentile
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Generate trajectory indicator showing business momentum
 */
function generateTrajectoryIndicator(ctx: ReportContext): string {
  const { overallHealth, chapters } = ctx;

  // Derive trajectory from overall or chapter trends
  let trajectory = overallHealth.trajectory || 'Flat';
  let trajectoryIcon = '&#8594;'; // →
  let trajectoryColor = '#6c757d';
  let trajectoryText = 'Business trajectory is flat—no significant momentum in either direction.';

  if (trajectory === 'Improving') {
    trajectoryIcon = '&#8593;'; // ↑
    trajectoryColor = '#28a745';
    trajectoryText = 'Positive momentum detected across multiple business areas.';
  } else if (trajectory === 'Declining') {
    trajectoryIcon = '&#8595;'; // ↓
    trajectoryColor = '#dc3545';
    trajectoryText = 'Declining indicators suggest urgent attention needed.';
  }

  return `
    <div style="
      background: white;
      border-radius: 8px;
      padding: 12px;
      border-left: 4px solid ${trajectoryColor};
    ">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
        <span style="font-size: 20px; color: ${trajectoryColor};">${trajectoryIcon}</span>
        <span style="font-family: 'Montserrat', sans-serif; font-weight: 600; color: #212653; font-size: 13px;">
          Trajectory: ${escapeHtml(trajectory)}
        </span>
      </div>
      <p style="margin: 0; font-size: 11px; color: #666; line-height: 1.4;">
        ${escapeHtml(trajectoryText)}
      </p>
    </div>
  `;
}

/**
 * Generate horizontal pillar strip showing 4 pillars
 */
function generatePillarStrip(chapters: ReportChapter[]): string {
  const pillars = [
    { code: 'GE', name: 'Growth', color: '#28a745' },
    { code: 'PH', name: 'Performance', color: '#0d6efd' },
    { code: 'PL', name: 'People', color: '#ffc107' },
    { code: 'RS', name: 'Resilience', color: '#dc3545' },
  ];

  return `
    <div style="
      display: flex;
      gap: 8px;
      background: white;
      border-radius: 8px;
      padding: 10px;
    ">
      ${pillars.map(p => {
        const chapter = chapters.find(ch => ch.code === p.code);
        const score = chapter ? extractNumericValue(chapter.score, 0) : 0;
        return `
          <div style="flex: 1; text-align: center;">
            <div style="
              width: 100%;
              height: 6px;
              background: #e9ecef;
              border-radius: 3px;
              overflow: hidden;
              margin-bottom: 4px;
            ">
              <div style="
                width: ${score}%;
                height: 100%;
                background: ${p.color};
                border-radius: 3px;
              "></div>
            </div>
            <div style="font-size: 10px; color: #666;">${p.name}</div>
            <div style="font-family: 'Montserrat', sans-serif; font-weight: 700; color: #212653; font-size: 14px;">
              ${score}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

/**
 * Generate compact investment summary box
 */
function generateInvestmentSummaryCompact(ctx: ReportContext): string {
  const financials = aggregateFinancialImpact(ctx);

  return `
    <div style="
      background: white;
      border: 2px solid #969423;
      border-radius: 12px;
      padding: 14px;
    ">
      <h4 style="font-family: 'Montserrat', sans-serif; color: #212653; margin: 0 0 10px 0; font-size: 12px;">
        &#128176; Investment &amp; Return
      </h4>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
        <div style="text-align: center; padding: 8px; background: #fef8f8; border-radius: 6px;">
          <div style="font-size: 9px; color: #dc3545; text-transform: uppercase; font-weight: 600;">Investment</div>
          <div style="font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 700; color: #dc3545;">
            ${escapeHtml(financials.investmentRange)}
          </div>
        </div>
        <div style="text-align: center; padding: 8px; background: #f0fff4; border-radius: 6px;">
          <div style="font-size: 9px; color: #28a745; text-transform: uppercase; font-weight: 600;">Return</div>
          <div style="font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 700; color: #28a745;">
            ${escapeHtml(financials.returnRange)}
          </div>
        </div>
      </div>

      <div style="
        background: #212653;
        color: white;
        padding: 6px 10px;
        border-radius: 6px;
        text-align: center;
        font-size: 11px;
      ">
        <strong>ROI:</strong> ${escapeHtml(financials.roiRange)}
      </div>
    </div>
  `;
}

/**
 * Aggregate financial impact from recommendations
 */
function aggregateFinancialImpact(ctx: ReportContext): {
  investmentRange: string;
  returnRange: string;
  roiRange: string;
} {
  const { recommendations, financialProjections, quickWins } = ctx;

  // Try to get from financial projections first
  if (financialProjections) {
    const investMin = financialProjections.totalInvestmentRequired
      ? Math.floor(financialProjections.totalInvestmentRequired * 0.8)
      : 25000;
    const investMax = financialProjections.totalInvestmentRequired
      ? Math.ceil(financialProjections.totalInvestmentRequired * 1.2)
      : 75000;
    const returnMin = financialProjections.annualValue
      ? Math.floor(financialProjections.annualValue * 0.8)
      : 75000;
    const returnMax = financialProjections.annualValue
      ? Math.ceil(financialProjections.annualValue * 1.2)
      : 250000;

    const roiMin = Math.round((returnMin / investMax) * 100);
    const roiMax = Math.round((returnMax / investMin) * 100);

    return {
      investmentRange: `$${formatK(investMin)}-${formatK(investMax)}`,
      returnRange: `$${formatK(returnMin)}-${formatK(returnMax)}`,
      roiRange: `${roiMin}-${roiMax}%`,
    };
  }

  // Estimate from recommendations count
  const recCount = recommendations.length + quickWins.length;
  const baseInvest = recCount * 8000;
  const baseReturn = recCount * 25000;

  return {
    investmentRange: `$${formatK(Math.floor(baseInvest * 0.8))}-${formatK(Math.ceil(baseInvest * 1.2))}`,
    returnRange: `$${formatK(Math.floor(baseReturn * 0.8))}-${formatK(Math.ceil(baseReturn * 1.2))}`,
    roiRange: `150-300%`,
  };
}

/**
 * Generate the four pillar tiles
 */
function generatePillarTiles(chapters: ReportChapter[]): string {
  const pillarMeta: Record<string, { name: string; icon: string; color: string }> = {
    'GE': { name: 'Growth Engine', icon: '&#128640;', color: '#28a745' },
    'PH': { name: 'Performance &amp; Health', icon: '&#128200;', color: '#0d6efd' },
    'PL': { name: 'People &amp; Leadership', icon: '&#128101;', color: '#ffc107' },
    'RS': { name: 'Resilience &amp; Safeguards', icon: '&#128737;', color: '#dc3545' },
  };

  // Ensure we show all 4 pillars even if some chapters are missing
  const pillarOrder = ['GE', 'PH', 'PL', 'RS'];

  return `
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;">
      ${pillarOrder.map(code => {
        const chapter = chapters.find(ch => ch.code === code);
        const meta = pillarMeta[code] || { name: code, icon: '&#128200;', color: '#212653' };
        const score = chapter ? extractNumericValue(chapter.score, 0) : 0;
        const band = chapter?.band || getScoreBand(score);

        // Determine trend from chapter data or default to stable
        const chapterAny = chapter as Record<string, unknown> | undefined;
        const trend = chapterAny?.trend as string || 'stable';
        const trendIcon = trend === 'improving' || trend === 'Improving' ? '&#8593;' :
                         trend === 'declining' || trend === 'Declining' ? '&#8595;' : '&#8594;';
        const trendColor = trend === 'improving' || trend === 'Improving' ? '#28a745' :
                          trend === 'declining' || trend === 'Declining' ? '#dc3545' : '#6c757d';
        const trendLabel = trend.charAt(0).toUpperCase() + trend.slice(1).toLowerCase();

        return `
          <div style="
            background: white;
            border: 1px solid #e9ecef;
            border-top: 4px solid ${meta.color};
            border-radius: 8px;
            padding: 14px;
            text-align: center;
          ">
            <div style="font-size: 20px; margin-bottom: 6px;">${meta.icon}</div>
            <div style="font-size: 11px; color: #666; margin-bottom: 4px;">${meta.name}</div>
            <div style="font-family: 'Montserrat', sans-serif; font-size: 28px; font-weight: 700; color: #212653;">
              ${score}
            </div>
            <div style="
              display: inline-block;
              padding: 2px 8px;
              border-radius: 4px;
              font-size: 9px;
              font-weight: 600;
              text-transform: uppercase;
              background: ${meta.color}20;
              color: ${meta.color};
              margin: 4px 0;
            ">
              ${escapeHtml(band)}
            </div>
            <div style="color: ${trendColor}; font-size: 11px; font-weight: 500;">
              ${trendIcon} ${trendLabel}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

/**
 * Generate executive headlines section
 */
function generateExecutiveHeadlines(ctx: ReportContext): string {
  const headlines = extractExecutiveHeadlines(ctx);

  if (headlines.length === 0) {
    return '';
  }

  return `
    <div style="
      background: white;
      border-radius: 8px;
      padding: 14px;
    ">
      <h4 style="font-family: 'Montserrat', sans-serif; color: #212653; margin: 0 0 12px 0; font-size: 13px;">
        &#128203; Executive Headlines
      </h4>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px;">
        ${headlines.map(h => `
          <div style="
            padding: 10px 12px;
            background: ${h.bgColor};
            border-left: 3px solid ${h.color};
            border-radius: 0 6px 6px 0;
          ">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
              <span style="font-size: 14px;">${h.icon}</span>
              <span style="font-weight: 600; color: #212653; font-size: 11px;">${escapeHtml(h.category)}</span>
            </div>
            <p style="margin: 0; font-size: 11px; color: #555; line-height: 1.4;">
              ${escapeHtml(h.text)}
            </p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

interface ExecutiveHeadline {
  category: string;
  text: string;
  icon: string;
  color: string;
  bgColor: string;
}

/**
 * Extract executive headlines from context
 */
function extractExecutiveHeadlines(ctx: ReportContext): ExecutiveHeadline[] {
  const { findings, recommendations, quickWins, risks, dimensions } = ctx;
  const headlines: ExecutiveHeadline[] = [];

  // 1. Key Vulnerability (from critical risk or lowest dimension)
  const criticalRisks = risks.filter(r => {
    const severity = typeof r.severity === 'number' ? r.severity : parseInt(String(r.severity)) || 0;
    return severity >= 7;
  });

  if (criticalRisks.length > 0) {
    const topRisk = criticalRisks[0];
    headlines.push({
      category: 'Key Vulnerability',
      text: `${topRisk.category || topRisk.dimensionName}: ${topRisk.narrative?.substring(0, 80) || 'Requires immediate executive attention.'}${topRisk.narrative && topRisk.narrative.length > 80 ? '...' : ''}`,
      icon: '&#9888;&#65039;',
      color: '#dc3545',
      bgColor: '#fef8f8',
    });
  } else if (dimensions.length > 0) {
    // Fallback to lowest scoring dimension
    const sortedDims = [...dimensions].sort((a, b) => extractNumericValue(a.score, 100) - extractNumericValue(b.score, 100));
    const lowest = sortedDims[0];
    if (lowest && extractNumericValue(lowest.score, 100) < 60) {
      headlines.push({
        category: 'Critical Gap',
        text: `${lowest.name} at ${extractNumericValue(lowest.score, 0)}/100 represents the most significant improvement opportunity.`,
        icon: '&#127919;',
        color: '#dc3545',
        bgColor: '#fef8f8',
      });
    }
  }

  // 2. Value Creation Opportunity (from high-impact recommendation)
  const highImpactRecs = recommendations.filter(r => r.impactScore >= 70).slice(0, 1);
  if (highImpactRecs.length > 0) {
    const rec = highImpactRecs[0];
    headlines.push({
      category: 'Value Opportunity',
      text: `${rec.theme} could generate ${formatReturnEstimate(rec)} with ${formatInvestmentRange(rec)} investment.`,
      icon: '&#128176;',
      color: '#28a745',
      bgColor: '#f0fff4',
    });
  } else if (recommendations.length > 0) {
    const rec = recommendations[0];
    headlines.push({
      category: 'Value Opportunity',
      text: `${rec.theme}: High-impact initiative for sustainable growth.`,
      icon: '&#128176;',
      color: '#28a745',
      bgColor: '#f0fff4',
    });
  }

  // 3. 90-Day Imperative (from quick wins)
  if (quickWins.length > 0) {
    const qw = quickWins[0];
    headlines.push({
      category: '90-Day Priority',
      text: `${qw.theme}: ${qw.impactScore >= 70 ? 'High' : 'Medium'} impact, ${qw.effortScore <= 40 ? 'Low' : 'Medium'} effort.`,
      icon: '&#9889;',
      color: '#969423',
      bgColor: '#fefef0',
    });
  }

  // 4. Core Strength (from strengths findings)
  const strengths = findings.filter(f => f.type === 'strength').slice(0, 1);
  if (strengths.length > 0 && headlines.length < 4) {
    headlines.push({
      category: 'Core Strength',
      text: strengths[0].shortLabel || strengths[0].narrative?.substring(0, 80) || 'Key competitive advantage identified.',
      icon: '&#127942;',
      color: '#0d6efd',
      bgColor: '#f0f7ff',
    });
  }

  return headlines.slice(0, 4);
}

// ============================================================================
// PHASE 3: PAGE 2 - ACTION FOCUS & NAVIGATION
// ============================================================================

/**
 * Generate the action focus page (Page 2)
 * Risk summary, quick wins, roadmap snapshot, and navigation
 */
function generateExecutiveActionFocus(ctx: ReportContext): string {
  return `
    <section class="executive-action-focus" style="page-break-after: always;">
      <h2 style="
        font-family: 'Montserrat', sans-serif;
        color: #212653;
        border-bottom: 2px solid #969423;
        padding-bottom: 8px;
        margin: 0 0 16px 0;
        font-size: 18px;
      ">
        Action Focus
      </h2>

      <!-- ROW 1: Risk & Quick Wins -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
        ${generateRiskSummary(ctx)}
        ${generateQuickWinsStrip(ctx)}
      </div>

      <!-- ROW 2: Roadmap Snapshot -->
      ${generateRoadmapSnapshot(ctx)}

      <!-- ROW 3: Key Decisions Required -->
      ${generateKeyDecisionsBox(ctx)}

      <!-- ROW 4: What to Read Next -->
      ${generateNavigationBox()}
    </section>
  `;
}

/**
 * Generate risk summary box
 */
function generateRiskSummary(ctx: ReportContext): string {
  const { risks } = ctx;

  const criticalCount = risks.filter(r => {
    const sev = typeof r.severity === 'number' ? r.severity : parseInt(String(r.severity)) || 0;
    return sev >= 8;
  }).length;

  const highCount = risks.filter(r => {
    const sev = typeof r.severity === 'number' ? r.severity : parseInt(String(r.severity)) || 0;
    return sev >= 6 && sev < 8;
  }).length;

  // Determine overall risk posture
  let riskPosture = 'Low';
  let postureColor = '#28a745';
  let posturePosition = '10%';

  if (criticalCount > 0) {
    riskPosture = 'Critical';
    postureColor = '#dc3545';
    posturePosition = '90%';
  } else if (highCount > 2) {
    riskPosture = 'Elevated';
    postureColor = '#fd7e14';
    posturePosition = '70%';
  } else if (highCount > 0) {
    riskPosture = 'Moderate';
    postureColor = '#ffc107';
    posturePosition = '40%';
  }

  const topRisks = risks.filter(r => {
    const sev = typeof r.severity === 'number' ? r.severity : parseInt(String(r.severity)) || 0;
    return sev >= 6;
  }).slice(0, 3);

  return `
    <div style="
      background: #fef8f8;
      border: 1px solid #f5c6cb;
      border-radius: 10px;
      padding: 14px;
    ">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h4 style="font-family: 'Montserrat', sans-serif; color: #dc3545; margin: 0; font-size: 13px;">
          &#9888;&#65039; Risk &amp; Resilience
        </h4>
        <div style="
          background: ${postureColor};
          color: white;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
        ">
          ${riskPosture} Risk
        </div>
      </div>

      <!-- Risk Bar -->
      <div style="
        height: 8px;
        background: linear-gradient(to right, #28a745 0%, #ffc107 50%, #dc3545 100%);
        border-radius: 4px;
        margin-bottom: 12px;
        position: relative;
      ">
        <div style="
          position: absolute;
          left: ${posturePosition};
          top: -4px;
          width: 16px;
          height: 16px;
          background: white;
          border: 3px solid ${postureColor};
          border-radius: 50%;
          transform: translateX(-50%);
        "></div>
      </div>

      <!-- Top Risks -->
      <div style="font-size: 11px;">
        ${topRisks.length > 0 ? topRisks.map((risk, i) => {
          const sev = typeof risk.severity === 'number' ? risk.severity : parseInt(String(risk.severity)) || 0;
          const riskColor = sev >= 8 ? '#dc3545' : '#fd7e14';
          return `
            <div style="
              display: flex;
              align-items: flex-start;
              gap: 8px;
              padding: 6px 0;
              ${i < topRisks.length - 1 ? 'border-bottom: 1px solid #f5c6cb;' : ''}
            ">
              <span style="
                width: 16px;
                height: 16px;
                background: ${riskColor};
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 9px;
                font-weight: 700;
                flex-shrink: 0;
              ">${i + 1}</span>
              <div>
                <strong style="color: #212653;">${escapeHtml(risk.category || risk.dimensionName)}</strong>
                <div style="color: #666; font-size: 10px;">${escapeHtml(risk.narrative?.substring(0, 60) || 'Significant exposure')}${risk.narrative && risk.narrative.length > 60 ? '...' : ''}</div>
              </div>
            </div>
          `;
        }).join('') : '<p style="color: #666;">No critical risks identified.</p>'}
      </div>
    </div>
  `;
}

/**
 * Generate quick wins strip
 */
function generateQuickWinsStrip(ctx: ReportContext): string {
  const { quickWins, recommendations } = ctx;

  // Get quick wins or high-impact/low-effort recommendations
  let displayWins = quickWins.slice(0, 4);

  if (displayWins.length === 0) {
    displayWins = recommendations
      .filter(r => r.isQuickWin || (r.impactScore >= 60 && r.effortScore <= 50))
      .slice(0, 4) as unknown as ReportQuickWin[];
  }

  return `
    <div style="
      background: #f0fff4;
      border: 1px solid #c3e6cb;
      border-radius: 10px;
      padding: 14px;
    ">
      <h4 style="font-family: 'Montserrat', sans-serif; color: #28a745; margin: 0 0 12px 0; font-size: 13px;">
        &#9889; 90-Day Quick Wins
      </h4>

      <div style="display: grid; gap: 8px;">
        ${displayWins.length > 0 ? displayWins.map((qw, i) => {
          const qwAny = qw as unknown as Record<string, unknown>;
          const dimensionCode = qwAny.dimensionCode as string || '';
          return `
            <div style="
              display: flex;
              align-items: center;
              gap: 10px;
              padding: 8px;
              background: white;
              border-radius: 6px;
            ">
              <div style="
                width: 24px;
                height: 24px;
                background: #28a745;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 11px;
                font-weight: 700;
                flex-shrink: 0;
              ">${i + 1}</div>
              <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 600; color: #212653; font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  ${escapeHtml(qw.theme)}
                </div>
                <div style="font-size: 10px; color: #666;">
                  ${escapeHtml(mapDimensionToOwner(dimensionCode))}
                </div>
              </div>
              <div style="
                padding: 2px 6px;
                background: #d4edda;
                border-radius: 4px;
                font-size: 9px;
                font-weight: 600;
                color: #28a745;
              ">
                ${qw.impactScore >= 70 ? 'HIGH' : 'MED'}
              </div>
            </div>
          `;
        }).join('') : `
          <p style="color: #666; font-size: 11px;">See Quick Wins report for detailed action plans.</p>
        `}
      </div>
    </div>
  `;
}

/**
 * Generate roadmap snapshot
 */
function generateRoadmapSnapshot(ctx: ReportContext): string {
  const { roadmap, recommendations } = ctx;

  // Define phases
  const phases = [
    { label: 'Now', range: '0-30 Days', color: '#dc3545', items: [] as string[] },
    { label: '90 Days', range: '30-90 Days', color: '#ffc107', items: [] as string[] },
    { label: '6 Months', range: '90-180 Days', color: '#0d6efd', items: [] as string[] },
    { label: '12+ Months', range: '180+ Days', color: '#28a745', items: [] as string[] },
  ];

  // Populate from roadmap or recommendations
  if (roadmap && roadmap.phases && roadmap.phases.length > 0) {
    roadmap.phases.forEach((phase, index) => {
      const phaseIndex = Math.min(index, 3);
      const milestones = phase.keyMilestones || [];
      phases[phaseIndex].items.push(...milestones.slice(0, 2));
    });
  } else {
    // Derive from recommendations
    recommendations.forEach(rec => {
      const title = rec.theme;
      if (rec.horizon === '90_days' || rec.isQuickWin) {
        if (phases[0].items.length < 2) phases[0].items.push(title);
        else if (phases[1].items.length < 2) phases[1].items.push(title);
      } else if (rec.horizon === '12_months') {
        if (phases[2].items.length < 2) phases[2].items.push(title);
      } else {
        if (phases[3].items.length < 2) phases[3].items.push(title);
      }
    });
  }

  return `
    <div style="
      background: white;
      border: 1px solid #e9ecef;
      border-radius: 10px;
      padding: 14px;
      margin-bottom: 16px;
    ">
      <h4 style="font-family: 'Montserrat', sans-serif; color: #212653; margin: 0 0 12px 0; font-size: 13px;">
        &#128197; Roadmap Snapshot
      </h4>

      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
        ${phases.map(phase => `
          <div style="text-align: center;">
            <div style="
              background: ${phase.color};
              color: white;
              padding: 6px;
              border-radius: 6px 6px 0 0;
              font-family: 'Montserrat', sans-serif;
              font-weight: 600;
              font-size: 11px;
            ">
              ${phase.label}
            </div>
            <div style="
              background: #f8f9fa;
              border: 1px solid #e9ecef;
              border-top: none;
              border-radius: 0 0 6px 6px;
              padding: 8px;
              min-height: 60px;
            ">
              <div style="font-size: 9px; color: #888; margin-bottom: 4px;">${phase.range}</div>
              ${phase.items.length > 0 ? phase.items.map(item => `
                <div style="
                  font-size: 10px;
                  color: #555;
                  padding: 2px 0;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                ">&#8226; ${escapeHtml(item.substring(0, 25))}${item.length > 25 ? '...' : ''}</div>
              `).join('') : `
                <div style="font-size: 10px; color: #999; font-style: italic;">See Roadmap Report</div>
              `}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/**
 * Generate key decisions box
 */
function generateKeyDecisionsBox(ctx: ReportContext): string {
  const { recommendations } = ctx;

  const decisions = recommendations
    .filter(r => r.impactScore >= 60)
    .slice(0, 3)
    .map(rec => ({
      statement: `Approve ${rec.theme} (${formatInvestmentRange(rec)})`,
      deadline: rec.horizon === '90_days' ? '30 days' : rec.horizon === '12_months' ? '90 days' : '180 days',
      owner: mapDimensionToOwner(rec.dimensionCode),
    }));

  // Ensure at least one decision
  if (decisions.length === 0) {
    decisions.push({
      statement: 'Establish executive steering committee for transformation',
      deadline: '14 days',
      owner: 'CEO',
    });
  }

  return `
    <div style="
      background: #212653;
      color: white;
      border-radius: 10px;
      padding: 14px;
      margin-bottom: 16px;
    ">
      <h4 style="font-family: 'Montserrat', sans-serif; margin: 0 0 10px 0; font-size: 13px;">
        &#127919; Key Decisions Required
      </h4>

      <div style="display: grid; gap: 8px;">
        ${decisions.map((d, i) => `
          <div style="
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 10px;
            background: rgba(255,255,255,0.1);
            border-radius: 6px;
          ">
            <div style="
              width: 22px;
              height: 22px;
              background: #969423;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 700;
              font-size: 11px;
              flex-shrink: 0;
            ">${i + 1}</div>
            <div style="flex: 1;">
              <div style="font-size: 11px; font-weight: 500;">${escapeHtml(d.statement)}</div>
              <div style="font-size: 10px; opacity: 0.7;">Owner: ${escapeHtml(d.owner)} &#8226; Deadline: ${escapeHtml(d.deadline)}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/**
 * Generate navigation box (What to Read Next)
 */
function generateNavigationBox(): string {
  const reports = [
    { name: 'Owner\'s Report', desc: 'Owner-level decisions', icon: '&#128100;' },
    { name: 'Comprehensive', desc: 'Full diagnostic', icon: '&#128218;' },
    { name: 'Quick Wins', desc: 'Action plans', icon: '&#9889;' },
    { name: 'Risk Report', desc: 'Risk inventory', icon: '&#9888;&#65039;' },
    { name: 'Roadmap', desc: 'Execution timeline', icon: '&#128197;' },
  ];

  return `
    <div style="
      background: linear-gradient(135deg, #f8f9fa 0%, #fff 100%);
      border: 1px solid #e9ecef;
      border-radius: 10px;
      padding: 14px;
    ">
      <h4 style="font-family: 'Montserrat', sans-serif; color: #212653; margin: 0 0 10px 0; font-size: 13px;">
        &#128214; What to Read Next
      </h4>

      <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px;">
        ${reports.map(r => `
          <div style="
            text-align: center;
            padding: 10px 6px;
            background: white;
            border: 1px solid #e9ecef;
            border-radius: 6px;
          ">
            <div style="font-size: 18px; margin-bottom: 4px;">${r.icon}</div>
            <div style="font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 600; color: #212653; margin-bottom: 2px;">
              ${r.name}
            </div>
            <div style="font-size: 9px; color: #666; line-height: 1.3;">
              ${r.desc}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ============================================================================
// PHASE 4: LEGAL RELOCATION & METHODS APPENDIX
// ============================================================================

/**
 * Generate methods and legal appendix (Page 3)
 * Condensed version - full legal available separately
 */
function generateMethodsAndLegalAppendix(ctx: ReportContext): string {
  return `
    <section class="methods-legal-appendix" style="page-break-before: always;">
      <h2 style="
        font-family: 'Montserrat', sans-serif;
        color: #212653;
        border-bottom: 2px solid #969423;
        padding-bottom: 8px;
        margin: 0 0 16px 0;
        font-size: 18px;
      ">
        Methods &amp; Legal
      </h2>

      <!-- Methods Summary -->
      <div style="
        background: #f8f9fa;
        border-radius: 8px;
        padding: 14px;
        margin-bottom: 16px;
      ">
        <h4 style="font-family: 'Montserrat', sans-serif; color: #212653; margin: 0 0 8px 0; font-size: 13px;">
          Assessment Methodology
        </h4>
        <p style="font-size: 11px; color: #555; margin: 0; line-height: 1.5;">
          This assessment analyzed <strong>87 questions</strong> across <strong>12 business dimensions</strong>
          organized into <strong>4 strategic chapters</strong>. The BizHealth.ai platform employs a
          <strong>6-phase analytical pipeline</strong> powered by advanced AI to generate
          <strong>17 specialized reports</strong>. All insights are derived from your self-reported data
          and benchmarked against industry standards.
        </p>
      </div>

      <!-- Important Limitations -->
      <div style="
        background: #fef3cd;
        border: 1px solid #ffc107;
        border-radius: 8px;
        padding: 14px;
        margin-bottom: 16px;
      ">
        <h4 style="font-family: 'Montserrat', sans-serif; color: #856404; margin: 0 0 8px 0; font-size: 13px;">
          &#9888;&#65039; Important Limitations
        </h4>
        <ul style="font-size: 11px; color: #856404; margin: 0; padding-left: 16px; line-height: 1.6;">
          <li>Assessment quality depends on accuracy of self-reported data</li>
          <li>AI-powered analysis should be used with professional judgment</li>
          <li>Results reflect a point-in-time snapshot; conditions may change</li>
          <li>This report does not constitute professional advice</li>
          <li>Outcomes are not guaranteed</li>
        </ul>
      </div>

      <!-- Legal Reference -->
      <div style="
        background: white;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        padding: 14px;
      ">
        <h4 style="font-family: 'Montserrat', sans-serif; color: #212653; margin: 0 0 8px 0; font-size: 13px;">
          &#128196; Legal Terms &amp; Disclaimers
        </h4>
        <p style="font-size: 11px; color: #555; margin: 0 0 8px 0; line-height: 1.5;">
          By using this report, you acknowledge and agree to the full Legal Terms &amp; Disclaimers,
          including limitations of liability, intellectual property provisions, and dispute resolution terms.
        </p>
        <p style="font-size: 11px; color: #666; margin: 0;">
          <strong>Full Legal Terms:</strong> Available at
          <span style="color: #969423;">www.bizhealth.ai/legal</span>
          or in the Comprehensive Report appendix.
        </p>
      </div>

      <!-- Footer -->
      <div style="
        margin-top: 20px;
        padding-top: 12px;
        border-top: 1px solid #e9ecef;
        text-align: center;
        font-size: 10px;
        color: #888;
      ">
        <p style="margin: 0;">&copy; 2025 BizHealth.ai, LLC. All Rights Reserved.</p>
        <p style="margin: 4px 0 0 0;">Assessment ID: ${escapeHtml(ctx.runId)}</p>
      </div>
    </section>
  `;
}

/**
 * Generate CSS styles for the executive brief
 */
function getExecutiveBriefStyles(): string {
  return `
    /* Base Reset */
    * { margin: 0; padding: 0; box-sizing: border-box; }

    html {
      font-size: 16px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body {
      font-family: 'Open Sans', Arial, sans-serif;
      font-size: 1rem;
      line-height: 1.5;
      color: #333;
      background: #fff;
    }

    /* Typography */
    h1, h2, h3, h4, h5, h6 {
      font-family: 'Montserrat', 'Open Sans', Arial, sans-serif;
      color: #212653;
      line-height: 1.3;
    }

    /* Print Styles */
    @media print {
      .report-container { padding: 0; }
      section { page-break-inside: avoid; }
      .executive-snapshot { page-break-after: always; }
      .executive-action-focus { page-break-after: always; }

      /* Ensure colors print */
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }

    /* Band Badge Colors */
    .band-excellence { background: #28a745; color: white; }
    .band-proficiency { background: #0d6efd; color: white; }
    .band-attention { background: #ffc107; color: #212529; }
    .band-critical { background: #dc3545; color: white; }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .executive-snapshot div[style*="grid-template-columns: 200px 1fr 260px"] {
        grid-template-columns: 1fr !important;
      }
      .executive-snapshot div[style*="grid-template-columns: repeat(4, 1fr)"] {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }
  `;
}

// ============================================================================
// MAIN BUILDER FUNCTION
// ============================================================================

/**
 * Build Executive Brief (Executive Health Snapshot)
 *
 * Premium 2-3 page board packet cover page with:
 * - Page 1: Executive Health Snapshot (30-second absorption)
 * - Page 2: Action Focus & Navigation
 * - Page 3: Methods & Legal Appendix
 */
export async function buildExecutiveBrief(
  ctx: ReportContext,
  options: ReportRenderOptions
): Promise<GeneratedReport> {
  const reportType = 'executiveBrief';
  const reportName = 'Executive Health Snapshot';

  logger.info('Building Executive Health Snapshot (premium executive brief)');

  // Generate all sections
  const page1 = generateExecutiveSnapshot(ctx, options);
  const page2 = generateExecutiveActionFocus(ctx);
  const page3 = generateMethodsAndLegalAppendix(ctx);

  // Generate world-class 4-chapter radar for visual enhancement
  let worldClassChapterRadar = '';
  try {
    const chapterRadarData = contextToChapterRadarData(ctx);
    if (chapterRadarData && chapterRadarData.chapters.length > 0) {
      worldClassChapterRadar = render4ChapterRadar(chapterRadarData, {
        width: 350,
        height: 300,
        showBenchmark: true,
        showLegend: true,
        companyName: ctx.companyProfile.name,
      });
    }
  } catch (error) {
    logger.warn({ error }, 'Failed to generate 4-chapter radar for executive brief');
  }

  // Compose final HTML with custom styles
  const html = wrapHtmlDocument(`
    <style>
      ${getExecutiveBriefStyles()}
      ${getReportChartStyles()}
    </style>

    ${page1}
    ${page2}
    ${page3}

    ${generateReportFooter(ctx)}
  `, {
    title: `${reportName} - ${ctx.companyProfile.name}`,
    brand: options.brand,
    ctx: ctx,
  });

  // Write HTML file
  const htmlPath = path.join(options.outputDir, `${reportType}.html`);
  await fs.writeFile(htmlPath, html, 'utf-8');

  // Generate metadata
  const meta: ReportMeta = {
    reportType: 'executiveBrief',
    reportName,
    generatedAt: new Date().toISOString(),
    companyName: ctx.companyProfile.name,
    runId: ctx.runId,
    healthScore: ctx.overallHealth.score,
    healthBand: ctx.overallHealth.band,
    pageSuggestionEstimate: 3,
    sections: [
      { id: 'executive-snapshot', title: 'Executive Health Snapshot' },
      { id: 'action-focus', title: 'Action Focus' },
      { id: 'methods-legal', title: 'Methods & Legal' },
    ],
    brand: {
      primaryColor: options.brand.primaryColor,
      accentColor: options.brand.accentColor,
    },
  };

  const metaPath = path.join(options.outputDir, `${reportType}.meta.json`);
  await fs.writeFile(metaPath, JSON.stringify(meta, null, 2), 'utf-8');

  logger.info({
    reportType,
    companyName: ctx.companyProfile.name,
    healthScore: ctx.overallHealth.score,
  }, 'Executive Health Snapshot generated successfully');

  return {
    reportType: 'executiveBrief',
    reportName,
    htmlPath,
    metaPath,
    generatedAt: meta.generatedAt,
  };
}
