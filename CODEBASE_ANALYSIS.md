# BizHealth Report Pipeline - Comprehensive Codebase Analysis

**Analysis Version**: 2.0.0
**Analysis Date**: December 4, 2025
**Analysis Depth**: Ultra-Comprehensive (--ultrathink)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Architecture](#system-architecture)
3. [Complete Directory Structure](#complete-directory-structure)
4. [Phase 0: Raw Capture & Normalization](#phase-0-raw-capture--normalization)
5. [Phase 1: Cross-functional AI Analyses](#phase-1-cross-functional-ai-analyses)
6. [Phase 2: Deep-dive Cross-analysis](#phase-2-deep-dive-cross-analysis)
7. [Phase 3: Executive Synthesis](#phase-3-executive-synthesis)
8. [Phase 4: IDM Consolidation](#phase-4-idm-consolidation)
9. [Phase 5: Report Generation](#phase-5-report-generation)
10. [The Insights Data Model (IDM)](#the-insights-data-model-idm)
11. [AI Prompt Engineering](#ai-prompt-engineering)
12. [Visualization System](#visualization-system)
13. [Report Builder Architecture](#report-builder-architecture)
14. [Service Layer](#service-layer)
15. [Data Transformation Layer](#data-transformation-layer)
16. [Validation Framework](#validation-framework)
17. [API Integration](#api-integration)
18. [Styling & Branding System](#styling--branding-system)
19. [Type System](#type-system)
20. [Performance & Cost Analysis](#performance--cost-analysis)
21. [Known Issues & Limitations](#known-issues--limitations)
22. [Complete File Reference](#complete-file-reference)

---

## Executive Summary

BizHealth Report Pipeline is a **production-grade, enterprise-scale AI-powered business assessment system** that transforms questionnaire responses into comprehensive strategic intelligence through a sophisticated six-phase pipeline.

### System Capabilities At A Glance

| Metric | Value |
|--------|-------|
| **Pipeline Phases** | 6 (Phase 0-5) |
| **AI Analyses** | 20 distinct analyses (10 Tier 1 + 5 Tier 2 + 5 synthesis) |
| **Report Types** | 17 professional HTML reports |
| **Business Dimensions** | 12 across 4 strategic chapters |
| **Questions Analyzed** | 87 questionnaire responses |
| **Execution Time** | 10-15 minutes per assessment |
| **Cost Per Assessment** | $10-20 (Anthropic Batch API) |
| **Token Usage** | ~550K tokens per run |

### Key Architectural Innovations

1. **Canonical IDM Architecture**: Single source of truth for all report generation
2. **Tiered AI Analysis**: Two-tier approach where Tier 2 builds upon Tier 1 outputs
3. **Anthropic Batch API Integration**: 50% cost reduction with parallel processing
4. **Extended Thinking**: 32K token budget for deep analytical reasoning
5. **Visualization Abstraction**: Structured JSON visualization output from AI, rendered by HTML builders
6. **Zod Validation Throughout**: Runtime type safety at all data boundaries

### The Four Strategic Chapters

| Code | Chapter Name | Dimensions | Focus |
|------|--------------|------------|-------|
| **GE** | Growth Engine | STR, SAL, MKT, CXP | Revenue generation, market positioning |
| **PH** | Performance & Health | OPS, FIN | Operational efficiency, financial health |
| **PL** | People & Leadership | HRS, LDG | Talent, culture, leadership effectiveness |
| **RS** | Resilience & Safeguards | TIN, IDS, RMS, CMP | Technology, risk, compliance |

### The 12 Business Dimensions

| Code | Dimension Name | Chapter | Weight |
|------|----------------|---------|--------|
| STR | Strategy | GE | 10% |
| SAL | Sales | GE | 9% |
| MKT | Marketing | GE | 8% |
| CXP | Customer Experience | GE | 8% |
| OPS | Operations | PH | 9% |
| FIN | Financials | PH | 10% |
| HRS | Human Resources | PL | 8% |
| LDG | Leadership & Governance | PL | 10% |
| TIN | Technology & Innovation | RS | 8% |
| IDS | IT, Data & Systems | RS | 7% |
| RMS | Risk Management & Sustainability | RS | 7% |
| CMP | Compliance & Legal | RS | 6% |

---

## System Architecture

### High-Level Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              INPUT LAYER                                         │
│                     sample_webhook.json (Questionnaire)                          │
│                     87 Questions + Company Profile                               │
└─────────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  PHASE 0: RAW CAPTURE & NORMALIZATION                                            │
│  ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐                │
│  │ Phase 0A        │   │ Phase 0B        │   │ Benchmark       │                │
│  │ Raw Capture     │ → │ Normalization   │ → │ Retrieval       │                │
│  │ Immutable Store │   │ Transform       │   │ Industry Match  │                │
│  └─────────────────┘   └─────────────────┘   └─────────────────┘                │
│  Output: phase0_output.json                                                      │
│  - NormalizedCompanyProfile                                                      │
│  - NormalizedQuestionnaireResponses (4 chapters, 12 dimensions)                  │
│  - NormalizedBenchmarkData                                                       │
└─────────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  PHASE 1: CROSS-FUNCTIONAL AI ANALYSES (Anthropic Batch API)                    │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ TIER 1 (5 Foundational Analyses)                                        │    │
│  │ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐                   │    │
│  │ │ Revenue       │ │ Operational   │ │ Financial     │                   │    │
│  │ │ Engine        │ │ Excellence    │ │ Strategic     │                   │    │
│  │ │ STR+SAL+MKT+  │ │ OPS focus     │ │ FIN focus     │                   │    │
│  │ │ CXP           │ │               │ │               │                   │    │
│  │ └───────────────┘ └───────────────┘ └───────────────┘                   │    │
│  │ ┌───────────────┐ ┌───────────────┐                                     │    │
│  │ │ People &      │ │ Compliance &  │                                     │    │
│  │ │ Leadership    │ │ Sustainability│                                     │    │
│  │ │ HRS+LDG       │ │ RMS+CMP       │                                     │    │
│  │ └───────────────┘ └───────────────┘                                     │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                       │                                          │
│                                       ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ TIER 2 (5 Interconnection Analyses - Depends on Tier 1)                 │    │
│  │ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐                   │    │
│  │ │ Growth        │ │ Market        │ │ Resource      │                   │    │
│  │ │ Readiness     │ │ Position      │ │ Optimization  │                   │    │
│  │ └───────────────┘ └───────────────┘ └───────────────┘                   │    │
│  │ ┌───────────────┐ ┌───────────────┐                                     │    │
│  │ │ Risk &        │ │ Scalability   │                                     │    │
│  │ │ Resilience    │ │ Readiness     │                                     │    │
│  │ └───────────────┘ └───────────────┘                                     │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│  Output: phase1_output.json                                                      │
│  - 10 AI analysis results with narratives and visualizations                     │
└─────────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  PHASE 2: DEEP-DIVE CROSS-ANALYSIS (Anthropic Batch API)                        │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐                          │
│  │ Cross-        │ │ Strategic     │ │ Consolidated  │                          │
│  │ Dimensional   │ │ Recommendations│ │ Risks         │                          │
│  │ Synthesis     │ │               │ │               │                          │
│  └───────────────┘ └───────────────┘ └───────────────┘                          │
│  ┌───────────────┐ ┌───────────────┐                                            │
│  │ Growth        │ │ Implementation│                                            │
│  │ Opportunities │ │ Roadmap       │                                            │
│  └───────────────┘ └───────────────┘                                            │
│  Output: phase2_output.json                                                      │
│  - 5 synthesis analyses building on Phase 1                                      │
└─────────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  PHASE 3: EXECUTIVE SYNTHESIS (Anthropic Batch API)                             │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐                          │
│  │ Executive     │ │ Scorecard     │ │ Action        │                          │
│  │ Summary       │ │ (Health Score)│ │ Matrix        │                          │
│  └───────────────┘ └───────────────┘ └───────────────┘                          │
│  ┌───────────────┐ ┌───────────────┐                                            │
│  │ Investment    │ │ Final         │                                            │
│  │ Roadmap       │ │ Recommendations│                                           │
│  └───────────────┘ └───────────────┘                                            │
│  Output: phase3_output.json                                                      │
│  - 5 executive-level outputs with overall health score (0-100)                   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  PHASE 4: IDM CONSOLIDATION (No AI - Data Transformation)                       │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                     INSIGHTS DATA MODEL (IDM)                           │    │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │    │
│  │  │ metadata     │ │ scores_      │ │ chapters[4]  │ │ findings[]   │   │    │
│  │  │              │ │ summary      │ │ dimensions[12]│ │              │   │    │
│  │  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘   │    │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │    │
│  │  │ recommendations│ │ quick_wins[]│ │ risks[]      │ │ roadmap[]    │   │    │
│  │  │ []            │ │              │ │              │ │              │   │    │
│  │  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘   │    │
│  │  ┌──────────────┐                                                       │    │
│  │  │ visualizations│                                                      │    │
│  │  │ []            │                                                      │    │
│  │  └──────────────┘                                                       │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│  Output: phase4_output.json + idm_output.json                                    │
│  - Canonical data model (~63KB JSON)                                             │
└─────────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  PHASE 5: REPORT GENERATION (No AI - HTML Template Rendering)                   │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ EXECUTIVE REPORTS (3)                                                   │    │
│  │ • Comprehensive Assessment Report (comprehensive.html)                  │    │
│  │ • Business Owner Report (owner.html)                                    │    │
│  │ • Executive Brief (executiveBrief.html)                                 │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ STRATEGIC REPORTS (4)                                                   │    │
│  │ • Quick Wins Action Plan (quickWins.html)                               │    │
│  │ • Risk Assessment Report (risk.html)                                    │    │
│  │ • Implementation Roadmap (roadmap.html)                                 │    │
│  │ • Financial Impact Analysis (financial.html)                            │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ CHAPTER DEEP DIVES (4)                                                  │    │
│  │ • Growth Engine (deep-dive-ge.html)                                     │    │
│  │ • Performance & Health (deep-dive-ph.html)                              │    │
│  │ • People & Leadership (deep-dive-pl.html)                               │    │
│  │ • Resilience & Safeguards (deep-dive-rs.html)                           │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ MANAGER REPORTS (6)                                                     │    │
│  │ • Employees Report (employees.html)                                     │    │
│  │ • Operations Manager (managersOperations.html)                          │    │
│  │ • Sales & Marketing Manager (managersSalesMarketing.html)               │    │
│  │ • Finance Manager (managersFinancials.html)                             │    │
│  │ • Strategy Manager (managersStrategy.html)                              │    │
│  │ • IT/Technology Manager (managersItTechnology.html)                     │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│  Output: 17 HTML reports + manifest.json                                         │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Orchestrator Pattern

Each phase is implemented as an orchestrator class that:
1. Loads inputs from previous phase outputs
2. Executes phase-specific logic (AI analysis or data transformation)
3. Validates outputs with Zod schemas
4. Persists results to filesystem
5. Returns structured result with status and metadata

```typescript
// Pattern used by all phase orchestrators
interface PhaseOrchestrator<TConfig, TResult> {
  execute(config: TConfig): Promise<TResult>;
}

interface PhaseResult {
  phase: string;
  status: 'complete' | 'partial' | 'failed';
  metadata: {
    startTime: string;
    endTime: string;
    duration: number;
  };
}
```

---

## Complete Directory Structure

```
src/
├── run-pipeline.ts                      # Main pipeline entry point
├── phase0-index.ts                      # Phase 0 exports
├── index.ts                             # Package exports
│
├── orchestration/                       # Phase orchestrators (6 files)
│   ├── phase0-orchestrator.ts          # Raw capture & normalization
│   ├── phase1-orchestrator.ts          # AI analyses (10)
│   ├── phase2-orchestrator.ts          # Deep-dive cross-analysis (5)
│   ├── phase3-orchestrator.ts          # Executive synthesis (5)
│   ├── phase4-orchestrator.ts          # IDM generation
│   ├── phase5-orchestrator.ts          # Report generation (17)
│   ├── idm-consolidator.ts             # IDM consolidation logic (1195 lines)
│   ├── visualization-aggregator.ts     # Visualization collection
│   │
│   └── reports/                         # Report builders and components
│       ├── comprehensive-report.builder.ts
│       ├── owners-report.builder.ts
│       ├── executive-brief.builder.ts
│       ├── quick-wins-report.builder.ts
│       ├── risk-report.builder.ts
│       ├── roadmap-report.builder.ts
│       ├── financial-report.builder.ts
│       ├── deep-dive-report.builder.ts
│       ├── recipe-report.builder.ts
│       ├── html-template.ts             # Shared HTML generation
│       ├── index.ts
│       │
│       ├── config/                       # Report configuration
│       │   ├── section-mapping.ts       # Section ID mappings
│       │   ├── owner-report-constraints.ts
│       │   └── index.ts
│       │
│       ├── constants/                    # Report constants
│       │   ├── dimension-icons.ts       # Icon mappings
│       │   └── index.ts
│       │
│       ├── charts/                       # Chart generation
│       │   ├── chart-renderer.ts
│       │   ├── chart-accessibility.ts
│       │   ├── chart-theme.ts
│       │   ├── d3-chart-renderer.ts
│       │   ├── svg-chart-renderer.ts
│       │   ├── d3-chart-integration.ts
│       │   ├── report-chart-integration.ts
│       │   ├── index.ts
│       │   │
│       │   ├── d3/                       # D3.js chart implementations
│       │   │   ├── charts/
│       │   │   │   ├── gauge-chart.ts
│       │   │   │   ├── radar-chart.ts
│       │   │   │   ├── bar-chart.ts
│       │   │   │   ├── donut-chart.ts
│       │   │   │   ├── heatmap-chart.ts
│       │   │   │   ├── sparkline-chart.ts
│       │   │   │   ├── comparison-chart.ts
│       │   │   │   └── index.ts
│       │   │   ├── utils/
│       │   │   ├── types.ts
│       │   │   ├── theme.ts
│       │   │   └── index.ts
│       │   │
│       │   ├── generators/               # Chart generators
│       │   │   ├── radar-chart.generator.ts
│       │   │   ├── donut-chart.generator.ts
│       │   │   ├── score-bar-chart.generator.ts
│       │   │   ├── comparison-bar.generator.ts
│       │   │   └── index.ts
│       │   │
│       │   └── types/
│       │       └── chart.types.ts
│       │
│       ├── utils/                        # Report utilities
│       │   ├── markdown-sanitizer.ts
│       │   ├── number-formatter.ts
│       │   ├── color-utils.ts
│       │   ├── voice-transformer.ts
│       │   ├── conditional-renderer.ts
│       │   ├── reference-logger.ts
│       │   ├── accessibility-utils.ts
│       │   └── index.ts
│       │
│       ├── styles/                       # CSS styles
│       │   ├── unified-bizhealth-styles.ts
│       │   ├── typography.css
│       │   ├── variables.css
│       │   ├── visual-components.css
│       │   ├── report-enhancements.css
│       │   ├── print.css
│       │   └── index.ts
│       │
│       ├── components/                   # Report components
│       │   ├── key-takeaways.component.ts
│       │   ├── score-bar.component.ts
│       │   ├── benchmark-callout.component.ts
│       │   ├── evidence-citation.component.ts
│       │   ├── comprehensive-reference.component.ts
│       │   ├── legal-terms-disclaimers.component.ts
│       │   ├── index.ts
│       │   │
│       │   └── visual/                   # Visual components
│       │       ├── gauge.component.ts
│       │       ├── radar-chart.component.ts
│       │       ├── bar-chart.component.ts
│       │       ├── sparkline.component.ts
│       │       ├── heatmap.component.ts
│       │       ├── donut.component.ts
│       │       ├── table.component.ts
│       │       ├── metric-card.component.ts
│       │       ├── score-tile.component.ts
│       │       ├── benchmark-bar.component.ts
│       │       ├── kpi-dashboard.component.ts
│       │       ├── risk-matrix.component.ts
│       │       ├── roadmap-timeline.component.ts
│       │       ├── timeline.component.ts
│       │       ├── funnel.component.ts
│       │       ├── waterfall.component.ts
│       │       ├── action-card.component.ts
│       │       └── index.ts
│       │
│       └── validation/                   # Report validation
│           ├── section-mapping-validator.ts
│           ├── validate-reports.ts
│           └── index.ts
│
├── types/                               # TypeScript type definitions
│   ├── idm.types.ts                    # IDM schema (890 lines)
│   ├── webhook.types.ts                # Input webhook structure
│   ├── normalized.types.ts             # Normalized data types
│   ├── company-profile.types.ts        # Company profile types
│   ├── questionnaire.types.ts          # Questionnaire types
│   ├── report.types.ts                 # Report type definitions
│   ├── raw-input.types.ts              # Raw input types
│   ├── recipe.types.ts                 # Recipe types
│   └── visualization.types.ts          # Visualization types
│
├── prompts/                             # AI prompt templates
│   ├── tier1/                           # Tier 1 analysis prompts
│   │   ├── revenue-engine.prompts.ts
│   │   ├── operational-excellence.prompts.ts
│   │   ├── financial-strategic.prompts.ts
│   │   ├── people-leadership.prompts.ts
│   │   ├── compliance-sustainability.prompts.ts
│   │   └── index.ts
│   │
│   ├── tier2/                           # Tier 2 analysis prompts
│   │   ├── growth-readiness.prompts.ts
│   │   ├── market-position.prompts.ts
│   │   ├── resource-optimization.prompts.ts
│   │   ├── risk-resilience.prompts.ts
│   │   ├── scalability-readiness.prompts.ts
│   │   └── index.ts
│   │
│   ├── templates/                       # Prompt templates
│   │   ├── base-analysis-prompt.ts     # Base prompt with visualization output
│   │   ├── visualization-supplement.ts
│   │   └── index.ts
│   │
│   ├── shared/
│   │   └── visualization-instructions.ts
│   │
│   ├── parsers/                         # Response parsers
│   │   ├── analysis-response-parser.ts
│   │   └── index.ts
│   │
│   └── schemas/                         # Output schemas
│       ├── visualization-output.schema.ts
│       └── index.ts
│
├── api/                                 # API clients
│   ├── anthropic-client.ts             # Anthropic Batch API integration
│   └── report-endpoints.ts             # Report API endpoints
│
├── services/                            # Business logic services
│   ├── raw-assessment-storage.ts       # Raw data storage
│   ├── assessment-index.ts             # Assessment index management
│   ├── narrative-extraction.service.ts # Narrative extraction from AI output
│   ├── benchmark-lookup-service.ts     # Benchmark data retrieval
│   ├── confidence-scoring-framework.ts # Confidence scoring
│   └── lifecycle-modifier-engine.ts    # Lifecycle modifiers
│
├── data-transformation/                 # Data transformers
│   ├── company-profile-transformer.ts  # Company profile transformation
│   ├── questionnaire-transformer.ts    # Questionnaire transformation
│   ├── normalized-company-profile-transformer.ts
│   ├── normalized-questionnaire-transformer.ts
│   └── benchmark-service.ts            # Benchmark data service
│
├── validation/                          # Zod validation schemas
│   ├── schemas.ts                      # Main validation schemas
│   ├── normalized.schemas.ts           # Normalized data schemas
│   └── raw-input.schemas.ts            # Raw input schemas
│
├── visualization/                       # Visualization utilities
│   ├── integration.ts
│   ├── ascii-detector.ts               # ASCII art detection/removal
│   ├── index.ts
│   └── components/
│       └── gauge.ts
│
├── database/                            # Database integration
│   ├── db-client.ts
│   ├── queries.ts
│   ├── types.ts
│   └── index.ts
│
├── reporting/                           # Legacy reporting
│   ├── report-prompts.ts
│   ├── report-generator.ts
│   └── index.ts
│
├── reports/                             # Report generation
│   ├── report-generator.ts
│   └── index.ts
│
├── utils/                               # Utilities
│   ├── logger.ts                       # Pino logger
│   ├── errors.ts                       # Error types
│   ├── security.ts                     # Security utilities
│   ├── phase-consolidator.ts           # Phase consolidation
│   ├── recipe-validator.ts             # Recipe validation
│   └── benchmark-calculator.ts         # Benchmark calculations
│
├── scripts/                             # Utility scripts
│   └── render-pdf.ts                   # PDF rendering
│
├── data/                                # Static data
│   └── benchmark-database.json         # Benchmark data
│
└── __tests__/                           # Test files
    └── phase0.test.ts
```

---

## Phase 0: Raw Capture & Normalization

### Overview

**File**: `src/orchestration/phase0-orchestrator.ts`
**Purpose**: Transform raw webhook data into normalized, analysis-ready structures
**Duration**: ~100ms
**AI Calls**: None

### Sub-Phases

#### Phase 0A: Raw Capture
- Receives webhook payload from questionnaire submission
- Stores raw data immutably with audit metadata
- Generates unique assessment_run_id (UUID v4)

#### Phase 0B: Normalization
- Transforms raw data into two normalized structures:
  1. **NormalizedCompanyProfile**: Company metadata, benchmark selectors
  2. **NormalizedQuestionnaireResponses**: Questions organized by chapter/dimension

#### Benchmark Retrieval
- Matches company profile to industry benchmarks
- Uses hierarchical fallback logic for best match
- Returns percentile distributions for all metrics

### Key Types

```typescript
// Phase 0 Output Bundle
interface Phase0Output {
  assessment_run_id: string;
  companyProfile: NormalizedCompanyProfile;
  questionnaireResponses: NormalizedQuestionnaireResponses;
  benchmarkData: NormalizedBenchmarkData;
  indexEntry: AssessmentIndexEntry;
}

// Normalized Company Profile
interface NormalizedCompanyProfile {
  metadata: NormalizedCPMetadata;
  company_name: string;
  location: { city: string; state: string; country: string };
  industry: { code: string; name: string; vertical: string };
  financials: { /* revenue, projections */ };
  employees: { /* headcount by type */ };
  products_services: ProductService[];
  competitors: Competitor[];
  current_challenges: string[];
  benchmark_selectors: BenchmarkSelectors;
}

// Normalized Questionnaire Responses
interface NormalizedQuestionnaireResponses {
  meta: NormalizedQRMetadata;
  chapters: NormalizedChapter[];  // 4 chapters
  overall_metrics: {
    total_questions: number;      // 87
    completion_rate: number;
    overall_avg_normalized_score: number;
    chapter_scores: Record<ChapterCode, number>;
    dimension_scores: Record<DimensionCode, number>;
  };
  derived_metrics: {
    sales_velocity?: number;
    cac_ltv_ratio?: number;
    cash_ratio?: number;
    debt_to_asset_ratio?: number;
    capacity_utilization_avg?: number;
    growth_gap?: number;
  };
}
```

### Dimension to Question Mapping

Each of the 87 questions maps to a specific dimension:

| Dimension | Question Count | Question IDs |
|-----------|---------------|--------------|
| STR (Strategy) | 7 | STR_01 - STR_07 |
| SAL (Sales) | 8 | SAL_01 - SAL_08 |
| MKT (Marketing) | 9 | MKT_01 - MKT_09 |
| CXP (Customer Experience) | 5 | CXP_01 - CXP_05 |
| OPS (Operations) | 8 | OPS_01 - OPS_08 |
| FIN (Financials) | 10 | FIN_01 - FIN_10 |
| HRS (Human Resources) | 8 | HRS_01 - HRS_08 |
| LDG (Leadership) | 7 | LDG_01 - LDG_07 |
| TIN (Technology/Innovation) | 8 | TIN_01 - TIN_08 |
| IDS (IT/Data/Systems) | 7 | IDS_01 - IDS_07 |
| RMS (Risk Management) | 7 | RMS_01 - RMS_07 |
| CMP (Compliance) | 3 | CMP_01 - CMP_03 |

### Output Files

- `output/phase0_output.json` - Complete Phase 0 output bundle
- `data/raw/{assessment_run_id}/raw_assessment.json` - Immutable raw data

---

## Phase 1: Cross-functional AI Analyses

### Overview

**File**: `src/orchestration/phase1-orchestrator.ts`
**Purpose**: Execute 10 AI analyses across business dimensions
**Duration**: 4-5 minutes
**AI Calls**: 10 (via Anthropic Batch API)

### Analysis Structure

Phase 1 executes in two tiers:

#### Tier 1: Foundational Analyses (5)

| Analysis | Prompt File | Dimensions | Purpose |
|----------|-------------|------------|---------|
| **Revenue Engine** | `tier1/revenue-engine.prompts.ts` | STR, SAL, MKT, CXP | Revenue generation, customer acquisition economics |
| **Operational Excellence** | `tier1/operational-excellence.prompts.ts` | OPS | Workflow efficiency, reliability, utilization |
| **Financial Strategic** | `tier1/financial-strategic.prompts.ts` | FIN | Cash flow, profitability, financial readiness |
| **People & Leadership** | `tier1/people-leadership.prompts.ts` | HRS, LDG | HR infrastructure, culture, leadership effectiveness |
| **Compliance & Sustainability** | `tier1/compliance-sustainability.prompts.ts` | RMS, CMP | Regulatory compliance, sustainability practices |

#### Tier 2: Interconnection Analyses (5)

Tier 2 analyses depend on Tier 1 outputs:

| Analysis | Prompt File | Dependencies | Purpose |
|----------|-------------|--------------|---------|
| **Growth Readiness** | `tier2/growth-readiness.prompts.ts` | All Tier 1 | Cross-functional growth capability |
| **Market Position** | `tier2/market-position.prompts.ts` | Revenue Engine | Competitive dynamics, market positioning |
| **Resource Optimization** | `tier2/resource-optimization.prompts.ts` | Operational, Financial | Resource utilization efficiency |
| **Risk & Resilience** | `tier2/risk-resilience.prompts.ts` | All Tier 1 | Risk landscape, business resilience |
| **Scalability Readiness** | `tier2/scalability-readiness.prompts.ts` | All Tier 1 | Infrastructure scalability |

### AI Configuration

```typescript
const PHASE1_CONFIG = {
  model: 'claude-opus-4-5-20251101',
  max_tokens: 64000,
  thinking: {
    type: 'enabled',
    budget_tokens: 32000
  },
  temperature: 1.0  // Required for extended thinking
};
```

### Prompt Structure

Each analysis prompt follows this structure:

```typescript
// System Prompt (defines AI role and expertise)
export const systemPrompt = `
# SYSTEM PROMPT: Tier 1 Cross-Functional Analysis
## Analysis Type: Revenue Engine Analysis

### Your Role & Expertise
You are a senior business consultant with 20+ years of experience...

### Analysis Scope
1. Strategy (Questions 1-7)
2. Sales (Questions 1-8)
3. Marketing (Questions 1-9)
4. Customer Experience (Questions 1-5)

### Analytical Frameworks & Standards
- Customer Lifetime Value (CLV) Framework
- Sales Funnel / Pipeline Management Framework
- Strategic Planning Maturity Assessment
- Revenue Operations (RevOps) Framework
- Industry Benchmark Comparison Framework
`;

// User Prompt (contains actual data)
export function buildUserPrompt(
  companyProfile: CompanyProfile,
  questionnaireResponses: QuestionnaireResponses,
  benchmarkData: BenchmarkData
): string {
  return `...`;
}
```

### Visualization Output Format

AI outputs structured JSON with visualizations:

```json
{
  "analysisType": "revenue_engine",
  "narrative": {
    "executiveSummary": "...",
    "sections": [
      {
        "id": "strategy_assessment",
        "title": "Strategy Assessment",
        "content": "As shown in [viz:strategy_health_score]...",
        "visualizationRefs": ["strategy_health_score", "growth_trend"]
      }
    ]
  },
  "visualizations": [
    {
      "id": "strategy_health_score",
      "type": "gauge",
      "data": { "value": 72, "max": 100, "benchmark": 65, "trend": "up" },
      "context": { "dimension": "STR", "chapter": "GE", "label": "Strategy Health" }
    }
  ],
  "metadata": {
    "dimensionsCovered": ["STR", "SAL", "MKT", "CXP"],
    "confidenceLevel": "high",
    "dataQuality": "complete"
  }
}
```

### Visualization Types

| Type | Purpose | Data Structure |
|------|---------|---------------|
| `gauge` | Scores, health metrics | `{ value, max, benchmark, trend }` |
| `bar` | Comparisons | `{ clientValue, benchmarkValue, unit, higherIsBetter }` |
| `radar` | Multi-dimensional views | `{ dimensions[], clientValues[], benchmarkValues[] }` |
| `comparison` | Metric tables | `{ metrics: [{ label, clientValue, benchmarkValue, status }] }` |
| `heatmap` | Matrices | `{ rows[], columns[], values[][] }` |
| `sparkline` | Trends | `{ points[], labels[], highlightLast }` |

### Output Structure

```typescript
interface Phase1Results {
  phase: 'phase_1';
  status: 'complete' | 'partial' | 'failed';
  company_profile_id: string;
  tier1: {
    revenue_engine: AnalysisOutput;
    operational_excellence: AnalysisOutput;
    financial_strategic: AnalysisOutput;
    people_leadership: AnalysisOutput;
    compliance_sustainability: AnalysisOutput;
  };
  tier2: {
    growth_readiness: AnalysisOutput;
    market_position: AnalysisOutput;
    resource_optimization: AnalysisOutput;
    risk_resilience: AnalysisOutput;
    scalability_readiness: AnalysisOutput;
  };
  metadata: {
    started_at: string;
    completed_at: string;
    duration_ms: number;
    tier1_batch_id: string;
    tier2_batch_id: string;
    total_input_tokens: number;
    total_output_tokens: number;
  };
}
```

---

## Phase 2: Deep-dive Cross-analysis

### Overview

**File**: `src/orchestration/phase2-orchestrator.ts`
**Purpose**: Generate 5 synthesis analyses from Phase 1 results
**Duration**: 2-3 minutes
**AI Calls**: 5 (via Anthropic Batch API)

### Analyses

| Analysis | Purpose | Inputs |
|----------|---------|--------|
| **Cross-Dimensional** | Identify patterns across dimensions | All Tier 1 + Tier 2 |
| **Strategic Recommendations** | Prioritized, actionable recommendations | Phase 1 findings |
| **Consolidated Risks** | Comprehensive risk inventory | Risk-related findings |
| **Growth Opportunities** | High-potential growth areas | Growth-related analyses |
| **Implementation Roadmap** | Phased execution plan | All recommendations |

### Output Structure

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
  summary: {
    total_recommendations: number;
    total_risks_identified: number;
    total_opportunities: number;
    roadmap_phases: number;
  };
  metadata: {
    started_at: string;
    completed_at: string;
    duration_ms: number;
    batch_id: string;
  };
}
```

---

## Phase 3: Executive Synthesis

### Overview

**File**: `src/orchestration/phase3-orchestrator.ts`
**Purpose**: Generate executive-level outputs with overall health score
**Duration**: 2-3 minutes
**AI Calls**: 5 (via Anthropic Batch API)

### Outputs

| Output | Purpose | Key Content |
|--------|---------|-------------|
| **Executive Summary** | High-level strategic overview | 2-3 page executive summary |
| **Scorecard** | Quantified health metrics | Overall score (0-100), chapter scores |
| **Action Matrix** | Prioritized actions | Impact/urgency matrix |
| **Investment Roadmap** | Financial projections | ROI, investment requirements |
| **Final Recommendations** | Risk-adjusted guidance | Top 5-10 strategic priorities |

### Health Score Calculation

```typescript
interface Phase3Summary {
  overall_health_score: number;    // 0-100, weighted average
  health_status: ScoreBand;        // Excellence/Proficiency/Attention/Critical
  chapter_scores: {
    GE: number;
    PH: number;
    PL: number;
    RS: number;
  };
  critical_risks_count: number;
  high_priority_actions_count: number;
  total_investment_required: string;
  expected_roi: string;
}
```

### Score Bands

| Band | Range | Description |
|------|-------|-------------|
| **Excellence** | 80-100 | Exceptional performance, strategic leadership position |
| **Proficiency** | 60-79 | Solid performance, competitive positioning |
| **Attention** | 40-59 | Needs improvement, strategic vulnerabilities |
| **Critical** | 0-39 | Urgent intervention required |

---

## Phase 4: IDM Consolidation

### Overview

**File**: `src/orchestration/idm-consolidator.ts` (1,195 lines)
**Purpose**: Consolidate all phases into canonical Insights Data Model
**Duration**: <1 second
**AI Calls**: None

### Consolidation Process

```typescript
function consolidateIDM(input: IDMConsolidatorInput): IDMConsolidationResult {
  // 1. Build company profile from Phase 0
  const companyProfile = buildCompanyProfile(input.companyProfile);

  // 2. Extract questions organized by dimension
  const questions = extractQuestions(input.questionnaireResponses);

  // 3. Build 12 dimensions from Phase 1-3 content
  const dimensions = buildDimensions(input.phase1Results, input.phase2Results, questions);

  // 4. Build 4 chapters from dimensions
  const chapters = buildChapters(dimensions, input.phase1Results, input.phase2Results);

  // 5. Extract and categorize findings
  const findings = extractFindings(input.phase1Results, input.phase2Results);

  // 6. Extract recommendations with priorities
  const recommendations = extractRecommendations(input.phase1Results, input.phase2Results, input.phase3Results);

  // 7. Identify quick wins (high impact, low effort)
  const quickWins = identifyQuickWins(recommendations);

  // 8. Extract and categorize risks
  const risks = extractRisks(input.phase1Results, input.phase2Results, input.phase3Results);

  // 9. Build implementation roadmap
  const roadmap = buildRoadmap(recommendations, input.phase3Results);

  // 10. Calculate health scores
  const scoresSummary = calculateScores(dimensions, chapters, input.phase3Results);

  // 11. Collect visualizations
  const visualizations = collectVisualizations(input.phase1Results, input.phase2Results);

  // 12. Validate with Zod schema
  const idm = IDMSchema.parse({
    metadata,
    scores_summary,
    chapters,
    findings,
    recommendations,
    quick_wins,
    risks,
    roadmap,
    visualizations
  });

  return { success: true, idm };
}
```

### Key Functions

| Function | Purpose |
|----------|---------|
| `extractQuestions()` | Maps questionnaire responses to IDM question format |
| `buildDimensions()` | Creates 12 dimension objects with scores and narratives |
| `buildChapters()` | Groups dimensions into 4 chapters |
| `extractFindings()` | Extracts key findings from AI analyses |
| `extractRecommendations()` | Extracts and prioritizes recommendations |
| `identifyQuickWins()` | Filters for high-impact, low-effort recommendations |
| `extractRisks()` | Extracts and categorizes risks by severity |
| `buildRoadmap()` | Creates phased implementation plan |
| `calculateScores()` | Computes weighted health scores |

---

## Phase 5: Report Generation

### Overview

**File**: `src/orchestration/phase5-orchestrator.ts` (780 lines)
**Purpose**: Generate 17 HTML reports from IDM
**Duration**: ~100ms
**AI Calls**: None

### Report Generation Process

```typescript
async function executePhase5(config: Phase5Config): Promise<Phase5Result> {
  // 1. Load Phase 0-4 outputs
  const phase0 = await loadPhaseOutput('phase0');
  const phase1 = await loadPhaseOutput('phase1');
  const phase2 = await loadPhaseOutput('phase2');
  const phase3 = await loadPhaseOutput('phase3');
  const phase4 = await loadPhaseOutput('phase4');
  const idm = await loadIDM();

  // 2. Extract narrative content from phase outputs
  const narratives = NarrativeExtractionService.extract(phase1, phase2, phase3);

  // 3. Build report context
  const ctx: ReportContext = {
    idm,
    companyProfile: phase0.companyProfile,
    phase1Output: phase1,
    phase2Output: phase2,
    phase3Output: phase3,
    narrativeContent: narratives,
    runId: config.runId,
    metadata: { generatedAt: new Date().toISOString() }
  };

  // 4. Generate each report type
  const reports = await Promise.all(
    config.reportTypes.map(type => generateReport(type, ctx, options))
  );

  // 5. Write reports to output directory
  await writeReports(reports, outputDir);

  // 6. Generate manifest
  await writeManifest(reports, outputDir);

  return { phase: 'phase_5', status: 'complete', reports };
}
```

### Report Builders

| Report Type | Builder File | Audience |
|-------------|--------------|----------|
| Comprehensive | `comprehensive-report.builder.ts` | Board, executives |
| Owner | `owners-report.builder.ts` | Business owners |
| Executive Brief | `executive-brief.builder.ts` | C-suite |
| Quick Wins | `quick-wins-report.builder.ts` | Operations |
| Risk | `risk-report.builder.ts` | Risk committee |
| Roadmap | `roadmap-report.builder.ts` | Project managers |
| Financial | `financial-report.builder.ts` | CFO, finance |
| Deep Dive (4) | `deep-dive-report.builder.ts` | Department heads |
| Manager (6) | Various builders | Functional managers |

### Output Structure

```
output/reports/{run-id}/
├── manifest.json                   # Report inventory
├── comprehensive.html              # ~50 pages
├── owner.html                      # ~20 pages
├── executiveBrief.html            # 2-3 pages
├── quickWins.html                 # 5-10 pages
├── risk.html                      # 10-15 pages
├── roadmap.html                   # 10-15 pages
├── financial.html                 # 10-15 pages
├── deep-dive-ge.html              # 15-20 pages
├── deep-dive-ph.html              # 10-15 pages
├── deep-dive-pl.html              # 10-15 pages
├── deep-dive-rs.html              # 15-20 pages
├── employees.html                 # 5-10 pages
├── managersOperations.html        # 10-15 pages
├── managersSalesMarketing.html    # 10-15 pages
├── managersFinancials.html        # 10-15 pages
├── managersStrategy.html          # 10-15 pages
└── managersItTechnology.html      # 10-15 pages
```

---

## The Insights Data Model (IDM)

### Overview

**File**: `src/types/idm.types.ts` (890 lines)
**Purpose**: Canonical data structure for all report generation

### Complete IDM Schema

```typescript
interface IDM {
  metadata: IDMMetadata;
  scores_summary: ScoresSummary;
  chapters: Chapter[];              // 4 chapters
  findings: Finding[];              // Key findings
  recommendations: Recommendation[]; // Prioritized recommendations
  quick_wins: QuickWin[];           // High-impact, low-effort
  risks: Risk[];                    // Categorized risks
  roadmap: RoadmapPhase[];          // Implementation phases
  visualizations: Visualization[];   // Chart data
}

interface IDMMetadata {
  assessment_run_id: string;
  company_profile_id: string;
  company_name: string;
  industry: string;
  assessment_date: string;
  generated_at: string;
  pipeline_version: string;
  idm_version: string;
}

interface ScoresSummary {
  overall_health_score: number;     // 0-100
  overall_band: ScoreBand;
  chapter_scores: Record<ChapterCode, ChapterScore>;
  dimension_scores: Record<DimensionCode, number>;
  benchmarks: {
    overall_benchmark: number;
    industry_percentile: number;
  };
}

interface Chapter {
  code: ChapterCode;                // GE, PH, PL, RS
  name: string;
  description: string;
  score: number;
  band: ScoreBand;
  dimensions: Dimension[];          // 2-4 dimensions per chapter
  key_insights: string[];
  critical_issues: string[];
}

interface Dimension {
  code: DimensionCode;              // STR, SAL, MKT, etc.
  name: string;
  description: string;
  chapter: ChapterCode;
  score: number;
  band: ScoreBand;
  benchmark: number;
  trend: 'improving' | 'stable' | 'declining';
  questions: IDMQuestion[];
  sub_indicators: SubIndicator[];
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  narrative: string;                // AI-generated analysis
}

interface Finding {
  id: string;
  type: 'strength' | 'weakness' | 'opportunity' | 'threat';
  severity: 'critical' | 'high' | 'medium' | 'low';
  dimension: DimensionCode;
  chapter: ChapterCode;
  title: string;
  description: string;
  evidence: string[];
  impact: string;
}

interface Recommendation {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  dimension: DimensionCode;
  chapter: ChapterCode;
  title: string;
  description: string;
  rationale: string;
  expected_impact: string;
  effort_level: 'low' | 'medium' | 'high';
  timeframe: 'immediate' | 'short-term' | 'medium-term' | 'long-term';
  dependencies: string[];
  success_metrics: string[];
  estimated_cost?: string;
  estimated_roi?: string;
}

interface QuickWin {
  id: string;
  dimension: DimensionCode;
  title: string;
  description: string;
  impact: 'high' | 'medium';
  effort: 'low';
  timeframe: 'immediate' | 'short-term';
  steps: string[];
  expected_outcome: string;
}

interface Risk {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  likelihood: 'high' | 'medium' | 'low';
  category: string;
  dimension: DimensionCode;
  chapter: ChapterCode;
  title: string;
  description: string;
  potential_impact: string;
  mitigation_strategy: string;
  owner?: string;
  timeline?: string;
}

interface RoadmapPhase {
  phase: number;
  name: string;
  timeframe: string;              // "0-30 days", "30-90 days", etc.
  focus_areas: string[];
  key_initiatives: RoadmapInitiative[];
  dependencies: string[];
  success_metrics: string[];
  estimated_investment: string;
  expected_outcomes: string[];
}
```

### Question Mappings

The IDM contains 87 question mappings:

```typescript
const QUESTION_MAPPINGS: QuestionMapping[] = [
  // Strategy (7 questions)
  { questionId: 'STR_01', dimension: 'STR', subIndicator: 'competitive_differentiation', weight: 0.15 },
  { questionId: 'STR_02', dimension: 'STR', subIndicator: 'market_share', weight: 0.12 },
  { questionId: 'STR_03', dimension: 'STR', subIndicator: 'sales_growth', weight: 0.15 },
  { questionId: 'STR_04', dimension: 'STR', subIndicator: 'business_goals', weight: 0.20 },
  { questionId: 'STR_05', dimension: 'STR', subIndicator: 'goals_barriers', weight: 0.10 },
  { questionId: 'STR_06', dimension: 'STR', subIndicator: 'plan_review', weight: 0.15 },
  { questionId: 'STR_07', dimension: 'STR', subIndicator: 'growth_exit_plan', weight: 0.13 },

  // Sales (8 questions)
  { questionId: 'SAL_01', dimension: 'SAL', subIndicator: 'sales_mix', weight: 0.10 },
  { questionId: 'SAL_02', dimension: 'SAL', subIndicator: 'target_alignment', weight: 0.15 },
  // ... 85 more mappings
];
```

### Dimension Weights

```typescript
const DIMENSION_WEIGHTS: Record<DimensionCode, number> = {
  STR: 0.10,  // Strategy - high impact on direction
  SAL: 0.09,  // Sales - revenue generation
  MKT: 0.08,  // Marketing - demand generation
  CXP: 0.08,  // Customer Experience - retention
  OPS: 0.09,  // Operations - efficiency
  FIN: 0.10,  // Financials - high impact on viability
  HRS: 0.08,  // Human Resources - talent
  LDG: 0.10,  // Leadership - high multiplier effect
  TIN: 0.08,  // Technology & Innovation
  IDS: 0.07,  // IT/Data/Systems
  RMS: 0.07,  // Risk Management
  CMP: 0.06   // Compliance - foundational
};
// Total: 1.00
```

---

## AI Prompt Engineering

### Prompt Architecture

All prompts follow a consistent structure defined in `src/prompts/templates/base-analysis-prompt.ts`:

```typescript
// 1. System Prompt (role + expertise + frameworks)
const systemPrompt = `
# SYSTEM PROMPT: [Analysis Type]

### Your Role & Expertise
You are a senior business consultant with 20+ years of experience...

### Analysis Scope
[Dimensions and questions covered]

### Analytical Frameworks & Standards
- [Framework 1]
- [Framework 2]
...
`;

// 2. User Prompt (data + instructions)
function buildUserPrompt(data): string {
  return `
## COMPANY CONTEXT
${companyContext}

## QUESTIONNAIRE DATA
${questionnaireData}

## BENCHMARK DATA
${benchmarkData}

## ANALYSIS INSTRUCTIONS
${specificInstructions}

${ANALYSIS_QUALITY_STANDARDS}
${VISUALIZATION_OUTPUT_INSTRUCTIONS}
`;
}
```

### Visualization Output Instructions

```typescript
const VISUALIZATION_OUTPUT_INSTRUCTIONS = `
## OUTPUT FORMAT REQUIREMENTS

Your response MUST be valid JSON conforming to the following structure.
Do NOT include any text outside the JSON block.
Do NOT use ASCII graphics, progress bars, or text-based visualizations.

### Required JSON Structure:

{
  "analysisType": "string",
  "narrative": {
    "executiveSummary": "2-3 sentence summary",
    "sections": [
      {
        "id": "unique_section_id",
        "title": "Section Title",
        "content": "Markdown content with [viz:id] references",
        "visualizationRefs": ["viz_id_1", "viz_id_2"]
      }
    ]
  },
  "visualizations": [
    {
      "id": "unique_id",
      "type": "gauge|bar|radar|comparison|heatmap|sparkline",
      "data": { /* type-specific data */ },
      "context": {
        "dimension": "STR",
        "chapter": "GE",
        "label": "Display Label",
        "placement": "section_header|inline|comparison_block"
      }
    }
  ],
  "metadata": {
    "dimensionsCovered": ["STR", "SAL"],
    "confidenceLevel": "high|medium|low",
    "dataQuality": "complete|partial|limited"
  }
}

### CRITICAL RULES:
1. NEVER use ASCII characters for visualizations
2. ALWAYS reference visualizations by ID: [viz:visualization_id]
3. ALWAYS include benchmark data when available
4. Output ONLY valid JSON
`;
```

### Analytical Frameworks Applied

| Analysis | Frameworks |
|----------|------------|
| Revenue Engine | CLV Economics, Sales Funnel, RevOps, Strategic Planning Maturity |
| Operational Excellence | Lean/Six Sigma, OEE, Capacity Planning |
| Financial Strategic | DuPont Analysis, Cash Flow Analysis, Working Capital |
| People & Leadership | Employee Lifecycle, Leadership Competency, Culture Assessment |
| Compliance & Sustainability | GRC Framework, ESG Assessment, Risk Management |

---

## Visualization System

### Architecture

The visualization system has two layers:

1. **AI Output Layer**: Structured JSON from AI analyses
2. **Rendering Layer**: HTML/SVG generation in report builders

### Visualization Types

#### Gauge
```typescript
interface GaugeVisualization {
  id: string;
  type: 'gauge';
  data: {
    value: number;      // Current score
    max: number;        // Maximum (usually 100)
    benchmark: number;  // Industry benchmark
    trend: 'up' | 'down' | 'flat';
  };
  context: {
    dimension?: DimensionCode;
    chapter?: ChapterCode;
    label: string;
    placement: 'section_header' | 'inline';
  };
}
```

#### Bar Chart
```typescript
interface BarVisualization {
  id: string;
  type: 'bar';
  data: {
    clientValue: number;
    benchmarkValue: number;
    unit: string;           // "%", "$", "days", etc.
    higherIsBetter: boolean;
  };
  context: {
    dimension?: DimensionCode;
    label: string;
    placement: 'inline' | 'comparison_block';
  };
}
```

#### Radar Chart
```typescript
interface RadarVisualization {
  id: string;
  type: 'radar';
  data: {
    dimensions: string[];      // Axis labels
    clientValues: number[];    // Client scores
    benchmarkValues: number[]; // Benchmark scores
  };
  context: {
    chapter?: ChapterCode;
    label: string;
    placement: 'section_header';
  };
}
```

#### Comparison Table
```typescript
interface ComparisonVisualization {
  id: string;
  type: 'comparison';
  data: {
    metrics: Array<{
      label: string;
      clientValue: number;
      benchmarkValue: number;
      status: 'good' | 'caution' | 'critical';
    }>;
  };
  context: {
    dimension?: DimensionCode;
    label: string;
    placement: 'comparison_block';
  };
}
```

### Chart Rendering

Charts are rendered using D3.js in `src/orchestration/reports/charts/`:

```typescript
// Gauge chart rendering
export function renderGaugeChart(data: GaugeData): string {
  const svg = d3.create('svg')
    .attr('width', 200)
    .attr('height', 120);

  // Draw arc
  const arc = d3.arc()
    .innerRadius(40)
    .outerRadius(55)
    .startAngle(-Math.PI / 2)
    .endAngle(Math.PI / 2);

  // ... render gauge

  return svg.node().outerHTML;
}
```

---

## Report Builder Architecture

### Builder Pattern

Each report builder follows a consistent pattern:

```typescript
export async function buildReport(
  ctx: ReportContext,
  options: ReportRenderOptions
): Promise<GeneratedReport> {
  // 1. Extract relevant data from context
  const { idm, companyProfile, narrativeContent } = ctx;

  // 2. Generate sections
  const sections = [
    generateHeader(ctx, reportName),
    generateTableOfContents(tocItems),
    generateExecutiveSummary(idm, narratives),
    generateScorecard(idm.scores_summary),
    // ... more sections
    generateFooter(ctx)
  ];

  // 3. Generate charts
  const charts = await Promise.all([
    generateChapterRadar(ctx),
    generateScoreBars(ctx),
    // ... more charts
  ]);

  // 4. Wrap in HTML document
  const html = wrapHtmlDocument(
    sections.join('\n'),
    {
      title: reportName,
      styles: generateUnifiedStyles(),
      scripts: getChartScripts()
    }
  );

  return {
    type: reportType,
    name: reportName,
    html,
    metadata: { generatedAt: new Date().toISOString() }
  };
}
```

### ReportContext Interface

```typescript
interface ReportContext {
  idm: IDM;
  companyProfile: NormalizedCompanyProfile;
  phase1Output: Phase1Results;
  phase2Output: Phase2Results;
  phase3Output: Phase3Results;
  narrativeContent: NarrativeContent;
  runId: string;
  metadata: {
    generatedAt: string;
    pipelineVersion: string;
  };
}
```

### Visual Components

Located in `src/orchestration/reports/components/visual/`:

| Component | File | Purpose |
|-----------|------|---------|
| Gauge | `gauge.component.ts` | Score visualization |
| Radar Chart | `radar-chart.component.ts` | Multi-dimensional comparison |
| Bar Chart | `bar-chart.component.ts` | Value comparisons |
| Sparkline | `sparkline.component.ts` | Trend visualization |
| Heatmap | `heatmap.component.ts` | Matrix visualization |
| Score Tile | `score-tile.component.ts` | Score cards |
| Metric Card | `metric-card.component.ts` | KPI display |
| Risk Matrix | `risk-matrix.component.ts` | Risk visualization |
| Roadmap Timeline | `roadmap-timeline.component.ts` | Implementation timeline |
| KPI Dashboard | `kpi-dashboard.component.ts` | Dashboard layout |

---

## Service Layer

### Raw Assessment Storage

**File**: `src/services/raw-assessment-storage.ts`

Handles immutable storage of raw webhook data:

```typescript
class RawAssessmentStorageService {
  async store(webhookPayload: WebhookPayload): Promise<StorageResult> {
    const runId = generateUUID();
    const path = `data/raw/${runId}/raw_assessment.json`;

    await fs.writeFile(path, JSON.stringify({
      payload: webhookPayload,
      metadata: {
        received_at: new Date().toISOString(),
        source: 'webhook',
        version: SCHEMA_VERSION
      }
    }));

    return { runId, path };
  }
}
```

### Narrative Extraction Service

**File**: `src/services/narrative-extraction.service.ts`

Extracts AI-generated narratives from phase outputs:

```typescript
class NarrativeExtractionService {
  static extract(
    phase1Output: Phase1Results,
    phase2Output: Phase2Results,
    phase3Output: Phase3Results
  ): NarrativeContent {
    return {
      phase1: {
        tier1: {
          revenueEngine: this.safeGetContent(phase1.tier1, 'revenue_engine'),
          operationalExcellence: this.safeGetContent(phase1.tier1, 'operational_excellence'),
          // ...
        },
        tier2: { /* ... */ }
      },
      phase2: { /* ... */ },
      phase3: { /* ... */ },
      metadata: {
        totalWords: this.countTotalWords(content),
        contentSufficient: totalWords >= 15000
      }
    };
  }

  static markdownToHtml(markdown: string): string {
    return convertMarkdownToHtml(markdown);
  }
}
```

### Benchmark Lookup Service

**File**: `src/services/benchmark-lookup-service.ts`

Retrieves industry benchmarks with hierarchical fallback:

```typescript
class BenchmarkLookupService {
  async lookup(selectors: BenchmarkSelectors): Promise<BenchmarkMatchResult> {
    // Try exact match
    let result = await this.exactMatch(selectors);
    if (result) return { dataset: result, match_level: 'exact' };

    // Fallback 1: Relax revenue cohort
    result = await this.fallback1(selectors);
    if (result) return { dataset: result, match_level: 'fallback_1' };

    // Fallback 2: Relax employee cohort
    // Fallback 3: Relax industry vertical
    // Fallback 4: Use general industry benchmarks

    return { dataset: generalBenchmarks, match_level: 'fallback_4' };
  }
}
```

---

## Data Transformation Layer

### Company Profile Transformer

**File**: `src/data-transformation/company-profile-transformer.ts`

Transforms raw webhook data to NormalizedCompanyProfile:

```typescript
function transformCompanyProfile(
  webhook: WebhookPayload
): NormalizedCompanyProfile {
  const overview = webhook.business_overview;

  return {
    metadata: {
      profile_id: generateProfileId(overview.company_name),
      snapshot_id: generateUUID(),
      assessment_run_id: '', // Set by orchestrator
      created_at: new Date().toISOString(),
      // ...
    },
    company_name: overview.company_name,
    location: {
      city: extractCity(overview.location),
      state: extractState(overview.location),
      country: overview.country
    },
    industry: {
      code: mapIndustryCode(overview.industry),
      name: overview.industry,
      vertical: determineVertical(overview.industry)
    },
    financials: {
      last_year_revenue: overview.last_year_revenue,
      projected_revenue: overview.projected_revenue,
      revenue_growth_rate: calculateGrowthRate(overview),
      // ...
    },
    employees: {
      total_headcount: calculateTotalHeadcount(overview),
      full_time: overview.full_time_employees,
      part_time: overview.part_time_employees,
      // ...
    },
    benchmark_selectors: deriveBenchmarkSelectors(overview)
  };
}
```

### Questionnaire Transformer

**File**: `src/data-transformation/questionnaire-transformer.ts`

Transforms raw responses to NormalizedQuestionnaireResponses:

```typescript
function transformQuestionnaire(
  webhook: WebhookPayload,
  assessmentRunId: string
): NormalizedQuestionnaireResponses {
  const chapters: NormalizedChapter[] = [];

  // Transform each chapter
  for (const [code, dimensionCodes] of Object.entries(CHAPTER_DIMENSIONS)) {
    const dimensions = dimensionCodes.map(dimCode =>
      transformDimension(webhook, dimCode)
    );

    chapters.push({
      chapter_code: code as ChapterCode,
      name: CHAPTER_NAMES[code],
      dimensions,
      chapter_metrics: calculateChapterMetrics(dimensions)
    });
  }

  return {
    meta: {
      response_id: generateUUID(),
      assessment_run_id: assessmentRunId,
      // ...
    },
    chapters,
    overall_metrics: calculateOverallMetrics(chapters),
    derived_metrics: calculateDerivedMetrics(webhook)
  };
}
```

---

## Validation Framework

### Zod Schemas

**File**: `src/validation/schemas.ts`

All data is validated with Zod schemas:

```typescript
// Common schemas
const DateTimeSchema = z.string().datetime();
const UuidSchema = z.string().uuid();
const PercentageSchema = z.number().min(0).max(100);
const ScaleRatingSchema = z.number().min(1).max(10);

// Webhook validation
const WebhookPayloadSchema = z.object({
  event: z.string(),
  timestamp: DateTimeSchema,
  submission_id: z.string(),
  business_overview: BusinessOverviewSchema,
  strategy: StrategyResponsesSchema,
  sales: SalesResponsesSchema,
  // ... all sections
});

// IDM validation
const IDMSchema = z.object({
  metadata: IDMMetadataSchema,
  scores_summary: ScoresSummarySchema,
  chapters: z.array(ChapterSchema).length(4),
  findings: z.array(FindingSchema),
  recommendations: z.array(RecommendationSchema),
  quick_wins: z.array(QuickWinSchema),
  risks: z.array(RiskSchema),
  roadmap: z.array(RoadmapPhaseSchema),
  visualizations: z.array(VisualizationSchema)
});
```

### Validation at Boundaries

```typescript
// Phase 0 input validation
const validatedWebhook = WebhookPayloadSchema.parse(rawWebhook);

// Phase 1 output validation
const validatedResults = Phase1ResultsSchema.parse(batchResults);

// IDM validation
const validatedIDM = IDMSchema.parse(consolidatedIDM);
```

---

## API Integration

### Anthropic Batch API Client

**File**: `src/api/anthropic-client.ts`

```typescript
class AnthropicBatchClient {
  private client: Anthropic;
  private logger: Logger;

  async createBatch(requests: BatchRequest[]): Promise<BatchJob> {
    const batch = await this.client.messages.batches.create({
      requests: requests.map(req => ({
        custom_id: req.custom_id,
        params: {
          model: req.params.model,
          max_tokens: req.params.max_tokens,
          messages: req.params.messages,
          thinking: req.params.thinking,
          temperature: req.params.temperature
        }
      }))
    });

    return batch;
  }

  async pollUntilComplete(batchId: string): Promise<BatchResult[]> {
    while (true) {
      const status = await this.client.messages.batches.retrieve(batchId);

      if (status.processing_status === 'ended') {
        return await this.retrieveResults(batchId);
      }

      await this.delay(POLL_INTERVAL_MS);
    }
  }

  async retrieveResults(batchId: string): Promise<BatchResult[]> {
    const results = [];

    for await (const result of this.client.messages.batches.results(batchId)) {
      results.push(result);
    }

    return results;
  }
}
```

### Batch Request Structure

```typescript
interface BatchRequest {
  custom_id: string;  // Analysis identifier
  params: {
    model: string;    // 'claude-opus-4-5-20251101'
    max_tokens: number;  // 64000
    messages: Array<{ role: string; content: string }>;
    thinking?: { type: 'enabled'; budget_tokens: number };
    temperature?: number;  // 1.0 for extended thinking
    system?: string;
  };
}
```

---

## Styling & Branding System

### Brand Colors

**File**: `src/orchestration/reports/styles/unified-bizhealth-styles.ts`

```typescript
const BRAND_COLORS = {
  bizNavy: '#212653',     // Primary brand color
  bizGreen: '#969423',    // Accent/secondary color
  bizGrey: '#7C7C7C',     // Neutral text
  bizWhite: '#FFFFFF',
  lightBg: '#f8f9fa',
  border: '#e9ecef',

  // Score bands
  bandExcellence: '#28a745',  // Green
  bandProficiency: '#0d6efd', // Blue
  bandAttention: '#ffc107',   // Yellow
  bandCritical: '#dc3545'     // Red
};
```

### CSS Framework

```css
:root {
  --biz-navy: #212653;
  --biz-green: #969423;
  --biz-grey: #7C7C7C;

  /* Score bands */
  --band-excellence: #28a745;
  --band-proficiency: #0d6efd;
  --band-attention: #ffc107;
  --band-critical: #dc3545;

  /* Spacing (8px base) */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-xxl: 48px;
}

/* Typography */
body {
  font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: var(--biz-grey);
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Montserrat', sans-serif;
  color: var(--biz-navy);
  font-weight: 600;
}
```

---

## Type System

### Core Types Location

| Type Category | File | Description |
|--------------|------|-------------|
| IDM | `types/idm.types.ts` | Insights Data Model (890 lines) |
| Webhook | `types/webhook.types.ts` | Input webhook structure |
| Normalized | `types/normalized.types.ts` | Normalized data structures |
| Company Profile | `types/company-profile.types.ts` | Company profile types |
| Questionnaire | `types/questionnaire.types.ts` | Questionnaire types |
| Report | `types/report.types.ts` | Report generation types |
| Visualization | `types/visualization.types.ts` | Visualization types |

### Type Exports

```typescript
// Main type exports from src/types/
export type {
  // IDM types
  IDM,
  IDMMetadata,
  ScoresSummary,
  Chapter,
  Dimension,
  Finding,
  Recommendation,
  QuickWin,
  Risk,
  RoadmapPhase,
  Visualization,

  // Codes
  ChapterCode,
  DimensionCode,
  ScoreBand,

  // Webhook types
  WebhookPayload,
  BusinessOverview,
  StrategyResponses,
  // ...

  // Normalized types
  NormalizedCompanyProfile,
  NormalizedQuestionnaireResponses,
  NormalizedBenchmarkData,
  Phase0Output,

  // Report types
  ReportContext,
  ReportRenderOptions,
  GeneratedReport,
  ReportMeta
};
```

---

## Performance & Cost Analysis

### Execution Times

| Phase | Duration | Description |
|-------|----------|-------------|
| Phase 0 | ~100ms | Data normalization (no AI) |
| Phase 1 Tier 1 | 2-3 min | 5 analyses via Batch API |
| Phase 1 Tier 2 | 2-3 min | 5 analyses via Batch API |
| Phase 2 | 2-3 min | 5 synthesis analyses |
| Phase 3 | 2-3 min | 5 executive outputs |
| Phase 4 | <1 sec | IDM consolidation (no AI) |
| Phase 5 | ~100ms | 17 report generation (no AI) |
| **Total** | **10-15 min** | Complete pipeline |

### Token Usage

| Phase | Input Tokens | Output Tokens | Thinking Tokens |
|-------|--------------|---------------|-----------------|
| Phase 1 Tier 1 | ~50K | ~100K | ~150K |
| Phase 1 Tier 2 | ~80K | ~80K | ~150K |
| Phase 2 | ~60K | ~60K | ~100K |
| Phase 3 | ~40K | ~40K | ~80K |
| **Total** | **~230K** | **~280K** | **~480K** |

### Cost Estimation

```
Standard API Pricing:
- Input: $15 / 1M tokens
- Output: $75 / 1M tokens

Batch API (50% discount):
- Input: $7.50 / 1M tokens
- Output: $37.50 / 1M tokens

Cost Calculation:
- Input: 230K × $7.50 / 1M = $1.73
- Output: 280K × $37.50 / 1M = $10.50
- Total: ~$12-15 per assessment

Extended Thinking (if charged separately):
- ~480K tokens × $7.50 / 1M = $3.60
- Total with thinking: ~$15-20 per assessment
```

---

## Known Issues & Limitations

### Current Issues

1. **Employees Report Generation**
   - Status: Intermittent failures
   - Error: `text.replace is not a function`
   - Impact: 16/17 reports generate successfully

2. **ASCII Art in AI Outputs**
   - Status: Non-blocking warnings
   - Cause: AI sometimes generates ASCII visualizations despite instructions
   - Mitigation: ASCII detector strips non-compliant content

3. **Extended Thinking Token Accounting**
   - Status: Unclear pricing
   - Issue: Anthropic Batch API thinking token costs not documented

### Limitations

1. **Single-Threaded Batch Processing**
   - Batch API is sequential within tiers
   - Tier 2 must wait for Tier 1 completion

2. **Static Benchmark Data**
   - Current implementation uses mock benchmarks
   - Production requires external benchmark database

3. **PDF Generation**
   - Requires separate PDF rendering step
   - Not integrated into main pipeline

4. **Database Storage**
   - Optional feature, disabled by default
   - Uses file-based storage primarily

---

## Complete File Reference

### Orchestration Layer (8 files)

| File | Lines | Purpose |
|------|-------|---------|
| `phase0-orchestrator.ts` | ~400 | Raw capture & normalization |
| `phase1-orchestrator.ts` | ~500 | AI analyses (10) |
| `phase2-orchestrator.ts` | ~400 | Cross-analysis (5) |
| `phase3-orchestrator.ts` | ~400 | Executive synthesis (5) |
| `phase4-orchestrator.ts` | ~674 | IDM consolidation |
| `phase5-orchestrator.ts` | ~780 | Report generation (17) |
| `idm-consolidator.ts` | ~1195 | IDM building logic |
| `visualization-aggregator.ts` | ~200 | Visualization collection |

### Type Definitions (9 files)

| File | Lines | Purpose |
|------|-------|---------|
| `idm.types.ts` | ~890 | Complete IDM schema |
| `webhook.types.ts` | ~218 | Webhook payload types |
| `normalized.types.ts` | ~454 | Normalized data types |
| `company-profile.types.ts` | ~200 | Company profile types |
| `questionnaire.types.ts` | ~150 | Questionnaire types |
| `report.types.ts` | ~150 | Report types |
| `visualization.types.ts` | ~100 | Visualization types |
| `raw-input.types.ts` | ~50 | Raw input types |
| `recipe.types.ts` | ~50 | Recipe types |

### Prompt Templates (12 files)

| File | Lines | Purpose |
|------|-------|---------|
| `tier1/revenue-engine.prompts.ts` | ~500 | Revenue Engine analysis |
| `tier1/operational-excellence.prompts.ts` | ~400 | Operational analysis |
| `tier1/financial-strategic.prompts.ts` | ~400 | Financial analysis |
| `tier1/people-leadership.prompts.ts` | ~400 | People analysis |
| `tier1/compliance-sustainability.prompts.ts` | ~400 | Compliance analysis |
| `tier2/growth-readiness.prompts.ts` | ~350 | Growth readiness |
| `tier2/market-position.prompts.ts` | ~350 | Market position |
| `tier2/resource-optimization.prompts.ts` | ~350 | Resource optimization |
| `tier2/risk-resilience.prompts.ts` | ~350 | Risk & resilience |
| `tier2/scalability-readiness.prompts.ts` | ~350 | Scalability |
| `templates/base-analysis-prompt.ts` | ~443 | Base prompt template |
| `templates/visualization-supplement.ts` | ~100 | Visualization instructions |

### Report Builders (10 files)

| File | Lines | Purpose |
|------|-------|---------|
| `comprehensive-report.builder.ts` | ~500 | Comprehensive report |
| `owners-report.builder.ts` | ~400 | Owner report |
| `executive-brief.builder.ts` | ~300 | Executive brief |
| `quick-wins-report.builder.ts` | ~300 | Quick wins |
| `risk-report.builder.ts` | ~350 | Risk report |
| `roadmap-report.builder.ts` | ~350 | Roadmap report |
| `financial-report.builder.ts` | ~350 | Financial report |
| `deep-dive-report.builder.ts` | ~400 | Deep dive (4 variants) |
| `recipe-report.builder.ts` | ~300 | Manager reports |
| `html-template.ts` | ~600 | Shared HTML generation |

### Visual Components (18 files)

| File | Purpose |
|------|---------|
| `gauge.component.ts` | Gauge visualization |
| `radar-chart.component.ts` | Radar chart |
| `bar-chart.component.ts` | Bar chart |
| `sparkline.component.ts` | Sparkline |
| `heatmap.component.ts` | Heatmap |
| `table.component.ts` | Data table |
| `metric-card.component.ts` | Metric card |
| `score-tile.component.ts` | Score tile |
| `benchmark-bar.component.ts` | Benchmark bar |
| `kpi-dashboard.component.ts` | KPI dashboard |
| `risk-matrix.component.ts` | Risk matrix |
| `roadmap-timeline.component.ts` | Roadmap timeline |
| `timeline.component.ts` | Timeline |
| `funnel.component.ts` | Funnel chart |
| `waterfall.component.ts` | Waterfall chart |
| `action-card.component.ts` | Action card |
| `donut.component.ts` | Donut chart |
| `score-bar.component.ts` | Score bar |

---

## Appendix A: Score Band Colors

| Band | Score Range | Color | Hex |
|------|-------------|-------|-----|
| Excellence | 80-100 | Green | `#28a745` |
| Proficiency | 60-79 | Blue | `#0d6efd` |
| Attention | 40-59 | Yellow | `#ffc107` |
| Critical | 0-39 | Red | `#dc3545` |

---

## Appendix B: Chapter-Dimension Mapping

```
Growth Engine (GE)
├── Strategy (STR) - 7 questions
├── Sales (SAL) - 8 questions
├── Marketing (MKT) - 9 questions
└── Customer Experience (CXP) - 5 questions

Performance & Health (PH)
├── Operations (OPS) - 8 questions
└── Financials (FIN) - 10 questions

People & Leadership (PL)
├── Human Resources (HRS) - 8 questions
└── Leadership & Governance (LDG) - 7 questions

Resilience & Safeguards (RS)
├── Technology & Innovation (TIN) - 8 questions
├── IT, Data & Systems (IDS) - 7 questions
├── Risk Management (RMS) - 7 questions
└── Compliance & Legal (CMP) - 3 questions

Total: 87 questions across 12 dimensions in 4 chapters
```

---

*BizHealth Report Pipeline - Enterprise Business Intelligence Powered by Claude Opus 4.5*

*Analysis Generated: December 4, 2025*
