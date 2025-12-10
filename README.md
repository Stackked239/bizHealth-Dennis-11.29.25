# BizHealth Report Pipeline

A comprehensive multi-phase business health assessment system that analyzes companies and generates 17 different types of business health reports using AI-powered analysis.

---

## Table of Contents

- [Overview](#overview)
- [What Problem Does This Solve?](#what-problem-does-this-solve)
- [Who Is This For?](#who-is-this-for)
- [High-Level Architecture](#high-level-architecture)
- [Pipeline Phases](#pipeline-phases)
  - [Phase 0: Raw Data Capture](#phase-0-raw-data-capture)
  - [Phase 1: Initial Analysis](#phase-1-initial-analysis-tier-1--tier-2)
  - [Phase 2: Deep-Dive Cross-Analysis](#phase-2-deep-dive-cross-analysis)
  - [Phase 3: Executive Synthesis](#phase-3-executive-synthesis)
  - [Phase 4: IDM Consolidation](#phase-4-idm-integrated-diagnostic-model-consolidation)
  - [Phase 5: Report Generation](#phase-5-report-generation)
- [Generated Reports](#generated-reports)
- [Data Flow Diagram](#data-flow-diagram)
- [Technical Architecture](#technical-architecture)
- [Installation & Setup](#installation--setup)
- [Running the Pipeline](#running-the-pipeline)
- [Output Structure](#output-structure)
- [Key Features](#key-features)
- [Recent Fixes](#recent-fixes-december-10-2025)
- [Troubleshooting](#troubleshooting)
- [Development](#development)
- [Performance Metrics](#performance-metrics)
- [API Usage](#api-usage)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

The **BizHealth Report Pipeline** is a sophisticated business intelligence system that transforms raw company data from questionnaire submissions into comprehensive, actionable business health reports. The pipeline leverages Claude AI (Anthropic) for deep analytical insights across multiple business dimensions.

### What It Does

1. Accepts webhook JSON payloads containing company data and questionnaire responses
2. Processes data through 6 distinct phases of analysis and transformation
3. Generates 17 different HTML reports tailored for different audiences (executives, managers, employees)
4. Provides actionable insights, risk assessments, quick wins, and 18-month roadmaps

### Key Statistics

- **17 Report Types**: From executive summaries to department-specific manager reports
- **6 Processing Phases**: 0 through 5, with selective execution capability
- **10 Dimensional Analyses**: Comprehensive business evaluation across all functions
- **74+ SVG Visualizations**: Rich visual components in comprehensive report
- **~60-90 Minutes**: End-to-end pipeline execution time
- **~3MB Total Output**: All reports and metadata combined

---

## What Problem Does This Solve?

Business owners and executives face several challenges when assessing their company's health:

1. **Fragmented Information**: Business data exists in silos across departments
2. **Lack of Benchmarking**: No context for whether metrics are good or concerning
3. **Analysis Paralysis**: Too much data, not enough actionable insights
4. **Communication Gaps**: Different stakeholders need different levels of detail
5. **Strategic Blindspots**: Missing connections between different business areas

The BizHealth Pipeline solves these by:

- Consolidating all business data into a unified assessment
- Providing AI-powered analysis across 10+ business dimensions
- Generating role-specific reports (owner vs manager vs employee)
- Identifying quick wins, risks, and strategic opportunities
- Creating actionable 18-month improvement roadmaps

---

## Who Is This For?

### Primary Users

1. **Business Owners**: Comprehensive health assessment with strategic recommendations
2. **C-Suite Executives**: High-level summaries with actionable insights
3. **Department Managers**: Role-specific reports (Sales, Operations, Finance, IT, Strategy)
4. **Employees**: Transparent company health overview
5. **Business Consultants**: Diagnostic tool for client assessments
6. **Investors/Advisors**: Due diligence and health monitoring

### Use Cases

- Annual business health assessments
- Pre-sale company valuations
- Strategic planning sessions
- Investor due diligence
- Identifying operational improvement opportunities
- Leadership team alignment
- Employee transparency initiatives

---

## High-Level Architecture

```
┌─────────────────┐
│  Webhook JSON   │  (Company data + questionnaire responses)
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BIZHEALTH PIPELINE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Phase 0: Raw Data Capture & Normalization                     │
│  └─► Output: phase0_output.json (~95K)                         │
│                                                                 │
│  Phase 1: Initial Analysis (Batch API - Tier 1 & 2)            │
│  └─► Output: phase1_output.json (~458K)                        │
│                                                                 │
│  Phase 2: Deep-Dive Cross-Analysis                             │
│  └─► Output: phase2_output.json (~416K)                        │
│                                                                 │
│  Phase 3: Executive Synthesis (Batch API - Async)              │
│  └─► Output: phase3_output.json (~550K)                        │
│                                                                 │
│  Phase 4: IDM Consolidation (Integrated Diagnostic Model)      │
│  └─► Output: idm_output.json (~63K) - "Source of Truth"       │
│                                                                 │
│  Phase 5: Report Generation                                    │
│  └─► Output: 17 HTML Reports (~3MB total)                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   17 BUSINESS HEALTH REPORTS                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Executive Reports (3):                                         │
│  • comprehensive.html        (~946K) - Complete assessment     │
│  • owner.html               (~202K) - Owner executive summary  │
│  • executiveBrief.html      (~117K) - Quick executive snapshot │
│                                                                 │
│  Focused Analysis (4):                                          │
│  • quickWins.html            (~92K) - Immediate opportunities  │
│  • risk.html                 (~90K) - Risk assessment          │
│  • roadmap.html              (~98K) - 18-month roadmap         │
│  • financial.html            (~93K) - Financial impact         │
│                                                                 │
│  Deep Dives (4 Chapters):                                       │
│  • deep-dive-ge.html        (~119K) - Growth Engine            │
│  • deep-dive-ph.html        (~102K) - Performance & Health     │
│  • deep-dive-pl.html        (~102K) - People & Leadership      │
│  • deep-dive-rs.html        (~116K) - Resilience & Safeguards  │
│                                                                 │
│  Manager Reports (5 Departments):                               │
│  • managersOperations.html  (~141K) - Operations manager       │
│  • managersSalesMarketing.html (~170K) - Sales & Marketing     │
│  • managersFinancials.html  (~150K) - Financial manager        │
│  • managersStrategy.html    (~163K) - Strategy & Leadership    │
│  • managersItTechnology.html (~180K) - IT & Technology         │
│                                                                 │
│  Employee Report (1):                                           │
│  • employees.html            (~86K) - Employee-facing summary  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Pipeline Phases

### Phase 0: Raw Data Capture

**Purpose**: Normalize and validate incoming webhook data

**Input**: `sample_webhook.json` (or any webhook payload)
- Company overview (name, location, industry, size)
- Questionnaire responses (strategy, sales, marketing, operations, financials, HR, leadership, technology, IT, risk, compliance)
- Competitor information
- Product/service breakdown

**Processing**:
- Data validation using Zod schemas
- Field normalization (dates, numbers, enums)
- Company profile generation
- Questionnaire response structuring
- Benchmark data preparation

**Output**: `phase0_output.json` (~95K)
- Normalized company profile
- Structured questionnaire responses
- Assessment run ID (UUID)
- Validation status

**Duration**: <1 second
**API Calls**: 0 (no AI processing)

**Located in**: `src/orchestration/phase0-orchestrator.ts`

---

### Phase 1: Initial Analysis (Tier 1 & Tier 2)

**Purpose**: Generate 10 foundational dimensional analyses using AI

**Input**: Phase 0 output (company profile + questionnaire responses + benchmarks)

**Processing**:
Two-tier batch execution via Anthropic Batch API:

**Tier 1 (5 Foundational Analyses)**:
1. **Revenue Engine**: Sales pipeline, customer acquisition, revenue growth
2. **Operational Excellence**: Process efficiency, workflow optimization
3. **Financial Strategic**: Financial health, cash flow, profitability
4. **People Leadership**: HR infrastructure, culture, employee engagement
5. **Compliance Sustainability**: Risk management, regulatory compliance

**Tier 2 (5 Interconnection Analyses)** (depends on Tier 1):
6. **Growth Readiness**: Scalability and expansion capability
7. **Market Position**: Competitive positioning and differentiation
8. **Resource Optimization**: Asset utilization and efficiency
9. **Risk Resilience**: Business continuity and threat mitigation
10. **Scalability Readiness**: Infrastructure and capacity planning

**Batch API Strategy**:
- Tier 1: All 5 analyses submitted as single batch
- Wait for Tier 1 completion
- Tier 2: All 5 analyses submitted as second batch (includes Tier 1 results as context)
- Polling interval: 30 seconds (configurable)
- Cost-effective processing (50% cost reduction vs real-time API)

**Output**: `phase1_output.json` (~458K)
- 10 complete analyses with scores, findings, recommendations
- Token usage metadata
- Execution timing
- Batch IDs for traceability

**Duration**: 10-15 minutes
**API Calls**: 10 (via 2 batch submissions)

**Located in**: `src/orchestration/phase1-orchestrator.ts`

---

### Phase 2: Deep-Dive Cross-Analysis

**Purpose**: Generate 5 cross-dimensional strategic analyses

**Input**: Phase 0 + Phase 1 outputs

**Processing**:
Five comprehensive cross-analyses that synthesize multiple Phase 1 dimensions:

1. **Strategic Assessment**: Overall strategy evaluation (combines market position, growth readiness)
2. **Growth Engine Analysis**: Revenue and market expansion (combines revenue engine, market position)
3. **Performance & Health**: Operational and financial performance (combines operational excellence, financial strategic)
4. **People & Leadership**: Human capital and culture (combines people leadership, cultural dynamics)
5. **Resilience & Safeguards**: Risk management and business continuity (combines risk resilience, compliance)

**API Strategy**: Real-time Claude API calls (5 sequential analyses)

**Output**: `phase2_output.json` (~416K)
- 5 cross-dimensional analyses
- Strategic findings and recommendations
- Chapter-level scores and summaries

**Duration**: 5-10 minutes
**API Calls**: 5 (sequential real-time)

**Located in**: `src/orchestration/phase2-orchestrator.ts`

---

### Phase 3: Executive Synthesis

**Purpose**: Generate executive-level syntheses and strategic recommendations

**Input**: Phase 0-2 outputs (complete analysis context)

**Processing**:
Five executive-level syntheses via Anthropic Batch API (asynchronous):

1. **Executive Summary**: High-level business health overview
2. **Scorecard**: Dimensional scores and health indicators
3. **Action Matrix**: Prioritized improvement recommendations
4. **Investment Roadmap**: Strategic investment priorities
5. **Final Recommendations**: Consolidated actionable guidance

**Batch API Strategy**:
- All 5 syntheses submitted as single batch
- Asynchronous processing with polling
- Poll interval: 30 seconds (configurable)
- Includes complete context from all previous phases

**Output**: `phase3_output.json` (~550K)
- Executive summary and overall health score
- Detailed scorecard with dimensional ratings
- Prioritized action matrix
- 18-month investment roadmap
- Final strategic recommendations

**Duration**: 30-60 minutes (async batch processing)
**API Calls**: 5 (via 1 batch submission)

**Located in**: `src/orchestration/phase3-orchestrator.ts`

**Special Note**: If batch takes too long, use the batch result retrieval script:
```bash
node --import tsx scripts/retrieve-phase3-batch.ts <batch_id>
```

---

### Phase 4: IDM (Integrated Diagnostic Model) Consolidation

**Purpose**: Consolidate all analysis outputs into unified "source of truth" model

**Input**: Phase 0-3 outputs (all raw analyses)

**Processing**:
- Aggregates findings from all 10 Phase 1 analyses
- Integrates insights from 5 Phase 2 cross-analyses
- Incorporates executive syntheses from Phase 3
- Calculates overall health score (0-100)
- Generates health descriptor (Critical, Concerning, Stable, Healthy, Thriving)
- Consolidates quick wins, risks, and roadmap items
- Creates unified recommendation set

**IDM Structure**:
```json
{
  "scores_summary": {
    "overall_health_score": 72,
    "descriptor": "Healthy",
    "chapter_scores": { /* 4 chapter scores */ }
  },
  "dimensions": { /* 10 dimensional analyses */ },
  "chapters": { /* 4 chapter deep-dives */ },
  "findings": { /* Consolidated findings */ },
  "recommendations": { /* Actionable recommendations */ },
  "quick_wins": [ /* Immediate opportunities */ ],
  "risks": [ /* Risk assessments */ ],
  "roadmap": { /* 18-month implementation plan */ }
}
```

**Output**: `idm_output.json` (~63K)
- Unified diagnostic model
- Overall health score and descriptor
- Chapter scores (Growth Engine, Performance & Health, People & Leadership, Resilience & Safeguards)
- Consolidated findings, recommendations, quick wins, risks
- Complete 18-month roadmap

**Duration**: <1 second
**API Calls**: 0 (pure data consolidation)

**Located in**: `src/orchestration/phase4-orchestrator.ts`

**Important**: The IDM is the **single source of truth** for all Phase 5 reports. No report should be generated without a valid IDM.

---

### Phase 5: Report Generation

**Purpose**: Generate 17 HTML business health reports for different audiences

**Input**:
- `idm_output.json` (primary source)
- Phase 0-3 outputs (for additional narrative content)
- Run ID (for organizing reports)

**Processing**:
Generates 17 distinct HTML reports with:
- Custom styling and branding
- SVG visualizations (charts, gauges, diagrams)
- Narrative content from all phases
- Audience-specific tone and depth
- Legal disclaimers (owner report)
- Interactive elements

**Report Generation Strategy**:
- Sequential generation (one report at a time)
- Template-based HTML construction
- Component-based architecture
- Extensive AI-generated narrative sections
- Metadata generation for each report
- Manifest file creation

**Output**: 17 HTML files + metadata
- Reports directory: `output/reports/[run-id]/`
- Individual HTML files (see [Generated Reports](#generated-reports) section)
- `.meta.json` files for each report (metadata)
- `manifest.json` (inventory of all generated reports)

**Output Size**: ~3MB total for all reports

**Duration**: 3-5 minutes
**API Calls**: Extensive (varies by report content generation needs)

**Located in**: `src/orchestration/phase5-orchestrator.ts`

**Report Builders**: `src/orchestration/reports/*-report.builder.ts`

---

## Generated Reports

All 17 report types with descriptions, sizes, and target audiences:

### Executive Reports (3 reports)

#### 1. Comprehensive Report (`comprehensive.html`)
- **Size**: ~946K
- **Visualizations**: 74+ SVG charts, gauges, diagrams
- **Audience**: C-suite executives, board members, investors
- **Purpose**: Complete business health assessment with all dimensions, findings, and recommendations
- **Contents**:
  - Executive summary
  - Overall health score and descriptor
  - 4 chapter deep-dives (Growth Engine, Performance & Health, People & Leadership, Resilience & Safeguards)
  - 10 dimensional analyses
  - Visual scorecards
  - Comprehensive recommendations
  - 18-month roadmap
  - Quick wins and risk assessments

#### 2. Owner Report (`owner.html`)
- **Size**: ~202K
- **Audience**: Business owners, primary stakeholders
- **Purpose**: Executive summary with strategic guidance and legal context
- **Contents**:
  - Business health snapshot
  - Key findings and insights
  - Strategic recommendations
  - Investment priorities
  - Legal disclaimers and usage terms
  - Confidentiality notices

#### 3. Executive Brief (`executiveBrief.html`)
- **Size**: ~117K
- **Audience**: Time-constrained executives
- **Purpose**: High-level health snapshot for quick review
- **Contents**:
  - One-page summary
  - Overall health score
  - Top 5 findings
  - Critical risks
  - Top 3 quick wins
  - Key metrics

---

### Focused Analysis Reports (4 reports)

#### 4. Quick Wins Report (`quickWins.html`)
- **Size**: ~92K
- **Audience**: Leadership team, operations managers
- **Purpose**: Identify and prioritize immediate high-impact opportunities
- **Contents**:
  - Quick win opportunities (by effort and impact)
  - Implementation guidelines
  - Expected ROI
  - Resource requirements
  - Timeline estimates
  - Success metrics

#### 5. Risk Report (`risk.html`)
- **Size**: ~90K
- **Audience**: Risk managers, executives, board members
- **Purpose**: Comprehensive risk assessment and mitigation strategies
- **Contents**:
  - Risk inventory (categorized by severity)
  - Threat likelihood and impact analysis
  - Mitigation recommendations
  - Contingency planning
  - Risk monitoring framework
  - Early warning indicators

#### 6. Roadmap Report (`roadmap.html`)
- **Size**: ~98K
- **Audience**: Strategic planning teams, executives
- **Purpose**: 18-month strategic implementation roadmap
- **Contents**:
  - Quarterly milestone breakdown
  - Initiative prioritization
  - Resource allocation guidance
  - Dependencies and sequencing
  - Success metrics per phase
  - Adjustment triggers

#### 7. Financial Impact Report (`financial.html`)
- **Size**: ~93K
- **Audience**: CFOs, financial managers, investors
- **Purpose**: Financial health analysis and investment recommendations
- **Contents**:
  - Financial health score
  - Cash flow analysis
  - Profitability assessment
  - Investment priorities (by ROI)
  - Cost optimization opportunities
  - Financial risk factors
  - Growth funding requirements

---

### Deep-Dive Chapter Reports (4 reports)

#### 8. Deep-Dive: Growth Engine (`deep-dive-ge.html`)
- **Size**: ~119K
- **Audience**: Sales, marketing, and business development leaders
- **Purpose**: Comprehensive analysis of revenue generation and market expansion
- **Contents**:
  - Revenue engine analysis
  - Sales pipeline effectiveness
  - Customer acquisition strategy
  - Market positioning
  - Competitive differentiation
  - Growth opportunities
  - Expansion readiness

#### 9. Deep-Dive: Performance & Health (`deep-dive-ph.html`)
- **Size**: ~102K
- **Audience**: COOs, operations managers, financial leaders
- **Purpose**: Operational efficiency and financial performance analysis
- **Contents**:
  - Operational excellence assessment
  - Process efficiency metrics
  - Financial performance indicators
  - Resource utilization
  - Workflow optimization
  - Cost management
  - Performance benchmarking

#### 10. Deep-Dive: People & Leadership (`deep-dive-pl.html`)
- **Size**: ~102K
- **Audience**: HR leaders, executives, culture champions
- **Purpose**: Human capital and organizational culture analysis
- **Contents**:
  - Leadership effectiveness
  - Company culture assessment
  - Employee engagement
  - HR infrastructure
  - Talent acquisition and retention
  - Performance management
  - Development and mentorship
  - Succession planning

#### 11. Deep-Dive: Resilience & Safeguards (`deep-dive-rs.html`)
- **Size**: ~116K
- **Audience**: Risk managers, compliance officers, executives
- **Purpose**: Business continuity and risk management analysis
- **Contents**:
  - Risk management framework
  - Compliance status
  - Business continuity planning
  - Cybersecurity posture
  - Operational resilience
  - Regulatory compliance
  - Crisis management preparedness

---

### Manager Reports (5 department-specific reports)

#### 12. Operations Manager Report (`managersOperations.html`)
- **Size**: ~141K
- **Audience**: Operations managers, process owners
- **Purpose**: Operational efficiency and process improvement guidance
- **Contents**:
  - Operational health score
  - Process efficiency analysis
  - Workflow optimization opportunities
  - Resource utilization
  - Quality management
  - Operations-specific recommendations
  - Department-level metrics

#### 13. Sales & Marketing Manager Report (`managersSalesMarketing.html`)
- **Size**: ~170K
- **Audience**: Sales and marketing managers
- **Purpose**: Revenue generation and market positioning guidance
- **Contents**:
  - Sales pipeline analysis
  - Marketing effectiveness
  - Customer acquisition metrics
  - Brand positioning
  - Market opportunities
  - Campaign performance
  - Lead generation strategies
  - Sales-marketing alignment

#### 14. Financial Manager Report (`managersFinancials.html`)
- **Size**: ~150K
- **Audience**: Financial managers, controllers
- **Purpose**: Financial management and planning guidance
- **Contents**:
  - Financial health indicators
  - Cash flow management
  - Budgeting and forecasting
  - Cost control opportunities
  - Profitability analysis
  - Working capital optimization
  - Financial planning recommendations

#### 15. Strategy & Leadership Manager Report (`managersStrategy.html`)
- **Size**: ~163K
- **Audience**: Strategic planning leads, senior managers
- **Purpose**: Strategic direction and leadership development guidance
- **Contents**:
  - Strategic positioning
  - Competitive analysis
  - Growth opportunities
  - Leadership effectiveness
  - Decision-making structure
  - Strategic planning framework
  - Organizational development

#### 16. IT & Technology Manager Report (`managersItTechnology.html`)
- **Size**: ~180K
- **Audience**: IT managers, CTOs, technology leads
- **Purpose**: Technology infrastructure and innovation guidance
- **Contents**:
  - IT infrastructure assessment
  - Technology investment analysis
  - Cybersecurity posture
  - Innovation pipeline
  - Digital transformation opportunities
  - Automation potential
  - Technology roadmap
  - IT operations efficiency

---

### Employee Report (1 report)

#### 17. Employee Report (`employees.html`)
- **Size**: ~86K
- **Audience**: All employees
- **Purpose**: Transparent company health overview appropriate for general staff
- **Contents**:
  - Company health summary (high-level)
  - Strategic direction
  - Culture and values
  - Employee-relevant initiatives
  - Professional development opportunities
  - Company stability indicators
  - Simplified metrics and visualizations
  - Positive messaging focus

---

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         INPUT: WEBHOOK JSON                               │
│  • Company Overview      • Financials          • Technology               │
│  • Strategy              • Human Resources     • IT Infrastructure        │
│  • Sales                 • Leadership          • Risk Management          │
│  • Marketing             • Operations          • Compliance               │
│  • Customer Experience   • Competitors         • Products/Services        │
└────────────────────────────────┬─────────────────────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │     PHASE 0 (0s)       │
                    │  Raw Data Capture      │
                    │  • Normalize           │
                    │  • Validate            │
                    │  • Structure           │
                    └───────────┬────────────┘
                                │ phase0_output.json (95K)
                                ▼
                    ┌────────────────────────┐
                    │   PHASE 1 (10-15min)   │
                    │  Batch API - Tier 1→2  │
                    │  • 5 foundational      │
                    │  • 5 interconnection   │
                    └───────────┬────────────┘
                                │ phase1_output.json (458K)
                                ▼
                    ┌────────────────────────┐
                    │   PHASE 2 (5-10min)    │
                    │  Cross-Analysis        │
                    │  • 5 strategic themes  │
                    └───────────┬────────────┘
                                │ phase2_output.json (416K)
                                ▼
                    ┌────────────────────────┐
                    │   PHASE 3 (30-60min)   │
                    │  Batch API - Async     │
                    │  • Executive synthesis │
                    └───────────┬────────────┘
                                │ phase3_output.json (550K)
                                ▼
                    ┌────────────────────────┐
                    │     PHASE 4 (0s)       │
                    │  IDM Consolidation     │
                    │  • Single source       │
                    │  • Overall score       │
                    └───────────┬────────────┘
                                │ idm_output.json (63K)
                                │ ⚡ "SOURCE OF TRUTH"
                                ▼
                    ┌────────────────────────┐
                    │   PHASE 5 (3-5min)     │
                    │  Report Generation     │
                    │  • 17 HTML reports     │
                    └───────────┬────────────┘
                                │
                ┌───────────────┼───────────────┐
                ▼               ▼               ▼
         ┌──────────┐    ┌──────────┐   ┌──────────┐
         │Executive │    │ Focused  │   │ Managers │
         │ Reports  │    │ Analysis │   │ Reports  │
         │   (3)    │    │   (4)    │   │   (5)    │
         └──────────┘    └──────────┘   └──────────┘
                ▼               ▼               ▼
         ┌──────────┐    ┌──────────┐   ┌──────────┐
         │Deep-Dive │    │ Employee │   │          │
         │ Reports  │    │  Report  │   │          │
         │   (4)    │    │   (1)    │   │          │
         └──────────┘    └──────────┘   └──────────┘
                                │
                                ▼
                ┌───────────────────────────────┐
                │   17 BUSINESS HEALTH REPORTS  │
                │         (~3MB Total)           │
                └───────────────────────────────┘
```

---

## Technical Architecture

### Tech Stack

**Core Runtime**:
- **Node.js** 18+ with native ES modules
- **TypeScript** 5.3+ for type safety
- **tsx** 4.7+ for runtime execution (esbuild-based)

**AI/ML**:
- **Anthropic Claude API** (claude-opus-4-20250514)
- **Batch API** for cost-effective processing (Phases 1 & 3)
- **Real-time API** for streaming analyses (Phase 2)

**Data Processing**:
- **Zod** 3.25+ for schema validation
- **UUID** 9.0+ for unique identifiers
- **Marked** 17.0+ for Markdown processing

**Logging & Monitoring**:
- **Pino** 8.16+ for structured logging
- **Pino-pretty** 10.2+ for development logs

**Visualization** (report generation):
- **Canvas** 2.11+ for server-side rendering
- **Chart.js** 4.4+ for charts
- **chartjs-node-canvas** 4.1+ for Node.js integration

**Storage**:
- **File-based**: All outputs stored as JSON/HTML files
- **Optional PostgreSQL**: For persistence (not required)

**Development**:
- **Vitest** 1.1+ for testing
- **ESLint** 8.56+ for linting
- **Prettier** 3.1+ for formatting

### Key Files & Directories

```
workflow-export/
├── src/
│   ├── run-pipeline.ts              # Main pipeline orchestrator
│   ├── orchestration/
│   │   ├── phase0-orchestrator.ts   # Phase 0 executor
│   │   ├── phase1-orchestrator.ts   # Phase 1 executor (Batch API)
│   │   ├── phase2-orchestrator.ts   # Phase 2 executor
│   │   ├── phase3-orchestrator.ts   # Phase 3 executor (Batch API)
│   │   ├── phase4-orchestrator.ts   # Phase 4 executor (IDM)
│   │   ├── phase5-orchestrator.ts   # Phase 5 executor (Reports)
│   │   └── reports/
│   │       ├── comprehensive-report.builder.ts
│   │       ├── owners-report.builder.ts
│   │       ├── executive-brief.builder.ts
│   │       ├── quick-wins-report.builder.ts
│   │       ├── risk-report.builder.ts
│   │       ├── roadmap-report.builder.ts
│   │       ├── financial-report.builder.ts
│   │       ├── deep-dive-report.builder.ts
│   │       ├── manager-report.builder.ts
│   │       └── utils/              # Report generation utilities
│   ├── api/
│   │   └── anthropic-client.ts     # Claude API integration
│   ├── data-transformation/
│   │   ├── company-profile-transformer.ts
│   │   ├── questionnaire-transformer.ts
│   │   └── benchmark-service.ts
│   ├── types/                      # TypeScript type definitions
│   └── utils/                      # Shared utilities
├── output/
│   ├── phase0_output.json          # Phase outputs
│   ├── phase1_output.json
│   ├── phase2_output.json
│   ├── phase3_output.json
│   ├── idm_output.json            # Consolidated model
│   ├── phase5_output.json         # Report metadata
│   └── reports/
│       └── [uuid]/                # Report session directory
│           ├── comprehensive.html
│           ├── owner.html
│           ├── executiveBrief.html
│           ├── quickWins.html
│           ├── risk.html
│           ├── roadmap.html
│           ├── financial.html
│           ├── deep-dive-*.html   (4 files)
│           ├── managers*.html     (5 files)
│           ├── employees.html
│           ├── *.meta.json        (17 metadata files)
│           └── manifest.json      # Report inventory
├── scripts/
│   └── retrieve-phase3-batch.ts   # Batch result retrieval
├── sample_webhook.json            # Example input
├── package.json
├── tsconfig.json
└── README.md                      # This file
```

---

## Installation & Setup

### Prerequisites

- **Node.js** 18 or higher
- **npm** or **yarn** package manager
- **Anthropic API Key** (for Phases 1-5)

### Step 1: Install Dependencies

```bash
cd workflow-export
npm install
```

### Step 2: Configure Environment

Create a `.env` file in the project root:

```bash
# Required for Phase 1-5
ANTHROPIC_API_KEY=sk-ant-your-api-key-here

# Optional: PostgreSQL connection (not required for file-based operation)
# DATABASE_URL=postgresql://user:password@localhost:5432/bizhealth

# Optional: Claude model selection (default: claude-opus-4-20250514)
# DEFAULT_MODEL=claude-opus-4-20250514

# Optional: Batch API polling interval in milliseconds (default: 30000)
# BATCH_POLL_INTERVAL_MS=30000

# Optional: Logging level (default: info)
# LOG_LEVEL=info

# Optional: Enable PDF rendering (default: false)
# RENDER_PDF=true
```

### Step 3: Verify Installation

Test with Phase 0 only (no API key required):

```bash
node --import tsx src/run-pipeline.ts sample_webhook.json --phase=0 --skip-db
```

Expected output: `phase0_output.json` in the `output/` directory.

---

## Running the Pipeline

### Basic Usage

Run the complete pipeline (Phases 0-5):

```bash
node --import tsx src/run-pipeline.ts sample_webhook.json --skip-db
```

### Phase-Specific Execution

Run a single phase:

```bash
# Phase 0 only (no API key required)
node --import tsx src/run-pipeline.ts sample_webhook.json --phase=0 --skip-db

# Phase 5 only (requires previous phases)
node --import tsx src/run-pipeline.ts sample_webhook.json --phase=5 --skip-db
```

Run a range of phases:

```bash
# Phases 0-3 (skip report generation)
node --import tsx src/run-pipeline.ts sample_webhook.json --phase=0-3 --skip-db

# Phases 4-5 (IDM consolidation + report generation)
node --import tsx src/run-pipeline.ts sample_webhook.json --phase=4-5 --skip-db
```

### Advanced Options

Custom webhook file:

```bash
node --import tsx src/run-pipeline.ts /path/to/custom_webhook.json --skip-db
```

Custom output directory:

```bash
node --import tsx src/run-pipeline.ts sample_webhook.json --output-dir=/path/to/output --skip-db
```

Specify company name (for report headers):

```bash
node --import tsx src/run-pipeline.ts sample_webhook.json --company-name="Acme Corp" --skip-db
```

Enable PDF rendering (experimental):

```bash
node --import tsx src/run-pipeline.ts sample_webhook.json --render-pdf --skip-db
```

Specify report types for Phase 5:

```bash
node --import tsx src/run-pipeline.ts sample_webhook.json --phase=5 \
  --phase5-reports=comprehensive,owner,quickWins --skip-db
```

### Phase 5 Sub-Stages

Phase 5 can be broken into 3 sub-stages for debugging:

```bash
# Phase 5A: Generate 8 intermediate artifacts
node --import tsx src/run-pipeline.ts sample_webhook.json --phase=5a --skip-db

# Phase 5B: Extract & transform content
node --import tsx src/run-pipeline.ts sample_webhook.json --phase=5b --skip-db

# Phase 5C: Compose & validate deliverables
node --import tsx src/run-pipeline.ts sample_webhook.json --phase=5c --skip-db
```

### Using NPM Scripts

Convenient npm scripts are available in `package.json`:

```bash
# Run full pipeline
npm run pipeline

# Run with custom webhook
npm run pipeline -- /path/to/webhook.json

# Development mode
npm run dev

# Run tests
npm test

# Run with coverage
npm run test:coverage

# Validate generated reports
npm run validate:reports
```

---

## Output Structure

After a complete pipeline run, the `output/` directory contains:

```
output/
├── phase0_output.json              # ~95K  - Normalized data
├── phase1_output.json              # ~458K - 10 dimensional analyses
├── phase2_output.json              # ~416K - 5 cross-analyses
├── phase3_output.json              # ~550K - Executive synthesis
├── idm_output.json                 # ~63K  - Consolidated model ⭐
├── phase5_output.json              # ~12K  - Report metadata
├── pipeline_summary.json           # ~1K   - Pipeline execution summary
│
└── reports/
    └── [assessment-run-uuid]/      # e.g., 2250d590-bc70-4630-a6e6-f7e6ce0028d5
        │
        ├── comprehensive.html       # ~946K
        ├── owner.html              # ~202K
        ├── executiveBrief.html     # ~117K
        │
        ├── quickWins.html          # ~92K
        ├── risk.html               # ~90K
        ├── roadmap.html            # ~98K
        ├── financial.html          # ~93K
        │
        ├── deep-dive-ge.html       # ~119K
        ├── deep-dive-ph.html       # ~102K
        ├── deep-dive-pl.html       # ~102K
        ├── deep-dive-rs.html       # ~116K
        │
        ├── managersOperations.html      # ~141K
        ├── managersSalesMarketing.html  # ~170K
        ├── managersFinancials.html      # ~150K
        ├── managersStrategy.html        # ~163K
        ├── managersItTechnology.html    # ~180K
        │
        ├── employees.html          # ~86K
        │
        ├── comprehensive.meta.json  # Metadata for each report
        ├── owner.meta.json
        ├── ... (15 more .meta.json files)
        │
        └── manifest.json           # Report inventory
```

### Key Files

**idm_output.json** (⭐ Most Important):
- Single source of truth for all reports
- Contains overall health score (0-100)
- Consolidated findings, recommendations, quick wins, risks, roadmap
- Essential for Phase 5 report generation

**manifest.json**:
- Inventory of all generated reports
- File paths, sizes, timestamps
- Report types and metadata

**pipeline_summary.json**:
- Complete pipeline execution log
- Phase-by-phase timing and status
- Error tracking (if any)
- Configuration used

---

## Key Features

### 1. Batch API Integration
- **Cost Reduction**: 50% cost savings vs real-time API (Phases 1 & 3)
- **Parallel Processing**: Multiple analyses processed simultaneously
- **Asynchronous Execution**: Non-blocking batch submission with polling
- **Automatic Retry**: Built-in error handling and recovery

### 2. Comprehensive Business Analysis
- **10 Dimensional Analyses**: Complete business evaluation across all functions
- **5 Cross-Analyses**: Strategic interconnections between dimensions
- **5 Executive Syntheses**: High-level strategic guidance
- **Benchmark Comparisons**: Industry standards and best practices

### 3. Multi-Audience Reports
- **17 Report Types**: Tailored for executives, managers, employees
- **Audience-Specific Content**: Appropriate depth and tone for each role
- **Department Focus**: Manager reports specific to Sales, Operations, Finance, IT, Strategy
- **Transparent Communication**: Employee-appropriate company health information

### 4. Rich Visualizations
- **74+ SVG Charts**: Comprehensive report visualization suite
- **Custom Gauges**: Health score indicators
- **Trend Diagrams**: Historical performance visualization
- **Comparison Charts**: Benchmark and competitive analysis

### 5. Narrative Integration
- **AI-Generated Content**: Rich narrative sections from all phases
- **Context-Aware Analysis**: Insights based on complete business picture
- **Actionable Recommendations**: Specific, implementable guidance
- **Strategic Roadmap**: 18-month implementation plan

### 6. Type Safety
- **Full TypeScript**: End-to-end type checking
- **Zod Validation**: Runtime schema validation
- **Type Definitions**: Comprehensive type system for all data structures

### 7. Modular Architecture
- **Independent Phases**: Each phase can be run separately
- **Reusable Components**: Shared utilities and builders
- **Flexible Configuration**: Environment-based settings
- **Extensible Design**: Easy to add new report types or analyses

### 8. Developer-Friendly
- **Clear Logging**: Structured logging with Pino
- **Error Handling**: Comprehensive error management
- **Progress Tracking**: Real-time phase execution status
- **Documentation**: Inline comments and type annotations

---

## Recent Fixes (December 10, 2025)

Recent improvements and bug fixes:

### Report Builder Fixes
1. **Duplicate Function Declarations**: Fixed duplicate helper functions in report builders
   - Removed redundant `formatCurrency`, `formatPercentage`, `formatNumber` declarations
   - Consolidated utility functions in `src/orchestration/reports/utils/`

2. **Duplicate Exports**: Fixed duplicate exports in `utils/index.ts`
   - Removed duplicate `escapeHtml` export
   - Cleaned up utility export structure

3. **Comprehensive Report Null Safety**: Fixed null/undefined handling in comprehensive report
   - Added safety checks for missing IDM data
   - Improved error handling for undefined chapter scores
   - Added fallback values for missing narrative content

4. **Phase 3 Batch Retrieval**: Added script for retrieving incomplete Phase 3 batch results
   - `scripts/retrieve-phase3-batch.ts` - retrieves batch results by ID
   - Handles async batch processing delays
   - Usage: `node --import tsx scripts/retrieve-phase3-batch.ts <batch_id>`

### Verification
All 17 reports now generate successfully with complete content:
- ✅ Executive Reports (3)
- ✅ Focused Analysis (4)
- ✅ Deep-Dive Reports (4)
- ✅ Manager Reports (5)
- ✅ Employee Report (1)

### Test Coverage
- Added comprehensive report validation tests
- ASCII visualization validation
- Section mapping tests
- Formatting equivalency tests

---

## Troubleshooting

### Common Issues & Solutions

#### Issue: Phase 3 Batch Not Completing

**Symptom**: Phase 3 hangs or times out waiting for batch completion

**Solution**: Use the batch result retrieval script
```bash
# Find batch ID in phase3_output.json or logs
node --import tsx scripts/retrieve-phase3-batch.ts msgbatch_01ABC123XYZ
```

**Prevention**: Increase `BATCH_POLL_INTERVAL_MS` in `.env` to reduce API load

---

#### Issue: Missing IDM Output

**Symptom**: Phase 5 fails with "IDM output not found"

**Solution**:
1. Check if `output/idm_output.json` exists
2. If missing, run Phase 4 first:
   ```bash
   node --import tsx src/run-pipeline.ts --phase=4 --skip-db
   ```
3. Verify Phase 0-3 outputs exist before running Phase 4

---

#### Issue: API Rate Limits

**Symptom**: API calls failing with 429 errors

**Solution**:
1. Use Batch API (Phases 1 & 3 already do this)
2. Increase polling interval:
   ```bash
   BATCH_POLL_INTERVAL_MS=60000 node --import tsx src/run-pipeline.ts
   ```
3. Run phases separately with delays between them

---

#### Issue: Compilation Errors

**Symptom**: TypeScript or syntax errors

**Solution**:
1. Check for duplicate function declarations in report builders
2. Verify all imports are correct
3. Run TypeScript compiler:
   ```bash
   npm run build
   ```
4. Check for missing dependencies:
   ```bash
   npm install
   ```

---

#### Issue: Missing Reports

**Symptom**: Not all 17 reports are generated

**Solution**:
1. Verify Phase 4 IDM exists and is valid
2. Check Phase 5 logs for specific report errors
3. Run Phase 5 with verbose logging:
   ```bash
   LOG_LEVEL=debug node --import tsx src/run-pipeline.ts --phase=5 --skip-db
   ```
4. Verify all required Phase 0-3 outputs exist

---

#### Issue: "ANTHROPIC_API_KEY not found"

**Symptom**: Pipeline fails to start Phases 1-5

**Solution**:
1. Create `.env` file in project root
2. Add your API key:
   ```
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```
3. Verify `.env` file is loaded:
   ```bash
   echo $ANTHROPIC_API_KEY
   ```
4. Run Phase 0 only if you don't have an API key:
   ```bash
   node --import tsx src/run-pipeline.ts --phase=0 --skip-db
   ```

---

#### Issue: Large Output Files

**Symptom**: Output directory consuming too much disk space

**Solution**:
1. Clean old report sessions:
   ```bash
   rm -rf output/reports/[old-uuid]
   ```
2. Keep only essential files:
   ```bash
   # Keep only IDM and latest reports
   rm output/phase*.json
   ```
3. Archive completed assessments:
   ```bash
   tar -czf assessment-2025-12-10.tar.gz output/
   ```

---

## Development

### Project Structure

```
src/
├── orchestration/           # Phase orchestrators
│   ├── phase*-orchestrator.ts
│   └── reports/            # Report builders
│       ├── *-report.builder.ts
│       ├── components/     # Reusable report components
│       ├── utils/          # Report generation utilities
│       └── config/         # Report configuration
├── api/                    # External API clients
├── data-transformation/    # Data transformers
├── types/                  # TypeScript definitions
└── utils/                  # Shared utilities
```

### Adding a New Report Type

1. **Create Report Builder**:
   ```typescript
   // src/orchestration/reports/my-new-report.builder.ts
   import { ReportContext } from './types/report-context.js';

   export async function buildMyNewReport(context: ReportContext): Promise<string> {
     // Generate HTML report
     return htmlContent;
   }
   ```

2. **Add to Phase 5 Orchestrator**:
   ```typescript
   // src/orchestration/phase5-orchestrator.ts
   import { buildMyNewReport } from './reports/my-new-report.builder.js';

   // Add to report builders map
   const builders = {
     // ... existing builders
     'myNewReport': buildMyNewReport,
   };
   ```

3. **Update Types**:
   ```typescript
   // src/types/report.types.ts
   export type Phase5ReportType =
     | 'comprehensive'
     | 'owner'
     // ... existing types
     | 'myNewReport';
   ```

### Running Tests

```bash
# All tests
npm test

# With coverage
npm run test:coverage

# Specific test file
npm test src/orchestration/reports/__tests__/report-validation.test.ts

# Watch mode
npm test -- --watch
```

### Linting & Formatting

```bash
# Lint
npm run lint

# Format code
npm run format

# Fix lint errors
npm run lint -- --fix
```

### Report Validation

```bash
# Validate generated reports
npm run validate:reports

# Validate ASCII visualizations
npm run validate:ascii

# Full validation suite
npm run validate:all
```

---

## Performance Metrics

### Execution Time (by Phase)

| Phase | Duration | Processing Type | Bottleneck |
|-------|----------|----------------|------------|
| Phase 0 | <1 second | Synchronous | Data validation |
| Phase 1 | 10-15 minutes | Batch API | AI processing (10 analyses) |
| Phase 2 | 5-10 minutes | Real-time API | AI processing (5 analyses) |
| Phase 3 | 30-60 minutes | Batch API (async) | AI processing (5 syntheses) |
| Phase 4 | <1 second | Synchronous | Data consolidation |
| Phase 5 | 3-5 minutes | Real-time API | Report HTML generation |
| **Total** | **60-90 minutes** | **Mixed** | **Phase 3 batch processing** |

### Optimization Tips

1. **Parallel Execution**: Phase 1 & 3 use batch API for parallel processing
2. **Incremental Runs**: Run phases separately to avoid full pipeline reruns
3. **Cached Results**: Reuse Phase 0-3 outputs when regenerating reports (Phase 5 only)
4. **Batch Polling**: Increase `BATCH_POLL_INTERVAL_MS` to reduce API load (but increases wait time)

### Resource Usage

- **Memory**: ~500MB peak during Phase 5 (report generation)
- **Disk**: ~3MB per complete assessment (all reports + phase outputs)
- **Network**: ~20+ API calls per full pipeline run

---

## API Usage

### Anthropic API Calls

| Phase | API Calls | Call Type | Cost Optimization |
|-------|-----------|-----------|-------------------|
| Phase 0 | 0 | N/A | No API usage |
| Phase 1 | 10 | Batch API | 50% cost reduction |
| Phase 2 | 5 | Real-time | Standard pricing |
| Phase 3 | 5 | Batch API (async) | 50% cost reduction |
| Phase 4 | 0 | N/A | No API usage |
| Phase 5 | Variable | Real-time | Depends on report narrative generation |
| **Total** | **20+** | **Mixed** | **~35% overall savings** |

### Token Usage (Approximate)

- **Phase 1**: ~200K input tokens, ~500K output tokens (10 analyses)
- **Phase 2**: ~100K input tokens, ~250K output tokens (5 analyses)
- **Phase 3**: ~150K input tokens, ~350K output tokens (5 syntheses)
- **Phase 5**: ~50K input tokens, ~200K output tokens (narrative generation)

**Total**: ~500K input tokens, ~1.3M output tokens per full pipeline run

### Cost Estimate (as of December 2025)

Using claude-opus-4-20250514 pricing:
- Input: $15 per million tokens
- Output: $75 per million tokens

**Per Full Pipeline Run**:
- Input cost: ~$7.50
- Output cost: ~$97.50
- **Total: ~$105 per assessment**

**With Batch API Optimization**:
- Batch API: 50% discount on Phases 1 & 3
- Actual cost: **~$70 per assessment**

---

## Contributing

### Guidelines

1. **Code Style**: Follow existing TypeScript patterns
2. **Type Safety**: All functions must have explicit return types
3. **Testing**: Add tests for new features
4. **Documentation**: Update README for new functionality
5. **Commits**: Use descriptive commit messages

### Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/my-new-feature

# 2. Make changes
# ... edit files ...

# 3. Run tests
npm test

# 4. Lint and format
npm run lint
npm run format

# 5. Commit changes
git add .
git commit -m "Add: Description of feature"

# 6. Push and create PR
git push origin feature/my-new-feature
```

### Reporting Issues

When reporting issues, include:
- Pipeline command used
- Phase where error occurred
- Error message and stack trace
- Output file sizes (if relevant)
- Environment (Node version, OS)

---

## License

MIT License

Copyright (c) 2025 BizHealth

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## Support

For questions, issues, or support:

1. Check [Troubleshooting](#troubleshooting) section
2. Review [Issues](https://github.com/your-repo/bizhealth/issues) (if using GitHub)
3. Consult inline code documentation
4. Review phase orchestrator files for implementation details

---

## Changelog

### Version 1.0.0 (December 2025)

- Initial release
- Complete pipeline (Phases 0-5)
- 17 report types
- Batch API integration
- IDM consolidation
- TypeScript conversion
- Comprehensive documentation

### Recent Updates (December 10, 2025)

- Fixed duplicate function declarations in report builders
- Fixed duplicate exports in utils/index.ts
- Improved comprehensive report null safety
- Added Phase 3 batch result retrieval script
- All 17 reports now generate successfully
- Enhanced error handling and validation

---

## Appendix

### Sample Webhook Structure

See `sample_webhook.json` for a complete example. Key sections:

```json
{
  "event": "new_questionnaire_response",
  "submission_id": "uuid",
  "business_overview": {
    "company_name": "Company Name",
    "industry": "industry_type",
    "full_time_employees": 85,
    "last_year_revenue": 24000000
  },
  "strategy": { /* strategy questions */ },
  "sales": { /* sales questions */ },
  "marketing": { /* marketing questions */ },
  "customer_experience": { /* CX questions */ },
  "operations": { /* operations questions */ },
  "financials": { /* financial questions */ },
  "human_resources": { /* HR questions */ },
  "leadership": { /* leadership questions */ },
  "technology": { /* technology questions */ },
  "it_infrastructure": { /* IT questions */ },
  "risk_management": { /* risk questions */ },
  "compliance": { /* compliance questions */ }
}
```

### Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ANTHROPIC_API_KEY` | Yes (Phases 1-5) | - | Your Anthropic API key |
| `DATABASE_URL` | No | - | PostgreSQL connection string |
| `DEFAULT_MODEL` | No | `claude-opus-4-20250514` | Claude model to use |
| `BATCH_POLL_INTERVAL_MS` | No | `30000` | Batch API polling interval |
| `LOG_LEVEL` | No | `info` | Logging level (debug, info, warn, error) |
| `RENDER_PDF` | No | `false` | Enable PDF report rendering |

### Health Score Interpretation

| Score Range | Descriptor | Meaning |
|-------------|------------|---------|
| 0-20 | Critical | Urgent intervention required |
| 21-40 | Concerning | Significant issues present |
| 41-60 | Stable | Adequate but room for improvement |
| 61-80 | Healthy | Strong performance with optimization opportunities |
| 81-100 | Thriving | Excellent performance across all dimensions |

### Chapter Breakdown

The 4 main chapters in reports:

1. **Growth Engine**: Revenue generation, market expansion, sales & marketing
2. **Performance & Health**: Operations, financial performance, efficiency
3. **People & Leadership**: HR, culture, leadership effectiveness, talent
4. **Resilience & Safeguards**: Risk management, compliance, business continuity

---

**End of Documentation**

For the most up-to-date information, consult the source code and inline documentation in the `src/` directory.
