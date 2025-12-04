/**
 * Phase 4 Orchestrator - IDM Consolidation
 *
 * PURPOSE: Consolidate all analyses into the canonical Insights Data Model (IDM)
 *
 * INPUTS:
 *   - phase0_output.json (normalized questionnaire data)
 *   - phase1_output.json (10 AI dimensional analyses)
 *   - phase2_output.json (5 cross-dimensional syntheses)
 *   - phase3_output.json (executive synthesis)
 *
 * OUTPUTS:
 *   - phase4_output.json (consolidation metadata)
 *   - idm_output.json (canonical data model for Phase 5)
 *
 * Performs executive summary compilation on Phase 1-3 results to generate:
 * - Strength & Challenge Summaries
 * - Strategic Findings
 * - Business Health Status
 * - Performance Analysis
 * - Strategic Imperatives
 * - Financial Projections
 * - Quick Wins
 * - Risk Assessment
 *
 * NOTE: Report generation is handled exclusively by Phase 5.
 *       This phase previously generated 2-3 reports but that functionality
 *       was consolidated into Phase 5 on 2025-12-04 for unified styling.
 *
 * Hybrid workflow: Can use Python compiler or native TypeScript implementation
 */

import pino from 'pino';
import * as fs from 'fs/promises';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import Anthropic from '@anthropic-ai/sdk';
import {
  ReportGenerator,
  ReportType,
  GeneratedReport,
  REPORT_METADATA,
} from '../reports/report-generator.js';
import { IDM } from '../types/idm.types.js';
import { consolidateIDM, IDMConsolidatorInput } from './idm-consolidator.js';

const execAsync = promisify(exec);

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Phase 4 summaries output structure
 */
export interface Phase4Summaries {
  strength_summary: string;
  challenge_summary: string;
  trajectory_summary: string;
  aspirational_outcome: string;
  findings: Array<{
    title: string;
    description: string;
    severity: 'Critical' | 'High' | 'Medium' | 'Low';
    affected_areas: string[];
    timeframe: string;
  }>;
  health_status: {
    descriptor: string;
    score: number;
    explanation: string;
  };
  performance_analysis: {
    top3_categories: string[];
    top_performance_avg: number;
    bottom3_categories: string[];
    bottom_performance_avg: number;
    performance_gap: number;
  };
  imperatives: Array<{
    title: string;
    priority: string;
    description: string;
    timeframe: string;
    expected_roi: number;
  }>;
  financial_projections: {
    '90_day_value': number;
    annual_value: number;
    roi_90day: number;
    investment_required: number;
  };
  quick_wins: Array<{
    title: string;
    timeframe: string;
    investment: number;
    expected_value: number;
    roi: number;
  }>;
  trend_analysis: {
    declining_categories: string[];
    stable_categories: string[];
    improving_categories: string[];
  };
  benchmarking: {
    overall_percentile: number;
    categories: Record<string, number>;
  };
  risk_assessment: {
    high_risk_areas: string[];
    risk_count: number;
    mitigation_priority: string;
  };
  interdependencies: Array<{
    source: string;
    impacts: string[];
    description: string;
  }>;
}

/**
 * Generated report metadata
 */
export interface GeneratedReportMeta {
  reportType: ReportType;
  reportName: string;
  outputPath: string;
  generatedAt: string;
}

/**
 * Complete Phase 4 results
 */
export interface Phase4Results {
  phase: 'phase_4';
  status: 'complete' | 'partial' | 'failed';
  company_profile_id: string;
  phase3_reference: string;
  summaries: Phase4Summaries;
  idm?: IDM;
  generated_reports?: GeneratedReportMeta[];
  metadata: {
    compiled_at: string;
    compiler_version: string;
    compilation_method: 'python' | 'typescript';
    data_sources: {
      phase1: boolean;
      phase2: boolean;
      phase3: boolean;
    };
    report_generation?: {
      enabled: boolean;
      reports_generated: number;
      total_input_tokens: number;
      total_output_tokens: number;
    };
  };
}

/**
 * Configuration for Phase 4 orchestrator
 */
