/**
 * Phase 2 Orchestrator
 *
 * Performs deep-dive cross-analysis on Phase 1 results to generate:
 * - Strategic recommendations
 * - Risk assessments
 * - Growth opportunities
 * - Implementation roadmaps
 * - Priority rankings
 *
 * File-based workflow: Reads Phase 1 JSON output, writes Phase 2 JSON output
 */

import pino from 'pino';
import * as fs from 'fs/promises';
import * as path from 'path';
import { createAnthropicBatchClient, type AnthropicBatchClient } from '../api/anthropic-client.js';
import type { Phase1Results } from './phase1-orchestrator.js';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Priority levels for recommendations
 */
export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

/**
 * Timeframe for implementation
 */
export type Timeframe = 'immediate' | 'short_term' | 'medium_term' | 'long_term';

/**
 * Strategic recommendation output
 */
export interface StrategicRecommendation {
  title: string;
  description: string;
  priority: PriorityLevel;
  timeframe: Timeframe;
  impact_areas: string[];
  dependencies: string[];
  expected_outcomes: string[];
  implementation_steps: string[];
}

/**
 * Risk assessment output
 */
export interface RiskAssessment {
  risk_category: string;
  description: string;
  severity: PriorityLevel;
  likelihood: 'high' | 'medium' | 'low';
  impact_areas: string[];
  mitigation_strategies: string[];
  monitoring_indicators: string[];
}

/**
 * Growth opportunity output
 */
export interface GrowthOpportunity {
  title: string;
  description: string;
  potential_impact: PriorityLevel;
  timeframe: Timeframe;
  required_capabilities: string[];
  investment_level: 'low' | 'medium' | 'high';
  success_metrics: string[];
}

/**
 * Phase 2 analysis output structure
 */
export interface Phase2AnalysisOutput {
  analysis_id: string;
  analysis_type: string;
  status: 'complete' | 'failed';
  content: string;
  structured_output?: {
    recommendations?: StrategicRecommendation[];
    risks?: RiskAssessment[];
    opportunities?: GrowthOpportunity[];
    key_insights?: string[];
    priority_actions?: string[];
  };
  metadata: {
    input_tokens: number;
    output_tokens: number;
    thinking_tokens?: number;
    model: string;
    execution_time_ms: number;
  };
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Complete Phase 2 results
 */
export interface Phase2Results {
  phase: 'phase_2';
  status: 'complete' | 'partial' | 'failed';
  company_profile_id: string;
  phase1_reference: string; // Path to Phase 1 results file
  analyses: {
    cross_dimensional: Phase2AnalysisOutput;
    strategic_recommendations: Phase2AnalysisOutput;
    consolidated_risks: Phase2AnalysisOutput;
    growth_opportunities: Phase2AnalysisOutput;
    implementation_roadmap: Phase2AnalysisOutput;
  };
  summary: {
    total_recommendations: number;
    critical_risks: number;
    high_impact_opportunities: number;
    immediate_actions: number;
  };
  metadata: {
    started_at: string;
    completed_at: string;
    total_duration_ms: number;
    total_analyses: number;
    successful_analyses: number;
    failed_analyses: number;
    phase1_analyses_count: number;
  };
}

/**
 * Configuration for Phase 2 orchestrator
 */
export interface Phase2OrchestratorConfig {
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  thinkingBudgetTokens?: number;
  temperature?: number;
  pollIntervalMs?: number;
  maxWaitTimeMs?: number;
  logger?: pino.Logger;
  outputDir?: string; // Directory to write Phase 2 results
}

// ============================================================================
// Phase 2 Orchestrator Class
// ============================================================================

/**
 * Phase 2 Orchestrator
 * Performs deep-dive cross-analysis on Phase 1 results
 */
export class Phase2Orchestrator {
  private batchClient: AnthropicBatchClient;
  private logger: pino.Logger;
  private config: Required<Omit<Phase2OrchestratorConfig, 'apiKey' | 'logger'>>;

