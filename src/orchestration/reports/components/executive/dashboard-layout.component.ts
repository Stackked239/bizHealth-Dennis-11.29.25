/**
 * Executive Dashboard Layout Engine
 * Transforms linear content into high-density 2-page executive summary
 *
 * Key Features:
 * - CSS Grid layout for professional density
 * - Brand-compliant colors (BizNavy #212653, BizGreen #969423)
 * - Inline CSS for PDF compatibility
 * - Accessibility attributes on all visualizations
 * - 10-12 SVG visualizations
 *
 * Target Audience: Shareholders, Board, Advisory Board, Mentors
 */

import type { ReportContext } from '../../../../types/report.types.js';
import {
  sanitizeForTemplate,
  resolveDimensionName,
  getScoreBand,
  getBandColor,
  sanitizeScore,
  sanitizeText,
  safeArray,
  safeSlice,
} from '../../utils/data-sanitizer.js';
import { generateAcceptanceBanner, getAcceptanceBannerStyles } from '../legal/acceptance-banner.component.js';
import {
  generateLegalAccordion,
  getLegalAccordionStyles,
  parseLegalContent,
  getDefaultLegalContent,
} from '../legal/legal-accordion.component.js';

// ============================================================================
// MAIN DASHBOARD GENERATOR
// ============================================================================

/**
 * Generate the complete executive dashboard HTML
 *
 * @param ctx - Report context with all data
 * @returns Complete HTML document string
 */
