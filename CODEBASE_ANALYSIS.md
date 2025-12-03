# BizHealth Report Pipeline - Complete Codebase Analysis

**Project**: BizHealth.ai AI-Powered Business Assessment & Report Generation System
**Version**: 1.0.0
**Status**: Operational (6 Phases Complete)
**Codebase Size**: 90 TypeScript files, 43,884 lines of code
**Last Updated**: December 2, 2025

---

## Executive Summary

BizHealth.ai Pipeline is a **comprehensive end-to-end AI-powered business assessment system** that transforms questionnaire responses into strategic insights and professional reports. The system executes a 6-phase pipeline to analyze 93 business questions across 12 dimensions, producing 11 distinct HTML reports in 10-15 minutes.

### Key Capabilities
- **20 AI Analyses**: 10 foundational (Tier 1) + 5 cross-dimensional (Tier 2) + 5 synthesis analyses
- **4 Strategic Chapters**: Growth Engine, Performance & Health, People & Leadership, Resilience & Safeguards
- **12 Business Dimensions**: Strategy, Sales, Marketing, Customer Experience, Operations, Financials, HR, Leadership, Technology, IT/Data, Risk Management, Compliance
- **11 Report Types**: Comprehensive, Owners, Quick Wins, Risk, Roadmap, Financial, and 4 chapter-specific deep dives
- **Industry Benchmarking**: Comparative analysis against industry standards
- **Extended Thinking**: Uses Claude Opus 4.5 with 32K thinking tokens for deep analysis
- **Cost Optimized**: 50% cost reduction via Anthropic Batch API

---

## 1. Project Structure & Organization

### Root Directory Layout
```
/Users/austinwarren/Downloads/bizHealth-Dennis-11.26.25-claude-consolidated-merge-01Wjazh6HwVZXSmGKBYer3WT/workflow-export/
├── src/                               # TypeScript source code (43,884 LOC)
├── dist/                              # Compiled JavaScript output
├── output/                            # Pipeline execution results
├── config/                            # Configuration files
├── data/                              # Benchmark and reference data
├── tests/                             # Test suites
├── scripts/                           # Utility scripts
├── samples/                           # Sample data and webhooks
├── package.json                       # Project dependencies
├── tsconfig.json                      # TypeScript configuration
├── .env                               # Environment variables
├── README.md                          # Main documentation
└── jest.config.js                     # Test configuration
```

### Source Code Directory Structure (src/)
```
src/
├── api/                               # External API integrations
│   ├── anthropic-client.ts           # Anthropic Batch API client
│   └── report-endpoints.ts           # HTTP API endpoints
├── orchestration/                     # Pipeline phase orchestrators
│   ├── phase0-orchestrator.ts        # Data normalization
│   ├── phase1-orchestrator.ts        # Tier 1 & 2 AI analyses
│   ├── phase2-orchestrator.ts        # Cross-dimensional analysis
│   ├── phase3-orchestrator.ts        # Executive synthesis
│   ├── phase4-orchestrator.ts        # IDM compilation
│   ├── phase5-orchestrator.ts        # Report generation
│   ├── idm-consolidator.ts           # IDM consolidation logic
│   └── reports/                      # Report generation system
│       ├── comprehensive-report.builder.ts
│       ├── owners-report.builder.ts
│       ├── quick-wins-report.builder.ts
│       ├── risk-report.builder.ts
│       ├── roadmap-report.builder.ts
│       ├── financial-report.builder.ts
│       ├── deep-dive-report.builder.ts
│       ├── executive-brief.builder.ts
│       ├── html-template.ts          # HTML output template
│       ├── components/               # Report components
│       │   ├── benchmark-callout.component.ts
│       │   ├── comprehensive-reference.component.ts
│       │   ├── evidence-citation.component.ts
│       │   ├── key-takeaways.component.ts
│       │   └── index.ts
│       ├── config/                   # Report configuration
│       │   ├── section-mapping.ts
│       │   ├── owner-report-constraints.ts
│       │   └── index.ts
│       ├── constants/                # Report constants
│       │   └── dimension-icons.ts
│       ├── utils/                    # Report utilities
│       │   ├── markdown-sanitizer.ts
│       │   ├── reference-logger.ts
│       │   ├── voice-transformer.ts
│       │   └── index.ts
│       └── validation/               # Report validation
│           ├── section-mapping-validator.ts
│           ├── validate-reports.ts
│           └── index.ts
├── data-transformation/              # Data normalization & transformation
│   ├── benchmark-service.ts          # Industry benchmark retrieval
│   ├── company-profile-transformer.ts # Company profile transformation
│   ├── normalized-company-profile-transformer.ts
│   ├── questionnaire-transformer.ts  # Questionnaire response transformation
│   └── normalized-questionnaire-transformer.ts
├── database/                         # Database operations
│   ├── db-client.ts                  # PostgreSQL connection & pooling
│   ├── index.ts                      # Database module exports
│   ├── queries.ts                    # Query helpers
│   └── types.ts                      # Database type definitions
├── prompts/                          # AI analysis prompts
│   ├── tier1/                        # Tier 1 foundational analyses
│   │   ├── revenue-engine.prompts.ts
│   │   ├── operational-excellence.prompts.ts
│   │   ├── financial-strategic.prompts.ts
│   │   ├── people-leadership.prompts.ts
│   │   ├── compliance-sustainability.prompts.ts
│   │   └── index.ts
│   └── tier2/                        # Tier 2 cross-dimensional analyses
│       ├── growth-readiness.prompts.ts
│       ├── market-position.prompts.ts
│       ├── resource-optimization.prompts.ts
│       ├── risk-resilience.prompts.ts
│       ├── scalability-readiness.prompts.ts
│       └── index.ts
├── reports/                          # Report generation API
│   ├── report-generator.ts           # Primary report generator
│   ├── report-prompts.ts             # Report-specific prompts
│   └── index.ts
├── services/                         # Business logic services
│   ├── assessment-index.ts           # Assessment tracking & indexing
│   ├── benchmark-lookup-service.ts   # Benchmark data service
│   ├── confidence-scoring-framework.ts
│   ├── lifecycle-modifier-engine.ts
│   ├── narrative-extraction.service.ts
│   └── raw-assessment-storage.ts
├── types/                            # TypeScript type definitions
│   ├── company-profile.types.ts      # Company profile structure
│   ├── idm.types.ts                  # IDM data model (canonical)
│   ├── normalized.types.ts           # Normalized data structures
│   ├── questionnaire.types.ts        # Questionnaire responses
│   ├── raw-input.types.ts            # Raw webhook input
│   ├── recipe.types.ts               # Recipe/workflow types
│   ├── report.types.ts               # Report generation types
│   └── webhook.types.ts              # Webhook payload structure
├── utils/                            # Utility functions
│   ├── benchmark-calculator.ts       # Benchmark score calculations
│   ├── errors.ts                     # Error handling
│   ├── logger.ts                     # Pino logging setup
│   ├── phase-consolidator.ts         # Phase output consolidation
│   └── security.ts                   # Security utilities
├── validation/                       # Input validation
│   ├── normalized.schemas.ts         # Zod schemas for normalized data
│   ├── raw-input.schemas.ts          # Zod schemas for raw input
│   └── schemas.ts                    # Common schemas
├── scripts/                          # Utility scripts
│   └── render-pdf.ts                 # PDF rendering script
├── index.ts                          # Main entry point
├── run-pipeline.ts                   # Full pipeline runner
└── phase0-index.ts                   # Phase 0 entry point
```

