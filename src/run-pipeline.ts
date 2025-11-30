/**
 * BizHealth Report Pipeline - Full Pipeline Runner
 *
 * Executes the complete pipeline from Phase 0 through Phase 4:
 * - Phase 0: Raw Capture & Normalization (no API calls)
 * - Phase 1: Cross-functional AI Analyses (10 analyses via Anthropic Batch API)
 * - Phase 2: Deep-dive Cross-analysis
 * - Phase 3: Executive Synthesis
 * - Phase 4: Final Compilation & IDM Generation
 *
 * Usage:
 *   npx tsx src/run-pipeline.ts [webhook.json] [--phase=0-4] [--output-dir=./output]
 *
 * Environment Variables Required:
 *   ANTHROPIC_API_KEY - Your Anthropic API key (required for Phase 1-3)
 *   DATABASE_URL      - PostgreSQL connection string (optional, for persistence)
 *
 * Optional Environment Variables:
 *   DEFAULT_MODEL          - Claude model to use (default: claude-opus-4-20250514)
 *   BATCH_POLL_INTERVAL_MS - Poll interval for batch jobs (default: 30000)
 *   LOG_LEVEL              - Logging level (default: info)
 */

import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { logger, createLogger } from './utils/logger.js';
import { formatError } from './utils/errors.js';
import type { WebhookPayload } from './types/webhook.types.js';
import { consolidateIDM, IDMConsolidatorInput } from './orchestration/idm-consolidator.js';
import { ReportType } from './reports/report-generator.js';
import type { IDM } from './types/idm.types.js';

// Load environment variables
config();

const pipelineLogger = createLogger('pipeline');

// ============================================================================
// Pipeline Configuration
// ============================================================================

interface PipelineConfig {
  webhookPath: string;
  outputDir: string;
  startPhase: number;
  endPhase: number;
  skipDatabase: boolean;
  generateReports: boolean;
  reportTypes: ReportType[];
  companyName?: string;
}

function parseArgs(): PipelineConfig {
  const args = process.argv.slice(2);
  const config: PipelineConfig = {
    webhookPath: './sample_webhook.json',
    outputDir: './output',
    startPhase: 0,
    endPhase: 4,
    skipDatabase: true, // Default to skip DB for simplicity
    generateReports: true, // Default to generate reports
    reportTypes: [
      ReportType.COMPREHENSIVE_REPORT,
      ReportType.OWNERS_REPORT,
      ReportType.QUICK_WINS_REPORT,
    ],
    companyName: undefined,
  };

  for (const arg of args) {
    if (arg.startsWith('--phase=')) {
      const phases = arg.replace('--phase=', '');
      if (phases.includes('-')) {
        const [start, end] = phases.split('-').map(Number);
        config.startPhase = start;
        config.endPhase = end;
      } else {
        config.startPhase = config.endPhase = Number(phases);
      }
    } else if (arg.startsWith('--output-dir=')) {
      config.outputDir = arg.replace('--output-dir=', '');
    } else if (arg.startsWith('--skip-db')) {
      config.skipDatabase = true;
    } else if (arg.startsWith('--use-db')) {
      config.skipDatabase = false;
    } else if (arg.startsWith('--no-reports')) {
      config.generateReports = false;
    } else if (arg.startsWith('--reports=')) {
      const types = arg.replace('--reports=', '').split(',');
      config.reportTypes = types.map(t => t.trim() as ReportType);
    } else if (arg.startsWith('--all-reports')) {
      config.reportTypes = Object.values(ReportType);
    } else if (arg.startsWith('--company-name=')) {
      config.companyName = arg.replace('--company-name=', '');
    } else if (!arg.startsWith('--')) {
      config.webhookPath = arg;
    }
  }

  return config;
}

// ============================================================================
// Phase Executors
// ============================================================================

interface PhaseResult {
  phase: number;
  status: 'success' | 'failed' | 'skipped';
  duration_ms: number;
  output_path?: string;
  error?: string;
  details?: Record<string, unknown>;
}