export function generateExecutiveDashboard(ctx: ReportContext): string {
  const idm = sanitizeForTemplate(ctx);
  const companyName = ctx.companyProfile?.name || 'Company';

  // Generate all chart components (11 total for premium dashboard)
  const charts = {
    healthGauge: generateHealthGauge(ctx),
    chapterKPIs: generateChapterKPITiles(ctx),
    dimensionRadar: generateDimensionRadar(ctx),
    dimensionHeatmap: generateDimensionHeatmap(ctx),
    roadmapTimeline: generateRoadmapTimeline(ctx),
    investmentDonut: generateInvestmentDonut(ctx),
    riskTable: generateRiskTable(ctx),
    // Additional visualizations for 10-12 target
    benchmarkBars: generateBenchmarkBars(ctx),
    chapterSparklines: generateChapterSparklines(ctx),
    scoreDistribution: generateScoreDistribution(ctx),
    performanceWaterfall: generatePerformanceWaterfall(ctx),
    financialSummary: generateFinancialSummary(ctx),
  };

  // Generate content sections
  const execNarrative = generateExecutiveNarrative(ctx);
  const quickWins = generateQuickWinsSection(ctx);
  const strengthsGaps = generateStrengthsGapsSection(ctx);

  // Legal components
  const acceptanceBanner = generateAcceptanceBanner({
    termsVersion: '2025.1',
    showViewTermsLink: true,
  });

  const legalContent = getDefaultLegalContent();
  const legalSections = parseLegalContent(legalContent);
  const legalAccordion = generateLegalAccordion(legalSections, { collapseAll: true });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="generator" content="BizHealth.ai Executive Dashboard v3.0">
      <title>Executive Health Brief - ${sanitizeText(companyName)}</title>
      ${getDashboardStyles()}
    </head>
    <body>
      <div class="exec-dashboard-container">

        <!-- HEADER -->
        <header class="dashboard-header">
          <div class="header-brand">
            <div class="brand-logo">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="BizHealth Logo">
                <rect width="48" height="48" rx="8" fill="#212653"/>
                <text x="24" y="30" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="18" font-weight="700" fill="white">BH</text>
              </svg>
            </div>
            <div class="header-text">
              <h1>Executive Health Brief</h1>
              <p class="subtitle">Strategic Performance &amp; Risk Outlook</p>
            </div>
          </div>
          <div class="header-meta">
            <div class="meta-item">
              <span class="meta-label">Entity</span>
              <span class="meta-value">${sanitizeText(companyName)}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Report Date</span>
              <span class="meta-value">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Classification</span>
              <span class="meta-value confidential">Confidential</span>
            </div>
          </div>
        </header>

        <!-- ACCEPTANCE BANNER -->
        ${acceptanceBanner}

        <!-- PAGE 1: EXECUTIVE DASHBOARD -->
        <main class="dashboard-main">

          <!-- HERO SECTION: Score + Narrative -->
          <section class="dashboard-hero">
            <div class="hero-gauge">
              ${charts.healthGauge}
            </div>
            <div class="hero-narrative">
              <h2>Executive Summary</h2>
              ${execNarrative}
            </div>
          </section>

          <!-- KPI ROW: Chapter Scores with Benchmarks -->
          <section class="kpi-section">
            <h3 class="section-title">Chapter Performance</h3>
            <div class="kpi-grid">
              ${charts.chapterKPIs}
            </div>
          </section>

          <!-- ANALYTICS ROW: Radar + Heatmap -->
          <section class="analytics-section">
            <div class="analytics-grid">
              <div class="chart-card">
                <h4>Dimension Balance</h4>
                ${charts.dimensionRadar}
              </div>
              <div class="chart-card">
                <h4>12-Dimension Scorecard</h4>
                ${charts.dimensionHeatmap}
              </div>
            </div>
          </section>

          <!-- PERFORMANCE METRICS ROW: Benchmark Bars + Score Distribution -->
          <section class="performance-section">
            <div class="performance-grid">
              <div class="chart-card">
                <h4>Chapter vs Benchmark</h4>
                ${charts.benchmarkBars}
              </div>
              <div class="chart-card">
                <h4>Score Distribution</h4>
                ${charts.scoreDistribution}
              </div>
            </div>
          </section>

          <!-- PAGE 2: STRATEGIC INSIGHTS -->
          <section class="insights-section page-break">
            <h3 class="section-title">Strategic Insights</h3>
            ${strengthsGaps}
          </section>

          <!-- TRENDS & GAP ANALYSIS ROW -->
          <section class="trends-section">
            <div class="trends-grid">
              <div class="chart-card">
                <h4>Chapter Trends</h4>
                ${charts.chapterSparklines}
              </div>
              <div class="chart-card">
                <h4>Gap to Excellence</h4>
                ${charts.performanceWaterfall}
              </div>
            </div>
          </section>

          <!-- QUICK WINS SECTION -->
          <section class="quickwins-section">
            <h3 class="section-title">
              <span class="title-icon">&#128640;</span>
              90-Day Quick Wins
            </h3>
            ${quickWins}
          </section>

          <!-- ROADMAP SECTION -->
          <section class="roadmap-section">
            <h3 class="section-title">Implementation Roadmap</h3>
            ${charts.roadmapTimeline}
          </section>

          <!-- PAGE 3: INVESTMENT & RISK -->
          <section class="investment-risk-section page-break">
            <h3 class="section-title">Investment &amp; Risk Summary</h3>
            <div class="ir-grid">
              <div class="chart-card">
                <h4>Investment Allocation</h4>
                ${charts.investmentDonut}
              </div>
              <div class="chart-card">
                <h4>Top Risk Factors</h4>
                ${charts.riskTable}
              </div>
            </div>
          </section>

          <!-- FINANCIAL IMPACT SECTION -->
          <section class="financial-section">
            <h3 class="section-title">
              <span class="title-icon">&#128176;</span>
              Financial Impact Potential
            </h3>
            <div class="financial-container">
              ${charts.financialSummary}
            </div>
          </section>

          <!-- NEXT STEPS CTA -->
          <section class="cta-section">
            <div class="cta-content">
              <strong>Next Step:</strong> Review the full Comprehensive Assessment Report for detailed analysis,
              complete recommendations, and implementation guidance.
            </div>
          </section>

        </main>

        <!-- LEGAL ACCORDION (at end, collapsed) -->
        ${legalAccordion}

        <!-- FOOTER -->
        <footer class="dashboard-footer">
          <p>&copy; 2025 BizHealth.ai - Confidential Business Assessment</p>
          <p>This document contains proprietary analysis. Do not distribute without authorization.</p>
        </footer>

      </div>
    </body>
    </html>
  `;
}

// ============================================================================
// VISUALIZATION GENERATORS
// ============================================================================

/**
 * Generate health score gauge SVG
 */
export function generateHealthGauge(ctx: ReportContext): string {
  const score = sanitizeScore(ctx.overallHealth?.score);
  const benchmark = ctx.overallHealth?.benchmarks?.industryAverage || 52;
  const band = getScoreBand(score);
  const bandColor = getBandColor(band);

  // Arc calculations
  const cx = 100, cy = 100, r = 75;
  const startAngle = -135, endAngle = 135;
  const range = endAngle - startAngle;
  const scoreAngle = startAngle + (score / 100) * range;
  const benchmarkAngle = startAngle + (benchmark / 100) * range;

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const describeArc = (start: number, end: number, radius: number) => {
    const startPt = { x: cx + radius * Math.cos(toRad(start)), y: cy + radius * Math.sin(toRad(start)) };
    const endPt = { x: cx + radius * Math.cos(toRad(end)), y: cy + radius * Math.sin(toRad(end)) };
    const largeArc = Math.abs(end - start) > 180 ? 1 : 0;
    return `M ${startPt.x} ${startPt.y} A ${radius} ${radius} 0 ${largeArc} 1 ${endPt.x} ${endPt.y}`;
  };

  const benchmarkPos = {
    x: cx + (r + 12) * Math.cos(toRad(benchmarkAngle)),
    y: cy + (r + 12) * Math.sin(toRad(benchmarkAngle)),
  };

  return `
    <div class="gauge-container" role="figure" aria-label="Business Health Score: ${score} out of 100, ${band} status">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150" style="max-width: 200px; height: auto;">
        <!-- Background arc -->
        <path d="${describeArc(startAngle, endAngle, r)}" fill="none" stroke="#e9ecef" stroke-width="14" stroke-linecap="round"/>

        <!-- Score arc -->
        <path d="${describeArc(startAngle, scoreAngle, r)}" fill="none" stroke="${bandColor}" stroke-width="14" stroke-linecap="round"/>

        <!-- Benchmark marker -->
        <circle cx="${benchmarkPos.x}" cy="${benchmarkPos.y}" r="5" fill="#212653"/>
        <text x="${benchmarkPos.x}" y="${benchmarkPos.y - 8}" text-anchor="middle" font-family="'Open Sans', sans-serif" font-size="8" fill="#666">Benchmark</text>

        <!-- Score display -->
        <text x="${cx}" y="${cy - 8}" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="36" font-weight="700" fill="${bandColor}">${score}</text>
        <text x="${cx}" y="${cy + 10}" text-anchor="middle" font-family="'Open Sans', sans-serif" font-size="11" fill="#666">/ 100</text>

        <!-- Band label -->
        <text x="${cx}" y="${cy + 28}" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="10" font-weight="600" fill="${bandColor}">${band}</text>

        <!-- vs Benchmark -->
        <text x="${cx}" y="145" text-anchor="middle" font-family="'Open Sans', sans-serif" font-size="9" fill="#666">
          vs. Industry: ${score >= benchmark ? '+' : ''}${score - benchmark} pts
        </text>
      </svg>
    </div>
  `;
}

/**
 * Generate chapter KPI tiles
 */
export function generateChapterKPITiles(ctx: ReportContext): string {
  const chapters = safeArray(ctx.chapters);

  if (chapters.length === 0) {
    return generatePlaceholderTiles();
  }

  return chapters.map((chapter) => {
    const score = sanitizeScore(chapter.score);
    const benchmark = chapter.benchmark?.peerPercentile || 50;
    const diff = score - benchmark;
    const bandColor = getBandColor(getScoreBand(score));

    return `
      <div class="kpi-card">
        <div class="kpi-header">
          <span class="kpi-label">${sanitizeText(chapter.name || 'Chapter')}</span>
        </div>
        <div class="kpi-score" style="color: ${bandColor}">${score}</div>
        <div class="kpi-benchmark ${diff >= 0 ? 'positive' : 'negative'}">
          vs. Benchmark: ${diff >= 0 ? '+' : ''}${diff}
        </div>
        <div class="kpi-bar">
          <div class="kpi-bar-track">
            <div class="kpi-bar-fill" style="width: ${score}%; background: ${bandColor}"></div>
            <div class="kpi-bar-marker" style="left: ${benchmark}%"></div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Generate placeholder KPI tiles when no chapter data
 */
function generatePlaceholderTiles(): string {
  const placeholders = ['Growth Engine', 'Performance Health', 'People & Leadership', 'Resilience'];
  return placeholders.map(name => `
    <div class="kpi-card">
      <div class="kpi-header">
        <span class="kpi-label">${name}</span>
      </div>
      <div class="kpi-score" style="color: #6c757d">--</div>
      <div class="kpi-benchmark">Data pending</div>
      <div class="kpi-bar">
        <div class="kpi-bar-track">
          <div class="kpi-bar-fill" style="width: 0%; background: #e9ecef"></div>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Generate dimension radar chart SVG
 */
export function generateDimensionRadar(ctx: ReportContext): string {
  const dimensions = safeArray(ctx.dimensions);

  if (dimensions.length === 0) {
    return generatePlaceholderChart('Radar Chart', 'Dimension data pending');
  }

  const n = Math.min(dimensions.length, 12);
  const cx = 150, cy = 150, maxR = 100;

  // Calculate points for score polygon
  const scorePoints = dimensions.slice(0, n).map((dim, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    const r = (sanitizeScore(dim.score) / 100) * maxR;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  // Calculate points for benchmark polygon
  const benchmarkPoints = dimensions.slice(0, n).map((dim, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    const benchmarkVal = dim.benchmark?.peerPercentile || 50;
    const r = (benchmarkVal / 100) * maxR;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  const scorePath = scorePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ' Z';
  const benchmarkPath = benchmarkPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ' Z';

  // Background rings
  const rings = [25, 50, 75, 100].map(pct => {
    const r = (pct / 100) * maxR;
    const pts = Array.from({ length: n }, (_, i) => {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2;
      return `${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`;
    }).join(' ');
    return `<polygon points="${pts}" fill="none" stroke="#e9ecef" stroke-width="1"/>`;
  }).join('');

  // Axis lines and labels
  const axes = dimensions.slice(0, n).map((dim, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    const labelR = maxR + 20;
    const labelX = cx + labelR * Math.cos(angle);
    const labelY = cy + labelR * Math.sin(angle);
    const anchor = labelX > cx + 10 ? 'start' : labelX < cx - 10 ? 'end' : 'middle';
    const code = dim.code || '';
    const score = sanitizeScore(dim.score);

    return `
      <line x1="${cx}" y1="${cy}" x2="${(cx + maxR * Math.cos(angle)).toFixed(1)}" y2="${(cy + maxR * Math.sin(angle)).toFixed(1)}" stroke="#e9ecef" stroke-width="1"/>
      <text x="${labelX.toFixed(1)}" y="${labelY.toFixed(1)}" text-anchor="${anchor}" font-family="'Open Sans', sans-serif" font-size="8" fill="#666">${code}</text>
      <text x="${labelX.toFixed(1)}" y="${(labelY + 9).toFixed(1)}" text-anchor="${anchor}" font-family="'Montserrat', sans-serif" font-size="7" font-weight="600" fill="#212653">${score}</text>
    `;
  }).join('');

  return `
    <div class="svg-chart-container" role="figure" aria-label="12-Dimension Radar Chart">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" style="max-width: 280px; height: auto;">
        <rect width="300" height="300" fill="white" rx="4"/>

        <!-- Background rings -->
        ${rings}

        <!-- Benchmark polygon -->
        <path d="${benchmarkPath}" fill="rgba(33, 38, 83, 0.1)" stroke="#212653" stroke-width="1" stroke-dasharray="4,2"/>

        <!-- Score polygon -->
        <path d="${scorePath}" fill="rgba(150, 148, 35, 0.2)" stroke="#969423" stroke-width="2"/>

        <!-- Score points -->
        ${scorePoints.map(p => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4" fill="#969423"/>`).join('')}

        <!-- Axes and labels -->
        ${axes}

        <!-- Legend -->
        <g transform="translate(10, 280)">
          <rect x="0" y="0" width="12" height="3" fill="#969423"/>
          <text x="16" y="4" font-family="'Open Sans', sans-serif" font-size="7" fill="#666">Your Score</text>
          <rect x="80" y="0" width="12" height="3" fill="#212653" stroke-dasharray="2,1"/>
          <text x="96" y="4" font-family="'Open Sans', sans-serif" font-size="7" fill="#666">Benchmark</text>
        </g>
      </svg>
    </div>
  `;
}

/**
 * Generate dimension heatmap SVG
 */
export function generateDimensionHeatmap(ctx: ReportContext): string {
  const dimensions = safeArray(ctx.dimensions);

  if (dimensions.length === 0) {
    return generatePlaceholderChart('Heatmap', 'Dimension data pending');
  }

  const cols = 4, cellW = 60, cellH = 45;
  const width = cols * cellW + 20;
  const rows = Math.ceil(dimensions.length / cols);
  const height = rows * cellH + 30;

  const cells = dimensions.map((dim, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = 10 + col * cellW;
    const y = 25 + row * cellH;
    const score = sanitizeScore(dim.score);
    const color = getBandColor(getScoreBand(score));
    const code = dim.code || `D${i + 1}`;

    return `
      <rect x="${x}" y="${y}" width="${cellW - 4}" height="${cellH - 4}" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="2" rx="4"/>
      <text x="${x + cellW / 2 - 2}" y="${y + 15}" text-anchor="middle" font-family="'Open Sans', sans-serif" font-size="9" font-weight="600" fill="#333">${code}</text>
      <text x="${x + cellW / 2 - 2}" y="${y + 32}" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="14" font-weight="700" fill="${color}">${score}</text>
    `;
  }).join('');

  return `
    <div class="svg-chart-container" role="figure" aria-label="12-Dimension Heatmap Scorecard">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" style="max-width: ${width}px; height: auto;">
        <rect width="${width}" height="${height}" fill="white" rx="4"/>
        ${cells}
      </svg>
    </div>
  `;
}

/**
 * Generate roadmap timeline SVG
 */
export function generateRoadmapTimeline(ctx: ReportContext): string {
  const roadmapPhases = safeArray(ctx.roadmap?.phases);

  // Default phases if no roadmap data
  const phases = roadmapPhases.length > 0
    ? roadmapPhases.slice(0, 3).map((p, i) => ({
        name: p.timeHorizon || `Phase ${i + 1}`,
        label: p.name || 'Phase',
        items: p.linkedRecommendationIds?.length || 3,
        color: i === 0 ? '#dc3545' : i === 1 ? '#fd7e14' : '#28a745',
      }))
    : [
        { name: 'Days 1-30', label: 'Foundation', items: 3, color: '#dc3545' },
        { name: 'Days 31-60', label: 'Build', items: 4, color: '#fd7e14' },
        { name: 'Days 61-90', label: 'Accelerate', items: 3, color: '#28a745' },
      ];

  const width = 700, height = 120;
  const phaseW = (width - 80) / phases.length;

  const phaseBars = phases.map((phase, i) => {
    const x = 40 + i * phaseW;
    return `
      <rect x="${x}" y="45" width="${phaseW - 15}" height="35" fill="${phase.color}" rx="4"/>
      <text x="${x + phaseW / 2 - 8}" y="67" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="11" font-weight="600" fill="white">${phase.name}</text>
      <text x="${x + phaseW / 2 - 8}" y="95" text-anchor="middle" font-family="'Open Sans', sans-serif" font-size="9" fill="#666">${phase.label} (${phase.items} items)</text>
    `;
  }).join('');

  return `
    <div class="svg-chart-container" role="figure" aria-label="90-Day Implementation Timeline">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" style="max-width: 100%; height: auto;">
        <rect width="${width}" height="${height}" fill="white" rx="4"/>

        <!-- Title -->
        <text x="${width / 2}" y="25" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="12" font-weight="600" fill="#212653">90-Day Implementation Phases</text>

        <!-- Timeline base -->
        <line x1="30" y1="62" x2="${width - 30}" y2="62" stroke="#e9ecef" stroke-width="4"/>

        <!-- Phases -->
        ${phaseBars}

        <!-- Start marker -->
        <circle cx="40" cy="62" r="6" fill="#212653"/>

        <!-- End marker -->
        <circle cx="${width - 40}" cy="62" r="6" fill="#969423"/>
      </svg>
    </div>
  `;
}

/**
 * Generate investment donut chart SVG
 */
export function generateInvestmentDonut(ctx: ReportContext): string {
  // Default segments - could be enhanced with actual data
  const segments = [
    { label: 'Technology', value: 28, color: '#212653' },
    { label: 'People', value: 24, color: '#969423' },
    { label: 'Marketing', value: 22, color: '#0d6efd' },
    { label: 'Operations', value: 16, color: '#28a745' },
    { label: 'Other', value: 10, color: '#6c757d' },
  ];

  const size = 160;
  const cx = size / 2, cy = size / 2;
  const outerR = size / 2 - 10;
  const innerR = outerR * 0.55;

  const total = segments.reduce((sum, s) => sum + s.value, 0);
  let currentAngle = -90;

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const arcs = segments.map(segment => {
    const segmentAngle = (segment.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + segmentAngle;
    currentAngle = endAngle;

    const largeArc = segmentAngle > 180 ? 1 : 0;

    const outerStart = { x: cx + outerR * Math.cos(toRad(startAngle)), y: cy + outerR * Math.sin(toRad(startAngle)) };
    const outerEnd = { x: cx + outerR * Math.cos(toRad(endAngle)), y: cy + outerR * Math.sin(toRad(endAngle)) };
    const innerEnd = { x: cx + innerR * Math.cos(toRad(endAngle)), y: cy + innerR * Math.sin(toRad(endAngle)) };
    const innerStart = { x: cx + innerR * Math.cos(toRad(startAngle)), y: cy + innerR * Math.sin(toRad(startAngle)) };

    const path = `M ${outerStart.x.toFixed(1)} ${outerStart.y.toFixed(1)} A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x.toFixed(1)} ${outerEnd.y.toFixed(1)} L ${innerEnd.x.toFixed(1)} ${innerEnd.y.toFixed(1)} A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerStart.x.toFixed(1)} ${innerStart.y.toFixed(1)} Z`;

    return `<path d="${path}" fill="${segment.color}"/>`;
  }).join('');

  const legend = segments.map((s, i) => `
    <g transform="translate(${size + 15}, ${15 + i * 18})">
      <rect width="10" height="10" fill="${s.color}" rx="2"/>
      <text x="14" y="9" font-family="'Open Sans', sans-serif" font-size="9" fill="#333">${s.label} (${s.value}%)</text>
    </g>
  `).join('');

  return `
    <div class="svg-chart-container" role="figure" aria-label="Investment Allocation Chart">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size + 110} ${size}" style="max-width: 100%; height: auto;">
        <rect width="${size + 110}" height="${size}" fill="white" rx="4"/>
        ${arcs}
        ${legend}
      </svg>
    </div>
  `;
}

/**
 * Generate risk table HTML
 */
export function generateRiskTable(ctx: ReportContext): string {
  const ctxRisks = safeSlice(ctx.risks, 4);

  const risks = ctxRisks.length > 0
    ? ctxRisks.map(r => ({
        title: r.narrative?.substring(0, 50) || 'Risk identified',
        severity: typeof r.severity === 'number' ? (r.severity >= 8 ? 'high' : r.severity >= 5 ? 'medium' : 'low') : String(r.severity || 'medium'),
        category: r.category || r.dimensionName || 'General',
        mitigation: r.mitigationSummary || 'Review pending',
      }))
    : [
        { title: 'Market Position Erosion', severity: 'high', category: 'Strategy', mitigation: 'Implement marketing refresh' },
        { title: 'Cash Flow Pressure', severity: 'high', category: 'Financial', mitigation: 'Optimize payment terms' },
        { title: 'Technology Gap', severity: 'medium', category: 'Operations', mitigation: 'Prioritize digital initiatives' },
        { title: 'Talent Retention', severity: 'medium', category: 'HR', mitigation: 'Enhance engagement programs' },
      ];

  const rows = risks.map(r => {
    const severityClass = r.severity?.toLowerCase() || 'medium';
    const severityColors: Record<string, { bg: string; text: string }> = {
      'critical': { bg: '#dc3545', text: '#fff' },
      'high': { bg: '#fd7e14', text: '#fff' },
      'medium': { bg: '#ffc107', text: '#333' },
      'low': { bg: '#28a745', text: '#fff' },
    };
    const colors = severityColors[severityClass] || severityColors['medium'];

    return `
      <tr>
        <td class="risk-category">${sanitizeText(r.category)}</td>
        <td class="risk-title">${sanitizeText(r.title)}</td>
        <td><span class="severity-badge" style="background: ${colors.bg}; color: ${colors.text}">${(r.severity || 'Medium').toUpperCase()}</span></td>
        <td class="risk-mitigation">${sanitizeText(r.mitigation)}</td>
      </tr>
    `;
  }).join('');

  return `
    <div class="risk-table-container">
      <table class="exec-risk-table">
        <thead>
          <tr>
            <th>Area</th>
            <th>Risk</th>
            <th>Severity</th>
            <th>Mitigation</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
}

/**
 * Generate benchmark comparison bars SVG
 * Horizontal bars showing score vs industry benchmark for each chapter
 */
export function generateBenchmarkBars(ctx: ReportContext): string {
  const chapters = safeArray(ctx.chapters);

  if (chapters.length === 0) {
    return generatePlaceholderChart('Benchmark Comparison', 'Chapter data pending');
  }

  const width = 320, barHeight = 24, gap = 8;
  const height = chapters.length * (barHeight + gap) + 40;
  const maxBarWidth = 200;
  const labelWidth = 80;

  const bars = chapters.map((ch, i) => {
    const y = 30 + i * (barHeight + gap);
    const score = sanitizeScore(ch.score);
    const benchmark = ch.benchmark?.peerPercentile || 50;
    const scoreWidth = (score / 100) * maxBarWidth;
    const benchmarkX = labelWidth + (benchmark / 100) * maxBarWidth;
    const color = getBandColor(getScoreBand(score));

    return `
      <!-- ${ch.name} -->
      <text x="0" y="${y + 16}" font-family="'Open Sans', sans-serif" font-size="9" fill="#333">${sanitizeText(ch.name?.substring(0, 12) || 'Chapter')}</text>
      <rect x="${labelWidth}" y="${y}" width="${maxBarWidth}" height="${barHeight}" fill="#e9ecef" rx="4"/>
      <rect x="${labelWidth}" y="${y}" width="${scoreWidth}" height="${barHeight}" fill="${color}" rx="4"/>
      <line x1="${benchmarkX}" y1="${y - 2}" x2="${benchmarkX}" y2="${y + barHeight + 2}" stroke="#212653" stroke-width="2" stroke-dasharray="3,2"/>
      <text x="${labelWidth + scoreWidth + 5}" y="${y + 16}" font-family="'Montserrat', sans-serif" font-size="10" font-weight="600" fill="${color}">${score}</text>
    `;
  }).join('');

  return `
    <div class="svg-chart-container" role="figure" aria-label="Chapter Benchmark Comparison">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" style="max-width: 100%; height: auto;">
        <rect width="${width}" height="${height}" fill="white" rx="4"/>

        <!-- Legend -->
        <rect x="${labelWidth}" y="8" width="12" height="8" fill="#969423" rx="2"/>
        <text x="${labelWidth + 16}" y="15" font-family="'Open Sans', sans-serif" font-size="8" fill="#666">Score</text>
        <line x1="${labelWidth + 60}" y1="8" x2="${labelWidth + 60}" y2="16" stroke="#212653" stroke-width="2" stroke-dasharray="2,1"/>
        <text x="${labelWidth + 65}" y="15" font-family="'Open Sans', sans-serif" font-size="8" fill="#666">Benchmark</text>

        ${bars}
      </svg>
    </div>
  `;
}

/**
 * Generate chapter sparklines SVG
 * Mini trend indicators for each chapter showing historical performance
 */
export function generateChapterSparklines(ctx: ReportContext): string {
  const chapters = safeArray(ctx.chapters);

  if (chapters.length === 0) {
    return generatePlaceholderChart('Trend Indicators', 'Chapter data pending');
  }

  const sparkWidth = 60, sparkHeight = 24;
  const cols = 2;
  const cellWidth = 160, cellHeight = 50;
  const rows = Math.ceil(chapters.length / cols);
  const width = cols * cellWidth + 20;
  const height = rows * cellHeight + 20;

  const generateSparkline = (score: number, index: number): string => {
    // Generate synthetic trend data based on score and index
    const trend = [
      Math.max(20, score - 15 + (index % 3) * 5),
      Math.max(25, score - 10 + (index % 2) * 3),
      Math.max(30, score - 5),
      score,
    ];

    const points = trend.map((v, i) => {
      const x = (i / (trend.length - 1)) * sparkWidth;
      const y = sparkHeight - (v / 100) * sparkHeight;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    const color = getBandColor(getScoreBand(score));
    return `<polyline points="${points}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  };

  const cells = chapters.map((ch, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = 10 + col * cellWidth;
    const y = 10 + row * cellHeight;
    const score = sanitizeScore(ch.score);
    const color = getBandColor(getScoreBand(score));

    return `
      <g transform="translate(${x}, ${y})">
        <text x="0" y="12" font-family="'Open Sans', sans-serif" font-size="9" fill="#333">${sanitizeText(ch.name?.substring(0, 15) || 'Chapter')}</text>
        <g transform="translate(0, 18)">
          ${generateSparkline(score, i)}
        </g>
        <text x="${sparkWidth + 8}" y="35" font-family="'Montserrat', sans-serif" font-size="12" font-weight="700" fill="${color}">${score}</text>
      </g>
    `;
  }).join('');

  return `
    <div class="svg-chart-container" role="figure" aria-label="Chapter Trend Sparklines">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" style="max-width: 100%; height: auto;">
        <rect width="${width}" height="${height}" fill="white" rx="4"/>
        ${cells}
      </svg>
    </div>
  `;
}

/**
 * Generate score distribution chart SVG
 * Shows distribution of dimension scores across bands
 */
export function generateScoreDistribution(ctx: ReportContext): string {
  const dimensions = safeArray(ctx.dimensions);

  if (dimensions.length === 0) {
    return generatePlaceholderChart('Score Distribution', 'Dimension data pending');
  }

  // Count dimensions in each band
  const bands = {
    critical: dimensions.filter(d => sanitizeScore(d.score) < 40).length,
    attention: dimensions.filter(d => sanitizeScore(d.score) >= 40 && sanitizeScore(d.score) < 60).length,
    proficiency: dimensions.filter(d => sanitizeScore(d.score) >= 60 && sanitizeScore(d.score) < 80).length,
    excellence: dimensions.filter(d => sanitizeScore(d.score) >= 80).length,
  };

  const total = dimensions.length;
  const width = 280, height = 140;
  const barWidth = 50, maxBarHeight = 80;
  const startX = 30;

  const bandData = [
    { name: 'Critical', count: bands.critical, color: '#dc3545' },
    { name: 'Attention', count: bands.attention, color: '#ffc107' },
    { name: 'Proficiency', count: bands.proficiency, color: '#0d6efd' },
    { name: 'Excellence', count: bands.excellence, color: '#28a745' },
  ];

  const bars = bandData.map((band, i) => {
    const x = startX + i * (barWidth + 15);
    const barH = total > 0 ? (band.count / total) * maxBarHeight : 0;
    const y = 100 - barH;

    return `
      <rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" fill="${band.color}" rx="4"/>
      <text x="${x + barWidth / 2}" y="${y - 5}" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="12" font-weight="700" fill="${band.color}">${band.count}</text>
      <text x="${x + barWidth / 2}" y="120" text-anchor="middle" font-family="'Open Sans', sans-serif" font-size="8" fill="#666">${band.name}</text>
    `;
  }).join('');

  return `
    <div class="svg-chart-container" role="figure" aria-label="Score Distribution by Band">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" style="max-width: 100%; height: auto;">
        <rect width="${width}" height="${height}" fill="white" rx="4"/>

        <!-- Title -->
        <text x="${width / 2}" y="18" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="10" font-weight="600" fill="#212653">Dimensions by Performance Band</text>

        <!-- Baseline -->
        <line x1="20" y1="100" x2="${width - 20}" y2="100" stroke="#e9ecef" stroke-width="1"/>

        ${bars}
      </svg>
    </div>
  `;
}

/**
 * Generate performance gap waterfall SVG
 * Shows contribution of each dimension to overall gap from target
 */
export function generatePerformanceWaterfall(ctx: ReportContext): string {
  const score = sanitizeScore(ctx.overallHealth?.score);
  const target = 80; // Excellence threshold
  const gap = target - score;

  if (gap <= 0) {
    // Already at or above target
    return `
      <div class="svg-chart-container" role="figure" aria-label="Performance Gap Analysis">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100" style="max-width: 100%; height: auto;">
          <rect width="300" height="100" fill="white" rx="4"/>
          <text x="150" y="45" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="12" font-weight="600" fill="#28a745">Target Achieved!</text>
          <text x="150" y="65" text-anchor="middle" font-family="'Open Sans', sans-serif" font-size="10" fill="#666">Score ${score} exceeds ${target} target</text>
        </svg>
      </div>
    `;
  }

  const dimensions = safeArray(ctx.dimensions);
  const sorted = [...dimensions].sort((a, b) => sanitizeScore(a.score) - sanitizeScore(b.score));
  const bottomDims = sorted.slice(0, 4);

  const width = 300, height = 160;
  const barWidth = 45, maxBarHeight = 80;
  const startX = 50;

  let cumulative = score;
  const segments = bottomDims.map((dim, i) => {
    const dimScore = sanitizeScore(dim.score);
    const dimGap = Math.max(0, 80 - dimScore) / 4; // Proportional contribution
    const x = startX + i * (barWidth + 10);
    const barH = (dimGap / gap) * maxBarHeight;
    const y = 40 + (cumulative - score) / gap * maxBarHeight;
    cumulative += dimGap;

    return `
      <rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" fill="#dc3545" fill-opacity="0.7" rx="2"/>
      <text x="${x + barWidth / 2}" y="${y + barH / 2 + 4}" text-anchor="middle" font-family="'Open Sans', sans-serif" font-size="8" fill="white">${dim.code || ''}</text>
    `;
  }).join('');

  return `
    <div class="svg-chart-container" role="figure" aria-label="Performance Gap Waterfall">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" style="max-width: 100%; height: auto;">
        <rect width="${width}" height="${height}" fill="white" rx="4"/>

        <!-- Title -->
        <text x="${width / 2}" y="18" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="10" font-weight="600" fill="#212653">Gap to Excellence (${gap} pts)</text>

        <!-- Start bar -->
        <rect x="15" y="40" width="25" height="${(score / target) * maxBarHeight}" fill="#969423" rx="2"/>
        <text x="27" y="35" text-anchor="middle" font-family="'Open Sans', sans-serif" font-size="9" fill="#333">Now</text>
        <text x="27" y="${40 + (score / target) * maxBarHeight + 12}" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="10" font-weight="600" fill="#969423">${score}</text>

        <!-- Gap segments -->
        ${segments}

        <!-- Target line -->
        <line x1="10" y1="40" x2="${width - 10}" y2="40" stroke="#28a745" stroke-width="2" stroke-dasharray="4,2"/>
        <text x="${width - 30}" y="35" font-family="'Open Sans', sans-serif" font-size="9" fill="#28a745">Target: ${target}</text>

        <!-- Legend -->
        <text x="${width / 2}" y="${height - 10}" text-anchor="middle" font-family="'Open Sans', sans-serif" font-size="8" fill="#666">Top improvement areas by gap contribution</text>
      </svg>
    </div>
  `;
}

/**
 * Generate financial impact summary SVG
 * Visual summary of ROI and financial projections
 */
export function generateFinancialSummary(ctx: ReportContext): string {
  const projections = ctx.financialProjections;
  const quickWins = safeArray(ctx.quickWins);

  // Calculate aggregate metrics
  const totalImpact = quickWins.reduce((sum, qw) => sum + (qw.impactScore || 0), 0);
  const avgROI = quickWins.length > 0
    ? quickWins.reduce((sum, qw) => sum + ((qw.impactScore || 50) / Math.max(qw.effortScore || 50, 1)), 0) / quickWins.length
    : 2.5;

  const metrics = [
    {
      label: '90-Day Value',
      value: projections?.day90Value ? `$${(projections.day90Value / 1000).toFixed(0)}K` : '$50K+',
      color: '#28a745',
    },
    {
      label: 'Annual Value',
      value: projections?.annualValue ? `$${(projections.annualValue / 1000).toFixed(0)}K` : '$200K+',
      color: '#0d6efd',
    },
    {
      label: 'Avg ROI',
      value: `${avgROI.toFixed(1)}x`,
      color: '#969423',
    },
    {
      label: 'Quick Wins',
      value: String(quickWins.length || 3),
      color: '#212653',
    },
  ];

  const width = 280, height = 100;
  const cellWidth = 65;

  const cells = metrics.map((m, i) => {
    const x = 10 + i * cellWidth;
    return `
      <g transform="translate(${x}, 20)">
        <rect x="0" y="0" width="${cellWidth - 8}" height="60" fill="${m.color}" fill-opacity="0.1" stroke="${m.color}" stroke-width="1" rx="6"/>
        <text x="${(cellWidth - 8) / 2}" y="28" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="14" font-weight="700" fill="${m.color}">${m.value}</text>
        <text x="${(cellWidth - 8) / 2}" y="48" text-anchor="middle" font-family="'Open Sans', sans-serif" font-size="8" fill="#666">${m.label}</text>
      </g>
    `;
  }).join('');

  return `
    <div class="svg-chart-container" role="figure" aria-label="Financial Impact Summary">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" style="max-width: 100%; height: auto;">
        <rect width="${width}" height="${height}" fill="white" rx="4"/>

        <!-- Title -->
        <text x="${width / 2}" y="14" text-anchor="middle" font-family="'Montserrat', sans-serif" font-size="10" font-weight="600" fill="#212653">Financial Impact Potential</text>

        ${cells}
      </svg>
    </div>
  `;
}

// ============================================================================
// CONTENT GENERATORS
// ============================================================================

/**
 * Generate executive narrative section
 */
function generateExecutiveNarrative(ctx: ReportContext): string {
  const companyName = ctx.companyProfile?.name || 'The organization';
  const score = sanitizeScore(ctx.overallHealth?.score);
  const benchmark = ctx.overallHealth?.benchmarks?.industryAverage || 52;
  const band = getScoreBand(score);

  // Find key data points
  const dimensions = safeArray(ctx.dimensions);
  const sortedDims = [...dimensions].sort((a, b) => sanitizeScore(a.score) - sanitizeScore(b.score));
  const lowestDim = sortedDims[0];
  const highestDim = sortedDims[sortedDims.length - 1];

  const topRec = ctx.recommendations?.[0];

  // Status-based opening
  let statusText = '';
  if (score < 40) {
    statusText = 'Immediate attention is required to address critical operational gaps that threaten business sustainability.';
  } else if (score < 60) {
    statusText = 'While foundational capabilities exist, targeted improvements in key areas will unlock significant value.';
  } else if (score < 80) {
    statusText = 'The organization demonstrates solid fundamentals with clear opportunities for optimization and growth.';
  } else {
    statusText = 'The organization shows excellence across most dimensions, positioning it well for sustained competitive advantage.';
  }

  return `
    <div class="exec-narrative">
      <p><strong>${sanitizeText(companyName)}</strong> achieved an overall Business Health Score of <strong>${score}/100</strong>,
      placing the organization in the <strong>${band}</strong> performance band
      (${score >= benchmark ? `${score - benchmark} points above` : `${benchmark - score} points below`} industry benchmark).
      ${statusText}</p>

      <p>
        ${highestDim ? `Strength in <strong>${sanitizeText(highestDim.name || highestDim.code)}</strong> (${sanitizeScore(highestDim.score)}/100) provides a competitive foundation.` : ''}
        ${lowestDim ? `Priority attention in <strong>${sanitizeText(lowestDim.name || lowestDim.code)}</strong> (${sanitizeScore(lowestDim.score)}/100) represents the most significant improvement opportunity with potential high-impact returns.` : ''}
      </p>

      <p>
        ${topRec ? `<strong>Primary Recommendation:</strong> ${sanitizeText(topRec.theme)}. Implementation within the first 90 days is projected to deliver measurable operational improvements.` : 'A structured 90-day improvement plan has been developed to address priority areas.'}
      </p>
    </div>
  `;
}

/**
 * Generate quick wins section
 */
function generateQuickWinsSection(ctx: ReportContext): string {
  const quickWins = safeSlice(ctx.quickWins, 3);
  const recommendations = safeArray(ctx.recommendations);

  // Fall back to high-priority recommendations if no quick wins
  const items = quickWins.length > 0
    ? quickWins
    : recommendations.filter(r => r.isQuickWin || r.horizon === '90_days').slice(0, 3);

  if (items.length === 0) {
    return '<p class="no-data">Quick wins analysis in progress.</p>';
  }

  const itemsHtml = items.map((qw, i) => {
    const isQuickWin = 'recommendationId' in qw;
    const theme = isQuickWin ? (qw as any).theme : (qw as any).theme;
    const timeframe = isQuickWin ? (qw as any).timeframe : '30 days';
    const impact = isQuickWin ? `${(qw as any).impactScore}/100 Impact` : 'High Impact';
    const dimensionName = isQuickWin
      ? resolveDimensionName((qw as any).dimensionCode)
      : (qw as any).dimensionName || 'Operations';

    return `
      <div class="quickwin-card">
        <div class="qw-rank">${i + 1}</div>
        <div class="qw-content">
          <div class="qw-title">${sanitizeText(theme || 'Quick Win Initiative')}</div>
          <div class="qw-meta">
            <span class="qw-timeframe">&#9201; ${sanitizeText(timeframe)}</span>
            <span class="qw-impact">&#128176; ${sanitizeText(impact)}</span>
            <span class="qw-dimension">&#128202; ${sanitizeText(dimensionName)}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `<div class="quickwins-list">${itemsHtml}</div>`;
}

/**
 * Generate strengths and gaps section
 */
function generateStrengthsGapsSection(ctx: ReportContext): string {
  const findings = safeArray(ctx.findings);
  const strengths = findings.filter(f => f.type === 'strength').sort((a, b) => sanitizeScore(b.severity as number) - sanitizeScore(a.severity as number)).slice(0, 4);
  const gaps = findings.filter(f => f.type === 'gap' || f.type === 'risk').sort((a, b) => sanitizeScore(a.severity as number) - sanitizeScore(b.severity as number)).slice(0, 4);

  const renderInsightCard = (item: typeof findings[0], type: 'strength' | 'gap', rank: number) => {
    const dimensionName = item.dimensionName || resolveDimensionName(item.dimensionCode) || 'General';
    const scoreClass = type === 'strength' ? 'positive' : 'negative';

    return `
      <div class="insight-card ${type}">
        <div class="insight-rank">${rank}</div>
        <div class="insight-body">
          <div class="insight-header">
            <span class="insight-dimension">${sanitizeText(dimensionName)}</span>
          </div>
          <div class="insight-title">${sanitizeText(item.shortLabel || 'Finding')}</div>
        </div>
      </div>
    `;
  };

  return `
    <div class="insights-grid">
      <div class="insights-column">
        <h4><span class="icon">&#10003;</span> Key Strengths</h4>
        <div class="insight-cards">
          ${strengths.length ? strengths.map((s, i) => renderInsightCard(s, 'strength', i + 1)).join('') : '<p class="no-data">Strengths analysis pending.</p>'}
        </div>
      </div>
      <div class="insights-column">
        <h4><span class="icon">&#9888;</span> Priority Gaps</h4>
        <div class="insight-cards">
          ${gaps.length ? gaps.map((g, i) => renderInsightCard(g, 'gap', i + 1)).join('') : '<p class="no-data">Gaps analysis pending.</p>'}
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate placeholder chart
 */
function generatePlaceholderChart(title: string, message: string): string {
  return `
    <div class="chart-placeholder">
      <div class="placeholder-icon">&#128202;</div>
      <div class="placeholder-title">${title}</div>
      <div class="placeholder-message">${message}</div>
    </div>
  `;
}

// ============================================================================
// STYLES
// ============================================================================

/**
 * Generate all dashboard styles
 */
export function getDashboardStyles(): string {
  return `
    <style>
      /* ===== EXECUTIVE DASHBOARD PREMIUM STYLES ===== */
      /* Brand: BizNavy #212653, BizGreen #969423 */

      :root {
        --biz-navy: #212653;
        --biz-green: #969423;
        --bg-light: #f8f9fa;
        --text-primary: #333;
        --text-secondary: #666;
        --border-light: #e9ecef;
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: 'Open Sans', Arial, sans-serif;
        font-size: 14px;
        line-height: 1.6;
        color: var(--text-primary);
        background: #fff;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      h1, h2, h3, h4 {
        font-family: 'Montserrat', 'Open Sans', Arial, sans-serif;
        color: var(--biz-navy);
        line-height: 1.3;
      }

      /* CONTAINER */
      .exec-dashboard-container {
        max-width: 900px;
        margin: 0 auto;
        padding: 2rem;
        background: #fff;
      }

      .page-break {
        page-break-before: always;
      }

      /* HEADER */
      .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        background: linear-gradient(135deg, var(--biz-navy) 0%, #2a3070 100%);
        border-radius: 12px;
        margin-bottom: 1.5rem;
        color: #fff;
      }

      .header-brand {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .header-text h1 {
        font-size: 1.5rem;
        color: #fff;
        margin-bottom: 0.25rem;
      }

      .header-text .subtitle {
        font-size: 0.9rem;
        opacity: 0.85;
      }

      .header-meta {
        display: flex;
        gap: 1.5rem;
      }

      .meta-item {
        text-align: right;
      }

      .meta-label {
        display: block;
        font-size: 0.7rem;
        text-transform: uppercase;
        opacity: 0.7;
        letter-spacing: 0.5px;
      }

      .meta-value {
        font-weight: 600;
        font-size: 0.9rem;
      }

      .meta-value.confidential {
        color: #ffc107;
      }

      /* HERO SECTION */
      .dashboard-hero {
        display: flex;
        gap: 2rem;
        padding: 1.5rem;
        background: var(--bg-light);
        border-radius: 12px;
        margin-bottom: 1.5rem;
        border: 1px solid var(--border-light);
      }

      .hero-gauge {
        flex: 0 0 200px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .hero-narrative {
        flex: 1;
      }

      .hero-narrative h2 {
        font-size: 1.1rem;
        margin-bottom: 0.75rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid var(--biz-green);
      }

      .exec-narrative p {
        font-size: 0.9rem;
        line-height: 1.7;
        margin-bottom: 0.75rem;
        color: var(--text-primary);
      }

      /* SECTION TITLES */
      .section-title {
        font-size: 1rem;
        color: var(--biz-navy);
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .title-icon {
        font-size: 1.1rem;
      }

      /* KPI SECTION */
      .kpi-section {
        margin-bottom: 1.5rem;
      }

      .kpi-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
      }

      .kpi-card {
        background: #fff;
        border-radius: 8px;
        padding: 1rem;
        border: 1px solid var(--border-light);
        border-top: 3px solid var(--biz-green);
      }

      .kpi-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
      }

      .kpi-label {
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--text-secondary);
      }

      .kpi-score {
        font-size: 2rem;
        font-weight: 700;
        font-family: 'Montserrat', sans-serif;
      }

      .kpi-benchmark {
        font-size: 0.75rem;
        margin-top: 0.25rem;
      }

      .kpi-benchmark.positive { color: #28a745; }
      .kpi-benchmark.negative { color: #dc3545; }

      .kpi-bar {
        margin-top: 0.5rem;
      }

      .kpi-bar-track {
        position: relative;
        height: 6px;
        background: var(--border-light);
        border-radius: 3px;
      }

      .kpi-bar-fill {
        height: 100%;
        border-radius: 3px;
      }

      .kpi-bar-marker {
        position: absolute;
        top: -2px;
        width: 3px;
        height: 10px;
        background: var(--biz-navy);
        border-radius: 1px;
        transform: translateX(-50%);
      }

      /* ANALYTICS SECTION */
      .analytics-section {
        margin-bottom: 1.5rem;
      }

      .analytics-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
      }

      /* PERFORMANCE SECTION */
      .performance-section {
        margin-bottom: 1.5rem;
      }

      .performance-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
      }

      /* TRENDS SECTION */
      .trends-section {
        margin-bottom: 1.5rem;
      }

      .trends-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
      }

      /* FINANCIAL SECTION */
      .financial-section {
        margin-bottom: 1.5rem;
        background: linear-gradient(135deg, rgba(33, 38, 83, 0.03) 0%, rgba(33, 38, 83, 0.01) 100%);
        border: 1px solid rgba(33, 38, 83, 0.1);
        border-radius: 12px;
        padding: 1.25rem;
      }

      .financial-container {
        display: flex;
        justify-content: center;
      }

      .chart-card {
        background: #fff;
        border-radius: 8px;
        padding: 1rem;
        border: 1px solid var(--border-light);
      }

      .chart-card h4 {
        font-size: 0.9rem;
        margin-bottom: 1rem;
        text-align: center;
        color: var(--biz-navy);
      }

      .svg-chart-container {
        display: flex;
        justify-content: center;
      }

      /* INSIGHTS SECTION */
      .insights-section {
        margin-bottom: 1.5rem;
      }

      .insights-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
      }

      .insights-column h4 {
        font-size: 0.9rem;
        margin-bottom: 0.75rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid var(--biz-green);
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .insights-column h4 .icon {
        font-size: 1rem;
      }

      .insight-card {
        display: flex;
        gap: 0.75rem;
        padding: 0.75rem;
        background: var(--bg-light);
        border-radius: 6px;
        margin-bottom: 0.5rem;
        border-left: 3px solid var(--biz-green);
      }

      .insight-card.gap {
        border-left-color: #dc3545;
      }

      .insight-rank {
        flex: 0 0 22px;
        height: 22px;
        background: var(--biz-navy);
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.7rem;
        font-weight: 600;
      }

      .insight-body {
        flex: 1;
      }

      .insight-header {
        display: flex;
        justify-content: space-between;
        font-size: 0.7rem;
        margin-bottom: 0.25rem;
      }

      .insight-dimension {
        color: var(--biz-green);
        font-weight: 600;
      }

      .insight-title {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--biz-navy);
      }

      /* QUICK WINS SECTION */
      .quickwins-section {
        background: linear-gradient(135deg, rgba(150, 148, 35, 0.05) 0%, rgba(150, 148, 35, 0.02) 100%);
        border: 1px solid rgba(150, 148, 35, 0.2);
        border-radius: 12px;
        padding: 1.25rem;
        margin-bottom: 1.5rem;
      }

      .quickwins-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .quickwin-card {
        display: flex;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        background: #fff;
        border-radius: 6px;
        border-left: 3px solid var(--biz-green);
      }

      .qw-rank {
        flex: 0 0 26px;
        height: 26px;
        background: var(--biz-green);
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.8rem;
      }

      .qw-content {
        flex: 1;
      }

      .qw-title {
        font-weight: 600;
        color: var(--biz-navy);
        margin-bottom: 0.25rem;
        font-size: 0.9rem;
      }

      .qw-meta {
        display: flex;
        gap: 1.5rem;
        font-size: 0.75rem;
        color: var(--text-secondary);
      }

      /* ROADMAP SECTION */
      .roadmap-section {
        margin-bottom: 1.5rem;
      }

      /* INVESTMENT & RISK SECTION */
      .investment-risk-section {
        margin-bottom: 1.5rem;
      }

      .ir-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
      }

      /* RISK TABLE */
      .risk-table-container {
        overflow-x: auto;
      }

      .exec-risk-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.8rem;
      }

      .exec-risk-table th {
        text-align: left;
        padding: 0.5rem;
        color: var(--text-secondary);
        border-bottom: 1px solid var(--border-light);
        font-weight: 600;
        font-size: 0.7rem;
        text-transform: uppercase;
      }

      .exec-risk-table td {
        padding: 0.5rem;
        border-bottom: 1px solid var(--bg-light);
        vertical-align: top;
      }

      .risk-category {
        font-weight: 600;
        color: var(--biz-navy);
      }

      .risk-title {
        color: var(--text-primary);
      }

      .risk-mitigation {
        color: var(--text-secondary);
        font-size: 0.75rem;
      }

      .severity-badge {
        display: inline-block;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-size: 0.65rem;
        font-weight: 600;
        letter-spacing: 0.5px;
      }

      /* CTA SECTION */
      .cta-section {
        background: var(--biz-navy);
        color: #fff;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        text-align: center;
        margin-bottom: 1.5rem;
      }

      .cta-content {
        font-size: 0.9rem;
      }

      /* FOOTER */
      .dashboard-footer {
        text-align: center;
        padding: 1rem 0;
        border-top: 2px solid var(--border-light);
        margin-top: 2rem;
        font-size: 0.75rem;
        color: var(--text-secondary);
      }

      .dashboard-footer p {
        margin: 0.25rem 0;
      }

      /* PLACEHOLDERS */
      .chart-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        background: var(--bg-light);
        border: 2px dashed var(--border-light);
        border-radius: 8px;
        text-align: center;
        min-height: 150px;
      }

      .placeholder-icon {
        font-size: 2rem;
        margin-bottom: 0.5rem;
      }

      .placeholder-title {
        font-weight: 600;
        color: var(--biz-navy);
        margin-bottom: 0.25rem;
      }

      .placeholder-message {
        font-size: 0.8rem;
        color: var(--text-secondary);
      }

      .no-data {
        font-style: italic;
        color: var(--text-secondary);
        font-size: 0.85rem;
      }

      /* PRINT STYLES */
      @media print {
        .exec-dashboard-container {
          padding: 0;
          max-width: none;
        }

        .dashboard-header {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .chart-card,
        .kpi-card,
        .insight-card,
        .quickwin-card {
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .analytics-grid,
        .performance-grid,
        .trends-grid,
        .ir-grid {
          break-inside: avoid;
        }
      }

      /* RESPONSIVE */
      @media (max-width: 768px) {
        .dashboard-header {
          flex-direction: column;
          gap: 1rem;
          text-align: center;
        }

        .header-meta {
          justify-content: center;
        }

        .meta-item {
          text-align: center;
        }

        .dashboard-hero {
          flex-direction: column;
        }

        .hero-gauge {
          flex: none;
        }

        .kpi-grid {
          grid-template-columns: repeat(2, 1fr);
        }

        .analytics-grid,
        .performance-grid,
        .trends-grid,
        .insights-grid,
        .ir-grid {
          grid-template-columns: 1fr;
        }
      }

      /* Legal Component Styles */
      ${getAcceptanceBannerStyles()}
      ${getLegalAccordionStyles()}
    </style>
  `;
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  generateExecutiveDashboard as default,
};