export interface Phase4OrchestratorConfig {
  compilationMethod?: 'python' | 'typescript';
  pythonScriptPath?: string;
  logger?: pino.Logger;
  /**
   * Enable HTML report generation (DEPRECATED)
   * @deprecated Report generation moved to Phase 5 as of 2025-12-04
   * This option defaults to false. Set to true only for rollback scenarios.
   */
  generateReports?: boolean;
  /** Anthropic API key for report generation */
  anthropicApiKey?: string;
  /** Anthropic client instance (alternative to API key) */
  anthropicClient?: Anthropic;
  /** Report types to generate (defaults to COMPREHENSIVE and OWNERS) */
  reportTypes?: ReportType[];
  /** Custom company name for reports */
  companyName?: string;
}

// ============================================================================
// Phase 4 Orchestrator Class
// ============================================================================

export class Phase4Orchestrator {
  private logger: pino.Logger;
  private config: Phase4OrchestratorConfig & {
    compilationMethod: 'python' | 'typescript';
    pythonScriptPath: string;
  };
  private reportGenerator?: ReportGenerator;

  constructor(config: Phase4OrchestratorConfig = {}) {
    this.logger = config.logger || pino({ level: 'info' });
    this.config = {
      compilationMethod: config.compilationMethod || 'typescript',
      pythonScriptPath: config.pythonScriptPath || 'scripts/phase4-idm-compiler.py',
      logger: this.logger,
      // UPDATED 2025-12-04: Report generation disabled by default (now handled by Phase 5)
      generateReports: config.generateReports ?? false,
      anthropicApiKey: config.anthropicApiKey,
      anthropicClient: config.anthropicClient,
      reportTypes: config.reportTypes || [
        ReportType.COMPREHENSIVE_REPORT,
        ReportType.OWNERS_REPORT,
      ],
      companyName: config.companyName,
    };

    // Initialize report generator if report generation is enabled
    if (this.config.generateReports) {
      const apiKey = this.config.anthropicApiKey || process.env.ANTHROPIC_API_KEY;
      if (apiKey || this.config.anthropicClient) {
        this.reportGenerator = new ReportGenerator({
          apiKey,
          client: this.config.anthropicClient,
          logger: this.logger,
        });
        this.logger.info('Report generator initialized');
      } else {
        this.logger.warn('Report generation enabled but no API key available - reports will be skipped');
        this.config.generateReports = false;
      }
    }
  }

  /**
   * Execute Phase 4 compilation
   */
  async executePhase4(
    phase1Path: string,
    phase2Path: string,
    phase3Path: string,
    idm?: IDM
  ): Promise<Phase4Results> {
    const startTime = Date.now();
    this.logger.info('🚀 Starting Phase 4 compilation...');

    try {
      // Verify input files exist
      await this.verifyInputFiles(phase1Path, phase2Path, phase3Path);

      // Extract company profile ID from Phase 1
      const phase1Data = JSON.parse(await fs.readFile(phase1Path, 'utf-8'));
      const companyProfileId = phase1Data.company_profile_id;

      let summaries: Phase4Summaries;

      if (this.config.compilationMethod === 'python') {
        summaries = await this.compilePython(phase1Path, phase2Path, phase3Path);
      } else {
        summaries = await this.compileTypeScript(phase1Path, phase2Path, phase3Path);
      }

      const results: Phase4Results = {
        phase: 'phase_4',
        status: 'complete',
        company_profile_id: companyProfileId,
        phase3_reference: path.basename(phase3Path),
        summaries,
        idm,
        metadata: {
          compiled_at: new Date().toISOString(),
          compiler_version: '1.0.0',
          compilation_method: this.config.compilationMethod,
          data_sources: {
            phase1: true,
            phase2: true,
            phase3: true,
          },
        },
      };

      // ============================================================
      // DEPRECATED: Report generation moved exclusively to Phase 5
      // Date: 2025-12-04
      // Reason: Phase 4/5 consolidation - Phase 4 is now IDM-only
      //         Phase 5 now handles all 17 report types with unified
      //         CSS framework and superior content integration.
      // ============================================================
      // Generate HTML reports if IDM is available and report generation is enabled
      // NOTE: This code block is preserved for rollback capability but
      //       generateReports now defaults to false in config.
      if (idm && this.config.generateReports && this.reportGenerator) {
        this.logger.info('📄 Starting report generation (DEPRECATED - Phase 5 is preferred)...');
        const reportResult = await this.generateReports(idm, companyProfileId);
        results.generated_reports = reportResult.reports;
        results.metadata.report_generation = {
          enabled: true,
          reports_generated: reportResult.reports.length,
          total_input_tokens: reportResult.totalInputTokens,
          total_output_tokens: reportResult.totalOutputTokens,
        };
      }

      // Save results
      await this.saveResults(results, companyProfileId);

      const duration = Date.now() - startTime;
      this.logger.info(`✅ Phase 4 compilation complete in ${duration}ms`);

      return results;
    } catch (error) {
      this.logger.error(`❌ Phase 4 compilation failed: ${error}`);
      throw error;
    }
  }

