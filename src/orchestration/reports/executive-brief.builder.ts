/**
 * Executive Brief Report Builder
 * Generates premium stakeholder dashboard
 *
 * Target Audience: Shareholders, Board, Advisory Board, Mentors
 * Format: 2-3 page high-density dashboard
 * Visualizations: 10-12 SVG charts
 *
 * This builder transforms the Executive Brief from a simple one-page overview
 * into a premium $20,000+ stakeholder dashboard with:
 * - Health score gauge with benchmark comparison
 * - Chapter KPI tiles with trend indicators
 * - 12-dimension radar chart
 * - Dimension heatmap scorecard
 * - 90-day roadmap timeline
 * - Investment allocation donut chart
 * - Risk assessment table
 * - AI-generated executive narrative
 * - Collapsible legal terms (at end)
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import type { ReportContext, ReportRenderOptions, GeneratedReport, ReportMeta } from '../../types/report.types.js';
import { generateExecutiveDashboard } from './components/executive/dashboard-layout.component.js';

/**
 * Build executive brief with premium dashboard layout
 *
 * @param ctx - Report context with all company and assessment data
 * @param options - Render options including output directory and brand
 * @returns Generated report metadata
 */
export async function buildExecutiveBrief(
  ctx: ReportContext,
  options: ReportRenderOptions
): Promise<GeneratedReport> {
  const reportType = 'executiveBrief';
  const reportName = 'Executive Brief';

  // Generate the complete dashboard HTML using the new premium layout
  const html = generateExecutiveDashboard(ctx);

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
    pageSuggestionEstimate: 3, // Updated from 1 to 3 pages
    sections: [
      { id: 'hero', title: 'Executive Summary & Health Score' },
      { id: 'kpi', title: 'Chapter Performance KPIs' },
      { id: 'analytics', title: 'Dimension Analysis (Radar & Heatmap)' },
      { id: 'insights', title: 'Strategic Insights' },
      { id: 'quickwins', title: '90-Day Quick Wins' },
      { id: 'roadmap', title: 'Implementation Roadmap' },
      { id: 'investment-risk', title: 'Investment & Risk Summary' },
      { id: 'legal', title: 'Legal Terms & Disclaimers' },
    ],
    brand: {
      primaryColor: options.brand.primaryColor,
      accentColor: options.brand.accentColor,
    },
  };

  const metaPath = path.join(options.outputDir, `${reportType}.meta.json`);
  await fs.writeFile(metaPath, JSON.stringify(meta, null, 2), 'utf-8');

  return {
    reportType: 'executiveBrief',
    reportName,
    htmlPath,
    metaPath,
    generatedAt: meta.generatedAt,
  };
}

export default buildExecutiveBrief;