### Data Directories
```
data/
├── benchmarks/                       # Industry benchmark datasets
├── reference/                        # Reference data
└── templates/                        # Template data

output/
├── phase0_output.json               # Raw capture & normalization results
├── phase1_output.json               # Tier 1 & 2 analysis results
├── phase2_output.json               # Cross-dimensional analysis results
├── phase3_output.json               # Executive synthesis results
├── phase4_output.json               # Report generation metadata
├── phase5_output.json               # Report manifest
├── idm_output.json                  # Canonical IDM
├── pipeline_summary.json            # Overall pipeline execution summary
└── reports/                         # Generated HTML reports
    └── {run_id}/                    # Per-assessment run directory
        ├── comprehensive.html       # Comprehensive assessment
        ├── owners-report.html       # Owner executive summary
        ├── quick-wins.html          # Quick wins action plan
        ├── risk-report.html         # Risk assessment
        ├── roadmap.html             # Implementation roadmap
        ├── financial-report.html    # Financial impact analysis
        ├── deep-dive-ge.html        # Growth Engine deep dive
        ├── deep-dive-ph.html        # Performance & Health deep dive
        ├── deep-dive-pl.html        # People & Leadership deep dive
        └── deep-dive-rs.html        # Resilience & Safeguards deep dive
```

---

## 2. Core Architecture

### System Overview
```
┌─────────────────────────────────────────────────────────────┐
│         BIZHEALTH AI-POWERED ASSESSMENT PIPELINE              │
│                    6 Phases • 20 Analyses                     │
└─────────────────────────────────────────────────────────────┘

INPUT: Webhook JSON (93 questionnaire questions)
   ↓
   ├─→ PHASE 0: Data Capture & Normalization (~26ms)
   │   • Validate questionnaire responses
   │   • Create company profile snapshot
   │   • Map to 12 dimensions
   │   • Retrieve benchmarks
   │   📄 Output: phase0_output.json
   │
   ├─→ PHASE 1: Tier 1 & 2 AI Analyses (4-5 min)
   │   • Batch 1 (Tier 1): 5 foundational analyses
   │   • Batch 2 (Tier 2): 5 interconnection analyses
   │   📄 Output: phase1_output.json
   │
   ├─→ PHASE 2: Cross-Dimensional Synthesis (2-3 min)
   │   • 5 cross-dimensional analyses
   │   • Strategic recommendations compilation
   │   • Risk consolidation
   │   📄 Output: phase2_output.json
   │
   ├─→ PHASE 3: Executive Synthesis (2-3 min)
   │   • Executive summary generation
   │   • Health scorecard computation
   │   • Action matrix prioritization
   │   📄 Output: phase3_output.json
   │
   ├─→ PHASE 4: IDM Consolidation (<1 sec)
   │   • Compile Insights Data Model
   │   • 4 chapters • 12 dimensions
   │   • 30+ findings • 10+ recommendations
   │   📄 Output: idm_output.json (canonical)
   │
   └─→ PHASE 5: Report Generation (~63ms)
       • 11 HTML reports
       • Professional styling
       • Report manifest
       📄 Output: reports/ directory

OUTPUT: 11 Professional HTML Reports + Structured Data
```

### Pipeline Phases Detail

#### Phase 0: Data Capture & Normalization
**Orchestrator**: `src/orchestration/phase0-orchestrator.ts`
**Duration**: ~26ms (no API calls)
**Responsibilities**:
- Parse and validate incoming webhook payload
- Create immutable raw data capture
- Transform company profile to normalized structure
- Transform questionnaire responses with dimension mapping
- Retrieve industry benchmarks
- Create assessment index entry
- Zero external API calls

**Inputs**:
- WebhookPayload (93 questions across 12 categories)
- BusinessOverview (company metadata)

**Outputs**:
- Assessment Run ID
- Company Profile ID
- Normalized Company Profile
- Normalized Questionnaire Responses
- Benchmark Dataset
- Assessment Index

#### Phase 1: Cross-Functional AI Analyses (Tier 1 + Tier 2)
**Orchestrator**: `src/orchestration/phase1-orchestrator.ts`
**Duration**: 4-5 minutes
**API**: Anthropic Batch API (2 sequential batches)
**Model**: claude-opus-4-5-20251101 (previously Opus 4)
**Token Budget**: Extended thinking with 32K thinking tokens
**Analyses**: 10 total (5 Tier 1 + 5 Tier 2)

**Tier 1 Foundational Analyses (Batch 1)**:
1. **Revenue Engine Analysis**
   - Components: Strategy, Sales, Marketing, Customer Experience
   - Frameworks: CLV, Sales Pipeline, Strategic Planning, RevOps
   - Output: 6,000 tokens average

2. **Operational Excellence Analysis**
   - Components: Operations, Technology, IT/Data, Risk Management
   - Frameworks: Lean Six Sigma, VSM, ITIL, Disaster Recovery
   - Output: 6,000 tokens average

3. **Financial & Strategic Alignment Analysis**
   - Components: Strategy, Financials
   - Frameworks: Financial Ratios, SWOT, Balanced Scorecard
   - Output: 5,000 tokens average

4. **People & Leadership Ecosystem Analysis**
   - Components: HR, Leadership & Governance
   - Frameworks: SHRM Competency, McKinsey 7S, HR Maturity
   - Output: 6,000 tokens average

5. **Compliance & Sustainability Framework Analysis**
   - Components: Compliance, Risk Management & Sustainability
   - Frameworks: COSO, ISO 31000, NIST, ISO 22301, ESG
   - Output: 5,000 tokens average

**Tier 2 Interconnection Analyses (Batch 2)**:
6. **Growth Readiness Analysis**
7. **Market Position Analysis**
8. **Resource Optimization Analysis**
9. **Risk & Resilience Analysis**
10. **Scalability Readiness Analysis**

**Key Features**:
- Parallel batch execution (5 requests per batch)
- Automatic polling with configurable interval (default: 30s)
- Exponential backoff retry logic
- Token usage tracking (input + output + thinking)
- Error handling with graceful degradation

#### Phase 2: Deep-Dive Cross-Analysis
**Orchestrator**: `src/orchestration/phase2-orchestrator.ts`
**Duration**: 2-3 minutes
**Inputs**: Phase 1 output + Phase 0 normalized data
**Analyses**: 5 cross-dimensional analyses

1. Cross-Dimensional Synthesis
2. Strategic Recommendations (15+ items)
3. Consolidated Risk Assessment (18+ items)
4. Growth Opportunities (10+ items)
5. Implementation Roadmap

#### Phase 3: Executive Synthesis
**Orchestrator**: `src/orchestration/phase3-orchestrator.ts`
**Duration**: 2-3 minutes
**Inputs**: Phase 2 output
**Outputs**: Overall health score, health status descriptor

