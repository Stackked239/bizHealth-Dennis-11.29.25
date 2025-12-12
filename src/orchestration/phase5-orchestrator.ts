/**
 * Phase 5 Orchestrator - Report Generation
 *
 * Generates branded, executive-ready HTML (and optionally PDF) reports from
 * Phase 3 + Phase 4 outputs. Uses the IDM and master-analysis JSON as canonical inputs.
 *
 * Report Types Generated (17 total):
 *
 * Core Reports:
 * 1. Comprehensive Assessment Report
 * 2. Business Owner Report
 * 3. Executive Brief
 * 4. Quick Wins Action Plan
 * 5. Risk Assessment Report
 * 6. Implementation Roadmap
 * 7. Financial Impact Analysis
 *
 * Deep Dive Reports:
 * 8. Deep Dive: Growth Engine
 * 9. Deep Dive: Performance & Health
 * 10. Deep Dive: People & Leadership
 * 11. Deep Dive: Resilience & Safeguards
 *
 * Recipe-Based Reports (from config/report-recipes/):
 * 12. Employee Business Health Summary
 * 13. Operations Manager Report
 * 14. Sales & Marketing Manager Report
 * 15. Financial Manager Report
 * 16. Strategy Manager Report
 * 17. IT & Technology Manager Report
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import pino from 'pino';
import { createLogger } from '../utils/logger.js';
import type { IDM, ChapterCode, DimensionCode } from '../types/idm.types.js';
import { DIMENSION_METADATA, CHAPTER_NAMES, getScoreBand as idmGetScoreBand } from '../types/idm.types.js';
import type {
  ReportContext,
  ReportCompanyProfile,
  ReportOverallHealth,
  ReportChapter,
  ReportDimension,
  ReportFinding,
  ReportRecommendation,
  ReportRisk,
  ReportQuickWin,
  ReportRoadmap,
  ReportRenderOptions,
  GeneratedReport,
  ReportBuilderRegistration,
  Phase5ReportType,
  ReportManifest,
  BrandConfig,
  ReportMeta,
  LegalAccessConfig,
} from '../types/report.types.js';
import { DEFAULT_BRAND, formatHorizon, getScoreBand } from '../types/report.types.js';
import { NarrativeExtractionService, NarrativeContent } from '../services/narrative-extraction.service.js';
import { reportsConfig, getCurrentTermsVersion } from '../config/reports.config.js';

// Import report builders
import { buildComprehensiveReport } from './reports/comprehensive-report.builder.js';
import { buildOwnersReport } from './reports/owners-report.builder.js';
import { buildExecutiveBrief } from './reports/executive-brief.builder.js';
import { buildQuickWinsReport } from './reports/quick-wins-report.builder.js';
import { buildRiskReport } from './reports/risk-report.builder.js';
import { buildRoadmapReport } from './reports/roadmap-report.builder.js';
import { buildFinancialReport } from './reports/financial-report.builder.js';
import { buildDeepDiveReport } from './reports/deep-dive-report.builder.js';

// Import recipe-based report builders (employees only)
import {
  buildEmployeesReport,
} from './reports/recipe-report.builder.js';

// Import TypeScript-based manager report builders
import {
  buildManagersOperationsReport,
  buildManagersSalesMarketingReport,
  buildManagersFinancialsReport,
  buildManagersStrategyReport,
  buildManagersItTechnologyReport,
} from './reports/manager-report.builder.js';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Phase 5 report quality metrics
 */
export interface ReportQualityMetrics {
  /** Total SVG visualization count */
  svgCount: number;
  /** Total bold element count */
  boldCount: number;
  /** Total section divider count */
  dividerCount: number;
  /** Total list item count */
  listItemCount: number;
  /** Total table count */
  tableCount: number;
  /** Estimated page count */
  pageEstimate: number;
  /** Word count */
  wordCount: number;
  /** Quality thresholds met */
  meetsTargets: {
    visualizations: boolean;  // Target: 50+
    boldElements: boolean;    // Target: <200
    dividers: boolean;        // Target: <30
  };
}

/**
 * Phase 5 orchestrator configuration
 */
export interface Phase5OrchestratorConfig {
  /** Logger instance */
  logger?: pino.Logger;
  /** Enable PDF rendering */
  renderPDF?: boolean;
  /** Custom brand configuration */
  brand?: Partial<BrandConfig>;
  /** Report types to generate (defaults to all) */
  reportTypes?: Phase5ReportType[];
  /** Enable quality validation (defaults to true) */
  validateQuality?: boolean;
  /** Quality thresholds */
  qualityThresholds?: {
    minVisualizations?: number;
    maxBoldElements?: number;
    maxDividers?: number;
  };
}

/**
 * Phase 5 execution result
 */