/**
 * Phase 0: Raw Capture & Normalization
 */
async function executePhase0(
  webhookPayload: WebhookPayload,
  outputDir: string
): Promise<PhaseResult> {
  const startTime = Date.now();
  pipelineLogger.info('Starting Phase 0: Raw Capture & Normalization');

  try {
    const { processWebhookSubmission, getPhase0Stats } = await import('./phase0-index.js');

    const result = await processWebhookSubmission(webhookPayload, {
      source: 'pipeline',
    });

    if (!result.success) {
      return {
        phase: 0,
        status: 'failed',
        duration_ms: Date.now() - startTime,
        error: result.error,
      };
    }

    // Save Phase 0 output for subsequent phases
    const phase0OutputPath = path.join(outputDir, 'phase0_output.json');
    fs.writeFileSync(phase0OutputPath, JSON.stringify(result, null, 2));

    const stats = getPhase0Stats();

    return {
      phase: 0,
      status: 'success',
      duration_ms: Date.now() - startTime,
      output_path: phase0OutputPath,
      details: {
        assessment_run_id: result.assessment_run_id,
        company_profile_id: result.company_profile_id,
        phases_completed: result.phases_completed,
        stats,
      },
    };
  } catch (error) {
    return {
      phase: 0,
      status: 'failed',
      duration_ms: Date.now() - startTime,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Phase 1: Cross-functional AI Analyses
 */
async function executePhase1(
  webhookPayload: WebhookPayload,
  outputDir: string
): Promise<PhaseResult> {
  const startTime = Date.now();
  pipelineLogger.info('Starting Phase 1: Cross-functional AI Analyses');

  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      phase: 1,
      status: 'failed',
      duration_ms: Date.now() - startTime,
      error: 'ANTHROPIC_API_KEY environment variable is required for Phase 1',
    };
  }

  try {
    const { createPhase1Orchestrator } = await import('./orchestration/phase1-orchestrator.js');

    const orchestrator = createPhase1Orchestrator({
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: process.env.DEFAULT_MODEL || 'claude-opus-4-20250514',
      pollIntervalMs: parseInt(process.env.BATCH_POLL_INTERVAL_MS || '30000'),
    });

    const results = await orchestrator.executePhase1(webhookPayload);

    // Save Phase 1 output
    const phase1OutputPath = path.join(outputDir, 'phase1_output.json');
    fs.writeFileSync(phase1OutputPath, JSON.stringify(results, null, 2));

    return {
      phase: 1,
      status: results.status === 'failed' ? 'failed' : 'success',
      duration_ms: Date.now() - startTime,
      output_path: phase1OutputPath,
      details: {
        status: results.status,
        successful_analyses: results.metadata.successful_analyses,
        failed_analyses: results.metadata.failed_analyses,
        total_analyses: results.metadata.total_analyses,
      },
    };
  } catch (error) {
    return {
      phase: 1,
      status: 'failed',
      duration_ms: Date.now() - startTime,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Phase 2: Deep-dive Cross-analysis
 */
async function executePhase2(
  outputDir: string
): Promise<PhaseResult> {
  const startTime = Date.now();
  pipelineLogger.info('Starting Phase 2: Deep-dive Cross-analysis');

  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      phase: 2,
      status: 'failed',
      duration_ms: Date.now() - startTime,
      error: 'ANTHROPIC_API_KEY environment variable is required for Phase 2',
    };
  }

  // Check for Phase 1 output
  const phase1OutputPath = path.join(outputDir, 'phase1_output.json');
  if (!fs.existsSync(phase1OutputPath)) {
    return {
      phase: 2,
      status: 'failed',
      duration_ms: Date.now() - startTime,
      error: `Phase 1 output not found at ${phase1OutputPath}. Run Phase 1 first.`,
    };
  }

  try {
    const { createPhase2Orchestrator } = await import('./orchestration/phase2-orchestrator.js');

    const orchestrator = createPhase2Orchestrator({
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: process.env.DEFAULT_MODEL || 'claude-opus-4-20250514',
    });

    const results = await orchestrator.executePhase2(phase1OutputPath);

    // Save Phase 2 output
    const phase2OutputPath = path.join(outputDir, 'phase2_output.json');
    fs.writeFileSync(phase2OutputPath, JSON.stringify(results, null, 2));

    return {
      phase: 2,
      status: results.status === 'failed' ? 'failed' : 'success',
      duration_ms: Date.now() - startTime,
      output_path: phase2OutputPath,
      details: {
        status: results.status,
        successful_analyses: results.metadata.successful_analyses,
        failed_analyses: results.metadata.failed_analyses,
      },
    };
  } catch (error) {
    return {
      phase: 2,
      status: 'failed',
      duration_ms: Date.now() - startTime,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Phase 3: Executive Synthesis
 */
async function executePhase3(
  outputDir: string
): Promise<PhaseResult> {
  const startTime = Date.now();
  pipelineLogger.info('Starting Phase 3: Executive Synthesis');

  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      phase: 3,
      status: 'failed',
      duration_ms: Date.now() - startTime,
      error: 'ANTHROPIC_API_KEY environment variable is required for Phase 3',
    };
  }

  // Check for Phase 2 output
  const phase2OutputPath = path.join(outputDir, 'phase2_output.json');
  if (!fs.existsSync(phase2OutputPath)) {
    return {
      phase: 3,
      status: 'failed',
      duration_ms: Date.now() - startTime,
      error: `Phase 2 output not found at ${phase2OutputPath}. Run Phase 2 first.`,
    };
  }

  try {
    const { createPhase3Orchestrator } = await import('./orchestration/phase3-orchestrator.js');

    const orchestrator = createPhase3Orchestrator({
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: process.env.DEFAULT_MODEL || 'claude-opus-4-20250514',
    });

    const results = await orchestrator.executePhase3(phase2OutputPath);

    // Save Phase 3 output
    const phase3OutputPath = path.join(outputDir, 'phase3_output.json');
    fs.writeFileSync(phase3OutputPath, JSON.stringify(results, null, 2));

    return {
      phase: 3,
      status: results.status === 'failed' ? 'failed' : 'success',
      duration_ms: Date.now() - startTime,
      output_path: phase3OutputPath,
      details: {
        status: results.status,
        overall_health_score: results.summary?.overall_health_score,
        health_status: results.summary?.health_status,
      },
    };
  } catch (error) {
    return {
      phase: 3,
      status: 'failed',
      duration_ms: Date.now() - startTime,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Phase 4: Final Compilation & IDM Generation
 */
async function executePhase4(
  outputDir: string,
  pipelineConfig: PipelineConfig
): Promise<PhaseResult> {
  const startTime = Date.now();
  pipelineLogger.info('Starting Phase 4: Final Compilation & IDM Generation');

  // Check for Phase 3 output
  const phase3OutputPath = path.join(outputDir, 'phase3_output.json');
  if (!fs.existsSync(phase3OutputPath)) {
    return {
      phase: 4,
      status: 'failed',
      duration_ms: Date.now() - startTime,
      error: `Phase 3 output not found at ${phase3OutputPath}. Run Phase 3 first.`,
    };
  }

  try {
    const { createPhase4Orchestrator } = await import('./orchestration/phase4-orchestrator.js');

    // Phase 4 needs all three phase outputs
    const phase0OutputPath = path.join(outputDir, 'phase0_output.json');
    const phase1OutputPath = path.join(outputDir, 'phase1_output.json');
    const phase2OutputPath = path.join(outputDir, 'phase2_output.json');

    // Generate IDM from Phase 0-3 results
    let idm: IDM | undefined;
    let companyName: string | undefined = pipelineConfig.companyName;

    if (fs.existsSync(phase0OutputPath)) {
      try {
        pipelineLogger.info('Consolidating IDM from Phase 0-3 results...');
        const phase0Data = JSON.parse(fs.readFileSync(phase0OutputPath, 'utf-8'));
        const phase1Data = JSON.parse(fs.readFileSync(phase1OutputPath, 'utf-8'));
        const phase2Data = JSON.parse(fs.readFileSync(phase2OutputPath, 'utf-8'));
        const phase3Data = JSON.parse(fs.readFileSync(phase3OutputPath, 'utf-8'));

        // Extract company name from Phase 0 data if not provided
        if (!companyName && phase0Data.output?.companyProfile?.basic_information?.company_name) {
          companyName = phase0Data.output.companyProfile.basic_information.company_name;
        }

        const idmInput: IDMConsolidatorInput = {
          companyProfile: phase0Data.output.companyProfile,
          questionnaireResponses: phase0Data.output.questionnaireResponses,
          phase1Results: phase1Data,
          phase2Results: phase2Data,
          phase3Results: phase3Data,
          assessmentRunId: phase0Data.assessment_run_id,
        };

        const idmResult = consolidateIDM(idmInput);
        if (idmResult.validationPassed) {
          idm = idmResult.idm;
          pipelineLogger.info({
            overallScore: idm.scores_summary.overall_health_score,
            descriptor: idm.scores_summary.descriptor,
          }, 'IDM consolidated successfully');

          // Save IDM to output
          const idmOutputPath = path.join(outputDir, 'idm_output.json');
          fs.writeFileSync(idmOutputPath, JSON.stringify(idm, null, 2));
          pipelineLogger.info(`IDM saved to ${idmOutputPath}`);
        } else {
          pipelineLogger.warn({
            errors: idmResult.validationErrors,
          }, 'IDM validation had issues but continuing...');
          idm = idmResult.idm;
        }
      } catch (idmError) {
        pipelineLogger.warn({
          error: idmError instanceof Error ? idmError.message : String(idmError),
        }, 'IDM consolidation failed, continuing without IDM');
      }
    }

    // Create orchestrator with report generation config
    const orchestrator = createPhase4Orchestrator({
      generateReports: pipelineConfig.generateReports && !!idm,
      reportTypes: pipelineConfig.reportTypes,
      companyName,
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    });

    const results = await orchestrator.executePhase4(phase1OutputPath, phase2OutputPath, phase3OutputPath, idm);

    // Save Phase 4 output
    const phase4OutputPath = path.join(outputDir, 'phase4_output.json');
    fs.writeFileSync(phase4OutputPath, JSON.stringify(results, null, 2));

    // Build details for result
    const details: Record<string, unknown> = {
      status: results.status,
      health_score: results.summaries?.health_status?.score,
      health_descriptor: results.summaries?.health_status?.descriptor,
    };

    if (results.generated_reports && results.generated_reports.length > 0) {
      details.reports_generated = results.generated_reports.length;
      details.report_types = results.generated_reports.map(r => r.reportType);
    }

    if (results.metadata.report_generation) {
      details.report_tokens = {
        input: results.metadata.report_generation.total_input_tokens,
        output: results.metadata.report_generation.total_output_tokens,
      };
    }

    return {
      phase: 4,
      status: results.status === 'failed' ? 'failed' : 'success',
      duration_ms: Date.now() - startTime,
      output_path: phase4OutputPath,
      details,
    };
  } catch (error) {
    // Log full error for debugging
    console.error('Phase 4 error details:', error);
    if (error instanceof Error && error.stack) {
      console.error('Stack trace:', error.stack);
    }
    return {
      phase: 4,
      status: 'failed',
      duration_ms: Date.now() - startTime,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// ============================================================================
// Main Pipeline Executor
// ============================================================================

async function runPipeline(config: PipelineConfig): Promise<void> {
  const pipelineStartTime = Date.now();
  const results: PhaseResult[] = [];

  console.log('\n' + '='.repeat(80));
  console.log('BIZHEALTH REPORT PIPELINE');
  console.log('='.repeat(80));
  console.log(`Webhook:    ${config.webhookPath}`);
  console.log(`Output Dir: ${config.outputDir}`);
  console.log(`Phases:     ${config.startPhase} → ${config.endPhase}`);
  console.log(`Reports:    ${config.generateReports ? `Enabled (${config.reportTypes.length} types)` : 'Disabled'}`);
  if (config.companyName) {
    console.log(`Company:    ${config.companyName}`);
  }
  console.log('='.repeat(80) + '\n');

  // Ensure output directory exists
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
    pipelineLogger.info({ dir: config.outputDir }, 'Created output directory');
  }

  // Load webhook data
  let webhookPayload: WebhookPayload;
  try {
    const webhookPath = path.resolve(config.webhookPath);
    const webhookData = fs.readFileSync(webhookPath, 'utf-8');
    webhookPayload = JSON.parse(webhookData);
    pipelineLogger.info({
      path: webhookPath,
      company: webhookPayload.business_overview?.company_name,
    }, 'Loaded webhook payload');
  } catch (error) {
    console.error(`ERROR: Failed to load webhook data from ${config.webhookPath}`);
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  // Execute phases
  const phaseExecutors = [
    () => executePhase0(webhookPayload, config.outputDir),
    () => executePhase1(webhookPayload, config.outputDir),
    () => executePhase2(config.outputDir),
    () => executePhase3(config.outputDir),
    () => executePhase4(config.outputDir, config),
  ];

  for (let phase = config.startPhase; phase <= config.endPhase; phase++) {
    if (phase < 0 || phase > 4) {
      console.warn(`Skipping invalid phase: ${phase}`);
      continue;
    }

    console.log(`\n${'─'.repeat(60)}`);
    console.log(`PHASE ${phase}`);
    console.log('─'.repeat(60));

    const result = await phaseExecutors[phase]();
    results.push(result);

    // Print phase result
    const statusIcon = result.status === 'success' ? '✓' : result.status === 'skipped' ? '⊘' : '✗';
    console.log(`${statusIcon} Phase ${phase}: ${result.status.toUpperCase()}`);
    console.log(`  Duration: ${result.duration_ms}ms`);

    if (result.output_path) {
      console.log(`  Output: ${result.output_path}`);
    }

    if (result.details) {
      for (const [key, value] of Object.entries(result.details)) {
        if (typeof value !== 'object') {
          console.log(`  ${key}: ${value}`);
        }
      }
    }

    if (result.error) {
      console.log(`  Error: ${result.error}`);
    }

    // Stop pipeline on failure
    if (result.status === 'failed') {
      console.log(`\nPipeline stopped at Phase ${phase} due to failure.`);
      break;
    }
  }

  // Print summary
  const totalDuration = Date.now() - pipelineStartTime;
  const successCount = results.filter(r => r.status === 'success').length;
  const failedCount = results.filter(r => r.status === 'failed').length;

  console.log('\n' + '='.repeat(80));
  console.log('PIPELINE SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total Duration: ${totalDuration}ms (${(totalDuration / 1000).toFixed(1)}s)`);
  console.log(`Phases Run: ${results.length}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${failedCount}`);
  console.log(`Output Directory: ${path.resolve(config.outputDir)}`);
  console.log('='.repeat(80) + '\n');

  // Save pipeline summary
  const summaryPath = path.join(config.outputDir, 'pipeline_summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify({
    config,
    results,
    total_duration_ms: totalDuration,
    completed_at: new Date().toISOString(),
  }, null, 2));

  process.exit(failedCount > 0 ? 1 : 0);
}

// ============================================================================
// Entry Point
// ============================================================================

async function main(): Promise<void> {
  try {
    const config = parseArgs();

    // Validate environment
    if (config.startPhase >= 1 && !process.env.ANTHROPIC_API_KEY) {
      console.error('ERROR: ANTHROPIC_API_KEY environment variable is required for Phase 1+');
      console.error('\nTo run only Phase 0 (no API required):');
      console.error('  npx tsx src/run-pipeline.ts sample_webhook.json --phase=0\n');
      process.exit(1);
    }

    await runPipeline(config);
  } catch (error) {
    pipelineLogger.error({ error: formatError(error) }, 'Pipeline error');
    console.error('\nERROR:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Run if this is the entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { runPipeline, parseArgs };