Generates:
- Executive Summary
- Business Health Scorecard
- Action Matrix (prioritized)
- Investment Roadmap
- Final Recommendations

**Produces**:
- Overall Health Score (0-100)
- Health Status Descriptor (e.g., "Strong", "Caution")
- Prioritized action items

#### Phase 4: IDM Consolidation & Report Generation
**Orchestrator**: `src/orchestration/phase4-orchestrator.ts`
**Duration**: <1 second (no API calls)
**Function**: `consolidateIDM()` from `idm-consolidator.ts`

**Consolidation Logic**:
1. Extract benchmark profile from company data
2. Calculate dimension scores from questionnaire responses
3. Calculate chapter scores from dimensions
4. Calculate overall health score
5. Determine score bands and trajectories
6. Extract findings from Phase 1-3 analyses
7. Extract recommendations with horizon mapping
8. Identify quick wins (impact/effort thresholds)
9. Build implementation roadmap
10. Validate against Zod schemas

**Canonical IDM Structure**:
```typescript
IDM {
  meta: {
    id, version, created_at, assessment_run_id, company_id
  },
  company: {
    name, industry, revenue, employees, ...
  },
  scores_summary: {
    overall_health_score: 0-100,
    descriptor: string,
    health_status: 'Critical'|'Attention'|'Proficiency'|'Excellence',
    trend: 'Improving'|'Flat'|'Declining'
  },
  chapters: [
    Chapter {
      code: 'GE'|'PH'|'PL'|'RS',
      name: string,
      score: 0-100,
      dimensions: [
        Dimension {
          code: 12 possible,
          name: string,
          score: 0-100,
          band: ScoreBand,
          sub_indicators: SubIndicator[],
          findings: Finding[],
          recommendations: Recommendation[]
        }
      ]
    }
  ],
  findings: Finding[],
  recommendations: Recommendation[],
  quick_wins: QuickWin[],
  risks: Risk[],
  roadmap: Roadmap,
  benchmark_data: BenchmarkComparison[]
}
```

#### Phase 5: Report Generation
**Orchestrator**: `src/orchestration/phase5-orchestrator.ts`
**Duration**: ~63ms
**Inputs**: IDM + Phase 3 output
**Report Builders**: One per report type

**11 Report Types Generated**:
1. **Comprehensive Assessment Report** - Full end-to-end analysis
2. **Business Owner Executive Summary** - High-level strategic overview
3. **Quick Wins Action Plan** - Immediate, low-effort, high-impact improvements
4. **Risk Assessment Report** - Threats, mitigations, contingencies
5. **Implementation Roadmap** - Phased plan with timelines
6. **Financial Impact Analysis** - ROI, investment requirements, projections
7. **Growth Engine Deep Dive** - Strategy, Sales, Marketing, CX analysis
8. **Performance & Health Deep Dive** - Operations, Financials analysis
9. **People & Leadership Deep Dive** - HR, Leadership analysis
10. **Resilience & Safeguards Deep Dive** - Technology, IT, Risk, Compliance analysis

**Report Output Structure**:
```
output/reports/{run_id}/
├── comprehensive.html          # Main comprehensive report
├── comprehensive.meta.json     # Report metadata
├── owners-report.html
├── owners-report.meta.json
├── quick-wins.html
├── quick-wins.meta.json
├── risk-report.html
├── risk-report.meta.json
├── roadmap.html
├── roadmap.meta.json
├── financial-report.html
├── financial-report.meta.json
├── executiveBrief.html
├── executiveBrief.meta.json
├── deep-dive-ge.html
├── deep-dive-ge.meta.json
├── deep-dive-ph.html
├── deep-dive-ph.meta.json
├── deep-dive-pl.html
├── deep-dive-pl.meta.json
├── deep-dive-rs.html
└── deep-dive-rs.meta.json
```

---

## 3. Key Components & Modules

### A. Anthropic Batch API Client
**File**: `src/api/anthropic-client.ts`
**Purpose**: All interactions with Anthropic Batch API

**Key Classes**:
```typescript
class AnthropicBatchClient {
  // Batch job management
  submitBatch(requests: BatchRequest[]): Promise<BatchJob>
  getJobStatus(jobId: string): Promise<BatchJobStatus>
  getBatchResults(jobId: string): Promise<BatchResult[]>
  cancelJob(jobId: string): Promise<void>
  
  // Configuration
  setModel(model: string): void
  setMaxTokens(tokens: number): void
  setThinkingBudget(tokens: number): void
  
  // Polling & waiting
  waitForCompletion(jobId: string, options?): Promise<BatchJob>
  pollJobStatus(jobId: string, options?): Promise<BatchJobStatus>
}
```

**Key Interfaces**:
- `BatchRequest`: Individual request with custom_id, model, messages, thinking budget
- `BatchJob`: Job metadata with processing_status, request_counts, expires_at
- `BatchJobStatus`: Status snapshot with completion percentage, time estimate
- `BatchResult`: Individual result with message (if succeeded) or error (if failed)

**Error Handling**:
- Custom `BatchAPIError` class with code, statusCode, details
- Exponential backoff retry logic (default: 3 retries)
- Timeout handling with configurable max wait time
- Rate limiting support

### B. Phase Orchestrators
**Location**: `src/orchestration/phase*-orchestrator.ts`

Each orchestrator implements a factory pattern:
```typescript
export function createPhaseXOrchestrator(config: PhaseXConfig): PhaseXOrchestrator
export async function executePhaseX(...): Promise<PhaseXResult>
```

**Common Pattern**:
1. Config validation
2. Data transformation
3. Batch API submission (for AI phases)
4. Result retrieval & processing
5. Output validation
6. Error handling with detailed logging

### C. IDM Consolidator
**File**: `src/orchestration/idm-consolidator.ts`
**Function**: `consolidateIDM(input: IDMConsolidatorInput): IDMConsolidationResult`

**Consolidation Pipeline**:
```
Input (Phase 0-3 data)
  ↓
Extract Benchmark Profile
  ↓
Calculate Dimension Scores (from questionnaire)
  ↓
Calculate Chapter Scores (from dimensions)
  ↓
Calculate Overall Health Score
  ↓
Determine Score Bands & Trajectories
  ↓
Extract Findings from Phase 1-3
  ↓
Extract Recommendations
  ↓
Identify Quick Wins
  ↓
Build Implementation Roadmap
  ↓
Validate Against Schemas
  ↓
Output: IDM + Validation Results
```

### D. Data Transformers
**Files**: `src/data-transformation/*.ts`

1. **company-profile-transformer.ts**
   - Transforms webhook business_overview → CompanyProfile
   - Extracts size metrics, industry classification, location info
   - Creates company profile snapshot

2. **questionnaire-transformer.ts**
   - Transforms 93 responses → QuestionnaireResponses
   - Maps to 12 dimension categories
   - Extracts scores and comments

3. **benchmark-service.ts**
   - Retrieves industry benchmarks based on company profile
   - Multi-dimensional filtering (industry, revenue cohort, employee cohort, etc.)
   - Fallback logic for unavailable exact matches
   - Returns CategoryBenchmarks + CrossFunctionalBenchmarks