export interface Phase5Results {
  phase: 'phase_5';
  status: 'complete' | 'partial' | 'failed';
  runId: string;
  companyName: string;
  reportsGenerated: number;
  reports: GeneratedReport[];
  outputDir: string;
  manifestPath: string;
  metadata: {
    startedAt: string;
    completedAt: string;
    durationMs: number;
    pipelineVersion: string;
  };
  /** Quality metrics for each report */
  qualityMetrics?: Record<Phase5ReportType, ReportQualityMetrics>;
  /** Aggregated quality summary */
  qualitySummary?: {
    totalVisualizations: number;
    totalBoldElements: number;
    totalDividers: number;
    reportsPassingThresholds: number;
    totalReports: number;
  };
  errors?: Array<{ reportType: Phase5ReportType; error: string }>;
}

// ============================================================================
// PHASE 5 ORCHESTRATOR
// ============================================================================

export class Phase5Orchestrator {
  private logger: pino.Logger;
  private config: Phase5OrchestratorConfig;
  private brand: BrandConfig;

  constructor(config: Phase5OrchestratorConfig = {}) {
    this.logger = config.logger || createLogger('phase5-orchestrator');
    this.config = config;
    this.brand = {
      ...DEFAULT_BRAND,
      ...config.brand,
    };
  }

  /**
   * Execute Phase 5 - Generate all reports
   */
  async executePhase5(outputDir: string, runId?: string): Promise<Phase5Results> {
    const startTime = Date.now();
    const startedAt = new Date().toISOString();

    this.logger.info('Starting Phase 5: Report Generation');

    try {
      // Load all phase outputs including Phase 1 & 2 for narrative content
      const { phase0Data, phase1Data, phase2Data, phase3Data, phase4Data, idm, companyProfile, detectedRunId } = await this.loadPhaseOutputs(outputDir);
      const effectiveRunId = runId || detectedRunId;

      // Build ReportContext from loaded data with narrative content
      const ctx = this.buildReportContext(phase1Data, phase2Data, phase3Data, phase4Data, idm, companyProfile, effectiveRunId);

      // Create reports output directory
      const reportsDir = path.join(outputDir, 'reports', effectiveRunId);
      await fs.mkdir(reportsDir, { recursive: true });

      // Prepare render options
      const options: ReportRenderOptions = {
        outputDir: reportsDir,
        brand: this.brand,
        includeTOC: true,
        includePageNumbers: true,
        includeHeaderFooter: true,
        renderPDF: this.config.renderPDF ?? false,
      };

      // Get report builders to execute
      const builders = this.getReportBuilders();
      const reportTypesToGenerate = this.config.reportTypes || builders.map(b => b.type);

      // Generate reports
      const reports: GeneratedReport[] = [];
      const errors: Array<{ reportType: Phase5ReportType; error: string }> = [];
      const qualityMetrics: Record<Phase5ReportType, ReportQualityMetrics> = {} as Record<Phase5ReportType, ReportQualityMetrics>;
      const shouldValidate = this.config.validateQuality !== false;

      this.logger.info({ reportTypes: reportTypesToGenerate, validateQuality: shouldValidate }, `Generating ${reportTypesToGenerate.length} reports`);

      // Generate reports sequentially to manage memory
      for (const type of reportTypesToGenerate) {
        const builder = builders.find(b => b.type === type);
        if (!builder) {
          this.logger.warn({ type }, 'No builder found for report type');
          continue;
        }

        try {
          this.logger.info({ type: builder.type, name: builder.name }, 'Generating report');
          const report = await builder.build(ctx, options);
          reports.push(report);
          this.logger.info({ type: builder.type, htmlPath: report.htmlPath }, 'Report generated successfully');

          // Validate report quality if enabled
          if (shouldValidate && report.htmlPath) {
            try {
              const metrics = await this.validateReportQuality(report.htmlPath);
              qualityMetrics[builder.type] = metrics;
              this.logQualityMetrics(builder.type, metrics);
            } catch (validationError) {
              this.logger.warn({ type: builder.type, error: validationError }, 'Failed to validate report quality');
            }
          }
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : String(error);
          const errorStack = error instanceof Error ? error.stack : undefined;
          this.logger.error({ type: builder.type, error: errorMsg, stack: errorStack }, 'Failed to generate report');
          errors.push({ reportType: builder.type, error: errorMsg });
        }
      }

      // Generate manifest
      const manifestPath = path.join(reportsDir, 'manifest.json');
      const manifest = this.generateManifest(ctx, reports, effectiveRunId);
      await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
      this.logger.info({ manifestPath }, 'Report manifest generated');

      const completedAt = new Date().toISOString();
      const durationMs = Date.now() - startTime;

      // Generate quality summary if validation was performed
      const qualitySummary = shouldValidate && Object.keys(qualityMetrics).length > 0
        ? this.generateQualitySummary(qualityMetrics)
        : undefined;

      const results: Phase5Results = {
        phase: 'phase_5',
        status: errors.length === 0 ? 'complete' : reports.length > 0 ? 'partial' : 'failed',
        runId: effectiveRunId,
        companyName: ctx.companyProfile.name,
        reportsGenerated: reports.length,
        reports,
        outputDir: reportsDir,
        manifestPath,
        metadata: {
          startedAt,
          completedAt,
          durationMs,
          pipelineVersion: '1.5.0',
        },
      };

      // Add quality metrics to results
      if (shouldValidate && Object.keys(qualityMetrics).length > 0) {
        results.qualityMetrics = qualityMetrics;
        results.qualitySummary = qualitySummary;
      }

      if (errors.length > 0) {
        results.errors = errors;
      }

      // Log quality summary
      if (qualitySummary) {
        this.logger.info({
          totalVisualizations: qualitySummary.totalVisualizations,
          totalBoldElements: qualitySummary.totalBoldElements,
          totalDividers: qualitySummary.totalDividers,
          reportsPassingThresholds: `${qualitySummary.reportsPassingThresholds}/${qualitySummary.totalReports}`,
        }, 'Phase 5 Quality Summary');
      }

      this.logger.info({
        reportsGenerated: reports.length,
        errors: errors.length,
        durationMs,
        qualityValidation: shouldValidate,
      }, 'Phase 5 complete');

      return results;

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      this.logger.error({ error: errorMsg }, 'Phase 5 failed');
      throw error;
    }
  }