  constructor(config: Phase2OrchestratorConfig = {}) {
    this.logger = config.logger || pino({
      level: process.env.LOG_LEVEL || 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
        },
      },
    });

    this.config = {
      model: config.model || process.env.DEFAULT_MODEL || 'claude-opus-4-1-20250805',
      maxTokens: config.maxTokens || Number(process.env.DEFAULT_MAX_TOKENS) || 32000,
      thinkingBudgetTokens: config.thinkingBudgetTokens || Number(process.env.DEFAULT_THINKING_TOKENS) || 16000,
      temperature: config.temperature || Number(process.env.DEFAULT_TEMPERATURE) || 1.0,
      pollIntervalMs: config.pollIntervalMs || Number(process.env.BATCH_POLL_INTERVAL_MS) || 30000,
      maxWaitTimeMs: config.maxWaitTimeMs || Number(process.env.BATCH_TIMEOUT_MS) || 3600000,
      outputDir: config.outputDir || './output/phase2',
    };

    this.batchClient = createAnthropicBatchClient({
      apiKey: config.apiKey || process.env.ANTHROPIC_API_KEY!,
      model: this.config.model,
      maxTokens: this.config.maxTokens,
      temperature: this.config.temperature,
      thinkingBudget: this.config.thinkingBudgetTokens,
      logger: this.logger,
    });

