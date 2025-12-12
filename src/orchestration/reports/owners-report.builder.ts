/**
 * Business Owner Report Builder
 *
 * Generates an owner-focused executive summary report including:
 * - Owner-centric "you/your" narrative voice
 * - Aggregated investment ranges (not detailed tables)
 * - Cross-references to Comprehensive Report sections
 * - "Where to Go for Detail" navigation section
 * - Abbreviated content with depth constraints
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import type { ReportContext, ReportRenderOptions, GeneratedReport, ReportMeta } from '../../types/report.types.js';
import {
  wrapHtmlDocument,
  generateReportHeader,
  generateReportFooter,
  generateBaseStyles,
  escapeHtml,
  getTrajectoryIcon,
  generateProgressBar,
} from './html-template.js';
import { calculateROI } from '../../types/report.types.js';
import { NarrativeExtractionService } from '../../services/narrative-extraction.service.js';
import { logger } from '../../utils/logger.js';
import {
  extractNumericValueSafe,
  getScoreBandSafe,
  extractStringSafe,
  safeExecute,
} from '../../utils/safety.utils.js';

// Import visual enhancement components
import {
  generateKeyTakeaways,
  generateExecutiveHighlights,
  generateOverallBenchmarkCallout,
  generateEvidenceCitationsForDimension,
  generateInsightCardWithEvidence,
  generateChapterBenchmarkCallout,
  generateBenchmarkSummaryTable,
  renderWhereToGoForDetail,
  QUICK_REFS,
  buildLegalTermsPage,
  // Clickwrap Legal UX Components
  generateClickwrapModal,
  generateClickwrapLegalContent,
  generateAcceptanceBanner,
  generateLegalAccordion,
  getDefaultLegalSections,
  type ClickwrapConfig,
  // Phase 0: Premium Report Components
  generateCoverPage,
  getCoverPageStyles,
} from './components/index.js';
import { getChapterIcon } from './constants/index.js';

// Import owner report utilities
import { referenceLogger } from './utils/reference-logger.js';
import { transformToOwnerVoice, truncateToSentences } from './utils/voice-transformer.js';
import {
  OWNER_REPORT_CONSTRAINTS,
  formatCurrencyRange,
  formatCurrency as formatCurrencyConstraint,
} from './config/owner-report-constraints.js';
import { sanitizeOrphanedVisualizationHeaders, removeDuplicateCPASections } from './utils/content-sanitizer.js';

// Import enhanced markdown parser for narrative sections
import {
  parseMarkdownToHTML,
  parseMarkdownWithValidation,
  validateReportContent,
  logValidationResults,
} from './utils/index.js';
import type { ValidationResult } from './utils/markdown-parser.js';

// Import chart integration for visual charts
import {
  generateChapterOverviewRadar,
  generateAllChapterScoreBars,
  generateHealthScoreGauge,
  getReportChartStyles,
  // World-class visual components (Phase 1.5-2)
  render4ChapterRadar,
} from './charts/index.js';

// Import world-class visual components (Phase 1.5-2)
import {
  generateQuickWinsGrid,
  generateFinancialImpactDashboard,
  // Enhanced section headers with percentile rankings
  generateEnhancedSectionHeader,
  // Phase 1: Owner Decision Brief Premium Components
  generateOwnerHealthDashboard,
  getOwnerDashboardStyles,
  generateOwnerDecisionAgenda,
  getDecisionAgendaStyles,
} from './components/index.js';
import {
  contextToChapterRadarData,
  contextToFinancialImpactData,
  contextToQuickWinCards,
  // Section header integration utilities
  chapterToSectionHeader,
} from './utils/index.js';

// Import risk heatmap for enhanced risk visualization
import { renderRiskHeatmapFromRisks } from './components/visual/risk-heatmap.component.js';

// Phase 1.5 Category Visualization Components
import {
  generateCategoryRadarChart,
  generateChapterHeatmap,
  generateCategoryBenchmarkBars,
  generateInterdependencyNetwork,
  generateSWOTQuadrant,
  // P1: Impact/Effort Matrix for prioritization visualization
  generateImpactEffortMatrix,
} from './components/category-visualizations.js';

// P1: Terminology sanitization for client-facing content
import {
  sanitizeClientTerminology,
  sanitizeObjectTerminology,
} from './utils/data-sanitizer.js';

// ============================================================================
// SAFETY WRAPPERS FOR QUICK_REFS
// ============================================================================

/**
 * Safely access QUICK_REFS functions with fallback.
 * Prevents "QUICK_REFS.scorecard is not a function" errors.
 */
function safeQuickRef(
  refName: string,
  context: string,
  fallback: string = ''
): string {
  try {
    if (!QUICK_REFS || typeof QUICK_REFS !== 'object') {
      logger.warn('QUICK_REFS object not available');
      return fallback;
    }

    const ref = (QUICK_REFS as Record<string, unknown>)[refName];
    if (typeof ref === 'function') {
      const result = ref(context);
      return result ?? fallback;
    }

    logger.warn(`QUICK_REFS.${refName} is not a function`);
    return fallback;
  } catch (error) {
    logger.warn({ error, refName }, `QUICK_REFS.${refName} failed`);
    return fallback;
  }
}

/**
 * Fallback scorecard generator when QUICK_REFS fails.
 */
function generateScorecardFallback(ctx: ReportContext): string {
  const score = extractNumericValueSafe(ctx?.overallHealth?.score, 0);
  const band = getScoreBandSafe(score);
  const companyName = extractStringSafe(
    ctx?.companyProfile?.name,
    'Your Company'
  );

  return `
    <div class="scorecard scorecard-fallback" style="padding: 1rem; background: #f8f9fa; border-radius: 8px; margin: 1rem 0;">
      <h4 style="margin: 0 0 0.5rem 0;">${companyName} - Business Health Scorecard</h4>
      <div style="display: flex; align-items: center; gap: 1rem;">
        <div style="font-size: 2rem; font-weight: bold; color: #212653;">
          ${score}<span style="font-size: 1rem; color: #666;">/100</span>
        </div>
        <div style="padding: 4px 12px; border-radius: 4px; background: ${band === 'Excellence' ? '#28a745' : band === 'Proficiency' ? '#17a2b8' : band === 'Attention' ? '#ffc107' : '#dc3545'}; color: ${band === 'Attention' ? '#000' : '#fff'}; font-weight: 600;">
          ${band}
        </div>
      </div>
    </div>
  `;
}


/**
 * Build insight cards from findings for the owner report
 */
function buildOwnerInsightCards(ctx: ReportContext, maxCards: number = 6): string {
  // Get top strengths and weaknesses/gaps for balanced view
  const strengths = ctx.findings.filter(f => f.type === 'strength').slice(0, 3);
  const gaps = ctx.findings.filter(f => f.type === 'gap' || f.type === 'risk').slice(0, 3);

  const allFindings = [...strengths, ...gaps].slice(0, maxCards);

  if (allFindings.length === 0) return '';

  const cards = allFindings.map(finding => {
    const dimension = ctx.dimensions.find(d => d.code === finding.dimensionCode);
    return generateInsightCardWithEvidence(finding, dimension);
  });

  return `
    <div class="insight-cards-container">
      ${cards.join('\n')}
    </div>
  `;
}

// ============================================================================
// PHASE 1.5 CATEGORY ANALYSIS SECTIONS
// ============================================================================

/**
 * Get score band for CSS class assignment
 */
function getPhase15ScoreBand(score: number): string {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'developing';
  if (score >= 20) return 'needs-improvement';
  return 'critical';
}

/**
 * Build Category Analysis Overview section for Owner's Report
 * Displays Phase 1.5 visualizations with category-level insights
 */
function buildCategoryAnalysisOverview(
  ctx: ReportContext,
  options: ReportRenderOptions
): string {
  // Graceful fallback if Phase 1.5 data unavailable
  if (!ctx.categoryAnalyses || ctx.categoryAnalyses.length === 0) {
    logger.info('Phase 1.5 category data not available for owner report');
    return '';
  }

  const primaryColor = options.brand.primaryColor;
  const accentColor = options.brand.accentColor;

  // Generate visualizations
  const radarChart = generateCategoryRadarChart(ctx.categoryAnalyses, {
    showBenchmark: true,
    showScoreValues: true
  });

  // P0 FIX: Get canonical chapter scores to ensure consistency across all visualizations
  const canonicalChapterScores = getCanonicalChapterScores(ctx);

  const heatmap = ctx.chapterSummaries && ctx.chapterSummaries.length > 0
    ? generateChapterHeatmap(ctx.categoryAnalyses, ctx.chapterSummaries, {
        canonicalChapterScores  // Pass canonical scores for header consistency
      })
    : '';

  const benchmarkBars = generateCategoryBenchmarkBars(ctx.categoryAnalyses);

  // Generate category quick insight cards (top 6 most relevant)
  const sortedCategories = [...ctx.categoryAnalyses].sort((a, b) => {
    // Prioritize categories that need attention (lower scores first)
    const aUrgency = a.overallScore < 60 ? (60 - a.overallScore) : 0;
    const bUrgency = b.overallScore < 60 ? (60 - b.overallScore) : 0;
    return bUrgency - aUrgency;
  });

  const categoryCards = sortedCategories.slice(0, 6).map(cat => {
    const scoreBand = getPhase15ScoreBand(cat.overallScore);
    const topStrength = cat.strengths?.[0]?.title || 'N/A';
    const topGap = cat.weaknesses?.[0]?.title || 'N/A';
    const topQuickWin = cat.quickWins?.[0]?.title || 'N/A';

    return `
      <div class="category-card score-${scoreBand}">
        <div class="category-header">
          <h4>${escapeHtml(cat.categoryName)} (${escapeHtml(cat.categoryCode)})</h4>
          <div class="score-badge score-${scoreBand}">${cat.overallScore}/100</div>
        </div>
        <p class="status"><strong>Status:</strong> ${escapeHtml(cat.status)}</p>
        <p class="executive-summary">${escapeHtml((cat.executiveSummary || '').substring(0, 150))}${(cat.executiveSummary || '').length > 150 ? '...' : ''}</p>

        <div class="category-highlights">
          <div class="highlight strength">
            <strong>&#10003; Top Strength:</strong> ${escapeHtml(topStrength)}
          </div>
          <div class="highlight gap">
            <strong>&#9888; Priority Gap:</strong> ${escapeHtml(topGap)}
          </div>
          <div class="highlight quick-win">
            <strong>&#9889; Quick Win:</strong> ${escapeHtml(topQuickWin)}
          </div>
        </div>

        <p class="cross-reference">
          <em>See Comprehensive Report for detailed ${escapeHtml(cat.categoryName)} analysis.</em>
        </p>
      </div>
    `;
  }).join('');

  return `
    <section class="section page-break" id="category-analysis-overview">
      ${renderOwnerSectionHeader('Category-Level Performance Analysis', 'How is each area of my business performing?')}

      <p class="section-intro">
        This section provides a granular view of your business health across all 12 assessment
        categories, enabling you to target improvement efforts where they'll have the most impact.
      </p>

      <div class="visualization-container" style="margin: 1.5rem 0;">
        <h3 style="color: ${primaryColor}; font-family: 'Montserrat', sans-serif; margin-bottom: 1rem;">12-Category Health Radar</h3>
        <div style="display: flex; justify-content: center; background: #f8f9fa; padding: 20px; border-radius: 8px;">
          ${radarChart}
        </div>
        <p style="text-align: center; color: #666; font-size: 0.85rem; margin-top: 0.75rem;">
          Your performance across all business categories compared to industry benchmarks
        </p>
      </div>

      <div class="visualization-row two-column" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 1.5rem 0;">
        ${heatmap ? `
        <div class="visualization-container">
          <h3 style="color: ${primaryColor}; font-family: 'Montserrat', sans-serif; margin-bottom: 1rem;">Chapter Performance Heatmap</h3>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
            ${heatmap}
          </div>
        </div>
        ` : ''}

        <div class="visualization-container">
          <h3 style="color: ${primaryColor}; font-family: 'Montserrat', sans-serif; margin-bottom: 1rem;">Industry Benchmark Comparison</h3>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; overflow-x: auto;">
            ${benchmarkBars}
          </div>
        </div>
      </div>

      <div class="category-summaries" style="margin-top: 2rem;">
        <h3 style="color: ${primaryColor}; font-family: 'Montserrat', sans-serif; margin-bottom: 1rem;">Category Quick Insights</h3>
        <p style="color: #666; margin-bottom: 1rem; font-size: 0.95rem;">
          Key insights from your most critical categories. Categories requiring attention are prioritized.
        </p>
        <div class="category-grid">
          ${categoryCards}
        </div>
      </div>
    </section>
  `;
}