  /**
   * Load all phase outputs for report generation
   * Now includes Phase 1 and Phase 2 for narrative content
   */
  private async loadPhaseOutputs(outputDir: string): Promise<{
    phase0Data: any;
    phase1Data: any;
    phase2Data: any;
    phase3Data: any;
    phase4Data: any;
    idm: IDM;
    companyProfile: any;
    detectedRunId: string;
  }> {
    // Load Phase 0 output (for company profile)
    const phase0Path = path.join(outputDir, 'phase0_output.json');
    let phase0Data: any = null;
    try {
      phase0Data = JSON.parse(await fs.readFile(phase0Path, 'utf-8'));
      this.logger.info('Loaded Phase 0 output');
    } catch (error) {
      this.logger.warn('Phase 0 output not found, will extract company profile from other sources');
    }

    // Load Phase 1 output (for Tier 1 & Tier 2 narrative content)
    const phase1Path = path.join(outputDir, 'phase1_output.json');
    let phase1Data: any = null;
    try {
      phase1Data = JSON.parse(await fs.readFile(phase1Path, 'utf-8'));
      this.logger.info('Loaded Phase 1 output for narrative content');
    } catch (error) {
      this.logger.warn('Phase 1 output not found, narrative content will be limited');
    }

    // Load Phase 2 output (for cross-dimensional analysis narrative content)
    const phase2Path = path.join(outputDir, 'phase2_output.json');
    let phase2Data: any = null;
    try {
      phase2Data = JSON.parse(await fs.readFile(phase2Path, 'utf-8'));
      this.logger.info('Loaded Phase 2 output for narrative content');
    } catch (error) {
      this.logger.warn('Phase 2 output not found, narrative content will be limited');
    }

    // Load Phase 3 output
    const phase3Path = path.join(outputDir, 'phase3_output.json');
    const phase3Data = JSON.parse(await fs.readFile(phase3Path, 'utf-8'));
    this.logger.info('Loaded Phase 3 output');

    // Load Phase 4 output
    const phase4Path = path.join(outputDir, 'phase4_output.json');
    let phase4Data: any = null;
    try {
      phase4Data = JSON.parse(await fs.readFile(phase4Path, 'utf-8'));
      this.logger.info('Loaded Phase 4 output');
    } catch (error) {
      this.logger.warn('Phase 4 output not found, will use Phase 3 data only');
    }

    // Load IDM - try multiple locations
    let idm: IDM | null = null;
    const idmPaths = [
      path.join(outputDir, 'idm_output.json'),
      path.join(outputDir, 'phase4', 'idm-*.json'),
    ];

    for (const idmPath of idmPaths) {
      try {
        if (idmPath.includes('*')) {
          // Glob pattern - find most recent file
          const dir = path.dirname(idmPath);
          const pattern = path.basename(idmPath);
          const files = await fs.readdir(dir);
          const matchingFiles = files.filter(f => f.startsWith('idm-') && f.endsWith('.json'));
          if (matchingFiles.length > 0) {
            const latestFile = matchingFiles.sort().pop()!;
            idm = JSON.parse(await fs.readFile(path.join(dir, latestFile), 'utf-8'));
            this.logger.info({ path: path.join(dir, latestFile) }, 'Loaded IDM');
            break;
          }
        } else {
          idm = JSON.parse(await fs.readFile(idmPath, 'utf-8'));
          this.logger.info({ path: idmPath }, 'Loaded IDM');
          break;
        }
      } catch {
        // Continue to next path
      }
    }

    if (!idm) {
      // Try to extract IDM from Phase 4 output
      if (phase4Data?.idm) {
        idm = phase4Data.idm;
        this.logger.info('Loaded IDM from Phase 4 output');
      } else {
        throw new Error('IDM not found. Please ensure Phase 4 has completed successfully.');
      }
    }

    // Extract company profile
    const companyProfile = phase0Data?.output?.companyProfile || this.extractCompanyProfileFromIDM(idm);

    // Detect run ID
    const detectedRunId = phase0Data?.assessment_run_id ||
      idm.meta.assessment_run_id ||
      `run-${Date.now()}`;

    return { phase0Data, phase1Data, phase2Data, phase3Data, phase4Data, idm, companyProfile, detectedRunId };
  }