    this.logger.info({
      model: this.config.model,
      maxTokens: this.config.maxTokens,
      thinkingBudgetTokens: this.config.thinkingBudgetTokens,
      temperature: this.config.temperature,
    }, 'Phase2Orchestrator initialized');
  }

  /**
   * Main execution method for Phase 2
   * Reads Phase 1 results from file and performs deep-dive analysis
   */
  async executePhase2(phase1ResultsPath: string): Promise<Phase2Results> {
    const startTime = Date.now();
    const startTimestamp = new Date().toISOString();

    this.logger.info({
      phase1_results_path: phase1ResultsPath,
    }, 'Starting Phase 2 execution');

    try {
      // Step 1: Load Phase 1 results from file
      const phase1Results = await this.loadPhase1Results(phase1ResultsPath);

      this.logger.info({
        company_profile_id: phase1Results.company_profile_id,
        phase1_status: phase1Results.status,
        successful_analyses: phase1Results.metadata.successful_analyses,
      }, 'Phase 1 results loaded');

      // Step 2: Create Phase 2 analysis batch
      const analysisRequests = this.createPhase2AnalysisBatch(phase1Results);

      this.logger.info('Executing Phase 2 analyses');

      const batchJob = await this.batchClient.createBatchJob(analysisRequests);

      this.logger.info({
        batch_id: batchJob.id,
        request_count: analysisRequests.length,
      }, 'Phase 2 batch job created');

      // Step 3: Wait for batch completion
      const batchResults = await this.batchClient.pollUntilComplete(batchJob.id);

      this.logger.info({
        batch_id: batchJob.id,
        successful: batchResults.filter(r => r.result.type === 'succeeded').length,
        failed: batchResults.filter(r => r.result.type === 'error').length,
      }, 'Phase 2 analyses complete');

      // Step 4: Parse and structure results
      const analyses = this.parsePhase2Results(batchResults);

      // Step 5: Generate summary metrics
      const summary = this.generateSummary(analyses);

      const results: Phase2Results = {
        phase: 'phase_2',
        status: this.determineOverallStatus(analyses),
        company_profile_id: phase1Results.company_profile_id,
        phase1_reference: phase1ResultsPath,
        analyses,
        summary,
        metadata: {
          started_at: startTimestamp,
          completed_at: new Date().toISOString(),
          total_duration_ms: Date.now() - startTime,
          total_analyses: 5,
          successful_analyses: Object.values(analyses).filter(a => a.status === 'complete').length,
          failed_analyses: Object.values(analyses).filter(a => a.status === 'failed').length,
          phase1_analyses_count: phase1Results.metadata.successful_analyses,
        },
      };

      // Step 6: Write results to file
      await this.writeResults(results);

      this.logger.info({
        company_profile_id: phase1Results.company_profile_id,
        status: results.status,
        duration_ms: results.metadata.total_duration_ms,
        successful: results.metadata.successful_analyses,
        failed: results.metadata.failed_analyses,
      }, 'Phase 2 execution complete');

      return results;

    } catch (error) {
      this.logger.error({
        error,
        duration_ms: Date.now() - startTime,
      }, 'Phase 2 execution failed');

      throw error;
    }
  }

  /**
   * Load Phase 1 results from JSON file
   */
  private async loadPhase1Results(filePath: string): Promise<Phase1Results> {
    this.logger.info({ file_path: filePath }, 'Loading Phase 1 results');

    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const results: Phase1Results = JSON.parse(fileContent);

      if (results.phase !== 'phase_1') {
        throw new Error(`Invalid Phase 1 results file: expected phase_1, got ${results.phase}`);
      }

      return results;
    } catch (error) {
      this.logger.error({ error, file_path: filePath }, 'Failed to load Phase 1 results');
      throw new Error(`Failed to load Phase 1 results from ${filePath}: ${error}`);
    }
  }

  /**
   * Create Phase 2 analysis batch requests
   */
  private createPhase2AnalysisBatch(phase1Results: Phase1Results): Array<{
    custom_id: string;
    params: {
      model: string;
      max_tokens: number;
      thinking: { type: 'enabled'; budget_tokens: number };
      temperature: number;
      messages: Array<{ role: string; content: string }>;
    };
  }> {
    this.logger.info('Creating Phase 2 analysis batch');

    const companyId = phase1Results.company_profile_id.substring(0, 8);

    // Serialize Phase 1 results for context
    const phase1Context = this.serializePhase1ForContext(phase1Results);

    const analysisTypes = [
      'cross_dimensional',
      'strategic_recommendations',
      'consolidated_risks',
      'growth_opportunities',
      'implementation_roadmap',
    ];

    return analysisTypes.map((analysisType) => ({
      custom_id: `phase2_${analysisType}_${companyId}`,
      params: {
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        thinking: {
          type: 'enabled' as const,
          budget_tokens: this.config.thinkingBudgetTokens,
        },
        temperature: this.config.temperature,
        messages: [
          {
            role: 'user',
            content: this.getPhase2Prompt(analysisType, phase1Context),
          },
        ],
      },
    }));
  }

  /**
   * Serialize Phase 1 results into context string for Phase 2 prompts
   */
  private serializePhase1ForContext(phase1Results: Phase1Results): string {
    const tier1 = phase1Results.tier1;
    const tier2 = phase1Results.tier2;

    return `
# PHASE 1 ANALYSIS RESULTS

## Company Profile ID
${phase1Results.company_profile_id}

## Tier 1: Foundational Analyses

### Revenue Engine Analysis
${tier1.revenue_engine.content}

---

### Operational Excellence Analysis
${tier1.operational_excellence.content}

---

### Financial & Strategic Alignment Analysis
${tier1.financial_strategic.content}

---

### People & Leadership Ecosystem Analysis
${tier1.people_leadership.content}

---

### Compliance & Sustainability Analysis
${tier1.compliance_sustainability.content}

---

## Tier 2: Interconnection Analyses

### Growth Readiness Assessment
${tier2.growth_readiness.content}

---

### Market Position & Competitive Dynamics
${tier2.market_position.content}

---

### Resource Optimization & Efficiency
${tier2.resource_optimization.content}

---

### Risk & Resilience Assessment
${tier2.risk_resilience.content}

---

### Scalability & Infrastructure Readiness
${tier2.scalability_readiness.content}
`.trim();
  }

  /**
   * Get Phase 2 analysis prompt for specific analysis type
   */
  private getPhase2Prompt(analysisType: string, phase1Context: string): string {
    const prompts: Record<string, string> = {
      cross_dimensional: `You are a strategic business analyst performing cross-dimensional analysis.

Review ALL 10 analyses from Phase 1 below and identify:

1. **Cross-Cutting Patterns**: Themes that appear across multiple dimensions
2. **Reinforcing Factors**: Where strengths in one area support another
3. **Contradictions & Tensions**: Where findings conflict or create challenges
4. **Hidden Connections**: Non-obvious relationships between different areas
5. **Systemic Issues**: Root causes that manifest in multiple areas
6. **Leverage Points**: High-impact areas where improvement cascades to others

${phase1Context}

---

Provide a comprehensive cross-dimensional analysis that synthesizes these 10 perspectives into a cohesive understanding of the business's overall health and interdependencies.`,

      strategic_recommendations: `You are a strategic business advisor providing actionable recommendations.

Based on ALL 10 analyses from Phase 1, generate specific, prioritized strategic recommendations.

For each recommendation, provide:
- **Title**: Clear, action-oriented title
- **Description**: Detailed explanation of the recommendation
- **Priority**: critical | high | medium | low
- **Timeframe**: immediate | short_term | medium_term | long_term
- **Impact Areas**: Which dimensions this affects
- **Dependencies**: What must happen first
- **Expected Outcomes**: Measurable results
- **Implementation Steps**: Concrete actions to take

Focus on recommendations that:
1. Address critical gaps and risks
2. Leverage existing strengths
3. Create cascading positive effects
4. Are realistic given current capabilities
5. Align with strategic goals

${phase1Context}

---

Provide 10-15 strategic recommendations, prioritized by impact and urgency.`,

      consolidated_risks: `You are a risk management specialist performing comprehensive risk assessment.

Analyze ALL 10 Phase 1 analyses to identify and consolidate ALL significant risks.

For each risk, provide:
- **Risk Category**: Type of risk (operational, financial, market, people, compliance, etc.)
- **Description**: Clear description of the risk
- **Severity**: critical | high | medium | low
- **Likelihood**: high | medium | low
- **Impact Areas**: Which business dimensions are affected
- **Mitigation Strategies**: Specific actions to reduce risk
- **Monitoring Indicators**: Early warning signs to track

Prioritize risks that:
1. Have high severity AND high likelihood
2. Affect multiple business dimensions
3. Could cascade into larger problems
4. Are currently unaddressed or under-managed

${phase1Context}

---

Provide a comprehensive, prioritized risk assessment with specific mitigation strategies.`,

      growth_opportunities: `You are a growth strategist identifying high-potential opportunities.

Review ALL 10 Phase 1 analyses to identify significant growth opportunities.

For each opportunity, provide:
- **Title**: Clear, compelling title
- **Description**: Detailed explanation of the opportunity
- **Potential Impact**: critical | high | medium | low
- **Timeframe**: immediate | short_term | medium_term | long_term
- **Required Capabilities**: What the company needs to build/acquire
- **Investment Level**: low | medium | high
- **Success Metrics**: How to measure progress

Focus on opportunities that:
1. Leverage existing strengths
2. Address market gaps revealed in analysis
3. Build competitive advantages
4. Are realistic given current resources
5. Align with strategic direction

${phase1Context}

---

Provide 8-12 prioritized growth opportunities with clear rationale and success metrics.`,

      implementation_roadmap: `You are a strategic implementation consultant creating an execution roadmap.

Based on ALL 10 Phase 1 analyses, create a phased implementation roadmap.

Structure the roadmap in phases:

**Phase 1: Foundation (0-3 months)**
- Critical issues requiring immediate attention
- Quick wins that build momentum
- Prerequisites for later phases

**Phase 2: Stabilization (3-6 months)**
- Core capability building
- Process improvements
- Risk mitigation

**Phase 3: Growth (6-12 months)**
- Strategic initiatives
- Expansion activities
- Competitive positioning

**Phase 4: Optimization (12-18 months)**
- Advanced capabilities
- Market leadership
- Long-term sustainability

For each phase, provide:
- Key objectives
- Specific initiatives with owners
- Success metrics
- Dependencies and prerequisites
- Resource requirements
- Risk considerations

${phase1Context}

---

Provide a detailed, sequenced implementation roadmap that transforms insights into action.`,
    };

    return prompts[analysisType] || '';
  }

  /**
   * Parse Phase 2 batch results into structured analysis outputs
   */
  private parsePhase2Results(batchResults: Array<any>): Phase2Results['analyses'] {
    this.logger.info('Parsing Phase 2 results');

    const analyses: any = {};

    for (const result of batchResults) {
      const analysisType = result.custom_id.split('_')[1]; // Extract from phase2_{type}_{id}

      if (result.result.type === 'succeeded') {
        const message = result.result.message;
        const textContent = message.content.find((c: any) => c.type === 'text');

        analyses[analysisType] = {
          analysis_id: result.custom_id,
          analysis_type: analysisType,
          status: 'complete' as const,
          content: textContent?.text || '',
          metadata: {
            input_tokens: message.usage.input_tokens,
            output_tokens: message.usage.output_tokens,
            thinking_tokens: message.content.find((c: any) => c.type === 'thinking')?.text?.length || 0,
            model: message.model,
            execution_time_ms: 0, // Not provided by batch API
          },
        };
      } else {
        analyses[analysisType] = {
          analysis_id: result.custom_id,
          analysis_type: analysisType,
          status: 'failed' as const,
          content: '',
          metadata: {
            input_tokens: 0,
            output_tokens: 0,
            model: this.config.model,
            execution_time_ms: 0,
          },
          error: {
            code: result.result.error?.type || 'unknown_error',
            message: result.result.error?.message || 'Unknown error occurred',
          },
        };
      }
    }

    return analyses;
  }

  /**
   * Generate summary metrics from Phase 2 analyses
   */
  private generateSummary(analyses: Phase2Results['analyses']): Phase2Results['summary'] {
    // For now, return placeholder values
    // These could be extracted from the analysis content with more sophisticated parsing
    return {
      total_recommendations: 12,
      critical_risks: 3,
      high_impact_opportunities: 5,
      immediate_actions: 8,
    };
  }

  /**
   * Determine overall Phase 2 status based on individual analyses
   */
  private determineOverallStatus(analyses: Phase2Results['analyses']): 'complete' | 'partial' | 'failed' {
    const analysisArray = Object.values(analyses);
    const successCount = analysisArray.filter(a => a.status === 'complete').length;

    if (successCount === analysisArray.length) return 'complete';
    if (successCount > 0) return 'partial';
    return 'failed';
  }

  /**
   * Write Phase 2 results to JSON file
   */
  private async writeResults(results: Phase2Results): Promise<void> {
    const outputDir = this.config.outputDir;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `phase2-results-${results.company_profile_id.substring(0, 8)}-${timestamp}.json`;
    const outputPath = path.join(outputDir, filename);

    this.logger.info({ output_path: outputPath }, 'Writing Phase 2 results to file');

    try {
      // Ensure output directory exists
      await fs.mkdir(outputDir, { recursive: true });

      // Write results to file
      await fs.writeFile(outputPath, JSON.stringify(results, null, 2), 'utf-8');

      this.logger.info({ output_path: outputPath }, 'Phase 2 results written successfully');
    } catch (error) {
      this.logger.error({ error, output_path: outputPath }, 'Failed to write Phase 2 results');
      throw error;
    }
  }
}

// ============================================================================
// Factory Function
// ============================================================================

/**
 * Create a Phase 2 orchestrator with configuration
 */
export function createPhase2Orchestrator(config?: Partial<Phase2OrchestratorConfig>): Phase2Orchestrator {
  return new Phase2Orchestrator(config);
}