### E. Report Builders
**Location**: `src/orchestration/reports/*.builder.ts`

Each report type has a dedicated builder class:
```typescript
export class ComprehensiveReportBuilder {
  constructor(idm: IDM, config: ReportConfig)
  build(): Promise<Report>
}
```

**Builders**:
- `ComprehensiveReportBuilder`
- `OwnersReportBuilder`
- `QuickWinsReportBuilder`
- `RiskReportBuilder`
- `RoadmapReportBuilder`
- `FinancialReportBuilder`
- `ExecutiveBriefBuilder`
- `DeepDiveReportBuilder`

**Report Components**:
- `benchmark-callout.component.ts`: Industry comparison callouts
- `comprehensive-reference.component.ts`: Complete reference documentation
- `evidence-citation.component.ts`: Finding citations with sources
- `key-takeaways.component.ts`: Executive key takeaways

### F. Type System
**Location**: `src/types/*.ts`

**Core Types**:

1. **webhook.types.ts** - Input structure
   - WebhookPayload: Main envelope
   - BusinessOverview: Company metadata
   - Strategy/Sales/Marketing/...: Category responses
   - 93 questions across 13 categories

2. **company-profile.types.ts** - Company representation
   - CompanyProfile: Normalized company data
   - SizeMetrics: Revenue, employees, growth
   - ProductService: Product/service mix
   - BenchmarkSelectors: Criteria for benchmark matching

3. **questionnaire.types.ts** - Questionnaire responses
   - QuestionnaireResponses: All 93 answers normalized
   - CategoryResponses: Grouped by dimension
   - Question mapping to dimensions

4. **normalized.types.ts** - Phase 0 output
   - NormalizedCompanyProfile
   - NormalizedQuestionnaireResponses
   - NormalizedBenchmarkData
   - Phase0Output: Complete normalization result

5. **idm.types.ts** - Canonical data model (CORE!)
   - IDM: Root schema with Zod validation
   - Chapter: 4 strategic chapters
   - Dimension: 12 business dimensions
   - Finding: Strength/Gap/Risk/Opportunity
   - Recommendation: Strategic action item
   - QuickWin: High-impact, low-effort improvement
   - Risk: Identified risk with mitigation
   - Roadmap: Implementation timeline
   - All enums: ScoreBand, Trajectory, FindingType, etc.

6. **raw-input.types.ts** - Raw data storage
   - RawAssessmentData
   - RawWebhookCapture
   - DataQualityMetrics

7. **report.types.ts** - Report generation
   - Report: Generated report structure
   - ReportMetadata: Generation metadata
   - Phase5ReportType: Report type enumeration

### G. Validation & Schemas
**Location**: `src/validation/*.ts`

**Zod Schemas**:
- Raw input validation (webhook structure)
- Normalized data validation (Phase 0 output)
- IDM schema validation (canonical data model)
- Report output validation

**Usage Pattern**:
```typescript
const result = SomeSchema.safeParse(data);
if (result.success) {
  // Handle valid data
} else {
  // Handle validation errors
}
```

---

## 4. Technology Stack

### Core Technologies
- **Runtime**: Node.js 18+ with ES Modules
- **Language**: TypeScript 5.3+ with strict mode
- **AI Integration**: Anthropic Claude API (Batch API)
- **Database**: PostgreSQL 12+ (optional, pooled connections)

### Key Dependencies
```json
{
  "@anthropic-ai/sdk": "^0.32.1",         // Anthropic API client
  "dotenv": "^16.3.1",                    // Environment variables
  "pino": "^8.16.2",                      // Logging
  "pino-pretty": "^10.2.3",               // Log formatting
  "pg": "^8.11.3",                        // PostgreSQL driver
  "uuid": "^9.0.1",                       // ID generation
  "zod": "^3.25.76",                      // Schema validation
  "marked": "^17.0.1"                     // Markdown parsing
}
```

### Development Tools
- **TypeScript**: Type safety and compilation
- **Vitest**: Testing framework
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **tsx**: TypeScript execution for Node.js

### Model Configuration
**Primary Model**: Claude Opus 4.5 (claude-opus-4-5-20251101)
**Fallback Model**: claude-opus-4-20250514 (if 4.5 unavailable)
**Capabilities**:
- Max output tokens: 64,000
- Extended thinking: 128,000 tokens (32,000 default budget)
- Temperature: 1.0 (default, user-configurable)
- Batch API support with cost 50% reduction

### Logging Infrastructure
**Logger**: Pino with hierarchical module-based logging
**Configuration**:
- Development: Pretty-printed with colors, timestamps
- Production: JSON format for log aggregation
- Configurable log levels: trace, debug, info, warn, error, fatal
- Module-scoped child loggers for context

---

## 5. Data Pipelines & Workflows

### Input Data Format (Webhook)
**Source**: External questionnaire platform
**Event**: `new_questionnaire_response`
**Structure**: JSON with 93 questions across 13 categories
**Timestamp**: ISO 8601 format
**Submission ID**: UUID v4

**Categories** (93 questions total):
1. Business Overview (17 questions)
2. Strategy (8 questions)
3. Sales (11 questions)
4. Marketing (9 questions)
5. Customer Experience (8 questions)
6. Operations (8 questions)
7. Financials (12 questions)
8. Human Resources (7 questions)
9. Leadership (6 questions)
10. Technology (7 questions)
11. IT Infrastructure (7 questions)
12. Risk Management (7 questions)
13. Compliance (7 questions)

### Data Flow Through Pipeline

```
Webhook Input
  ↓
Phase 0: Normalization
  ├─ Parse & validate webhook
  ├─ Create company profile snapshot
  ├─ Map responses to 12 dimensions
  ├─ Calculate response scores
  └─ Retrieve benchmarks
  ↓ (phase0_output.json - 95 KB)
  ↓
Phase 1: AI Analyses
  ├─ Transform to analysis-ready format
  ├─ Batch 1 (Tier 1):
  │  ├─ Revenue Engine
  │  ├─ Operational Excellence
  │  ├─ Financial & Strategic
  │  ├─ People & Leadership
  │  └─ Compliance & Sustainability
  ├─ Batch 2 (Tier 2):
  │  ├─ Growth Readiness
  │  ├─ Market Position
  │  ├─ Resource Optimization
  │  ├─ Risk & Resilience
  │  └─ Scalability Readiness
  └─ Extract structured findings
  ↓ (phase1_output.json - 76 KB)
  ↓
Phase 2: Cross-Analysis
  ├─ Analyze interconnections
  ├─ Synthesize recommendations
  ├─ Consolidate risks
  ├─ Identify opportunities
  └─ Plan roadmap
  ↓ (phase2_output.json - 57 KB)
  ↓
Phase 3: Executive Synthesis
  ├─ Calculate health scores
  ├─ Create executive summary
  ├─ Prioritize actions
  └─ Finalize recommendations
  ↓ (phase3_output.json - 67 KB)
  ↓
Phase 4: IDM Consolidation
  ├─ Extract benchmark profile
  ├─ Calculate dimension scores
  ├─ Compute chapter scores
  ├─ Determine health score
  ├─ Extract findings & recommendations
  ├─ Identify quick wins
  ├─ Build roadmap
  └─ Validate structure
  ↓ (idm_output.json - 61 KB)
  ↓
Phase 5: Report Generation
  ├─ Comprehensive Report (746 KB)
  ├─ Owners Report (15 KB)
  ├─ Quick Wins Report (27 KB)
  ├─ Risk Report (20 KB)
  ├─ Roadmap Report (18 KB)
  ├─ Financial Report (25 KB)
  ├─ Executive Brief (19 KB)
  ├─ Growth Engine Deep Dive (35 KB)
  ├─ Performance & Health Deep Dive (27 KB)
  ├─ People & Leadership Deep Dive (26 KB)
  └─ Resilience & Safeguards Deep Dive (33 KB)
  ↓
Output: 11 Professional HTML Reports (554 KB total)
```