  /**
   * Build ReportContext from phase outputs
   * Now includes narrative content extraction from Phase 1, 2, and 3
   */
  private buildReportContext(
    phase1Data: any,
    phase2Data: any,
    phase3Data: any,
    phase4Data: any,
    idm: IDM,
    companyProfile: any,
    runId: string
  ): ReportContext {
    // Extract narrative content from all phases
    let narrativeContent: NarrativeContent | undefined;
    try {
      narrativeContent = NarrativeExtractionService.extract(
        phase1Data || {},
        phase2Data || {},
        phase3Data || {}
      );
      this.logger.info({
        totalWords: narrativeContent.metadata.totalWords,
        contentSufficient: narrativeContent.metadata.contentSufficient
      }, 'Narrative content extracted');
    } catch (error) {
      this.logger.warn({ error }, 'Failed to extract narrative content, reports will use structured data only');
    }
    // Build company profile
    const reportCompanyProfile: ReportCompanyProfile = {
      name: companyProfile?.basic_information?.company_name || 'Company',
      industry: companyProfile?.business_focus?.primary_industry || 'General',
      industrySector: companyProfile?.business_focus?.industry_sector,
      companySize: companyProfile?.size_metrics?.company_size || 'Unknown',
      employeeCount: companyProfile?.size_metrics?.employee_count,
      annualRevenue: companyProfile?.size_metrics?.annual_revenue,
      yearsInBusiness: companyProfile?.basic_information?.years_in_business,
      lifecycleStage: companyProfile?.growth_context?.lifecycle_stage,
      location: companyProfile?.basic_information?.location,
    };

    // Build overall health
    const overallHealth: ReportOverallHealth = {
      score: idm.scores_summary.overall_health_score,
      band: getScoreBand(idm.scores_summary.overall_health_score),
      status: idm.scores_summary.descriptor,
      trajectory: idm.scores_summary.trajectory,
    };

    // Build chapters
    const chapters: ReportChapter[] = idm.chapters.map(ch => ({
      code: ch.chapter_code,
      name: ch.name,
      score: ch.score_overall,
      band: ch.score_band,
      benchmark: ch.benchmark ? {
        peerPercentile: ch.benchmark.peer_percentile,
        description: ch.benchmark.band_description,
      } : undefined,
      keyFindings: this.extractChapterFindings(idm, ch.chapter_code, 'strength'),
      keyRisks: this.extractChapterFindings(idm, ch.chapter_code, 'risk'),
      keyOpportunities: this.extractChapterFindings(idm, ch.chapter_code, 'opportunity'),
    }));

    // Build dimensions
    const dimensions: ReportDimension[] = idm.dimensions.map(dim => ({
      id: dim.dimension_code,
      code: dim.dimension_code,
      chapterCode: dim.chapter_code,
      name: dim.name,
      description: dim.description,
      score: dim.score_overall,
      band: dim.score_band,
      benchmark: dim.benchmark ? {
        peerPercentile: dim.benchmark.peer_percentile,
        description: dim.benchmark.band_description,
      } : undefined,
      subIndicators: dim.sub_indicators.map(si => ({
        id: si.id,
        name: si.name,
        score: si.score,
        band: si.score_band,
      })),
      keyFindings: this.extractDimensionFindingLabels(idm, dim.dimension_code, 'strength'),
      keyRisks: this.extractDimensionFindingLabels(idm, dim.dimension_code, 'risk'),
      keyOpportunities: this.extractDimensionFindingLabels(idm, dim.dimension_code, 'opportunity'),
    }));

    // Build findings
    const findings: ReportFinding[] = idm.findings.map(f => ({
      id: f.id,
      type: f.type,
      dimensionCode: f.dimension_code,
      dimensionName: DIMENSION_METADATA[f.dimension_code].name,
      subIndicatorId: f.sub_indicator_id,
      severity: f.severity,
      confidenceLevel: f.confidence_level,
      shortLabel: f.short_label,
      narrative: f.narrative,
      evidenceRefs: f.evidence_refs ? {
        questionIds: f.evidence_refs.question_ids,
        metrics: f.evidence_refs.metrics,
        benchmarks: f.evidence_refs.benchmarks,
      } : undefined,
    }));

    // Build recommendations
    const quickWinIds = new Set(idm.quick_wins.map(qw => qw.recommendation_id));
    const recommendations: ReportRecommendation[] = idm.recommendations.map(rec => ({
      id: rec.id,
      dimensionCode: rec.dimension_code,
      dimensionName: DIMENSION_METADATA[rec.dimension_code].name,
      linkedFindingIds: rec.linked_finding_ids,
      theme: rec.theme,
      priorityRank: rec.priority_rank,
      impactScore: rec.impact_score,
      effortScore: rec.effort_score,
      horizon: rec.horizon,
      horizonLabel: formatHorizon(rec.horizon),
      requiredCapabilities: rec.required_capabilities,
      actionSteps: rec.action_steps,
      expectedOutcomes: rec.expected_outcomes,
      isQuickWin: quickWinIds.has(rec.id),
    }));

    // Build quick wins
    const quickWins: ReportQuickWin[] = idm.quick_wins.map(qw => {
      const rec = recommendations.find(r => r.id === qw.recommendation_id);
      return {
        id: qw.recommendation_id,
        recommendationId: qw.recommendation_id,
        theme: rec?.theme || 'Quick Win',
        impactScore: rec?.impactScore || 0,
        effortScore: rec?.effortScore || 0,
        actionSteps: rec?.actionSteps || [],
        expectedOutcomes: rec?.expectedOutcomes || '',
        timeframe: rec?.horizonLabel || '90 Days',
      };
    });

    // Build risks
    const risks: ReportRisk[] = idm.risks.map(r => ({
      id: r.id,
      dimensionCode: r.dimension_code,
      dimensionName: DIMENSION_METADATA[r.dimension_code].name,
      category: r.category,
      severity: r.severity,
      likelihood: r.likelihood,
      narrative: r.narrative,
      linkedRecommendationIds: r.linked_recommendation_ids,
    }));

    // Build roadmap
    const roadmap: ReportRoadmap = {
      phases: idm.roadmap.phases.map(p => ({
        id: p.id,
        name: p.name,
        timeHorizon: p.time_horizon,
        linkedRecommendationIds: p.linked_recommendation_ids,
        narrative: p.narrative,
      })),
    };

    // Build financial projections from Phase 4 if available
    const financialProjections = phase4Data?.summaries?.financial_projections ? {
      day90Value: phase4Data.summaries.financial_projections['90_day_value'],
      annualValue: phase4Data.summaries.financial_projections.annual_value,
      roi90Day: phase4Data.summaries.financial_projections.roi_90day,
      totalInvestmentRequired: phase4Data.summaries.financial_projections.investment_required,
    } : undefined;

    // Build executive summary
    const executiveSummary = phase3Data?.summary ? {
      overview: `${reportCompanyProfile.name} overall business health score is ${overallHealth.score}/100, rated as "${overallHealth.status}".`,
      keyStrengths: findings.filter(f => f.type === 'strength').slice(0, 3).map(f => f.shortLabel),
      keyPriorities: findings.filter(f => f.type === 'gap' || f.type === 'risk').slice(0, 3).map(f => f.shortLabel),
      criticalActions: recommendations.slice(0, 3).map(r => r.theme),
    } : undefined;

    // Build performance analysis from Phase 4 if available
    const performanceAnalysis = phase4Data?.summaries?.performance_analysis;

    // Key imperatives
    const keyImperatives = idm.scores_summary.key_imperatives;

    // Build LegalAccessConfig from environment configuration
    const legalAccess: LegalAccessConfig = {
      betaDisableBlur: reportsConfig.betaDisableBlur,
      showBetaBanner: reportsConfig.betaDisableBlur, // Show banner when in Beta
      termsVersion: getCurrentTermsVersion(),
    };

    // Log Beta mode status for this run
    if (legalAccess.betaDisableBlur) {
      this.logger.info({ runId }, '[Phase 5] Beta Mode: Clickwrap/blur DISABLED');
    }

    // Phase 1.5 data from IDM (if available)
    const hasPhase15Data = idm.categoryAnalyses && idm.categoryAnalyses.length > 0;
    if (hasPhase15Data) {
      this.logger.info({
        categories: idm.categoryAnalyses?.length,
        chapters: idm.chapterSummaries?.length,
        hasInsights: Boolean(idm.crossCategoryInsights)
      }, 'Phase 1.5 data available for report generation');
    }

    return {
      runId,
      companyProfile: reportCompanyProfile,
      overallHealth,
      executiveSummary,
      chapters,
      dimensions,
      findings,
      recommendations,
      quickWins,
      risks,
      roadmap,
      financialProjections,
      performanceAnalysis,
      keyImperatives,
      metadata: {
        generatedAt: new Date().toISOString(),
        pipelineVersion: '1.5.0',
        assessmentRunId: runId,
        companyProfileId: idm.meta.company_profile_id,
        reportType: 'all',
        betaMode: legalAccess.betaDisableBlur, // Flag in metadata for audit trail
      },
      narrativeContent,
      legalAccess, // Pass legal config to all report builders

      // Phase 1.5 Integration (Category-Level Analysis)
      categoryAnalyses: idm.categoryAnalyses,
      chapterSummaries: idm.chapterSummaries,
      crossCategoryInsights: idm.crossCategoryInsights,
    };
  }