/**
 * Build Cross-Category Insights section for Owner's Report
 * Displays systemic patterns and prioritization matrix
 */
function buildCrossCategoryInsights(
  ctx: ReportContext,
  options: ReportRenderOptions
): string {
  // Graceful fallback if data unavailable
  if (!ctx.crossCategoryInsights) {
    return '';
  }

  const insights = ctx.crossCategoryInsights;
  const primaryColor = options.brand.primaryColor;
  const accentColor = options.brand.accentColor;

  // Generate interdependency network if category analyses available
  const networkDiagram = ctx.categoryAnalyses && ctx.categoryAnalyses.length > 0
    ? generateInterdependencyNetwork(insights)
    : '';

  // Generate systemic patterns HTML
  const systemicPatternsHtml = insights.systemicPatterns?.length > 0
    ? insights.systemicPatterns.slice(0, 4).map(pattern => `
        <div class="pattern-card">
          <h4>${escapeHtml(pattern.pattern)}</h4>
          <p>${escapeHtml(pattern.description)}</p>
          <p class="recommendation"><strong>Recommendation:</strong> ${escapeHtml(pattern.recommendation)}</p>
          <p class="affected-categories">
            <em>Affected Categories: ${pattern.affectedCategories?.join(', ') || 'N/A'}</em>
          </p>
        </div>
      `).join('')
    : '<p style="color: #666; font-style: italic;">No systemic patterns identified in this assessment.</p>';

  // Generate prioritization table HTML
  const prioritizationTableHtml = insights.prioritizationMatrix?.length > 0
    ? `
      <div class="table-responsive">
        <table class="prioritization-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Urgency</th>
              <th>Impact</th>
              <th>Effort</th>
              <th>Priority Score</th>
              <th>Recommendation</th>
            </tr>
          </thead>
          <tbody>
            ${insights.prioritizationMatrix.slice(0, 8).map(item => {
              const scoreBand = getPhase15ScoreBand(item.priorityScore * 10);
              return `
              <tr class="priority-${scoreBand}">
                <td><strong>${escapeHtml(item.categoryCode)}</strong></td>
                <td>${item.urgency}/10</td>
                <td>${item.impact}/10</td>
                <td>${item.effort}/10</td>
                <td class="priority-score"><strong>${item.priorityScore.toFixed(1)}</strong></td>
                <td>${escapeHtml((item.recommendation || '').substring(0, 80))}${(item.recommendation || '').length > 80 ? '...' : ''}</td>
              </tr>
            `;}).join('')}
          </tbody>
        </table>
      </div>
    `
    : '<p style="color: #666; font-style: italic;">Prioritization matrix data unavailable.</p>';

  return `
    <section class="section page-break" id="cross-category-insights">
      ${renderOwnerSectionHeader('Strategic Interdependencies & Priorities', 'How do my business areas affect each other?')}

      <p class="section-intro">
        Understanding how your business categories influence each other enables strategic resource allocation
        and helps prevent cascading failures from unaddressed weaknesses.
      </p>

      ${networkDiagram ? `
      <div class="visualization-container" style="margin: 1.5rem 0;">
        <h3 style="color: ${primaryColor}; font-family: 'Montserrat', sans-serif; margin-bottom: 1rem;">Category Interdependency Network</h3>
        <p style="color: #666; margin-bottom: 15px; font-size: 0.9rem;">
          This diagram shows how different business categories influence each other.
          Strong connections indicate where improvements can have cascading positive effects.
        </p>
        <div style="display: flex; justify-content: center; background: #f8f9fa; padding: 20px; border-radius: 8px;">
          ${networkDiagram}
        </div>
      </div>
      ` : ''}

      <div class="systemic-patterns" style="margin: 1.5rem 0;">
        <h3 style="color: ${primaryColor}; font-family: 'Montserrat', sans-serif; margin-bottom: 1rem;">Systemic Patterns Identified</h3>
        <p style="color: #666; margin-bottom: 1rem; font-size: 0.9rem;">
          These patterns span multiple categories and represent opportunities for high-leverage improvements.
        </p>
        ${systemicPatternsHtml}
      </div>

      <div class="prioritization-matrix" style="margin: 1.5rem 0;">
        <h3 style="color: ${primaryColor}; font-family: 'Montserrat', sans-serif; margin-bottom: 1rem;">Category Improvement Prioritization</h3>
        <p class="matrix-explanation" style="color: #666; margin-bottom: 1rem; font-size: 0.9rem;">
          Categories ranked by combination of urgency, potential impact, and implementation effort.
          Higher priority scores indicate categories that should be addressed first.
        </p>
        ${prioritizationTableHtml}
      </div>
    </section>
  `;
}

/**
 * Build business owner report with integrated narrative content
 * Enhanced with owner-focused voice, cross-references, and depth constraints
 */
