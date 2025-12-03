# BizHealth.ai - AI-Powered Business Assessment Pipeline

> **Transform 93 questionnaire responses into comprehensive strategic intelligence through sophisticated multi-phase AI analysis, generating 17 professional HTML reports in 10-15 minutes.**

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [System Architecture](#system-architecture)
- [The Six-Phase Pipeline](#the-six-phase-pipeline)
- [Understanding the Reports](#understanding-the-reports)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Usage Guide](#usage-guide)
- [Pipeline Execution Details](#pipeline-execution-details)
- [Data Flow & Transformation](#data-flow--transformation)
- [AI Analysis Framework](#ai-analysis-framework)
- [Report Generation System](#report-generation-system)
- [IDM (Insights Data Model)](#idm-insights-data-model)
- [Cost & Performance](#cost--performance)
- [Troubleshooting](#troubleshooting)
- [Development Guide](#development-guide)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Contributing](#contributing)

---

## Overview

BizHealth.ai is a **production-grade, enterprise-scale AI-powered business assessment platform** that analyzes business health across **12 strategic dimensions** organized into **4 strategic chapters**. The system leverages **Anthropic's Claude Opus 4.5** with extended thinking capabilities to provide deep, actionable insights for business owners, executives, and strategic advisors.

### What Makes BizHealth.ai Unique?

- **20 Distinct AI Analyses**: Multi-tiered analytical approach (10 foundational + 5 cross-cutting + 5 synthesis)
- **Anthropic Batch API**: 50% cost reduction with parallel processing
- **Extended Thinking**: 32K token thinking budget for deep reasoning
- **IDM Architecture**: Single canonical data model ensuring consistency across all 17 reports
- **Professional Output**: Executive-grade HTML reports with sophisticated styling
- **Comprehensive Coverage**: 12 business dimensions across 4 strategic chapters

### System Capabilities At A Glance

| Metric | Value |
|--------|-------|
| **Total Codebase** | 61,675 lines of TypeScript |
| **Pipeline Phases** | 6 (Phase 0 through Phase 5) |
| **AI Analyses** | 20 distinct analytical processes |
| **Report Types** | 17 professional HTML reports |
| **Business Dimensions** | 12 across 4 strategic chapters |
| **Questions Analyzed** | 93 questionnaire responses |
| **Execution Time** | 10-15 minutes per assessment |
| **Cost Per Assessment** | $10-20 (with Batch API) |
| **Token Usage** | 300K-410K tokens per run |
| **Output Size** | ~554 KB HTML + 63 KB IDM |

### The Four Strategic Chapters

BizHealth.ai organizes business analysis into four interconnected strategic chapters:

1. **Growth Engine (GE)** - Strategy (STR), Sales (SAL), Marketing (MKT), Customer Experience (CXP)
2. **Performance & Health (PH)** - Operations (OPS), Finance (FIN)
3. **People & Leadership (PL)** - Human Resources (HRS), Leadership (LDG), Tech & Innovation (TIN)
4. **Resilience & Safeguards (RS)** - Intellectual Defense Systems (IDS), Risk Management (RMS), Compliance (CMP)

---

## Quick Start

### Prerequisites

- Node.js 18+ (ES Modules support)
- TypeScript 5.x
- Anthropic API key with access to Claude Opus 4.5
- 8GB+ RAM recommended

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd workflow-export

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

### Running Your First Assessment

```bash
# Ensure your input data is ready
# The system expects: input/normalized-responses.json

# Run the complete pipeline
npm run pipeline

# Or run with TypeScript directly
npx tsx src/run-pipeline.ts

# Monitor progress in real-time
# The pipeline will execute Phases 0-5 sequentially
# Total runtime: approximately 10-15 minutes
```

### Viewing Results

After completion, find your reports in:

```
output/reports/{run-id}/
├── comprehensive.html          # Complete assessment report
├── owner.html                  # Business owner executive summary
├── executiveBrief.html         # One-page strategic overview
├── quickWins.html              # Immediate action opportunities
├── risk.html                   # Risk assessment and mitigation
├── roadmap.html                # Implementation roadmap
├── financial.html              # Financial impact analysis
├── deep-dive-ge.html           # Growth Engine deep analysis
├── deep-dive-ph.html           # Performance & Health deep analysis
├── deep-dive-pl.html           # People & Leadership deep analysis
├── deep-dive-rs.html           # Resilience & Safeguards deep analysis
├── managersOperations.html     # Operations manager report
├── managersSalesMarketing.html # Sales & Marketing manager report
├── managersFinancials.html     # Finance manager report
├── managersStrategy.html       # Strategy & Planning manager report
├── managersItTechnology.html   # IT & Technology manager report
└── manifest.json               # Report metadata and health score
```

---

## System Architecture

BizHealth.ai employs a **sophisticated six-phase pipeline architecture** with clear separation of concerns, orchestrated processing, and canonical data modeling.

### Architectural Principles

1. **Phase Isolation**: Each phase is self-contained with clear inputs/outputs
2. **Orchestrator Pattern**: Central coordinators manage complex workflows
3. **IDM Canonicalization**: Single source of truth for all downstream consumers
4. **Type Safety**: Strict TypeScript with Zod validation throughout
5. **Batch Optimization**: Anthropic Batch API for cost-effective parallel processing
6. **Extended Thinking**: 32K token budget for deep analytical reasoning

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          INPUT DATA LAYER                           │
│              input/normalized-responses.json (93 Q&A)               │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 0: DATA NORMALIZATION (No AI, ~26ms)                         │
│  • Validate input structure                                         │
│  • Transform to canonical format                                    │
│  • Map questions to dimensions                                      │
│  Output: phase0_output.json                                         │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 1: FOUNDATIONAL AI ANALYSES (10 analyses, 4-5 min)          │
│  Tier 1: STR, SAL, MKT, CXP, OPS (5 analyses)                      │
│  Tier 2: FIN, HRS, LDG, TIN, IDS (5 analyses)                      │
│  • Anthropic Batch API with extended thinking                       │
│  • 32K token thinking budget per analysis                           │
│  • Parallel execution for efficiency                                │
│  Output: phase1_output.json + 10 analysis result files             │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 2: CROSS-DIMENSIONAL SYNTHESIS (5 analyses, 2-3 min)        │
│  • RMS (Risk Management System) synthesis                           │
│  • CMP (Compliance) synthesis                                       │
│  • GE (Growth Engine) cross-analysis                                │
│  • PH (Performance & Health) cross-analysis                         │
│  • PL (People & Leadership) cross-analysis                          │
│  Output: phase2_output.json + 5 synthesis result files             │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 3: EXECUTIVE SYNTHESIS (1 analysis, 2-3 min)                │
│  • Overall health score calculation (0-100)                         │
│  • Strategic priority identification                                │
│  • Cross-chapter synthesis                                          │
│  • Executive-level insights                                         │
│  Output: phase3_output.json + executive synthesis result           │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 4: IDM CONSOLIDATION (No AI, <1 sec)                        │
│  • Consolidate all analyses into canonical IDM                      │
│  • Validate complete data model                                     │
│  • Create single source of truth                                    │
│  Output: phase4_output.json + idm_output.json (63 KB)              │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 5: REPORT GENERATION (17 reports, ~63ms)                    │
│  • Load IDM canonical data model                                    │
│  • Apply 17 specialized report templates                            │
│  • Generate professional HTML with styling                          │
│  • Create manifest and metadata                                     │
│  Output: 17 HTML reports + manifest.json                            │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      OUTPUT REPORTS LAYER                           │
│         17 Professional HTML Reports (~554 KB total)                │
└─────────────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
workflow-export/
├── src/
│   ├── phases/                    # Six phase orchestrators
│   │   ├── phase0-orchestrator.ts # Data normalization (1,200 LOC)
│   │   ├── phase1-orchestrator.ts # Foundational analyses (1,100 LOC)
│   │   ├── phase2-orchestrator.ts # Cross-dimensional synthesis (850 LOC)
│   │   ├── phase3-orchestrator.ts # Executive synthesis (800 LOC)
│   │   ├── phase4-orchestrator.ts # IDM consolidation (1,500 LOC)
│   │   └── phase5-orchestrator.ts # Report generation (800 LOC)
│   ├── builders/                  # Report template builders (21 files)
│   ├── services/                  # Core business logic
│   │   ├── anthropic-client.ts    # Batch API integration
│   │   ├── batch-coordinator.ts   # Batch job management
│   │   ├── phase-status.ts        # Pipeline state tracking
│   │   └── report-writer.ts       # HTML report generation
│   ├── types/                     # TypeScript type definitions
│   │   ├── idm.ts                 # IDM canonical schema
│   │   ├── normalized-data.ts     # Phase 0 output schema
│   │   └── phase-outputs.ts       # All phase output schemas
│   ├── utils/                     # Shared utilities
│   ├── validation/                # Zod validation schemas
│   └── run-pipeline.ts            # Main entry point
├── input/                         # Input data directory
│   └── normalized-responses.json  # 93 Q&A responses
├── output/                        # Pipeline outputs
│   ├── phase0_output.json
│   ├── phase1_output.json
│   ├── phase2_output.json
│   ├── phase3_output.json
│   ├── phase4_output.json
│   ├── phase5_output.json
│   ├── idm_output.json           # Canonical data model
│   └── reports/{run-id}/         # Generated HTML reports
├── tests/                         # Test suites
└── package.json
```

---

## The Six-Phase Pipeline

The BizHealth.ai pipeline executes in six sequential phases, each building upon the previous phase's output. Here's what happens in each phase:

### Phase 0: Data Normalization

**Duration**: ~26ms (pure data transformation, no AI)
**Purpose**: Transform raw questionnaire responses into a canonical normalized format
**Input**: `input/normalized-responses.json` (93 Q&A responses)
**Output**: `output/phase0_output.json` (structured normalized data)

**What Happens:**

1. **Input Validation**: Validates the structure of incoming questionnaire data using Zod schemas
2. **Question Mapping**: Maps each of the 93 questions to their respective business dimension (STR, SAL, MKT, etc.)
3. **Data Structuring**: Organizes responses by dimension and chapter for efficient downstream processing
4. **Metadata Extraction**: Captures company information, assessment timestamp, and version data
5. **Quality Checks**: Ensures all required questions are present and properly formatted

**Key Files:**
- `src/phases/phase0-orchestrator.ts` (1,200 LOC)
- `src/types/normalized-data.ts`
- `src/validation/phase0-validator.ts`

**Example Output Structure:**

```json
{
  "phase": "phase_0",
  "status": "success",
  "companyName": "EWM Global",
  "normalizedData": {
    "companyInfo": { /* metadata */ },
    "dimensions": {
      "STR": { "questions": [...], "rawResponses": [...] },
      "SAL": { "questions": [...], "rawResponses": [...] },
      /* ... all 12 dimensions */
    },
    "chapters": {
      "GE": ["STR", "SAL", "MKT", "CXP"],
      "PH": ["OPS", "FIN"],
      "PL": ["HRS", "LDG", "TIN"],
      "RS": ["IDS", "RMS", "CMP"]
    }
  }
}
```

---

### Phase 1: Foundational AI Analyses

**Duration**: 4-5 minutes (Anthropic Batch API with parallel execution)
**Purpose**: Generate 10 foundational dimensional analyses using AI
**Input**: `output/phase0_output.json`
**Output**: `output/phase1_output.json` + 10 individual analysis result files

**What Happens:**

Phase 1 executes in **two tiers** to respect AI provider rate limits while maximizing parallelization:

#### Tier 1 (5 analyses - executed first):
1. **STR (Strategy)**: Strategic positioning, competitive advantage, market differentiation
2. **SAL (Sales)**: Sales processes, pipeline management, conversion optimization
3. **MKT (Marketing)**: Brand positioning, customer acquisition, marketing ROI
4. **CXP (Customer Experience)**: Customer satisfaction, retention, loyalty drivers
5. **OPS (Operations)**: Operational efficiency, process optimization, scalability

#### Tier 2 (5 analyses - executed after Tier 1):
6. **FIN (Finance)**: Financial health, cash flow, profitability, unit economics
7. **HRS (Human Resources)**: Talent acquisition, retention, culture, engagement
8. **LDG (Leadership)**: Leadership effectiveness, decision-making, accountability
9. **TIN (Tech & Innovation)**: Technology stack, innovation processes, digital transformation
10. **IDS (Intellectual Defense Systems)**: IP protection, knowledge management, competitive moats

**AI Analysis Process (for each dimension):**

1. **Prompt Construction**: Assembles specialized prompt with:
   - Dimension-specific analytical framework
   - Relevant questions and responses
   - Contextual business information
   - Scoring rubric and guidelines

2. **Batch Job Creation**: Submits to Anthropic Batch API with:
   - Model: `claude-opus-4.5-20250514`
   - Thinking budget: 32,000 tokens
   - Max output tokens: 64,000
   - Temperature: 1.0 (full creativity)

3. **Extended Thinking**: Claude performs deep reasoning with internal monologue:
   - Pattern analysis across responses
   - Cross-reference validation
   - Nuance detection
   - Strategic insight synthesis

4. **Structured Output**: AI generates:
   - Dimensional score (0-100)
   - Score band (Excellence/Proficiency/Attention/Critical)
   - Narrative analysis (2-3 paragraphs)
   - Key strengths (3-5 items)
   - Key challenges (3-5 items)
   - Strategic recommendations (5-7 items with priorities)

5. **Batch Polling**: System polls Anthropic API every 30 seconds until all analyses complete

6. **Result Consolidation**: Merges all 10 analyses into unified Phase 1 output

**Key Files:**
- `src/phases/phase1-orchestrator.ts` (1,100 LOC)
- `src/services/anthropic-client.ts`
- `src/services/batch-coordinator.ts`
- `src/prompts/phase1/` (10 specialized prompts)

**Token Usage (per dimension):**
- Input: ~8,000-12,000 tokens
- Thinking: ~25,000-32,000 tokens
- Output: ~15,000-25,000 tokens
- **Total per dimension**: ~48,000-69,000 tokens
- **Total Phase 1**: ~480,000-690,000 tokens (before Batch API 50% reduction)

**Cost Optimization:**
- Batch API: 50% cost reduction vs real-time API
- Parallel execution: 5 analyses at a time (2 tiers)
- Total cost for Phase 1: ~$8-12

---

### Phase 2: Cross-Dimensional Synthesis

**Duration**: 2-3 minutes (Anthropic Batch API)
**Purpose**: Generate 5 cross-cutting analyses that synthesize insights across multiple dimensions
**Input**: `output/phase1_output.json`
**Output**: `output/phase2_output.json` + 5 synthesis result files

**What Happens:**

Phase 2 takes the 10 foundational analyses from Phase 1 and creates higher-order synthesis across related dimensions. This reveals patterns, dependencies, and strategic opportunities that aren't visible when examining dimensions in isolation.

#### The 5 Cross-Dimensional Syntheses:

1. **RMS (Risk Management System)**
   - **Synthesizes**: STR, SAL, MKT, CXP, OPS, FIN, HRS, LDG, TIN, IDS
   - **Focus**: Comprehensive risk landscape across all business areas
   - **Outputs**:
     - Risk inventory and categorization
     - Risk interdependencies and cascade effects
     - Risk mitigation strategies
     - Risk monitoring framework

2. **CMP (Compliance)**
   - **Synthesizes**: All dimensions with regulatory/compliance implications
   - **Focus**: Legal, regulatory, and ethical compliance posture
   - **Outputs**:
     - Compliance gap analysis
     - Regulatory exposure assessment
     - Compliance improvement roadmap
     - Governance recommendations

3. **GE (Growth Engine) Cross-Analysis**
   - **Synthesizes**: STR, SAL, MKT, CXP (the 4 Growth Engine dimensions)
   - **Focus**: How strategy, sales, marketing, and customer experience work together
   - **Outputs**:
     - Growth flywheel analysis
     - Channel synergies and conflicts
     - Customer journey optimization
     - Revenue acceleration opportunities

4. **PH (Performance & Health) Cross-Analysis**
   - **Synthesizes**: OPS, FIN (the 2 Performance & Health dimensions)
   - **Focus**: Operational efficiency → financial performance linkage
   - **Outputs**:
     - Operational cost drivers
     - Efficiency improvement ROI
     - Working capital optimization
     - Performance metric alignment

5. **PL (People & Leadership) Cross-Analysis**
   - **Synthesizes**: HRS, LDG, TIN (the 3 People & Leadership dimensions)
   - **Focus**: How people, leadership, and technology innovation intersect
   - **Outputs**:
     - Talent-technology alignment
     - Leadership capability gaps
     - Innovation culture assessment
     - Organizational development priorities

**AI Synthesis Process (for each cross-analysis):**

1. **Context Assembly**: Combines relevant Phase 1 analyses:
   ```typescript
   {
     "dimension_STR": { score, narrative, strengths, challenges },
     "dimension_SAL": { score, narrative, strengths, challenges },
     // ... all relevant dimensions
   }
   ```

2. **Pattern Recognition Prompt**: Specialized prompts that ask Claude to:
   - Identify cross-dimensional patterns and themes
   - Detect synergies and conflicts between dimensions
   - Uncover hidden dependencies and cascading effects
   - Synthesize higher-order strategic insights

3. **Extended Thinking**: 32K token budget for deep synthesis reasoning

4. **Structured Output**: Each synthesis produces:
   - Synthesis score (0-100)
   - Cross-dimensional narrative analysis
   - Key synergies identified
   - Key conflicts or tensions
   - Strategic integration recommendations

**Key Files:**
- `src/phases/phase2-orchestrator.ts` (850 LOC)
- `src/prompts/phase2/` (5 specialized synthesis prompts)

**Example: Growth Engine Cross-Analysis**

```json
{
  "dimension": "GE_cross",
  "score": 68,
  "scoreBand": "Proficiency",
  "narrative": "The Growth Engine shows strong strategic vision (STR: 72)
               with solid execution in sales (SAL: 71) and marketing (MKT: 65).
               However, customer experience (CXP: 64) lags slightly, creating
               friction in the customer journey. Key opportunity: Align marketing
               messaging with actual customer experience to improve conversion
               and reduce churn.",
  "keySynergies": [
    "Sales and marketing alignment is strong with shared metrics",
    "Strategic positioning supports premium pricing in sales",
    "Customer feedback loop informs product strategy effectively"
  ],
  "keyConflicts": [
    "Marketing promises exceed operational delivery capability",
    "Sales incentives misaligned with customer lifetime value",
    "Strategic focus on growth conflicts with CX team capacity"
  ],
  "recommendations": [
    "Implement integrated customer journey mapping across STR-SAL-MKT-CXP",
    "Align sales compensation with customer retention metrics",
    "Resource CX team to match marketing's customer acquisition pace"
  ]
}
```

---

### Phase 3: Executive Synthesis

**Duration**: 2-3 minutes (single Anthropic Batch API call)
**Purpose**: Generate executive-level strategic synthesis and calculate overall health score
**Input**: `output/phase1_output.json` + `output/phase2_output.json`
**Output**: `output/phase3_output.json` + executive synthesis result file

**What Happens:**

Phase 3 is the **strategic capstone** of the AI analysis pipeline. It takes all 15 analyses (10 foundational + 5 cross-dimensional) and creates an executive-level synthesis that:

1. **Calculates Overall Health Score** (0-100):
   ```typescript
   healthScore = weightedAverage([
     phase1_scores (10 dimensions) × dimension_weights,
     phase2_scores (5 syntheses) × synthesis_weights
   ])
   ```

2. **Determines Health Status Band**:
   - **Excellence** (80-100): Exceptional performance, strategic leadership position
   - **Proficiency** (60-79): Solid performance, competitive positioning
   - **Attention** (40-59): Needs improvement, strategic vulnerabilities present
   - **Critical** (0-39): Urgent intervention required, significant risks

3. **Strategic Priority Identification**:
   - Top 3-5 strategic priorities across all dimensions
   - Urgency classification (immediate, near-term, long-term)
   - Impact assessment (high, medium, low)
   - Resource requirements and constraints

4. **Cross-Chapter Strategic Insights**:
   - How the 4 strategic chapters (GE, PH, PL, RS) interact
   - Strategic leverage points for maximum impact
   - Systemic issues requiring holistic intervention
   - Strategic opportunities at chapter intersections

5. **Executive Narrative**:
   - High-level business health assessment (3-4 paragraphs)
   - Strategic position and competitive dynamics
   - Critical success factors and key risks
   - Strategic recommendations for leadership

**AI Synthesis Process:**

1. **Comprehensive Context Loading**:
   ```typescript
   {
     "phase1": { /* all 10 dimensional analyses */ },
     "phase2": { /* all 5 cross-dimensional syntheses */ },
     "companyInfo": { /* company metadata */ }
   }
   ```

2. **Executive-Level Prompt**: Asks Claude to:
   - Think as a strategic business advisor
   - Synthesize insights across all 15 analyses
   - Identify highest-impact strategic priorities
   - Calculate data-driven overall health score
   - Provide actionable executive recommendations

3. **Extended Thinking**: Full 32K token budget for comprehensive strategic reasoning

4. **Structured Executive Output**:
   ```json
   {
     "overallHealthScore": 72,
     "healthStatus": "Proficiency",
     "executiveNarrative": "EWM Global demonstrates solid overall business health...",
     "strategicPriorities": [
       {
         "priority": "Accelerate digital transformation in operations",
         "urgency": "immediate",
         "impact": "high",
         "dimensions": ["OPS", "TIN"],
         "rationale": "...",
         "keyActions": [...]
       },
       // ... 3-5 total priorities
     ],
     "chapterSynthesis": {
       "GE": { "score": 68, "summary": "...", "keyInsight": "..." },
       "PH": { "score": 71, "summary": "...", "keyInsight": "..." },
       "PL": { "score": 69, "summary": "...", "keyInsight": "..." },
       "RS": { "score": 74, "summary": "...", "keyInsight": "..." }
     },
     "criticalSuccessFactors": [...],
     "keyRisks": [...],
     "strategicRecommendations": [...]
   }
   ```

**Key Files:**
- `src/phases/phase3-orchestrator.ts` (800 LOC)
- `src/prompts/phase3/executive-synthesis-prompt.ts`
- `src/services/health-score-calculator.ts`

**Health Score Calculation Example:**

```typescript
// Dimension weights (sum to 1.0)
const dimensionWeights = {
  // Growth Engine (32% total weight)
  STR: 0.12,  // Strategy is highest weighted dimension
  SAL: 0.10,
  MKT: 0.08,
  CXP: 0.08,

  // Performance & Health (22% total weight)
  OPS: 0.10,
  FIN: 0.12,  // Finance is highly weighted

  // People & Leadership (26% total weight)
  HRS: 0.08,
  LDG: 0.10,  // Leadership is highly weighted
  TIN: 0.08,

  // Resilience & Safeguards (14% total weight)
  IDS: 0.06,
  RMS: 0.04,  // Lower weight as it's synthesized in Phase 2
  CMP: 0.04   // Lower weight as it's synthesized in Phase 2
};

// Calculation
healthScore =
  (STR_score × 0.12) +
  (SAL_score × 0.10) +
  (MKT_score × 0.08) +
  // ... all 12 dimensions

// Result: 72.3 → rounded to 72
```

**Why These Weights?**

- **Strategy & Finance**: Highest weights (0.12) - fundamental to business success
- **Leadership**: High weight (0.10) - multiplier effect on all other dimensions
- **Operations & Sales**: Significant weights (0.10) - core business drivers
- **Cross-Syntheses**: Lower weights (0.04) - avoid double-counting
- **Sum**: Exactly 1.0 - ensures proper weighted average

---

### Phase 4: IDM Consolidation

**Duration**: <1 second (pure data transformation, no AI)
**Purpose**: Consolidate all analyses into the canonical Insights Data Model (IDM)
**Input**: `output/phase0_output.json` + `output/phase1_output.json` + `output/phase2_output.json` + `output/phase3_output.json`
**Output**: `output/phase4_output.json` + `output/idm_output.json` (63 KB)

**What Happens:**

Phase 4 is the **critical consolidation phase** that creates the **single source of truth** for all business insights generated by the pipeline. The IDM (Insights Data Model) is the canonical data structure that ensures consistency across all 17 reports.

**IDM Consolidation Process:**

1. **Data Collection**: Gathers outputs from Phases 0-3:
   - Phase 0: Normalized questionnaire data
   - Phase 1: 10 foundational dimensional analyses
   - Phase 2: 5 cross-dimensional syntheses
   - Phase 3: Executive synthesis and health score

2. **IDM Structure Assembly**:
   ```typescript
   {
     // Company and assessment metadata
     "metadata": {
       "companyName": "EWM Global",
       "assessmentDate": "2025-12-03T09:49:45.991Z",
       "runId": "d90e6912-fa14-4d9a-8d82-e28c409f795c",
       "pipelineVersion": "1.0.0"
     },

     // Overall health metrics
     "healthMetrics": {
       "overallScore": 72,
       "healthStatus": "Proficiency",
       "chapterScores": {
         "GE": 68, "PH": 71, "PL": 69, "RS": 74
       }
     },

     // All 12 dimensional analyses
     "dimensions": {
       "STR": { score, scoreBand, narrative, strengths, challenges, recommendations },
       "SAL": { score, scoreBand, narrative, strengths, challenges, recommendations },
       // ... all 12 dimensions
     },

     // Cross-dimensional syntheses
     "syntheses": {
       "RMS": { score, narrative, keySynergies, keyConflicts, recommendations },
       "CMP": { ... },
       "GE_cross": { ... },
       "PH_cross": { ... },
       "PL_cross": { ... }
     },

     // Executive synthesis
     "executive": {
       "narrative": "...",
       "strategicPriorities": [...],
       "criticalSuccessFactors": [...],
       "keyRisks": [...],
       "strategicRecommendations": [...]
     },

     // Original normalized data for reference
     "originalData": {
       "dimensions": { /* Phase 0 normalized data */ }
     }
   }
   ```

3. **Schema Validation**: Validates complete IDM against strict Zod schema:
   - All required fields present
   - All scores are numbers 0-100
   - All score bands are valid (Excellence/Proficiency/Attention/Critical)
   - All arrays have expected structure
   - All references are resolvable

4. **Integrity Checks**:
   - Cross-reference validation (all dimension references in syntheses exist)
   - Score consistency (chapter scores align with dimension scores)
   - Completeness check (no missing analyses or data)
   - Data type validation (strings, numbers, arrays all correct types)

5. **IDM Persistence**:
   - Writes validated IDM to `output/idm_output.json` (63 KB)
   - Creates Phase 4 status output
   - Logs consolidation metrics and validation results

**Why IDM Matters:**

The IDM architecture provides several critical benefits:

1. **Consistency**: All 17 reports pull from the exact same data source
2. **Efficiency**: Report generation (Phase 5) is instant since no AI is needed
3. **Reliability**: Schema validation ensures data integrity before report generation
4. **Maintainability**: Single canonical model is easier to maintain than 17 separate data sources
5. **Extensibility**: Adding new report types only requires new templates, not new data pipelines

**Key Files:**
- `src/phases/phase4-orchestrator.ts` (1,500 LOC)
- `src/types/idm.ts` (canonical IDM schema definition)
- `src/validation/idm-validator.ts`
- `src/services/idm-consolidator.ts`

**IDM Size Optimization:**

The IDM is designed to be comprehensive yet efficient:
- **Size**: ~63 KB (compressed, readable JSON)
- **Structure**: Hierarchical for easy navigation
- **Redundancy**: Minimal - references used where possible
- **Accessibility**: Human-readable for debugging and auditing

**Example IDM Snippet:**

```json
{
  "metadata": {
    "companyName": "EWM Global",
    "assessmentDate": "2025-12-03T09:49:45.991Z",
    "runId": "d90e6912-fa14-4d9a-8d82-e28c409f795c"
  },
  "healthMetrics": {
    "overallScore": 72,
    "healthStatus": "Proficiency"
  },
  "dimensions": {
    "STR": {
      "score": 72,
      "scoreBand": "Proficiency",
      "narrative": "EWM Global demonstrates strong strategic positioning...",
      "strengths": [
        "Clear market differentiation in commercial property management",
        "Well-defined competitive advantages",
        "Strategic focus on technology integration"
      ],
      "challenges": [
        "Limited formal strategic planning process",
        "Market expansion strategy needs refinement",
        "Competitive intelligence gathering is ad-hoc"
      ],
      "recommendations": [
        {
          "title": "Implement quarterly strategic planning cycles",
          "priority": "high",
          "impact": "high",
          "effort": "medium",
          "description": "Establish formal strategic review process..."
        }
        // ... more recommendations
      ]
    }
    // ... all other dimensions
  }
}
```

---

### Phase 5: Report Generation

**Duration**: ~63ms (template-based HTML generation, no AI)
**Purpose**: Generate 17 professional HTML reports from the IDM
**Input**: `output/idm_output.json`
**Output**: 17 HTML files + `manifest.json` in `output/reports/{run-id}/`

**What Happens:**

Phase 5 is the **final presentation layer** that transforms the canonical IDM into 17 beautifully formatted, professional-grade HTML reports tailored for different audiences and use cases.

**The 17 Report Types:**

#### Executive Reports (3 reports)
1. **Comprehensive Assessment Report** (`comprehensive.html`)
   - **Audience**: Senior leadership, board members, investors
   - **Length**: ~40-50 pages
   - **Content**: Complete analysis across all dimensions, chapters, and syntheses
   - **Sections**: Executive summary, chapter analyses, dimensional deep dives, strategic recommendations

2. **Business Owner Report** (`owner.html`)
   - **Audience**: Business owners, CEOs
   - **Length**: ~15-20 pages
   - **Content**: Strategic overview with focus on growth, profitability, and risk
   - **Sections**: Health score, strategic priorities, growth opportunities, risk mitigation

3. **Executive Brief** (`executiveBrief.html`)
   - **Audience**: Time-constrained C-suite executives
   - **Length**: 2-3 pages (one-pager style)
   - **Content**: Highest-level summary with key metrics and priorities
   - **Sections**: Health score, top 3 priorities, critical risks, key actions

#### Strategic Reports (4 reports)
4. **Quick Wins Action Plan** (`quickWins.html`)
   - **Focus**: Immediate high-impact, low-effort opportunities
   - **Content**: 10-15 actionable quick wins with implementation guides

5. **Risk Assessment Report** (`risk.html`)
   - **Focus**: Comprehensive risk analysis and mitigation strategies
   - **Content**: Risk inventory, severity assessment, mitigation roadmap

6. **Implementation Roadmap** (`roadmap.html`)
   - **Focus**: Sequenced implementation plan for all recommendations
   - **Content**: Phased roadmap (0-90 days, 90-180 days, 180-365 days)

7. **Financial Impact Analysis** (`financial.html`)
   - **Focus**: Financial implications and ROI projections
   - **Content**: Cost-benefit analysis, investment priorities, ROI estimates

#### Deep Dive Reports (4 reports)
8. **Growth Engine Deep Dive** (`deep-dive-ge.html`)
   - **Focus**: STR, SAL, MKT, CXP detailed analysis
   - **Content**: Complete Growth Engine chapter with dimensional and cross-analysis

9. **Performance & Health Deep Dive** (`deep-dive-ph.html`)
   - **Focus**: OPS, FIN detailed analysis
   - **Content**: Operational efficiency and financial health deep dive

10. **People & Leadership Deep Dive** (`deep-dive-pl.html`)
    - **Focus**: HRS, LDG, TIN detailed analysis
    - **Content**: People, leadership, and innovation comprehensive analysis

11. **Resilience & Safeguards Deep Dive** (`deep-dive-rs.html`)
    - **Focus**: IDS, RMS, CMP detailed analysis
    - **Content**: Risk, compliance, and intellectual property analysis

#### Functional Manager Reports (5 reports)
12. **Operations Manager Report** (`managersOperations.html`)
    - **Audience**: COO, operations directors
    - **Content**: OPS dimension focus with relevant cross-connections

13. **Sales & Marketing Manager Report** (`managersSalesMarketing.html`)
    - **Audience**: CSO, CMO, sales/marketing leaders
    - **Content**: SAL and MKT dimensions with CXP integration

14. **Finance Manager Report** (`managersFinancials.html`)
    - **Audience**: CFO, finance directors
    - **Content**: FIN dimension with OPS and strategic financial insights

15. **Strategy & Planning Manager Report** (`managersStrategy.html`)
    - **Audience**: Chief Strategy Officer, strategic planning leads
    - **Content**: STR dimension with executive synthesis and strategic priorities

16. **IT & Technology Manager Report** (`managersItTechnology.html`)
    - **Audience**: CTO, CIO, IT directors
    - **Content**: TIN dimension with digital transformation insights

#### Additional Report
17. **Employees Report** (`employees.html`) - *Currently experiencing generation issues*
    - **Audience**: General employees, all-hands communication
    - **Content**: Simplified business health overview for company-wide sharing

**Report Generation Process:**

1. **IDM Loading**: Reads `idm_output.json` into memory

2. **Report Builder Selection**: For each report type, selects appropriate builder:
   ```typescript
   const builders = {
     comprehensive: buildComprehensiveReport(idm),
     owner: buildOwnerReport(idm),
     executiveBrief: buildExecutiveBriefReport(idm),
     // ... all 17 builders
   };
   ```

3. **Template Processing**: Each builder:
   - Extracts relevant data from IDM
   - Applies report-specific formatting logic
   - Structures content with headings, sections, tables
   - Generates HTML with embedded CSS

4. **Styling Application**: Injects professional CSS:
   ```css
   /* Modern, executive-grade styling */
   - Clean typography (Inter, system fonts)
   - Professional color palette (blues, grays)
   - Responsive layout
   - Print-optimized styles
   - Accessibility-friendly (WCAG AA)
   ```

5. **Report Writing**: Writes each HTML file to output directory

6. **Manifest Generation**: Creates `manifest.json` with:
   ```json
   {
     "runId": "d90e6912-fa14-4d9a-8d82-e28c409f795c",
     "companyName": "EWM Global",
     "generatedAt": "2025-12-03T09:49:46.058Z",
     "healthScore": 72,
     "healthStatus": "Proficiency",
     "reports": [
       {
         "type": "comprehensive",
         "name": "Comprehensive Assessment Report",
         "html": "comprehensive.html",
         "meta": "comprehensive.meta.json"
       },
       // ... all 17 reports
     ]
   }
   ```

7. **Metadata Files**: Creates `.meta.json` for each report with generation timestamp and report-specific metadata

**Key Files:**
- `src/phases/phase5-orchestrator.ts` (800 LOC)
- `src/builders/` (21 builder files, ~6,000 LOC total)
  - `comprehensive-report-builder.ts`
  - `owner-report-builder.ts`
  - `executive-brief-builder.ts`
  - `quick-wins-builder.ts`
  - `risk-report-builder.ts`
  - `roadmap-builder.ts`
  - `financial-builder.ts`
  - `deep-dive-ge-builder.ts`
  - `deep-dive-ph-builder.ts`
  - `deep-dive-pl-builder.ts`
  - `deep-dive-rs-builder.ts`
  - `managers-operations-builder.ts`
  - `managers-sales-marketing-builder.ts`
  - `managers-financials-builder.ts`
  - `managers-strategy-builder.ts`
  - `managers-it-technology-builder.ts`
  - `employees-builder.ts`
  - (Plus shared utility builders)

**Report Styling Example:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Comprehensive Assessment Report - EWM Global</title>
  <style>
    :root {
      --primary-color: #2563eb;
      --text-color: #1f2937;
      --bg-color: #ffffff;
      --border-color: #e5e7eb;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: var(--text-color);
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .health-score {
      font-size: 3rem;
      font-weight: 700;
      color: var(--primary-color);
    }

    .score-band {
      display: inline-block;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-weight: 600;
    }

    .score-band.proficiency {
      background-color: #dbeafe;
      color: #1e40af;
    }

    /* ... comprehensive professional styling ... */
  </style>
</head>
<body>
  <header>
    <h1>Comprehensive Business Assessment Report</h1>
    <div class="company-info">
      <h2>EWM Global</h2>
      <p class="assessment-date">Assessment Date: December 3, 2025</p>
    </div>
    <div class="health-score-container">
      <div class="health-score">72</div>
      <span class="score-band proficiency">Proficiency</span>
    </div>
  </header>

  <!-- Report content generated from IDM -->
  <!-- ... -->
</body>
</html>
```

**Report Output Directory Structure:**

```
output/reports/d90e6912-fa14-4d9a-8d82-e28c409f795c/
├── manifest.json                       # Report inventory and metadata
├── comprehensive.html                  # Main comprehensive report
├── comprehensive.meta.json             # Comprehensive report metadata
├── owner.html                          # Business owner report
├── owner.meta.json
├── executiveBrief.html                 # Executive one-pager
├── executiveBrief.meta.json
├── quickWins.html                      # Quick wins action plan
├── quickWins.meta.json
├── risk.html                           # Risk assessment
├── risk.meta.json
├── roadmap.html                        # Implementation roadmap
├── roadmap.meta.json
├── financial.html                      # Financial impact analysis
├── financial.meta.json
├── deep-dive-ge.html                   # Growth Engine deep dive
├── deep-dive-ge.meta.json
├── deep-dive-ph.html                   # Performance & Health deep dive
├── deep-dive-ph.meta.json
├── deep-dive-pl.html                   # People & Leadership deep dive
├── deep-dive-pl.meta.json
├── deep-dive-rs.html                   # Resilience & Safeguards deep dive
├── deep-dive-rs.meta.json
├── managersOperations.html             # Operations manager report
├── managersOperations.meta.json
├── managersSalesMarketing.html         # Sales & Marketing manager report
├── managersSalesMarketing.meta.json
├── managersFinancials.html             # Finance manager report
├── managersFinancials.meta.json
├── managersStrategy.html               # Strategy & Planning manager report
├── managersStrategy.meta.json
├── managersItTechnology.html           # IT & Technology manager report
└── managersItTechnology.meta.json
```

**Performance Characteristics:**

- **Speed**: ~63ms total for all 17 reports
- **Efficiency**: No AI calls, pure template processing
- **Reliability**: 16/17 reports generate successfully (employees report issue)
- **Size**: ~554 KB total HTML (32KB per report average)
- **Quality**: Professional executive-grade presentation

---

## Understanding the Reports

For detailed guidance on understanding and using the reports, including:
- Health score interpretation
- Score band colors and meanings
- How to read each report type effectively
- Using the Quick Wins report for immediate action
- Implementation roadmap sequencing
- Manager report usage by role

Please see the [CODEBASE_ANALYSIS.md](./CODEBASE_ANALYSIS.md#understanding-the-reports) file for complete details.

---

## Installation & Setup

### System Requirements

**Minimum Requirements:**
- Node.js 18.0.0 or higher (ES Modules support required)
- TypeScript 5.0 or higher
- 4 GB RAM
- 2 GB free disk space
- Internet connection for Anthropic API

**Recommended Requirements:**
- Node.js 20.x LTS
- TypeScript 5.3+
- 8 GB RAM
- 5 GB free disk space
- Stable high-speed internet connection

### Installation Steps

1. **Clone Repository**:
   ```bash
   git clone <repository-url>
   cd workflow-export
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

   This installs:
   - `@anthropic-ai/sdk` - Official Anthropic SDK
   - `zod` - TypeScript-first schema validation
   - `pino` - High-performance logging
   - `dotenv` - Environment variable management
   - TypeScript and type definitions

3. **Configure Environment**:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure:
   ```bash
   # Required: Anthropic API key
   ANTHROPIC_API_KEY=your_api_key_here

   # Optional: Logging configuration
   LOG_LEVEL=info  # debug | info | warn | error

   # Optional: Custom output directory
   OUTPUT_DIR=./output

   # Optional: Batch API polling interval (seconds)
   BATCH_POLL_INTERVAL=30
   ```

4. **Verify Installation**:
   ```bash
   # Check Node.js version
   node --version  # Should be 18.x or higher

   # Check TypeScript compilation
   npm run build

   # Run tests
   npm test
   ```

### Obtaining an Anthropic API Key

1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Create an account or sign in
3. Navigate to API Keys section
4. Generate a new API key
5. Copy the key and add to `.env` file

**API Access Requirements:**
- Access to Claude Opus 4.5 model
- Batch API access (typically available for all accounts)
- Sufficient API credits (approximately $15-20 per assessment)

---

## Configuration

For detailed configuration information, including:
- Environment variables
- Pipeline configuration
- Customizing prompts
- Model selection
- Token configuration

Please see the [CODEBASE_ANALYSIS.md](./CODEBASE_ANALYSIS.md#configuration) file for complete details.

---

## Usage Guide

### Basic Usage

**Simple Pipeline Execution:**

```bash
# Ensure input data exists
ls input/normalized-responses.json

# Run complete pipeline
npm run pipeline

# Monitor output
tail -f output/pipeline.log
```

### Advanced Usage

For information on:
- Running specific phases
- Custom pipeline workflows
- Monitoring progress
- Programmatic usage

Please see the [CODEBASE_ANALYSIS.md](./CODEBASE_ANALYSIS.md#usage-guide) file for complete details.

---

## Pipeline Execution Details

For complete details on:
- Execution flow
- Batch API orchestration
- Data transformation points
- Data structure evolution

Please see the [CODEBASE_ANALYSIS.md](./CODEBASE_ANALYSIS.md#pipeline-execution-details) file.

---

## Data Flow & Transformation

For complete details on:
- The 5 data transformation points
- Input data structure
- Phase 0 normalized structure
- Phase 1-4 data evolution
- Report HTML structure

Please see the [CODEBASE_ANALYSIS.md](./CODEBASE_ANALYSIS.md#data-flow--transformation) file.

---

## AI Analysis Framework

For complete details on:
- Extended thinking architecture
- Scoring methodology
- Dimensional score calculation
- Health score weighting

Please see the [CODEBASE_ANALYSIS.md](./CODEBASE_ANALYSIS.md#ai-analysis-framework) file.

---

## Report Generation System

For complete details on:
- Report builder architecture
- Template processing
- Styling system
- Report customization

Please see the [CODEBASE_ANALYSIS.md](./CODEBASE_ANALYSIS.md#report-generation-system) file.

---

## IDM (Insights Data Model)

### Overview

The **Insights Data Model (IDM)** serves as the canonical source of truth for all business intelligence. It consolidates data from all pipeline phases into a single, validated, structured model.

### Why IDM Exists

1. **Consistency**: All 17 reports pull from identical data
2. **Efficiency**: Report generation is instant (no re-analysis)
3. **Reliability**: Schema validation ensures data integrity
4. **Maintainability**: One model vs. 17 separate data sources
5. **Extensibility**: New reports require only new templates
6. **Auditability**: Single artifact for complete assessment review

For complete IDM schema details, validation, and usage examples, please see the [CODEBASE_ANALYSIS.md](./CODEBASE_ANALYSIS.md#idm-insights-data-model) file.

---

## Cost & Performance

### Execution Metrics

| Phase | Duration | Type | API Calls |
|-------|----------|------|-----------|
| Phase 0 | ~26ms | Data processing | 0 |
| Phase 1 | 4-5 min | AI analysis | 10 (via Batch API) |
| Phase 2 | 2-3 min | AI analysis | 5 (via Batch API) |
| Phase 3 | 2-3 min | AI analysis | 1 (via Batch API) |
| Phase 4 | <1 sec | Data compilation | 0 |
| Phase 5 | ~63ms | Report generation | 0 |
| **Total** | **10-15 min** | **Complete pipeline** | **16** |

### Cost Estimates

**With Claude Opus 4.5 (Recommended)**:
- **Per Assessment**: $10-20
- **Monthly (10 runs)**: $100-200
- **Per Analysis**: $0.50-1.00

**Batch API Benefits**:
- 50% cost reduction vs real-time API
- Parallel execution
- Automatic retry and error handling

For detailed cost breakdowns, token usage, and performance optimization strategies, please see the [CODEBASE_ANALYSIS.md](./CODEBASE_ANALYSIS.md#cost--performance) file.

---

## Troubleshooting

### Common Issues

#### 1. Employees Report Generation Failure

**Symptoms**: Phase 5 completes with status "partial", error: "text.replace is not a function"

**Temporary Workaround**: The employees report is currently disabled. All other 16 reports generate successfully.

#### 2. Batch API Timeout

**Solutions**:
```bash
# Increase timeout in .env
BATCH_TIMEOUT_MINUTES=60

# Or check Anthropic API status
curl https://status.anthropic.com/
```

For complete troubleshooting information including debugging tips, validation checks, and performance diagnostics, please see the [CODEBASE_ANALYSIS.md](./CODEBASE_ANALYSIS.md#troubleshooting) file.

---

## Development Guide

For complete development information including:
- Development setup
- Code quality commands
- Testing
- TypeScript configuration
- Code patterns
- Adding new report types
- Adding new dimensional analyses

Please see the [CODEBASE_ANALYSIS.md](./CODEBASE_ANALYSIS.md#development-guide) file.

---

## API Reference

For complete API documentation including:
- PipelineOrchestrator
- AnthropicClient
- IDMConsolidator
- ReportGenerator

Please see the [CODEBASE_ANALYSIS.md](./CODEBASE_ANALYSIS.md#api-reference) file.

---

## Testing

### Test Structure

```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
└── e2e/            # End-to-end tests
```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

For complete testing information including test examples and coverage requirements, please see the [CODEBASE_ANALYSIS.md](./CODEBASE_ANALYSIS.md#testing) file.

---

## Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/my-new-feature`
3. **Make your changes**: Follow coding standards
4. **Add tests**: Ensure >80% code coverage
5. **Run tests**: `npm test`
6. **Commit**: Use conventional commits
7. **Push**: `git push origin feature/my-new-feature`
8. **Open Pull Request**: Describe changes and link to issues

For complete contribution guidelines including code review checklist and commit message format, please see the [CODEBASE_ANALYSIS.md](./CODEBASE_ANALYSIS.md#contributing) file.

---

## Quick Reference

```bash
# Installation & Setup
npm install
cp .env.example .env
# Add ANTHROPIC_API_KEY to .env

# Run Complete Pipeline
npx tsx src/run-pipeline.ts

# View Reports
open output/reports/*/comprehensive.html

# Check Status
cat output/pipeline_summary.json

# Debug Mode
LOG_LEVEL=debug npx tsx src/run-pipeline.ts
```

---

## License

[License information would go here]

---

## Support & Contact

For questions, issues, or contributions:

- **GitHub Issues**: [repository-url]/issues
- **Documentation**: See CODEBASE_ANALYSIS.md for detailed technical documentation
- **Email**: support@bizhealth.ai

---

## Appendix

### Dimension Reference

| Code | Name | Chapter | Focus Area |
|------|------|---------|-----------|
| **STR** | Strategy | GE | Strategic positioning, competitive advantage, market differentiation |
| **SAL** | Sales | GE | Sales processes, pipeline management, conversion optimization |
| **MKT** | Marketing | GE | Brand positioning, customer acquisition, marketing ROI |
| **CXP** | Customer Experience | GE | Customer satisfaction, retention, loyalty drivers |
| **OPS** | Operations | PH | Operational efficiency, process optimization, scalability |
| **FIN** | Finance | PH | Financial health, cash flow, profitability, unit economics |
| **HRS** | Human Resources | PL | Talent acquisition, retention, culture, engagement |
| **LDG** | Leadership | PL | Leadership effectiveness, decision-making, accountability |
| **TIN** | Tech & Innovation | PL | Technology stack, innovation processes, digital transformation |
| **IDS** | Intellectual Defense Systems | RS | IP protection, knowledge management, competitive moats |
| **RMS** | Risk Management System | RS | Risk identification, assessment, mitigation, monitoring |
| **CMP** | Compliance | RS | Legal compliance, regulatory adherence, ethical standards |

---

**Happy Analyzing!**

*Enterprise-Grade Business Intelligence • Powered by Claude Opus 4.5*

*For complete technical details, see [CODEBASE_ANALYSIS.md](./CODEBASE_ANALYSIS.md)*