  /**
   * Extract company profile from IDM when Phase 0 data is not available
   */
  private extractCompanyProfileFromIDM(idm: IDM): any {
    return {
      basic_information: {
        company_name: 'Company',
      },
      business_focus: {
        primary_industry: 'General',
      },
      size_metrics: {
        company_size: 'Unknown',
      },
    };
  }

  /**
   * Extract chapter findings of a specific type
   */
  private extractChapterFindings(idm: IDM, chapterCode: ChapterCode, type: string): string[] {
    const chapterDimensions = idm.dimensions
      .filter(d => d.chapter_code === chapterCode)
      .map(d => d.dimension_code);

    return idm.findings
      .filter(f => chapterDimensions.includes(f.dimension_code) && f.type === type)
      .slice(0, 3)
      .map(f => f.short_label);
  }

  /**
   * Extract dimension finding labels
   */
  private extractDimensionFindingLabels(idm: IDM, dimensionCode: DimensionCode, type: string): string[] {
    return idm.findings
      .filter(f => f.dimension_code === dimensionCode && f.type === type)
      .slice(0, 3)
      .map(f => f.short_label);
  }

  /**
   * Get all report builders
   */
  private getReportBuilders(): ReportBuilderRegistration[] {
    return [
      {
        type: 'comprehensive',
        name: 'Comprehensive Assessment Report',
        description: 'Full assessment with all dimensions, findings, and recommendations',
        build: buildComprehensiveReport,
      },
      {
        type: 'owner',
        name: 'Business Owner Report',
        description: 'Executive summary focused on key takeaways and strategic priorities',
        build: buildOwnersReport,
      },
      {
        type: 'executiveBrief',
        name: 'Executive Brief',
        description: 'One-page executive overview with key metrics and actions',
        build: buildExecutiveBrief,
      },
      {
        type: 'quickWins',
        name: 'Quick Wins Action Plan',
        description: 'Focused on immediate, high-impact, low-effort improvements',
        build: buildQuickWinsReport,
      },
      {
        type: 'risk',
        name: 'Risk Assessment Report',
        description: 'Detailed analysis of business risks and mitigation strategies',
        build: buildRiskReport,
      },
      {
        type: 'roadmap',
        name: 'Implementation Roadmap',
        description: 'Phased implementation plan with milestones and dependencies',
        build: buildRoadmapReport,
      },
      {
        type: 'financial',
        name: 'Financial Impact Analysis',
        description: 'ROI projections, investment requirements, and value creation',
        build: buildFinancialReport,
      },
      {
        type: 'deepDive:growthEngine',
        name: 'Growth Engine Deep Dive',
        description: 'Detailed analysis of Strategy, Sales, Marketing, and Customer Experience',
        build: (ctx, opts) => buildDeepDiveReport(ctx, opts, 'GE'),
      },
      {
        type: 'deepDive:performanceHealth',
        name: 'Performance & Health Deep Dive',
        description: 'Detailed analysis of Operations and Financials',
        build: (ctx, opts) => buildDeepDiveReport(ctx, opts, 'PH'),
      },
      {
        type: 'deepDive:peopleLeadership',
        name: 'People & Leadership Deep Dive',
        description: 'Detailed analysis of Human Resources and Leadership & Governance',
        build: (ctx, opts) => buildDeepDiveReport(ctx, opts, 'PL'),
      },
      {
        type: 'deepDive:resilienceSafeguards',
        name: 'Resilience & Safeguards Deep Dive',
        description: 'Detailed analysis of Technology, IT, Risk Management, and Compliance',
        build: (ctx, opts) => buildDeepDiveReport(ctx, opts, 'RS'),
      },
      // Recipe-based reports (from config/report-recipes/)
      {
        type: 'employees',
        name: 'Employee Business Health Summary',
        description: 'Accessible summary for all employees with focus on company health, culture, and contribution',
        build: buildEmployeesReport,
      },
      {
        type: 'managersOperations',
        name: 'Operations Manager Report',
        description: 'Operations-focused analysis covering OPS dimension with efficiency metrics',
        build: buildManagersOperationsReport,
      },
      {
        type: 'managersSalesMarketing',
        name: 'Sales & Marketing Manager Report',
        description: 'Growth Engine focused report for sales and marketing leadership',
        build: buildManagersSalesMarketingReport,
      },
      {
        type: 'managersFinancials',
        name: 'Financial Manager Report',
        description: 'Financial health analysis with cash flow, profitability, and risk metrics',
        build: buildManagersFinancialsReport,
      },
      {
        type: 'managersStrategy',
        name: 'Strategy Manager Report',
        description: 'Strategic analysis covering market position, competitive landscape, and growth roadmap',
        build: buildManagersStrategyReport,
      },
      {
        type: 'managersItTechnology',
        name: 'IT & Technology Manager Report',
        description: 'Technology infrastructure, digital capabilities, and cybersecurity analysis',
        build: buildManagersItTechnologyReport,
      },
    ];
  }

