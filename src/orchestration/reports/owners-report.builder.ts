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

// Import visual enhancement components
import {
  generateKeyTakeaways,
  generateExecutiveHighlights,
  generateOverallBenchmarkCallout,
  generateEvidenceCitationsForDimension,
  generateInsightCardWithEvidence,
  generateChapterBenchmarkCallout,
  generateBenchmarkSummaryTable,
} from './components/index.js';
import { getChapterIcon } from './constants/index.js';

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

  // Generate visual enhancement components
  const keyTakeawaysHtml = generateKeyTakeaways(ctx);
  const executiveHighlightsHtml = generateExecutiveHighlights(ctx);
  const overallBenchmarkHtml = generateOverallBenchmarkCallout(ctx);
  const insightCardsHtml = buildOwnerInsightCards(ctx);
  const benchmarkSummaryHtml = generateBenchmarkSummaryTable(ctx);

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

      <!-- Executive Highlights Summary -->
      ${executiveHighlightsHtml}

      <!-- Key Takeaways Box -->
      ${keyTakeawaysHtml}

      <!-- Benchmark Callout -->
      ${overallBenchmarkHtml}

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
              <span class="card-title">
                <span style="margin-right: 0.5rem;">${getChapterIcon(ch.code)}</span>
                ${escapeHtml(ch.name)}
              </span>
              <span class="band-badge ${ch.band}">${ch.score}/100</span>
            </div>
            <div class="card-body">
              ${generateProgressBar(ch.score, 100, options.brand)}
              ${ch.benchmark ? `
                <div style="font-size: 0.85rem; color: #666; margin-top: 0.5rem;">
                  ${ch.benchmark.peerPercentile}th percentile vs peers
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Benchmark Summary Table -->
      ${benchmarkSummaryHtml}

      <!-- Chapter Benchmark Callouts for Top Chapters -->
      ${ctx.chapters.slice(0, 2).map(ch =>
        generateChapterBenchmarkCallout(ch, ctx.companyProfile.industry)
      ).join('')}
    </section>

    <section class="section page-break">
      <h2>Key Insights</h2>

      <!-- Visual Insight Cards with Evidence Citations -->
      ${insightCardsHtml}

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

      <!-- Evidence Citations for Key Dimensions -->
      ${ctx.dimensions.slice(0, 4).map(dim =>
        generateEvidenceCitationsForDimension(ctx, dim.code, 1)
      ).join('')}
    </section>

    ${narratives?.phase3?.actionMatrix ? `
      <section class="section page-break">
        <h2>Priority Actions</h2>
        <div class="narrative-content">
          ${NarrativeExtractionService.markdownToHtml(narratives.phase3.actionMatrix)}
        </div>
      </section>
    ` : ''}

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
 * Generate CSS styles for narrative content and visual enhancements in owner report
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
  `;
}
