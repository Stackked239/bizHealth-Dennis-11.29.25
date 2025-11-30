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

    // Scorecard
    `<div id="scorecard">${generateScorecardSection(ctx)}</div>`,

    // Tier 1 Analysis Sections with narratives
    narratives ? `
      <div id="strategy">${generateNarrativeSection('Strategy & Revenue Engine', narratives.phase1.tier1.revenueEngine, getChapterScore(ctx, 'GE'))}</div>
      <div id="operations">${generateNarrativeSection('Operational Excellence', narratives.phase1.tier1.operationalExcellence, getChapterScore(ctx, 'PH'))}</div>
      <div id="financial">${generateNarrativeSection('Financial Health & Strategic Position', narratives.phase1.tier1.financialStrategic, null)}</div>
      <div id="people">${generateNarrativeSection('People, Leadership & Culture', narratives.phase1.tier1.peopleLeadership, getChapterScore(ctx, 'PL'))}</div>
      <div id="compliance">${generateNarrativeSection('Compliance & Sustainability', narratives.phase1.tier1.complianceSustainability, getChapterScore(ctx, 'RS'))}</div>
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
 * Generate a narrative section with optional score badge
 */
function generateNarrativeSection(title: string, content: string, score: number | null): string {
  const narrativeHtml = NarrativeExtractionService.markdownToHtml(content);

  return `
    <section class="section page-break">
      <div class="section-header">
        <h2>${escapeHtml(title)}</h2>
        ${score !== null ? `<span class="section-score">${score}/100</span>` : ''}
      </div>
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
 * Generate CSS styles for narrative content
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
  `;
}

/**
 * Estimate page count from HTML content
 */
function estimatePageCount(html: string): number {
  // Rough estimate: ~3000 characters per page
  return Math.ceil(html.length / 3000);
}