  /**
   * Generate report manifest
   */
  private generateManifest(ctx: ReportContext, reports: GeneratedReport[], runId: string): ReportManifest {
    // Calculate Phase 1.5 integration status
    const phase1_5Available = !!(ctx.categoryAnalyses && ctx.categoryAnalyses.length > 0);
    const categoriesWithNarratives = ctx.categoryAnalyses?.filter(ca =>
      ca.executiveSummary || ca.detailedAnalysis
    ).length || 0;
    const chaptersWithNarratives = ctx.chapterSummaries?.filter(cs =>
      cs.executiveSummary || cs.keyStrengths?.length > 0
    ).length || 0;

    // Build visualizations list
    const visualizationsIncluded: string[] = [];
    if (phase1_5Available) {
      visualizationsIncluded.push('categoryRadarChart');
      visualizationsIncluded.push('chapterHeatmap');
      visualizationsIncluded.push('benchmarkBars');
      if (ctx.crossCategoryInsights) {
        visualizationsIncluded.push('interdependencyNetwork');
        visualizationsIncluded.push('priorityMatrix');
      }
      visualizationsIncluded.push('swotQuadrants');
    }

    return {
      runId,
      companyName: ctx.companyProfile.name,
      generatedAt: new Date().toISOString(),
      healthScore: ctx.overallHealth.score,
      healthStatus: ctx.overallHealth.status,
      pipelineVersion: '1.5.0',
      reports: reports.map(r => ({
        type: r.reportType,
        name: r.reportName,
        html: path.basename(r.htmlPath),
        pdf: r.pdfPath ? path.basename(r.pdfPath) : undefined,
        meta: path.basename(r.metaPath),
      })),
      // Phase 1.5 Integration Status
      phase1_5Integration: {
        available: phase1_5Available,
        categoriesWithNarratives,
        chaptersWithNarratives,
        visualizationsIncluded,
        crossCategoryInsightsAvailable: !!ctx.crossCategoryInsights,
        narrativeContentSurfaced: phase1_5Available && categoriesWithNarratives === 12,
      },
    };
  }

