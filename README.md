# BizHealth AI Assessment Pipeline

> **Enterprise-grade AI-powered business health assessment system that transforms 87 questionnaire responses into 17 comprehensive strategic intelligence reports through a six-phase analysis pipeline.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](https://www.typescriptlang.org/)
[![Claude Opus 4.5](https://img.shields.io/badge/Claude-Opus%204.5-orange.svg)](https://www.anthropic.com/claude)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)]()
[![Lines of Code](https://img.shields.io/badge/Lines%20of%20Code-35,000+-brightgreen.svg)]()
[![Reports](https://img.shields.io/badge/Reports-17%20Types-purple.svg)]()
[![AI Analyses](https://img.shields.io/badge/AI%20Analyses-20-green.svg)]()
[![Test Coverage](https://img.shields.io/badge/Tests-8%20Suites-blue.svg)]()

---

## Table of Contents

- [Overview](#overview)
- [What Makes This System Unique](#what-makes-this-system-unique)
- [Quick Start](#quick-start)
- [System Architecture](#system-architecture)
- [The Six-Phase Pipeline](#the-six-phase-pipeline)
- [Report Types (All 17)](#report-types-all-17)
- [Installation & Configuration](#installation--configuration)
- [Usage Guide](#usage-guide)
- [Input/Output Formats](#inputoutput-formats)
- [Key Features Deep Dive](#key-features-deep-dive)
- [Development Guide](#development-guide)
- [Testing Guide](#testing-guide)
- [Customization Guide](#customization-guide)
- [Advanced Usage](#advanced-usage)
- [Component Reference](#component-reference)
- [Utility Reference](#utility-reference)
- [Deployment Guide](#deployment-guide)
- [Security Best Practices](#security-best-practices)
- [Performance Optimization](#performance-optimization)
- [Troubleshooting](#troubleshooting)
- [Changelog & Recent Updates](#changelog--recent-updates)
- [Known Issues](#known-issues)
- [Performance & Cost](#performance--cost)
- [API Reference](#api-reference)
- [Integration Examples](#integration-examples)
- [Contributing](#contributing)
- [FAQ](#faq)
- [License](#license)

---

## Overview

The **BizHealth AI Assessment Pipeline** is a production-ready enterprise assessment platform that converts business questionnaire data into strategic intelligence through advanced AI analysis. Built on Claude Opus 4.5 with extended thinking capabilities, it generates 17 professional HTML reports covering every aspect of business health.

### What You Get

- **17 Professional Reports**: From 2-page executive briefs to 50-page comprehensive assessments
- **AI-Powered Analysis**: 20 Claude Opus 4.5 analyses totaling ~550K tokens
- **Visual Intelligence**: D3.js-powered charts, gauges, heatmaps, and radar diagrams
- **Legal Protection**: Clickwrap terms acceptance with audit trail
- **Enterprise Quality**: Zod validation, TypeScript strict mode, structured logging
- **Production Ready**: 196 TypeScript files, 35,000+ lines of battle-tested code

### Business Use Cases

- **Management Consulting**: Deliver comprehensive business assessments to clients
- **Private Equity**: Due diligence and portfolio company health monitoring
- **Business Coaching**: Structured assessment framework for coaching engagements
- **Internal Strategy**: Regular health checks for strategic planning
- **Board Reporting**: Executive-level intelligence for board meetings
- **M&A Due Diligence**: Comprehensive target company assessment

---

## What Makes This System Unique

### 1. **Six-Phase Intelligent Architecture**

Unlike traditional form-to-PDF systems, BizHealth employs a sophisticated six-phase pipeline:

```
Raw Data → Normalization → 10 AI Analyses → 5 Cross-Analyses
  → Executive Synthesis → IDM Consolidation → 17 Report Generation
```

### 2. **Two-Tier AI Analysis**

**Tier 1 (Foundation)**: 5 dimensional analyses covering all business areas
**Tier 2 (Interconnection)**: 5 cross-functional analyses revealing hidden patterns

This two-tier approach discovers insights that single-pass analysis misses.

### 3. **Canonical Data Model (IDM)**

All 20 AI analyses consolidate into a single, validated **Insights Data Model** (IDM):
- Single source of truth for all reports
- Zod runtime validation ensures data integrity
- 889 lines of strict TypeScript definitions
- Eliminates data inconsistency across reports

### 4. **World-Class Visualizations**

- **Server-Side Rendering**: D3.js charts rendered to embedded SVG
- **No Client Dependencies**: Reports work offline, print perfectly
- **Accessibility**: Full ARIA labels, WCAG 2.1 AA compliant
- **Brand Consistency**: Unified BizHealth visual identity

### 5. **Legal Protection Framework**

- **Clickwrap Modal**: Full-screen terms acceptance before report access
- **Acceptance Logging**: Timestamped audit trail
- **Beta Mode**: Bypass for internal testing
- **Production Ready**: Complete legal terms, privacy policy, disclaimers

### 6. **Quality Validation at Every Stage**

- **Input Validation**: Webhook payload Zod schemas
- **Phase Validation**: Output validation at every phase boundary
- **IDM Validation**: 889-line type system with runtime checks
- **Report Validation**: Automated quality metrics (visualizations, formatting)

---

## Quick Start

### Prerequisites

- **Node.js**: 18.0.0 or higher
- **Anthropic API Key**: Claude Opus 4.5 access required
- **TypeScript**: 5.3.3+ (installed with dependencies)
- **RAM**: 4GB minimum, 8GB recommended
- **Disk**: 500MB for dependencies, 2GB for outputs

### 5-Minute Setup

```bash
# 1. Navigate to project
cd workflow-export

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and add your Anthropic API key:
# ANTHROPIC_API_KEY=sk-ant-...

# 4. Run your first assessment
npx tsx src/run-pipeline.ts samples/webhook_001_saas_startup.json

# 5. View reports
open output/reports/<run-id>/comprehensive.html
```

### Expected Output

```
✓ Phase 0: SUCCESS (Duration: 95ms)
✓ Phase 1: SUCCESS (Duration: 4m 23s)
✓ Phase 2: SUCCESS (Duration: 2m 45s)
✓ Phase 3: SUCCESS (Duration: 2m 12s)
✓ Phase 4: SUCCESS (Duration: 120ms)
✓ Phase 5: SUCCESS (Duration: 287ms)

Total Duration: 9m 42s
Reports Generated: 15/17 (2 known issues)
Output Directory: output/reports/922cbec0-b9bf-4a97-b5c7-14e766246855
```

---

## System Architecture

### High-Level Flow

```
┌─────────────────┐
│ Webhook Payload │  87 questions + company profile
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   PHASE 0       │  Raw Capture & Normalization
│  (~100ms)       │  • Immutable storage
└────────┬────────┘  • Data validation
         │           • Benchmark lookup
         ▼
┌─────────────────┐
│   PHASE 1       │  10 AI Analyses (Two-Tier)
│  (4-5 min)      │  • Tier 1: 5 dimensional analyses
└────────┬────────┘  • Tier 2: 5 cross-functional analyses
         │           • Anthropic Batch API
         ▼
┌─────────────────┐
│   PHASE 2       │  5 Cross-Analyses
│  (2-3 min)      │  • Strategic recommendations
└────────┬────────┘  • Risk consolidation
         │           • Growth opportunities
         ▼
┌─────────────────┐
│   PHASE 3       │  5 Executive Syntheses
│  (2-3 min)      │  • Executive summary
└────────┬────────┘  • Overall scorecard
         │           • Action matrix
         ▼
┌─────────────────┐
│   PHASE 4       │  IDM Consolidation
│   (<1 sec)      │  • Canonical data model
└────────┬────────┘  • Zod validation
         │           • Score computation
         ▼
┌─────────────────┐
│   PHASE 5       │  Report Generation
│  (~300ms)       │  • 17 HTML reports
└────────┬────────┘  • D3.js visualizations
         │           • Clickwrap integration
         ▼
┌─────────────────┐
│  17 Reports     │  Ready for distribution
└─────────────────┘
```

### Component Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     ORCHESTRATION LAYER                   │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
│  │ Ph 0 │ │ Ph 1 │ │ Ph 2 │ │ Ph 3 │ │ Ph 4 │ │ Ph 5 │ │
│  └───┬──┘ └───┬──┘ └───┬──┘ └───┬──┘ └───┬──┘ └───┬──┘ │
└──────┼────────┼────────┼────────┼────────┼────────┼─────┘
       │        │        │        │        │        │
┌──────┼────────┼────────┼────────┼────────┼────────┼─────┐
│      │        │        │        │        │        │      │
│      ▼        ▼        ▼        ▼        ▼        ▼      │
│  ┌────────────────────────────────────────────────────┐  │
│  │             SERVICES & BUSINESS LOGIC              │  │
│  ├────────────────────────────────────────────────────┤  │
│  │  • Raw Assessment Storage  • Benchmark Lookup     │  │
│  │  • Narrative Extraction    • IDM Consolidator     │  │
│  │  • Confidence Scoring      • Report Builders      │  │
│  └────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘
       │        │        │        │        │        │
┌──────┼────────┼────────┼────────┼────────┼────────┼─────┐
│      ▼        ▼        ▼        ▼        ▼        ▼      │
│  ┌────────────────────────────────────────────────────┐  │
│  │            DATA & VALIDATION LAYER                 │  │
│  ├────────────────────────────────────────────────────┤  │
│  │  • TypeScript Types (889-line IDM)                │  │
│  │  • Zod Schemas (runtime validation)               │  │
│  │  • Input/Output Validators                        │  │
│  └────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘
       │                 │                 │
┌──────┼─────────────────┼─────────────────┼───────────────┐
│      ▼                 ▼                 ▼                │
│  ┌────────┐      ┌──────────┐      ┌─────────┐          │
│  │Anthropic│      │PostgreSQL│      │File     │          │
│  │Batch API│      │(optional)│      │System   │          │
│  └────────┘      └──────────┘      └─────────┘          │
│                 EXTERNAL LAYER                            │
└───────────────────────────────────────────────────────────┘
```

### Directory Structure

```
workflow-export/
├── src/
│   ├── run-pipeline.ts              # Main entry point (741 lines)
│   ├── orchestration/               # Phase orchestrators
│   │   ├── phase0-orchestrator.ts   # Raw capture & normalization
│   │   ├── phase1-orchestrator.ts   # AI analyses (Tier 1 & 2)
│   │   ├── phase2-orchestrator.ts   # Cross-analyses
│   │   ├── phase3-orchestrator.ts   # Executive synthesis
│   │   ├── phase4-orchestrator.ts   # IDM consolidation
│   │   ├── phase5-orchestrator.ts   # Report generation (780 lines)
│   │   └── reports/                 # Report generation system
│   │       ├── charts/              # D3.js visualizations
│   │       │   └── d3/              # Server-side D3 charts
│   │       ├── components/          # 40 UI components
│   │       │   ├── layout/          # Headers, footers, containers
│   │       │   ├── data-display/    # Tables, lists, cards
│   │       │   ├── interactive/     # Modals, tooltips
│   │       │   ├── charts/          # Chart wrappers
│   │       │   └── legal/           # Clickwrap modal
│   │       ├── utils/               # 18 utility modules
│   │       └── *.builder.ts         # 8 report builders
│   ├── prompts/                     # AI prompt templates
│   │   ├── tier1/                   # Foundational analyses
│   │   ├── tier2/                   # Interconnection analyses
│   │   ├── cross/                   # Cross-analyses
│   │   └── executive/               # Executive syntheses
│   ├── types/                       # TypeScript definitions
│   │   ├── idm.types.ts             # IDM type system (889 lines)
│   │   ├── webhook.types.ts         # Input types
│   │   └── phase-outputs.types.ts   # Phase output types
│   ├── services/                    # Business logic
│   │   ├── benchmark/               # Industry benchmarks
│   │   ├── idm-consolidator.ts      # IDM builder (1,194 lines)
│   │   └── ai-client.ts             # Anthropic API wrapper
│   ├── validation/                  # Zod schemas
│   └── __tests__/                   # Test suites
├── samples/                         # 25 sample webhooks
├── output/                          # Pipeline outputs
├── tests/                           # Integration tests
├── scripts/                         # Utility scripts
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── .env.example                     # Environment template
├── CODEBASE_ANALYSIS.md             # Technical documentation
└── README.md                        # This file
```

---

## The Six-Phase Pipeline

### Phase 0: Raw Capture & Normalization

**Duration**: ~100ms | **AI Calls**: 0 | **File**: `phase0-orchestrator.ts`

Immutable raw data storage, validation, and normalization for downstream processing.

**Sub-Phases**:
- **0A: Raw Capture**: Immutable webhook storage with audit metadata
- **0B: Normalization**: Transform to structured company profile
- **Benchmark**: Industry matching and percentile retrieval

**Key Functions**:
```typescript
async function executePhase0(webhookPayload: WebhookPayload, outputDir: string) {
  // 1. Validate webhook structure
  const validated = validateWebhookPayload(webhookPayload);

  // 2. Store immutable raw data
  await storeRawAssessment(validated);

  // 3. Normalize to company profile
  const profile = normalizeCompanyProfile(validated);

  // 4. Lookup industry benchmarks
  const benchmarks = await lookupBenchmarks(profile.industry);

  return { profile, benchmarks, rawData: validated };
}
```

**Output**: `phase0_output.json` (~95KB)

---

### Phase 1: Cross-Functional AI Analyses

**Duration**: 4-5 minutes | **AI Calls**: 10 (Batch API) | **File**: `phase1-orchestrator.ts`

Deep AI-powered analysis using two-tier architecture.

**Tier 1: Foundational Analyses (5 analyses)**
1. **Revenue Engine** (STR, SAL, MKT, CXP) - How company generates revenue
2. **Operational Excellence** (OPS) - Operational efficiency and execution
3. **Financial Strategic** (FIN) - Financial health and resource management
4. **People & Leadership** (HRS, LDG) - Team capability and leadership strength
5. **Compliance & Sustainability** (RMS, CMP) - Risk management and compliance

**Tier 2: Interconnection Analyses (5 analyses)**
1. **Growth Readiness** - Capacity for expansion across dimensions
2. **Market Position** - Competitive positioning and market dynamics
3. **Resource Optimization** - Efficient resource allocation
4. **Risk & Resilience** - Exposure management and business continuity
5. **Scalability Readiness** - Systems and processes scalability

**Batch API Optimization**:
- All 10 analyses submitted as single batch request
- Parallel processing reduces wait time from ~50 min to ~5 min
- 50% cost discount compared to standard API
- Automatic polling and result retrieval

**Output**: `phase1_output.json` (~376KB)

---

### Phase 2: Deep-Dive Cross-Analysis

**Duration**: 2-3 minutes | **AI Calls**: 5 (Batch API) | **File**: `phase2-orchestrator.ts`

Synthesizes Phase 1 findings to identify patterns and strategic opportunities.

**The 5 Cross-Analyses**:
1. **Cross-Dimensional Synthesis** - Holistic view across all dimensions
2. **Strategic Recommendations** - 15+ actionable recommendations with priorities
3. **Consolidated Risks** - 18+ risks with severity and mitigation strategies
4. **Growth Opportunities** - 10+ opportunities ranked by impact
5. **Implementation Roadmap** - 5 phases with timelines and dependencies

**Key Insights Generated**:
- Hidden interdependencies between business areas
- Strategic patterns not visible in single-dimension analysis
- Opportunity-risk trade-offs
- Resource allocation priorities

**Output**: `phase2_output.json` (~428KB)

---

### Phase 3: Executive Synthesis

**Duration**: 2-3 minutes | **AI Calls**: 5 (Batch API) | **File**: `phase3-orchestrator.ts`

Generates executive-level strategic outputs and decision frameworks.

**The 5 Executive Outputs**:
1. **Executive Summary** (2-3 pages) - High-level strategic overview
2. **Overall Scorecard** (0-100 score + bands) - Quantified business health
3. **Action Matrix** (Impact × Urgency) - Prioritized action framework
4. **Investment Roadmap** (ROI projections) - Financial investment planning
5. **Final Recommendations** (Top 5-10) - CEO-level strategic directives

**Scorecard Methodology**:
- 4 chapters (GE, PH, PL, RS) weighted equally
- 12 dimensions with industry-specific weights
- Score bands: Excellence (80+), Proficiency (60-79), Attention (40-59), Critical (0-39)
- Percentile ranking vs. industry benchmarks

**Output**: `phase3_output.json` (~312KB)

---

### Phase 4: IDM Consolidation

**Duration**: <1 second | **AI Calls**: 0 | **File**: `idm-consolidator.ts` (1,194 lines)

Builds canonical Insights Data Model (IDM) from all phase outputs.

**Consolidation Process**:
```typescript
async function buildIDM(phases: PhaseOutputs): Promise<IDM> {
  return {
    metadata: extractMetadata(phases.phase0),
    scores_summary: {
      overall_health_score: calculateWeightedScore(phases),
      overall_band: getScoreBand(score),
      chapter_scores: buildChapterScores(phases),
      dimension_scores: buildDimensionScores(phases)
    },
    chapters: buildChapters(phases), // 4 chapters
    recommendations: consolidateRecommendations(phases),
    risks: consolidateRisks(phases),
    quick_wins: extractQuickWins(phases),
    roadmap: buildRoadmap(phases),
    narrative_snippets: extractNarratives(phases)
  };
}
```

**IDM Structure**:
- **889-line TypeScript definition**: Complete type safety
- **Zod runtime validation**: Ensures data integrity
- **Single source of truth**: All reports use same data
- **Canonical format**: Eliminates inconsistencies

**Output**: `idm_output.json` (~63KB)

---

### Phase 5: Report Generation

**Duration**: ~300ms | **AI Calls**: 0 | **File**: `phase5-orchestrator.ts` (780 lines)

Generates 17 professional HTML reports from IDM using template builders.

**Report Builders** (8 total):
1. `comprehensive-report.builder.ts` - Master assessment (106KB output)
2. `owners-report.builder.ts` - Business owner focused
3. `executive-brief.builder.ts` - 2-3 page snapshot
4. `quick-wins-report.builder.ts` - Fast wins action plan
5. `risk-report.builder.ts` - Risk assessment
6. `roadmap-report.builder.ts` - Implementation timeline
7. `financial-report.builder.ts` - Financial analysis
8. `deep-dive-report.builder.ts` - Chapter deep dives (4 reports)
9. `recipe-report.builder.ts` - Manager reports (6 reports)

**Generation Process**:
```typescript
async function generateReports(idm: IDM, options: ReportOptions) {
  const builders = Object.entries(REPORT_BUILDERS);
  const results = await Promise.all(
    builders.map(async ([type, builder]) => {
      const html = await builder(idm, options);
      const metadata = generateMetadata(html);
      return { type, html, metadata };
    })
  );

  await writeReportsToFileSystem(results);
  return generateManifest(results);
}
```

**Quality Metrics Tracked**:
- SVG count (visualizations)
- Bold elements count (emphasis)
- Divider count (section breaks)
- List items (structured content)
- Table count (data presentation)
- Word count & page estimates

**Output**: 17 HTML files + `manifest.json`

---

## Report Types (All 17)

### Executive Reports (3)

#### 1. Comprehensive Assessment (`comprehensive.html`)
- **Pages**: ~50 pages
- **Audience**: Board, C-Suite, Investors, Strategic Partners
- **Content**: Complete analysis across all 4 chapters and 12 dimensions
- **Visualizations**: 15+ charts, gauges, heatmaps
- **Sections**:
  - Executive summary
  - Overall health scorecard
  - 4 chapter deep dives
  - 12 dimension analyses
  - Complete findings and recommendations
  - Risk assessment
  - Implementation roadmap
  - Financial impact analysis

#### 2. Business Owner Report (`owner.html`)
- **Pages**: ~20 pages
- **Audience**: Owners, Founders, Managing Partners
- **Content**: Strategic priorities, growth opportunities, financial impact
- **Focus**: Owner-specific concerns and decision-making needs
- **Status**: Known issue - `QUICK_REFS.scorecard is not a function`

#### 3. Executive Brief (`executiveBrief.html`)
- **Pages**: 2-3 pages
- **Audience**: Busy executives, board members
- **Content**: One-page snapshot with top 5 priorities
- **Format**: Single-page visual dashboard

### Strategic Reports (4)

#### 4. Quick Wins Action Plan (`quickWins.html`)
- **Pages**: ~8 pages
- **Timeline**: 0-30 days (immediate actions)
- **Content**: High-impact, low-effort quick wins
- **Criteria**: Impact score ≥4, Effort score ≤2, Horizon ≤30 days
- **Sections**: Prioritized list with ROI estimates

#### 5. Risk Assessment (`risk.html`)
- **Pages**: ~10 pages
- **Content**: 18+ risks with severity levels and mitigation strategies
- **Visualizations**: Risk matrix, heatmap by severity
- **Risk Levels**: Critical, High, Medium, Low
- **Mitigation**: Specific action plans for each risk

#### 6. Implementation Roadmap (`roadmap.html`)
- **Pages**: ~12 pages
- **Timeline**: 5 phases (Now, 30-60, 60-90, 90-180, 180-365 days)
- **Visualizations**: Gantt chart, timeline, dependency graph
- **Content**: Phase-by-phase implementation plan with milestones

#### 7. Financial Impact Analysis (`financial.html`)
- **Pages**: ~10 pages
- **Content**: Investment requirements, ROI projections, cost-benefit analysis
- **Metrics**: Total investment, expected returns, payback period
- **Visualizations**: Financial dashboard, ROI charts

### Chapter Deep Dives (4)

#### 8. Growth Engine (`deep-dive-ge.html`)
- **Dimensions**: Strategy (STR), Sales (SAL), Marketing (MKT), Customer Experience (CXP)
- **Pages**: ~15 pages
- **Focus**: Revenue generation, market expansion, customer acquisition

#### 9. Performance & Health (`deep-dive-ph.html`)
- **Dimensions**: Operations (OPS), Financials (FIN)
- **Pages**: ~15 pages
- **Focus**: Operational efficiency, financial management

#### 10. People & Leadership (`deep-dive-pl.html`)
- **Dimensions**: Human Resources (HRS), Leadership (LDG)
- **Pages**: ~15 pages
- **Focus**: Team capability, culture, leadership effectiveness

#### 11. Resilience & Safeguards (`deep-dive-rs.html`)
- **Dimensions**: Technology & Innovation (TIN), Information & Data Security (IDS), Risk Management (RMS), Compliance (CMP)
- **Pages**: ~15 pages
- **Focus**: Business continuity, security, compliance, risk mitigation

### Manager Reports (6)

#### 12. All Employees (`employees.html`)
- **Audience**: All team members
- **Content**: Company-wide priorities, culture, opportunities
- **Status**: Known issue - `text.replace is not a function`

#### 13-17. Functional Manager Reports
- **Operations Manager** (`managersOperations.html`) - OPS, TIN focus
- **Sales & Marketing Manager** (`managersSalesMarketing.html`) - SAL, MKT, CXP focus
- **Finance Manager** (`managersFinancials.html`) - FIN, RMS focus
- **Strategy Manager** (`managersStrategy.html`) - STR, LDG focus
- **IT/Technology Manager** (`managersItTechnology.html`) - TIN, IDS focus

**Recipe-Based Generation**:
Each manager report uses declarative YAML-like recipe configuration:
```typescript
const OPERATIONS_RECIPE: ReportRecipe = {
  title: 'Operations Manager Report',
  dimensions: ['OPS', 'TIN'],
  includeRisks: true,
  includeRecommendations: true,
  focusAreas: ['operational_efficiency', 'technology_adoption']
};
```

---

## Installation & Configuration

### System Requirements

- **Node.js**: 18.0.0+ (LTS recommended)
- **RAM**: 4GB minimum, 8GB recommended (for large assessments)
- **Disk**: 500MB for dependencies, 2GB for outputs
- **OS**: macOS, Linux, Windows (WSL2 recommended)
- **Network**: Stable connection for Anthropic API

### Installation

```bash
# Navigate to project
cd workflow-export

# Install dependencies
npm install

# Verify installation
npm list
node --version  # Should be 18+
npx tsx --version  # Should work
```

### Environment Configuration

Create `.env` file from template:

```bash
cp .env.example .env
```

Configure the following variables:

```bash
# REQUIRED: Anthropic API Configuration
ANTHROPIC_API_KEY=sk-ant-...           # Get from console.anthropic.com

# AI Model Settings (optional - defaults shown)
DEFAULT_MODEL=claude-opus-4-5-20251101 # Model identifier
DEFAULT_MAX_TOKENS=64000               # Max output tokens
DEFAULT_THINKING_TOKENS=32000          # Extended thinking budget

# Batch API Settings (optional - defaults shown)
BATCH_POLL_INTERVAL_MS=30000           # Poll every 30 seconds
BATCH_TIMEOUT_MS=3600000               # 1 hour timeout

# Logging Configuration (optional - defaults shown)
LOG_LEVEL=info                         # debug, info, warn, error

# Report Settings (optional - defaults shown)
RENDER_PDF=false                       # Future: PDF generation
BETA_DISABLE_REPORT_BLUR=false         # Legal protection (production should be false)

# Database (optional - not currently used)
# DATABASE_URL=postgresql://...
```

### TypeScript Configuration

The project uses strict TypeScript configuration (`tsconfig.json`):

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**Important**: All imports must use `.js` extensions:
```typescript
import { IDM } from './types/idm.types.js';  // ✓ Correct
import { IDM } from './types/idm.types';     // ✗ Wrong
```

---

## Usage Guide

### Basic Execution

```bash
# Full pipeline (Phases 0-5)
npx tsx src/run-pipeline.ts samples/webhook_001_saas_startup.json

# Specific phase
npx tsx src/run-pipeline.ts --phase=5

# Phase range
npx tsx src/run-pipeline.ts --start-phase=0 --end-phase=3

# Custom output directory
npx tsx src/run-pipeline.ts --output-dir=./custom-output samples/webhook_001.json

# Verbose logging
npx tsx src/run-pipeline.ts --verbose samples/webhook_001.json
```

### Sample Webhooks

25 diverse industry samples in `/samples/`:
- **webhook_001_saas_startup.json** - SaaS startup (85 employees)
- **webhook_002_restaurant_chain.json** - Food service (120 employees)
- **webhook_003_manufacturing.json** - Manufacturing (250 employees)
- **webhook_004_healthcare_clinic.json** - Healthcare (45 employees)
- **webhook_005_retail_store.json** - Retail (60 employees)
- **webhook_006_construction_firm.json** - Construction (180 employees)
- ... and 19 more diverse industries

### Viewing Reports

```bash
# macOS
open output/reports/*/comprehensive.html

# Linux
xdg-open output/reports/*/comprehensive.html

# Windows (WSL2)
explorer.exe output/reports/*/comprehensive.html

# Or start local web server
cd output/reports
python3 -m http.server 8000
# Then visit http://localhost:8000
```

### Programmatic Usage

```typescript
import { runPipeline } from './src/run-pipeline.js';

const result = await runPipeline({
  webhookPath: 'samples/webhook_001_saas_startup.json',
  startPhase: 0,
  endPhase: 5,
  outputDir: './output',
  verbose: true
});

console.log(`Generated ${result.reportsGenerated} reports`);
console.log(`Run ID: ${result.runId}`);
```

---

## Input/Output Formats

### Webhook Input Format

The webhook payload structure follows this schema:

```typescript
interface WebhookPayload {
  event: "new_questionnaire_response";
  submission_id: string;  // UUID
  submitted_at: string;   // ISO 8601 timestamp

  business_overview: {
    company_name: string;
    industry: string;  // e.g., "SaaS", "Manufacturing"
    last_year_revenue: number;
    full_time_employees: number;
  };

  // 12 dimension groups (87 total questions)
  strategy: { q1: number, q2: number, ... q7: number };      // 1-5 scale
  sales: { q1: number, q2: number, ... q8: number };         // 1-5 scale
  marketing: { q1: number, q2: number, ... q7: number };     // 1-5 scale
  customer_experience: { q1: number, ... q7: number };       // 1-5 scale
  operations: { q1: number, ... q8: number };                // 1-5 scale
  financials: { q1: number, ... q8: number };                // 1-5 scale
  human_resources: { q1: number, ... q7: number };           // 1-5 scale
  leadership: { q1: number, ... q7: number };                // 1-5 scale
  technology_innovation: { q1: number, ... q7: number };     // 1-5 scale
  info_data_security: { q1: number, ... q7: number };        // 1-5 scale
  risk_management: { q1: number, ... q6: number };           // 1-5 scale
  compliance: { q1: number, ... q6: number };                // 1-5 scale
}
```

### IDM Output Format

The canonical Insights Data Model structure:

```typescript
interface IDM {
  metadata: {
    run_id: string;
    company_name: string;
    industry: string;
    assessment_date: string;
    pipeline_version: string;
  };

  scores_summary: {
    overall_health_score: number;      // 0-100
    overall_band: ScoreBand;           // Excellence/Proficiency/Attention/Critical
    chapter_scores: Record<ChapterCode, number>;
    dimension_scores: Record<DimensionCode, number>;
  };

  chapters: {
    GE: Chapter;  // Growth Engine
    PH: Chapter;  // Performance & Health
    PL: Chapter;  // People & Leadership
    RS: Chapter;  // Resilience & Safeguards
  };

  recommendations: Recommendation[];  // 15+ items
  risks: Risk[];                      // 18+ items
  quick_wins: QuickWin[];             // High-impact, low-effort actions
  roadmap: RoadmapPhase[];            // 5 phases
  narrative_snippets: Record<string, string>;
}
```

### Output Directory Structure

```
output/
├── phase0_output.json              # Phase 0 results (~95KB)
├── phase1_output.json              # Phase 1 AI analyses (~376KB)
├── phase2_output.json              # Phase 2 cross-analyses (~428KB)
├── phase3_output.json              # Phase 3 executive synthesis (~312KB)
├── phase4_output.json              # Phase 4 metadata
├── phase5_output.json              # Phase 5 report metrics
├── idm_output.json                 # Canonical IDM (~63KB)
└── reports/{run-id}/
    ├── manifest.json               # Report manifest
    ├── comprehensive.html          # Master assessment (~106KB)
    ├── owner.html                  # Owner report
    ├── executiveBrief.html         # 2-3 page brief
    ├── quickWins.html              # Quick wins plan
    ├── risk.html                   # Risk assessment
    ├── roadmap.html                # Implementation roadmap
    ├── financial.html              # Financial analysis
    ├── deep-dive-ge.html           # Growth Engine deep dive
    ├── deep-dive-ph.html           # Performance & Health deep dive
    ├── deep-dive-pl.html           # People & Leadership deep dive
    ├── deep-dive-rs.html           # Resilience & Safeguards deep dive
    ├── employees.html              # All employees report
    ├── managersOperations.html     # Operations manager
    ├── managersSalesMarketing.html # Sales & Marketing manager
    ├── managersFinancials.html     # Finance manager
    ├── managersStrategy.html       # Strategy manager
    └── managersItTechnology.html   # IT/Technology manager
```

---

## Key Features Deep Dive

### 1. World-Class Visualizations

**D3.js Server-Side Rendering**:

All charts are generated server-side and embedded as inline SVG:

```typescript
// Example: Gauge chart generation
import { generateGaugeChart } from './charts/d3/charts/gauge-chart.js';

const svg = await generateGaugeChart({
  score: 67,
  band: 'Proficiency',
  width: 200,
  height: 120,
  showLabel: true
});

// SVG is embedded directly in HTML
const html = `<div class="gauge-container">${svg}</div>`;
```

**Chart Types**:
- **Gauge Charts**: Health scores (0-100 with color bands)
- **Radar Charts**: Multi-dimensional analysis
- **Bar Charts**: Dimension comparisons, benchmarks
- **Heatmaps**: Risk matrices, priority grids
- **Timeline/Gantt**: Roadmap phases, implementation plans
- **Score Tiles**: Compact score displays

**Accessibility Features**:
- Full ARIA labels on all charts
- WCAG 2.1 AA compliant
- Screen reader descriptions
- Keyboard navigation support
- High contrast mode compatible

### 2. Clickwrap Legal Protection

**Full-Screen Modal Implementation**:

```typescript
function generateClickwrapModal() {
  return `
    <div id="clickwrap-modal" class="clickwrap-overlay">
      <div class="clickwrap-modal">
        <div class="clickwrap-header">
          <h2>Terms and Conditions</h2>
        </div>
        <div class="clickwrap-content" id="clickwrap-terms">
          ${escapeHTML(LEGAL_TERMS)}
        </div>
        <div class="clickwrap-footer">
          <label>
            <input type="checkbox" id="accept-terms">
            I have read and accept the terms and conditions
          </label>
          <button id="accept-button" disabled>Accept & Continue</button>
        </div>
      </div>
    </div>
  `;
}
```

**Security Features**:
- XSS-safe HTML escaping
- Scroll-to-bottom detection
- Checkbox validation
- Timestamp logging
- Session persistence

**Beta Mode**:
Set `BETA_DISABLE_REPORT_BLUR=true` in `.env` to bypass clickwrap for testing. Adds "INTERNAL BETA" watermark.

### 3. Branding System

**BizHealth Color Palette**:

```css
:root {
  /* Primary Brand Colors */
  --biz-navy: #212653;      /* Primary brand color */
  --biz-green: #969423;     /* Accent color */
  --biz-grey: #7C7C7C;      /* Neutral color */

  /* Score Band Colors */
  --color-excellence: #28a745;   /* 80-100 */
  --color-proficiency: #007bff;  /* 60-79 */
  --color-attention: #ffc107;    /* 40-59 */
  --color-critical: #dc3545;     /* 0-39 */

  /* Typography */
  --font-heading: 'Montserrat', sans-serif;
  --font-body: 'Open Sans', sans-serif;

  /* Spacing System (8px base) */
  --spacing-xs: 8px;
  --spacing-sm: 16px;
  --spacing-md: 24px;
  --spacing-lg: 32px;
  --spacing-xl: 48px;
}
```

**Typography Scale**:
- H1: 32px (Montserrat Bold)
- H2: 24px (Montserrat SemiBold)
- H3: 20px (Montserrat Medium)
- Body: 16px (Open Sans Regular)
- Small: 14px (Open Sans Regular)

### 4. Quality Validation

**Multi-Layer Validation System**:

```typescript
// Layer 1: Input validation (Zod)
const webhookSchema = z.object({
  event: z.literal("new_questionnaire_response"),
  submission_id: z.string().uuid(),
  business_overview: z.object({ /* ... */ }),
  strategy: dimensionSchema,
  // ... 11 more dimensions
});

// Layer 2: Phase output validation
const phase1OutputSchema = z.object({
  tier1_analyses: z.array(analysisSchema),
  tier2_analyses: z.array(analysisSchema)
});

// Layer 3: IDM validation (889-line type system)
const idmSchema = z.object({
  metadata: metadataSchema,
  scores_summary: scoresSummarySchema,
  chapters: z.record(chapterSchema),
  // ... complete IDM structure
});

// Layer 4: Report quality metrics
const qualityMetrics = {
  svgCount: number,          // Target: 3+ per report
  boldCount: number,         // Target: 10+ per report
  dividerCount: number,      // Target: 5+ per report
  listItemCount: number,
  tableCount: number,
  pageEstimate: number,
  wordCount: number
};
```

### 5. Content Sanitization

**Security Measures**:

```typescript
// HTML escaping
function escapeHTML(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Markdown sanitization
function sanitizeMarkdown(markdown: string): string {
  // Remove script tags
  markdown = markdown.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove inline event handlers
  markdown = markdown.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');

  return markdown;
}

// No eval() or Function() constructors
// No inline scripts
// CSP-compatible implementation
```

---

## Development Guide

### Getting Started

```bash
# Clone repository
git clone <repository-url>
cd workflow-export

# Install dependencies
npm install

# Run development build
npm run dev

# Run tests
npm test

# Type check
npx tsc --noEmit
```

### Project Structure Explained

**Core Files**:
- `src/run-pipeline.ts` (741 lines): Main orchestrator, phase sequencing
- `src/types/idm.types.ts` (889 lines): Complete IDM type system
- `src/services/idm-consolidator.ts` (1,194 lines): IDM builder logic

**Phase Orchestrators** (`src/orchestration/`):
- Each phase has dedicated orchestrator file
- Handles phase-specific logic, validation, output
- Clear input/output contracts

**Report System** (`src/orchestration/reports/`):
- **Builders**: 8 builder files generate all 17 reports
- **Components**: 40 reusable UI components
- **Charts**: D3.js visualization library
- **Utils**: 18 utility modules for common tasks

### Adding a New Report Type

1. **Create Builder File**:
```typescript
// src/orchestration/reports/my-report.builder.ts
export async function buildMyReport(
  ctx: ReportContext,
  options: ReportOptions
): Promise<string> {
  const { idm, brand } = ctx;

  // Build HTML content
  const html = `
    <!DOCTYPE html>
    <html>
      <head>${generateHeader('My Report', brand)}</head>
      <body>
        ${generateContent(idm)}
      </body>
    </html>
  `;

  return html;
}
```

2. **Register in Phase 5**:
```typescript
// src/orchestration/phase5-orchestrator.ts
const REPORT_BUILDERS = {
  // ... existing builders
  myReport: buildMyReport
};
```

3. **Add to Manifest**:
```typescript
// Update manifest generation
const reportTypes = [
  // ... existing types
  'myReport'
];
```

### Adding a New Visualization

1. **Create Chart Component**:
```typescript
// src/orchestration/reports/charts/d3/charts/my-chart.ts
import * as d3 from 'd3';

export function generateMyChart(data: MyChartData): string {
  const width = 400;
  const height = 300;

  // D3 rendering logic
  const svg = d3.create('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('role', 'img')
    .attr('aria-label', 'My chart description');

  // ... chart rendering logic

  return svg.node().outerHTML;
}
```

2. **Export from Charts Index**:
```typescript
// src/orchestration/reports/charts/index.ts
export { generateMyChart } from './d3/charts/my-chart.js';
```

3. **Use in Report Builder**:
```typescript
import { generateMyChart } from '../charts/index.js';

const chartSvg = generateMyChart(data);
const html = `<div class="chart-container">${chartSvg}</div>`;
```

### Code Standards

**TypeScript**:
- Strict mode enabled (all strict flags)
- Explicit return types on exported functions
- No `any` types (use `unknown` if necessary)
- Use `.js` extensions in imports (ES modules)

**Naming Conventions**:
- Files: kebab-case (`my-report.builder.ts`)
- Functions: camelCase (`buildMyReport`)
- Types/Interfaces: PascalCase (`ReportContext`)
- Constants: SCREAMING_SNAKE_CASE (`REPORT_BUILDERS`)

**JSDoc Comments**:
```typescript
/**
 * Builds the comprehensive assessment report.
 *
 * @param ctx - Report context containing IDM and brand settings
 * @param options - Report generation options
 * @returns HTML string of complete report
 */
export async function buildComprehensiveReport(
  ctx: ReportContext,
  options: ReportOptions
): Promise<string> {
  // Implementation
}
```

---

## Testing Guide

### Test Suites

The project includes 8 test suites covering critical functionality:

#### 1. Phase 0 Tests (`src/__tests__/phase0.test.ts`)
- Webhook payload validation
- Raw data capture
- Company profile normalization
- Benchmark lookup

```bash
npx vitest run src/__tests__/phase0.test.ts
```

#### 2. Section Mapping Tests (`src/orchestration/reports/config/__tests__/section-mapping.test.ts`)
- IDM to report section mapping
- Content extraction validation
- Recipe configuration tests

```bash
npm run test:mappings
```

#### 3. Report Snapshots Tests (`src/__tests__/reports/report-snapshots.test.ts`)
- HTML structure validation
- Component rendering tests
- Visual regression testing

```bash
npx vitest run src/__tests__/reports/report-snapshots.test.ts
```

#### 4. CSS Usage Tests (`src/qa/__tests__/css-usage.test.ts`)
- CSS class usage validation
- Style consistency checks
- Brand color compliance

```bash
npm run test:css
```

#### 5. Formatting Equivalency Tests (`src/qa/__tests__/formatting-equivalency.test.ts`)
- Formatter output consistency
- Number formatting precision
- Date/time formatting

```bash
npm run test:formatting
```

#### 6. Phase 5 Visual Validation (`src/__tests__/phase5-visual-validation.test.ts`)
- Quality metrics validation
- Visualization count checks
- Content completeness

```bash
npm run test:visual
# or
npm run phase5:validate
```

#### 7. Beta Mode Tests (`src/__tests__/beta-mode.test.ts`)
- Clickwrap modal behavior
- Beta watermark rendering
- Legal terms display

```bash
npx vitest run src/__tests__/beta-mode.test.ts
```

#### 8. Recipe Tests (`tests/recipe.test.ts`)
- Manager report recipe execution
- Dimension filtering
- Content inclusion logic

```bash
npx vitest run tests/recipe.test.ts
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npx vitest run path/to/test.test.ts

# Watch mode
npx vitest watch

# Coverage report
npm run test:coverage

# Formatting tests only
npm run test:formatting

# Update snapshots
npm run test:formatting:update-snapshots
```

### Writing Tests

```typescript
import { describe, it, expect } from 'vitest';
import { buildIDM } from '../services/idm-consolidator.js';

describe('IDM Consolidator', () => {
  it('should build valid IDM from phase outputs', () => {
    const phaseOutputs = {
      phase0: mockPhase0Output,
      phase1: mockPhase1Output,
      phase2: mockPhase2Output,
      phase3: mockPhase3Output
    };

    const idm = buildIDM(phaseOutputs);

    expect(idm.metadata).toBeDefined();
    expect(idm.scores_summary.overall_health_score).toBeGreaterThanOrEqual(0);
    expect(idm.scores_summary.overall_health_score).toBeLessThanOrEqual(100);
    expect(idm.chapters).toHaveProperty('GE');
    expect(idm.chapters).toHaveProperty('PH');
    expect(idm.chapters).toHaveProperty('PL');
    expect(idm.chapters).toHaveProperty('RS');
  });
});
```

---

## Customization Guide

### Customizing Report Content

#### Modify Report Sections

Edit the appropriate builder file:

```typescript
// src/orchestration/reports/comprehensive-report.builder.ts

// Add new section
function generateMyCustomSection(idm: IDM): string {
  return `
    <div class="custom-section">
      <h2>My Custom Analysis</h2>
      ${renderCustomContent(idm)}
    </div>
  `;
}

// Include in report
export async function buildComprehensiveReport(ctx, opts) {
  const sections = [
    generateExecutiveSummary(ctx.idm),
    generateScorecard(ctx.idm),
    generateMyCustomSection(ctx.idm),  // Add here
    // ... other sections
  ];

  return assembleReport(sections);
}
```

#### Customize Visual Styling

Edit brand colors and styles:

```typescript
// src/orchestration/reports/utils/color-utils.ts

export const BRAND_COLORS = {
  primary: '#212653',     // Change to your brand color
  accent: '#969423',      // Change accent color
  neutral: '#7C7C7C'      // Change neutral color
};

export const SCORE_COLORS = {
  excellence: '#28a745',   // Customize score band colors
  proficiency: '#007bff',
  attention: '#ffc107',
  critical: '#dc3545'
};
```

#### Modify Score Thresholds

```typescript
// src/orchestration/reports/utils/color-utils.ts

export const SCORE_THRESHOLDS = {
  excellence: 80,    // Change from default 80
  proficiency: 60,   // Change from default 60
  attention: 40      // Change from default 40
  // Below 40 is critical
};
```

### Adding New Dimensions

1. **Update Webhook Schema**:
```typescript
// src/types/webhook.types.ts
export interface WebhookPayload {
  // ... existing dimensions
  my_new_dimension: {
    q1: number;
    q2: number;
    // ... questions
  };
}
```

2. **Update IDM Types**:
```typescript
// src/types/idm.types.ts
export type DimensionCode =
  | 'STR' | 'SAL' | 'MKT' | 'CXP'
  | 'OPS' | 'FIN'
  | 'HRS' | 'LDG'
  | 'TIN' | 'IDS' | 'RMS' | 'CMP'
  | 'MND';  // Add new dimension code

export interface Dimension {
  code: DimensionCode;
  name: string;
  // ... rest of structure
}
```

3. **Add Dimension Metadata**:
```typescript
// src/services/dimension-metadata.ts
export const DIMENSION_METADATA = {
  // ... existing dimensions
  MND: {
    code: 'MND',
    name: 'My New Dimension',
    description: 'Description of what this measures',
    chapter: 'GE',  // or PH, PL, RS
    weight: 0.08
  }
};
```

4. **Update Phase 1 Prompts** (if needed):
Add AI analysis prompts for the new dimension.

### Customizing AI Prompts

All prompts are in `src/prompts/`:

```typescript
// Example: Modify executive summary prompt
// src/prompts/executive/executive-summary.ts

export const EXECUTIVE_SUMMARY_PROMPT = `
You are a senior business consultant analyzing a company assessment.

Generate an executive summary that:
1. Highlights the top 3 strategic priorities (customize this)
2. Identifies critical risks requiring immediate attention
3. Summarizes overall business health
4. Provides actionable recommendations

Focus on: [customize focus areas]
- Strategic positioning
- Operational excellence
- Financial health
- Growth readiness

Inputs:
{phase1_analyses}
{phase2_analyses}

Output format: [specify your preferred format]
`;
```

### White-Labeling

To white-label the reports for your brand:

1. **Update Brand Colors**:
```typescript
// src/orchestration/reports/utils/color-utils.ts
export const BRAND_COLORS = {
  primary: '#YOUR_PRIMARY',
  accent: '#YOUR_ACCENT',
  neutral: '#YOUR_NEUTRAL'
};
```

2. **Update Typography**:
```css
/* In report CSS */
:root {
  --font-heading: 'Your Heading Font', sans-serif;
  --font-body: 'Your Body Font', sans-serif;
}
```

3. **Replace Logo** (if added):
```typescript
// In report header generation
const logo = `<img src="data:image/svg+xml;base64,${YOUR_LOGO_BASE64}" alt="Your Brand">`;
```

4. **Update Legal Terms**:
```typescript
// src/orchestration/reports/components/legal/clickwrap-modal.component.ts
const LEGAL_TERMS = `
[Your company's terms and conditions]
`;
```

---

## Advanced Usage

### Partial Pipeline Execution

Run specific phases only:

```bash
# Run Phase 5 only (assumes prior phases complete)
npx tsx src/run-pipeline.ts --phase=5

# Run Phases 2-4
npx tsx src/run-pipeline.ts --start-phase=2 --end-phase=4

# Re-generate reports from existing IDM
npx tsx src/run-pipeline.ts --phase=5 --skip-idm-rebuild
```

### Custom IDM Manipulation

```typescript
import { readFileSync, writeFileSync } from 'fs';
import type { IDM } from './src/types/idm.types.js';

// Read existing IDM
const idm: IDM = JSON.parse(readFileSync('output/idm_output.json', 'utf-8'));

// Modify scores
idm.scores_summary.overall_health_score = 85;
idm.scores_summary.overall_band = 'Excellence';

// Add custom narratives
idm.narrative_snippets['custom_insight'] = 'This company shows exceptional growth potential...';

// Write modified IDM
writeFileSync('output/idm_output_modified.json', JSON.stringify(idm, null, 2));

// Re-generate reports with modified IDM
// (Requires custom script - not built-in feature)
```

### Batch Processing

Process multiple assessments in parallel:

```typescript
// batch-process.ts
import { runPipeline } from './src/run-pipeline.js';
import { readdirSync } from 'fs';

const samples = readdirSync('samples')
  .filter(f => f.endsWith('.json'))
  .map(f => `samples/${f}`);

// Process 3 at a time (to respect API rate limits)
const CONCURRENCY = 3;

for (let i = 0; i < samples.length; i += CONCURRENCY) {
  const batch = samples.slice(i, i + CONCURRENCY);

  await Promise.all(
    batch.map(async (webhookPath) => {
      try {
        const result = await runPipeline({
          webhookPath,
          outputDir: `./output-batch/${path.basename(webhookPath, '.json')}`
        });
        console.log(`✓ Processed ${webhookPath}: ${result.reportsGenerated} reports`);
      } catch (error) {
        console.error(`✗ Failed ${webhookPath}:`, error);
      }
    })
  );
}
```

### Custom Validation Rules

Add custom validation to IDM:

```typescript
// custom-validators.ts
import type { IDM } from './src/types/idm.types.js';

export function validateBusinessRules(idm: IDM): ValidationResult {
  const errors: string[] = [];

  // Rule 1: Overall score must be weighted average of chapters
  const calculatedScore = (
    idm.scores_summary.chapter_scores.GE +
    idm.scores_summary.chapter_scores.PH +
    idm.scores_summary.chapter_scores.PL +
    idm.scores_summary.chapter_scores.RS
  ) / 4;

  if (Math.abs(calculatedScore - idm.scores_summary.overall_health_score) > 1) {
    errors.push('Overall score does not match chapter average');
  }

  // Rule 2: Must have minimum number of recommendations
  if (idm.recommendations.length < 10) {
    errors.push('Insufficient recommendations (minimum 10 required)');
  }

  // Rule 3: Critical risks must exist if score < 40
  if (idm.scores_summary.overall_health_score < 40) {
    const criticalRisks = idm.risks.filter(r => r.severity === 'Critical');
    if (criticalRisks.length === 0) {
      errors.push('Low score requires critical risks');
    }
  }

  return { valid: errors.length === 0, errors };
}
```

### Environment-Specific Configuration

```typescript
// config.ts
const ENV = process.env.NODE_ENV || 'development';

export const CONFIG = {
  development: {
    anthropicKey: process.env.ANTHROPIC_API_KEY_DEV,
    logLevel: 'debug',
    betaMode: true,
    maxConcurrentBatches: 1
  },
  staging: {
    anthropicKey: process.env.ANTHROPIC_API_KEY_STAGING,
    logLevel: 'info',
    betaMode: false,
    maxConcurrentBatches: 3
  },
  production: {
    anthropicKey: process.env.ANTHROPIC_API_KEY_PROD,
    logLevel: 'warn',
    betaMode: false,
    maxConcurrentBatches: 5
  }
}[ENV];
```

---

## Component Reference

### Layout Components (`src/orchestration/reports/components/layout/`)

#### `page-header.component.ts`
```typescript
generatePageHeader(title: string, subtitle?: string, brand?: BrandConfig): string
```
Generates report header with title, logo, and branding.

#### `page-footer.component.ts`
```typescript
generatePageFooter(metadata: ReportMetadata): string
```
Generates report footer with page numbers, date, confidentiality notice.

#### `section-container.component.ts`
```typescript
generateSectionContainer(title: string, content: string, options?: SectionOptions): string
```
Creates section container with consistent styling.

### Data Display Components (`src/orchestration/reports/components/data-display/`)

#### `data-table.component.ts`
```typescript
generateDataTable(headers: string[], rows: string[][], options?: TableOptions): string
```
Generates accessible data table with sorting, filtering options.

#### `metric-card.component.ts`
```typescript
generateMetricCard(label: string, value: string | number, trend?: 'up' | 'down' | 'neutral'): string
```
Creates metric display card with optional trend indicator.

#### `score-tile.component.ts`
```typescript
generateScoreTile(score: number, label: string, band?: ScoreBand): string
```
Compact score display with color-coded band.

### Interactive Components (`src/orchestration/reports/components/interactive/`)

#### `clickwrap-modal.component.ts`
```typescript
generateClickwrapModal(terms: string, privacyPolicy: string): string
```
Full-screen legal terms acceptance modal.

#### `tooltip.component.ts`
```typescript
generateTooltip(content: string, triggerText: string): string
```
Tooltip with hover/click activation.

### Chart Components (`src/orchestration/reports/components/charts/`)

#### `gauge-wrapper.component.ts`
```typescript
generateGaugeWrapper(svg: string, label: string): string
```
Wrapper for gauge chart SVG with label and styling.

#### `chart-container.component.ts`
```typescript
generateChartContainer(svg: string, title: string, description?: string): string
```
Container for any chart type with title and accessibility.

### Legal Components (`src/orchestration/reports/components/legal/`)

#### `disclaimer.component.ts`
```typescript
generateDisclaimer(text: string): string
```
Legal disclaimer box with appropriate styling.

#### `confidentiality-notice.component.ts`
```typescript
generateConfidentialityNotice(): string
```
Standard confidentiality notice for reports.

---

## Utility Reference

### IDM Extractors (`src/orchestration/reports/utils/idm-extractors.ts`)

```typescript
// Extract numeric values safely
extractNumericValue(obj: any, path: string, fallback: number = 0): number

// Format benchmark comparisons
formatBenchmark(value: number, benchmark: number): string  // "15% above industry avg"

// Get dimension name from code
getDimensionName(code: DimensionCode): string  // "STR" → "Strategy"

// Map dimension to owner
mapDimensionToOwner(code: DimensionCode): string  // "OPS" → "Operations Manager"

// Calculate ROI display
calculateROIDisplay(investment: number, returns: number): string

// Get score band from score
getScoreBandFromScore(score: number): ScoreBand  // 67 → "Proficiency"
```

### Color Utilities (`src/orchestration/reports/utils/color-utils.ts`)

```typescript
// Get score color
getScoreColor(score: number): string  // 67 → "#007bff" (Proficiency blue)

// Get score band
getScoreBand(score: number): ScoreBand  // 67 → "Proficiency"

// RGB/Hex conversions
hexToRgb(hex: string): RGB
rgbToHex(rgb: RGB): string

// Interpolate between colors
interpolateColor(color1: string, color2: string, factor: number): string

// Chapter colors
getChapterColor(chapterCode: ChapterCode): string
```

### Number Formatters (`src/orchestration/reports/utils/number-formatter.ts`)

```typescript
// Format score (1 decimal)
formatScore(score: number): string  // 67.432 → "67.4"

// Format score as integer
formatScoreInt(score: number): string  // 67.8 → "68"

// Format percentage
formatPercentage(value: number): string  // 0.674 → "67.4%"

// Format currency
formatCurrency(amount: number): string  // 24000000 → "$24,000,000"

// Format compact numbers
formatCompactNumber(num: number): string  // 24000000 → "24M"

// Format ROI
formatROI(roi: number): string  // 2.5 → "250%"

// Safe rounding
safeRound(value: number, decimals: number = 0): number
```

### Format Helpers (`src/orchestration/reports/utils/format-helpers.ts`)

```typescript
// Format dates
formatDateShort(date: string): string  // "2025-12-08" → "Dec 8, 2025"

// Format horizon/timeline
formatHorizon(days: number): string  // 30 → "30 days"

// Horizon to deadline
horizonToDeadline(horizon: number): string  // 30 → "Jan 7, 2026"

// Format severity
formatSeverity(severity: string): string  // "high" → "High Priority"

// Get severity color
getSeverityColor(severity: string): string  // "critical" → "#dc3545"

// Truncate text
truncateText(text: string, maxLength: number): string
```

### Conditional Renderers (`src/orchestration/reports/utils/conditional-renderer.ts`)

```typescript
// Render if condition met
renderConditional(
  condition: boolean,
  content: string,
  fallback?: string
): string

// Render if has items
renderIfHasItems<T>(
  items: T[],
  renderFn: (items: T[]) => string,
  fallback?: string
): string

// Render if valid number
renderIfValidNumber(
  value: number | undefined,
  renderFn: (value: number) => string,
  fallback?: string
): string

// Generate "Data Not Available" box
generateDataNotAvailableBox(message?: string): string

// Generate "Coming Soon" box
generateComingSoonBox(feature: string): string
```

### Content Sanitizer (`src/orchestration/reports/utils/content-sanitizer.ts`)

```typescript
// Sanitize orphaned visualization headers
sanitizeOrphanedVisualizationHeaders(content: string): string

// Validate no orphaned headers remain
validateNoOrphanedHeaders(content: string): boolean

// Process narrative for visualization
processNarrativeForVisualization(narrative: string, hasChart: boolean): string
```

### Markdown Utilities (`src/orchestration/reports/utils/markdown-parser.ts`)

```typescript
// Parse markdown to HTML
parseMarkdownToHTML(markdown: string, options?: ParseOptions): string

// Parse with validation
parseMarkdownWithValidation(markdown: string): ParseResult

// Validate parsed HTML
validateParsedHTML(html: string): ValidationResult

// Cleanup remaining markdown
cleanupRemainingMarkdown(html: string): string
```

---

## Deployment Guide

### Production Checklist

Before deploying to production:

- [ ] **Environment Variables Set**
  ```bash
  ANTHROPIC_API_KEY=sk-ant-prod-...
  BETA_DISABLE_REPORT_BLUR=false  # Must be false for legal protection
  LOG_LEVEL=warn                   # Reduce log verbosity
  NODE_ENV=production
  ```

- [ ] **Security Review**
  - [ ] API keys secured (not in code)
  - [ ] Clickwrap modal enabled
  - [ ] Input validation active
  - [ ] No debug endpoints exposed

- [ ] **Performance Optimization**
  - [ ] Node.js 18+ LTS version
  - [ ] Sufficient RAM (8GB+ recommended)
  - [ ] Fast SSD storage for outputs
  - [ ] Network latency to Anthropic API < 100ms

- [ ] **Error Handling**
  - [ ] Graceful degradation for API failures
  - [ ] Retry logic with exponential backoff
  - [ ] Error logging and alerting
  - [ ] User-friendly error messages

- [ ] **Monitoring**
  - [ ] API usage tracking
  - [ ] Cost monitoring
  - [ ] Performance metrics
  - [ ] Error rate monitoring

### Deployment Options

#### Option 1: Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --production

# Copy source
COPY . .

# Build (if needed)
RUN npm run build

# Set environment
ENV NODE_ENV=production

# Run
CMD ["node", "dist/run-pipeline.js"]
```

```bash
# Build image
docker build -t bizhealth-pipeline .

# Run container
docker run -d \
  --name bizhealth \
  -e ANTHROPIC_API_KEY=sk-ant-... \
  -v $(pwd)/output:/app/output \
  bizhealth-pipeline
```

#### Option 2: Serverless (AWS Lambda)

```typescript
// lambda-handler.ts
import { runPipeline } from './src/run-pipeline.js';

export async function handler(event: any) {
  const { webhookPayload } = JSON.parse(event.body);

  try {
    const result = await runPipeline({
      webhookPayload,
      outputDir: '/tmp/output'
    });

    // Upload reports to S3
    await uploadToS3(result.runId, '/tmp/output');

    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error('Pipeline failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
```

**Lambda Configuration**:
- Memory: 2048 MB minimum
- Timeout: 15 minutes (max for Lambda)
- Ephemeral storage: 2048 MB
- Environment: Node.js 18.x

#### Option 3: Traditional Server

```bash
# Install PM2 process manager
npm install -g pm2

# Start with PM2
pm2 start ecosystem.config.js

# Monitor
pm2 logs bizhealth
pm2 monit
```

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'bizhealth-pipeline',
    script: './src/run-pipeline.ts',
    interpreter: 'npx',
    interpreter_args: 'tsx',
    instances: 1,
    env: {
      NODE_ENV: 'production',
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    max_memory_restart: '2G'
  }]
};
```

### Scaling Considerations

**Horizontal Scaling**:
- Run multiple instances for parallel processing
- Use queue system (SQS, RabbitMQ) for job distribution
- Load balance webhook inputs

**Vertical Scaling**:
- 8GB+ RAM for large assessments
- Multi-core CPU for faster D3 rendering
- SSD storage for fast file I/O

**Cost Optimization**:
- Use Batch API (50% discount)
- Cache benchmark data
- Reuse Phase outputs when re-generating reports
- Implement request throttling

---

## Security Best Practices

### API Key Management

**Never commit API keys**:
```bash
# .gitignore
.env
.env.local
.env.production
secrets/
```

**Use environment variables**:
```bash
# .env (never commit this)
ANTHROPIC_API_KEY=sk-ant-...

# Load in code
import dotenv from 'dotenv';
dotenv.config();
const apiKey = process.env.ANTHROPIC_API_KEY;
```

**Rotate keys regularly**:
- Generate new API keys every 90 days
- Revoke old keys after rotation
- Use separate keys for dev/staging/prod

### Input Validation

**Zod schema validation** (already implemented):
```typescript
// All webhook inputs validated
const validated = webhookSchema.parse(input);

// Reject invalid inputs
if (!validated) {
  throw new Error('Invalid webhook payload');
}
```

**Additional validation**:
```typescript
// Sanitize company name
function sanitizeCompanyName(name: string): string {
  return name
    .trim()
    .replace(/[<>]/g, '')  // Remove HTML brackets
    .slice(0, 100);        // Limit length
}

// Validate revenue range
function validateRevenue(revenue: number): boolean {
  return revenue >= 0 && revenue <= 10_000_000_000;
}
```

### XSS Prevention

**HTML escaping** (already implemented):
```typescript
function escapeHTML(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Use in all user-generated content
const safeCompanyName = escapeHTML(companyName);
```

**No eval() or Function()**:
- Never use `eval()`
- Never use `new Function()`
- No inline event handlers

**Content Security Policy**:
```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';">
```

### Data Privacy

**PII Handling**:
- Company names: Public data, logged
- Financial data: Sensitive, encrypted at rest
- Employee counts: Aggregated, not individual
- Submission IDs: UUID only, no PII

**Encryption**:
```typescript
// Encrypt sensitive fields before storage
import crypto from 'crypto';

function encrypt(text: string, key: string): string {
  const cipher = crypto.createCipher('aes-256-cbc', key);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Store encrypted
const encryptedRevenue = encrypt(
  String(revenue),
  process.env.ENCRYPTION_KEY
);
```

**Data Retention**:
- Raw webhooks: 90 days
- IDM outputs: 1 year
- Reports: 2 years
- Implement automatic purging

### Audit Logging

```typescript
// Log all pipeline executions
logger.info('Pipeline started', {
  runId,
  companyName,
  industry,
  timestamp: new Date().toISOString(),
  userId: authenticatedUserId
});

// Log report access
logger.info('Report accessed', {
  runId,
  reportType: 'comprehensive',
  accessedBy: userId,
  ipAddress: request.ip,
  timestamp: new Date().toISOString()
});

// Log errors with context
logger.error('Pipeline failed', {
  runId,
  phase: 'phase1',
  error: error.message,
  stack: error.stack
});
```

---

## Performance Optimization

### Current Performance Baseline

**Total Pipeline Duration**: 9-15 minutes
- Phase 0: ~100ms
- Phase 1: 4-5 min (bottleneck - AI analyses)
- Phase 2: 2-3 min
- Phase 3: 2-3 min
- Phase 4: <1 sec
- Phase 5: ~300ms

### Optimization Strategies

#### 1. Batch API Optimization (Already Implemented)

```typescript
// Submit all analyses as single batch
const batchRequest = {
  requests: analyses.map((analysis, i) => ({
    custom_id: `analysis_${i}`,
    params: {
      model: 'claude-opus-4-5-20251101',
      max_tokens: 64000,
      thinking: { type: 'enabled', budget_tokens: 32000 },
      messages: [{ role: 'user', content: analysis.prompt }]
    }
  }))
};

// Reduces Phase 1 from ~50 min to ~5 min
```

#### 2. Caching Benchmark Data

```typescript
// Cache industry benchmarks
const benchmarkCache = new Map<string, Benchmark>();

async function lookupBenchmarks(industry: string): Promise<Benchmark> {
  if (benchmarkCache.has(industry)) {
    return benchmarkCache.get(industry)!;
  }

  const benchmark = await fetchBenchmarkFromDB(industry);
  benchmarkCache.set(industry, benchmark);
  return benchmark;
}
```

#### 3. Parallel Report Generation

```typescript
// Generate all 17 reports in parallel
const reportPromises = Object.entries(REPORT_BUILDERS).map(
  async ([type, builder]) => {
    const html = await builder(ctx, options);
    return { type, html };
  }
);

const reports = await Promise.all(reportPromises);
// Reduces Phase 5 from ~5 sec to ~300ms
```

#### 4. Phase Output Reuse

```bash
# Skip phases if outputs exist
npx tsx src/run-pipeline.ts --skip-phase=1 --skip-phase=2 --skip-phase=3

# Only re-generate reports (useful during development)
npx tsx src/run-pipeline.ts --phase=5
```

#### 5. Optimize D3 Rendering

```typescript
// Reuse D3 instances
const d3Pool = createD3Pool({ size: 10 });

async function generateChart(data: ChartData): Promise<string> {
  const d3 = await d3Pool.acquire();
  try {
    return d3.renderChart(data);
  } finally {
    d3Pool.release(d3);
  }
}
```

### Cost Optimization

**Current Cost**: ~$10 per assessment (Batch API)

**Optimization Strategies**:

1. **Use Batch API** (already implemented): 50% discount
2. **Optimize Prompts**: Reduce input tokens
3. **Cache AI Responses**: For identical inputs
4. **Incremental Updates**: Only re-analyze changed dimensions

```typescript
// Example: Incremental analysis
async function incrementalPhase1(
  previousIDM: IDM,
  changedDimensions: DimensionCode[]
): Promise<Phase1Output> {
  // Only re-analyze changed dimensions
  const analyses = changedDimensions.map(dim =>
    generateAnalysisPrompt(dim)
  );

  // Reuse previous analyses for unchanged dimensions
  const mergedOutput = mergePreviousAndNew(previousIDM, analyses);

  return mergedOutput;
}
```

### Memory Optimization

```typescript
// Stream large files instead of loading in memory
import { createReadStream } from 'fs';

async function processLargeReport(filePath: string) {
  const stream = createReadStream(filePath);
  // Process in chunks
  for await (const chunk of stream) {
    processChunk(chunk);
  }
}

// Clear unused data
function cleanupAfterPhase(phase: number) {
  if (phase > 1) {
    delete globalThis.phase0Cache;
    delete globalThis.phase1Cache;
  }
}
```

---

## Troubleshooting

### Common Issues

#### Issue 1: API Key Not Found

**Error**: `ANTHROPIC_API_KEY not found in environment`

**Solutions**:
```bash
# Check .env file exists
ls -la .env

# Verify key is set
grep ANTHROPIC_API_KEY .env

# Ensure .env is loaded
# Add to top of run-pipeline.ts:
import dotenv from 'dotenv';
dotenv.config();

# Or export directly
export ANTHROPIC_API_KEY=sk-ant-...
```

#### Issue 2: TypeScript Import Errors

**Error**: `Cannot find module './utils/index'`

**Solution**: Always use `.js` extension in imports:
```typescript
// ✓ Correct
import { formatScore } from './utils/index.js';

// ✗ Wrong
import { formatScore } from './utils/index';
import { formatScore } from './utils/index.ts';
```

#### Issue 3: Batch API Timeout

**Error**: `Batch request timed out after 3600000ms`

**Solutions**:
```bash
# Increase timeout
export BATCH_TIMEOUT_MS=7200000  # 2 hours

# Check Anthropic status
curl https://status.anthropic.com

# Retry with exponential backoff (already implemented)
```

#### Issue 4: Out of Memory

**Error**: `JavaScript heap out of memory`

**Solutions**:
```bash
# Increase Node.js memory limit
NODE_OPTIONS=--max-old-space-size=8192 npx tsx src/run-pipeline.ts

# Or use environment variable
export NODE_OPTIONS="--max-old-space-size=8192"
```

#### Issue 5: Report Quality Metrics Failing

**Error**: `comprehensive report does not meet quality targets`

**Diagnosis**:
```bash
# Check quality metrics
cat output/phase5_output.json | jq '.qualityMetrics.comprehensive'

# Expected output:
# {
#   "svgCount": 15,           # Should be 20+
#   "boldCount": 1154,        # Should be 1500+
#   "dividerCount": 108       # Should be 150+
# }
```

**Solution**: Enhance report builder to include more visualizations and formatting.

#### Issue 6: Known Report Failures

**Error**: `owner report failed: QUICK_REFS.scorecard is not a function`

**Status**: Known issue documented in CODEBASE_ANALYSIS.md

**Workaround**:
```typescript
// Fix in owners-report.builder.ts
// Replace:
const scorecard = QUICK_REFS.scorecard(idm);

// With:
import { generateScorecard } from './utils/index.js';
const scorecard = generateScorecard(idm);
```

#### Issue 7: Duplicate Export Errors

**Error**: `SyntaxError: Identifier 'truncateToSentences' has already been declared`

**Status**: Fixed in recent update (2025-12-08)

**Solution**: Update to latest code or apply fix:
```typescript
// src/orchestration/reports/utils/index.ts
// Remove duplicate exports
export {
  transformToOwnerVoice,
  truncateToSentences,  // Export once from voice-transformer.js
  // ... not from markdown-sanitizer.js
} from './voice-transformer.js';
```

### Debugging Techniques

#### Enable Verbose Logging

```bash
# Set log level to debug
LOG_LEVEL=debug npx tsx src/run-pipeline.ts

# Or in code
import { logger } from './services/logger.js';
logger.level = 'debug';
```

#### Inspect Phase Outputs

```bash
# Pretty-print JSON
cat output/phase1_output.json | jq '.'

# Check specific fields
cat output/idm_output.json | jq '.scores_summary.overall_health_score'

# Count elements
cat output/idm_output.json | jq '.recommendations | length'
```

#### Validate IDM Structure

```bash
# Check IDM schema compliance
npx tsx -e "
import { idmSchema } from './src/validation/idm-schema.js';
import { readFileSync } from 'fs';

const idm = JSON.parse(readFileSync('output/idm_output.json', 'utf-8'));
const result = idmSchema.safeParse(idm);

if (!result.success) {
  console.error('IDM validation failed:', result.error);
} else {
  console.log('IDM is valid');
}
"
```

#### Test Single Report Generation

```typescript
// test-report.ts
import { buildComprehensiveReport } from './src/orchestration/reports/comprehensive-report.builder.js';
import { readFileSync, writeFileSync } from 'fs';

const idm = JSON.parse(readFileSync('output/idm_output.json', 'utf-8'));

const html = await buildComprehensiveReport(
  { idm, brand: 'bizhealth' },
  { betaMode: true }
);

writeFileSync('test-report.html', html);
console.log('Test report generated: test-report.html');
```

---

## Changelog & Recent Updates

### Version 1.0.0 (2025-12-08)

#### Fixed
- **Duplicate Export Resolution**: Fixed duplicate exports in `src/orchestration/reports/utils/index.ts`
  - Removed duplicate `truncateToSentences` export
  - Removed exports of non-existent functions
  - Cleaned up import paths

- **Executive Brief Import Corrections**: Fixed import errors in `executive-brief.builder.ts`
  - Changed `getScoreBandFromValue` to `getScoreBand`
  - Changed `getBandColorFromName(band)` to `getScoreColor(score)`
  - Updated function calls to use correct utility functions

#### Known Issues
- **Owner Report**: `QUICK_REFS.scorecard is not a function` (2 of 17 reports affected)
- **Employees Report**: `text.replace is not a function` (2 of 17 reports affected)
- **Comprehensive Report**: Quality metrics not meeting targets (visualizations: 15/20, bold: 1154/1500)

#### Performance
- 15/17 reports generating successfully (88.2%)
- Total pipeline duration: 9-15 minutes
- Cost per assessment: ~$10 (with Batch API discount)

### Upcoming Features
- **Short-term** (1-3 months):
  - Fix 2 failing reports (owner, employees)
  - Enhance comprehensive report quality metrics
  - Add unit test coverage
  - Implement integration tests

- **Medium-term** (3-6 months):
  - PDF export functionality
  - Custom branding API
  - Webhook ingestion endpoint
  - Report customization UI

- **Long-term** (6-12 months):
  - Multi-language support
  - Custom dimension framework
  - Advanced analytics dashboard
  - API-first architecture

---

## Known Issues

### Critical (Production-Blocking)
None currently.

### High Priority
1. **Owner Report Failure** (`owner.html`)
   - **Error**: `QUICK_REFS.scorecard is not a function`
   - **Impact**: Owner report not generating
   - **Workaround**: Use comprehensive report instead
   - **Fix Effort**: Low (2-4 hours)
   - **Status**: Tracked, not yet fixed

2. **Employees Report Failure** (`employees.html`)
   - **Error**: `text.replace is not a function`
   - **Impact**: Employee report not generating
   - **Workaround**: Use manager reports instead
   - **Fix Effort**: Low (2-4 hours)
   - **Status**: Tracked, not yet fixed

### Medium Priority
3. **Comprehensive Report Quality Metrics**
   - **Issue**: Not meeting quality targets (visualizations: 15/20, bold: 1154/1500, dividers: 108/150)
   - **Impact**: Report may lack visual richness
   - **Workaround**: Manual enhancement during review
   - **Fix Effort**: Medium (1-2 days)
   - **Status**: Tracked, enhancement planned

4. **Test Coverage Gaps**
   - **Issue**: Limited unit test coverage (~30%)
   - **Impact**: Harder to catch regressions
   - **Workaround**: Manual testing
   - **Fix Effort**: High (1-2 weeks)
   - **Status**: Planned for next sprint

### Low Priority
5. **PDF Export Not Implemented**
   - **Issue**: RENDER_PDF flag exists but not implemented
   - **Impact**: No PDF output option
   - **Workaround**: Use browser print-to-PDF
   - **Fix Effort**: High (2-3 weeks)
   - **Status**: Future enhancement

6. **No Multi-Language Support**
   - **Issue**: Reports only in English
   - **Impact**: Limited international use
   - **Workaround**: Manual translation
   - **Fix Effort**: Very High (1-2 months)
   - **Status**: Future enhancement

---

## Performance & Cost

### Execution Time Breakdown

| Phase | Duration | Percentage | Bottleneck |
|-------|----------|------------|------------|
| Phase 0 | ~100ms | <1% | - |
| Phase 1 | 4-5 min | 45-50% | Batch API processing |
| Phase 2 | 2-3 min | 20-25% | Batch API processing |
| Phase 3 | 2-3 min | 20-25% | Batch API processing |
| Phase 4 | <1 sec | <1% | - |
| Phase 5 | ~300ms | <1% | - |
| **Total** | **9-15 min** | **100%** | **AI Analysis** |

### Cost Breakdown (Per Assessment)

**Batch API Pricing** (50% discount):
- Input: $7.50 per million tokens
- Output: $37.50 per million tokens

**Token Usage**:
- Phase 1: ~200K input, ~150K output
- Phase 2: ~100K input, ~80K output
- Phase 3: ~80K input, ~60K output
- **Total**: ~380K input, ~290K output

**Cost Calculation**:
```
Input:  380,000 tokens × $7.50/1M  = $2.85
Output: 290,000 tokens × $37.50/1M = $10.88
Total: $13.73 per assessment (Batch API)

Standard API (no discount):
Total: $27.46 per assessment

Savings with Batch API: $13.73 (50% discount)
```

**Volume Pricing Estimates**:
| Volume/Month | Cost/Month | Cost/Assessment |
|--------------|------------|-----------------|
| 10 | $138 | $13.73 |
| 50 | $687 | $13.73 |
| 100 | $1,373 | $13.73 |
| 500 | $6,865 | $13.73 |
| 1,000 | $13,730 | $13.73 |

*Note: Costs may vary based on Anthropic pricing changes and token usage optimization.*

### Resource Requirements

**Development**:
- RAM: 4GB minimum, 8GB recommended
- CPU: 2 cores minimum, 4 cores recommended
- Disk: 2GB for dependencies + outputs
- Network: 10 Mbps minimum

**Production**:
- RAM: 8GB minimum, 16GB recommended
- CPU: 4 cores minimum, 8 cores recommended
- Disk: 10GB minimum (for historical outputs)
- Network: 100 Mbps recommended (for API calls)

---

## API Reference

### Main Pipeline Function

```typescript
async function runPipeline(config: PipelineConfig): Promise<PipelineResult>
```

**Parameters**:
```typescript
interface PipelineConfig {
  webhookPath?: string;          // Path to webhook JSON file
  webhookPayload?: WebhookPayload;  // Or provide payload directly
  startPhase?: 0 | 1 | 2 | 3 | 4 | 5;  // Default: 0
  endPhase?: 0 | 1 | 2 | 3 | 4 | 5;    // Default: 5
  outputDir?: string;            // Default: './output'
  verbose?: boolean;             // Default: false
}
```

**Returns**:
```typescript
interface PipelineResult {
  success: boolean;
  runId: string;
  reportsGenerated: number;
  errors: Array<{ reportType: string; error: string }>;
  duration: number;  // milliseconds
  outputDir: string;
}
```

**Example**:
```typescript
import { runPipeline } from './src/run-pipeline.js';

const result = await runPipeline({
  webhookPath: 'samples/webhook_001_saas_startup.json',
  startPhase: 0,
  endPhase: 5,
  verbose: true
});

console.log(`Success: ${result.success}`);
console.log(`Reports: ${result.reportsGenerated}/17`);
console.log(`Duration: ${result.duration}ms`);
```

### Report Builder API

```typescript
async function buildReport(
  ctx: ReportContext,
  options: ReportOptions
): Promise<string>
```

**Parameters**:
```typescript
interface ReportContext {
  idm: IDM;
  brand: 'bizhealth' | string;
}

interface ReportOptions {
  betaMode?: boolean;
  includeClickwrap?: boolean;
  customStyles?: string;
}
```

**Example**:
```typescript
import { buildComprehensiveReport } from './src/orchestration/reports/comprehensive-report.builder.js';

const html = await buildComprehensiveReport(
  { idm, brand: 'bizhealth' },
  { betaMode: false, includeClickwrap: true }
);
```

### Chart Generation API

```typescript
function generateGaugeChart(config: GaugeConfig): string
function generateRadarChart(config: RadarConfig): string
function generateBarChart(config: BarConfig): string
function generateHeatmap(config: HeatmapConfig): string
```

**Example**:
```typescript
import { generateGaugeChart } from './src/orchestration/reports/charts/d3/charts/gauge-chart.js';

const svg = generateGaugeChart({
  score: 67,
  band: 'Proficiency',
  width: 200,
  height: 120,
  showLabel: true,
  showPercentile: true,
  percentile: 65
});
```

---

## Integration Examples

### REST API Integration

```typescript
// Express.js webhook endpoint
import express from 'express';
import { runPipeline } from './src/run-pipeline.js';

const app = express();
app.use(express.json());

app.post('/api/assessments', async (req, res) => {
  const webhookPayload = req.body;

  try {
    const result = await runPipeline({
      webhookPayload,
      outputDir: `./assessments/${webhookPayload.submission_id}`
    });

    res.json({
      success: true,
      runId: result.runId,
      reportsGenerated: result.reportsGenerated,
      reportUrls: generateReportUrls(result.runId)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(3000, () => {
  console.log('Assessment API listening on port 3000');
});
```

### AWS S3 Integration

```typescript
// Upload reports to S3
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readdirSync, readFileSync } from 'fs';

async function uploadReportsToS3(runId: string, localDir: string) {
  const s3 = new S3Client({ region: 'us-east-1' });

  const files = readdirSync(localDir).filter(f => f.endsWith('.html'));

  for (const file of files) {
    const content = readFileSync(`${localDir}/${file}`);

    await s3.send(new PutObjectCommand({
      Bucket: 'bizhealth-reports',
      Key: `${runId}/${file}`,
      Body: content,
      ContentType: 'text/html'
    }));
  }

  console.log(`Uploaded ${files.length} reports to S3`);
}
```

### Database Integration

```typescript
// Store IDM in PostgreSQL
import pg from 'pg';

async function storeIDMInDatabase(idm: IDM) {
  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL
  });

  await client.connect();

  await client.query(`
    INSERT INTO assessments (
      run_id,
      company_name,
      industry,
      overall_score,
      overall_band,
      idm_json,
      created_at
    ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
  `, [
    idm.metadata.run_id,
    idm.metadata.company_name,
    idm.metadata.industry,
    idm.scores_summary.overall_health_score,
    idm.scores_summary.overall_band,
    JSON.stringify(idm)
  ]);

  await client.end();
}
```

### Email Integration

```typescript
// Send reports via email
import nodemailer from 'nodemailer';

async function emailReports(runId: string, recipientEmail: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const reportUrl = `https://reports.bizhealth.com/${runId}/comprehensive.html`;

  await transporter.sendMail({
    from: 'noreply@bizhealth.com',
    to: recipientEmail,
    subject: 'Your BizHealth Assessment is Ready',
    html: `
      <h2>Your Business Health Assessment</h2>
      <p>Your comprehensive assessment has been completed.</p>
      <p><a href="${reportUrl}">View Your Reports</a></p>
    `
  });
}
```

---

## Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

```bash
# Fork and clone
git clone https://github.com/your-org/bizhealth-pipeline.git
cd bizhealth-pipeline

# Create feature branch
git checkout -b feature/my-feature

# Make changes and test
npm test
npx tsc --noEmit

# Commit with conventional commits
git commit -m "feat: add new visualization type"

# Push and create PR
git push origin feature/my-feature
```

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Build/tooling changes

**Examples**:
```bash
git commit -m "feat: add PDF export functionality"
git commit -m "fix: resolve owner report QUICK_REFS error"
git commit -m "docs: update installation instructions"
git commit -m "test: add unit tests for IDM consolidator"
```

### Code Standards

- **TypeScript strict mode**: All code must pass strict type checking
- **ESLint**: Follow ESLint rules (run `npm run lint`)
- **JSDoc**: Public APIs must have JSDoc comments
- **Tests**: New features require test coverage
- **Imports**: Always use `.js` extensions

### Pull Request Checklist

- [ ] Code follows TypeScript strict mode
- [ ] All tests pass (`npm test`)
- [ ] No linting errors (`npm run lint`)
- [ ] JSDoc comments added for public APIs
- [ ] Updated README/docs if needed
- [ ] Conventional commit messages used

---

## FAQ

### General Questions

**Q: What AI model does this use?**
A: Claude Opus 4.5 with extended thinking (32K thinking budget).

**Q: How long does an assessment take?**
A: 9-15 minutes complete end-to-end. Phase 5 only (report generation from existing IDM) takes ~300ms.

**Q: How much does it cost per assessment?**
A: ~$13.73 with Batch API (50% discount), ~$27.46 with standard API.

**Q: Can I customize the reports?**
A: Yes! Edit report builders in `src/orchestration/reports/`. See [Customization Guide](#customization-guide).

**Q: Can I add new report types?**
A: Yes! Create a new builder file and register in Phase 5. See [Development Guide](#development-guide).

**Q: Can I deploy this to production?**
A: Yes! Ensure `BETA_DISABLE_REPORT_BLUR=false` for legal protection. See [Deployment Guide](#deployment-guide).

**Q: What industries are supported?**
A: All industries. Industry benchmarks are retrieved dynamically from database.

**Q: Can I white-label the reports?**
A: Yes! See [Customization Guide - White-Labeling](#white-labeling).

### Technical Questions

**Q: Why do imports need `.js` extensions?**
A: TypeScript ES modules require explicit extensions. This is a TypeScript/Node.js requirement.

**Q: Can I run specific phases only?**
A: Yes! Use `--phase=5` or `--start-phase=2 --end-phase=4`. See [Usage Guide](#usage-guide).

**Q: How do I fix "API key not found" error?**
A: Ensure `.env` file exists with `ANTHROPIC_API_KEY=sk-ant-...`. See [Troubleshooting](#troubleshooting).

**Q: Why are 2 reports failing?**
A: Known issues with owner and employees reports. See [Known Issues](#known-issues).

**Q: Can I process multiple assessments in parallel?**
A: Yes! See [Advanced Usage - Batch Processing](#batch-processing).

**Q: How do I optimize costs?**
A: Use Batch API (already enabled), cache benchmarks, reuse phase outputs. See [Performance Optimization](#performance-optimization).

### Business Questions

**Q: Is this suitable for consulting firms?**
A: Yes! Designed for management consulting, private equity, business coaching.

**Q: Can I charge my clients for assessments?**
A: Yes! Licensing allows commercial use. Contact for licensing details.

**Q: What's the difference between comprehensive and executive brief?**
A: Comprehensive is ~50 pages with full analysis. Executive brief is 2-3 pages for busy executives.

**Q: Can I get historical trend analysis?**
A: Not yet. Future enhancement to compare multiple assessments over time.

---

## License

**Proprietary Software**

This software is proprietary and confidential. Unauthorized copying, modification, distribution, or use is strictly prohibited.

For licensing inquiries, contact: [licensing@bizhealth.com](mailto:licensing@bizhealth.com)

---

## Acknowledgments

**Powered by**:
- [Anthropic Claude](https://www.anthropic.com/claude) - AI analysis engine
- [D3.js](https://d3js.org/) - Data visualization
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Zod](https://zod.dev/) - Runtime validation

**Built with**:
- 196 TypeScript files
- 35,000+ lines of code
- 6-phase intelligent pipeline
- 17 professional report types
- 40 reusable UI components
- 18 utility modules
- 8 test suites

**Special Thanks**:
- Dennis - Project leadership and vision
- Claude Code - Development assistance
- The open-source community

---

**Last Updated**: December 8, 2025
**Version**: 1.0.0
**Pipeline Version**: 1.0.0
**IDM Version**: 2.0.0
**README Version**: 2.0 (Enhanced & Comprehensive)

---

For technical support or questions, please refer to:
- [CODEBASE_ANALYSIS.md](./CODEBASE_ANALYSIS.md) - Technical architecture documentation
- [GitHub Issues](https://github.com/your-org/bizhealth-pipeline/issues) - Bug reports and feature requests
- [Documentation](https://docs.bizhealth.com) - Full documentation portal

**Ready to transform business health assessments? Let's build something incredible!**
