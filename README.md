# BizHealth.ai Pipeline

> **AI-Powered Business Health Assessment & Comprehensive Report Generation**

Transform business questionnaire data into actionable insights using Claude AI's advanced analysis capabilities. Generate 11 professional HTML reports in under 15 minutes.

[![Pipeline Status](https://img.shields.io/badge/status-operational-success)](https://github.com/Stackked239/bizHealth-Dennis-11.29.25)
[![Phases](https://img.shields.io/badge/phases-0--5%20complete-blue)](https://github.com/Stackked239/bizHealth-Dennis-11.29.25)
[![Reports](https://img.shields.io/badge/reports-11%20types-orange)](https://github.com/Stackked239/bizHealth-Dennis-11.29.25)
[![AI Model](https://img.shields.io/badge/AI-Claude%20Opus%204-purple)](https://www.anthropic.com/)

---

## 🆕 Recent Updates

**December 1, 2025** - Latest Pipeline Run & Critical Fixes
- ✅ **Fixed**: TypeScript ES module export errors preventing Phase 5 execution
- ✅ **Success**: Phase 5 now generates all 11 reports in ~104ms
- ✅ **Verified**: Complete pipeline execution with EWM Global sample data
- 📊 **Latest Run**: `7cd8adbd-76fb-4b93-8757-3e6a7489bf3f` (Generated at 04:53:42 UTC)
- 🔧 **Technical**: Separated type exports using `export type` syntax for TypeScript interfaces

**Pipeline Status**: ✅ All phases operational, 100% success rate

---

## Table of Contents

- [What Is This?](#what-is-this)
- [Quick Start](#quick-start)
- [Pipeline Architecture](#pipeline-architecture)
- [Project Structure](#project-structure)
- [Phase Documentation](#phase-documentation)
- [Usage Examples](#usage-examples)
- [Configuration](#configuration)
- [Sample Output](#sample-output)
- [Reports Generated](#reports-generated)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Performance & Costs](#performance--costs)
- [Documentation](#documentation)

---

## What Is This?

The **BizHealth.ai Pipeline** is a complete end-to-end system that transforms business assessment data into comprehensive, actionable insights.

### What It Does

```
Business Assessment (93 Questions)
           ↓
    AI Analysis (20+ Analyses)
           ↓
  Canonical Data Model (IDM)
           ↓
  Professional Reports (11 HTML)
```

**In**: JSON webhook with questionnaire responses
**Out**: 11 professional HTML reports + structured data model

### Key Capabilities

✅ **20 AI-Powered Analyses** using Claude Opus 4
✅ **12 Business Dimensions** evaluated across 4 strategic chapters
✅ **Canonical IDM** (Insights Data Model) for report generation
✅ **11 Professional Reports** for different stakeholders
✅ **Health Scoring** with industry benchmarking
✅ **Action Plans** with quick wins and implementation roadmaps

### Technology Stack

- **Runtime**: Node.js 18+ with TypeScript
- **AI Engine**: Anthropic Claude Opus 4
- **Data Processing**: Python 3.9+
- **API**: Anthropic Batch API for cost optimization

---

## Quick Start

### Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org/))
- **Python** 3.9+ ([download](https://python.org/))
- **Anthropic API Key** ([get one](https://console.anthropic.com/))

### Installation

```bash
# Clone repository
git clone https://github.com/Stackked239/bizHealth-Dennis-11.29.25.git
cd bizHealth-Dennis-11.29.25

# Install dependencies
npm install

# Configure API key
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

### Run the Complete Pipeline

```bash
# Execute all phases (0-5)
npx tsx src/run-pipeline.ts
```

**Expected Duration**: 10-15 minutes
**Expected Output**: 11 HTML reports in `output/reports/[run-id]/`

### View Results

```bash
# Open comprehensive report in browser
open output/reports/*/comprehensive.html

# Or list all reports
ls -lh output/reports/*/
```

---

## Pipeline Architecture

```
┌───────────────────────────────────────────────────────────────────┐
│                     BIZHEALTH AI PIPELINE                          │
│                    6 Phases · 20+ AI Analyses                      │
└───────────────────────────────────────────────────────────────────┘

📥 INPUT: Business Assessment Webhook (JSON)
   │  93 questions across 12 business dimensions
   │
   ├─────────────────────────────────────────────────────────────────
   │
   ├─▶ PHASE 0: Data Normalization                      (~26ms)
   │   │
   │   ├─ Validate 93 questionnaire responses
   │   ├─ Create immutable company profile snapshot
   │   ├─ Map responses to 12 business dimensions
   │   └─ Retrieve industry benchmarks
   │
   │   📄 Output: phase0_output.json (95 KB)
   │
   ├─────────────────────────────────────────────────────────────────
   │
   ├─▶ PHASE 1: 10 Foundational AI Analyses            (4-5 min)
   │   │  Model: Claude Opus 4 (32K tokens, 16K thinking)
   │   │  Processing: Anthropic Batch API (parallel)
   │   │
   │   ├─ 1. Revenue Engine Analysis
   │   ├─ 2. Operational Excellence
   │   ├─ 3. Financial & Strategic Health
   │   ├─ 4. People & Leadership
   │   ├─ 5. Compliance & Sustainability
   │   ├─ 6. Growth Readiness
   │   ├─ 7. Market Position
   │   ├─ 8. Resource Optimization
   │   ├─ 9. Risk & Resilience
   │   └─ 10. Scalability Readiness
   │
   │   📄 Output: phase1_output.json (76 KB)
   │
   ├─────────────────────────────────────────────────────────────────
   │
   ├─▶ PHASE 2: Cross-Dimensional Analysis             (2-3 min)
   │   │  Synthesizes insights across Phase 1
   │   │
   │   ├─ Cross-Dimensional Synthesis
   │   ├─ Strategic Recommendations (15+)
   │   ├─ Consolidated Risk Assessment (18+)
   │   ├─ Growth Opportunities (10+)
   │   └─ Implementation Roadmap (18 months)
   │
   │   📄 Output: phase2_output.json (57 KB)
   │
   ├─────────────────────────────────────────────────────────────────
   │
   ├─▶ PHASE 3: Executive Synthesis                    (2-3 min)
   │   │  Creates C-suite ready summaries
   │   │
   │   ├─ Executive Summary
   │   ├─ Scorecard (Business Health Score 0-100)
   │   ├─ Action Matrix (prioritized by urgency/impact)
   │   ├─ Investment Roadmap (with ROI projections)
   │   └─ Final Recommendations
   │
   │   📄 Output: phase3_output.json (67 KB)
   │   🎯 Key: Overall Health Score Generated
   │
   ├─────────────────────────────────────────────────────────────────
   │
   ├─▶ PHASE 4: IDM Generation                         (<1 sec)
   │   │  Compiles canonical data model
   │   │
   │   └─ Insights Data Model (IDM)
   │       ├─ 4 Strategic Chapters
   │       ├─ 12 Business Dimensions
   │       ├─ 30+ Structured Findings
   │       ├─ 10+ Prioritized Recommendations
   │       ├─ 5+ Quick Wins
   │       └─ Risk Assessment
   │
   │   📄 Output: idm_output.json (61 KB)
   │   ⭐ Single source of truth for reports
   │
   ├─────────────────────────────────────────────────────────────────
   │
   └─▶ PHASE 5: Report Generation                      (<1 sec)
       │  Creates 11 professional HTML reports
       │
       ├─ Strategic Overview (3 reports)
       │  ├─ Comprehensive Assessment (199 KB)
       │  ├─ Business Owner Report (85 KB)
       │  └─ Executive Brief (19 KB)
       │
       ├─ Action Plans (4 reports)
       │  ├─ Quick Wins Action Plan (25 KB)
       │  ├─ Risk Assessment Report (21 KB)
       │  ├─ Implementation Roadmap (29 KB)
       │  └─ Financial Impact Analysis (25 KB)
       │
       └─ Deep Dives (4 reports)
          ├─ Growth Engine Deep Dive (35 KB)
          ├─ Performance & Health Deep Dive (27 KB)
          ├─ People & Leadership Deep Dive (26 KB)
          └─ Resilience & Safeguards Deep Dive (32 KB)

       📄 Output: 11 HTML reports (596 KB total)
       📋 Manifest: Report catalog with metadata

📤 OUTPUT: Professional Reports + Structured Data
   └─ Ready to view in any web browser
```

---

## Project Structure

```
bizHealth-Dennis-11.29.25/
│
├── 📁 src/                              Source code
│   ├── run-pipeline.ts                  ⭐ Main orchestrator
│   ├── phase0-index.ts                  Phase 0 entry point
│   ├── index.ts                         Legacy Phase 1 entry
│   │
│   ├── 📁 orchestration/                Phase orchestrators
│   │   ├── phase0-orchestrator.ts       Data normalization
│   │   ├── phase1-orchestrator.ts       10 foundational analyses
│   │   ├── phase2-orchestrator.ts       Cross-dimensional synthesis
│   │   ├── phase3-orchestrator.ts       Executive summaries
│   │   ├── phase4-orchestrator.ts       IDM generation
│   │   ├── phase5-orchestrator.ts       Report generation
│   │   └── idm-consolidator.ts          IDM builder
│   │
│   ├── 📁 prompts/                      AI analysis prompts
│   │   ├── tier1/                       Core dimension prompts
│   │   │   ├── revenue-engine.prompts.ts
│   │   │   ├── operational-excellence.prompts.ts
│   │   │   ├── financial-strategic.prompts.ts
│   │   │   ├── people-leadership.prompts.ts
│   │   │   └── compliance-sustainability.prompts.ts
│   │   └── tier2/                       Cross-cutting prompts
│   │       ├── growth-readiness.prompts.ts
│   │       ├── market-position.prompts.ts
│   │       ├── resource-optimization.prompts.ts
│   │       ├── risk-resilience.prompts.ts
│   │       └── scalability-readiness.prompts.ts
│   │
│   ├── 📁 services/                     Core services
│   │   ├── anthropic-batch.ts           Batch API client
│   │   ├── assessment-index.ts          Assessment tracking
│   │   └── benchmark-lookup-service.ts  Benchmark matching
│   │
│   ├── 📁 types/                        TypeScript schemas
│   │   ├── webhook.types.ts             Input data types
│   │   ├── normalized.types.ts          Phase 0 types
│   │   ├── idm.types.ts                 IDM schema
│   │   └── ...
│   │
│   └── 📁 utils/                        Utilities
│       ├── logger.ts                    Structured logging
│       └── errors.ts                    Error handling
│
├── 📁 scripts/                          Python & utility scripts
│   ├── phase4-idm-compiler.py           IDM compiler
│   ├── idm_models.py                    Python IDM models
│   └── 📁 report-generator/             HTML report generators
│
├── 📁 output/                           ⭐ Generated outputs
│   ├── idm_output.json                  Canonical IDM (61 KB)
│   ├── phase0_output.json               Normalized data (95 KB)
│   ├── phase1_output.json               10 analyses (76 KB)
│   ├── phase2_output.json               5 syntheses (57 KB)
│   ├── phase3_output.json               5 exec outputs (67 KB)
│   ├── phase4_output.json               Phase 4 metadata
│   ├── phase5_output.json               Phase 5 metadata
│   ├── pipeline_summary.json            Execution summary
│   │
│   └── 📁 reports/[run-id]/             11 HTML reports
│       ├── comprehensive.html           (199 KB)
│       ├── owner.html                   (85 KB)
│       ├── executiveBrief.html          (19 KB)
│       ├── quickWins.html               (25 KB)
│       ├── risk.html                    (21 KB)
│       ├── roadmap.html                 (29 KB)
│       ├── financial.html               (25 KB)
│       ├── deep-dive-ge.html            (35 KB)
│       ├── deep-dive-ph.html            (27 KB)
│       ├── deep-dive-pl.html            (26 KB)
│       ├── deep-dive-rs.html            (32 KB)
│       └── manifest.json                Report catalog
│
├── 📁 samples/                          25 test webhooks
│   ├── webhook_001_startup_tech.json
│   ├── webhook_002_restaurant_chain.json
│   └── ... (23 more industry samples)
│
├── 📁 config/                           Configuration files
│   ├── question-mapping.json
│   └── 📁 report-recipes/               Report templates
│
├── 📄 README.md                         ⭐ This file
├── 📄 README_COMPLETE.md                Full guide (1,100+ lines)
├── 📄 PIPELINE_EXECUTION_REPORT.md      Execution analysis (1,450+ lines)
├── 📄 IDM_CONSOLIDATION_BUG_REPORT.md   Known issues & fixes
├── 📄 LOCAL-SETUP-GUIDE.md              Setup instructions
│
├── package.json                         Node dependencies
├── tsconfig.json                        TypeScript config
└── .env                                 ⚙️ API configuration
```

---

## Phase Documentation

### Phase 0: Data Normalization
**Duration**: ~26ms
**AI Required**: No

**Purpose**: Transform raw webhook data into clean, validated structures

**Process**:
1. Validate 93 questionnaire responses
2. Create immutable snapshot of company profile
3. Map responses to 12 business dimensions (across 4 chapters)
4. Retrieve benchmark data by industry, size, and revenue

**Output**: `output/phase0_output.json` (95 KB)

**Key Features**:
- SHA-256 hashing for data integrity
- Snapshot isolation prevents data drift
- Dimension mapping for analysis preparation
- Industry benchmark matching

---

### Phase 1: 10 Foundational AI Analyses
**Duration**: 4-5 minutes
**AI Required**: Yes (Claude Opus 4)

**Configuration**:
- **Model**: `claude-opus-4-20250514`
- **Max Tokens**: 32,000 output tokens per analysis
- **Thinking Budget**: 16,000 tokens for extended reasoning
- **Temperature**: 1.0
- **Processing**: Anthropic Batch API (parallel execution)

**Analyses**:

**Tier 1 - Core Dimensions** (5 analyses):
1. **Revenue Engine** - Sales, marketing, customer acquisition, pricing strategy
2. **Operational Excellence** - Processes, efficiency, quality control, delivery
3. **Financial & Strategic Health** - Cash flow, profitability, strategic planning
4. **People & Leadership** - Culture, talent management, leadership effectiveness
5. **Compliance & Sustainability** - Regulatory compliance, governance, ESG

**Tier 2 - Cross-Cutting** (5 analyses):
6. **Growth Readiness** - Scalability assessment, market opportunity analysis
7. **Market Position** - Competitive advantage, differentiation, brand strength
8. **Resource Optimization** - Technology utilization, infrastructure efficiency
9. **Risk & Resilience** - Threat assessment, vulnerabilities, business continuity
10. **Scalability Readiness** - Systems and processes for sustainable growth

**Output**: `output/phase1_output.json` (76 KB)

**Typical Execution**:
- Two batch jobs (Tier 1 and Tier 2) run in parallel
- Each batch: 5 analyses processed simultaneously
- Total time: 4-5 minutes depending on API load

---

### Phase 2: Cross-Dimensional Analysis
**Duration**: 2-3 minutes
**AI Required**: Yes (Claude Opus 4)

**Purpose**: Synthesize insights across all Phase 1 analyses to identify patterns, contradictions, and strategic opportunities

**Analyses**:

1. **Cross-Dimensional Synthesis**
   - Identifies patterns across all 10 Phase 1 analyses
   - Finds reinforcing factors and contradictions
   - Maps hidden connections between business areas
   - Identifies root causes and strategic leverage points

2. **Strategic Recommendations**
   - 15+ prioritized strategic recommendations
   - Implementation steps for each recommendation
   - Expected outcomes and success metrics
   - Investment requirements and timelines
   - Dependencies and prerequisite actions

3. **Consolidated Risk Assessment**
   - 18+ risks categorized by severity (Critical/High/Medium/Low)
   - Detailed mitigation strategies for each risk
   - Monitoring indicators and early warning signs
   - Integrated risk mitigation roadmap
   - Probability and impact scoring

4. **Growth Opportunities**
   - 10+ prioritized growth opportunities
   - Impact assessment (Critical/High/Medium)
   - Required capabilities and resource investments
   - Success metrics and measurement frameworks
   - Implementation timeframes

5. **Implementation Roadmap**
   - 18-month phased implementation plan
   - 4 phases: Foundation → Stabilization → Growth → Optimization
   - Dependencies and critical path analysis
   - Resource requirements by phase
   - Governance structure and decision points

**Output**: `output/phase2_output.json` (57 KB)

---

### Phase 3: Executive Synthesis
**Duration**: 2-3 minutes
**AI Required**: Yes (Claude Opus 4)

**Purpose**: Create executive-ready summaries and actionable frameworks for C-suite stakeholders

**Analyses**:

1. **Executive Summary**
   - High-level overview optimized for C-suite consumption
   - Key findings and critical issues requiring attention
   - Top 3 strategic priorities
   - Quick wins for immediate impact
   - Strategic imperatives for long-term success

2. **Scorecard**
   - Business health scores by dimension (0-5 scale)
   - Benchmarking vs. industry standards
   - Performance trends and trajectories
   - Red/yellow/green status indicators
   - Historical comparison (if available)

3. **Action Matrix**
   - Prioritized actions by urgency and impact
   - Ownership and accountability assignments
   - Quick wins vs. strategic initiatives
   - 30/60/90-day action plans
   - Resource requirements per action

4. **Investment Roadmap**
   - Financial investment requirements by initiative
   - Expected ROI and payback periods
   - Funding sources and timing recommendations
   - Break-even analysis
   - Risk-adjusted returns

5. **Final Recommendations**
   - Consolidated top recommendations integrating all analyses
   - Change management considerations
   - Success metrics and KPIs
   - Governance and monitoring frameworks
   - Communication strategy

**Key Output**: **Overall Health Score** (0-100 scale)

**Output**: `output/phase3_output.json` (67 KB)

---

### Phase 4: IDM Generation
**Duration**: <1 second
**AI Required**: No

**Purpose**: Compile all analyses into the canonical Insights Data Model (IDM)

**The IDM Structure**:

```json
{
  "meta": {
    "idm_version": "1.0",
    "assessment_run_id": "...",
    "company_profile_id": "...",
    "company_name": "...",
    "generated_at": "2025-12-01T02:38:55.081Z"
  },
  "chapters": [
    {
      "chapter_code": "GE",
      "chapter_name": "Growth Engine",
      "score": 3.2,
      "score_band": "needs_improvement",
      "dimensions": [
        {
          "dimension_code": "STR",
          "dimension_name": "Strategy",
          "questions": [...]
        }
      ]
    }
  ],
  "findings": [
    {
      "finding_id": "...",
      "type": "strength|weakness|opportunity|threat",
      "severity": "critical|high|medium|low",
      "category": "...",
      "description": "...",
      "implications": "..."
    }
  ],
  "recommendations": [
    {
      "recommendation_id": "...",
      "priority": "high|medium|low",
      "horizon": "immediate|short_term|long_term",
      "category": "...",
      "title": "...",
      "description": "...",
      "expected_impact": "..."
    }
  ],
  "quick_wins": [...],
  "risks": [...],
  "roadmap": {
    "phases": [...]
  },
  "scores_summary": {
    "overall_score": 53,
    "health_status": "Needs Improvement"
  }
}
```

**IDM Features**:
- ✅ Single source of truth for all reports
- ✅ 12 dimensions with scores and benchmarks
- ✅ 30+ structured findings with severity ratings
- ✅ 10+ validated recommendations with priorities
- ✅ Quick wins identified by impact/effort analysis
- ✅ Risk assessment with likelihood × impact ratings
- ✅ Implementation roadmap with phases and dependencies
- ✅ Question-level data for detailed drill-down

**Output**: `output/idm_output.json` (61 KB)

**Technologies**: TypeScript + Python for IDM compilation

---

### Phase 5: Report Generation
**Duration**: <1 second
**AI Required**: No

**Purpose**: Generate 11 professional HTML reports from the IDM

**Narrative Integration**:
- **26,253 words** of AI-generated content integrated
- **Phase 1**: 9,746 words
- **Phase 2**: 7,317 words
- **Phase 3**: 9,190 words

**Reports Generated**:

**Strategic Overview** (3 reports):

1. **Comprehensive Assessment Report** (199 KB)
   - Complete business analysis across all dimensions
   - All findings, recommendations, and action items
   - Full narrative content from all AI analyses
   - Executive summary with health score
   - Detailed scorecards and metrics

2. **Business Owner Report** (85 KB)
   - Owner-focused insights and priorities
   - Financial impact analysis
   - Strategic imperatives
   - Resource allocation recommendations
   - Investment roadmap

3. **Executive Brief** (19 KB)
   - C-suite optimized summary
   - Top 3 priorities
   - Critical issues requiring immediate attention
   - Key metrics dashboard
   - One-page executive view

**Action Plans** (4 reports):

4. **Quick Wins Action Plan** (25 KB)
   - Immediate opportunities (30-90 days)
   - High impact, low effort initiatives
   - Resource requirements
   - Expected ROI
   - Implementation steps

5. **Risk Assessment Report** (21 KB)
   - Risk analysis and categorization
   - Mitigation strategies
   - Monitoring frameworks
   - Early warning indicators
   - Risk heat maps

6. **Implementation Roadmap** (29 KB)
   - 18-month phased plan
   - Phase dependencies and critical path
   - Resource allocation timeline
   - Milestones and deliverables
   - Governance structure

7. **Financial Impact Analysis** (25 KB)
   - Financial projections by initiative
   - ROI calculations
   - Investment requirements
   - Break-even analysis
   - Funding recommendations

**Deep Dive Reports** (4 reports):

8. **Growth Engine Deep Dive** (35 KB)
   - Revenue and sales detailed analysis
   - Customer acquisition strategies
   - Marketing effectiveness
   - Pricing optimization
   - Sales process analysis

9. **Performance & Health Deep Dive** (27 KB)
   - Operational excellence analysis
   - Process efficiency
   - Quality metrics
   - Resource utilization
   - Technology infrastructure

10. **People & Leadership Deep Dive** (26 KB)
    - Culture and engagement analysis
    - Talent management assessment
    - Leadership effectiveness
    - Organizational structure
    - Succession planning

11. **Resilience & Safeguards Deep Dive** (32 KB)
    - Risk and compliance analysis
    - Business continuity planning
    - Regulatory compliance
    - Cybersecurity posture
    - Crisis management readiness

**Output**: `output/reports/[run-id]/` (596 KB total)

**Report Features**:
- ✅ Professional HTML formatting
- ✅ Browser-viewable (no special software needed)
- ✅ Print-ready layouts
- ✅ Interactive charts and visualizations
- ✅ Executive-grade presentation quality
- ✅ Metadata for programmatic access

---

## Usage Examples

### Complete Pipeline Execution

```bash
# Run all phases (0-5) with default sample data
npx tsx src/run-pipeline.ts

# Expected output:
# ================================================================================
# BIZHEALTH REPORT PIPELINE
# ================================================================================
# Webhook:    ./sample_webhook.json
# Output Dir: ./output
# Phases:     0 → 5
# ================================================================================
#
# ✓ Phase 0: SUCCESS (Duration: 26ms)
# ✓ Phase 1: SUCCESS (Duration: 4m 24s)
# ✓ Phase 2: SUCCESS (Duration: 2m 19s)
# ✓ Phase 3: SUCCESS (Duration: 3m 6s)
# ✓ Phase 4: SUCCESS (Duration: 0.02s)
# ✓ Phase 5: SUCCESS (Duration: 0.61s)
#
# Total Duration: 10m 15s
# All phases completed successfully!
```

### Individual Phase Execution

```bash
# Phase 0 only (data normalization)
npx tsx src/phase0-index.ts

# Phase 1 only (requires Phase 0 output)
npx tsx src/index.ts

# Phase 4 only (requires Phase 0-3 outputs)
npx tsx src/run-pipeline.ts --phase=4

# Phase 5 only (requires Phase 0-4 outputs)
npx tsx src/run-pipeline.ts --phase=5
```

### Phase Range Execution

```bash
# Run phases 0-2 only
npx tsx src/run-pipeline.ts --phase=0-2

# Run phases 2-4 only (requires Phase 0-1 outputs)
npx tsx src/run-pipeline.ts --phase=2-4

# Run phases 3-5 only (requires Phase 0-2 outputs)
npx tsx src/run-pipeline.ts --phase=3-5
```

### Custom Webhook Processing

```bash
# Use your own webhook data
npx tsx src/run-pipeline.ts path/to/your-webhook.json

# Use a specific sample webhook
npx tsx src/run-pipeline.ts samples/webhook_001_startup_tech.json
npx tsx src/run-pipeline.ts samples/webhook_012_software_saas.json

# Process multiple webhooks
for webhook in samples/*.json; do
  npx tsx src/run-pipeline.ts "$webhook"
done
```

### Custom Output Directory

```bash
# Specify custom output location
npx tsx src/run-pipeline.ts --output-dir=./custom-output

# Organize by company
npx tsx src/run-pipeline.ts --output-dir=./reports/acme-corp
```

### Validation and Testing

```bash
# Validate IDM file exists and is valid JSON
cat output/idm_output.json | python3 -m json.tool > /dev/null && echo "✓ Valid"

# Check all reports generated
ls -lh output/reports/*/

# View comprehensive report
open output/reports/*/comprehensive.html

# Check pipeline summary
cat output/pipeline_summary.json
```

---

## Configuration

### Environment Variables (`.env`)

```bash
# =============================================================================
# REQUIRED - Anthropic API Key
# =============================================================================
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# =============================================================================
# OPTIONAL - AI Model Configuration
# =============================================================================

# Claude model (default: claude-opus-4-20250514)
DEFAULT_MODEL=claude-opus-4-20250514

# Maximum output tokens (default: 32000, max for Opus 4)
DEFAULT_MAX_TOKENS=32000

# Extended thinking budget tokens (default: 16000)
DEFAULT_THINKING_TOKENS=16000

# Temperature for responses (default: 1.0, range: 0.0-1.0)
DEFAULT_TEMPERATURE=1.0

# =============================================================================
# OPTIONAL - Batch API Configuration
# =============================================================================

# Polling interval in milliseconds (default: 30000 = 30 seconds)
BATCH_POLL_INTERVAL_MS=30000

# Timeout in milliseconds (default: 3600000 = 1 hour)
BATCH_TIMEOUT_MS=3600000

# =============================================================================
# OPTIONAL - Logging & Environment
# =============================================================================

# Logging level (default: info)
# Options: debug, info, warn, error
LOG_LEVEL=info

# Node environment (default: development)
NODE_ENV=development
```

### Model Selection Guide

| Model | Quality | Speed | Cost/Run | Best For |
|-------|---------|-------|----------|----------|
| **Claude Opus 4** ⭐ | Highest | Slower | $15-30 | Production analysis, deep insights |
| Claude Sonnet 4 | Good | Faster | $3-6 | Development, quick analysis |
| Claude Haiku 4 | Basic | Fastest | $0.50-1 | Testing, simple analysis |

**Recommendation**: Use **Claude Opus 4** for production runs to ensure highest quality insights.

### Token Configuration

**Important**: Claude Opus 4 has a **32,000 token output limit**

```bash
# ✅ CORRECT Configuration
DEFAULT_MAX_TOKENS=32000
DEFAULT_THINKING_TOKENS=16000
# Total: 48K (32K output + 16K thinking)

# ❌ INCORRECT - Will Fail
DEFAULT_MAX_TOKENS=64000
DEFAULT_THINKING_TOKENS=32000
# Exceeds Opus 4 limits
```

---

## Sample Output

### Real Execution: EWM Global Assessment

**Company**: EWM Global
**Industry**: Technology Consulting
**Size**: 50-100 employees
**Annual Revenue**: $5-10M

**Latest Pipeline Run**:
- **Run ID**: `7cd8adbd-76fb-4b93-8757-3e6a7489bf3f`
- **Generated**: December 1, 2025 at 04:53:42 UTC
- **Phase 5 Duration**: 104ms
- **Total Duration**: 9 minutes 48 seconds (full pipeline)
- **Phases Completed**: 6/6 (100%)
- **AI Analyses**: 20/20 (100% success)
- **Reports Generated**: 11/11 (100% success)

**Business Health Results**:
```
Overall Score: 53/100
Status: "Needs Improvement"

Chapter Scores:
├─ Growth Engine: 3.2/5.0
├─ Operational Excellence: 2.8/5.0
├─ People & Culture: 3.5/5.0
└─ Resilience & Safeguards: 2.9/5.0
```

**Analysis Summary**:
- **Chapters Analyzed**: 4
- **Dimensions Evaluated**: 12
- **Questions Processed**: 93/93 (100%)
- **Findings Identified**: 30
  - Strengths: 8
  - Weaknesses: 12
  - Opportunities: 7
  - Threats: 3
- **Recommendations**: 10
- **Quick Wins**: 5
- **Critical Risks**: 2

**Generated Files**:
```bash
output/
├── idm_output.json (61 KB)
├── phase0_output.json (95 KB)
├── phase1_output.json (76 KB)
├── phase2_output.json (57 KB)
├── phase3_output.json (67 KB)
├── phase4_output.json (3.2 KB)
├── phase5_output.json (3.0 KB)
└── reports/7cd8adbd-76fb-4b93-8757-3e6a7489bf3f/
    ├── comprehensive.html (215 KB)
    ├── owner.html (100 KB)
    ├── executiveBrief.html (19 KB)
    ├── quickWins.html (25 KB)
    ├── risk.html (21 KB)
    ├── roadmap.html (29 KB)
    ├── financial.html (25 KB)
    ├── deep-dive-ge.html (35 KB)
    ├── deep-dive-ph.html (27 KB)
    ├── deep-dive-pl.html (26 KB)
    ├── deep-dive-rs.html (32 KB)
    └── manifest.json (1.9 KB)

Total: 554 KB of reports
```

**View Reports**:
```bash
open output/reports/7cd8adbd-76fb-4b93-8757-3e6a7489bf3f/comprehensive.html
```

---

## Reports Generated

### 1. Comprehensive Assessment Report
**Size**: 199 KB | **Audience**: All stakeholders

**Contents**:
- Executive summary with health score
- Complete analysis across all 12 dimensions
- All 30+ findings categorized and prioritized
- 10+ strategic recommendations with implementation guidance
- 5+ quick wins for immediate impact
- Risk assessment and mitigation strategies
- 18-month implementation roadmap
- Full narrative content from AI analyses (26,253 words)

**Best For**: Complete business assessment, board presentations, strategic planning sessions

---

### 2. Business Owner Report
**Size**: 85 KB | **Audience**: Business owners, founders, partners

**Contents**:
- Owner-focused executive summary
- Financial impact analysis and projections
- Strategic imperatives and priorities
- Resource allocation recommendations
- Investment requirements and ROI expectations
- Risk overview and mitigation priorities
- Action plan with ownership assignments

**Best For**: Strategic decision-making, investment planning, resource allocation

---

### 3. Executive Brief
**Size**: 19 KB | **Audience**: C-suite, board members

**Contents**:
- One-page executive summary
- Top 3 strategic priorities
- Critical issues requiring immediate attention
- Key metrics dashboard
- High-level health score and status
- Quick wins summary

**Best For**: Board meetings, quick reviews, high-level updates

---

### 4. Quick Wins Action Plan
**Size**: 25 KB | **Audience**: Operations teams, managers

**Contents**:
- 5+ immediate opportunities (30-90 day horizon)
- High impact, low effort initiatives
- Detailed implementation steps
- Resource requirements
- Expected ROI and success metrics
- Timeline and milestones

**Best For**: Getting quick wins, building momentum, demonstrating progress

---

### 5. Risk Assessment Report
**Size**: 21 KB | **Audience**: Risk managers, compliance officers, executives

**Contents**:
- Comprehensive risk inventory
- Risk categorization by severity and likelihood
- Mitigation strategies for each risk
- Monitoring frameworks
- Early warning indicators
- Risk heat maps and visualizations
- Compliance considerations

**Best For**: Risk management, compliance reviews, board risk committees

---

### 6. Implementation Roadmap
**Size**: 29 KB | **Audience**: Project managers, operations leaders

**Contents**:
- 18-month phased implementation plan
- 4 phases: Foundation → Stabilization → Growth → Optimization
- Dependencies and critical path analysis
- Resource allocation by phase
- Milestones and deliverables
- Governance structure
- Success metrics and KPIs

**Best For**: Strategic planning, project management, resource planning

---

### 7. Financial Impact Analysis
**Size**: 25 KB | **Audience**: CFO, financial planners, investors

**Contents**:
- Financial projections by initiative
- ROI calculations and payback periods
- Investment requirements by phase
- Break-even analysis
- Funding recommendations
- Cash flow impact
- Risk-adjusted returns

**Best For**: Financial planning, investment decisions, budget allocation

---

### 8-11. Deep Dive Reports (4 reports)

**Growth Engine Deep Dive** (35 KB)
- Revenue and sales analysis
- Customer acquisition strategies
- Marketing effectiveness
- Pricing optimization
- Sales process assessment

**Performance & Health Deep Dive** (27 KB)
- Operational excellence analysis
- Process efficiency metrics
- Quality control assessment
- Technology infrastructure
- Resource utilization

**People & Leadership Deep Dive** (26 KB)
- Culture and engagement
- Talent management
- Leadership effectiveness
- Organizational structure
- Succession planning

**Resilience & Safeguards Deep Dive** (32 KB)
- Risk and compliance
- Business continuity
- Regulatory compliance
- Cybersecurity posture
- Crisis management

**Best For**: Functional leaders, department heads, detailed planning

---

## Testing

### Using Sample Webhooks

The pipeline includes **25 sample webhooks** across different industries:

```bash
# Technology startup
npx tsx src/run-pipeline.ts samples/webhook_001_startup_tech.json

# Restaurant chain
npx tsx src/run-pipeline.ts samples/webhook_002_restaurant_chain.json

# Manufacturing
npx tsx src/run-pipeline.ts samples/webhook_003_manufacturing_established.json

# Healthcare clinic
npx tsx src/run-pipeline.ts samples/webhook_004_healthcare_clinic.json

# SaaS company
npx tsx src/run-pipeline.ts samples/webhook_012_software_saas.json
```

### Available Industries

1. Technology Startups
2. Restaurant Chains
3. Manufacturing
4. Healthcare Clinics
5. Retail Boutiques
6. Construction Firms
7. Consulting Agencies
8. E-commerce Fashion
9. Accounting Firms
10. Craft Breweries
11. Fitness Studios
12. SaaS Software
13. Law Firms
14. Auto Repair
15. Real Estate Agencies
16. Logistics Companies
17. Dental Practices
18. Marketing Agencies
19. Agricultural Farms
20. Insurance Agencies
21. Graphic Design Studios
22. Veterinary Clinics
23. Coffee Shop Chains
24. Plumbing Companies
25. Tutoring Centers

### Validation Tests

```bash
# Test Phase 0 only
npx tsx src/phase0-index.ts samples/webhook_001_startup_tech.json

# Validate output files exist
ls -lh output/phase*.json

# Validate IDM structure
cat output/idm_output.json | python3 -m json.tool > /dev/null && echo "✓ Valid JSON"

# Check report generation
ls -lh output/reports/*/

# Verify all 11 reports exist
test $(ls output/reports/*/*.html 2>/dev/null | wc -l) -eq 11 && echo "✓ All reports generated" || echo "✗ Missing reports"
```

### Performance Testing

```bash
# Time the complete pipeline
time npx tsx src/run-pipeline.ts

# Expected results:
# real    10m15.234s
# user    0m45.123s
# sys     0m5.234s
```

---

## Troubleshooting

### Common Issues

#### 1. "Cannot find package 'dotenv'"
**Cause**: Dependencies not installed
```bash
# Solution
npm install
```

#### 2. "Phase 1 failed: Batch job timeout"
**Cause**: Batch API taking longer than expected

**Solutions**:
```bash
# Increase timeout in .env
BATCH_TIMEOUT_MS=7200000  # 2 hours

# Or check Anthropic API status
curl https://status.anthropic.com/
```

#### 3. "max_tokens: 64000 > 32000"
**Cause**: Token configuration exceeds Claude Opus 4 limits

**Solution**: Fix `.env`:
```bash
DEFAULT_MAX_TOKENS=32000
DEFAULT_THINKING_TOKENS=16000
```

#### 4. "No API key found"
**Cause**: Missing or invalid ANTHROPIC_API_KEY

**Solution**:
```bash
# Verify .env file exists
ls -la .env

# Check API key is set
grep ANTHROPIC_API_KEY .env

# Get a new key if needed
# https://console.anthropic.com/
```

#### 5. Pipeline hangs during Phase 1/2/3
**Expected Behavior**: Batch API processing takes time

**Normal Duration**:
- Phase 1: 4-5 minutes
- Phase 2: 2-3 minutes
- Phase 3: 2-3 minutes

**Check Progress**:
```bash
# View logs in real-time
tail -f output/phase*.json

# Check batch status via API
curl https://api.anthropic.com/v1/messages/batches/[batch_id] \
  -H "x-api-key: $ANTHROPIC_API_KEY"
```

#### 6. "No reports in output/reports/"
**Cause**: Phase 5 not run or failed

**Solution**:
```bash
# Run Phase 5 explicitly
npx tsx src/run-pipeline.ts --phase=5

# Check for errors
cat output/phase5_output.json
```

#### 7. TypeScript ES Module Export Errors (FIXED ✅)
**Severity**: Critical (previously prevented Phase 5 execution)

**Error**: "The requested module does not provide an export named 'BenchmarkCalloutData'"

**Root Cause**: TypeScript interfaces cannot be re-exported as values in ES modules

**Fixed Files**:
- `src/orchestration/reports/components/benchmark-callout.component.ts` - Added `export` keyword to interface
- `src/orchestration/reports/components/index.ts` - Separated type exports using `export type` syntax

**Fix Date**: December 1, 2025

**Status**: ✅ Resolved - Phase 5 now runs successfully in ~104ms

### Debug Mode

Enable detailed logging:

```bash
# Set in .env
LOG_LEVEL=debug

# Run with debug output
npx tsx src/run-pipeline.ts 2>&1 | tee debug.log

# Review debug log
less debug.log
```

### Verify Pipeline Integrity

```bash
# Check all phase outputs exist
for i in {0..5}; do
  ls output/phase${i}_output.json && echo "✓ Phase $i" || echo "✗ Phase $i missing"
done

# Check IDM exists
test -f output/idm_output.json && echo "✓ IDM exists" || echo "✗ IDM missing"

# Validate JSON structure
find output -name "*.json" -exec sh -c 'cat {} | python3 -m json.tool > /dev/null && echo "✓ {}" || echo "✗ {} invalid"' \;

# Check report count
report_count=$(ls output/reports/*/*.html 2>/dev/null | wc -l)
echo "Reports generated: $report_count/11"
```

---

## Performance & Costs

### Execution Times

| Phase | Duration | Type |
|-------|----------|------|
| Phase 0 | ~26ms | Data processing |
| Phase 1 | 4-5 min | AI analysis (10 analyses) |
| Phase 2 | 2-3 min | AI analysis (5 analyses) |
| Phase 3 | 2-3 min | AI analysis (5 analyses) |
| Phase 4 | <1 sec | Data compilation |
| Phase 5 | <1 sec | Report generation |
| **Total** | **10-15 min** | **Complete pipeline** |

### Resource Usage

**API Calls**: 20 Claude API requests via Batch API
**Tokens**: ~640,000 tokens total (32K per analysis)
**Disk Space**: ~600 KB output per run
**Memory**: ~500 MB during execution

### Cost Estimates

**With Claude Opus 4** (Recommended):
- **Cost per Run**: $15-30
- **Cost per Analysis**: ~$0.75-1.50
- **Monthly (10 runs)**: ~$150-300

**With Claude Sonnet 4** (Development):
- **Cost per Run**: $3-6
- **Cost per Analysis**: ~$0.15-0.30
- **Monthly (10 runs)**: ~$30-60

**With Claude Haiku 4** (Testing):
- **Cost per Run**: $0.50-1
- **Cost per Analysis**: ~$0.025-0.05
- **Monthly (10 runs)**: ~$5-10

### Performance Optimization

**Batch API Benefits**:
- ✅ 50% cost reduction vs standard API
- ✅ Parallel execution of analyses
- ✅ Automatic retry handling
- ✅ Consistent performance

**Pipeline Optimizations**:
- Cached outputs allow phase resumption
- Parallel execution in Phases 1-3
- No redundant API calls
- Efficient token usage

---

## Documentation

### Available Guides

1. **README.md** (This file)
   - Quick start and overview
   - Phase documentation
   - Usage examples
   - Configuration guide

2. **README_COMPLETE.md** (1,100+ lines)
   - Comprehensive workflow guide
   - Architecture deep dive
   - Advanced usage patterns
   - Development guide

3. **PIPELINE_EXECUTION_REPORT.md** (1,450+ lines)
   - Real execution analysis
   - Performance metrics
   - Issue documentation
   - Recommendations

4. **IDM_CONSOLIDATION_BUG_REPORT.md**
   - Known issues
   - Bug analysis
   - Fix implementations
   - Testing procedures

5. **LOCAL-SETUP-GUIDE.md**
   - Installation instructions
   - Environment setup
   - Troubleshooting
   - Quick reference

### Quick Reference Commands

```bash
# ==========================================
# INSTALLATION
# ==========================================
npm install
cp .env.example .env
# Edit .env and add ANTHROPIC_API_KEY

# ==========================================
# EXECUTION
# ==========================================
# Complete pipeline
npx tsx src/run-pipeline.ts

# Specific phase
npx tsx src/run-pipeline.ts --phase=5

# Custom webhook
npx tsx src/run-pipeline.ts samples/webhook_001_startup_tech.json

# ==========================================
# VALIDATION
# ==========================================
# Check outputs
ls -lh output/phase*.json
ls -lh output/reports/*/

# Validate IDM
cat output/idm_output.json | python3 -m json.tool

# View reports
open output/reports/*/comprehensive.html

# ==========================================
# TROUBLESHOOTING
# ==========================================
# Enable debug logging
LOG_LEVEL=debug npx tsx src/run-pipeline.ts

# Check pipeline status
cat output/pipeline_summary.json

# Verify all phases completed
for i in {0..5}; do
  test -f output/phase${i}_output.json && echo "✓ Phase $i" || echo "✗ Phase $i"
done
```

---

## Support & Contact

**Repository**: https://github.com/Stackked239/bizHealth-Dennis-11.29.25

**Documentation**:
- [Complete Guide](./README_COMPLETE.md)
- [Execution Report](./PIPELINE_EXECUTION_REPORT.md)
- [Setup Guide](./LOCAL-SETUP-GUIDE.md)
- [Bug Reports](./IDM_CONSOLIDATION_BUG_REPORT.md)

**For Issues**:
1. Check [Troubleshooting](#troubleshooting) section
2. Review relevant documentation
3. Check GitHub issues

---

## License

Copyright © 2025 BizHealth.ai

All rights reserved. Proprietary and confidential.

---

## Acknowledgments

**Built with**:
- [Anthropic Claude API](https://www.anthropic.com/) - AI analysis engine
- [TypeScript](https://www.typescriptlang.org/) - Type-safe development
- [Node.js](https://nodejs.org/) - Runtime environment
- [Python](https://www.python.org/) - Data processing

**AI Model**: Claude Opus 4 (`claude-opus-4-20250514`)

---

## Quick Start Recap

```bash
# 1. Clone and install
git clone https://github.com/Stackked239/bizHealth-Dennis-11.29.25.git
cd bizHealth-Dennis-11.29.25
npm install

# 2. Configure
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env

# 3. Run
npx tsx src/run-pipeline.ts

# 4. View results
open output/reports/*/comprehensive.html
```

**That's it!** In 10-15 minutes, you'll have 11 professional business analysis reports.

---

**Happy Analyzing! 🚀**

*Built with Claude Code · Powered by Claude Opus 4*