  // ==========================================================================
  // PHASE 5 QUALITY VALIDATION
  // ==========================================================================

  /**
   * Validate report quality by analyzing HTML content
   * Counts visual elements, bold tags, dividers, etc.
   */
  async validateReportQuality(htmlPath: string): Promise<ReportQualityMetrics> {
    const html = await fs.readFile(htmlPath, 'utf-8');

    // Default quality thresholds
    const thresholds = {
      minVisualizations: this.config.qualityThresholds?.minVisualizations ?? 50,
      maxBoldElements: this.config.qualityThresholds?.maxBoldElements ?? 200,
      maxDividers: this.config.qualityThresholds?.maxDividers ?? 30,
    };

    // Count SVG visualizations
    const svgMatches = html.match(/<svg[^>]*>/gi) || [];
    const svgCount = svgMatches.length;

    // Count bold elements (strong, b, .bh-strong, font-weight: bold)
    const strongTags = (html.match(/<strong[^>]*>/gi) || []).length;
    const bTags = (html.match(/<b[^>]*>/gi) || []).length;
    const bhStrong = (html.match(/class="[^"]*bh-strong[^"]*"/gi) || []).length;
    const boldCount = strongTags + bTags + bhStrong;

    // Count section dividers (hr, .bh-section-divider)
    const hrTags = (html.match(/<hr[^>]*>/gi) || []).length;
    const bhDividers = (html.match(/class="[^"]*bh-section-divider[^"]*"/gi) || []).length;
    const dividerCount = hrTags + bhDividers;

    // Count list items
    const listItemCount = (html.match(/<li[^>]*>/gi) || []).length;

    // Count tables
    const tableCount = (html.match(/<table[^>]*>/gi) || []).length;

    // Estimate page count (~3000 chars per page)
    const pageEstimate = Math.ceil(html.length / 3000);

    // Estimate word count (strip HTML tags, count words)
    const textContent = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const wordCount = textContent.split(' ').filter(w => w.length > 0).length;

    const metrics: ReportQualityMetrics = {
      svgCount,
      boldCount,
      dividerCount,
      listItemCount,
      tableCount,
      pageEstimate,
      wordCount,
      meetsTargets: {
        visualizations: svgCount >= thresholds.minVisualizations,
        boldElements: boldCount <= thresholds.maxBoldElements,
        dividers: dividerCount <= thresholds.maxDividers,
      },
    };

    return metrics;
  }

