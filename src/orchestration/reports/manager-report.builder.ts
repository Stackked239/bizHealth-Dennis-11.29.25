/**
 * Manager Report Builder
 *
 * Generates enhanced Manager Reports using TypeScript-based recipes
 * and dedicated section renderers. This builder replaces the JSON
 * recipe-based approach with a more robust, type-safe implementation.
 *
 * Features:
 * - TypeScript recipe definitions with discriminated union section types
 * - Safe extraction utilities preventing null/undefined in output
 * - Dimension-filtered content for manager-specific relevance
 * - Rich visual components (cards, metrics, roadmaps)
 * - Brand-compliant styling (BizNavy, BizGreen)
 *
 * @module manager-report.builder
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import type {
  ReportContext,
  ReportRenderOptions,
  GeneratedReport,
  ReportMeta,
  Phase5ReportType,
} from '../../types/report.types.js';
import type { ManagerRecipeSection, ManagerReportRecipe } from './config/section-types.js';
import {
  getManagerRecipe,
  isManagerReport,
  MANAGER_RECIPES,
} from './config/manager-recipes.js';
import {
  renderCompanySnapshotSection,
  renderDimensionDeepDiveSection,
  renderQuickWinsHighlightSection,
  renderDepartmentRoadmapSection,
  renderRiskOverviewSection,
  renderMetricsDashboardSection,
  renderManagerClosingSection,
  renderCategoryAnalysisSection,
} from './components/sections/index.js';

import type { CategoryAnalysisSection } from './config/section-types.js';
import {
  wrapHtmlDocument,
  escapeHtml,
} from './html-template.js';
import { safeStringValue, safeScoreBandColor } from './utils/safe-extract.js';
import { getDimensionsForManager, calculateDepartmentScore, MANAGER_TITLES, type ManagerType } from './utils/dimension-filters.js';
import { logger } from '../../utils/logger.js';

// ============================================================================
// SECTION DISPATCH
// ============================================================================

/**
 * Render a section based on its type using discriminated union dispatch
 */
function renderSection(
  ctx: ReportContext,
  section: ManagerRecipeSection,
  recipe: ManagerReportRecipe
): string {
  switch (section.type) {
    case 'companySnapshot':
      return renderCompanySnapshotSection(ctx, section, recipe);

    case 'dimensionDeepDive':
      return renderDimensionDeepDiveSection(ctx, section);

    case 'quickWinsHighlight':
      return renderQuickWinsHighlightSection(ctx, section);

    case 'departmentRoadmap':
      return renderDepartmentRoadmapSection(ctx, section);

    case 'riskOverview':
      return renderRiskOverviewSection(ctx, section);

    case 'metricsDashboard':
      return renderMetricsDashboardSection(ctx, section);

    case 'managerClosing':
      return renderManagerClosingSection(ctx, section, recipe);

    case 'categoryAnalysis':
      return renderCategoryAnalysisSection(ctx, section as CategoryAnalysisSection);

    case 'recommendationsSummary':
    case 'findingsOverview':
    case 'generic':
    default:
      // Fallback for legacy or unimplemented section types
      return renderGenericSection(ctx, section);
  }
}

/**
 * Generic fallback section renderer
 */
function renderGenericSection(
  _ctx: ReportContext,
  section: ManagerRecipeSection
): string {
  const title = safeStringValue(section.title, 'Section');

  return `
    <section id="${section.id}" class="report-section generic-section" style="padding: 2rem; margin-bottom: 2rem;">
      <h2 style="
        font-family: 'Montserrat', sans-serif;
        font-size: 1.5rem;
        font-weight: 700;
        color: #212653;
        margin: 0 0 1.5rem 0;
        padding-bottom: 0.5rem;
        border-bottom: 3px solid #969423;
      ">${escapeHtml(title)}</h2>
      <p style="color: #6b7280;">Section content is being developed.</p>
    </section>
  `;
}

// ============================================================================
// COVER PAGE & DOCUMENT STRUCTURE
// ============================================================================

/**
 * Generate manager report cover page
 */