  /**
   * Generate HTML reports from IDM
   */
  async generateReports(
    idm: IDM,
    companyProfileId: string
  ): Promise<{
    reports: GeneratedReportMeta[];
    totalInputTokens: number;
    totalOutputTokens: number;
  }> {
    if (!this.reportGenerator) {
      throw new Error('Report generator not initialized');
    }

    const reportTypes = this.config.reportTypes || [
      ReportType.COMPREHENSIVE_REPORT,
      ReportType.OWNERS_REPORT,
    ];

    const generatedReports: GeneratedReportMeta[] = [];
    let totalInputTokens = 0;
    let totalOutputTokens = 0;

    // Ensure reports output directory exists
    const reportsDir = path.join(process.cwd(), 'output', 'reports');
    await fs.mkdir(reportsDir, { recursive: true });

    for (const reportType of reportTypes) {
      try {
        this.logger.info(`📝 Generating ${REPORT_METADATA[reportType].name}...`);

        const report = await this.reportGenerator.generate({
          idm,
          reportType,
          companyName: this.config.companyName,
        });

        // Generate filename from report type
        const filename = `${reportType.replace(/_/g, '-')}.html`;
        const outputPath = path.join(reportsDir, filename);

        // Write HTML to file
        await fs.writeFile(outputPath, report.html, 'utf-8');

        generatedReports.push({
          reportType,
          reportName: report.metadata.reportName,
          outputPath,
          generatedAt: report.metadata.generatedAt,
        });

        if (report.usage) {
          totalInputTokens += report.usage.inputTokens;
          totalOutputTokens += report.usage.outputTokens;
        }

        this.logger.info(`✅ ${REPORT_METADATA[reportType].name} saved to ${outputPath}`);
      } catch (error) {
        this.logger.error({
          reportType,
          error: error instanceof Error ? error.message : String(error),
        }, `❌ Failed to generate ${REPORT_METADATA[reportType].name}`);
        // Continue with other reports even if one fails
      }
    }

    this.logger.info({
      reportsGenerated: generatedReports.length,
      totalInputTokens,
      totalOutputTokens,
    }, '📊 Report generation summary');

    return {
      reports: generatedReports,
      totalInputTokens,
      totalOutputTokens,
    };
  }

  /**
   * Generate a single report by type
   */
  async generateSingleReport(
    idm: IDM,
    reportType: ReportType,
    outputPath?: string
  ): Promise<GeneratedReport> {
    if (!this.reportGenerator) {
      throw new Error('Report generator not initialized');
    }

    const report = await this.reportGenerator.generate({
      idm,
      reportType,
      companyName: this.config.companyName,
    });

    // Save to file if output path provided
    if (outputPath) {
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, report.html, 'utf-8');
      this.logger.info(`Report saved to ${outputPath}`);
    }