### Token Usage Pattern

**Phase 1 Analysis Tokens** (Anthropic Batch API):
- Per Tier 1 analysis: ~15K-20K tokens (including thinking)
- Per Tier 2 analysis: ~12K-18K tokens (including thinking)
- Total Phase 1: ~160K tokens for 10 analyses
- Cost reduction: 50% via Batch API (vs on-demand)

**Phase 2-3 Synthesis Tokens**:
- Phase 2: ~100K tokens across 5 analyses
- Phase 3: ~50K tokens for synthesis
- Combined: ~150K tokens

**Phase 4 IDM Consolidation**:
- Zero API calls (local processing)
- Schema validation and assembly

**Phase 5 Report Generation**:
- Per report: 2K-8K tokens depending on complexity
- Total: 30K-50K tokens for 11 reports
- Uses Anthropic API (not batch)

**Total Typical Execution**:
- Tokens: ~400K-500K total
- Duration: 10-15 minutes
- Cost: $2-3 USD (with Batch API optimization)

---

## 6. Configuration & Environment

### Environment Variables
**Location**: `.env` file

**Required for Phase 1-3 (AI)**:
```bash
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxx
```

**Optional Configuration**:
```bash
# Model selection
DEFAULT_MODEL=claude-opus-4-5-20251101          # Primary model
DEFAULT_MAX_TOKENS=64000                         # Max output
DEFAULT_THINKING_TOKENS=32000                    # Thinking budget
DEFAULT_TEMPERATURE=1.0                          # Temperature

# Batch API tuning
BATCH_POLL_INTERVAL_MS=30000                    # Poll interval
BATCH_TIMEOUT_MS=3600000                        # Max wait (1 hour)

# Logging
LOG_LEVEL=info                                   # debug|info|warn|error
NODE_ENV=development                            # development|production

# Database (optional)
DATABASE_URL=postgresql://user:pass@host:5432/bizhealth
DATABASE_SSL=false
DATABASE_POOL_MAX=10
DATABASE_IDLE_TIMEOUT=30000
DATABASE_CONNECT_TIMEOUT=10000
```

### Configuration Patterns

**Phase Orchestrator Config**:
```typescript
interface PhaseXOrchestratorConfig {
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  thinkingBudgetTokens?: number;
  temperature?: number;
  pollIntervalMs?: number;
  maxWaitTimeMs?: number;
  logger?: pino.Logger;
  enableDatabaseStorage?: boolean;
  outputDir?: string;
}
```

**Report Generation Config**:
```typescript
interface ReportGenerationConfig {
  generateReports: boolean;
  reportTypes: ReportType[];
  companyName?: string;
  anthropicApiKey?: string;
}
```

### Model Capabilities

**Claude Opus 4.5 Features**:
- 2x output token capacity vs previous version
- Extended thinking: Up to 128K thinking tokens
- 67% cost reduction vs earlier models
- Better at complex reasoning and analysis
- Optimized for batch API processing

---

## 7. Output & Reports

### Output Directory Structure
```
output/
├── phase0_output.json                # Raw capture (95 KB)
├── phase1_output.json                # Tier 1 & 2 results (76 KB)
├── phase2_output.json                # Cross-analysis (57 KB)
├── phase3_output.json                # Executive synthesis (67 KB)
├── phase4_output.json                # Report metadata (73 KB)
├── phase5_output.json                # Manifest (4 KB)
├── idm_output.json                   # Canonical IDM (64 KB)
├── pipeline_summary.json             # Execution summary
└── reports/
    └── {run_id}/                     # Per-assessment run
        ├── comprehensive.html        # Full assessment
        ├── comprehensive.meta.json
        ├── owners-report.html
        ├── quick-wins.html
        ├── risk-report.html
        ├── roadmap.html
        ├── financial-report.html
        ├── executiveBrief.html
        ├── deep-dive-ge.html
        ├── deep-dive-ph.html
        ├── deep-dive-pl.html
        └── deep-dive-rs.html
```

### Report Types (11 Total)

1. **Comprehensive Assessment Report** (746 KB)
   - Target Audience: Executive team, board
   - Content: All findings, all dimensions, all recommendations
   - Sections: Executive summary, scorecard, findings by dimension, risks, roadmap
   - Length: 80-100 pages

2. **Business Owner Executive Summary** (15 KB)
   - Target Audience: Business owners, C-suite
   - Content: High-level overview, key metrics, top 3-5 recommendations
   - Sections: Health score, quick wins, critical actions
   - Length: 5-10 pages

3. **Quick Wins Action Plan** (27 KB)
   - Target Audience: Operations team, managers
   - Content: 5-10 quick wins with implementation steps
   - Focus: High impact, low effort improvements
   - Length: 10-15 pages

4. **Risk Assessment Report** (20 KB)
   - Target Audience: Risk committee, board
   - Content: Identified risks, impact/likelihood matrix, mitigations
   - Sections: Critical risks, emerging risks, mitigation roadmap
   - Length: 15-20 pages

5. **Implementation Roadmap** (18 KB)
   - Target Audience: Project managers, implementation team
   - Content: Phase-based plan, timelines, dependencies, resources
   - Sections: Phase 1 (90 days), Phase 2 (12 months), Phase 3 (24+ months)
   - Length: 10-15 pages

6. **Financial Impact Analysis** (25 KB)
   - Target Audience: CFO, finance team, investors
   - Content: Cost/benefit analysis, ROI projections, investment requirements
   - Sections: Investment summary, financial projections, KPI targets
   - Length: 15-20 pages

7. **Executive Brief** (19 KB)
   - Target Audience: Board, external stakeholders
   - Content: One-page executive summary + appendices
   - Format: Summary narrative + key metrics

8. **Growth Engine Deep Dive** (35 KB)
   - Target Audience: Sales/marketing leadership
   - Content: Strategy, Sales, Marketing, Customer Experience dimensions
   - Focus: Revenue growth, market positioning, customer acquisition

9. **Performance & Health Deep Dive** (27 KB)
   - Target Audience: Operations leadership
   - Content: Operations, Financials dimensions
   - Focus: Operational efficiency, financial health, profitability

