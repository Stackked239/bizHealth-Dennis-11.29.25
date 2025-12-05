# BizHealth Report Pipeline

> **An AI-powered business health assessment system that transforms questionnaire responses into comprehensive strategic intelligence through a sophisticated six-phase analysis pipeline, generating 17 professional HTML reports.**

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [The Six-Phase Pipeline](#the-six-phase-pipeline)
  - [Phase 0: Raw Capture & Normalization](#phase-0-raw-capture--normalization)
  - [Phase 1: Cross-functional AI Analyses](#phase-1-cross-functional-ai-analyses)
  - [Phase 2: Deep-dive Cross-analysis](#phase-2-deep-dive-cross-analysis)
  - [Phase 3: Executive Synthesis](#phase-3-executive-synthesis)
  - [Phase 4: IDM Consolidation](#phase-4-idm-consolidation)
  - [Phase 5: Report Generation](#phase-5-report-generation)
- [The Insights Data Model (IDM)](#the-insights-data-model-idm)
- [Report Types](#report-types)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)

---

## Overview

BizHealth Report Pipeline analyzes business health across **12 strategic dimensions** organized into **4 strategic chapters**. The system leverages **Anthropic's Claude Opus 4.5** with extended thinking capabilities to provide deep, actionable insights.

### Key Metrics

| Metric | Value |
|--------|-------|
| Pipeline Phases | 6 (Phase 0-5) |
| AI Analyses | 20 (10 Tier 1 + 5 Tier 2 + 5 synthesis) |
| Report Types | 17 professional HTML reports |
| Business Dimensions | 12 across 4 chapters |
| Questions Analyzed | 87 questionnaire responses |
| Execution Time | ~10-15 minutes |

### The Four Strategic Chapters

| Chapter Code | Chapter Name | Dimensions |
|--------------|--------------|------------|
| **GE** | Growth Engine | Strategy (STR), Sales (SAL), Marketing (MKT), Customer Experience (CXP) |
| **PH** | Performance & Health | Operations (OPS), Financials (FIN) |
| **PL** | People & Leadership | Human Resources (HRS), Leadership & Governance (LDG) |
| **RS** | Resilience & Safeguards | Technology & Innovation (TIN), IT/Data/Systems (IDS), Risk Management (RMS), Compliance (CMP) |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              INPUT LAYER                                     │
│                     sample_webhook.json (Questionnaire)                      │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 0: Raw Capture & Normalization                                        │
│  ├── Capture raw webhook payload with immutable storage                      │
│  ├── Transform to NormalizedCompanyProfile                                   │
│  ├── Transform to NormalizedQuestionnaireResponses                           │
│  └── Retrieve industry benchmarks                                            │
│  Output: phase0_output.json                                                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 1: Cross-functional AI Analyses (Anthropic Batch API)                │
│  ├── Tier 1 (5 analyses): Revenue Engine, Operational Excellence,           │
│  │   Financial/Strategic, People/Leadership, Compliance/Sustainability      │
│  └── Tier 2 (5 analyses): Growth Readiness, Market Position,                │
│      Resource Optimization, Risk/Resilience, Scalability Readiness          │
│  Output: phase1_output.json                                                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 2: Deep-dive Cross-analysis (Anthropic Batch API)                    │
│  ├── Cross-dimensional synthesis                                             │
│  ├── Strategic recommendations                                               │
│  ├── Consolidated risk assessment                                            │
│  ├── Growth opportunities identification                                     │
│  └── Implementation roadmap                                                  │
│  Output: phase2_output.json                                                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 3: Executive Synthesis (Anthropic Batch API)                         │
│  ├── Executive summary generation                                            │
│  ├── Business health scorecard (0-100)                                       │
│  ├── Priority action matrix                                                  │
│  ├── Investment roadmap                                                      │
│  └── Final risk-adjusted recommendations                                     │
│  Output: phase3_output.json                                                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 4: IDM Consolidation                                                  │
│  ├── Consolidate Phase 0-3 outputs into Insights Data Model                 │
│  ├── Build 4 chapters with 12 dimensions                                    │
│  ├── Extract findings, recommendations, risks, quick wins                   │
│  ├── Calculate health scores using weighted formulas                        │
│  └── Validate with Zod schemas                                               │
│  Output: phase4_output.json + idm_output.json                                │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 5: Report Generation                                                  │
│  ├── Load IDM and phase outputs                                              │
│  ├── Build ReportContext with company profile                               │
│  ├── Generate 17 HTML reports via specialized builders                      │
│  └── Create manifest with report metadata                                    │
│  Output: 17 HTML reports + manifest.json                                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## The Six-Phase Pipeline

### Phase 0: Raw Capture & Normalization

**File**: `src/orchestration/phase0-orchestrator.ts`

Phase 0 transforms raw webhook data into normalized, analysis-ready structures:

1. **Raw Capture (Phase 0A)**: Stores the immutable webhook payload with audit metadata
2. **Normalization (Phase 0B)**: Creates two normalized outputs:
   - `NormalizedCompanyProfile`: Company metadata, benchmark selectors
   - `NormalizedQuestionnaireResponses`: Questions organized by chapter/dimension
3. **Benchmark Retrieval**: Matches company to industry benchmarks

**Key Types**:
```typescript
interface Phase0Output {
  assessment_run_id: string;
  companyProfile: NormalizedCompanyProfile;
  questionnaireResponses: NormalizedQuestionnaireResponses;
  benchmarkData: NormalizedBenchmarkData;
  indexEntry: AssessmentIndexEntry;
}
```

**Outputs**:
- `output/phase0_output.json`
- Raw data stored in `data/raw/` directory

---

### Phase 1: Cross-functional AI Analyses

**File**: `src/orchestration/phase1-orchestrator.ts`

Phase 1 executes **10 AI analyses** in two sequential batches via the Anthropic Batch API:

**Tier 1 (5 foundational analyses)**:
| Analysis | Focus Areas |
|----------|-------------|
| Revenue Engine | Strategy, Sales, Marketing, Customer Experience |
| Operational Excellence | Workflow, inventory, reliability, utilization |
| Financial Strategic | Cash flow, profitability, financial readiness |
| People Leadership | HR infrastructure, culture, talent management |
| Compliance Sustainability | Regulatory, legal, sustainability practices |

**Tier 2 (5 interconnection analyses)** - depends on Tier 1 outputs:
| Analysis | Focus Areas |
|----------|-------------|
| Growth Readiness | Cross-functional growth capability |
| Market Position | Competitive dynamics, market positioning |
| Resource Optimization | Resource utilization efficiency |
| Risk Resilience | Risk landscape and business resilience |
| Scalability Readiness | Infrastructure and organizational scalability |

**AI Configuration**:
- Model: `claude-opus-4-5-20251101`
- Max Tokens: 64,000
- Thinking Budget: 32,000 tokens (extended thinking enabled)
- Temperature: 1.0

**Output Structure**:
```typescript
interface Phase1Results {
  phase: 'phase_1';
  status: 'complete' | 'partial' | 'failed';
  company_profile_id: string;
  tier1: Tier1Results;  // 5 analyses
  tier2: Tier2Results;  // 5 analyses
  metadata: { /* timing and counts */ };
}
```

---

### Phase 2: Deep-dive Cross-analysis

**File**: `src/orchestration/phase2-orchestrator.ts`

Phase 2 performs **5 synthesis analyses** that cross-reference Phase 1 results:

| Analysis | Purpose |
|----------|---------|
| Cross-dimensional | Patterns across multiple dimensions |
| Strategic Recommendations | Prioritized, actionable recommendations |
| Consolidated Risks | Comprehensive risk inventory |
| Growth Opportunities | High-potential growth areas |
| Implementation Roadmap | Phased execution plan |

**Output Structure**:
```typescript
interface Phase2Results {
  phase: 'phase_2';
  status: 'complete' | 'partial' | 'failed';
  analyses: {
    cross_dimensional: Phase2AnalysisOutput;
    strategic_recommendations: Phase2AnalysisOutput;
    consolidated_risks: Phase2AnalysisOutput;
    growth_opportunities: Phase2AnalysisOutput;
    implementation_roadmap: Phase2AnalysisOutput;
  };
  summary: { /* metrics */ };
}
```

---

### Phase 3: Executive Synthesis

**File**: `src/orchestration/phase3-orchestrator.ts`

Phase 3 generates **5 executive-level outputs** from Phase 2 results:

| Output | Purpose |
|--------|---------|
| Executive Summary | High-level strategic overview |
| Scorecard | Quantified health metrics (0-100 scale) |
| Action Matrix | Prioritized actions by impact and urgency |
| Investment Roadmap | Financial projections and ROI |
| Final Recommendations | Risk-adjusted strategic guidance |

**Health Score Calculation**:
```typescript
interface Phase3Summary {
  overall_health_score: number;    // 0-100
  health_status: string;           // "Excellence" | "Proficiency" | "Attention" | "Critical"
  critical_risks_count: number;
  high_priority_actions_count: number;
  total_investment_required: string;
  expected_roi: string;
}
```

---

### Phase 4: IDM Consolidation

**File**: `src/orchestration/idm-consolidator.ts`

Phase 4 consolidates all previous phases into the **Insights Data Model (IDM)** - the canonical data structure for report generation.

**Consolidation Process**:
1. Extract company profile and questionnaire responses from Phase 0
2. Build 4 chapters with 12 dimensions from Phase 1-3 analysis content
3. Extract and categorize findings, recommendations, quick wins, and risks
4. Calculate weighted health scores for dimensions and chapters
5. Build implementation roadmap with prioritized phases
6. Validate complete IDM against Zod schemas

**Key Functions**:
```typescript
// Main consolidation function
function consolidateIDM(input: IDMConsolidatorInput): IDMConsolidationResult;

// Helper functions
function extractQuestions(responses: NormalizedQuestionnaireResponses): IDMQuestion[];
function buildDimensions(phase1: Phase1Results, phase2: Phase2Results, questions: IDMQuestion[]): Dimension[];
function buildChapters(dimensions: Dimension[], phase1: Phase1Results, phase2: Phase2Results): Chapter[];
function extractFindings(phase1: Phase1Results, phase2: Phase2Results): Finding[];
function identifyQuickWins(recommendations: Recommendation[]): QuickWin[];
function extractRisks(phase1: Phase1Results, phase2: Phase2Results, phase3: Phase3Results): Risk[];
function buildRoadmap(recommendations: Recommendation[], phase3: Phase3Results): RoadmapPhase[];
```

---

### Phase 5: Report Generation

**File**: `src/orchestration/phase5-orchestrator.ts`

Phase 5 generates **17 HTML reports** from the IDM:

**Report Types**:
| Category | Reports |
|----------|---------|
| **Executive** | Comprehensive, Owner, Executive Brief |
| **Strategic** | Quick Wins, Risk, Roadmap, Financial |
| **Chapter Deep Dives** | Growth Engine, Performance & Health, People & Leadership, Resilience & Safeguards |
| **Manager Reports** | Employees, Operations, Sales & Marketing, Financials, Strategy, IT/Technology |

**Generation Process**:
```typescript
interface Phase5Result {
  phase: 'phase_5';
  status: 'complete' | 'partial' | 'failed';
  reportsGenerated: number;
  outputDir: string;
  manifestPath: string;
  reports: ReportMetadata[];
}
```

**Output Structure**:
```
output/reports/{run-id}/
├── comprehensive.html
├── owner.html
├── executiveBrief.html
├── quickWins.html
├── risk.html
├── roadmap.html
├── financial.html
├── deep-dive-ge.html
├── deep-dive-ph.html
├── deep-dive-pl.html
├── deep-dive-rs.html
├── employees.html
├── managersOperations.html
├── managersSalesMarketing.html
├── managersFinancials.html
├── managersStrategy.html
├── managersItTechnology.html
└── manifest.json
```

---

## The Insights Data Model (IDM)

**File**: `src/types/idm.types.ts`

The IDM is the **canonical data structure** that serves as the single source of truth for all report generation.

### IDM Structure

```typescript
interface IDM {
  metadata: IDMMetadata;              // Assessment and company info
  scores_summary: ScoresSummary;      // Overall health score (0-100)
  chapters: Chapter[];                // 4 chapters (GE, PH, PL, RS)
  findings: Finding[];                // Key findings across dimensions
  recommendations: Recommendation[];  // Prioritized recommendations
  quick_wins: QuickWin[];            // High-impact, low-effort actions
  risks: Risk[];                     // Identified risks with severity
  roadmap: RoadmapPhase[];           // Implementation phases
  visualizations: Visualization[];   // Charts and diagrams
}
```

### Scoring System

| Score Band | Range | Description |
|------------|-------|-------------|
| **Excellence** | 80-100 | Exceptional performance, strategic leadership |
| **Proficiency** | 60-79 | Solid performance, competitive positioning |
| **Attention** | 40-59 | Needs improvement, vulnerabilities present |
| **Critical** | 0-39 | Urgent intervention required |

### Dimension Weights for Health Score

```typescript
const DIMENSION_WEIGHTS: Record<DimensionCode, number> = {
  STR: 0.10,  // Strategy - high impact
  SAL: 0.09,  // Sales
  MKT: 0.08,  // Marketing
  CXP: 0.08,  // Customer Experience
  OPS: 0.09,  // Operations
  FIN: 0.10,  // Financials - high impact
  HRS: 0.08,  // Human Resources
  LDG: 0.10,  // Leadership - high impact
  TIN: 0.08,  // Technology & Innovation
  IDS: 0.07,  // IT/Data/Systems
  RMS: 0.07,  // Risk Management
  CMP: 0.06   // Compliance
};
```

### Question Mappings

The IDM includes **87 question mappings** that link questionnaire items to dimensions and sub-indicators:

```typescript
const QUESTION_MAPPINGS: QuestionMapping[] = [
  { questionId: 'STR_01', dimension: 'STR', subIndicator: 'competitive_differentiation', weight: 0.15 },
  { questionId: 'STR_02', dimension: 'STR', subIndicator: 'market_share', weight: 0.12 },
  // ... 85 more mappings
];
```

---

## Report Types

### Executive Reports

| Report | Audience | Focus |
|--------|----------|-------|
| **Comprehensive** | Board, executives | Complete analysis across all dimensions |
| **Owner** | Business owners | Strategic priorities and growth opportunities |
| **Executive Brief** | C-suite | One-page health snapshot |

### Strategic Reports

| Report | Purpose |
|--------|---------|
| **Quick Wins** | High-impact, low-effort actions for immediate results |
| **Risk** | Risk inventory with severity ratings and mitigation strategies |
| **Roadmap** | Phased implementation plan (30/60/90/180/365 days) |
| **Financial** | ROI projections, investment requirements, value creation |

### Chapter Deep Dives

| Report | Dimensions Covered |
|--------|-------------------|
| **Growth Engine** | Strategy, Sales, Marketing, Customer Experience |
| **Performance & Health** | Operations, Financials |
| **People & Leadership** | Human Resources, Leadership & Governance |
| **Resilience & Safeguards** | Technology/Innovation, IT/Data, Risk Management, Compliance |

### Manager Reports

| Report | Target Role |
|--------|-------------|
| **Employees** | All-hands communication |
| **Operations** | COO, Operations Directors |
| **Sales & Marketing** | CSO, CMO |
| **Financials** | CFO, Finance Directors |
| **Strategy** | Chief Strategy Officer |
| **IT/Technology** | CTO, CIO |

---

## Quick Start

### Prerequisites

- Node.js 18+ (ES Modules support)
- TypeScript 5.x
- Anthropic API key with Claude Opus 4.5 access

### Installation

```bash
# Clone repository
git clone <repository-url>
cd bizHealth-Dennis-11.29.25-1

# Install dependencies
npm install --legacy-peer-deps

# Configure environment
cp .env.example .env
# Edit .env and add: ANTHROPIC_API_KEY=your_key_here
```

### Running the Pipeline

```bash
# Run complete pipeline (Phases 0-5)
npm run pipeline

# Or run specific phases
npx tsx src/run-pipeline.ts --phase=0        # Phase 0 only
npx tsx src/run-pipeline.ts --phase=0-3      # Phases 0-3
npx tsx src/run-pipeline.ts --phase=5        # Phase 5 only (requires prior phases)

# Custom input file
npx tsx src/run-pipeline.ts ./custom_webhook.json
```

### Viewing Results

```bash
# Reports are generated in output/reports/{run-id}/
open output/reports/*/comprehensive.html

# Check pipeline summary
cat output/pipeline_summary.json

# View IDM data
cat output/idm_output.json
```

---

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ANTHROPIC_API_KEY` | Yes | - | Anthropic API key |
| `DEFAULT_MODEL` | No | `claude-opus-4-5-20251101` | Claude model ID |
| `DEFAULT_MAX_TOKENS` | No | 64000 | Max output tokens |
| `DEFAULT_THINKING_TOKENS` | No | 32000 | Extended thinking budget |
| `BATCH_POLL_INTERVAL_MS` | No | 30000 | Batch API poll interval |
| `BATCH_TIMEOUT_MS` | No | 3600000 | Batch API timeout |
| `LOG_LEVEL` | No | info | Logging level |
| `RENDER_PDF` | No | false | Generate PDF versions |

### Pipeline Options

```bash
npx tsx src/run-pipeline.ts [webhook.json] [options]

Options:
  --phase=N         Run single phase (0-5)
  --phase=N-M       Run phase range
  --output-dir=X    Custom output directory
  --skip-db         Skip database storage (default)
  --use-db          Enable database storage
  --no-reports      Skip report generation
  --all-reports     Generate all report types
  --company-name=X  Override company name
  --render-pdf      Generate PDF versions
```

---

## Project Structure

```
src/
├── run-pipeline.ts              # Main pipeline entry point
├── phase0-index.ts              # Phase 0 exports
├── orchestration/               # Phase orchestrators
│   ├── phase0-orchestrator.ts   # Raw capture & normalization
│   ├── phase1-orchestrator.ts   # AI analyses (10)
│   ├── phase2-orchestrator.ts   # Deep-dive cross-analysis (5)
│   ├── phase3-orchestrator.ts   # Executive synthesis (5)
│   ├── phase4-orchestrator.ts   # IDM generation
│   ├── phase5-orchestrator.ts   # Report generation (17)
│   └── idm-consolidator.ts      # IDM consolidation logic
├── types/                       # TypeScript type definitions
│   ├── idm.types.ts            # IDM schema (890 lines)
│   ├── webhook.types.ts        # Input webhook structure
│   ├── normalized.types.ts     # Normalized data types
│   ├── report.types.ts         # Report type definitions
│   └── company-profile.types.ts
├── services/                    # Business logic services
│   ├── raw-assessment-storage.js
│   ├── assessment-index.js
│   └── narrative-extraction.service.ts
├── data-transformation/         # Data transformers
│   ├── company-profile-transformer.ts
│   ├── questionnaire-transformer.ts
│   ├── normalized-*.ts
│   └── benchmark-service.ts
├── reports/                     # Report generation
│   ├── report-generator.ts
│   ├── index.ts
│   └── builders/               # 17 report builders
├── prompts/                     # AI prompt templates
│   ├── tier1/*.prompts.ts
│   └── tier2/*.prompts.ts
├── api/                         # API clients
│   └── anthropic-client.ts     # Anthropic Batch API
├── validation/                  # Zod schemas
└── utils/                       # Utilities
    ├── logger.ts
    ├── errors.ts
    └── security.ts
```

---

## Technology Stack

| Technology | Purpose |
|------------|---------|
| **TypeScript** | Type-safe development |
| **Node.js 18+** | ES Modules runtime |
| **Anthropic SDK** | Claude API integration |
| **Zod** | Runtime schema validation |
| **Pino** | Structured logging |
| **UUID** | Assessment run identification |
| **dotenv** | Environment configuration |

### AI Model Specifications

- **Model**: Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- **Max Output**: 64,000 tokens
- **Thinking Budget**: 32,000 tokens
- **Temperature**: 1.0 (required for extended thinking)
- **API**: Anthropic Batch API (50% cost reduction)

---

## Cost & Performance

### Execution Times

| Phase | Duration | Description |
|-------|----------|-------------|
| Phase 0 | ~100ms | Data normalization |
| Phase 1 | 4-5 min | 10 AI analyses via Batch API |
| Phase 2 | 2-3 min | 5 synthesis analyses |
| Phase 3 | 2-3 min | 5 executive outputs |
| Phase 4 | <1 sec | IDM consolidation |
| Phase 5 | ~100ms | 17 report generation |
| **Total** | **10-15 min** | Complete pipeline |

### API Costs (Estimated)

| Phase | Token Usage | Cost |
|-------|-------------|------|
| Phase 1 | ~300K tokens | ~$6-10 |
| Phase 2 | ~150K tokens | ~$3-5 |
| Phase 3 | ~100K tokens | ~$2-4 |
| **Total** | **~550K tokens** | **$10-20** |

*Costs based on Anthropic Batch API pricing (50% discount from standard rates)*

---

## License

[License information]

---

## Support

- **Issues**: Submit via GitHub Issues
- **Documentation**: See inline code documentation
- **API Reference**: Type definitions in `src/types/`

---

*BizHealth Report Pipeline - Enterprise Business Intelligence Powered by Claude Opus 4.5*
