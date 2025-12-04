/**
 * Comprehensive Assessment Report Builder
 *
 * Generates a full assessment report with all sections:
 * - Executive Summary with AI-generated narrative
 * - Health Scorecard
 * - Dimension Analysis with Tier 1 & Tier 2 narratives
 * - Strategic Synthesis (cross-dimensional analysis)
 * - Findings
 * - Recommendations
 * - Risks
 * - Roadmap
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import type { ReportContext, ReportRenderOptions, GeneratedReport, ReportMeta } from '../../types/report.types.js';
import {
  wrapHtmlDocument,
  generateReportHeader,
  generateReportFooter,
  generateScorecardSection,
  generateFindingsSection,
  generateRecommendationsSection,
  generateQuickWinsSection,
  generateRisksSection,
  generateRoadmapSection,
  generateChapterSection,
  generateFinancialSection,
  generateTableOfContents,
  escapeHtml,
  getTrajectoryIcon,
} from './html-template.js';
import { NarrativeExtractionService } from '../../services/narrative-extraction.service.js';
import { logger } from '../../utils/logger.js';

// Import visual enhancement components
import {
  generateKeyTakeaways,
  generateExecutiveHighlights,
  generateEvidenceCitationsForDimension,
  generateInsightCardWithEvidence,
  generateChapterBenchmarkCallout,
  generateOverallBenchmarkCallout,
  generateBenchmarkSummaryTable,
  renderComprehensiveRelationshipStatement,
  buildLegalTermsPage,
} from './components/index.js';
import {
  getChapterIcon,
  getDimensionIcon,
  generateChapterHeaderHtml,
  generateDimensionHeaderHtml,
} from './constants/index.js';

// Import chart integration for visual charts
import {
  generateChapterOverviewRadar,
  generateAllChapterScoreBars,
  generateScoreBandDistribution,
  generateBenchmarkComparison,
  generateChapterDimensionBars,
  getReportChartStyles,
} from './charts/index.js';

/**
 * Build comprehensive assessment report with integrated narrative content
 */
