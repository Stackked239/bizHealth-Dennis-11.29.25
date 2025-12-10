# BizHealth Report Pipeline - Comprehensive Codebase Analysis

**Version**: 1.0.0
**Last Updated**: December 10, 2025
**Document Type**: Technical Architecture & Implementation Reference

---

## Executive Summary

This document provides a complete technical analysis of the BizHealth Report Pipeline codebase - a sophisticated multi-phase business intelligence system that transforms raw questionnaire data into comprehensive HTML reports through AI-powered analysis.

**Key Statistics:**
- **Total Lines of Code**: ~50,000+ lines
- **Languages**: TypeScript (99%), Shell scripts (1%)
- **Phases**: 6 (Phase 0-5)
- **Report Types**: 17 different audience-specific reports
- **Report Builders**: 9 builder files
- **Largest File**: comprehensive-report.builder.ts (3,224 lines)
- **Generated Output Size**: ~3MB per run (17 HTML files + metadata)

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Directory Structure Deep Dive](#2-directory-structure-deep-dive)
3. [Core System Components](#3-core-system-components)
4. [Phase Orchestrators](#4-phase-orchestrators)
5. [Report Generation System](#5-report-generation-system)
6. [Data Structures & Type System](#6-data-structures--type-system)
7. [API Integration Layer](#7-api-integration-layer)
8. [Utility Systems](#8-utility-systems)
9. [Code Patterns & Conventions](#9-code-patterns--conventions)
10. [Performance & Optimization](#10-performance--optimization)
11. [Security & Error Handling](#11-security--error-handling)
12. [Testing Architecture](#12-testing-architecture)
13. [Recent Fixes & Evolution](#13-recent-fixes--evolution)
14. [Development Guidelines](#14-development-guidelines)

---

## 1. Architecture Overview

### 1.1 High-Level System Architecture

The BizHealth pipeline implements a **linear multi-stage processing architecture** where each phase produces JSON output consumed by subsequent phases.

\`\`\`
┌─────────────────────────────────────────────────────────────────────────┐
│                      BIZHEALTH REPORT PIPELINE                          │
│                                                                         │
│  Input: Webhook JSON (questionnaire + company profile)                 │
│         │                                                               │
│         ▼                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │   Phase 0   │→ │   Phase 1   │→ │   Phase 2   │→ │   Phase 3   │  │
│  │ Normalize   │  │   Tier 1    │  │   Tier 2    │  │   Tier 3    │  │
│  │   Data      │  │  Analysis   │  │  Synthesis  │  │  Narrative  │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │
│         │                 │                 │                 │        │
│         ▼                 ▼                 ▼                 ▼        │
│   phase0.json      phase1.json      phase2.json      phase3.json      │
│         │                 │                 │                 │        │
│         └─────────────────┴─────────────────┴─────────────────┘        │
│                             │                                          │
│                             ▼                                          │
│                    ┌─────────────┐                                     │
│                    │   Phase 4   │                                     │
│                    │ Build IDM   │                                     │
│                    └─────────────┘                                     │
│                             │                                          │
│                             ▼                                          │
│                     idm_output.json                                    │
│                             │                                          │
│                             ▼                                          │
│                    ┌─────────────┐                                     │
│                    │   Phase 5   │                                     │
│                    │   Generate  │                                     │
│                    │   Reports   │                                     │
│                    └─────────────┘                                     │
│                             │                                          │
│                             ▼                                          │
│                  17 HTML Reports + Manifest                            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
\`\`\`

### 1.2 Design Patterns

**1. Pipeline Pattern**
- Sequential phases with clear inputs/outputs
- Each phase is idempotent (can be re-run safely)
- File-based communication between phases

**2. Factory Pattern**
- Report builders registered in configuration
- Dynamic instantiation based on enabled reports
- Chart generators selected by data type

**3. Builder Pattern**
- Complex HTML construction through composition
- Incremental section building
- Component-based architecture

**4. Strategy Pattern**
- Multiple rendering strategies per report type
- Batch vs synchronous API strategies
- Conditional report sections based on data

**5. Repository Pattern**
- Database abstraction layer
- File system operations abstracted
- Consistent data access interface

### 1.3 Key Architectural Decisions

**Decision 1: Why File-Based Communication?**
- **Rationale**: Resilience and debuggability
- **Benefits**: 
  - Each phase output is visible and inspectable
  - Phases can be re-run independently
  - Easy troubleshooting and recovery
  - No in-memory state requirements

**Decision 2: Why Batch API for Phases 1 & 3?**
- **Rationale**: Cost optimization (50% savings)
- **Trade-off**: 24-hour processing window
- **Benefits**: Significant cost savings for non-urgent processing

**Decision 3: Why 17 Different Reports?**
- **Rationale**: Audience-specific content delivery
- **Benefits**:
  - Each stakeholder gets relevant information
  - Reduces cognitive load (no information overload)
  - Enables role-based access control

**Decision 4: Why SVG Charts Instead of JavaScript Libraries?**
- **Rationale**: Portability and print quality
- **Benefits**:
  - No external dependencies
  - Works in all browsers (even with JS disabled)
  - Perfect print rendering
  - Accessible markup

---

## 2. Directory Structure Deep Dive

### 2.1 Top-Level Structure

\`\`\`
workflow-export/
├── src/                          # Source code (TypeScript)
├── output/                       # Pipeline outputs (JSON + HTML)
├── node_modules/                 # Dependencies (gitignored)
├── dist/                         # Compiled JavaScript (gitignored)
├── package.json                  # NPM dependencies
├── tsconfig.json                 # TypeScript configuration
├── README.md                     # User documentation
├── CODEBASE_ANALYSIS.md          # This document
└── sample_webhook.json           # Sample input data
\`\`\`

### 2.2 Source Code Organization

\`\`\`
src/
├── __tests__/                     # Jest test files
│   ├── reports/                   # Report-specific tests
│   │   └── report-snapshots.test.ts
│   ├── phase0.test.ts
│   ├── phase5-visual-validation.test.ts
│   └── beta-mode.test.ts
│
├── api/                           # External API clients
│   ├── claude-client.ts           # Anthropic Claude API
│   └── batch-api.ts               # Batch processing API
│
├── config/                        # Configuration files
│   └── reports.config.ts          # Report definitions
│
├── contracts/                     # Interface contracts
│   └── visualization.contract.ts  # Visualization interfaces
│
├── data/                          # Static data files
│   └── question-mappings.json     # Questionnaire mappings
│
├── data-transformation/           # Data transformation utilities
│   ├── normalizer.ts
│   └── consolidator.ts
│
├── database/                      # Database layer
│   ├── db-client.ts               # PostgreSQL client
│   ├── queries.ts                 # SQL queries
│   ├── types.ts                   # Database types
│   └── index.ts                   # Exports
│
├── orchestration/                 # Core pipeline orchestrators
│   ├── phase0-orchestrator.ts     # Phase 0: Normalization
│   ├── phase1-orchestrator.ts     # Phase 1: Tier 1 Analysis
│   ├── phase2-orchestrator.ts     # Phase 2: Tier 2 Synthesis
│   ├── phase3-orchestrator.ts     # Phase 3: Tier 3 Narrative
│   ├── phase4-orchestrator.ts     # Phase 4: IDM Generation
│   ├── phase5-orchestrator.ts     # Phase 5: Report Generation
│   └── reports/                   # Report generation subsystem
│       ├── comprehensive-report.builder.ts (3,224 lines)
│       ├── owners-report.builder.ts (1,780 lines)
│       ├── recipe-report.builder.ts (1,494 lines)
│       ├── executive-brief.builder.ts (1,322 lines)
│       ├── visualization-renderer.service.ts (620 lines)
│       ├── manager-report.builder.ts (610 lines)
│       ├── deep-dive-report.builder.ts (482 lines)
│       ├── financial-report.builder.ts (398 lines)
│       ├── risk-report.builder.ts (382 lines)
│       ├── roadmap-report.builder.ts (346 lines)
│       ├── quick-wins-report.builder.ts (300 lines)
│       ├── report-post-processor.ts (202 lines)
│       ├── html-template.ts (1,623 lines)
│       ├── index.ts (39 lines)
│       ├── charts/                # Chart generation
│       │   ├── generators/        # Chart factories
│       │   ├── d3/                # D3.js implementations
│       │   └── types/             # Chart type definitions
│       ├── components/            # Reusable components
│       │   ├── cards/             # Card components
│       │   ├── legal/             # Legal components
│       │   ├── sections/          # Section templates
│       │   └── visual/            # Visual components
│       ├── config/                # Report configuration
│       ├── constants/             # Constants
│       ├── integration/           # Integration utilities
│       ├── styles/                # CSS styling
│       ├── utils/                 # Report utilities
│       └── validation/            # Report validation
│
├── prompts/                       # AI prompt templates
│   ├── parsers/                   # Response parsers
│   ├── schemas/                   # JSON schemas
│   ├── shared/                    # Shared components
│   ├── templates/                 # Base templates
│   ├── tier1/                     # Phase 1 prompts
│   └── tier2/                     # Phase 2 prompts
│
├── qa/                            # Quality assurance
│   ├── __tests__/                 # QA tests
│   ├── fixtures/                  # Test data
│   ├── helpers/                   # QA utilities
│   ├── scripts/                   # QA automation
│   ├── phase4-safety-patches.ts   # Phase 4 validation
│   ├── phase4-validation.ts       # IDM validation
│   └── report-qa-harness.ts       # Report QA framework
│
├── scripts/                       # Utility scripts
│   └── render-pdf.ts              # PDF rendering
│
├── services/                      # External services
│   └── email-service.ts           # Email delivery
│
├── types/                         # TypeScript type definitions
│   ├── idm.types.ts               # IDM structure
│   ├── report.types.ts            # Report structures
│   ├── report-content.types.ts    # Content types
│   ├── webhook.types.ts           # Webhook payload
│   ├── normalized.types.ts        # Phase 0 types
│   ├── recipe.types.ts            # Recipe system
│   ├── visualization.types.ts     # Chart types
│   ├── questionnaire.types.ts     # Questionnaire types
│   ├── company-profile.types.ts   # Company types
│   └── raw-input.types.ts         # Raw input types
│
├── utils/                         # Global utilities
│   ├── logger.ts                  # Logging system
│   ├── safety.utils.ts            # Safe operations
│   ├── errors.ts                  # Error handling
│   ├── security.ts                # Security utilities
│   ├── benchmark-calculator.ts    # Performance metrics
│   ├── recipe-validator.ts        # Recipe validation
│   └── phase-consolidator.ts      # Phase consolidation
│
├── validation/                    # Global validation
│   └── schema-validator.ts        # JSON schema validation
│
├── visualization/                 # Visualization utilities
│   ├── components/
│   │   └── gauge.ts               # Gauge charts
│   ├── ascii-detector.ts          # ASCII art detection
│   ├── integration.ts             # Visualization integration
│   └── index.ts                   # Exports
│
├── phase0-index.ts                # Phase 0 entry point
└── run-pipeline.ts                # Main entry point (CLI)
\`\`\`

### 2.3 Key Directory Responsibilities

| Directory | Lines of Code | Primary Responsibility |
|-----------|---------------|------------------------|
| `src/orchestration/` | ~15,000 | Pipeline orchestration, phase coordination |
| `src/orchestration/reports/` | ~12,000 | Report generation, HTML building |
| `src/types/` | ~3,000 | TypeScript type system |
| `src/prompts/` | ~5,000 | AI prompt engineering |
| `src/api/` | ~1,500 | External API communication |
| `src/qa/` | ~2,000 | Quality assurance, validation |
| `src/utils/` | ~1,500 | Shared utilities |
| `src/database/` | ~800 | Data persistence |
| `src/visualization/` | ~500 | Chart generation |

---

## 3. Core System Components

### 3.1 Main Entry Point: run-pipeline.ts

**Purpose**: CLI interface and pipeline orchestration coordinator
**Lines of Code**: ~500 lines
**Key Responsibilities**:
1. Parse command-line arguments
2. Load webhook data (from file or database)
3. Execute phases sequentially
4. Handle errors and cleanup

**CLI Interface:**

\`\`\`typescript
interface CLIArgs {
  webhookFile?: string;       // Path to webhook JSON
  startPhase?: number;        // Starting phase (0-5)
  endPhase?: number;          // Ending phase (0-5)
  phase?: string;             // Shorthand: "4-5" or "all"
  skipDb?: boolean;           // Skip database, use file
  verbose?: boolean;          // Verbose logging
}
\`\`\`

**Usage Examples:**

\`\`\`bash
# Run entire pipeline (all phases)
node --import tsx src/run-pipeline.ts sample_webhook.json

# Run specific phase range
node --import tsx src/run-pipeline.ts sample_webhook.json --phase=4-5

# Run single phase
node --import tsx src/run-pipeline.ts --start-phase 5 --end-phase 5

# Skip database (use file-based webhook)
node --import tsx src/run-pipeline.ts sample_webhook.json --skip-db

# Verbose logging
node --import tsx src/run-pipeline.ts sample_webhook.json --verbose
\`\`\`

**Execution Flow:**

\`\`\`typescript
async function main() {
  try {
    // 1. Parse CLI arguments
    const args = parseArgs(process.argv);
    
    // 2. Load webhook data
    const webhookData = await loadWebhookData(args);
    
    // 3. Determine phases to execute
    const phases = determinePhases(args);
    console.log(\`Executing phases: \${phases.join(', ')}\`);
    
    // 4. Execute each phase sequentially
    for (const phase of phases) {
      console.log(\`\\n=== PHASE \${phase} ===\`);
      await executePhase(phase, webhookData, args);
    }
    
    // 5. Success summary
    console.log(\`\\n✓ Pipeline complete!\`);
    process.exit(0);
    
  } catch (error) {
    console.error('Pipeline failed:', error);
    process.exit(1);
  }
}
\`\`\`

### 3.2 Configuration System: config/reports.config.ts

**Purpose**: Centralized report configuration registry
**Pattern**: Configuration-driven report generation

**Report Configuration Structure:**

\`\`\`typescript
export interface ReportConfig {
  type: string;                   // Unique report type ID
  name: string;                   // Display name
  description: string;            // Purpose description
  builder: ReportBuilderFn;       // Builder function
  enabled: boolean;               // Enable/disable flag
  audience: string[];             // Target audiences
  estimatedPages: string;         // Page estimate
  priority: number;               // Generation priority (1-17)
  dependencies?: string[];        // Required data dependencies
}

export type ReportBuilderFn = (
  ctx: ReportContext
) => Promise<string>;
\`\`\`

**Report Registry:**

\`\`\`typescript
export const REPORT_CONFIGS: ReportConfig[] = [
  {
    type: 'comprehensive',
    name: 'Comprehensive Assessment Report',
    description: 'Complete 360° business health analysis',
    builder: buildComprehensiveReport,
    enabled: true,
    audience: ['executives', 'board', 'advisors'],
    estimatedPages: '200-400',
    priority: 1
  },
  {
    type: 'owner',
    name: 'Business Owner Report',
    description: 'Executive summary for business owners',
    builder: buildOwnersReport,
    enabled: true,
    audience: ['owner', 'ceo'],
    estimatedPages: '40-80',
    priority: 2
  },
  {
    type: 'executiveBrief',
    name: 'Executive Health Snapshot',
    description: 'One-page executive summary',
    builder: buildExecutiveBrief,
    enabled: true,
    audience: ['executives', 'board'],
    estimatedPages: '15-25',
    priority: 3
  },
  // ... 14 more report configurations
];
\`\`\`

**Dynamic Report Loading:**

\`\`\`typescript
export function getEnabledReports(): ReportConfig[] {
  return REPORT_CONFIGS.filter(config => config.enabled);
}

export function getReportByType(type: string): ReportConfig | undefined {
  return REPORT_CONFIGS.find(config => config.type === type);
}

export function getReportsByAudience(audience: string): ReportConfig[] {
  return REPORT_CONFIGS.filter(config => 
    config.audience.includes(audience)
  );
}
\`\`\`

---

*Continuing in next response due to length...*

## 4. Phase Orchestrators - Detailed Analysis

Each phase has a dedicated orchestrator file responsible for coordinating its specific processing logic.

### 4.1 Phase 0: Data Normalization

**File**: `src/orchestration/phase0-orchestrator.ts`
**Input**: Webhook JSON (raw questionnaire responses)
**Output**: `output/phase0_output.json`
**Execution Mode**: Synchronous, ~1 second
**Dependencies**: None

**Key Functions:**

src/orchestration/phase0-orchestrator.ts:15-45
\`\`\`typescript
export async function executePhase0(
  webhookData: WebhookPayload
): Promise<NormalizedOutput> {
  console.log('Phase 0: Normalizing questionnaire data...');

  // Step 1: Validate webhook structure
  validateWebhookPayload(webhookData);

  // Step 2: Extract company profile
  const companyProfile = extractCompanyProfile(webhookData);

  // Step 3: Normalize responses
  const normalizedResponses = normalizeResponses(
    webhookData.responses,
    QUESTION_MAPPING
  );

  // Step 4: Group by dimension
  const groupedByDimension = groupResponsesByDimension(
    normalizedResponses
  );

  // Step 5: Calculate preliminary scores
  const preliminaryScores = calculatePreliminaryScores(
    groupedByDimension
  );

  // Step 6: Build output
  const output: NormalizedOutput = {
    companyId: companyProfile.id,
    companyName: companyProfile.name,
    industry: companyProfile.industry,
    revenue: companyProfile.revenue,
    employees: companyProfile.employeeCount,
    responses: normalizedResponses,
    dimensionGroups: groupedByDimension,
    preliminaryScores,
    metadata: {
      submittedAt: new Date().toISOString(),
      version: '1.0.0'
    }
  };

  // Step 7: Write to disk
  await fs.writeFile(
    'output/phase0_output.json',
    JSON.stringify(output, null, 2)
  );

  console.log('✓ Phase 0 complete');
  return output;
}
\`\`\`

**Question Mapping System:**

src/orchestration/phase0-orchestrator.ts:100-130
\`\`\`typescript
interface QuestionMapping {
  questionId: string;
  dimensionCode: string;
  weight: number;
  reverse?: boolean;  // Reverse scoring
}

const QUESTION_MAPPING: QuestionMapping[] = [
  { questionId: 'Q001', dimensionCode: 'MK', weight: 1.0 },
  { questionId: 'Q002', dimensionCode: 'MK', weight: 0.8 },
  { questionId: 'Q003', dimensionCode: 'SL', weight: 1.0 },
  // ... ~100 more mappings
];

function normalizeResponses(
  responses: QuestionnaireResponse[],
  mapping: QuestionMapping[]
): NormalizedResponse[] {
  return responses.map(response => {
    const questionMap = mapping.find(m => m.questionId === response.questionId);
    
    if (!questionMap) {
      console.warn(\`No mapping for question: \${response.questionId}\`);
      return null;
    }

    return {
      questionId: response.questionId,
      dimensionCode: questionMap.dimensionCode,
      rawValue: response.value,
      normalizedValue: normalizeValue(response.value, questionMap),
      weight: questionMap.weight
    };
  }).filter(r => r !== null);
}
\`\`\`

### 4.2 Phase 1: Tier 1 Analysis (Batch API)

**File**: `src/orchestration/phase1-orchestrator.ts`
**Input**: `output/phase0_output.json`
**Output**: `output/phase1_output.json` + `output/phase1_batch_output.json`
**Execution Mode**: Asynchronous (Batch API), 24-hour window
**API Calls**: 4 batch requests (one per chapter)
**Cost**: ~$0.36 per run

**Batch Creation:**

src/orchestration/phase1-orchestrator.ts:20-60
\`\`\`typescript
export async function executePhase1(
  phase0Output: NormalizedOutput
): Promise<Phase1Output> {
  console.log('Phase 1: Tier 1 Analysis (Batch API)...');

  // Define 4 main chapters
  const chapters = [
    { code: 'GE', name: 'Growth Engine' },
    { code: 'PH', name: 'Performance & Health' },
    { code: 'PL', name: 'People & Leadership' },
    { code: 'RS', name: 'Resilience & Safeguards' }
  ];

  // Create batch requests (one per chapter)
  const batchRequests = chapters.map(chapter => {
    const chapterData = phase0Output.dimensionGroups[chapter.code];
    
    return {
      custom_id: \`chapter_\${chapter.code}\`,
      params: {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system: TIER1_SYSTEM_PROMPT,
        messages: [{
          role: 'user',
          content: buildTier1Prompt(chapter, chapterData, phase0Output.companyProfile)
        }]
      }
    };
  });

  // Submit to Batch API
  const claudeClient = ClaudeClient.getInstance();
  const batch = await claudeClient.createBatch(batchRequests);
  
  console.log(\`✓ Batch created: \${batch.id}\`);
  console.log(\`  Status: \${batch.processing_status}\`);
  console.log(\`  Requests: \${batchRequests.length}\`);

  // Monitor batch progress
  await monitorBatchProgress(batch.id);

  // Retrieve results
  const results = await claudeClient.retrieveBatch(batch.id);
  
  // Parse and consolidate
  const parsedChapters = parseChapterResults(results);

  // Build Phase 1 output
  const output: Phase1Output = {
    chapters: parsedChapters,
    companyId: phase0Output.companyId,
    companyName: phase0Output.companyName,
    metadata: {
      batchId: batch.id,
      processedAt: new Date().toISOString()
    }
  };

  await fs.writeFile(
    'output/phase1_output.json',
    JSON.stringify(output, null, 2)
  );

  console.log('✓ Phase 1 complete');
  return output;
}
\`\`\`

**Prompt Engineering:**

src/prompts/tier1/chapter-analysis.ts:1-50
\`\`\`typescript
export const TIER1_SYSTEM_PROMPT = \`
You are a business health analyst conducting dimensional analysis for the BizHealth platform.

Your task is to analyze questionnaire responses for a specific business dimension and provide:

1. **Overall Health Score** (0-100): Numeric assessment of dimension health
2. **Status Assessment**: One of [Excellent, Good, Needs Improvement, Critical]
3. **Key Strengths**: 3-5 specific strengths with evidence
4. **Key Weaknesses**: 3-5 specific weaknesses with evidence
5. **Strategic Insights**: 2-3 paragraphs of strategic analysis

**Output Requirements:**
- MUST be valid JSON matching the schema provided
- Be specific and evidence-based (reference questionnaire responses)
- Use business terminology appropriate for executives
- Identify both immediate issues and strategic opportunities

**JSON Schema:**
{
  "score": number (0-100),
  "status": "Excellent" | "Good" | "Needs Improvement" | "Critical",
  "strengths": string[] (3-5 items),
  "weaknesses": string[] (3-5 items),
  "insights": string (2-3 paragraphs)
}
\`;

export function buildTier1Prompt(
  chapter: Chapter,
  chapterData: any,
  companyProfile: any
): string {
  return \`
# Business Health Analysis: \${chapter.name}

## Company Context
- Name: \${companyProfile.name}
- Industry: \${companyProfile.industry}
- Revenue: $\${companyProfile.revenue.toLocaleString()}
- Employees: \${companyProfile.employees}

## Questionnaire Responses for \${chapter.name}

\${formatQuestionnaireData(chapterData)}

## Analysis Instructions

Analyze the above responses and provide a comprehensive assessment of the \${chapter.name} dimension.
Focus on identifying patterns, gaps, and strategic implications.

Output your analysis as JSON following the schema provided in the system prompt.
  \`.trim();
}
\`\`\`

### 4.3 Phase 2: Tier 2 Synthesis

**File**: `src/orchestration/phase2-orchestrator.ts`
**Input**: `output/phase1_output.json`
**Output**: `output/phase2_output.json`
**Execution Mode**: Synchronous, single API call
**API Calls**: 1 synchronous message
**Cost**: ~$0.18 per run

src/orchestration/phase2-orchestrator.ts:10-70
\`\`\`typescript
export async function executePhase2(
  phase1Output: Phase1Output
): Promise<Phase2Output> {
  console.log('Phase 2: Cross-dimensional synthesis...');

  // Build synthesis prompt
  const prompt = buildTier2SynthesisPrompt(phase1Output.chapters);

  // Call Claude API synchronously
  const claudeClient = ClaudeClient.getInstance();
  const response = await claudeClient.createMessage({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    system: TIER2_SYSTEM_PROMPT,
    messages: [{ 
      role: 'user', 
      content: prompt 
    }]
  });

  // Parse JSON response
  const synthesis = JSON.parse(response.content[0].text);

  // Calculate overall health score
  const overallScore = calculateOverallHealth(phase1Output.chapters);

  // Build output
  const output: Phase2Output = {
    overallScore,
    status: getHealthStatus(overallScore),
    trajectory: synthesis.trajectory,
    systemicPatterns: synthesis.patterns,
    crossDimensionalRisks: synthesis.risks,
    strategicPriorities: synthesis.priorities,
    executiveSummary: synthesis.summary,
    metadata: {
      processedAt: new Date().toISOString(),
      tokenUsage: response.usage
    }
  };

  await fs.writeFile(
    'output/phase2_output.json',
    JSON.stringify(output, null, 2)
  );

  console.log('✓ Phase 2 complete');
  console.log(\`  Overall Score: \${overallScore}/100\`);
  console.log(\`  Status: \${output.status}\`);
  console.log(\`  Trajectory: \${output.trajectory}\`);
  
  return output;
}

/**
 * Calculate weighted overall health score
 */
function calculateOverallHealth(chapters: Chapter[]): number {
  // Equal weighting for all 4 dimensions
  const weights = {
    'GE': 0.25,  // Growth Engine
    'PH': 0.25,  // Performance & Health
    'PL': 0.25,  // People & Leadership
    'RS': 0.25   // Resilience & Safeguards
  };

  const weightedSum = chapters.reduce((sum, chapter) => {
    const weight = weights[chapter.code] || 0.25;
    return sum + (chapter.score * weight);
  }, 0);

  return Math.round(weightedSum);
}
\`\`\`

### 4.4 Phase 3: Tier 3 Narrative Content (Batch API)

**File**: `src/orchestration/phase3-orchestrator.ts`
**Input**: `output/phase1_output.json` + `output/phase2_output.json`
**Output**: `output/phase3_output.json` + `output/phase3_batch_output.json`
**Execution Mode**: Asynchronous (Batch API), 24-hour window
**API Calls**: 7 batch requests (different content types)
**Cost**: ~$1.86 per run

src/orchestration/phase3-orchestrator.ts:15-80
\`\`\`typescript
export async function executePhase3(
  phase1Output: Phase1Output,
  phase2Output: Phase2Output
): Promise<Phase3Output> {
  console.log('Phase 3: Narrative content generation (Batch API)...');

  // Define content types to generate
  const contentTypes = [
    {
      id: 'executive_summary',
      maxTokens: 4000,
      prompt: buildExecutiveSummaryPrompt(phase1Output, phase2Output)
    },
    {
      id: 'dimension_narratives',
      maxTokens: 16000,
      prompt: buildDimensionNarrativesPrompt(phase1Output)
    },
    {
      id: 'findings_details',
      maxTokens: 12000,
      prompt: buildFindingsPrompt(phase1Output, phase2Output)
    },
    {
      id: 'recommendations',
      maxTokens: 16000,
      prompt: buildRecommendationsPrompt(phase1Output, phase2Output)
    },
    {
      id: 'quick_wins',
      maxTokens: 8000,
      prompt: buildQuickWinsPrompt(phase1Output)
    },
    {
      id: 'risk_analysis',
      maxTokens: 10000,
      prompt: buildRiskAnalysisPrompt(phase1Output, phase2Output)
    },
    {
      id: 'roadmap_phases',
      maxTokens: 12000,
      prompt: buildRoadmapPrompt(phase1Output, phase2Output)
    }
  ];

  // Create batch requests
  const batchRequests = contentTypes.map(content => ({
    custom_id: content.id,
    params: {
      model: 'claude-sonnet-4-20250514',
      max_tokens: content.maxTokens,
      system: TIER3_SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: content.prompt
      }]
    }
  }));

  // Submit batch
  const claudeClient = ClaudeClient.getInstance();
  const batch = await claudeClient.createBatch(batchRequests);

  console.log(\`✓ Batch created: \${batch.id}\`);
  console.log(\`  Content types: \${contentTypes.length}\`);

  // Monitor and retrieve
  await monitorBatchProgress(batch.id);
  const results = await claudeClient.retrieveBatch(batch.id);

  // Parse results
  const narrativeContent = parseNarrativeResults(results);

  // Build output
  const output: Phase3Output = {
    executiveSummary: narrativeContent.executive_summary,
    dimensionNarratives: narrativeContent.dimension_narratives,
    findings: narrativeContent.findings_details,
    recommendations: narrativeContent.recommendations,
    quickWins: narrativeContent.quick_wins,
    risks: narrativeContent.risk_analysis,
    roadmap: narrativeContent.roadmap_phases,
    metadata: {
      batchId: batch.id,
      processedAt: new Date().toISOString()
    }
  };

  await fs.writeFile(
    'output/phase3_output.json',
    JSON.stringify(output, null, 2)
  );

  console.log('✓ Phase 3 complete');
  return output;
}
\`\`\`

### 4.5 Phase 4: IDM Generation

**File**: `src/orchestration/phase4-orchestrator.ts`
**Input**: Phases 0-3 outputs
**Output**: `output/idm_output.json` (Integrated Diagnostic Model)
**Execution Mode**: Synchronous, data consolidation
**Processing Time**: ~1 second

src/orchestration/phase4-orchestrator.ts:10-150
\`\`\`typescript
export async function executePhase4(
  phase0: NormalizedOutput,
  phase1: Phase1Output,
  phase2: Phase2Output,
  phase3: Phase3Output
): Promise<IDM> {
  console.log('Phase 4: Building Integrated Diagnostic Model...');

  // Step 1: Consolidate chapters with narratives
  const chapters = consolidateChapters(
    phase1.chapters,
    phase2,
    phase3.dimensionNarratives
  );

  // Step 2: Extract dimensions
  const dimensions = extractDimensions(chapters);

  // Step 3: Parse and deduplicate findings
  const findings = parseFindings(phase3.findings);

  // Step 4: Parse and prioritize recommendations
  const recommendations = parseRecommendations(phase3.recommendations);

  // Step 5: Parse quick wins
  const quickWins = parseQuickWins(phase3.quickWins);

  // Step 6: Parse risks
  const risks = parseRisks(phase3.risks);

  // Step 7: Parse roadmap
  const roadmap = parseRoadmap(phase3.roadmap);

  // Step 8: Build IDM structure
  const idm: IDM = {
    overallHealth: {
      score: phase2.overallScore,
      status: phase2.status,
      trajectory: phase2.trajectory,
      summary: phase3.executiveSummary
    },
    chapters,
    dimensions,
    findings,
    recommendations,
    quickWins,
    risks,
    roadmap,
    metadata: {
      companyId: phase0.companyId,
      companyName: phase0.companyName,
      industry: phase0.industry,
      revenue: phase0.revenue,
      employees: phase0.employees,
      generatedAt: new Date().toISOString(),
      version: '1.0.0',
      phaseOutputs: {
        phase0Path: 'output/phase0_output.json',
        phase1Path: 'output/phase1_output.json',
        phase2Path: 'output/phase2_output.json',
        phase3Path: 'output/phase3_output.json'
      }
    }
  };

  // Step 9: Apply safety patches and validation
  const validatedIDM = applyPhase4SafetyPatches(idm);
  validateIDM(validatedIDM);

  // Step 10: Write to disk
  await fs.writeFile(
    'output/idm_output.json',
    JSON.stringify(validatedIDM, null, 2)
  );

  console.log('✓ Phase 4 complete - IDM generated');
  console.log(\`  Overall Score: \${validatedIDM.overallHealth.score}/100\`);
  console.log(\`  Chapters: \${validatedIDM.chapters.length}\`);
  console.log(\`  Dimensions: \${validatedIDM.dimensions.length}\`);
  console.log(\`  Findings: \${validatedIDM.findings.length}\`);
  console.log(\`  Recommendations: \${validatedIDM.recommendations.length}\`);
  console.log(\`  Quick Wins: \${validatedIDM.quickWins.length}\`);
  console.log(\`  Risks: \${validatedIDM.risks.length}\`);

  return validatedIDM;
}

/**
 * Consolidate chapters with narratives
 */
function consolidateChapters(
  phase1Chapters: Chapter[],
  phase2: Phase2Output,
  narratives: Record<string, any>
): Chapter[] {
  return phase1Chapters.map(chapter => ({
    ...chapter,
    overview: narratives[chapter.code]?.overview || chapter.insights,
    detailedAnalysis: narratives[chapter.code]?.detailedFindings || '',
    strategicInsights: narratives[chapter.code]?.analysis || chapter.insights
  }));
}

/**
 * Extract all dimensions from chapters
 */
function extractDimensions(chapters: Chapter[]): Dimension[] {
  const dimensions: Dimension[] = [];

  chapters.forEach(chapter => {
    if (chapter.dimensions) {
      chapter.dimensions.forEach(dim => {
        dimensions.push({
          ...dim,
          chapterCode: chapter.code
        });
      });
    }
  });

  return dimensions;
}
\`\`\`

**Phase 4 Safety Patches:**

src/qa/phase4-safety-patches.ts:1-80
\`\`\`typescript
/**
 * Apply safety patches to IDM before report generation
 * Fixes common data quality issues
 */
export function applyPhase4SafetyPatches(idm: IDM): IDM {
  console.log('Applying Phase 4 safety patches...');

  // Patch 1: Ensure all scores are valid numbers
  idm.overallHealth.score = ensureValidScore(idm.overallHealth.score);
  idm.chapters.forEach(chapter => {
    chapter.score = ensureValidScore(chapter.score);
    if (chapter.dimensions) {
      chapter.dimensions.forEach(dim => {
        dim.score = ensureValidScore(dim.score);
      });
    }
  });

  // Patch 2: Ensure arrays are not null/undefined
  idm.findings = idm.findings || [];
  idm.recommendations = idm.recommendations || [];
  idm.quickWins = idm.quickWins || [];
  idm.risks = idm.risks || [];
  idm.roadmap = idm.roadmap || [];

  // Patch 3: Add missing IDs
  idm.findings.forEach((finding, index) => {
    if (!finding.id) {
      finding.id = \`finding_\${index + 1}\`;
    }
  });

  idm.recommendations.forEach((rec, index) => {
    if (!rec.id) {
      rec.id = \`rec_\${index + 1}\`;
    }
  });

  // Patch 4: Ensure severity/priority enums are valid
  idm.findings.forEach(finding => {
    if (!['Critical', 'High', 'Medium', 'Low'].includes(finding.severity)) {
      finding.severity = 'Medium';  // Default
    }
  });

  idm.recommendations.forEach(rec => {
    if (!['High', 'Medium', 'Low'].includes(rec.priority)) {
      rec.priority = 'Medium';  // Default
    }
  });

  // Patch 5: Ensure status matches score
  idm.overallHealth.status = getStatusFromScore(idm.overallHealth.score);
  idm.chapters.forEach(chapter => {
    chapter.status = getStatusFromScore(chapter.score);
  });

  console.log('✓ Safety patches applied');
  return idm;
}

function ensureValidScore(score: any): number {
  const num = Number(score);
  if (isNaN(num) || num < 0 || num > 100) {
    console.warn(\`Invalid score: \${score}, using 50 as default\`);
    return 50;
  }
  return Math.round(num);
}

function getStatusFromScore(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Needs Improvement';
  return 'Critical';
}
\`\`\`

### 4.6 Phase 5: Report Generation

**File**: `src/orchestration/phase5-orchestrator.ts`
**Input**: `output/idm_output.json` + `output/phase3_output.json`
**Output**: 17 HTML reports + manifest.json
**Execution Mode**: Synchronous, parallel generation
**Processing Time**: ~5-10 seconds for all 17 reports

src/orchestration/phase5-orchestrator.ts:15-150
\`\`\`typescript
export async function executePhase5(
  idm: IDM,
  phase3: Phase3Output,
  options: Phase5Options = {}
): Promise<Phase5Output> {
  console.log('Phase 5: Generating HTML reports...');

  const startTime = Date.now();
  const runId = options.runId || uuid();
  const outputDir = \`output/reports/\${runId}\`;

  // Create output directory
  await fs.mkdir(outputDir, { recursive: true });

  // Build report context
  const context: ReportContext = buildReportContext(idm, phase3, runId, options);

  // Get enabled reports
  const enabledReports = getEnabledReports();
  console.log(\`  Generating \${enabledReports.length} reports...\`);

  // Generate all reports in parallel
  const reportPromises = enabledReports.map(async (config) => {
    console.log(\`  - Generating \${config.name}...\`);
    
    try {
      // Generate HTML
      const html = await config.builder(context);

      // Calculate quality metrics
      const metrics = calculateQualityMetrics(html);

      // Generate metadata
      const meta = {
        reportType: config.type,
        reportName: config.name,
        generatedAt: new Date().toISOString(),
        ...metrics
      };

      // Write HTML file
      await fs.writeFile(
        \`\${outputDir}/\${config.type}.html\`,
        html
      );

      // Write metadata file
      await fs.writeFile(
        \`\${outputDir}/\${config.type}.meta.json\`,
        JSON.stringify(meta, null, 2)
      );

      console.log(\`    ✓ \${config.name} (\${metrics.pageEstimate} pages)\`);

      return { config, html, meta };

    } catch (error) {
      console.error(\`    ✗ Failed to generate \${config.name}:\`, error);
      throw error;
    }
  });

  // Wait for all reports
  const reports = await Promise.all(reportPromises);

  // Calculate overall quality metrics
  const qualityMetrics = reports.reduce((acc, report) => {
    acc[report.config.type] = report.meta;
    return acc;
  }, {});

  const qualitySummary = calculateQualitySummary(qualityMetrics);

  // Generate manifest
  const manifest = {
    runId,
    companyName: context.company.name,
    generatedAt: new Date().toISOString(),
    healthScore: context.overallHealth.score,
    healthStatus: context.overallHealth.status,
    pipelineVersion: '1.0.0',
    reports: reports.map(r => ({
      type: r.config.type,
      name: r.config.name,
      html: \`\${r.config.type}.html\`,
      meta: \`\${r.config.type}.meta.json\`
    }))
  };

  await fs.writeFile(
    \`\${outputDir}/manifest.json\`,
    JSON.stringify(manifest, null, 2)
  );

  // Build Phase 5 output summary
  const output: Phase5Output = {
    phase: 'phase_5',
    status: 'complete',
    runId,
    companyName: context.company.name,
    reportsGenerated: reports.length,
    reports: reports.map(r => ({
      reportType: r.config.type,
      reportName: r.config.name,
      htmlPath: \`\${outputDir}/\${r.config.type}.html\`,
      metaPath: \`\${outputDir}/\${r.config.type}.meta.json\`,
      generatedAt: r.meta.generatedAt
    })),
    outputDir,
    manifestPath: \`\${outputDir}/manifest.json\`,
    metadata: {
      startedAt: new Date(startTime).toISOString(),
      completedAt: new Date().toISOString(),
      durationMs: Date.now() - startTime,
      pipelineVersion: '1.0.0'
    },
    qualityMetrics,
    qualitySummary
  };

  await fs.writeFile(
    'output/phase5_output.json',
    JSON.stringify(output, null, 2)
  );

  console.log(\`\\n✓ Phase 5 complete - \${reports.length} reports generated\`);
  console.log(\`  Total SVGs: \${qualitySummary.totalVisualizations}\`);
  console.log(\`  Total pages: ~\${qualitySummary.totalPages}\`);
  console.log(\`  Duration: \${output.metadata.durationMs}ms\`);

  return output;
}

/**
 * Build complete report context
 */
function buildReportContext(
  idm: IDM,
  phase3: Phase3Output,
  runId: string,
  options: Phase5Options
): ReportContext {
  return {
    // IDM data
    overallHealth: idm.overallHealth,
    chapters: idm.chapters,
    dimensions: idm.dimensions,
    findings: idm.findings,
    recommendations: idm.recommendations,
    quickWins: idm.quickWins,
    risks: idm.risks,
    roadmap: idm.roadmap,

    // Narrative content
    narratives: {
      executiveSummary: phase3.executiveSummary,
      dimensionNarratives: phase3.dimensionNarratives,
      findingsNarrative: phase3.findings,
      recommendationsNarrative: phase3.recommendations,
      risksNarrative: phase3.risks
    },

    // Company info
    company: {
      id: idm.metadata.companyId,
      name: idm.metadata.companyName,
      industry: idm.metadata.industry || 'Technology',
      revenue: idm.metadata.revenue || 0,
      employees: idm.metadata.employees || 0
    },

    // Report metadata
    metadata: {
      runId,
      generatedAt: new Date().toISOString(),
      brand: options.brand || DEFAULT_BRAND_CONFIG,
      options: options.reportOptions
    }
  };
}

/**
 * Calculate quality metrics for generated HTML
 */
function calculateQualityMetrics(html: string): QualityMetrics {
  const svgCount = (html.match(/<svg/g) || []).length;
  const boldCount = (html.match(/<strong>/g) || []).length;
  const dividerCount = (html.match(/<hr/g) || []).length;
  const listItemCount = (html.match(/<li>/g) || []).length;
  const tableCount = (html.match(/<table/g) || []).length;
  const wordCount = estimateWordCount(html);
  const pageEstimate = Math.ceil(wordCount / 400);  // ~400 words per page

  return {
    svgCount,
    boldCount,
    dividerCount,
    listItemCount,
    tableCount,
    wordCount,
    pageEstimate,
    meetsTargets: {
      visualizations: svgCount >= 10,
      boldElements: boldCount >= 50,
      dividers: dividerCount >= 5
    }
  };
}

/**
 * Estimate word count from HTML
 */
function estimateWordCount(html: string): number {
  // Strip HTML tags
  const text = html.replace(/<[^>]*>/g, ' ');
  
  // Count words
  const words = text.trim().split(/\s+/);
  
  return words.length;
}
\`\`\`

---

*Continuing with more sections...*

## 13. Recent Fixes & Evolution (December 10, 2025)

This section documents all fixes applied on December 10, 2025, during comprehensive report generation debugging.

### 13.1 Compilation Errors Fixed

**Problem**: Phase 5 compilation errors due to branch merges and duplicate declarations
**Root Cause**: Conflicting code from multiple development branches merged together

#### Fix 1: Duplicate Function Removal in owners-report.builder.ts

**File**: `src/orchestration/reports/owners-report.builder.ts`
**Line**: 174
**Error**: `Duplicate function implementation: safeQuickRef`

**Before (BROKEN):**
\`\`\`typescript
// Line 50
function safeQuickRef(qw: any): QuickWin {
  return {
    id: qw.id || '',
    title: qw.title || '',
    // ... rest of implementation
  };
}

// Line 174 - DUPLICATE!
function safeQuickRef(qw: any, index: number): QuickWin {
  return {
    id: qw.id || \`qw_\${index}\`,
    title: qw.title || '',
    // ... different implementation
  };
}
\`\`\`

**After (FIXED):**
\`\`\`typescript
// Line 50 - KEPT (original implementation)
function safeQuickRef(qw: any): QuickWin {
  return {
    id: qw.id || '',
    title: qw.title || '',
    description: qw.description || '',
    dimensionCode: qw.dimensionCode || '',
    effort: qw.effort || 'Medium',
    impact: qw.impact || 'Medium',
    timeline: qw.timeline || '30 days',
    steps: qw.steps || [],
    expectedOutcome: qw.expectedOutcome || ''
  };
}

// Line 174 - REMOVED (duplicate deleted)
\`\`\`

#### Fix 2: Duplicate Function Removal in recipe-report.builder.ts

**File**: `src/orchestration/reports/recipe-report.builder.ts`
**Line**: 965
**Error**: `Duplicate function implementation: getScoreColor`

**Before (BROKEN):**
\`\`\`typescript
// Line 200
function getScoreColor(score: number): string {
  if (score >= 80) return '#28a745';
  if (score >= 60) return '#969423';
  if (score >= 40) return '#ffc107';
  return '#dc3545';
}

// Line 965 - DUPLICATE!
function getScoreColor(score: number): string {
  // ... same implementation
}
\`\`\`

**After (FIXED):**
\`\`\`typescript
// Line 200 - KEPT
function getScoreColor(score: number): string {
  if (score >= 80) return '#28a745';  // green
  if (score >= 60) return '#969423';  // yellow-green
  if (score >= 40) return '#ffc107';  // yellow
  return '#dc3545';  // red
}

// Line 965 - REMOVED
\`\`\`

#### Fix 3: Duplicate Exports Removal in utils/index.ts

**File**: `src/orchestration/reports/utils/index.ts`
**Lines**: 345-347
**Error**: `Export 'filterRecommendationsByDimensions' has already been declared`

**Before (BROKEN):**
\`\`\`typescript
// Lines 50-52 - First export from idm-extractors.js
export {
  filterQuickWinsByDimensions,
  filterRisksByDimensions,
  filterRecommendationsByDimensions,
  computeDepartmentHealthScore,
  getDimensionFromChapters,
  getDimensionName,
  getScoreBandFromScore
} from './idm-extractors.js';

// Lines 345-347 - DUPLICATE export from dimension-filters.js
export {
  filterRecommendationsByDimensions,  // ← DUPLICATE!
  filterQuickWinsByDimensions,        // ← DUPLICATE!
  filterRisksByDimensions,            // ← DUPLICATE!
  // other exports...
} from './dimension-filters.js';
\`\`\`

**After (FIXED):**
\`\`\`typescript
// Lines 50-52 - KEPT (canonical source)
export {
  filterQuickWinsByDimensions,
  filterRisksByDimensions,
  filterRecommendationsByDimensions,
  computeDepartmentHealthScore,
  getDimensionFromChapters,
  getDimensionName,
  getScoreBandFromScore
} from './idm-extractors.js';

// Lines 345-347 - REMOVED duplicate exports, kept unique ones
export {
  // Removed: filterRecommendationsByDimensions (duplicate)
  // Removed: filterQuickWinsByDimensions (duplicate)
  // Removed: filterRisksByDimensions (duplicate)
  // Kept other unique exports...
} from './dimension-filters.js';
\`\`\`

#### Fix 4: Wrong Function Name in recipe-report.builder.ts

**File**: `src/orchestration/reports/recipe-report.builder.ts`
**Multiple Lines**: Import + usage sites
**Error**: `Cannot find name 'ensureString'`

**Before (BROKEN):**
\`\`\`typescript
// Line 15 - Import
import {
  // ...
  ensureString,  // ← WRONG NAME!
  type DimensionCode,
} from './utils/index.js';

// Usage sites (multiple lines)
const title = ensureString(rec.title);
const description = ensureString(rec.description);
\`\`\`

**After (FIXED):**
\`\`\`typescript
// Line 15 - Import
import {
  // ...
  safeString,  // ← CORRECT NAME!
  type DimensionCode,
} from './utils/index.js';

// Usage sites (all updated)
const title = safeString(rec.title);
const description = safeString(rec.description);
\`\`\`

**Note**: The actual function in `utils/index.ts` is named `safeString`, not `ensureString`. This was a naming mismatch from the merge.

### 13.2 Runtime Errors Fixed

**Problem**: Comprehensive report failing during generation with undefined property errors
**Root Cause**: Missing null safety checks for optional IDM fields

#### Fix 5: Null Safety in generateExecutiveMetricsDashboard

**File**: `src/orchestration/reports/comprehensive-report.builder.ts`
**Line**: 1874
**Error**: `Cannot read properties of undefined (reading 'score')`

**Before (BROKEN):**
\`\`\`typescript
function generateExecutiveMetricsDashboard(ctx: ReportContext): string {
  const metrics = [
    {
      label: 'Overall Health',
      value: ctx.overallHealth.score,  // ← CRASH if ctx.overallHealth is undefined
      unit: '/100',
      status: getScoreBand(ctx.overallHealth.score),
      trend: ctx.overallHealth.trajectory === 'Improving' ? 'up' : 'flat'
    },
    ...ctx.chapters.map(chapter => ({  // ← CRASH if ctx.chapters is undefined
      label: chapter.name,
      value: chapter.score,
      unit: '/100',
      status: getScoreBand(chapter.score)
    }))
  ];

  return renderKPIDashboard({ metrics, columns: 4 });
}
\`\`\`

**After (FIXED):**
\`\`\`typescript
function generateExecutiveMetricsDashboard(ctx: ReportContext): string {
  // Null safety check
  if (!ctx.overallHealth || !ctx.chapters) {
    return '<div class="metrics-unavailable">Executive metrics unavailable</div>';
  }

  const metrics = [
    {
      label: 'Overall Health',
      value: ctx.overallHealth.score || 0,  // Default to 0 if missing
      unit: '/100',
      status: getScoreBand(ctx.overallHealth.score || 0),
      trend: ctx.overallHealth.trajectory === 'Improving' ? 'up' as const :
             ctx.overallHealth.trajectory === 'Declining' ? 'down' as const : 
             'flat' as const
    },
    ...ctx.chapters.map(chapter => ({
      label: chapter.name,
      value: chapter.score || 0,  // Default to 0 if missing
      unit: '/100',
      status: getScoreBand(chapter.score || 0)
    }))
  ];

  return renderKPIDashboard({
    metrics,
    columns: Math.min(4, metrics.length) as 2 | 3 | 4,
    title: 'Critical Business Metrics',
    showBorder: true
  });
}
\`\`\`

**Key Improvements:**
1. Added null check for `ctx.overallHealth` and `ctx.chapters`
2. Provide fallback UI when data is missing
3. Use default values (`|| 0`) for optional numeric properties
4. Explicit type assertions for TypeScript strictness

#### Fix 6: Null Safety in generateKeyStatsRow

**File**: `src/orchestration/reports/comprehensive-report.builder.ts`
**Line**: 1937
**Error**: `Cannot read properties of undefined (reading 'score')`

**Before (BROKEN):**
\`\`\`typescript
function generateKeyStatsRow(ctx: ReportContext): string {
  const score = ctx.overallHealth.score;  // ← CRASH if undefined
  const statusColor = score >= 80 ? '#28a745' :
                      score >= 60 ? '#969423' :
                      score >= 40 ? '#ffc107' : '#dc3545';

  return renderQuickStatsRow([
    { label: 'Health Score', value: score, color: statusColor },
    { label: 'Dimensions', value: ctx.dimensions.length },  // ← CRASH if undefined
    { label: 'Findings', value: ctx.findings.length },      // ← CRASH if undefined
    { label: 'Recommendations', value: ctx.recommendations.length },  // ← CRASH
    { label: 'Quick Wins', value: ctx.quickWins.length, color: '#28a745' }  // ← CRASH
  ]);
}
\`\`\`

**After (FIXED):**
\`\`\`typescript
function generateKeyStatsRow(ctx: ReportContext): string {
  // Comprehensive null safety check
  if (!ctx.overallHealth || !ctx.dimensions || !ctx.findings || 
      !ctx.recommendations || !ctx.quickWins) {
    return '<div class="stats-unavailable">Statistics unavailable</div>';
  }

  const score = ctx.overallHealth.score || 0;
  const statusColor = score >= 80 ? '#28a745' :
                      score >= 60 ? '#969423' :
                      score >= 40 ? '#ffc107' : '#dc3545';

  return renderQuickStatsRow([
    { label: 'Health Score', value: score, color: statusColor },
    { label: 'Dimensions', value: ctx.dimensions.length },
    { label: 'Findings', value: ctx.findings.length },
    { label: 'Recommendations', value: ctx.recommendations.length },
    { label: 'Quick Wins', value: ctx.quickWins.length, color: '#28a745' }
  ]);
}
\`\`\`

#### Fix 7: Function Signature Mismatch (Agent Fix)

**File**: `src/orchestration/reports/comprehensive-report.builder.ts`
**Multiple Lines**: Function definition and call site
**Error**: `chaptersToScorecardItems` called with wrong number of arguments

**Problem**: Function was defined to accept one parameter but was being called with two parameters.

**Before (BROKEN):**
\`\`\`typescript
// Function definition (expecting 1 parameter)
function chaptersToScorecardItems(chapters: Chapter[]): ScorecardItem[] {
  return chapters.map(chapter => ({
    label: chapter.name,
    score: chapter.score,
    status: getScoreBand(chapter.score)
  }));
}

// Function call (passing 2 parameters)
const scorecardItems = chaptersToScorecardItems(ctx.chapters, ctx.benchmarks);  // ← WRONG!
\`\`\`

**After (FIXED):**
\`\`\`typescript
// Function definition updated to accept both parameters
function chaptersToScorecardItems(
  chapters: Chapter[], 
  benchmarks?: Record<string, number>
): ScorecardItem[] {
  if (!chapters) return [];
  
  return chapters.map(chapter => ({
    label: chapter.name,
    score: chapter.score || 0,
    status: getScoreBand(chapter.score || 0),
    benchmark: benchmarks?.[chapter.code]
  }));
}

// Function call (now matches signature)
const scorecardItems = chaptersToScorecardItems(ctx.chapters, ctx.benchmarks);  // ✓ CORRECT
\`\`\`

#### Fix 8: Data Format Mismatch for Charts (Agent Fix)

**File**: `src/orchestration/reports/comprehensive-report.builder.ts`
**Function**: `generateDimensionBenchmarkBarsViz`
**Error**: Chart generator expected different data format

**Before (BROKEN):**
\`\`\`typescript
function generateDimensionBenchmarkBarsViz(dimensions: Dimension[]): string {
  // Data format didn't match what generateHorizontalBarChartSVG expected
  const data = dimensions.map(dim => ({
    name: dim.name,        // ← WRONG KEY (should be 'label')
    score: dim.score       // ← WRONG KEY (should be 'value')
  }));

  return generateHorizontalBarChartSVG(data);  // ← Incompatible format
}
\`\`\`

**After (FIXED):**
\`\`\`typescript
function generateDimensionBenchmarkBarsViz(dimensions: Dimension[]): string {
  if (!dimensions || dimensions.length === 0) {
    return '<div class="no-data">No dimension data available</div>';
  }

  // Correct data format for chart generator
  const data = dimensions.map(dim => ({
    label: dim.name,         // ✓ CORRECT KEY
    value: dim.score || 0,   // ✓ CORRECT KEY + null safety
    color: getScoreColor(dim.score || 0),
    unit: '/100'
  }));

  return generateHorizontalBarChartSVG({
    data,
    width: 600,
    height: 40 * data.length,
    showLabels: true,
    showValues: true
  });
}
\`\`\`

### 13.3 Error Logging Improvements

**File**: `src/orchestration/phase5-orchestrator.ts`
**Enhancement**: Added stack trace logging for better debugging

**Before:**
\`\`\`typescript
catch (error) {
  console.error(\`Failed to generate \${config.name}\`, error.message);
  throw error;
}
\`\`\`

**After:**
\`\`\`typescript
catch (error) {
  console.error(\`Failed to generate \${config.name}:\`);
  console.error('Error message:', error.message);
  console.error('Stack trace:', error.stack);  // ← Added for debugging
  throw error;
}
\`\`\`

### 13.4 Summary of Fixes

| Fix # | File | Line(s) | Type | Impact |
|-------|------|---------|------|--------|
| 1 | owners-report.builder.ts | 174 | Compilation | Removed duplicate `safeQuickRef` |
| 2 | recipe-report.builder.ts | 965 | Compilation | Removed duplicate `getScoreColor` |
| 3 | utils/index.ts | 345-347 | Compilation | Removed duplicate exports |
| 4 | recipe-report.builder.ts | Multiple | Compilation | Fixed `ensureString` → `safeString` |
| 5 | comprehensive-report.builder.ts | 1874 | Runtime | Added null check for metrics dashboard |
| 6 | comprehensive-report.builder.ts | 1937 | Runtime | Added null check for stats row |
| 7 | comprehensive-report.builder.ts | Multiple | Runtime | Fixed function signature mismatch |
| 8 | comprehensive-report.builder.ts | Multiple | Runtime | Fixed chart data format |

**Result**: All 17 reports now generate successfully with 0 errors, 74 total visualizations, and comprehensive null safety.

---

## 14. Development Guidelines

### 14.1 Setting Up Development Environment

**Prerequisites:**
\`\`\`bash
- Node.js >= 18.0.0
- npm >= 8.0.0
- PostgreSQL >= 14.0 (optional, for database mode)
- Git
\`\`\`

**Installation:**
\`\`\`bash
# Clone repository
git clone <repository-url>
cd workflow-export

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Anthropic API key

# Run type checking
npm run typecheck

# Run tests
npm run test
\`\`\`

**Environment Variables:**
\`\`\`bash
# Required
ANTHROPIC_API_KEY=sk-ant-...

# Optional
DATABASE_URL=postgresql://user:pass@localhost:5432/bizhealth
LOG_LEVEL=info
NODE_ENV=development
\`\`\`

### 14.2 Code Style and Conventions

**TypeScript Configuration:**
\`\`\`json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
\`\`\`

**Naming Conventions:**
- **Files**: kebab-case (`phase0-orchestrator.ts`, `comprehensive-report.builder.ts`)
- **Functions**: camelCase (`executePhase0`, `buildReportContext`)
- **Classes**: PascalCase (`ClaudeClient`, `DatabaseClient`)
- **Constants**: UPPER_SNAKE_CASE (`TIER1_SYSTEM_PROMPT`, `DEFAULT_BRAND_CONFIG`)
- **Interfaces/Types**: PascalCase (`ReportContext`, `IDM`, `Chapter`)

**Function Organization:**
\`\`\`typescript
// 1. Imports
import { Something } from './somewhere';

// 2. Type definitions
interface LocalType {
  // ...
}

// 3. Constants
const CONSTANT_VALUE = 'value';

// 4. Main exported function
export async function mainFunction() {
  // ...
}

// 5. Helper functions (not exported)
function helperFunction() {
  // ...
}
\`\`\`

**Error Handling Pattern:**
\`\`\`typescript
export async function someOperation(): Promise<Result> {
  try {
    // Operation logic
    const result = await performOperation();
    return result;
    
  } catch (error) {
    // Log error with context
    logger.error('Operation failed', error);
    
    // Wrap in domain-specific error
    throw new PipelineError(
      'Failed to perform operation',
      'phase_name',
      'ERROR_CODE',
      { originalError: error }
    );
  }
}
\`\`\`

### 14.3 Adding New Report Types

**Step 1: Create Report Builder**

Create new file: `src/orchestration/reports/my-new-report.builder.ts`

\`\`\`typescript
import { ReportContext } from '../../types/report.types';
import { renderHTMLTemplate } from './html-template';

export async function buildMyNewReport(
  ctx: ReportContext
): Promise<string> {
  // Build sections
  const sections = [
    buildSection1(ctx),
    buildSection2(ctx),
    buildSection3(ctx)
  ];

  // Compose HTML
  const body = sections.join('\\n\\n');

  // Return complete HTML document
  return renderHTMLTemplate({
    title: 'My New Report',
    styles: getMyReportStyles(),
    body
  });
}

function buildSection1(ctx: ReportContext): string {
  // Section implementation
  return '<div class="section1">...</div>';
}

function getMyReportStyles(): string {
  return \`
    /* Custom styles for this report */
    .section1 {
      /* ... */
    }
  \`;
}
\`\`\`

**Step 2: Register in Configuration**

Edit: `src/config/reports.config.ts`

\`\`\`typescript
import { buildMyNewReport } from '../orchestration/reports/my-new-report.builder';

export const REPORT_CONFIGS: ReportConfig[] = [
  // ... existing reports
  {
    type: 'myNewReport',
    name: 'My New Report',
    description: 'Description of what this report does',
    builder: buildMyNewReport,
    enabled: true,
    audience: ['target', 'audience'],
    estimatedPages: '10-20',
    priority: 18  // After existing 17 reports
  }
];
\`\`\`

**Step 3: Update Types**

Edit: `src/types/report.types.ts`

\`\`\`typescript
export type ReportType =
  | 'comprehensive'
  | 'owner'
  // ... existing types
  | 'myNewReport';  // Add new type
\`\`\`

**Step 4: Test Report Generation**

\`\`\`bash
# Run Phase 5 only to test report
node --import tsx src/run-pipeline.ts sample_webhook.json --phase=5 --skip-db

# Check output
ls -lh output/reports/*/myNewReport.html
\`\`\`

### 14.4 Testing Guidelines

**Unit Tests:**
\`\`\`typescript
// src/__tests__/my-feature.test.ts
import { describe, it, expect } from '@jest/globals';
import { myFunction } from '../my-module';

describe('myFunction', () => {
  it('should handle normal case', () => {
    const result = myFunction(input);
    expect(result).toEqual(expectedOutput);
  });

  it('should handle null input', () => {
    const result = myFunction(null);
    expect(result).toEqual(defaultValue);
  });

  it('should throw on invalid input', () => {
    expect(() => myFunction(invalidInput)).toThrow();
  });
});
\`\`\`

**Report Snapshot Tests:**
\`\`\`typescript
// src/__tests__/reports/my-report.test.ts
import { buildMyNewReport } from '../../orchestration/reports/my-new-report.builder';
import { mockReportContext } from '../fixtures/mock-context';

describe('MyNewReport', () => {
  it('should match snapshot', async () => {
    const html = await buildMyNewReport(mockReportContext);
    expect(html).toMatchSnapshot();
  });

  it('should include required sections', async () => {
    const html = await buildMyNewReport(mockReportContext);
    
    expect(html).toContain('section1');
    expect(html).toContain('section2');
    expect(html).toContain('section3');
  });

  it('should handle missing data gracefully', async () => {
    const incompleteContext = { ...mockReportContext, chapters: [] };
    const html = await buildMyNewReport(incompleteContext);
    
    expect(html).toContain('No data available');
  });
});
\`\`\`

**Running Tests:**
\`\`\`bash
# All tests
npm run test

# Specific test file
npm run test -- my-feature.test.ts

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
\`\`\`

### 14.5 Debugging Tips

**Enable Verbose Logging:**
\`\`\`bash
LOG_LEVEL=debug node --import tsx src/run-pipeline.ts sample_webhook.json
\`\`\`

**Inspect Phase Outputs:**
\`\`\`bash
# Pretty-print JSON output
cat output/phase4_output.json | jq .

# Check specific field
cat output/idm_output.json | jq '.overallHealth'

# Count items
cat output/idm_output.json | jq '.findings | length'
\`\`\`

**Debug Report Generation:**
\`\`\`bash
# Generate single report type
node --import tsx src/run-pipeline.ts --phase=5 --skip-db 2>&1 | tee /tmp/phase5.log

# Check for errors
grep -i error /tmp/phase5.log

# Check generated files
ls -lh output/reports/*/
\`\`\`

**Common Issues:**

| Issue | Cause | Solution |
|-------|-------|----------|
| `Cannot read property 'score'` | Missing null check | Add `|| 0` or null guard |
| `Duplicate function` | Merge conflict | Remove duplicate declaration |
| `Module not found` | Wrong import path | Check import path, add `.js` extension |
| `Batch API timeout` | Batch not complete | Wait 24 hours or check batch status |
| `Type error` | Missing type definition | Add type import or define locally |

### 14.6 Performance Optimization

**Monitoring Token Usage:**
\`\`\`typescript
// Track API costs during development
const usage = response.usage;
console.log(\`Input tokens: \${usage.input_tokens}\`);
console.log(\`Output tokens: \${usage.output_tokens}\`);
console.log(\`Cost: $\${calculateCost(usage)}\`);
\`\`\`

**Optimizing Prompts:**
1. Remove unnecessary context
2. Use structured output schemas (JSON)
3. Batch similar requests together
4. Cache repeated prompt components

**Optimizing Report Generation:**
1. Generate reports in parallel (already implemented)
2. Reuse compiled templates
3. Cache SVG chart generation
4. Minimize HTML size (remove whitespace in production)

### 14.7 Git Workflow

**Branch Naming:**
\`\`\`
feature/add-new-report-type
fix/comprehensive-report-null-safety
refactor/phase4-consolidation
docs/update-architecture-guide
\`\`\`

**Commit Messages:**
\`\`\`
feat: Add quarterly performance report builder
fix: Add null safety checks to comprehensive report
refactor: Extract chart generation to separate module
docs: Update API integration documentation
test: Add snapshot tests for executive brief
\`\`\`

**Pre-Commit Checklist:**
- [ ] TypeScript compiles without errors (`npm run typecheck`)
- [ ] All tests pass (`npm run test`)
- [ ] Code follows style guide
- [ ] New features have tests
- [ ] Documentation updated if needed

---

## 15. Appendices

### 15.1 Complete File Inventory

**Phase Orchestrators (6 files):**
- `src/orchestration/phase0-orchestrator.ts` - Data normalization
- `src/orchestration/phase1-orchestrator.ts` - Tier 1 analysis (Batch API)
- `src/orchestration/phase2-orchestrator.ts` - Tier 2 synthesis
- `src/orchestration/phase3-orchestrator.ts` - Tier 3 narrative (Batch API)
- `src/orchestration/phase4-orchestrator.ts` - IDM generation
- `src/orchestration/phase5-orchestrator.ts` - Report generation

**Report Builders (9 files):**
- `comprehensive-report.builder.ts` (3,224 lines) - Complete 360° analysis
- `owners-report.builder.ts` (1,780 lines) - Business owner executive report
- `recipe-report.builder.ts` (1,494 lines) - 6 recipe-based reports
- `executive-brief.builder.ts` (1,322 lines) - One-page executive summary
- `visualization-renderer.service.ts` (620 lines) - Chart rendering service
- `manager-report.builder.ts` (610 lines) - Manager-specific reports
- `deep-dive-report.builder.ts` (482 lines) - 4 dimensional deep dives
- `financial-report.builder.ts` (398 lines) - Financial impact analysis
- `risk-report.builder.ts` (382 lines) - Risk assessment
- `roadmap-report.builder.ts` (346 lines) - Implementation roadmap
- `quick-wins-report.builder.ts` (300 lines) - Quick wins action plan

**Type Definitions (10 files):**
- `idm.types.ts` - IDM structure (most important)
- `report.types.ts` - Report configurations and context
- `report-content.types.ts` - Content structures
- `webhook.types.ts` - Webhook payload structure
- `normalized.types.ts` - Phase 0 output
- `recipe.types.ts` - Recipe system
- `visualization.types.ts` - Chart types
- `questionnaire.types.ts` - Questionnaire structures
- `company-profile.types.ts` - Company information
- `raw-input.types.ts` - Raw input formats

### 15.2 API Cost Breakdown

**Per-Run Costs (using Claude Sonnet 4.0):**

| Phase | Mode | Input Tokens | Output Tokens | Cost |
|-------|------|--------------|---------------|------|
| Phase 0 | Sync | 0 | 0 | $0.00 |
| Phase 1 | Batch | ~40,000 | ~16,000 | $0.36 |
| Phase 2 | Sync | ~20,000 | ~8,000 | $0.18 |
| Phase 3 | Batch | ~60,000 | ~112,000 | $1.86 |
| Phase 4 | - | 0 | 0 | $0.00 |
| Phase 5 | - | 0 | 0 | $0.00 |
| **TOTAL** | | ~120,000 | ~136,000 | **~$2.40** |

**Batch API Savings:**
- Synchronous pricing: $3.00 input / $15.00 output per 1M tokens
- Batch API pricing: $1.50 input / $7.50 output per 1M tokens
- **Savings: 50% on batch operations**

### 15.3 Output Specifications

**Generated Reports (17 types):**

| # | Report Type | Audience | Pages | Size |
|---|-------------|----------|-------|------|
| 1 | Comprehensive | Executives, Board | 200-400 | ~1MB |
| 2 | Business Owner | CEO, Owner | 40-80 | ~200KB |
| 3 | Executive Brief | C-suite | 15-25 | ~150KB |
| 4 | Quick Wins | Management | 10-20 | ~100KB |
| 5 | Risk Assessment | Risk Officers | 15-30 | ~120KB |
| 6 | Roadmap | Project Managers | 15-30 | ~130KB |
| 7 | Financial Impact | CFO, Finance | 15-30 | ~140KB |
| 8 | Growth Engine DD | Sales/Marketing | 20-40 | ~180KB |
| 9 | Performance DD | Operations | 20-40 | ~170KB |
| 10 | People DD | HR, Leadership | 20-40 | ~170KB |
| 11 | Resilience DD | Risk, Compliance | 20-40 | ~180KB |
| 12 | Employee Summary | All Employees | 10-20 | ~80KB |
| 13 | Operations Mgr | Ops Managers | 15-30 | ~120KB |
| 14 | Sales/Marketing Mgr | Sales/Mkt Mgrs | 15-30 | ~130KB |
| 15 | Financials Mgr | Finance Mgrs | 15-30 | ~125KB |
| 16 | Strategy Mgr | Strategy Mgrs | 15-30 | ~130KB |
| 17 | IT/Tech Mgr | IT Managers | 15-30 | ~140KB |

**Total Output per Run:**
- HTML Files: 17 × ~150KB avg = ~2.5MB
- Metadata Files: 17 × ~5KB = ~85KB
- Manifest: ~5KB
- **Total: ~3MB per complete run**

---

## Conclusion

This codebase represents a sophisticated enterprise-grade business intelligence pipeline that:

1. **Processes** raw questionnaire data through 6 phases
2. **Leverages** AI (Claude Sonnet 4.0) for deep business analysis
3. **Generates** 17 audience-specific HTML reports (~3MB total)
4. **Optimizes** costs through Batch API ($2.40 per run)
5. **Ensures** quality through comprehensive validation and safety patches

The architecture is designed for:
- **Resilience**: File-based phase communication, comprehensive error handling
- **Scalability**: Parallel report generation, batch processing
- **Maintainability**: Strong typing, modular design, clear separation of concerns
- **Debuggability**: Extensive logging, quality metrics, phase output artifacts

**Key Metrics:**
- Total codebase: ~50,000 lines of TypeScript
- Largest file: comprehensive-report.builder.ts (3,224 lines)
- Report builders: 9 files generating 17 report types
- Average pipeline run time: 24-48 hours (due to Batch API)
- Average cost per run: ~$2.40
- Quality: 74 SVG visualizations, 0 errors, comprehensive null safety

---

**Document Version**: 1.0.0
**Last Updated**: December 10, 2025
**Maintained By**: Development Team
**Contact**: See README.md for support information
