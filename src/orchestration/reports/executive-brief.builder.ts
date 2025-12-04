/**
 * Executive Brief Builder
 *
 * Generates a one-page executive overview with:
 * - Health score and status
 * - Key metrics dashboard
 * - Critical actions
 * - Contact to action
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import type { ReportContext, ReportRenderOptions, GeneratedReport, ReportMeta } from '../../types/report.types.js';
import {
  wrapHtmlDocument,
  generateReportFooter,
  escapeHtml,
  getTrajectoryIcon,
} from './html-template.js';

// Import chart integration for visual charts
import {
  generateHealthScoreGauge,
  generateAllChapterScoreBars,
  getReportChartStyles,
} from './charts/index.js';

// Import legal terms component
import { buildLegalTermsPage } from './components/index.js';

/**
 * Build executive brief
 */
export async function buildExecutiveBrief(
  ctx: ReportContext,
  options: ReportRenderOptions
): Promise<GeneratedReport> {
  const reportType = 'executiveBrief';
  const reportName = 'Executive Brief';

  // Get top items
  const topStrengths = ctx.findings.filter(f => f.type === 'strength').slice(0, 2);
  const topPriorities = ctx.findings.filter(f => f.type === 'gap' || f.type === 'risk').slice(0, 2);
  const criticalActions = ctx.recommendations.slice(0, 3);

  // Generate visual charts asynchronously
  const [healthGauge, chapterBars] = await Promise.all([
    generateHealthScoreGauge(ctx, { width: 200, height: 120 }).catch(() => ''),
    generateAllChapterScoreBars(ctx, { width: 600, height: 180 }).catch(() => ''),
  ]);

  const html = wrapHtmlDocument(`
    <style>
      .executive-brief {
        max-width: 800px;
        margin: 0 auto;
      }

      .brief-header {
        text-align: center;
        padding: 1.5rem 0;
        border-bottom: 3px solid ${options.brand.primaryColor};
        margin-bottom: 1.5rem;
      }

      .brief-header h1 {
        font-size: 1.75rem;
        margin-bottom: 0.25rem;
      }

      .brief-header .company {
        font-size: 1.25rem;
        color: ${options.brand.accentColor};
      }

      .brief-header .date {
        font-size: 0.85rem;
        color: #888;
      }

      .score-hero {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 2rem;
        padding: 1.5rem;
        background: linear-gradient(135deg, ${options.brand.primaryColor} 0%, ${options.brand.primaryColor}dd 100%);
        border-radius: 12px;
        color: #fff;
        margin-bottom: 1.5rem;
      }

      .score-hero .score-circle {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background: rgba(255,255,255,0.15);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 4px solid rgba(255,255,255,0.5);
      }

      .score-hero .score-value {
        font-size: 2.5rem;
        font-weight: 700;
        line-height: 1;
      }

      .score-hero .score-label {
        font-size: 0.8rem;
        opacity: 0.9;
      }

      .score-hero .score-details {
        text-align: left;
      }

      .score-hero .status {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 0.25rem;
      }

      .score-hero .trajectory {
        font-size: 0.95rem;
        opacity: 0.9;
      }

      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .metric-box {
        text-align: center;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 8px;
        border-left: 3px solid ${options.brand.accentColor};
      }

      .metric-box .value {
        font-size: 1.5rem;
        font-weight: 700;
        color: ${options.brand.primaryColor};
      }

      .metric-box .label {
        font-size: 0.75rem;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .two-column {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .brief-section h3 {
        font-size: 1rem;
        color: ${options.brand.primaryColor};
        margin-bottom: 0.75rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid ${options.brand.accentColor};
      }

      .brief-section ul {
        margin: 0;
        padding-left: 1.25rem;
      }

      .brief-section li {
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
      }

      .actions-section {
        background: #fff3cd;
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid #ffc107;
        margin-bottom: 1.5rem;
      }

      .actions-section h3 {
        color: #856404;
        margin-bottom: 0.75rem;
        font-size: 1rem;
      }

      .actions-section ol {
        margin: 0;
        padding-left: 1.25rem;
      }

      .actions-section li {
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
      }

      .cta-section {
        text-align: center;
        padding: 1rem;
        background: ${options.brand.primaryColor};
        color: #fff;
        border-radius: 8px;
      }

      .cta-section p {
        margin: 0;
        font-size: 0.9rem;
      }

      @media print {
        .executive-brief {
          max-width: none;
        }
      }

      /* Chart styles */
      ${getReportChartStyles()}

      .executive-charts {
        display: flex;
        justify-content: center;
        gap: 1.5rem;
        margin: 1.5rem 0;
        flex-wrap: wrap;
      }

      .executive-charts .chart-wrapper {
        flex: 1;
        min-width: 300px;
        max-width: 600px;
      }
    </style>

    <div class="executive-brief">
      <header class="brief-header">
        <h1>Business Health Executive Brief</h1>
        <p class="company">${escapeHtml(ctx.companyProfile.name)}</p>
        <p class="date">${new Date(ctx.metadata.generatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </header>

      <!-- Legal Terms & Disclaimers (Page 2) -->
      ${buildLegalTermsPage({
        companyName: ctx.companyProfile.name,
        reportId: ctx.runId,
        generatedAt: new Date(ctx.metadata.generatedAt),
        variant: 'executive',
      })}

      <div class="score-hero">
        <div class="score-circle">
          <span class="score-value">${ctx.overallHealth.score}</span>
          <span class="score-label">/ 100</span>
        </div>
        <div class="score-details">
          <p class="status">${escapeHtml(ctx.overallHealth.status)}</p>
          <p class="trajectory">
            ${getTrajectoryIcon(ctx.overallHealth.trajectory)} Trajectory: ${ctx.overallHealth.trajectory}
          </p>
          <p><span class="band-badge ${ctx.overallHealth.band}">${ctx.overallHealth.band}</span></p>
        </div>
      </div>

      <div class="metrics-grid">
        ${ctx.chapters.map(ch => `
          <div class="metric-box">
            <div class="value">${ch.score}</div>
            <div class="label">${escapeHtml(ch.name)}</div>
          </div>
        `).join('')}
      </div>

      ${chapterBars ? `
        <div class="executive-charts">
          <div class="chart-wrapper">
            ${chapterBars}
          </div>
        </div>
      ` : ''}

      <div class="two-column">
        <div class="brief-section">
          <h3>Key Strengths</h3>
          <ul>
            ${topStrengths.map(s => `<li>${escapeHtml(s.shortLabel)}</li>`).join('')}
            ${topStrengths.length === 0 ? '<li>Review full assessment for details</li>' : ''}
          </ul>
        </div>
        <div class="brief-section">
          <h3>Priority Areas</h3>
          <ul>
            ${topPriorities.map(p => `<li>${escapeHtml(p.shortLabel)}</li>`).join('')}
            ${topPriorities.length === 0 ? '<li>Review full assessment for details</li>' : ''}
          </ul>
        </div>
      </div>

      <div class="actions-section">
        <h3>Critical Actions Required</h3>
        <ol>
          ${criticalActions.map(a => `<li><strong>${escapeHtml(a.theme)}</strong> (${escapeHtml(a.horizonLabel)})</li>`).join('')}
        </ol>
      </div>

      ${ctx.keyImperatives.length > 0 ? `
        <div class="brief-section" style="margin-bottom: 1.5rem;">
          <h3>Strategic Imperatives</h3>
          <ul>
            ${ctx.keyImperatives.slice(0, 3).map(i => `<li>${escapeHtml(i)}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <div class="cta-section">
        <p><strong>Next Step:</strong> Review the full Comprehensive Assessment Report for detailed analysis and implementation guidance.</p>
      </div>

      ${generateReportFooter(ctx)}
    </div>
  `, {
    title: `${reportName} - ${ctx.companyProfile.name}`,
    brand: options.brand,
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
    pageSuggestionEstimate: 1,
    sections: [
      { id: 'score', title: 'Health Score' },
      { id: 'metrics', title: 'Key Metrics' },
      { id: 'actions', title: 'Critical Actions' },
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
