/**
 * Comprehensive Assessment Report Builder
 *
 * Generates a full assessment report with all sections:
 * - Executive Summary
 * - Health Scorecard
 * - Chapter Analysis
 * - Dimension Details
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
  generateExecutiveSummarySection,
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
} from './html-template.js';

/**
 * Build comprehensive assessment report
 */
export async function buildComprehensiveReport(
  ctx: ReportContext,
  options: ReportRenderOptions
): Promise<GeneratedReport> {
  const reportType = 'comprehensive';
  const reportName = 'Comprehensive Assessment Report';

  // Define sections for TOC
  const sections = [
    { id: 'executive-summary', title: 'Executive Summary' },
    { id: 'scorecard', title: 'Business Health Scorecard' },
    { id: 'findings', title: 'Key Findings' },
    { id: 'recommendations', title: 'Strategic Recommendations' },
    { id: 'quick-wins', title: 'Quick Wins' },
    { id: 'risks', title: 'Risk Assessment' },
    { id: 'roadmap', title: 'Implementation Roadmap' },
    { id: 'financial', title: 'Financial Impact' },
    ...ctx.chapters.map(ch => ({ id: `chapter-${ch.code}`, title: ch.name })),
  ];

  // Build HTML content
  const contentSections = [
    generateReportHeader(ctx, reportName, 'Complete Business Health Assessment'),
    options.includeTOC ? generateTableOfContents(sections) : '',
    `<div id="executive-summary">${generateExecutiveSummarySection(ctx)}</div>`,
    `<div id="scorecard">${generateScorecardSection(ctx)}</div>`,
    `<div id="findings">${generateFindingsSection(ctx)}</div>`,
    `<div id="recommendations">${generateRecommendationsSection(ctx)}</div>`,
    `<div id="quick-wins">${generateQuickWinsSection(ctx)}</div>`,
    `<div id="risks">${generateRisksSection(ctx)}</div>`,
    `<div id="roadmap">${generateRoadmapSection(ctx)}</div>`,
    `<div id="financial">${generateFinancialSection(ctx)}</div>`,
    // Chapter deep dives
    ...ctx.chapters.map(ch =>
      `<div id="chapter-${ch.code}">${generateChapterSection(ch, ctx.dimensions)}</div>`
    ),
    generateReportFooter(ctx),
  ];

  const html = wrapHtmlDocument(contentSections.join('\n'), {
    title: `${reportName} - ${ctx.companyProfile.name}`,
    brand: options.brand,
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

  return {
    reportType: 'comprehensive',
    reportName,
    htmlPath,
    metaPath,
    generatedAt: meta.generatedAt,
  };
}

/**
 * Estimate page count from HTML content
 */
function estimatePageCount(html: string): number {
  // Rough estimate: ~3000 characters per page
  return Math.ceil(html.length / 3000);
}
