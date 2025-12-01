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
} from './components/index.js';
import {
  getChapterIcon,
  getDimensionIcon,
  generateChapterHeaderHtml,
  generateDimensionHeaderHtml,
} from './constants/index.js';

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

  // Define sections for TOC
  const sections = [
    { id: 'executive-summary', title: 'Executive Summary' },
    { id: 'scorecard', title: 'Business Health Scorecard' },
    { id: 'strategy', title: 'Strategy & Revenue Engine' },
    { id: 'operations', title: 'Operational Excellence' },
    { id: 'financial', title: 'Financial Health' },
    { id: 'people', title: 'People & Leadership' },
    { id: 'compliance', title: 'Compliance & Sustainability' },
    { id: 'cross-dimensional', title: 'Cross-Dimensional Synthesis' },
    { id: 'strategic-recommendations', title: 'Strategic Recommendations' },
    { id: 'risks', title: 'Risk Assessment' },
    { id: 'growth', title: 'Growth Opportunities' },
    { id: 'roadmap', title: 'Implementation Roadmap' },
    { id: 'findings', title: 'Detailed Findings' },
    { id: 'quick-wins', title: 'Quick Wins' },
    { id: 'financial-impact', title: 'Financial Impact' },
    ...ctx.chapters.map(ch => ({ id: `chapter-${ch.code}`, title: ch.name })),
  ];

  // Generate narrative styles for proper markdown rendering
  const narrativeStyles = generateNarrativeStyles(options.brand.primaryColor, options.brand.accentColor);

  // Build HTML content with integrated narratives
  const contentSections = [
    generateReportHeader(ctx, reportName, 'Complete Business Health Assessment'),
    options.includeTOC ? generateTableOfContents(sections) : '',

    // Executive Summary with narrative
    `<div id="executive-summary">${generateExecutiveSummaryWithNarrative(ctx, narratives)}</div>`,

    // Scorecard with benchmark summary
    `<div id="scorecard">
      ${generateScorecardSection(ctx)}
      ${generateBenchmarkSummaryTable(ctx)}
    </div>`,

    // Tier 1 Analysis Sections with narratives and benchmark callouts
    narratives ? `
      <div id="strategy">${generateNarrativeSection('Strategy & Revenue Engine', narratives.phase1.tier1.revenueEngine, getChapterScore(ctx, 'GE'), 'GE', ctx)}</div>
      <div id="operations">${generateNarrativeSection('Operational Excellence', narratives.phase1.tier1.operationalExcellence, getChapterScore(ctx, 'PH'), 'PH', ctx)}</div>
      <div id="financial">${generateNarrativeSection('Financial Health & Strategic Position', narratives.phase1.tier1.financialStrategic, null)}</div>
      <div id="people">${generateNarrativeSection('People, Leadership & Culture', narratives.phase1.tier1.peopleLeadership, getChapterScore(ctx, 'PL'), 'PL', ctx)}</div>
      <div id="compliance">${generateNarrativeSection('Compliance & Sustainability', narratives.phase1.tier1.complianceSustainability, getChapterScore(ctx, 'RS'), 'RS', ctx)}</div>
    ` : '',

    // Cross-Dimensional Synthesis (Phase 2)
    narratives ? `
      <div id="cross-dimensional">${generateNarrativeSection('Cross-Dimensional Strategic Synthesis', narratives.phase2.crossDimensional, null)}</div>
      <div id="strategic-recommendations">${generateNarrativeSection('Strategic Recommendations', narratives.phase2.strategicRecommendations, null)}</div>
      <div id="risks">${generateNarrativeSection('Risk Assessment', narratives.phase2.consolidatedRisks, null)}</div>
      <div id="growth">${generateNarrativeSection('Growth Opportunities', narratives.phase2.growthOpportunities, null)}</div>
      <div id="roadmap">${generateNarrativeSection('Implementation Roadmap', narratives.phase2.implementationRoadmap, null)}</div>
    ` : `
      <div id="risks">${generateRisksSection(ctx)}</div>
      <div id="roadmap">${generateRoadmapSection(ctx)}</div>
    `,

    // Detailed sections
    `<div id="findings">${generateFindingsSection(ctx)}</div>`,
    `<div id="recommendations">${generateRecommendationsSection(ctx)}</div>`,
    `<div id="quick-wins">${generateQuickWinsSection(ctx)}</div>`,
    `<div id="financial-impact">${generateFinancialSection(ctx)}</div>`,

    // Chapter deep dives
    ...ctx.chapters.map(ch =>
      `<div id="chapter-${ch.code}">${generateChapterSection(ch, ctx.dimensions)}</div>`
    ),

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
 * Generate a narrative section with optional score badge and benchmark callout
 */
function generateNarrativeSection(
  title: string,
  content: string,
  score: number | null,
  chapterCode?: string,
  ctx?: ReportContext
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

    /* RESPONSIVE */
    @media (max-width: 768px) {
      .executive-highlights { grid-template-columns: repeat(2, 1fr); }
      .benchmark-callout { flex-direction: column; text-align: center; }
      .key-takeaways .takeaway-item { flex-direction: column; align-items: flex-start; }
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
  `;
}

/**
 * Estimate page count from HTML content
 */
function estimatePageCount(html: string): number {
  // Rough estimate: ~3000 characters per page
  return Math.ceil(html.length / 3000);
}