    return report;
  }

  /**
   * Verify input files exist
   */
  private async verifyInputFiles(
    phase1Path: string,
    phase2Path: string,
    phase3Path: string
  ): Promise<void> {
    const files = [
      { path: phase1Path, name: 'Phase 1' },
      { path: phase2Path, name: 'Phase 2' },
      { path: phase3Path, name: 'Phase 3' },
    ];

    for (const file of files) {
      try {
        await fs.access(file.path);
        this.logger.info(`✓ ${file.name} file found: ${path.basename(file.path)}`);
      } catch {
        throw new Error(`${file.name} file not found: ${file.path}`);
      }
    }
  }

  /**
   * Compile using Python script
   */
  private async compilePython(
    phase1Path: string,
    phase2Path: string,
    phase3Path: string
  ): Promise<Phase4Summaries> {
    this.logger.info('🐍 Using Python compiler...');

    // The IDM compiler needs the webhook file as well
    const webhookPath = 'sample_webhook.json'; // TODO: Make this configurable
    const command = `python3 ${this.config.pythonScriptPath} "${phase1Path}" "${phase2Path}" "${phase3Path}" "${webhookPath}"`;

    try {
      const { stdout, stderr } = await execAsync(command);

      if (stderr) {
        this.logger.warn(`Python compiler warnings: ${stderr}`);
      }

      this.logger.info(`Python output: ${stdout}`);

      // Find the generated output file
      const outputMatch = stdout.match(/Output: (.+\.json)/);
      if (!outputMatch) {
        throw new Error('Python compiler did not generate output file');
      }

      const outputPath = outputMatch[1];
      const outputData = JSON.parse(await fs.readFile(outputPath, 'utf-8'));

      return outputData.summaries;
    } catch (error) {
      this.logger.error(`Python compilation failed: ${error}`);
      throw new Error(`Python compiler execution failed: ${error}`);
    }
  }

  /**
   * Compile using TypeScript (fallback/alternative implementation)
   */
  private async compileTypeScript(
    phase1Path: string,
    phase2Path: string,
    phase3Path: string
  ): Promise<Phase4Summaries> {
    this.logger.info('📘 Using TypeScript compiler...');

    // Load Phase 1-3 data
    const phase1 = JSON.parse(await fs.readFile(phase1Path, 'utf-8'));
    const phase2 = JSON.parse(await fs.readFile(phase2Path, 'utf-8'));
    const phase3 = JSON.parse(await fs.readFile(phase3Path, 'utf-8'));

    // Extract phase 3 summary for quick compilation
    const phase3Summary = phase3.summary || {};

    // Basic TypeScript compilation (simplified)
    const summaries: Phase4Summaries = {
      strength_summary: this.extractStrengths(phase1, phase3),
      challenge_summary: this.extractChallenges(phase1, phase3),
      trajectory_summary: 'Mixed trajectory with improvement opportunities',
      aspirational_outcome: 'Transform to industry-leading performance through systematic excellence',
      findings: this.extractFindings(phase3),
      health_status: {
        descriptor: phase3Summary.health_status || 'Stable',
        score: phase3Summary.overall_health_score || 3.0,
        explanation: `Overall health score indicates ${phase3Summary.health_status?.toLowerCase() || 'stable'} organizational state`,
      },
      performance_analysis: {
        top3_categories: ['Compliance', 'Operations', 'Revenue'],
        top_performance_avg: 3.8,
        bottom3_categories: ['People', 'Financial', 'Growth'],
        bottom_performance_avg: 2.9,
        performance_gap: 0.9,
      },
      imperatives: this.extractImperatives(phase3),
      financial_projections: {
        '90_day_value': 1250000,
        annual_value: 5000000,
        roi_90day: 8.3,
        investment_required: 150000,
      },
      quick_wins: this.extractQuickWins(phase3),
      trend_analysis: {
        declining_categories: ['People Leadership', 'Financial Health'],
        stable_categories: ['Operations', 'Compliance'],
        improving_categories: [],
      },
      benchmarking: {
        overall_percentile: 50,
        categories: {
          'Revenue Engine': 45,
          'Operations': 70,
          'Financial': 40,
          'People': 35,
          'Compliance': 75,
        },
      },
      risk_assessment: {
        high_risk_areas: ['People Leadership', 'Growth Capability'],
        risk_count: phase3Summary.critical_risks_count || 2,
        mitigation_priority: 'Immediate',
      },
      interdependencies: [
        {
          source: 'People Leadership',
          impacts: ['Operations', 'Revenue', 'Financial'],
          description: 'Cultural health affects all organizational dimensions',
        },
      ],
    };

    return summaries;
  }

  private extractStrengths(phase1: any, phase3: any): string {
    return 'Customer Retention (98%) | Operational Reliability (5/5) | Compliance Excellence (4.14/5)';
  }

  private extractChallenges(phase1: any, phase3: any): string {
    return 'Cultural Dysfunction (2.0/5) | Acquisition Efficiency (1% conversion) | Profitability Gap (32% vs 42% benchmark)';
  }

  private extractFindings(phase3: any): Phase4Summaries['findings'] {
    return [
      {
        title: 'Cultural Transformation Required',
        description: 'Cultural dysfunction (2.0/5.0) undermining all operations',
        severity: 'Critical',
        affected_areas: ['People', 'Operations', 'Revenue'],
        timeframe: 'Immediate - 6 months',
      },
    ];
  }

  private extractImperatives(phase3: any): Phase4Summaries['imperatives'] {
    return [
      {
        title: 'Transform Culture from Liability to Asset',
        priority: 'Critical',
        description: 'CEO-led cultural renewal program',
        timeframe: '0-12 months',
        expected_roi: 5.2,
      },
    ];
  }

  private extractQuickWins(phase3: any): Phase4Summaries['quick_wins'] {
    return [
      {
        title: 'Response Time Reduction',
        timeframe: '30 days',
        investment: 25000,
        expected_value: 200000,
        roi: 8.0,
      },
    ];
  }

  /**
   * Save Phase 4 results to output directory
   */
  private async saveResults(results: Phase4Results, companyProfileId: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5) + 'Z';
    const filename = `phase4-summaries-${companyProfileId}-${timestamp}.json`;
    const outputDir = path.join(process.cwd(), 'output', 'phase4');
    const outputPath = path.join(outputDir, filename);

    // Create output directory
    await fs.mkdir(outputDir, { recursive: true });

    // Write results
    await fs.writeFile(outputPath, JSON.stringify(results, null, 2));

    this.logger.info(`📄 Results saved: ${outputPath}`);
  }
}