function generateManagerCoverPage(
  ctx: ReportContext,
  recipe: ManagerReportRecipe
): string {
  const companyName = safeStringValue(ctx.companyProfile?.name, 'Your Company');
  const industry = safeStringValue(ctx.companyProfile?.industry, 'Business');
  const generatedAt = ctx.metadata?.generatedAt || new Date().toISOString();
  const formattedDate = new Date(generatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Get department health score
  const managerType = recipe.managerType as ManagerType;
  const dimensions = getDimensionsForManager(ctx, managerType);
  const { score: deptScore, band: deptBand } = calculateDepartmentScore(dimensions);
  const managerTitle = MANAGER_TITLES[managerType] || 'Department';

  return `
    <div class="cover-page" style="
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #212653 0%, #2d3561 100%);
      color: white;
      padding: 3rem;
      text-align: center;
      page-break-after: always;
    ">
      <!-- Logo placeholder -->
      <div style="
        font-family: 'Montserrat', sans-serif;
        font-size: 2rem;
        font-weight: 700;
        color: #969423;
        margin-bottom: 2rem;
      ">BizHealth.ai</div>

      <!-- Report Title -->
      <h1 style="
        font-family: 'Montserrat', sans-serif;
        font-size: 2.5rem;
        font-weight: 700;
        color: white;
        margin: 0 0 0.75rem 0;
        line-height: 1.2;
      ">${escapeHtml(recipe.title)}</h1>

      <!-- Subtitle -->
      <p style="
        font-size: 1.125rem;
        color: #969423;
        margin: 0 0 2.5rem 0;
        font-style: italic;
      ">${escapeHtml(recipe.subtitle)}</p>

      <!-- Company Name -->
      <div style="
        font-family: 'Montserrat', sans-serif;
        font-size: 1.75rem;
        font-weight: 600;
        color: white;
        margin-bottom: 0.5rem;
      ">${escapeHtml(companyName)}</div>

      <div style="
        font-size: 1rem;
        color: rgba(255,255,255,0.7);
        margin-bottom: 3rem;
      ">${escapeHtml(industry)}</div>

      <!-- Department Score Card -->
      <div style="
        background: rgba(255,255,255,0.1);
        border: 2px solid ${safeScoreBandColor(deptScore)};
        border-radius: 16px;
        padding: 2rem 3rem;
        margin-bottom: 3rem;
      ">
        <div style="
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.7);
          margin-bottom: 0.5rem;
        ">${escapeHtml(managerTitle)} Health Score</div>
        <div style="
          font-size: 4rem;
          font-weight: 700;
          color: ${safeScoreBandColor(deptScore)};
          line-height: 1;
        ">${deptScore}</div>
        <div style="
          display: inline-block;
          padding: 0.375rem 1.25rem;
          background: ${safeScoreBandColor(deptScore)};
          color: white;
          border-radius: 2rem;
          font-size: 0.875rem;
          font-weight: 600;
          margin-top: 0.75rem;
        ">${deptBand}</div>
      </div>

      <!-- Coach Persona -->
      <div style="
        font-size: 1rem;
        color: rgba(255,255,255,0.8);
        margin-bottom: 1rem;
      ">Prepared by your ${escapeHtml(recipe.persona)}</div>

      <!-- Date -->
      <div style="
        font-size: 0.875rem;
        color: rgba(255,255,255,0.6);
      ">${formattedDate}</div>
    </div>
  `;
}

/**
 * Generate table of contents for manager report
 */
function generateManagerTOC(recipe: ManagerReportRecipe): string {
  return `
    <div class="toc-page" style="
      padding: 3rem 2rem;
      page-break-after: always;
    ">
      <h2 style="
        font-family: 'Montserrat', sans-serif;
        font-size: 1.75rem;
        font-weight: 700;
        color: #212653;
        margin: 0 0 2rem 0;
        padding-bottom: 0.75rem;
        border-bottom: 3px solid #969423;
      ">Contents</h2>

      <nav style="font-size: 1.0625rem;">
        <ol style="
          list-style: none;
          padding: 0;
          margin: 0;
          counter-reset: toc-counter;
        ">
          ${recipe.sections.map((section, index) => `
            <li style="
              counter-increment: toc-counter;
              padding: 0.875rem 0;
              border-bottom: 1px solid #f3f4f6;
              display: flex;
              align-items: center;
            ">
              <span style="
                display: inline-block;
                width: 2rem;
                height: 2rem;
                background: #212653;
                color: white;
                border-radius: 50%;
                text-align: center;
                line-height: 2rem;
                font-size: 0.875rem;
                font-weight: 600;
                margin-right: 1rem;
                flex-shrink: 0;
              ">${index + 1}</span>
              <a href="#${section.id}" style="
                color: #212653;
                text-decoration: none;
                font-weight: 500;
                flex: 1;
              ">${escapeHtml(section.title)}</a>
            </li>
          `).join('')}
        </ol>
      </nav>

      <div style="
        margin-top: 2rem;
        padding: 1.25rem;
        background: #f9fafb;
        border-radius: 8px;
        font-size: 0.9375rem;
        color: #6b7280;
      ">
        <strong>About This Report:</strong> This personalized manager report focuses on the dimensions
        most relevant to your role. Use this guide to identify quick wins, plan improvements,
        and track progress over time.
      </div>
    </div>
  `;
}

/**
 * Generate manager report footer
 */
function generateManagerFooter(ctx: ReportContext, recipe: ManagerReportRecipe): string {
  const year = new Date().getFullYear();
  const runId = ctx.runId || 'N/A';

  return `
    <footer style="
      padding: 2rem;
      margin-top: 2rem;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      font-size: 0.875rem;
      color: #6b7280;
    ">
      <p style="margin: 0 0 0.5rem 0;">
        <strong>${escapeHtml(recipe.title)}</strong> — ${escapeHtml(ctx.companyProfile?.name || 'Company')}
      </p>
      <p style="margin: 0 0 0.5rem 0;">
        &copy; ${year} BizHealth.ai — Confidential Business Assessment
      </p>
      <p style="margin: 0; font-size: 0.75rem; color: #9ca3af;">
        Assessment ID: ${runId}
      </p>
    </footer>
  `;
}

// ============================================================================
// CUSTOM STYLES
// ============================================================================

/**
 * Generate custom CSS for manager reports
 */
function generateManagerReportStyles(_options: ReportRenderOptions): string {
  return `
    /* Manager Report Custom Styles */

    /* Brand Colors */
    :root {
      --biz-navy: #212653;
      --biz-green: #969423;
      --biz-excellence: #059669;
      --biz-proficiency: #2563eb;
      --biz-attention: #d97706;
      --biz-critical: #dc2626;
    }

    /* Typography */
    body {
      font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.6;
      color: #374151;
    }

    h1, h2, h3, h4, h5 {
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
      color: var(--biz-navy);
    }

    /* Report Sections */
    .report-section {
      page-break-inside: avoid;
      margin-bottom: 2rem;
    }

    /* Score Bands */
    .band-excellence { color: var(--biz-excellence); }
    .band-proficiency { color: var(--biz-proficiency); }
    .band-attention { color: var(--biz-attention); }
    .band-critical { color: var(--biz-critical); }

    .bg-band-excellence { background: var(--biz-excellence); color: white; }
    .bg-band-proficiency { background: var(--biz-proficiency); color: white; }
    .bg-band-attention { background: var(--biz-attention); color: white; }
    .bg-band-critical { background: var(--biz-critical); color: white; }

    /* Cards */
    .manager-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1rem;
      page-break-inside: avoid;
    }

    /* Print Optimization */
    @media print {
      .cover-page {
        min-height: auto;
        height: 100vh;
      }

      .toc-page {
        page-break-after: always;
      }

      .report-section {
        page-break-inside: avoid;
      }

      h2 {
        page-break-after: avoid;
      }

      /* Ensure colors print */
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }

    /* Responsive Grid */
    @media (max-width: 768px) {
      .cover-page {
        padding: 2rem 1rem;
      }

      h1 {
        font-size: 1.75rem;
      }
    }
  `;
}

// ============================================================================
// MAIN BUILDER FUNCTION
// ============================================================================

/**
 * Build a Manager Report using TypeScript recipes
 */
export async function buildManagerReport(
  ctx: ReportContext,
  options: ReportRenderOptions,
  reportType: Phase5ReportType
): Promise<GeneratedReport> {
  // Get recipe for this report type
  const recipe = getManagerRecipe(reportType);

  if (!recipe) {
    throw new Error(`No recipe found for report type: ${reportType}`);
  }

  logger.info(`Building ${recipe.title} for ${ctx.companyProfile?.name || 'Company'}`);

  // Generate cover page
  const coverPage = generateManagerCoverPage(ctx, recipe);

  // Generate table of contents
  const toc = generateManagerTOC(recipe);

  // Render all sections
  const sectionsHtml = recipe.sections.map(section => {
    try {
      return renderSection(ctx, section, recipe);
    } catch (error) {
      logger.error(`Error rendering section ${section.id}:`, error);
      return renderGenericSection(ctx, section);
    }
  }).join('\n');

  // Generate footer
  const footer = generateManagerFooter(ctx, recipe);

  // Assemble the document
  const content = `
    ${coverPage}
    ${toc}
    <main class="manager-report-content" style="padding: 2rem;">
      ${sectionsHtml}
    </main>
    ${footer}
  `;

  // Wrap in HTML document
  const html = wrapHtmlDocument(content, {
    title: `${recipe.title} - ${ctx.companyProfile?.name || 'Company'}`,
    brand: options.brand,
    customCSS: generateManagerReportStyles(options),
    ctx: ctx,
    legalAccess: ctx.legalAccess,
  });

  // Write HTML file
  const htmlPath = path.join(options.outputDir, `${reportType}.html`);
  await fs.writeFile(htmlPath, html, 'utf-8');

  // Generate metadata
  const meta: ReportMeta = {
    reportType,
    reportName: recipe.title,
    generatedAt: new Date().toISOString(),
    companyName: ctx.companyProfile?.name || 'Company',
    runId: ctx.runId,
    healthScore: ctx.overallHealth?.score || 0,
    healthBand: ctx.overallHealth?.band || 'Attention',
    pageSuggestionEstimate: recipe.targetPages?.max || 12,
    sections: recipe.sections.map(s => ({
      id: s.id,
      title: s.title,
    })),
    brand: {
      primaryColor: options.brand.primaryColor,
      accentColor: options.brand.accentColor,
    },
  };

  const metaPath = path.join(options.outputDir, `${reportType}.meta.json`);
  await fs.writeFile(metaPath, JSON.stringify(meta, null, 2), 'utf-8');

  logger.info(`Successfully generated ${recipe.title} at ${htmlPath}`);

  return {
    reportType,
    reportName: recipe.title,
    htmlPath,
    metaPath,
    generatedAt: meta.generatedAt,
  };
}

// ============================================================================
// INDIVIDUAL REPORT BUILDERS
// ============================================================================

/**
 * Build Operations Manager Report
 */
export async function buildManagersOperationsReport(
  ctx: ReportContext,
  options: ReportRenderOptions
): Promise<GeneratedReport> {
  return buildManagerReport(ctx, options, 'managersOperations');
}

/**
 * Build Sales & Marketing Manager Report
 */
export async function buildManagersSalesMarketingReport(
  ctx: ReportContext,
  options: ReportRenderOptions
): Promise<GeneratedReport> {
  return buildManagerReport(ctx, options, 'managersSalesMarketing');
}

/**
 * Build Financials Manager Report
 */
export async function buildManagersFinancialsReport(
  ctx: ReportContext,
  options: ReportRenderOptions
): Promise<GeneratedReport> {
  return buildManagerReport(ctx, options, 'managersFinancials');
}

/**
 * Build Strategy Manager Report
 */
export async function buildManagersStrategyReport(
  ctx: ReportContext,
  options: ReportRenderOptions
): Promise<GeneratedReport> {
  return buildManagerReport(ctx, options, 'managersStrategy');
}

/**
 * Build IT & Technology Manager Report
 */
export async function buildManagersItTechnologyReport(
  ctx: ReportContext,
  options: ReportRenderOptions
): Promise<GeneratedReport> {
  return buildManagerReport(ctx, options, 'managersItTechnology');
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  getManagerRecipe,
  isManagerReport,
  MANAGER_RECIPES,
};