10. **People & Leadership Deep Dive** (26 KB)
    - Target Audience: HR, organizational development
    - Content: HR, Leadership & Governance dimensions
    - Focus: Talent, culture, leadership effectiveness, governance

11. **Resilience & Safeguards Deep Dive** (33 KB)
    - Target Audience: CTO, risk management, compliance
    - Content: Technology, IT/Data, Risk Management, Compliance dimensions
    - Focus: Technology readiness, cybersecurity, risk management, compliance

### Insights Data Model (IDM) Structure

**IDM serves as the canonical source of truth** for all report generation.

**Root Structure**:
```typescript
IDM {
  // Metadata
  meta: {
    id: UUID,
    version: string,
    created_at: ISO timestamp,
    assessment_run_id: UUID,
    company_id: UUID,
    company_name: string
  },

  // Company Information
  company: {
    name: string,
    industry: string,
    industry_category: string,
    year_founded: number,
    headquarters: Location,
    website: string,
    size_metrics: SizeMetrics,
    products_services: ProductServiceMix,
    competitors: Competitor[]
  },

  // Overall Health Scoring
  scores_summary: {
    overall_health_score: 0-100,
    descriptor: string,
    health_status: 'Critical'|'Attention'|'Proficiency'|'Excellence',
    trend: 'Improving'|'Flat'|'Declining',
    executive_summary: string
  },

  // 4 Strategic Chapters with 12 Dimensions
  chapters: [
    {
      code: 'GE'|'PH'|'PL'|'RS',
      name: string,
      description: string,
      score: 0-100,
      status: ScoreBand,
      summary: string,
      dimensions: [
        {
          code: 'STR'|'SAL'|'MKT'|'CXP'|'OPS'|'FIN'|'HRS'|'LDG'|'TIN'|'IDS'|'RMS'|'CMP',
          name: string,
          description: string,
          score: 0-100,
          band: ScoreBand,
          trajectory: Trajectory,
          sub_indicators: [
            {
              id: string,
              name: string,
              description: string,
              score: 0-100,
              benchmark: BenchmarkComparison
            }
          ],
          findings: Finding[],
          recommendations: Recommendation[],
          quick_wins: QuickWin[],
          risks: Risk[]
        }
      ]
    }
  ],

  // Consolidated Findings
  findings: [
    {
      id: UUID,
      type: 'strength'|'gap'|'risk'|'opportunity',
      dimension: DimensionCode,
      title: string,
      description: string,
      impact: 'high'|'medium'|'low',
      evidence: string[],
      recommendations: string[]
    }
  ],

  // Strategic Recommendations
  recommendations: [
    {
      id: UUID,
      title: string,
      description: string,
      dimension: DimensionCode,
      priority: 'critical'|'high'|'medium'|'low',
      horizon: '90_days'|'12_months'|'24_months_plus',
      estimated_effort: 'low'|'medium'|'high',
      estimated_cost: number,
      expected_impact: string,
      success_metrics: string[],
      prerequisites: string[],
      responsible_team: string
    }
  ],

  // Quick Wins (high impact, low effort)
  quick_wins: [
    {
      id: UUID,
      title: string,
      description: string,
      dimension: DimensionCode,
      impact_score: 0-10,
      effort_score: 0-10,
      timeframe_days: number,
      implementation_steps: string[],
      expected_outcome: string
    }
  ],

  // Risk Assessment
  risks: [
    {
      id: UUID,
      title: string,
      description: string,
      dimension: DimensionCode,
      probability: 'high'|'medium'|'low',
      impact: 'high'|'medium'|'low',
      mitigation_strategy: string,
      mitigation_timeline: string,
      responsible_team: string
    }
  ],

  // Implementation Roadmap
  roadmap: {
    overall_timeline_months: number,
    total_estimated_investment: number,
    expected_roi_percentage: number,
    phases: [
      {
        phase_number: 1|2|3,
        name: string,
        timeframe: string,
        focus: string,
        key_deliverables: string[],
        success_metrics: string[]
      }
    ]
  },

  // Benchmark Comparisons
  benchmark_data: {
    industry_benchmark: IndustryBenchmark,
    peer_comparison: PeerComparison,
    trend_analysis: TrendAnalysis
  }
}
```

### Report Metadata (per report)
```typescript
interface ReportMetadata {
  reportId: UUID;
  reportType: ReportType;
  assessmentRunId: UUID;
  companyName: string;
  generatedAt: ISO timestamp;
  generatedBy: string;  // 'claude-opus-4-5'
  contentLength: number;
  pageEstimate: number;
  keywords: string[];
  sections: string[];
}
```

---

## 8. Integration Points

### Anthropic Batch API Integration
**SDK**: `@anthropic-ai/sdk` v0.32.1+
**API Endpoint**: `https://api.anthropic.com/v1/messages/batches`
**Authentication**: Bearer token (ANTHROPIC_API_KEY)

**Integration Pattern**:
```typescript
// 1. Create batch client
const client = createAnthropicBatchClient({
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: 'claude-opus-4-5-20251101',
  maxTokens: 64000,
  thinkingBudgetTokens: 32000,
});

// 2. Prepare batch requests
const requests: BatchRequest[] = [
  {
    custom_id: 'analysis_1',
    params: {
      model: 'claude-opus-4-5-20251101',
      max_tokens: 60000,
      thinking: { type: 'enabled', budget_tokens: 32000 },
      messages: [{ role: 'user', content: prompt }]
    }
  }
  // ... more requests
];

// 3. Submit batch
const job = await client.submitBatch(requests);

// 4. Poll for completion
const results = await client.waitForCompletion(job.id, {
  pollIntervalMs: 30000,
  maxWaitTimeMs: 3600000
});

// 5. Process results
for (const result of results) {
  if (result.result.type === 'succeeded') {
    // Extract thinking and response
  }
}
```

### Webhook Input Handling
**Expected Source**: Questionnaire/form submission platform
**Format**: JSON POST body
**Event Type**: `new_questionnaire_response`
**Validation**: Zod schema validation in Phase 0

**Integration Point**: `src/index.ts::processSubmission()`
```typescript
export async function processSubmission(webhookPayload: WebhookPayload) {
  // Validates webhook structure
  // Executes Phase 1 analysis
  // Returns results or throws error
}
```

### File System Operations
**Primary Outputs**:
- Phase outputs (JSON): `output/phase{0-5}_output.json`
- IDM output: `output/idm_output.json`
- Reports: `output/reports/{run_id}/*.html`
- Pipeline summary: `output/pipeline_summary.json`

**Batch Processing**:
- Creates directories as needed
- Writes JSON files with 2-space indentation
- Validates file writes
- Handles concurrent access

### Database Operations (Optional)
**Driver**: `pg` (PostgreSQL)
**Connection**: Pooled with configurable limits
**Tables**:
- submissions
- batch_jobs
- analysis_outputs
- audit_events

**Usage**: Optional persistence layer, not required for core functionality

### Logging & Monitoring
**Logger**: Pino with hierarchical modules
**Outputs**: 
- Development: Pretty-printed to stdout
- Production: JSON to stdout (for log aggregation)

**Tracked Metrics**:
- Phase execution times
- Token usage (input + output + thinking)
- Error counts and types
- API response times
- Report generation details