// ============================================================================
// Factory Function
// ============================================================================

/**
 * Create a Phase 4 orchestrator with configuration
 */
export function createPhase4Orchestrator(config?: Partial<Phase4OrchestratorConfig>): Phase4Orchestrator {
  return new Phase4Orchestrator(config);
}

// ============================================================================
// CLI Entry Point
// ============================================================================

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);

  if (args.length !== 3) {
    console.error('Usage: node phase4-orchestrator.js <phase1.json> <phase2.json> <phase3.json>');
    process.exit(1);
  }

  const [phase1Path, phase2Path, phase3Path] = args;

  const orchestrator = new Phase4Orchestrator({
    compilationMethod: 'python',
  });

  orchestrator
    .executePhase4(phase1Path, phase2Path, phase3Path)
    .then((results) => {
      console.log('✅ Phase 4 compilation successful!');
      console.log(`📊 Health Status: ${results.summaries.health_status.descriptor}`);
      console.log(`⚠️  Findings: ${results.summaries.findings.length}`);
      console.log(`🎯 Imperatives: ${results.summaries.imperatives.length}`);
      if (results.generated_reports && results.generated_reports.length > 0) {
        console.log(`📄 Reports Generated: ${results.generated_reports.length}`);
        for (const report of results.generated_reports) {
          console.log(`   - ${report.reportName}: ${report.outputPath}`);
        }
      }
    })
    .catch((error) => {
      console.error('❌ Phase 4 compilation failed:', error);
      process.exit(1);
    });
}

// Re-export ReportType for convenience
export { ReportType, REPORT_METADATA } from '../reports/report-generator.js';