  /**
   * Log quality metrics for a report
   */
  private logQualityMetrics(reportType: Phase5ReportType, metrics: ReportQualityMetrics): void {
    const allTargetsMet = metrics.meetsTargets.visualizations &&
                          metrics.meetsTargets.boldElements &&
                          metrics.meetsTargets.dividers;

    const logLevel = allTargetsMet ? 'info' : 'warn';
    const statusIcon = allTargetsMet ? '✓' : '⚠';

    this.logger[logLevel]({
      reportType,
      svgCount: metrics.svgCount,
      boldCount: metrics.boldCount,
      dividerCount: metrics.dividerCount,
      tableCount: metrics.tableCount,
      listItemCount: metrics.listItemCount,
      pageEstimate: metrics.pageEstimate,
      wordCount: metrics.wordCount,
      meetsTargets: metrics.meetsTargets,
    }, `${statusIcon} Report quality validation: ${reportType}`);

    if (!metrics.meetsTargets.visualizations) {
      this.logger.warn({ target: 50, actual: metrics.svgCount }, `[${reportType}] Below target: SVG visualizations`);
    }
    if (!metrics.meetsTargets.boldElements) {
      this.logger.warn({ target: '<200', actual: metrics.boldCount }, `[${reportType}] Exceeds target: Bold elements`);
    }
    if (!metrics.meetsTargets.dividers) {
      this.logger.warn({ target: '<30', actual: metrics.dividerCount }, `[${reportType}] Exceeds target: Section dividers`);
    }
  }

  /**
   * Generate quality summary from individual metrics
   */
  private generateQualitySummary(
    qualityMetrics: Record<Phase5ReportType, ReportQualityMetrics>
  ): Phase5Results['qualitySummary'] {
    const entries = Object.entries(qualityMetrics) as [Phase5ReportType, ReportQualityMetrics][];

    let totalVisualizations = 0;
    let totalBoldElements = 0;
    let totalDividers = 0;
    let reportsPassingThresholds = 0;

    for (const [, metrics] of entries) {
      totalVisualizations += metrics.svgCount;
      totalBoldElements += metrics.boldCount;
      totalDividers += metrics.dividerCount;

      const allTargetsMet = metrics.meetsTargets.visualizations &&
                            metrics.meetsTargets.boldElements &&
                            metrics.meetsTargets.dividers;
      if (allTargetsMet) {
        reportsPassingThresholds++;
      }
    }

    return {
      totalVisualizations,
      totalBoldElements,
      totalDividers,
      reportsPassingThresholds,
      totalReports: entries.length,
    };
  }
}

// ============================================================================
// FACTORY FUNCTION
// ============================================================================

/**
 * Create Phase 5 orchestrator with configuration
 */
export function createPhase5Orchestrator(config?: Phase5OrchestratorConfig): Phase5Orchestrator {
  return new Phase5Orchestrator(config);
}

// ============================================================================
// CLI ENTRY POINT
// ============================================================================

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const outputDir = args[0] || './output';

  const orchestrator = createPhase5Orchestrator({
    renderPDF: args.includes('--render-pdf'),
  });

  orchestrator
    .executePhase5(outputDir)
    .then((results) => {
      console.log('Phase 5 Report Generation Complete');
      console.log(`Reports Generated: ${results.reportsGenerated}`);
      console.log(`Output Directory: ${results.outputDir}`);
      console.log(`Manifest: ${results.manifestPath}`);
      if (results.errors && results.errors.length > 0) {
        console.log(`Errors: ${results.errors.length}`);
        results.errors.forEach(e => console.log(`  - ${e.reportType}: ${e.error}`));
      }
    })
    .catch((error) => {
      console.error('Phase 5 failed:', error);
      process.exit(1);
    });
}