---

## 9. Code Quality & Patterns

### TypeScript Patterns
**Strict Mode**: Enabled in `tsconfig.json`
**Module System**: ES Modules (import/export)
**Async/Await**: Consistent async handling throughout

**Type Safety Examples**:
```typescript
// Discriminated unions for results
type Phase1Result = 
  | { status: 'complete'; tier1: Tier1Results; tier2: Tier2Results }
  | { status: 'partial'; successful: number; failed: number }
  | { status: 'failed'; error: string };

// Branded types for IDs
type AssessmentRunId = string & { readonly __brand: 'AssessmentRunId' };
type CompanyProfileId = string & { readonly __brand: 'CompanyProfileId' };

// Factory pattern for orchestrators
function createPhase1Orchestrator(config: Phase1Config): Phase1Orchestrator

// Zod schema with inferred types
const IDMSchema = z.object({...});
type IDM = z.infer<typeof IDMSchema>;
```

### Error Handling
**Custom Error Classes**:
- `DatabaseError`: Database operation failures
- `NotFoundError`: Resource not found
- `BatchAPIError`: Batch API failures (with code, statusCode)
- `ValidationError`: Schema validation failures

**Error Propagation**:
```typescript
try {
  const result = await orchestrator.executePhase(data);
  return result;
} catch (error) {
  logger.error({ error: formatError(error) }, 'Phase failed');
  throw error;  // Propagate for caller handling
}
```

**Utility**: `src/utils/errors.ts::formatError()` provides structured error info

### Logging Patterns
**Child Loggers**: Module-scoped loggers with context
```typescript
const logger = createLogger('phase1-orchestrator');
logger.info({ submission_id, company }, 'Starting Phase 1');
logger.error({ error, analysis_type }, 'Analysis failed');
```

**Structured Logging**: All info as objects
```typescript
logger.info({
  phase: 1,
  total_duration_ms: 3500,
  successful_analyses: 5,
  failed_analyses: 0,
  token_usage: { input: 50000, output: 30000, thinking: 15000 }
}, 'Phase 1 complete');
```

### Code Organization Principles
1. **Single Responsibility**: Each module has one purpose
2. **Dependency Injection**: Config passed to functions/classes
3. **Immutability**: Data flows through phases without mutation
4. **Error Handling**: Explicit error handling, no silent failures
5. **Type Safety**: Full TypeScript with strict mode
6. **Testing**: Vitest test suites for critical paths

### Validation Patterns
**Input Validation** (Zod schemas):
```typescript
const result = WebhookSchema.safeParse(payload);
if (!result.success) {
  const errors = result.error.errors;
  logger.error({ errors }, 'Validation failed');
  throw new ValidationError('Invalid webhook', errors);
}
```

**Output Validation** (before return):
```typescript
const validation = IDMSchema.safeParse(idm);
if (!validation.success) {
  logger.warn({ errors: validation.error.errors }, 'IDM validation issues');
}
return { idm, validationPassed: validation.success };
```

---

## 10. Notable Features & Recent Upgrades

### Opus 4.5 Integration (November 2025)
**Upgrade Details**:
- 2x output token capacity (now 64K)
- Extended thinking support up to 128K tokens
- 67% cost reduction vs previous version
- Better reasoning for complex business analysis
- Batch API optimized for the new model

**Impact**:
- More comprehensive analyses
- Deeper thinking for strategic insights
- Significant cost savings
- Maintained execution speed

### Batch API Implementation
**Cost Optimization**: 50% reduction vs on-demand API
**Parallelization**: 5 analyses per batch, 2 sequential batches
**Reliability**: Automatic retry with exponential backoff
**Monitoring**: Built-in polling with status tracking

### Comprehensive Type System
**Zod Schemas**: Runtime validation for all data structures
**Branded Types**: IDE support for distinguishing IDs
**Discriminated Unions**: Type-safe result handling
**Inference**: Type extraction from schemas

### Assessment Tracking & Indexing
**Service**: `src/services/assessment-index.ts`
**Purpose**: Track assessment runs through pipeline phases
**Data**: Assessment metadata, run IDs, phase completion status

### Benchmark Integration
**Service**: `src/data-transformation/benchmark-service.ts`
**Features**:
- Multi-dimensional filtering (industry, revenue, employees, etc.)
- Fallback hierarchy for unavailable matches
- Percentile distributions (p10, p25, p50, p75, p90)
- Cross-functional benchmarks

### Report Validation Framework
**Location**: `src/orchestration/reports/validation/`
**Validates**:
- Report structure and completeness
- Section mapping to IDM data
- Content quality and coverage
- HTML output format

### Voice & Tone Transformation
**Component**: `src/orchestration/reports/utils/voice-transformer.ts`
**Purpose**: Adapt report narratives for different audiences
**Audiences**:
- Technical/operational teams
- Business owners/executives
- Board of directors
- External stakeholders

---

## 11. Execution Model & Usage

### Command-Line Interface
**Main Entry**: `src/index.ts`
```bash
npm run dev                    # Run with sample webhook
npm run dev sample_webhook.json  # Run with custom webhook
npm run build                  # Compile TypeScript
npm run lint                   # Check code style
npm run format                # Auto-format code
```

**Full Pipeline**: `src/run-pipeline.ts`
```bash
npx tsx src/run-pipeline.ts [webhook.json] [options]

Options:
  --phase=X           # Run specific phase (0-5)
  --phase=X-Y         # Run phases X through Y
  --output-dir=PATH   # Custom output directory
  --no-reports        # Skip report generation
  --all-reports       # Generate all report types
  --skip-db           # Skip database persistence
  --use-db            # Enable database persistence
  --company-name=NAME # Override company name
  --render-pdf        # Generate PDF versions
```

**Examples**:
```bash
# Full pipeline
npx tsx src/run-pipeline.ts sample_webhook.json

# Only Phase 0 (no API key needed)
npx tsx src/run-pipeline.ts sample_webhook.json --phase=0

# Only Phase 5 (requires Phase 0-4 complete)
npx tsx src/run-pipeline.ts sample_webhook.json --phase=5

# Custom output directory
npx tsx src/run-pipeline.ts data/webhook.json --output-dir=./custom_output

# Skip reports, use database
npx tsx src/run-pipeline.ts webhook.json --no-reports --use-db
```

### Programmatic API
**Entry Point**: `src/index.ts`
```typescript
import { processSubmission } from './index.js';

const results = await processSubmission(webhookPayload);
console.log(results.status);  // 'complete' | 'partial' | 'failed'
console.log(results.metadata.successful_analyses);
```

**Report Generation API**:
```typescript
import { createPhase4Orchestrator, ReportType } from './index.js';

const orchestrator = createPhase4Orchestrator({
  generateReports: true,
  reportTypes: [
    ReportType.COMPREHENSIVE_REPORT,
    ReportType.OWNERS_REPORT
  ]
});

const results = await orchestrator.executePhase4(
  phase1_output,
  phase2_output,
  phase3_output,
  idm
);
```