export async function buildComprehensiveReport(
  ctx: ReportContext,
  options: ReportRenderOptions
): Promise<GeneratedReport> {
  const reportType = 'comprehensive';
  const reportName = 'Comprehensive Assessment Report';

  logger.info('Building comprehensive report with narrative integration');

  // Get narrative content from context
  const narratives = ctx.narrativeContent;
  const hasNarratives = narratives && narratives.metadata?.contentSufficient;

  if (!hasNarratives) {
    logger.warn('No narrative content available, using structured data only');
  }

  // Define sections for TOC with anchor IDs matching section-mapping.ts
  const sections = [
    { id: 'executive-summary', title: 'Executive Summary' },
    { id: 'scorecard', title: 'Business Health Scorecard' },
    { id: 'chapter-growth-engine', title: 'Chapter 1: Growth Engine Deep Dive' },
    { id: 'chapter-performance-health', title: 'Chapter 2: Performance & Health Deep Dive' },
    { id: 'chapter-people-leadership', title: 'Chapter 3: People & Leadership Deep Dive' },
    { id: 'chapter-resilience-safeguards', title: 'Chapter 4: Resilience & Safeguards Deep Dive' },
    { id: 'cross-dimensional', title: 'Cross-Dimensional Synthesis' },
    { id: 'strategic-recommendations', title: 'Strategic Recommendations' },
    { id: 'risk-assessment', title: 'Risk Assessment' },
    { id: 'growth', title: 'Growth Opportunities' },
    { id: 'implementation-roadmap', title: 'Implementation Roadmap' },
    { id: 'findings', title: 'Detailed Findings' },
    { id: 'quick-wins', title: 'Quick Wins' },
    { id: 'financial-impact', title: 'Financial Impact Analysis' },
  ];

  // Generate narrative styles for proper markdown rendering
  const narrativeStyles = generateNarrativeStyles(options.brand.primaryColor, options.brand.accentColor);

  // Generate charts asynchronously
  logger.info('Generating visual charts for comprehensive report');
  const [
    chapterOverviewRadar,
    chapterScoreBars,
    scoreBandDistribution,
    benchmarkComparison,
    geDimensionBars,
    phDimensionBars,
    plDimensionBars,
    rsDimensionBars,
  ] = await Promise.all([
    generateChapterOverviewRadar(ctx).catch(() => ''),
    generateAllChapterScoreBars(ctx).catch(() => ''),
    generateScoreBandDistribution(ctx).catch(() => ''),
    generateBenchmarkComparison(ctx).catch(() => ''),
    generateChapterDimensionBars(ctx, 'GE').catch(() => ''),
    generateChapterDimensionBars(ctx, 'PH').catch(() => ''),
    generateChapterDimensionBars(ctx, 'PL').catch(() => ''),
    generateChapterDimensionBars(ctx, 'RS').catch(() => ''),
  ]);

  // Map chapter codes to their dimension bar charts
  const chapterDimensionCharts: Record<string, string> = {
    'GE': geDimensionBars,
    'PH': phDimensionBars,
    'PL': plDimensionBars,
    'RS': rsDimensionBars,
  };

  // Build HTML content with integrated narratives
  const contentSections = [
    generateReportHeader(ctx, reportName, 'Complete Business Health Assessment'),

    // Legal Terms & Disclaimers (Page 2)
    buildLegalTermsPage({
      companyName: ctx.companyProfile.name,
      reportId: ctx.runId,
      generatedAt: new Date(ctx.metadata.generatedAt),
      variant: 'comprehensive',
    }),

    // Relationship statement explaining how Owner's and Comprehensive reports work together
    renderComprehensiveRelationshipStatement(),

    options.includeTOC ? generateTableOfContents(sections) : '',

    // Executive Summary with narrative (with anchor ID for cross-references)
    `<section id="executive-summary" class="section">${generateExecutiveSummaryWithNarrative(ctx, narratives)}</section>`,

    // Scorecard with visual charts and benchmark summary
    `<section id="scorecard" class="section page-break">
      ${generateScorecardSection(ctx)}

      <!-- Visual Charts Dashboard -->
      <div class="scorecard-charts">
        <h3 style="color: ${options.brand.primaryColor}; margin: 2rem 0 1rem 0; font-family: 'Montserrat', sans-serif;">Visual Performance Overview</h3>
        <div class="chart-dashboard">
          <div class="chart-row">
            <div class="chart-main">${chapterOverviewRadar}</div>
            <div class="chart-side">${scoreBandDistribution}</div>
          </div>
          <div class="chart-full">${chapterScoreBars}</div>
          ${benchmarkComparison ? `<div class="chart-full">${benchmarkComparison}</div>` : ''}
        </div>
      </div>

      ${generateBenchmarkSummaryTable(ctx)}
    </section>`,

    // Chapter Deep Dives with proper anchor IDs matching section-mapping.ts (now with dimension charts)
    narratives ? `
      <section id="chapter-growth-engine" class="section page-break">${generateNarrativeSection('Chapter 1: Growth Engine Deep Dive', narratives.phase1.tier1.revenueEngine, getChapterScore(ctx, 'GE'), 'GE', ctx, chapterDimensionCharts['GE'])}</section>
      <section id="chapter-performance-health" class="section page-break">${generateNarrativeSection('Chapter 2: Performance & Health Deep Dive', narratives.phase1.tier1.operationalExcellence, getChapterScore(ctx, 'PH'), 'PH', ctx, chapterDimensionCharts['PH'])}</section>
      <section id="chapter-people-leadership" class="section page-break">${generateNarrativeSection('Chapter 3: People & Leadership Deep Dive', narratives.phase1.tier1.peopleLeadership, getChapterScore(ctx, 'PL'), 'PL', ctx, chapterDimensionCharts['PL'])}</section>
      <section id="chapter-resilience-safeguards" class="section page-break">${generateNarrativeSection('Chapter 4: Resilience & Safeguards Deep Dive', narratives.phase1.tier1.complianceSustainability, getChapterScore(ctx, 'RS'), 'RS', ctx, chapterDimensionCharts['RS'])}</section>
    ` : '',

    // Cross-Dimensional Synthesis (Phase 2)
    narratives ? `
      <section id="cross-dimensional" class="section page-break">${generateNarrativeSection('Cross-Dimensional Strategic Synthesis', narratives.phase2.crossDimensional, null)}</section>
      <section id="strategic-recommendations" class="section page-break">${generateNarrativeSection('Strategic Recommendations', narratives.phase2.strategicRecommendations, null)}</section>
      <section id="risk-assessment" class="section page-break">${generateNarrativeSection('Risk Assessment', narratives.phase2.consolidatedRisks, null)}</section>
      <section id="growth" class="section page-break">${generateNarrativeSection('Growth Opportunities', narratives.phase2.growthOpportunities, null)}</section>
      <section id="implementation-roadmap" class="section page-break">${generateNarrativeSection('Implementation Roadmap', narratives.phase2.implementationRoadmap, null)}</section>
    ` : `
      <section id="risk-assessment" class="section page-break">${generateRisksSection(ctx)}</section>
      <section id="implementation-roadmap" class="section page-break">${generateRoadmapSection(ctx)}</section>
    `,

    // Detailed sections
    `<section id="findings" class="section page-break">${generateFindingsSection(ctx)}</section>`,
    `<section id="recommendations" class="section page-break">${generateRecommendationsSection(ctx)}</section>`,
    `<section id="quick-wins" class="section page-break">${generateQuickWinsSection(ctx)}</section>`,
    `<section id="financial-impact" class="section page-break">${generateFinancialSection(ctx)}</section>`,

    // Footer with word count
    generateReportFooterWithStats(ctx, narratives),
  ];

  const html = wrapHtmlDocument(contentSections.join('\n'), {
    title: `${reportName} - ${ctx.companyProfile.name}`,
    brand: options.brand,
    customCSS: narrativeStyles,
  });

  // Write HTML file
  const htmlPath = path.join(options.outputDir, `${reportType}.html`);
  await fs.writeFile(htmlPath, html, 'utf-8');

  // Generate metadata
  const meta: ReportMeta = {
    reportType: 'comprehensive',
    reportName,
    generatedAt: new Date().toISOString(),
    companyName: ctx.companyProfile.name,
    runId: ctx.runId,
    healthScore: ctx.overallHealth.score,
    healthBand: ctx.overallHealth.band,
    pageSuggestionEstimate: estimatePageCount(html),
    sections,
    brand: {
      primaryColor: options.brand.primaryColor,
      accentColor: options.brand.accentColor,
    },
  };

  const metaPath = path.join(options.outputDir, `${reportType}.meta.json`);
  await fs.writeFile(metaPath, JSON.stringify(meta, null, 2), 'utf-8');

  logger.info({
    contentWords: narratives?.metadata?.totalWords || 0,
    overallScore: ctx.overallHealth.score
  }, 'Comprehensive report built');

  return {
    reportType: 'comprehensive',
    reportName,
    htmlPath,
    metaPath,
    generatedAt: meta.generatedAt,
  };
}