export async function buildOwnersReport(
  ctx: ReportContext,
  options: ReportRenderOptions
): Promise<GeneratedReport> {
  const reportType = 'owner';
  const reportName = 'Business Owner Report';

  // Reset reference logger for fresh run
  referenceLogger.reset();

  logger.info('Building owners report with narrative integration and cross-references');

  // Get narrative content from context and sanitize terminology
  // P1 FIX: Remove internal pipeline references from client-facing content
  const rawNarratives = ctx.narrativeContent;
  const narratives = rawNarratives ? sanitizeObjectTerminology(rawNarratives) : rawNarratives;
  const hasNarratives = narratives && narratives.metadata?.contentSufficient;

  // Apply owner report constraints for abbreviated content
  const { maxPriorities, maxQuickWins, maxRisks, maxRecommendationsPerSection } = OWNER_REPORT_CONSTRAINTS;

  // Get constrained findings and recommendations
  const strengths = ctx.findings.filter(f => f.type === 'strength').slice(0, 3);
  const priorities = ctx.findings.filter(f => f.type === 'gap' || f.type === 'risk').slice(0, maxPriorities);
  const topRecommendations = ctx.recommendations.slice(0, maxRecommendationsPerSection + 2);
  const quickWins = ctx.quickWins.slice(0, maxQuickWins);
  const topRisks = ctx.risks?.slice(0, maxRisks) || [];

  // Generate narrative CSS styles with owner enhancements
  const narrativeStyles = generateOwnerNarrativeStyles(options.brand.primaryColor, options.brand.accentColor);

  // Generate visual enhancement components
  const keyTakeawaysHtml = generateKeyTakeaways(ctx);
  const executiveHighlightsHtml = generateExecutiveHighlights(ctx);
  const overallBenchmarkHtml = generateOverallBenchmarkCallout(ctx);
  const insightCardsHtml = buildOwnerInsightCards(ctx, 4);
  const benchmarkSummaryHtml = generateBenchmarkSummaryTable(ctx);

  // Generate visual charts asynchronously
  logger.info('Generating visual charts for owner report');
  const [chapterRadar, chapterBars] = await Promise.all([
    generateChapterOverviewRadar(ctx, { width: 450, height: 350 }).catch(() => ''),
    generateAllChapterScoreBars(ctx, { width: 550, height: 220 }).catch(() => ''),
  ]);

  // ============================================================================
  // WORLD-CLASS VISUAL COMPONENTS (Phase 1.5-2)
  // ============================================================================
  logger.info('Generating world-class visual components for owner report');

  // Generate 4-Chapter Radar (simplified for owner report)
  let worldClassChapterRadar = '';
  try {
    const chapterRadarData = contextToChapterRadarData(ctx);
    if (chapterRadarData && chapterRadarData.chapters.length > 0) {
      worldClassChapterRadar = render4ChapterRadar(chapterRadarData, {
        width: 400,
        height: 350,
        showBenchmark: true,
        showLegend: true,
        companyName: ctx.companyProfile.name,
      });
    }
  } catch (error) {
    logger.warn({ error }, 'Failed to generate 4-chapter radar for owner report');
  }

  // Generate Financial Impact Dashboard
  let worldClassFinancialDashboard = '';
  try {
    const financialData = contextToFinancialImpactData(ctx);
    if (financialData) {
      worldClassFinancialDashboard = generateFinancialImpactDashboard(financialData, {
        showROI: true,
        showTimeline: true,
        companyName: ctx.companyProfile.name,
      });
    }
  } catch (error) {
    logger.warn({ error }, 'Failed to generate financial impact dashboard for owner report');
  }

  // Generate Quick Wins Cards
  let worldClassQuickWinsCards = '';
  try {
    const quickWinCards = contextToQuickWinCards(ctx);
    if (quickWinCards && quickWinCards.length > 0) {
      worldClassQuickWinsCards = generateQuickWinsGrid(quickWinCards.slice(0, 4), {
        columns: 2,
        showTransformation: true,
        showTimeline: true,
      });
    }
  } catch (error) {
    logger.warn({ error }, 'Failed to generate quick wins cards for owner report');
  }

  // ============================================================================
  // ENHANCED CHAPTER SUMMARIES WITH PERCENTILE RANKINGS (Phase 1.5-2)
  // World-class section headers showing competitive positioning
  // ============================================================================
  logger.info('Generating enhanced chapter summaries with percentile rankings');

  let enhancedChapterSummaries = '';
  try {
    enhancedChapterSummaries = ctx.chapters.map(chapter => {
      const headerConfig = chapterToSectionHeader(
        {
          code: chapter.code,
          name: chapter.name,
          score: chapter.score,
          benchmark: chapter.industryBenchmark || chapter.benchmark?.peerPercentile,
          percentile: chapter.percentileRank,
        },
        ctx.companyProfile.industry
      );

      return generateEnhancedSectionHeader(headerConfig, {
        size: 'medium',
        showPercentile: true,
        showBand: true,
        showBenchmark: !!chapter.industryBenchmark,
        benchmark: chapter.industryBenchmark,
      });
    }).join('');
  } catch (error) {
    logger.warn({ error }, 'Failed to generate enhanced chapter summaries for owner report');
  }

  // Generate financial aggregates for overview display
  const financialProjections = ctx.financialProjections;
  const investmentLow = financialProjections?.totalInvestmentRequired
    ? Math.floor(financialProjections.totalInvestmentRequired * 0.8)
    : 0;
  const investmentHigh = financialProjections?.totalInvestmentRequired
    ? Math.ceil(financialProjections.totalInvestmentRequired * 1.2)
    : 0;
  const returnLow = financialProjections?.annualValue
    ? Math.floor(financialProjections.annualValue * 0.8)
    : 0;
  const returnHigh = financialProjections?.annualValue
    ? Math.ceil(financialProjections.annualValue * 1.2)
    : 0;
  const roiLow = financialProjections?.roi90Day || 1.5;
  const roiHigh = roiLow * 1.5;

  // Check Beta mode status from context
  const betaDisableBlur = ctx.legalAccess?.betaDisableBlur ?? false;
  const termsVersion = ctx.legalAccess?.termsVersion || '2025.1';

  // Generate Clickwrap Legal UX Components (only when NOT in Beta mode)
  const generatedDate = new Date(ctx.metadata.generatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  let clickwrapModal = '';
  let acceptanceBanner = '';
  let legalAccordion = '';

  if (!betaDisableBlur) {
    // PRODUCTION MODE: Generate full legal protection components
    const clickwrapConfig: ClickwrapConfig = {
      reportId: ctx.runId,
      reportType: 'owner',
      companyName: ctx.companyProfile.name,
      termsVersion,
      generatedDate,
    };

    // Generate legal content for clickwrap modal
    const clickwrapLegalContent = generateClickwrapLegalContent();

    // Generate clickwrap modal (gates content until accepted)

    // Generate acceptance banner (compact replacement for legal block)
    acceptanceBanner = generateAcceptanceBanner({
      termsVersion,
      showViewTermsLink: true,
    });

    // Generate legal accordion (collapsible sections at bottom)
    const legalSections = getDefaultLegalSections();
    legalAccordion = generateLegalAccordion(legalSections);

    logger.info('Production mode: Full legal protection enabled for owner report');
  } else {
    logger.info('Beta mode: Clickwrap/blur protection bypassed for owner report');
  }

  // Phase 0: Generate cover page for Owner's Report
  const coverPage = generateCoverPage(ctx, {
    reportType: 'owner',
    showLogo: true,
    showConfidentialBadge: true,
  });

  // ============================================================================
  // PHASE 1: OWNER DECISION BRIEF PREMIUM COMPONENTS
  // ============================================================================
  logger.info('Generating Owner Health Dashboard and Decision Agenda');

  // Generate Owner Health Dashboard (one-page executive summary)
  let ownerHealthDashboard = '';
  try {
    ownerHealthDashboard = generateOwnerHealthDashboard(ctx);
  } catch (error) {
    logger.warn({ error }, 'Failed to generate Owner Health Dashboard');
  }

  // Generate Owner's Decision Agenda (strategic decisions section)
  let ownerDecisionAgenda = '';
  try {
    ownerDecisionAgenda = generateOwnerDecisionAgenda(ctx);
  } catch (error) {
    logger.warn({ error }, 'Failed to generate Owner Decision Agenda');
  }

  // Generate Risk Heatmap for enhanced risk visualization
  let riskHeatmap = '';
  try {
    if (topRisks && topRisks.length > 0) {
      riskHeatmap = renderRiskHeatmapFromRisks(topRisks.slice(0, 10).map(risk => ({
        id: risk.id,
        narrative: risk.narrative || risk.title || risk.description || '',
        severity: risk.severity || 'medium',
        likelihood: risk.likelihood || 'medium',
        category: risk.category,
        dimensionCode: risk.dimensionCode,
      })));
    }
  } catch (error) {
    logger.warn({ error }, 'Failed to generate Risk Heatmap');
  }

  const html = wrapHtmlDocument(`
    ${coverPage}

    ${generateReportHeader(ctx, reportName, 'Your Executive Decision Guide')}

    <!-- Compact Terms Acceptance Banner (replaces lengthy legal block) -->
    ${acceptanceBanner}

    <!-- ================================================================
         SECTION: Owner Health Dashboard (One-Page Executive Summary)
         Premium "Owner Decision Brief" - Phase 1
         ================================================================ -->
    ${ownerHealthDashboard ? ownerHealthDashboard : ''}

    <!-- ================================================================
         SECTION: Your Business Health at a Glance
         ================================================================ -->
    <section class="section" id="health-overview">
      ${renderOwnerSectionHeader('Your Business Health at a Glance', 'How is my business doing?')}

      <div class="health-score-display">
        <div class="health-score-circle">
          <span class="score">${ctx.overallHealth.score}</span>
          <span class="out-of">/ 100</span>
        </div>
        <div class="health-score-details">
          <p class="status">${escapeHtml(transformToOwnerVoice(ctx.overallHealth.status))}</p>
          <p class="trajectory">
            ${getTrajectoryIcon(ctx.overallHealth.trajectory)}
            Your Trajectory: ${ctx.overallHealth.trajectory}
          </p>
          <p class="band">
            <span class="band-badge ${ctx.overallHealth.band}">${ctx.overallHealth.band}</span>
          </p>
        </div>
      </div>

      <!-- Executive Highlights Summary -->
      ${executiveHighlightsHtml}

      <!-- World-Class: 4-Chapter Radar (Signature for Owner Report) -->
      ${worldClassChapterRadar ? `
        <div class="world-class-radar-section" style="margin: 2rem 0; padding: 1.5rem; background: linear-gradient(135deg, #fafbfc 0%, #fff 100%); border-radius: 12px; border: 1px solid #e9ecef;">
          <h3 style="color: ${options.brand.primaryColor}; font-family: 'Montserrat', sans-serif; margin: 0 0 1rem 0; font-size: 1.1rem; text-align: center;">Your 4-Chapter Business Overview</h3>
          <div style="display: flex; justify-content: center;">
            ${worldClassChapterRadar}
          </div>
          <p style="text-align: center; color: #666; font-size: 0.85rem; margin-top: 0.75rem;">
            How your business compares across the four key operational pillars
          </p>
        </div>
      ` : ''}

      <!-- Visual Performance Charts (Fallback/Additional) -->
      ${chapterRadar || chapterBars ? `
        <div class="owner-charts-section">
          <h3 style="color: ${options.brand.primaryColor}; font-family: 'Montserrat', sans-serif; margin: 1.5rem 0 1rem 0; font-size: 1.1rem;">Your Performance at a Glance</h3>
          <div class="owner-charts-grid">
            ${chapterRadar ? `<div class="chart-item">${chapterRadar}</div>` : ''}
            ${chapterBars ? `<div class="chart-item">${chapterBars}</div>` : ''}
          </div>
        </div>
      ` : ''}

      <!-- Key Takeaways Box -->
      ${keyTakeawaysHtml}

      <!-- Benchmark Callout -->
      ${overallBenchmarkHtml}
    </section>

    <!-- ================================================================
         SECTION: What This Means for You as the Owner
         ================================================================ -->
    <section class="section" id="what-this-means">
      ${renderOwnerSectionHeader('What This Means for You as the Owner', 'What should I understand from this?')}

      <div class="owner-implications-grid">
        <div class="implication-card growth">
          <div class="card-icon">&#128200;</div>
          <div class="card-title">For Your Growth</div>
          <p>${getGrowthImplication(ctx)}</p>
        </div>

        <div class="implication-card risk">
          <div class="card-icon">&#9888;&#65039;</div>
          <div class="card-title">For Your Risk</div>
          <p>${getRiskImplication(ctx)}</p>
        </div>

        <div class="implication-card value">
          <div class="card-icon">&#128142;</div>
          <div class="card-title">For Your Business Value</div>
          <p>${getValueImplication(ctx)}</p>
        </div>
      </div>

      ${safeQuickRef('executiveSummary', 'what-this-means')}
    </section>

    <!-- ================================================================
         SECTION: Your Chapter Performance Summary (Enhanced Headers)
         World-class percentile ranking display for competitive context
         ================================================================ -->
    ${enhancedChapterSummaries ? `
      <section class="section" id="chapter-performance">
        ${renderOwnerSectionHeader('Your Chapter Performance Breakdown', 'How do I compare in each area?')}
        <p class="section-intro" style="margin-bottom: 1.5rem;">
          Below is your performance across the four key business pillars, showing your score,
          industry percentile ranking, and performance band. This helps you understand exactly
          where you stand competitively.
        </p>
        <div class="enhanced-chapter-summaries" style="display: flex; flex-direction: column; gap: 1rem;">
          ${enhancedChapterSummaries}
        </div>
        ${safeQuickRef('scorecard', 'chapter-performance')}
      </section>
    ` : ''}

    <!-- ================================================================
         SECTION: Phase 1.5 Category Analysis Overview
         12-category radar, heatmap, and benchmark visualizations
         ================================================================ -->
    ${buildCategoryAnalysisOverview(ctx, options)}

    <!-- ================================================================
         SECTION: Phase 1.5 Cross-Category Insights
         Interdependency network and prioritization matrix
         ================================================================ -->
    ${buildCrossCategoryInsights(ctx, options)}

    <!-- ================================================================
         SECTION: Your Critical Priorities (P0 ENHANCED)
         Now with Critical Path Actions and implementation tables
         ================================================================ -->
    <section class="section page-break" id="critical-priorities">
      ${renderOwnerSectionHeader('Your Critical Priorities', 'What must I focus on?')}

      <!-- Visual Insight Cards -->
      ${insightCardsHtml}

      <div class="grid grid-2" style="margin-bottom: 2rem;">
        <div>
          <h3 style="color: #28a745;">Your Top Strengths</h3>
          ${(() => {
            const strengthCount = countStrengths(ctx);
            if (strengthCount.count > 0) {
              return `
                <p style="font-size: 0.95rem; color: #555; margin-bottom: 1rem;">
                  <strong>${strengthCount.display} key strengths</strong> identified across your business:
                </p>
                <ul>
                  ${strengths.slice(0, 5).map(s => `
                    <li>
                      <strong>${escapeHtml(s.shortLabel)}</strong>
                      <br><small>${escapeHtml(s.dimensionName)}</small>
                    </li>
                  `).join('')}
                </ul>
              `;
            } else {
              return '<p>Your business shows balanced performance across all areas.</p>';
            }
          })()}
        </div>
        <div>
          <h3 style="color: #dc3545;">Your Priority Areas</h3>
          ${priorities.length > 0 ? `
            <ul>
              ${priorities.slice(0, maxPriorities).map(p => `
                <li>
                  <strong>${escapeHtml(p.shortLabel)}</strong>
                  <br><small>${escapeHtml(p.dimensionName)}</small>
                </li>
              `).join('')}
            </ul>
          ` : '<p>No critical priorities identified.</p>'}
        </div>
      </div>

      <!-- P0 FIX: Critical Path Actions with Implementation Tables -->
      <div class="critical-path-actions" style="margin-top: 2rem;">
        <h3 style="color: ${options.brand.primaryColor}; font-family: 'Montserrat', sans-serif; margin-bottom: 1rem; font-size: 1.2rem;">
          Your Critical Path Actions
        </h3>
        <p style="font-size: 0.95rem; color: #666; margin-bottom: 1.5rem;">
          These are your highest-priority initiatives with step-by-step implementation plans:
        </p>
        ${renderCriticalPathActions(ctx, options.brand.primaryColor)}
      </div>

      ${safeQuickRef('strategicRecommendations', 'critical-priorities')}
    </section>

    <!-- ================================================================
         SECTION: Investment & ROI Overview
         ================================================================ -->
    <section class="section" id="investment-roi">
      ${renderOwnerSectionHeader('Investment & ROI Overview', 'How much will this cost and what will I get back?')}

      <p class="section-intro">
        Here's the high-level view of what you'll need to invest and what you can expect in return.
        These are aggregate ranges across all recommended initiatives.
      </p>

      <!-- World-Class: Financial Impact Dashboard -->
      ${worldClassFinancialDashboard ? `
        <div class="world-class-financial-section" style="margin: 1.5rem 0;">
          ${worldClassFinancialDashboard}
        </div>
      ` : `
        <div class="financial-summary-grid">
          <div class="financial-card">
            <div class="card-label">Your Estimated 12-18 Month Investment</div>
            <div class="card-value">${investmentLow > 0 ? formatCurrencyRange(investmentLow, investmentHigh) : '-'}</div>
            <div class="card-sublabel">Across all initiatives</div>
          </div>
          <div class="financial-card">
            <div class="card-label">Your Potential Revenue Impact</div>
            <div class="card-value">${returnLow > 0 ? formatCurrencyRange(returnLow, returnHigh) : '-'}</div>
            <div class="card-sublabel">Over 18 months</div>
          </div>
          <div class="financial-card highlight">
            <div class="card-label">Your Expected ROI</div>
            <div class="card-value">${roiLow.toFixed(1)}x - ${roiHigh.toFixed(1)}x</div>
            <div class="card-sublabel">Return on investment</div>
          </div>
        </div>
      `}

      <!-- P1 ENHANCEMENT: Impact/Effort Prioritization Matrix -->
      ${ctx.recommendations && ctx.recommendations.length > 0 ? `
        <div class="impact-effort-matrix-section" style="margin: 2rem 0;">
          <h3 style="font-family: 'Montserrat', sans-serif; color: ${options.brand.primaryColor}; margin-bottom: 1rem; font-size: 1.1rem;">
            Prioritization Matrix
          </h3>
          <p style="font-size: 0.9rem; color: #666; margin-bottom: 1rem;">
            Your recommendations plotted by business impact and implementation effort.
            Items in the <strong style="color: #28a745;">Quick Wins</strong> quadrant (high impact, low effort) are your best starting points.
          </p>
          <div style="display: flex; justify-content: center; overflow-x: auto;">
            ${generateImpactEffortMatrix(
              ctx.recommendations.map(r => ({
                id: r.id,
                title: r.theme,
                impactScore: r.impactScore,
                effortScore: r.effortScore,
                dimensionCode: r.dimensionCode
              })),
              { width: 550, height: 450 }
            )}
          </div>
        </div>
      ` : ''}

      ${safeQuickRef('financialImpact', 'investment-roi')}
    </section>

    <!-- ================================================================
         SECTION: Execution Overview (Your First 90 Days)
         ================================================================ -->
    ${narratives?.phase3?.actionMatrix ? `
      <section class="section page-break" id="execution-overview">
        ${renderOwnerSectionHeader('Your Execution Overview', "What's my timeline?")}
        <div class="narrative-content">
          ${parseMarkdownToHTML(truncateToSentences(narratives.phase3.actionMatrix, 15), {
            maxBoldPerParagraph: 2,
            maxListItems: 6
          })}
        </div>
        ${safeQuickRef('roadmap', 'execution-overview')}
      </section>
    ` : ''}

    <!-- ================================================================
         SECTION: Quick Wins - Start Today (P0 ENHANCED)
         ================================================================ -->
      <section class="section" id="quick-wins">
        ${renderOwnerSectionHeader('Quick Wins - Start Today', 'What can I do right now?')}
        <p class="section-intro">These high-impact, low-effort improvements can be started within 7 days and completed within 90 days:</p>

        <!-- P0 FIX: Tactical Quick Wins with Implementation Steps -->
        <div class="tactical-quick-wins-section" style="margin: 1.5rem 0;">
          ${renderTacticalQuickWins(ctx, options.brand.primaryColor)}
        </div>

        ${safeQuickRef('recommendations', 'quick-wins')}
      </section>

    <!-- ================================================================
         SECTION: Key Risks to Your Business (P0 ENHANCED)
         Now with complete mitigation strategies
         ================================================================ -->
    <section class="section" id="key-risks">
      ${renderOwnerSectionHeader('Key Risks to Your Business', 'What could hurt my business?')}

      <!-- Risk Heatmap Visualization -->
      ${riskHeatmap ? `
        <div class="risk-heatmap-section" style="margin: 1.5rem 0;">
          <h3 style="font-family: 'Montserrat', sans-serif; color: ${options.brand.primaryColor}; margin-bottom: 1rem; font-size: 1.1rem;">
            Risk Landscape Overview
          </h3>
          <p style="font-size: 0.9rem; color: #666; margin-bottom: 1rem;">
            This heatmap shows your identified risks plotted by severity (vertical) and likelihood (horizontal).
            Risks in the upper-right quadrant require immediate attention.
          </p>
          <div style="display: flex; justify-content: center;">
            ${riskHeatmap}
          </div>
        </div>
      ` : ''}

      <!-- P0 FIX: Enhanced Risks with Mitigation Strategies -->
      <div class="enhanced-risks-section" style="margin: 1.5rem 0;">
        <h4 style="font-family: 'Montserrat', sans-serif; color: #dc3545; margin-bottom: 1rem;">
          ⚠️ Priority Risks with Mitigation Strategies
        </h4>
        ${renderEnhancedRisks(ctx, options.brand.primaryColor)}
      </div>

      ${safeQuickRef('riskAssessment', 'key-risks')}
    </section>

    <!-- ================================================================
         SECTION: Where to Go for Detail
         ================================================================ -->
    ${renderWhereToGoForDetail()}

    <!-- ================================================================
         SECTION: Owner's Decision Agenda
         Premium "Owner Decision Brief" - Phase 1
         ================================================================ -->
    ${ownerDecisionAgenda ? ownerDecisionAgenda : ''}

    <!-- ================================================================
         SECTION: Your Next Steps
         ================================================================ -->
    <section class="section" id="next-steps">
      ${renderOwnerSectionHeader('Your Next Steps', 'What do I do now?')}
      <div class="callout success">
        <div class="title">Your Recommended Actions</div>
        <ol>
          <li><strong>This Week:</strong> Review the Quick Wins section above and select 1-2 initiatives to begin immediately</li>
          <li><strong>This Month:</strong> Schedule a strategic planning session with your leadership team to address your priority areas</li>
          <li><strong>For Detail:</strong> Use the "Where to Go for Detail" section above to navigate to the Comprehensive Report for full analysis</li>
          <li><strong>For Support:</strong> Consider engaging with BizHealth.ai for implementation support and ongoing monitoring</li>
        </ol>
      </div>
    </section>

    <!-- Legal Accordion (collapsible terms at bottom, collapsed by default) -->
    ${legalAccordion}

    ${generateOwnerReportFooter(ctx, narratives)}
  `, {
    title: `${reportName} - ${ctx.companyProfile.name}`,
    brand: options.brand,
    customCSS: narrativeStyles,
    legalAccess: ctx.legalAccess,
    ctx: ctx,
  });

  // Print reference usage summary if debug logging is enabled
  referenceLogger.printSummary();

  logger.info({
    contentWords: narratives?.metadata?.totalWords || 0,
    crossReferences: referenceLogger.getUsages().length,
    missingRefs: referenceLogger.getMissingRefs().length,
  }, 'Owners report built with cross-references');

  // Sanitize orphaned visualization headers from AI-generated content
  const { html: partialSanitizedHtml, removedCount, removedItems } = sanitizeOrphanedVisualizationHeaders(html);

  // P0 FIX: Remove duplicate empty CPA sections from AI-generated narrative
  const { html: sanitizedHtml, removedCount: cpaRemovedCount, removedItems: cpaRemovedItems } = removeDuplicateCPASections(partialSanitizedHtml);

  const totalRemoved = removedCount + cpaRemovedCount;
  if (totalRemoved > 0) {
    logger.info({ removedCount, cpaRemovedCount, removedItems: [...removedItems, ...cpaRemovedItems] }, 'Sanitized orphaned headers and duplicate CPAs from owner report');
  }

  // Write HTML file
  const htmlPath = path.join(options.outputDir, `${reportType}.html`);
  await fs.writeFile(htmlPath, sanitizedHtml, 'utf-8');

  // Generate metadata with new section IDs (including Phase 1 Owner Decision Brief sections)
  const meta: ReportMeta = {
    reportType: 'owner',
    reportName,
    generatedAt: new Date().toISOString(),
    companyName: ctx.companyProfile.name,
    runId: ctx.runId,
    healthScore: ctx.overallHealth.score,
    healthBand: ctx.overallHealth.band,
    pageSuggestionEstimate: 7, // Updated for new sections
    sections: [
      { id: 'owner-dashboard', title: 'Owner Health Dashboard' }, // NEW: Phase 1
      { id: 'health-overview', title: 'Your Business Health at a Glance' },
      { id: 'what-this-means', title: 'What This Means for You as the Owner' },
      { id: 'chapter-performance', title: 'Your Chapter Performance Breakdown' },
      { id: 'critical-priorities', title: 'Your Critical Priorities' },
      { id: 'investment-roi', title: 'Investment & ROI Overview' },
      { id: 'execution-overview', title: 'Your Execution Overview' },
      { id: 'quick-wins', title: 'Quick Wins - Start Today' },
      { id: 'key-risks', title: 'Key Risks to Your Business' },
      { id: 'where-to-go', title: 'Where to Go for Detail' },
      { id: 'owner-decisions', title: "Owner's Decision Agenda" }, // NEW: Phase 1
      { id: 'next-steps', title: 'Your Next Steps' },
    ],
    brand: {
      primaryColor: options.brand.primaryColor,
      accentColor: options.brand.accentColor,
    },
  };

  const metaPath = path.join(options.outputDir, `${reportType}.meta.json`);
  await fs.writeFile(metaPath, JSON.stringify(meta, null, 2), 'utf-8');

  return {
    reportType: 'owner',
    reportName,
    htmlPath,
    metaPath,
    generatedAt: meta.generatedAt,
  };
}

/**
 * Format currency value
 */
function formatCurrency(value?: number): string {
  if (value === undefined || value === null) return '-';
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value}`;
}

/**
 * Render owner-focused section header with question framing
 */
function renderOwnerSectionHeader(title: string, ownerQuestion?: string): string {
  return `
    <div class="owner-section-header">
      <h2>${title}</h2>
      ${ownerQuestion ? `
        <p class="owner-question">
          <span class="question-icon">&#128173;</span>
          <em>"${ownerQuestion}"</em>
        </p>
      ` : ''}
    </div>
  `;
}

/**
 * Generate growth implication text based on context
 */
function getGrowthImplication(ctx: ReportContext): string {
  const geChapter = ctx.chapters.find(ch => ch.code === 'GE');
  const score = geChapter?.score || ctx.overallHealth.score;

  if (score >= 80) {
    return 'Your business shows strong growth fundamentals. Focus on scaling what works and expanding into new opportunities.';
  } else if (score >= 60) {
    return 'Your business has solid growth potential with room for improvement. Addressing identified gaps could accelerate revenue growth.';
  } else if (score >= 40) {
    return 'Your growth engine needs attention. Sales processes and market positioning require strategic focus to unlock revenue potential.';
  } else {
    return 'Critical improvements are needed in your growth strategy. Immediate action on sales and marketing fundamentals is recommended.';
  }
}

/**
 * Generate risk implication text based on context
 */
function getRiskImplication(ctx: ReportContext): string {
  const rsChapter = ctx.chapters.find(ch => ch.code === 'RS');
  const riskCount = ctx.risks?.length || ctx.findings.filter(f => f.type === 'risk').length;
  const score = rsChapter?.score || ctx.overallHealth.score;

  if (score >= 80 && riskCount <= 2) {
    return 'Your business has strong risk management practices. Continue monitoring and maintain your compliance standards.';
  } else if (score >= 60) {
    return 'Some operational and compliance risks need attention to protect business continuity and avoid potential issues.';
  } else if (score >= 40) {
    return 'Key vulnerabilities exist in your operations. Addressing these risks should be a priority to protect your business.';
  } else {
    return 'Significant risk exposure requires immediate attention. Prioritize risk mitigation to protect your business from potential harm.';
  }
}

/**
 * Generate business value implication text based on context
 */
function getValueImplication(ctx: ReportContext): string {
  const score = ctx.overallHealth.score;
  const trajectory = ctx.overallHealth.trajectory;

  if (score >= 80 && trajectory === 'up') {
    return 'Your business is well-positioned for valuation growth. Strong fundamentals make you attractive to investors or potential buyers.';
  } else if (score >= 60) {
    return 'Addressing identified gaps could significantly improve your business valuation. Focus on the priority areas for maximum impact.';
  } else if (score >= 40) {
    return 'Your business value is constrained by operational challenges. Systematic improvement will unlock hidden value.';
  } else {
    return 'Business value improvement requires foundational work. Implementing recommended changes will build a stronger, more valuable business.';
  }
}

/**
 * Generate owner report footer with word count
 */
function generateOwnerReportFooter(ctx: ReportContext, narratives: any): string {
  const year = new Date().getFullYear();
  const wordCount = narratives?.metadata?.totalWords || 0;

  return `
    <footer class="report-footer">
      <p>&copy; ${year} BizHealth.ai - Confidential Business Assessment Report</p>
      <p>Assessment ID: ${ctx.runId}</p>
      ${wordCount > 0 ? `<p>Narrative Content: ${wordCount.toLocaleString()} words</p>` : ''}
    </footer>
  `;
}

// ============================================================================
// PHASE 2: P0 CONTENT FIX UTILITIES
// Owner's Report Enhanced Data Extraction
// ============================================================================

/**
 * Interface for tactical quick win with implementation steps
 */
interface TacticalQuickWin {
  title: string;
  description: string;
  category: string;
  categoryCode?: string;
  timeframe: string;
  owner: string;
  steps: string[];
  expectedOutcome?: string;
  impact: string;
  effort: string;
  roi?: string;
}

/**
 * Interface for risk with mitigation strategies
 */
interface EnhancedRisk {
  id: string;
  title: string;
  description: string;
  severity: string;
  likelihood: string;
  category: string;
  mitigationStrategies: Array<{
    strategy: string;
    timeline?: string;
    investment?: string;
    expectedImpact?: string;
  }>;
  monitoringIndicators?: string[];
}

/**
 * Interface for Critical Path Action
 */
interface CriticalPathAction {
  id: string;
  title: string;
  description: string;
  rationale: string;
  priority: number;
  implementationSteps: Array<{
    week: string;
    action: string;
    owner: string;
    deliverable: string;
  }>;
  monitoringIndicators: string[];
  expectedOutcome: string;
  category: string;
}

/**
 * Extract tactical quick wins from categoryAnalyses (not generic recommendations)
 * P0 FIX: Get actual actionable quick wins with implementation steps
 */
function extractTacticalQuickWins(ctx: ReportContext): TacticalQuickWin[] {
  const tacticalWins: TacticalQuickWin[] = [];

  // Source 1: Category-level quick wins (most specific and actionable)
  if (ctx.categoryAnalyses && ctx.categoryAnalyses.length > 0) {
    for (const category of ctx.categoryAnalyses) {
      if (category.quickWins && category.quickWins.length > 0) {
        for (const qw of category.quickWins) {
          // Skip generic "improvement initiative" titles
          if (qw.title?.toLowerCase().includes('improvement initiative')) {
            continue;
          }

          tacticalWins.push({
            title: qw.title || 'Quick Win',
            description: qw.description || qw.rationale || '',
            category: category.categoryName || category.categoryCode || 'General',
            categoryCode: category.categoryCode,
            timeframe: qw.timeframe || qw.timeline || '30 days',
            owner: qw.owner || qw.responsibility || mapDimensionToOwner(category.categoryCode),
            steps: qw.implementationSteps || qw.steps || [],
            expectedOutcome: qw.expectedOutcome || qw.impact,
            impact: qw.impactLevel || qw.impact || 'High',
            effort: qw.effortLevel || qw.effort || 'Low',
            roi: qw.roi
          });
        }
      }
    }
  }

  // Source 2: Context quick wins if category-level didn't provide enough
  if (tacticalWins.length < 3 && ctx.quickWins && ctx.quickWins.length > 0) {
    for (const qw of ctx.quickWins) {
      // Skip generic titles
      if (qw.theme?.toLowerCase().includes('improvement initiative')) {
        continue;
      }

      // Avoid duplicates
      const isDuplicate = tacticalWins.some(tw =>
        tw.title.toLowerCase() === (qw.theme || qw.title || '').toLowerCase()
      );

      if (!isDuplicate) {
        tacticalWins.push({
          title: qw.theme || qw.title || 'Quick Win',
          description: qw.expectedOutcomes || qw.description || '',
          category: getDimensionName(qw.dimensionCode) || 'General',
          categoryCode: qw.dimensionCode,
          timeframe: qw.timeframe || '90 days',
          owner: mapDimensionToOwner(qw.dimensionCode),
          steps: qw.actionSteps || [],
          expectedOutcome: qw.expectedOutcomes,
          impact: qw.impactScore >= 70 ? 'High' : qw.impactScore >= 40 ? 'Medium' : 'Low',
          effort: qw.effortScore <= 40 ? 'Low' : qw.effortScore <= 70 ? 'Medium' : 'High',
          roi: qw.estimatedROI ? `${qw.estimatedROI.toFixed(1)}x` : undefined
        });
      }
    }
  }

  // Sort by impact/effort ratio (highest first)
  // P1 FIX: Ensure every quick win has implementation steps
  return tacticalWins
    .filter(w => w.title && w.title.length > 0)
    .map(win => ({
      ...win,
      // Generate steps if not present or empty
      steps: (win.steps && win.steps.length > 0)
        ? win.steps
        : generateImplementationSteps(win.title, win.category, win.description)
    }))
    .sort((a, b) => {
      const impactScore = (i: string) => i === 'High' ? 3 : i === 'Medium' ? 2 : 1;
      const effortScore = (e: string) => e === 'High' ? 3 : e === 'Medium' ? 2 : 1;
      const aScore = impactScore(a.impact) / effortScore(a.effort);
      const bScore = impactScore(b.impact) / effortScore(b.effort);
      return bScore - aScore;
    })
    .slice(0, 5);
}

/**
 * Map dimension code to owner role
 */
function mapDimensionToOwner(dimension?: string): string {
  if (!dimension) return 'Owner/CEO';

  const ownerMap: Record<string, string> = {
    STR: 'CEO / Strategy Lead',
    SAL: 'VP Sales / Sales Manager',
    MKT: 'Marketing Director / CMO',
    CXP: 'Customer Success Lead',
    OPS: 'COO / Operations Manager',
    FIN: 'CFO / Finance Director',
    HRS: 'HR Director / CHRO',
    LDG: 'CEO / Board',
    TIN: 'CTO / Innovation Lead',
    IDS: 'IT Director / CIO',
    RMS: 'Risk Manager / COO',
    CMP: 'General Counsel / Compliance',
  };

  return ownerMap[dimension.toUpperCase()] || 'Owner/CEO';
}

/**
 * Get dimension display name from code
 */
function getDimensionName(code?: string): string {
  if (!code) return 'General';

  const nameMap: Record<string, string> = {
    STR: 'Strategy',
    SAL: 'Sales',
    MKT: 'Marketing',
    CXP: 'Customer Experience',
    OPS: 'Operations',
    FIN: 'Financial Health',
    HRS: 'Human Resources',
    LDG: 'Leadership & Governance',
    TIN: 'Technology & Innovation',
    IDS: 'IT & Data Security',
    RMS: 'Risk Management',
    CMP: 'Compliance',
  };

  return nameMap[code.toUpperCase()] || code;
}

/**
 * P1 FIX: Generate contextual implementation steps based on action type and category
 * Ensures every quick win has actionable steps
 */
function generateImplementationSteps(title: string, category: string, description?: string): string[] {
  const titleLower = (title || '').toLowerCase();
  const categoryLower = (category || '').toLowerCase();
  const descLower = (description || '').toLowerCase();
  const combined = `${titleLower} ${descLower}`;

  // Pattern 1: "Develop X" / "Create X" actions
  if (combined.includes('develop') || combined.includes('create') || combined.includes('design')) {
    return [
      'Gather requirements and define scope with key stakeholders',
      'Research best practices and benchmark against industry standards',
      'Draft initial version with clear objectives and metrics',
      'Review with leadership team and incorporate feedback',
      'Finalize, document, and communicate to relevant parties'
    ];
  }

  // Pattern 2: "Implement X" / "Deploy X" actions
  if (combined.includes('implement') || combined.includes('deploy') || combined.includes('launch')) {
    return [
      'Define implementation scope, timeline, and success criteria',
      'Assign project owner and assemble implementation team',
      'Execute pilot phase with selected group or area',
      'Gather feedback and make necessary adjustments',
      'Roll out fully and establish ongoing monitoring'
    ];
  }

  // Pattern 3: Meeting/Review/Communication actions
  if (combined.includes('meeting') || combined.includes('review') || combined.includes('communication')) {
    return [
      'Schedule recurring calendar invites with key participants',
      'Create standardized agenda template',
      'Establish documentation and action item tracking process',
      'Conduct first session and gather participant feedback',
      'Refine format based on feedback and institutionalize'
    ];
  }

  // Pattern 4: Strategy/Planning actions
  if (categoryLower.includes('strategy') || combined.includes('plan') || combined.includes('strategic')) {
    return [
      'Conduct situation analysis using assessment findings',
      'Identify top 3 priority areas based on impact potential',
      'Develop action items with specific owners and deadlines',
      'Present to leadership for alignment and approval',
      'Begin execution with weekly progress tracking'
    ];
  }

  // Pattern 5: Operations/Process actions
  if (categoryLower.includes('operation') || combined.includes('process') || combined.includes('workflow')) {
    return [
      'Document current state process and pain points',
      'Identify quick improvements vs. longer-term changes',
      'Implement quick fixes within first two weeks',
      'Design improved process workflow',
      'Train team and monitor adoption'
    ];
  }

  // Pattern 6: Financial actions
  if (categoryLower.includes('financial') || combined.includes('budget') || combined.includes('cost')) {
    return [
      'Review current financial data and identify gaps',
      'Set measurable financial targets and KPIs',
      'Create action plan with cost/benefit analysis',
      'Implement tracking mechanisms',
      'Schedule monthly review of progress against targets'
    ];
  }

  // Pattern 7: HR/People actions
  if (categoryLower.includes('human') || categoryLower.includes('people') || combined.includes('training') || combined.includes('team')) {
    return [
      'Assess current team capabilities and needs',
      'Define clear roles, responsibilities, and expectations',
      'Create development/training plan with timeline',
      'Schedule check-ins to monitor progress',
      'Evaluate outcomes and adjust approach as needed'
    ];
  }

  // Pattern 8: Technology/IT actions
  if (categoryLower.includes('technology') || categoryLower.includes('it') || combined.includes('system') || combined.includes('software')) {
    return [
      'Document current technology landscape and gaps',
      'Research and evaluate solution options',
      'Create implementation roadmap with milestones',
      'Execute implementation with testing phases',
      'Provide training and establish support processes'
    ];
  }

  // Default fallback - generic but actionable
  return [
    'Define specific objectives and success metrics',
    'Identify required resources and assign ownership',
    'Create 30-day action plan with milestones',
    'Execute initial actions and track progress weekly',
    'Review results and adjust approach as needed'
  ];
}

/**
 * P1 FIX: Get strategy timeline with robust fallback chain
 * Returns a meaningful timeline instead of "—"
 */
function getStrategyTimeline(strategy: { strategy?: string; timeline?: string; timeframe?: string; duration?: string }, index: number): string {
  // Check all possible field names
  const timeline = strategy.timeline || strategy.timeframe || strategy.duration;
  if (timeline) return timeline;

  // Fallback based on priority (index)
  if (index === 0) return 'Immediate (0-30 days)';
  if (index === 1) return 'Short-term (30-90 days)';
  if (index <= 3) return 'Medium-term (3-6 months)';
  return 'Long-term (6-12 months)';
}

/**
 * P1 FIX: Get strategy expected impact with robust fallback chain
 * Returns a meaningful impact description instead of "—"
 */
function getStrategyExpectedImpact(strategy: { strategy?: string; expectedImpact?: string; impact?: string; outcome?: string; benefit?: string }): string {
  // Check all possible field names
  const impact = strategy.expectedImpact || strategy.impact || strategy.outcome || strategy.benefit;
  if (impact) return impact;

  // Generate contextual default based on strategy description
  const desc = (strategy.strategy || '').toLowerCase();

  if (desc.includes('implement') || desc.includes('deploy')) {
    return 'Operational improvement';
  }
  if (desc.includes('monitor') || desc.includes('track') || desc.includes('review')) {
    return 'Enhanced visibility & control';
  }
  if (desc.includes('train') || desc.includes('develop') || desc.includes('document')) {
    return 'Capability building';
  }
  if (desc.includes('assess') || desc.includes('audit') || desc.includes('evaluate')) {
    return 'Informed decision-making';
  }
  if (desc.includes('policy') || desc.includes('procedure') || desc.includes('process')) {
    return 'Standardized operations';
  }
  if (desc.includes('backup') || desc.includes('recovery') || desc.includes('protect')) {
    return 'Risk exposure reduction';
  }

  return 'Risk mitigation';
}

/**
 * Extract enhanced risks with mitigation strategies from categoryAnalyses
 * P0 FIX: Get actual mitigation content for risk display
 */
function extractEnhancedRisks(ctx: ReportContext): EnhancedRisk[] {
  const enhancedRisks: EnhancedRisk[] = [];

  // Source 1: Category-level risks with rich mitigation data
  if (ctx.categoryAnalyses && ctx.categoryAnalyses.length > 0) {
    for (const category of ctx.categoryAnalyses) {
      if (category.categoryRisks && category.categoryRisks.length > 0) {
        for (const risk of category.categoryRisks) {
          enhancedRisks.push({
            id: risk.id || `risk-${category.categoryCode}-${enhancedRisks.length}`,
            title: risk.title || risk.riskTitle || 'Identified Risk',
            description: risk.description || risk.riskDescription || '',
            severity: risk.severity || risk.impact || 'medium',
            likelihood: risk.likelihood || risk.probability || 'medium',
            category: category.categoryName || category.categoryCode || 'General',
            mitigationStrategies: risk.mitigationStrategies || risk.mitigation ?
              (Array.isArray(risk.mitigationStrategies) ?
                risk.mitigationStrategies.map((m: any, idx: number) => ({
                  strategy: typeof m === 'string' ? m : m.strategy || m.description || m.action,
                  timeline: m.timeline || m.timeframe,
                  investment: m.investment || m.cost,
                  expectedImpact: m.expectedImpact || m.impact
                })) :
                [{ strategy: risk.mitigation || 'Develop mitigation plan' }]
              ) :
              [{ strategy: 'See Comprehensive Report for detailed mitigation strategies' }],
            monitoringIndicators: risk.monitoringIndicators || risk.kpis || []
          });
        }
      }
    }
  }

  // Source 2: Context risks as fallback
  if (enhancedRisks.length < 2 && ctx.risks && ctx.risks.length > 0) {
    for (const risk of ctx.risks) {
      const isDuplicate = enhancedRisks.some(er =>
        er.title.toLowerCase() === (risk.title || risk.narrative || '').toLowerCase()
      );

      if (!isDuplicate) {
        enhancedRisks.push({
          id: risk.id || `risk-${enhancedRisks.length}`,
          title: risk.title || risk.narrative?.substring(0, 50) || 'Risk',
          description: risk.narrative || risk.description || '',
          severity: String(risk.severity) || 'medium',
          likelihood: String(risk.likelihood) || 'medium',
          category: risk.category || getDimensionName(risk.dimensionCode) || 'General',
          mitigationStrategies: risk.mitigationSummary ?
            [{ strategy: risk.mitigationSummary }] :
            [{ strategy: 'See Comprehensive Report for detailed mitigation strategies' }],
          monitoringIndicators: []
        });
      }
    }
  }

  // Sort by severity and likelihood
  const severityOrder: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
  return enhancedRisks
    .sort((a, b) => {
      const aScore = (severityOrder[a.severity.toLowerCase()] || 2) * (severityOrder[a.likelihood.toLowerCase()] || 2);
      const bScore = (severityOrder[b.severity.toLowerCase()] || 2) * (severityOrder[b.likelihood.toLowerCase()] || 2);
      return bScore - aScore;
    })
    .slice(0, 5);
}

/**
 * Build Critical Path Actions from roadmap phases and recommendations
 * P0 FIX: Generate complete CPA content with implementation tables
 */
function buildCriticalPathActions(ctx: ReportContext): CriticalPathAction[] {
  const cpas: CriticalPathAction[] = [];

  // Get top priority recommendations
  const topRecs = [...(ctx.recommendations || [])].sort((a, b) => a.priorityRank - b.priorityRank).slice(0, 3);

  // Get roadmap phases
  const roadmap = ctx.roadmap || { phases: [] };

  // Build CPAs from roadmap phases combined with recommendations
  for (let i = 0; i < Math.min(3, Math.max(topRecs.length, roadmap.phases?.length || 0)); i++) {
    const rec = topRecs[i];
    const phase = roadmap.phases?.[i];

    if (rec || phase) {
      const title = rec?.theme || phase?.name || `Critical Initiative ${i + 1}`;
      const description = rec?.expectedOutcomes || phase?.narrative || '';

      // Generate implementation steps based on action steps or phase milestones
      const actionSteps = rec?.actionSteps || phase?.keyMilestones || [];
      const implementationSteps = actionSteps.length > 0 ?
        actionSteps.slice(0, 4).map((step: string, idx: number) => ({
          week: `Week ${(idx * 2) + 1}-${(idx + 1) * 2}`,
          action: step,
          owner: mapDimensionToOwner(rec?.dimensionCode),
          deliverable: idx === actionSteps.length - 1 ? 'Implementation complete' : `${step.split(' ').slice(0, 3).join(' ')}... completed`
        })) :
        [
          { week: 'Week 1-2', action: 'Assessment and planning', owner: mapDimensionToOwner(rec?.dimensionCode), deliverable: 'Action plan documented' },
          { week: 'Week 3-4', action: 'Initial implementation', owner: mapDimensionToOwner(rec?.dimensionCode), deliverable: 'Core changes deployed' },
          { week: 'Week 5-6', action: 'Refinement and optimization', owner: mapDimensionToOwner(rec?.dimensionCode), deliverable: 'System operational' },
          { week: 'Week 7-8', action: 'Monitoring and adjustment', owner: mapDimensionToOwner(rec?.dimensionCode), deliverable: 'KPIs on track' }
        ];

      cpas.push({
        id: `cpa-${String(i + 1).padStart(2, '0')}`,
        title: title.replace(/improvement initiative/gi, 'Strategic Action'),
        description,
        rationale: rec ?
          `Addresses critical gap in ${getDimensionName(rec.dimensionCode)} with projected score improvement from current levels.` :
          `Part of the ${phase?.timeHorizon || '0-90 day'} transformation roadmap.`,
        priority: i + 1,
        implementationSteps,
        monitoringIndicators: [
          `Track progress against ${getDimensionName(rec?.dimensionCode)} KPIs`,
          'Weekly status updates to leadership',
          'Monthly ROI assessment'
        ],
        expectedOutcome: description || `Improved ${getDimensionName(rec?.dimensionCode)} performance`,
        category: getDimensionName(rec?.dimensionCode) || 'Strategic'
      });
    }
  }

  return cpas;
}

/**
 * Count strengths from findings and category analyses
 * P0 FIX: Properly count strengths, never show "0"
 */
function countStrengths(ctx: ReportContext): { count: number; display: string } {
  let count = 0;

  // Count from findings
  if (ctx.findings && ctx.findings.length > 0) {
    count = ctx.findings.filter(f => f.type === 'strength').length;
  }

  // Count from category analyses if findings don't have enough
  if (count === 0 && ctx.categoryAnalyses && ctx.categoryAnalyses.length > 0) {
    for (const cat of ctx.categoryAnalyses) {
      count += (cat.strengths?.length || 0);
    }
  }

  // Return count or placeholder
  if (count > 0) {
    return { count, display: String(count) };
  }

  // If genuinely 0, show contextual message instead of "0"
  return { count: 0, display: '—' };
}

/**
 * Get canonical chapter scores - SINGLE SOURCE OF TRUTH
 * P0 FIX: All visualizations must use this function for consistency
 */
function getCanonicalChapterScores(ctx: ReportContext): Array<{ code: string; name: string; score: number; benchmark?: number }> {
  // Priority 1: Use chapters from context directly
  if (ctx.chapters && ctx.chapters.length >= 4) {
    return ctx.chapters.map(ch => ({
      code: ch.code,
      name: ch.name,
      score: ch.score,
      benchmark: ch.benchmark?.peerPercentile
    }));
  }

  // Priority 2: Calculate from category analyses
  if (ctx.categoryAnalyses && ctx.categoryAnalyses.length > 0) {
    const chapterMap = new Map<string, number[]>();
    const chapterMapping: Record<string, string> = {
      'STR': 'GE', 'SAL': 'GE', 'MKT': 'GE', 'CXP': 'GE',
      'OPS': 'PH', 'FIN': 'PH',
      'HRS': 'PL', 'LDG': 'PL',
      'TIN': 'RS', 'IDS': 'RS', 'RMS': 'RS', 'CMP': 'RS'
    };

    for (const cat of ctx.categoryAnalyses) {
      const chapterCode = chapterMapping[cat.categoryCode] || 'GE';
      if (!chapterMap.has(chapterCode)) {
        chapterMap.set(chapterCode, []);
      }
      chapterMap.get(chapterCode)!.push(cat.overallScore || 0);
    }

    const average = (nums: number[]): number => {
      if (nums.length === 0) return 0;
      return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
    };

    return [
      { code: 'GE', name: 'Growth Engine', score: average(chapterMap.get('GE') || []) },
      { code: 'PH', name: 'Performance & Health', score: average(chapterMap.get('PH') || []) },
      { code: 'PL', name: 'People & Leadership', score: average(chapterMap.get('PL') || []) },
      { code: 'RS', name: 'Resilience & Safeguards', score: average(chapterMap.get('RS') || []) },
    ];
  }

  // Priority 3: Use chapter summaries
  if (ctx.chapterSummaries && ctx.chapterSummaries.length > 0) {
    return ctx.chapterSummaries.map(cs => ({
      code: cs.chapterCode,
      name: cs.chapterName || cs.chapterCode,
      score: cs.overallScore || 0
    }));
  }

  // Fallback
  logger.warn('[Owner Report] No chapter score data available');
  return [];
}

/**
 * Render tactical quick wins section with implementation steps
 * P0 FIX: Show actionable steps, not just generic titles
 */
function renderTacticalQuickWins(ctx: ReportContext, primaryColor: string): string {
  const quickWins = extractTacticalQuickWins(ctx);

  if (quickWins.length === 0) {
    return `
      <div class="comprehensive-reference">
        <span class="ref-icon">📋</span>
        <span class="ref-text">
          Quick wins are being finalized. See <strong>Comprehensive Report</strong> → <em>Prioritized Recommendations</em>
        </span>
      </div>
    `;
  }

  return quickWins.map((win, index) => `
    <div class="quick-win-card tactical" style="
      background: linear-gradient(135deg, #f8f9fa 0%, #fff 100%);
      border-left: 4px solid ${primaryColor};
      padding: 1.25rem;
      border-radius: 0 8px 8px 0;
      margin-bottom: 1rem;
    ">
      <div class="quick-win-header" style="display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 0.75rem;">
        <span class="quick-win-number" style="
          background: ${primaryColor};
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.9rem;
          flex-shrink: 0;
        ">${index + 1}</span>
        <div class="quick-win-title-block" style="flex: 1;">
          <div class="title" style="font-weight: 600; color: ${primaryColor}; font-size: 1.05rem; margin-bottom: 0.25rem;">
            ${escapeHtml(win.title)}
          </div>
          <span class="quick-win-category" style="
            font-size: 0.8rem;
            color: #666;
            background: #e9ecef;
            padding: 2px 8px;
            border-radius: 4px;
          ">${escapeHtml(win.category)}</span>
        </div>
      </div>

      <p class="quick-win-description" style="color: #555; margin: 0.75rem 0; line-height: 1.5;">
        ${escapeHtml(win.description)}
      </p>

      ${win.steps && win.steps.length > 0 ? `
        <div class="quick-win-steps" style="margin: 1rem 0; padding: 0.75rem; background: #fafbfc; border-radius: 6px;">
          <strong style="color: ${primaryColor}; font-size: 0.9rem;">How to Implement:</strong>
          <ol class="implementation-steps" style="margin: 0.5rem 0 0 1.25rem; padding: 0; font-size: 0.9rem; color: #444;">
            ${win.steps.slice(0, 4).map(step => `<li style="margin: 0.3rem 0;">${escapeHtml(step)}</li>`).join('')}
          </ol>
        </div>
      ` : ''}

      <div class="quick-win-meta" style="display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.85rem; color: #666; margin-top: 0.75rem;">
        <span>⏱️ ${escapeHtml(win.timeframe)}</span>
        <span>👤 ${escapeHtml(win.owner)}</span>
        ${win.expectedOutcome ? `<span>🎯 ${escapeHtml(win.expectedOutcome.substring(0, 50))}${win.expectedOutcome.length > 50 ? '...' : ''}</span>` : ''}
      </div>

      <div class="metrics" style="display: flex; gap: 1.5rem; font-size: 0.85rem; margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #e9ecef;">
        <span style="color: ${win.impact === 'High' ? '#28a745' : win.impact === 'Medium' ? '#ffc107' : '#6c757d'};">
          <strong>Impact:</strong> ${win.impact}
        </span>
        <span style="color: ${win.effort === 'Low' ? '#28a745' : win.effort === 'Medium' ? '#ffc107' : '#dc3545'};">
          <strong>Effort:</strong> ${win.effort}
        </span>
        ${win.roi ? `<span><strong>ROI:</strong> ${win.roi}</span>` : ''}
      </div>
    </div>
  `).join('\n');
}

/**
 * Render Critical Path Actions with implementation tables
 * P0 FIX: Complete CPA content with implementation steps and monitoring
 */
function renderCriticalPathActions(ctx: ReportContext, primaryColor: string): string {
  const cpas = buildCriticalPathActions(ctx);

  if (cpas.length === 0) {
    return `
      <div class="comprehensive-reference">
        <span class="ref-icon">📋</span>
        <span class="ref-text">
          Critical path actions are detailed in <strong>Comprehensive Report</strong> → <em>Strategic Recommendations</em>
        </span>
      </div>
    `;
  }

  return cpas.map((cpa, index) => `
    <div class="cpa-section" style="margin-bottom: 2rem; page-break-inside: avoid;">
      <h3 style="
        color: ${primaryColor};
        font-family: 'Montserrat', sans-serif;
        margin-bottom: 0.75rem;
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      ">
        <span style="
          background: ${primaryColor};
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.9rem;
        ">CPA</span>
        CPA-${String(index + 1).padStart(2, '0')}: ${escapeHtml(cpa.title)}
      </h3>

      ${cpa.description ? `<p style="color: #555; margin: 0.5rem 0; line-height: 1.5;">${escapeHtml(cpa.description)}</p>` : ''}

      <p style="color: #666; margin: 0.75rem 0; font-style: italic;">
        <strong style="color: ${primaryColor};">Why This Matters:</strong> ${escapeHtml(cpa.rationale)}
      </p>

      <div class="table-responsive" style="margin: 1rem 0;">
        <table class="bh-table" style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
          <thead>
            <tr style="background: ${primaryColor}; color: white;">
              <th style="padding: 0.75rem; text-align: left;">Timeframe</th>
              <th style="padding: 0.75rem; text-align: left;">Action</th>
              <th style="padding: 0.75rem; text-align: left;">Owner</th>
              <th style="padding: 0.75rem; text-align: left;">Deliverable</th>
            </tr>
          </thead>
          <tbody>
            ${cpa.implementationSteps.map(step => `
              <tr style="border-bottom: 1px solid #e0e0e0;">
                <td style="padding: 0.75rem; font-weight: 500; color: ${primaryColor};">${escapeHtml(step.week)}</td>
                <td style="padding: 0.75rem;">${escapeHtml(step.action)}</td>
                <td style="padding: 0.75rem;">${escapeHtml(step.owner)}</td>
                <td style="padding: 0.75rem;">${escapeHtml(step.deliverable)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      ${cpa.monitoringIndicators && cpa.monitoringIndicators.length > 0 ? `
        <div style="margin-top: 0.75rem;">
          <strong style="color: ${primaryColor}; font-size: 0.9rem;">Monitoring Indicators:</strong>
          <ul style="margin: 0.5rem 0; padding-left: 1.25rem; font-size: 0.9rem; color: #555;">
            ${cpa.monitoringIndicators.map(ind => `<li style="margin: 0.25rem 0;">${escapeHtml(ind)}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    </div>
  `).join('\n');
}

/**
 * Render enhanced risks with mitigation strategies
 * P0 FIX: Complete risk content with mitigation tables
 */
function renderEnhancedRisks(ctx: ReportContext, primaryColor: string): string {
  const risks = extractEnhancedRisks(ctx);

  if (risks.length === 0) {
    return `
      <div class="comprehensive-reference">
        <span class="ref-icon">📋</span>
        <span class="ref-text">
          Detailed risk analysis available in <strong>Comprehensive Report</strong> → <em>Comprehensive Risk Assessment</em>
        </span>
      </div>
    `;
  }

  return risks.map((risk, index) => {
    const severityColor = risk.severity.toLowerCase() === 'critical' ? '#dc3545' :
                          risk.severity.toLowerCase() === 'high' ? '#fd7e14' : '#ffc107';

    return `
      <div class="risk-detail" style="
        margin-bottom: 1.5rem;
        background: #fff;
        border-left: 4px solid ${severityColor};
        padding: 1.25rem;
        border-radius: 0 8px 8px 0;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      ">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
          <h4 style="color: ${primaryColor}; margin: 0; font-size: 1rem; font-family: 'Montserrat', sans-serif;">
            Risk #${index + 1}: ${escapeHtml(risk.title)}
          </h4>
          <span style="
            padding: 3px 10px;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            background: ${severityColor};
            color: ${risk.severity.toLowerCase() === 'critical' || risk.severity.toLowerCase() === 'high' ? '#fff' : '#000'};
          ">${escapeHtml(risk.severity)}</span>
        </div>

        <p style="color: #555; margin: 0.5rem 0; font-size: 0.95rem; line-height: 1.5;">
          ${escapeHtml(risk.description)}
        </p>

        <p style="color: #666; margin: 0.5rem 0; font-size: 0.85rem;">
          <strong>Category:</strong> ${escapeHtml(risk.category)}
          <span style="margin-left: 1rem;"><strong>Likelihood:</strong> ${escapeHtml(risk.likelihood)}</span>
        </p>

        ${risk.mitigationStrategies && risk.mitigationStrategies.length > 0 ? `
          <div style="margin-top: 1rem;">
            <strong style="color: ${primaryColor}; font-size: 0.9rem;">Mitigation Strategies:</strong>
            <div class="table-responsive" style="margin-top: 0.5rem;">
              <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
                <thead>
                  <tr style="background: #f8f9fa;">
                    <th style="padding: 0.5rem; text-align: left; border-bottom: 2px solid #dee2e6;">#</th>
                    <th style="padding: 0.5rem; text-align: left; border-bottom: 2px solid #dee2e6;">Strategy</th>
                    <th style="padding: 0.5rem; text-align: left; border-bottom: 2px solid #dee2e6;">Timeline</th>
                    <th style="padding: 0.5rem; text-align: left; border-bottom: 2px solid #dee2e6;">Expected Impact</th>
                  </tr>
                </thead>
                <tbody>
                  ${risk.mitigationStrategies.map((strategy, sIdx) => `
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                      <td style="padding: 0.5rem; font-weight: 500;">${sIdx + 1}</td>
                      <td style="padding: 0.5rem;">${escapeHtml(strategy.strategy)}</td>
                      <td style="padding: 0.5rem;">${escapeHtml(getStrategyTimeline(strategy, sIdx))}</td>
                      <td style="padding: 0.5rem;">${escapeHtml(getStrategyExpectedImpact(strategy))}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        ` : ''}

        ${risk.monitoringIndicators && risk.monitoringIndicators.length > 0 ? `
          <div style="margin-top: 0.75rem;">
            <strong style="color: ${primaryColor}; font-size: 0.85rem;">Monitoring Indicators:</strong>
            <ul style="margin: 0.25rem 0; padding-left: 1.25rem; font-size: 0.85rem; color: #555;">
              ${risk.monitoringIndicators.map(ind => `<li>${escapeHtml(ind)}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;
  }).join('\n');
}

/**
 * Generate CSS styles for narrative content and visual enhancements in owner report
 */
function generateOwnerNarrativeStyles(primaryColor: string, accentColor: string): string {
  return `
    /* Phase 0: Cover Page Styles */
    ${getCoverPageStyles()}

    /* Phase 1: Owner Health Dashboard Styles */
    ${getOwnerDashboardStyles()}

    /* Phase 1: Owner's Decision Agenda Styles */
    ${getDecisionAgendaStyles()}

    /* Narrative Content Styles */
    .narrative-content {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin-top: 1rem;
      border-left: 4px solid ${accentColor};
    }

    .narrative-content .bh-h2 {
      font-size: 1.4rem;
      color: ${primaryColor};
      margin-top: 1.25em;
      margin-bottom: 0.5em;
      border-bottom: 2px solid ${accentColor};
      padding-bottom: 0.5rem;
    }

    .narrative-content .bh-h3 {
      font-size: 1.2rem;
      color: ${primaryColor};
      margin-top: 1em;
      margin-bottom: 0.5em;
    }

    .narrative-content .bh-h4 {
      font-size: 1.05rem;
      color: #555;
      margin-top: 1em;
      margin-bottom: 0.5em;
    }

    .narrative-content .bh-p {
      margin: 1em 0;
      line-height: 1.7;
    }

    .narrative-content .bh-ul,
    .narrative-content .bh-ol {
      margin: 1em 0;
      padding-left: 1.5em;
    }

    .narrative-content .bh-li,
    .narrative-content .bh-li-num {
      margin: 0.5em 0;
      line-height: 1.6;
    }

    .narrative-content .bh-empty {
      color: #999;
      font-style: italic;
    }

    .narrative-content strong {
      color: ${primaryColor};
    }

    /* ============================================
       VISUAL ENHANCEMENT STYLES
       ============================================ */

    /* KEY TAKEAWAYS BOX */
    .key-takeaways {
      background: linear-gradient(135deg, ${primaryColor} 0%, #2a3366 100%);
      color: #fff;
      border-radius: 12px;
      padding: 1.5rem;
      margin: 1.5rem 0;
      box-shadow: 0 4px 12px rgba(33, 38, 83, 0.3);
    }

    .key-takeaways .takeaway-title {
      font-family: 'Montserrat', sans-serif;
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border-bottom: 2px solid rgba(150, 148, 35, 0.5);
      padding-bottom: 0.75rem;
    }

    .key-takeaways .takeaway-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      margin: 0.75rem 0;
      padding: 0.5rem;
      background: rgba(255,255,255,0.1);
      border-radius: 6px;
    }

    .key-takeaways .takeaway-icon {
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    .key-takeaways .takeaway-text {
      font-size: 0.95rem;
      line-height: 1.5;
    }

    /* BENCHMARK CALLOUT BOXES */
    .benchmark-callout {
      background: #e7f3ff;
      border: 1px solid #b8daff;
      border-radius: 8px;
      padding: 1rem;
      margin: 1rem 0;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .benchmark-callout .benchmark-icon {
      font-size: 2rem;
      color: ${primaryColor};
    }

    .benchmark-callout .benchmark-content { flex: 1; }

    .benchmark-callout .benchmark-label {
      font-size: 0.85rem;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .benchmark-callout .benchmark-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: ${primaryColor};
      font-family: 'Montserrat', sans-serif;
    }

    .benchmark-callout .benchmark-context {
      font-size: 0.9rem;
      color: #555;
    }

    /* EXECUTIVE HIGHLIGHTS */
    .executive-highlights {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin: 1.5rem 0;
    }

    .highlight-card {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 1rem;
      text-align: center;
      border-top: 4px solid ${primaryColor};
    }

    .highlight-card .highlight-icon {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .highlight-card .highlight-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: ${primaryColor};
      font-family: 'Montserrat', sans-serif;
    }

    .highlight-card .highlight-label {
      font-size: 0.85rem;
      color: #666;
      margin-top: 0.25rem;
    }

    /* EVIDENCE CITATION BLOCKS */
    .evidence-citation {
      background: #f8f9fa;
      border-left: 4px solid ${accentColor};
      border-radius: 0 8px 8px 0;
      padding: 0.75rem 1rem;
      margin: 0.75rem 0 1.25rem 0;
      font-size: 0.9rem;
    }

    .evidence-citation .citation-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      color: ${primaryColor};
      margin-bottom: 0.5rem;
    }

    .evidence-citation .citation-icon {
      color: ${accentColor};
    }

    .evidence-citation .question-ref {
      color: #666;
      font-size: 0.85rem;
    }

    .evidence-citation .response-text {
      color: #333;
      font-style: italic;
      margin: 0.5rem 0;
      padding-left: 1rem;
      border-left: 2px solid #ddd;
    }

    .evidence-citation .benchmark-comparison {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.5rem;
      padding-top: 0.5rem;
      border-top: 1px solid #e0e0e0;
      font-size: 0.85rem;
    }

    .evidence-citation .benchmark-comparison.above { color: #28a745; }
    .evidence-citation .benchmark-comparison.below { color: #dc3545; }
    .evidence-citation .benchmark-comparison.at { color: #6c757d; }

    /* COLOR-CODED INSIGHT CARDS */
    .insight-card {
      border-radius: 8px;
      padding: 1rem;
      margin: 0.75rem 0;
      border-left: 4px solid;
    }

    .insight-card.strength { background: #d4edda; border-left-color: #28a745; }
    .insight-card.strength .insight-label { color: #155724; }

    .insight-card.weakness { background: #f8d7da; border-left-color: #dc3545; }
    .insight-card.weakness .insight-label { color: #721c24; }

    .insight-card.opportunity { background: #cce5ff; border-left-color: #0d6efd; }
    .insight-card.opportunity .insight-label { color: #004085; }

    .insight-card.warning { background: #fff3cd; border-left-color: #ffc107; }
    .insight-card.warning .insight-label { color: #856404; }

    .insight-card .insight-label {
      font-weight: 600;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.25rem;
    }

    .insight-card .insight-title {
      font-weight: 600;
      color: ${primaryColor};
      margin-bottom: 0.5rem;
    }

    .insight-card .insight-detail {
      font-size: 0.95rem;
      color: #333;
    }

    /* INSIGHT CARDS GRID LAYOUT */
    .insight-cards-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .insight-cards-container .insight-card {
      margin: 0;
    }

    /* BENCHMARK SUMMARY TABLE */
    .benchmark-summary {
      margin: 1.5rem 0;
    }

    .benchmark-summary h4 {
      color: ${primaryColor};
      margin-bottom: 1rem;
    }

    .score-table {
      width: 100%;
      border-collapse: collapse;
    }

    .score-table th,
    .score-table td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #dee2e6;
    }

    .score-table th {
      background: #f8f9fa;
      font-weight: 600;
      color: ${primaryColor};
    }

    .score-table .score {
      font-weight: 600;
      color: ${primaryColor};
    }

    /* RESPONSIVE */
    @media (max-width: 768px) {
      .executive-highlights { grid-template-columns: repeat(2, 1fr); }
      .benchmark-callout { flex-direction: column; text-align: center; }
      .key-takeaways .takeaway-item { flex-direction: column; align-items: flex-start; }
      .insight-cards-container { grid-template-columns: 1fr; }
    }

    /* PRINT OPTIMIZATIONS */
    @media print {
      .key-takeaways {
        background: ${primaryColor} !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .evidence-citation {
        border-left-color: ${accentColor} !important;
        background: #f8f9fa !important;
      }

      .insight-card { page-break-inside: avoid; }
      .benchmark-callout { page-break-inside: avoid; }
      .executive-highlights { grid-template-columns: repeat(4, 1fr); }
    }

    /* ================================================================
       OPUS 4.5 MARKDOWN ELEMENT STYLING
       Added 2025-12-02 to support rich markdown output
       ================================================================ */

    /* Responsive Table Container */
    .table-responsive {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      margin: 1.5rem 0;
      border-radius: 8px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    }

    .bh-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.95rem;
      min-width: 400px;
      background: #fff;
    }

    .bh-table th {
      background: ${primaryColor};
      color: #fff;
      font-weight: 600;
      padding: 0.75rem 1rem;
      text-align: left;
      font-family: 'Montserrat', 'Open Sans', Arial, sans-serif;
    }

    .bh-table td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #e0e0e0;
      vertical-align: top;
      color: #333;
    }

    .bh-table tr:nth-child(even) {
      background: #f8f9fa;
    }

    .bh-table td:first-child {
      font-weight: 500;
      color: ${primaryColor};
    }

    /* ASCII Visualization Container */
    .visual-framework {
      background: ${primaryColor};
      border-radius: 8px;
      padding: 1.5rem;
      margin: 1.5rem 0;
      overflow-x: auto;
      box-shadow: 0 2px 8px rgba(33, 38, 83, 0.2);
    }

    .ascii-viz {
      color: #e8e8e8;
      font-family: 'Courier New', 'Monaco', 'Consolas', monospace;
      font-size: 0.75rem;
      line-height: 1.3;
      white-space: pre;
      margin: 0;
    }

    /* Code Block */
    .bh-code {
      background: #f8f9fa;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      padding: 1rem;
      overflow-x: auto;
      font-size: 0.9rem;
      margin: 1rem 0;
      font-family: 'Courier New', 'Monaco', 'Consolas', monospace;
    }

    /* Blockquote/Callout */
    .bh-callout {
      background: #f8f9fa;
      border-left: 4px solid ${accentColor};
      padding: 1rem 1.5rem;
      margin: 1.5rem 0;
      font-style: italic;
      color: #555;
      border-radius: 0 8px 8px 0;
    }

    .bh-callout p { margin: 0; }
    .bh-callout strong { color: ${primaryColor}; }

    /* Section Divider */
    .bh-section-divider {
      border: none;
      height: 2px;
      background: linear-gradient(to right, ${primaryColor}, ${accentColor}, ${primaryColor});
      margin: 2rem 0;
    }

    .bh-h1 {
      font-size: 2rem;
      color: ${primaryColor};
      border-bottom: 3px solid ${accentColor};
      padding-bottom: 0.5rem;
    }

    .bh-strong { color: ${primaryColor}; font-weight: 600; }

    /* Print styles for markdown elements */
    @media print {
      .visual-framework {
        background: ${primaryColor} !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .ascii-viz { color: #e8e8e8 !important; font-size: 0.65rem; }
      .bh-table th { background: ${primaryColor} !important; color: #fff !important; }
      .table-responsive { overflow: visible; box-shadow: none; }
      .bh-callout { page-break-inside: avoid; }
    }

    /* ================================================================
       OWNER REPORT ENHANCEMENT STYLES
       Added for owner-focused executive guide with cross-references
       ================================================================ */

    /* OWNER SECTION HEADERS */
    .owner-section-header {
      margin-bottom: 1.5rem;
    }

    .owner-section-header h2 {
      margin-bottom: 0.5rem;
      color: ${primaryColor};
      font-family: 'Montserrat', sans-serif;
    }

    .owner-question {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1rem;
      color: #666;
      margin: 0;
      padding-left: 0.5rem;
      border-left: 3px solid ${accentColor};
      font-family: 'Open Sans', sans-serif;
    }

    .owner-question .question-icon {
      font-size: 1.1rem;
    }

    .owner-question em {
      font-style: italic;
    }

    /* OWNER IMPLICATIONS GRID */
    .owner-implications-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin: 1.5rem 0;
    }

    .implication-card {
      background: #fff;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 1.25rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .implication-card .card-icon {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .implication-card .card-title {
      font-weight: 600;
      color: ${primaryColor};
      font-family: 'Montserrat', sans-serif;
      margin-bottom: 0.5rem;
    }

    .implication-card p {
      font-size: 0.9rem;
      color: #555;
      margin: 0;
      line-height: 1.5;
    }

    .implication-card.growth { border-top: 3px solid #28a745; }
    .implication-card.risk { border-top: 3px solid #dc3545; }
    .implication-card.value { border-top: 3px solid ${accentColor}; }

    /* FINANCIAL SUMMARY GRID */
    .financial-summary-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin: 1.5rem 0;
    }

    .financial-card {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 1.5rem;
      text-align: center;
    }

    .financial-card.highlight {
      background: linear-gradient(135deg, ${primaryColor} 0%, #2d3a7a 100%);
      color: #fff;
      border: none;
    }

    .financial-card .card-label {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #666;
      margin-bottom: 0.5rem;
    }

    .financial-card.highlight .card-label {
      color: rgba(255,255,255,0.8);
    }

    .financial-card .card-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: ${primaryColor};
      font-family: 'Montserrat', sans-serif;
    }

    .financial-card.highlight .card-value {
      color: #fff;
    }

    .financial-card .card-sublabel {
      font-size: 0.8rem;
      color: #888;
      margin-top: 0.25rem;
    }

    .financial-card.highlight .card-sublabel {
      color: rgba(255,255,255,0.7);
    }

    /* SECTION INTRO TEXT */
    .section-intro {
      font-size: 1rem;
      color: #555;
      margin-bottom: 1.5rem;
      line-height: 1.6;
    }

    /* COMPREHENSIVE REPORT REFERENCE CALLOUTS */
    .comprehensive-reference {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #f8f9fa;
      border-left: 3px solid ${accentColor};
      padding: 0.75rem 1rem;
      margin: 1rem 0;
      font-size: 0.9rem;
      font-family: 'Open Sans', sans-serif;
    }

    .comprehensive-reference .ref-icon {
      flex-shrink: 0;
      font-size: 1rem;
    }

    .comprehensive-reference .ref-text {
      color: #555;
    }

    .comprehensive-reference .ref-text strong {
      color: ${primaryColor};
    }

    .comprehensive-reference .ref-text em {
      color: ${accentColor};
      font-style: normal;
      font-weight: 500;
    }

    .comprehensive-reference.reference-missing {
      border-left-color: #dc3545;
      background: #fff5f5;
    }

    .comprehensive-reference.reference-missing .ref-text {
      color: #dc3545;
    }

    /* REPORT RELATIONSHIP NOTICE (for Comprehensive Report) */
    .report-relationship-notice {
      display: flex;
      gap: 1rem;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border: 1px solid #dee2e6;
      border-left: 4px solid ${primaryColor};
      border-radius: 0 8px 8px 0;
      padding: 1.25rem;
      margin: 1.5rem 0 2rem 0;
    }

    .report-relationship-notice .notice-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }

    .report-relationship-notice .notice-content {
      flex: 1;
    }

    .report-relationship-notice h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
      color: ${primaryColor};
      font-family: 'Montserrat', sans-serif;
    }

    .report-relationship-notice p {
      margin: 0.5rem 0 0 0;
      font-size: 0.95rem;
      color: #555;
      font-family: 'Open Sans', sans-serif;
    }

    .report-relationship-notice strong {
      color: ${primaryColor};
    }

    /* BUNDLE CONTENTS */
    .bundle-contents {
      margin-top: 2rem;
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .bundle-contents h3 {
      margin: 0 0 1rem 0;
      color: ${primaryColor};
      font-family: 'Montserrat', sans-serif;
    }

    .bundle-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .bundle-item {
      display: flex;
      flex-direction: column;
      padding: 0.75rem;
      background: #fff;
      border: 1px solid #dee2e6;
      border-radius: 4px;
    }

    .bundle-item.primary {
      border-left: 3px solid ${primaryColor};
    }

    .bundle-item strong {
      color: ${primaryColor};
      font-family: 'Montserrat', sans-serif;
    }

    .bundle-item span {
      font-size: 0.85rem;
      color: #666;
    }

    /* REFERENCE TABLE */
    .reference-table td:first-child {
      font-weight: 500;
    }

    .reference-table em {
      color: ${accentColor};
      font-style: normal;
    }

    /* RESPONSIVE ADJUSTMENTS FOR OWNER ENHANCEMENTS */
    @media (max-width: 768px) {
      .owner-implications-grid,
      .financial-summary-grid,
      .bundle-grid {
        grid-template-columns: 1fr;
      }
    }

    @media print {
      .owner-implications-grid,
      .financial-summary-grid {
        grid-template-columns: repeat(3, 1fr);
      }

      .bundle-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .financial-card.highlight {
        background: ${primaryColor} !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .comprehensive-reference {
        background: #f8f9fa !important;
        border-left-color: ${accentColor} !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .report-relationship-notice {
        background: #f8f9fa !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }

    /* ================================================================
       OWNER REPORT CHART STYLES
       Added for visual performance charts
       ================================================================ */

    .owner-charts-section {
      margin: 1.5rem 0;
      padding: 1.25rem;
      background: #fafbfc;
      border-radius: 12px;
      border: 1px solid #e9ecef;
    }

    .owner-charts-grid {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .owner-charts-grid .chart-item {
      flex: 1;
      min-width: 300px;
      max-width: 550px;
    }

    /* Import chart component styles */
    ${getReportChartStyles()}

    @media (max-width: 768px) {
      .owner-charts-grid {
        flex-direction: column;
      }

      .owner-charts-grid .chart-item {
        min-width: 100%;
        max-width: 100%;
      }
    }

    @media print {
      .owner-charts-section {
        background: #fafbfc !important;
        page-break-inside: avoid;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  `;
}
