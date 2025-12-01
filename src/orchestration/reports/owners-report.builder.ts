/**
 * Business Owner Report Builder
 *
 * Generates an executive summary report for business owners including:
 * - Executive overview with AI-generated narrative content
 * - Health score and trajectory
 * - Priority actions with AI analysis
 * - Strategic recommendations
 * - Key risks to address
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

/**
 * Build business owner report with integrated narrative content
 */
export async function buildOwnersReport(
  ctx: ReportContext,
  options: ReportRenderOptions
): Promise<GeneratedReport> {
  const reportType = 'owner';
  const reportName = 'Business Owner Report';

  logger.info('Building owners report with narrative integration');

  // Get narrative content from context
  const narratives = ctx.narrativeContent;
  const hasNarratives = narratives && narratives.metadata?.contentSufficient;

  // Get top 3 strengths and priorities
  const strengths = ctx.findings.filter(f => f.type === 'strength').slice(0, 3);
  const priorities = ctx.findings.filter(f => f.type === 'gap' || f.type === 'risk').slice(0, 3);
  const topRecommendations = ctx.recommendations.slice(0, 5);
  const quickWins = ctx.quickWins.slice(0, 3);

  // Generate narrative CSS styles
  const narrativeStyles = generateOwnerNarrativeStyles(options.brand.primaryColor, options.brand.accentColor);

  const html = wrapHtmlDocument(`
    ${generateReportHeader(ctx, reportName, 'Executive Summary for Business Leadership')}

    <section class="section">
      <h2>Your Business Health at a Glance</h2>

      <div class="health-score-display">
        <div class="health-score-circle">
          <span class="score">${ctx.overallHealth.score}</span>
          <span class="out-of">/ 100</span>
        </div>
        <div class="health-score-details">
          <p class="status">${escapeHtml(ctx.overallHealth.status)}</p>
          <p class="trajectory">
            ${getTrajectoryIcon(ctx.overallHealth.trajectory)}
            Trajectory: ${ctx.overallHealth.trajectory}
          </p>
          <p class="band">
            <span class="band-badge ${ctx.overallHealth.band}">${ctx.overallHealth.band}</span>
          </p>
        </div>
      </div>

      ${narratives?.phase3?.executive ? `
        <div class="narrative-content">
          ${NarrativeExtractionService.markdownToHtml(narratives.phase3.executive)}
        </div>
      ` : ctx.executiveSummary ? `
        <div class="callout info">
          <p>${escapeHtml(ctx.executiveSummary.overview)}</p>
        </div>
      ` : ''}
    </section>

    <section class="section">
      <h2>Chapter Performance Overview</h2>
      <div class="grid grid-2">
        ${ctx.chapters.map(ch => `
          <div class="card">
            <div class="card-header">
              <span class="card-title">${escapeHtml(ch.name)}</span>
              <span class="band-badge ${ch.band}">${ch.score}/100</span>
            </div>
            <div class="card-body">
              ${generateProgressBar(ch.score, 100, options.brand)}
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    ${narratives?.phase3?.actionMatrix ? `
      <section class="section page-break">
        <h2>Priority Actions</h2>
        <div class="narrative-content">
          ${NarrativeExtractionService.markdownToHtml(narratives.phase3.actionMatrix)}
        </div>
      </section>
    ` : `
      <section class="section page-break">
        <h2>Key Insights</h2>

        <div class="grid grid-2">
          <div>
            <h3 style="color: #28a745;">Top Strengths</h3>
            ${strengths.length > 0 ? `
              <ul>
                ${strengths.map(s => `
                  <li>
                    <strong>${escapeHtml(s.shortLabel)}</strong>
                    <br><small>${escapeHtml(s.dimensionName)}</small>
                  </li>
                `).join('')}
              </ul>
            ` : '<p>No significant strengths identified.</p>'}
          </div>
          <div>
            <h3 style="color: #dc3545;">Priority Areas</h3>
            ${priorities.length > 0 ? `
              <ul>
                ${priorities.map(p => `
                  <li>
                    <strong>${escapeHtml(p.shortLabel)}</strong>
                    <br><small>${escapeHtml(p.dimensionName)} - ${p.type}</small>
                  </li>
                `).join('')}
              </ul>
            ` : '<p>No critical priorities identified.</p>'}
          </div>
        </div>
      </section>
    `}

    ${narratives?.phase2?.strategicRecommendations ? `
      <section class="section">
        <h2>Strategic Recommendations</h2>
        <div class="narrative-content">
          ${NarrativeExtractionService.markdownToHtml(narratives.phase2.strategicRecommendations)}
        </div>
      </section>
    ` : ctx.keyImperatives.length > 0 ? `
      <section class="section">
        <h2>Strategic Imperatives</h2>
        <div class="callout warning">
          <p>These are the critical actions required to improve your business health:</p>
          <ol>
            ${ctx.keyImperatives.map(i => `<li>${escapeHtml(i)}</li>`).join('')}
          </ol>
        </div>
      </section>
    ` : ''}

    ${narratives?.phase2?.consolidatedRisks ? `
      <section class="section">
        <h2>Key Risks to Address</h2>
        <div class="narrative-content">
          ${NarrativeExtractionService.markdownToHtml(narratives.phase2.consolidatedRisks)}
        </div>
      </section>
    ` : ''}

    <section class="section">
      <h2>Top Recommendations</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Recommendation</th>
            <th>Timeline</th>
            <th>Impact</th>
            <th>ROI</th>
          </tr>
        </thead>
        <tbody>
          ${topRecommendations.map((rec, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>
                ${escapeHtml(rec.theme)}
                ${rec.isQuickWin ? '<span class="band-badge Excellence" style="margin-left: 0.5rem;">Quick Win</span>' : ''}
              </td>
              <td>${escapeHtml(rec.horizonLabel)}</td>
              <td>${rec.impactScore}/100</td>
              <td><strong>${calculateROI(rec.impactScore, rec.effortScore)}x</strong></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </section>

    ${quickWins.length > 0 ? `
      <section class="section">
        <h2>Quick Wins - Start Today</h2>
        <p>These high-impact, low-effort improvements can be implemented within 90 days:</p>
        ${quickWins.map(qw => `
          <div class="quick-win-card">
            <div class="title">${escapeHtml(qw.theme)}</div>
            <p>${escapeHtml(qw.expectedOutcomes)}</p>
            <div class="metrics">
              <span>Impact: ${qw.impactScore}/100</span>
              <span>Effort: ${qw.effortScore}/100</span>
              <span>ROI: ${calculateROI(qw.impactScore, qw.effortScore)}x</span>
            </div>
          </div>
        `).join('')}
      </section>
    ` : ''}

    ${ctx.financialProjections ? `
      <section class="section">
        <h2>Financial Snapshot</h2>
        <div class="grid grid-4">
          <div class="score-card small">
            <div class="score-value">${formatCurrency(ctx.financialProjections.day90Value)}</div>
            <div class="score-label">90-Day Value</div>
          </div>
          <div class="score-card small">
            <div class="score-value">${formatCurrency(ctx.financialProjections.annualValue)}</div>
            <div class="score-label">Annual Value</div>
          </div>
          <div class="score-card small">
            <div class="score-value">${ctx.financialProjections.roi90Day ? `${ctx.financialProjections.roi90Day}x` : '-'}</div>
            <div class="score-label">Expected ROI</div>
          </div>
          <div class="score-card small">
            <div class="score-value">${formatCurrency(ctx.financialProjections.totalInvestmentRequired)}</div>
            <div class="score-label">Investment</div>
          </div>
        </div>
      </section>
    ` : ''}

    <section class="section">
      <h2>Next Steps</h2>
      <div class="callout success">
        <div class="title">Recommended Actions</div>
        <ol>
          <li>Review the Quick Wins section and identify 1-2 initiatives to start this week</li>
          <li>Schedule a strategic planning session to address the Priority Areas</li>
          <li>Review the full Comprehensive Report for detailed analysis and recommendations</li>
          <li>Consider engaging with BizHealth.ai for implementation support</li>
        </ol>
      </div>
    </section>

    ${generateOwnerReportFooter(ctx, narratives)}
  `, {
    title: `${reportName} - ${ctx.companyProfile.name}`,
    brand: options.brand,
    customCSS: narrativeStyles,
  });

  logger.info({
    contentWords: narratives?.metadata?.totalWords || 0
  }, 'Owners report built');

  // Write HTML file
  const htmlPath = path.join(options.outputDir, `${reportType}.html`);
  await fs.writeFile(htmlPath, html, 'utf-8');

  // Generate metadata
  const meta: ReportMeta = {
    reportType: 'owner',
    reportName,
    generatedAt: new Date().toISOString(),
    companyName: ctx.companyProfile.name,
    runId: ctx.runId,
    healthScore: ctx.overallHealth.score,
    healthBand: ctx.overallHealth.band,
    pageSuggestionEstimate: 3,
    sections: [
      { id: 'overview', title: 'Business Health at a Glance' },
      { id: 'insights', title: 'Key Insights' },
      { id: 'recommendations', title: 'Top Recommendations' },
      { id: 'quick-wins', title: 'Quick Wins' },
      { id: 'next-steps', title: 'Next Steps' },
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

/**
 * Generate CSS styles for narrative content in owner report
 */
function generateOwnerNarrativeStyles(primaryColor: string, accentColor: string): string {
  return `
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
  `;
}