### Output Consumption Pattern
**Phase Results**: JSON files in `output/`
**IDM**: Canonical JSON in `idm_output.json`
**Reports**: HTML files in `output/reports/{run_id}/`
**Manifest**: `output/reports/{run_id}/manifest.json`

**Sample Report Metadata**:
```json
{
  "reportId": "uuid",
  "reportType": "comprehensive_report",
  "assessmentRunId": "uuid",
  "companyName": "EWM Global",
  "generatedAt": "2025-12-02T10:18:00Z",
  "generatedBy": "claude-opus-4-5-20251101",
  "contentLength": 746848,
  "pageEstimate": 85,
  "keywords": ["strategy", "growth", "operations", ...],
  "sections": ["executive-summary", "scorecard", "findings", ...]
}
```

---

## 12. Key Files Reference

### Phase Orchestrators
- **Phase 0**: `/src/orchestration/phase0-orchestrator.ts` (1,200 LOC)
- **Phase 1**: `/src/orchestration/phase1-orchestrator.ts` (1,100 LOC)
- **Phase 2**: `/src/orchestration/phase2-orchestrator.ts` (850 LOC)
- **Phase 3**: `/src/orchestration/phase3-orchestrator.ts` (800 LOC)
- **Phase 4**: `/src/orchestration/phase4-orchestrator.ts` (900 LOC)
- **Phase 5**: `/src/orchestration/phase5-orchestrator.ts` (800 LOC)
- **IDM Consolidator**: `/src/orchestration/idm-consolidator.ts` (1,500 LOC)

### Type Definitions
- **IDM Types**: `/src/types/idm.types.ts` (600 LOC) - **CORE DATA MODEL**
- **Webhook Types**: `/src/types/webhook.types.ts` (300 LOC)
- **Company Profile**: `/src/types/company-profile.types.ts` (400 LOC)
- **Normalized Data**: `/src/types/normalized.types.ts` (350 LOC)

### API & Data Transformation
- **Batch Client**: `/src/api/anthropic-client.ts` (800 LOC)
- **Benchmark Service**: `/src/data-transformation/benchmark-service.ts` (700 LOC)
- **Transformers**: `/src/data-transformation/*-transformer.ts` (600 LOC total)

### Report Generation
- **Comprehensive Builder**: `/src/orchestration/reports/comprehensive-report.builder.ts` (800 LOC)
- **Owners Builder**: `/src/orchestration/reports/owners-report.builder.ts` (1,100 LOC)
- **HTML Template**: `/src/orchestration/reports/html-template.ts` (900 LOC)
- **Report Generator**: `/src/reports/report-generator.ts` (500 LOC)

### Analysis Prompts
- **Tier 1 Prompts**: `/src/prompts/tier1/` (2,000 LOC total)
- **Tier 2 Prompts**: `/src/prompts/tier2/` (1,800 LOC total)

### Utilities
- **Logger**: `/src/utils/logger.ts` (50 LOC)
- **Error Handling**: `/src/utils/errors.ts` (100 LOC)
- **Benchmark Calculator**: `/src/utils/benchmark-calculator.ts` (400 LOC)

---

## 13. Deployment & Performance

### Performance Characteristics
- **Phase 0**: 26ms (negligible)
- **Phase 1**: 4-5 minutes (API-dependent, parallelized)
- **Phase 2**: 2-3 minutes (API-dependent)
- **Phase 3**: 2-3 minutes (API-dependent)
- **Phase 4**: <1 second (local processing only)
- **Phase 5**: 63ms (local processing)
- **Total**: 10-15 minutes (wall-clock time)

### Token Efficiency
- **Input Tokens**: ~50K-60K (questionnaire + context)
- **Output Tokens**: ~150K-200K (analyses)
- **Thinking Tokens**: ~100K-150K (extended thinking)
- **Total**: 300K-410K tokens per assessment
- **Cost**: $2-3 USD with Batch API optimization

### Scalability Considerations
- **Batch Processing**: Designed for 5-1000 concurrent assessments
- **Database**: PostgreSQL optional, scales horizontally
- **API Rate Limiting**: Handled by Anthropic SDK
- **Concurrency**: Limited by Batch API quotas and token budget

### Production Deployment
**Requirements**:
- Node.js 18+ runtime
- Anthropic API key with Batch API access
- Optional: PostgreSQL 12+ for persistence
- Optional: PDF rendering (Playwright or Puppeteer)

**Deployment Pattern**:
1. Environment setup (.env configuration)
2. Dependency installation (npm install)
3. TypeScript compilation (npm run build)
4. Pipeline execution via CLI or programmatic API

**Monitoring**:
- Pino JSON logs (integrate with log aggregation)
- Token usage tracking per phase
- Phase execution timing
- Error rates and types
- Report generation success/failure

---

## 14. Development & Testing

### Test Setup
**Framework**: Vitest with coverage support
**Scripts**:
```bash
npm run test              # Run all tests
npm run test:coverage    # With coverage report
npm run test:phase1      # Phase 1 specific tests
npm run test:mappings    # Report mapping validation
npm run validate:reports # Report structure validation
```

**Test Files**:
- `src/__tests__/phase0.test.ts`
- `src/orchestration/reports/config/__tests__/section-mapping.test.ts`

### Code Quality Tools
- **ESLint**: `npm run lint` (TypeScript)
- **Prettier**: `npm run format` (Code formatting)
- **TypeScript**: `npm run build` (Type checking)

### Validation Commands
```bash
npm run validate:all      # All validations
npm run validate:reports  # Report validation
npm run test:mappings    # Section mapping validation
```

---

## 15. Documentation & Resources

### Documentation Files
- **Main README**: `/README.md` (comprehensive overview)
- **Complete README**: `/README_COMPLETE.md` (detailed breakdown)
- **Setup Guide**: `/LOCAL-SETUP-GUIDE.md` (installation instructions)
- **Investigation Report**: `/investigate-pipeline.py` (analysis script)
- **IDM Bug Report**: `/IDM_CONSOLIDATION_BUG_REPORT.md` (known issues)

### Sample Data
- **Sample Webhook**: `/sample_webhook.json` (test input)
- **Sample Directory**: `/samples/` (multiple example datasets)

### Configuration Files
- **Environment Template**: `.env` (configuration)
- **TypeScript Config**: `tsconfig.json`
- **Package Config**: `package.json` (dependencies & scripts)
- **Jest Config**: `jest.config.js` (test configuration)

---

## Summary

The BizHealth.ai Pipeline is a **sophisticated, production-grade AI-powered business assessment system** with:

- **6-phase architecture** processing 93 questionnaire responses through 20 analyses
- **Canonical data model (IDM)** serving as single source of truth for all reports
- **11 distinct report types** tailored for different stakeholders
- **Industry benchmarking** providing comparative context
- **Extended thinking** leveraging Claude's reasoning capabilities
- **Batch API optimization** for 50% cost reduction
- **Comprehensive validation** at each phase
- **Professional output** with 554KB of HTML reports
- **Type-safe implementation** with full TypeScript and Zod validation
- **Modular architecture** enabling extension and customization

**Total Implementation**: 90 TypeScript files, 43,884 lines of code, production-ready for business intelligence and strategic assessment automation.