/**
 * Generate executive summary with integrated narrative content
 */
function generateExecutiveSummaryWithNarrative(ctx: ReportContext, narratives: any): string {
  const { overallHealth, executiveSummary, keyImperatives } = ctx;
  const narrativeHtml = narratives?.phase3?.executive
    ? NarrativeExtractionService.markdownToHtml(narratives.phase3.executive)
    : '';

  // Generate Key Takeaways box
  const keyTakeawaysHtml = generateKeyTakeaways(ctx);

  // Generate executive highlights
  const executiveHighlightsHtml = generateExecutiveHighlights(ctx);

  // Generate overall benchmark callout
  const overallBenchmarkHtml = generateOverallBenchmarkCallout(ctx);

  return `
    <section class="section">
      <div class="section-header">
        <h2>Executive Summary</h2>
      </div>

      <div class="health-score-display">
        <div class="health-score-circle">
          <span class="score">${overallHealth.score}</span>
          <span class="out-of">/ 100</span>
        </div>
        <div class="health-score-details">
          <p class="status">${escapeHtml(overallHealth.status)}</p>
          <p class="trajectory">
            ${getTrajectoryIcon(overallHealth.trajectory)}
            Trajectory: ${overallHealth.trajectory}
          </p>
          <p class="band">
            <span class="band-badge ${overallHealth.band}">${overallHealth.band}</span>
          </p>
        </div>
      </div>

      <!-- Executive Highlights Summary -->
      ${executiveHighlightsHtml}

      <!-- Key Takeaways Box -->
      ${keyTakeawaysHtml}

      <!-- Overall Benchmark Callout -->
      ${overallBenchmarkHtml}

      ${narrativeHtml ? `
        <div class="narrative-content">
          ${narrativeHtml}
        </div>
      ` : executiveSummary ? `
        <div class="mb-3">
          <p>${escapeHtml(executiveSummary.overview)}</p>
        </div>
        <div class="grid grid-2">
          <div class="card">
            <h4>Key Strengths</h4>
            <ul>
              ${executiveSummary.keyStrengths.map(s => `<li>${escapeHtml(s)}</li>`).join('')}
            </ul>
          </div>
          <div class="card">
            <h4>Priority Areas</h4>
            <ul>
              ${executiveSummary.keyPriorities.map(p => `<li>${escapeHtml(p)}</li>`).join('')}
            </ul>
          </div>
        </div>
      ` : ''}

      ${keyImperatives.length > 0 ? `
        <div class="callout warning mt-3">
          <div class="title">Strategic Imperatives</div>
          <ul>
            ${keyImperatives.map(i => `<li>${escapeHtml(i)}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    </section>
  `;
}

/**
 * Generate a narrative section with optional score badge, benchmark callout, and chart
 */
function generateNarrativeSection(
  title: string,
  content: string,
  score: number | null,
  chapterCode?: string,
  ctx?: ReportContext,
  chartHtml?: string
): string {
  const narrativeHtml = NarrativeExtractionService.markdownToHtml(content);

  // Generate chapter header with icon if chapter code provided
  let headerHtml: string;
  if (chapterCode) {
    headerHtml = generateChapterHeaderHtml(
      chapterCode,
      title,
      score ?? undefined,
      ctx?.companyProfile?.industry ? `${ctx.companyProfile.industry} Industry Analysis` : undefined
    );
  } else {
    headerHtml = `
      <div class="section-header">
        <h2>${escapeHtml(title)}</h2>
        ${score !== null ? `<span class="section-score">${score}/100</span>` : ''}
      </div>
    `;
  }

  // Generate benchmark callout for chapters
  let benchmarkHtml = '';
  if (chapterCode && ctx) {
    const chapter = ctx.chapters.find(ch => ch.code === chapterCode);
    if (chapter) {
      benchmarkHtml = generateChapterBenchmarkCallout(chapter, ctx.companyProfile.industry);
    }
  }

  return `
    <section class="section page-break">
      ${headerHtml}
      ${benchmarkHtml}
      ${chartHtml ? `
        <div class="chapter-dimension-chart">
          <h4 style="font-size: 0.95rem; color: #666; margin: 1.5rem 0 1rem 0;">Dimension Score Breakdown</h4>
          ${chartHtml}
        </div>
      ` : ''}
      <div class="narrative-content">
        ${narrativeHtml}
      </div>
    </section>
  `;
}

/**
 * Get chapter score by chapter code
 */
function getChapterScore(ctx: ReportContext, chapterCode: string): number | null {
  const chapter = ctx.chapters.find(ch => ch.code === chapterCode);
  return chapter ? chapter.score : null;
}

/**
 * Generate report footer with statistics
 */
function generateReportFooterWithStats(ctx: ReportContext, narratives: any): string {
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

/**
 * Generate CSS styles for narrative content and visual enhancements
 */
function generateNarrativeStyles(primaryColor: string, accentColor: string): string {
  return `
    /* Narrative Content Styles */
    .narrative-content {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin-top: 1rem;
      border-left: 4px solid ${accentColor};
    }

    .section-score {
      background: ${primaryColor};
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 1rem;
      font-weight: 600;
    }

    .narrative-content .bh-h2 {
      font-size: 1.5rem;
      color: ${primaryColor};
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      border-bottom: 2px solid ${accentColor};
      padding-bottom: 0.5rem;
    }

    .narrative-content .bh-h3 {
      font-size: 1.25rem;
      color: ${primaryColor};
      margin-top: 1.25em;
      margin-bottom: 0.5em;
    }

    .narrative-content .bh-h4 {
      font-size: 1.1rem;
      color: #555;
      margin-top: 1em;
      margin-bottom: 0.5em;
    }

    .narrative-content .bh-h5 {
      font-size: 1rem;
      color: #666;
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

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
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

    /* CHAPTER HEADER ENHANCEMENTS */
    .chapter-header-enhanced {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 3px solid ${accentColor};
    }

    .chapter-icon {
      width: 50px;
      height: 50px;
      border-radius: 10px;
      background: linear-gradient(135deg, ${primaryColor} 0%, #2a3366 100%);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      box-shadow: 0 2px 8px rgba(33, 38, 83, 0.3);
    }

    .chapter-title-group { flex: 1; }

    .chapter-title-group h2 {
      margin: 0;
      font-size: 1.75rem;
      color: ${primaryColor};
      page-break-before: auto;
    }

    .chapter-subtitle {
      font-size: 0.9rem;
      color: #666;
      margin-top: 0.25rem;
    }

    /* DIMENSION HEADER */
    .dimension-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .dimension-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: ${primaryColor};
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
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

    /* SCORE BAR ENHANCEMENTS */
    .score-bar-container {
      background: #e9ecef;
      border-radius: 12px;
      height: 24px;
      overflow: hidden;
      margin: 0.5rem 0;
    }

    .score-bar-fill {
      height: 100%;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 0.75rem;
      color: #fff;
      font-size: 0.8rem;
      font-weight: 600;
      transition: width 0.3s ease;
    }

    .score-bar-fill.critical { background: linear-gradient(90deg, #dc3545, #e4606d); }
    .score-bar-fill.attention { background: linear-gradient(90deg, #ffc107, #ffcd39); color: #333; }
    .score-bar-fill.proficiency { background: linear-gradient(90deg, ${accentColor}, #b0ad2e); }
    .score-bar-fill.excellence { background: linear-gradient(90deg, #28a745, #34ce57); }

    /* FINDINGS GRID LAYOUT */
    .findings-grid {
      margin-top: 1rem;
    }

    .insight-cards-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .insight-cards-container .insight-card {
      margin: 0;
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

      .chapter-icon, .dimension-icon {
        background: ${primaryColor} !important;
      }

      .executive-highlights { grid-template-columns: repeat(4, 1fr); }
    }

    /* ================================================================
       OPUS 4.5 MARKDOWN ELEMENT STYLING
       Added 2025-12-02 to support rich markdown output (tables, ASCII art, etc.)
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
      white-space: nowrap;
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

    .bh-table tr:hover {
      background: #f0f4f8;
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
      overflow-x: auto;
    }

    /* Regular Code Block */
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

    .bh-code code {
      background: transparent;
      padding: 0;
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

    .bh-callout p {
      margin: 0;
    }

    .bh-callout strong {
      color: ${primaryColor};
    }

    /* Section Divider */
    .bh-section-divider {
      border: none;
      height: 2px;
      background: linear-gradient(to right, ${primaryColor}, ${accentColor}, ${primaryColor});
      margin: 2rem 0;
    }

    /* Typography - ensure consistency */
    .bh-h1 {
      font-size: 2rem;
      color: ${primaryColor};
      margin-top: 2em;
      margin-bottom: 0.75em;
      font-weight: 700;
      font-family: 'Montserrat', 'Open Sans', Arial, sans-serif;
      border-bottom: 3px solid ${accentColor};
      padding-bottom: 0.5rem;
    }

    .bh-strong {
      color: ${primaryColor};
      font-weight: 600;
    }

    /* Print styles for markdown elements */
    @media print {
      .visual-framework {
        background: ${primaryColor} !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        page-break-inside: avoid;
      }

      .ascii-viz {
        color: #e8e8e8 !important;
        font-size: 0.65rem;
      }

      .bh-table th {
        background: ${primaryColor} !important;
        color: #fff !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .bh-table tr:nth-child(even) {
        background: #f8f9fa !important;
      }

      .table-responsive {
        overflow: visible;
        box-shadow: none;
      }

      .bh-section-divider {
        background: ${primaryColor} !important;
      }

      .bh-callout {
        border-left-color: ${accentColor} !important;
        page-break-inside: avoid;
      }

      .bh-code {
        page-break-inside: avoid;
      }
    }

    /* ================================================================
       CHART DASHBOARD STYLES
       Added for server-side rendered Chart.js visualizations
       ================================================================ */

    .scorecard-charts {
      margin: 2rem 0;
      padding: 1.5rem;
      background: #fafbfc;
      border-radius: 12px;
      border: 1px solid #e9ecef;
    }

    .chart-dashboard {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .chart-row {
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .chart-main {
      flex: 2;
      min-width: 350px;
    }

    .chart-side {
      flex: 1;
      min-width: 280px;
    }

    .chart-full {
      width: 100%;
    }

    .chapter-dimension-chart {
      margin: 1.5rem 0;
      padding: 1rem;
      background: #fff;
      border-radius: 8px;
      border: 1px solid #e9ecef;
    }

    /* Import chart component styles */
    ${getReportChartStyles()}

    @media (max-width: 768px) {
      .chart-row {
        flex-direction: column;
      }

      .chart-main,
      .chart-side {
        min-width: 100%;
      }
    }

    @media print {
      .scorecard-charts {
        background: #fafbfc !important;
        page-break-inside: avoid;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .chart-dashboard {
        page-break-inside: avoid;
      }

      .chapter-dimension-chart {
        page-break-inside: avoid;
      }
    }
  `;
}

/**
 * Estimate page count from HTML content
 */
function estimatePageCount(html: string): number {
  // Rough estimate: ~3000 characters per page
  return Math.ceil(html.length / 3000);
}
