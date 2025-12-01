# BizHealth.ai Pipeline

> **AI-Powered Business Health Assessment & Report Generation System**

Transform business questionnaire data into comprehensive, actionable insights using Claude AI. Generate 11 professional HTML reports in under 15 minutes.

[![Pipeline Status](https://img.shields.io/badge/status-operational-success)](https://github.com/Stackked239/bizHealth-Dennis-11.29.25)
[![Phases](https://img.shields.io/badge/phases-6%20complete-blue)](https://github.com/Stackked239/bizHealth-Dennis-11.29.25)
[![Reports](https://img.shields.io/badge/reports-11%20types-orange)](https://github.com/Stackked239/bizHealth-Dennis-11.29.25)
[![AI Model](https://img.shields.io/badge/AI-Claude%20Opus%204-purple)](https://www.anthropic.com/)

---

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Stackked239/bizHealth-Dennis-11.29.25.git
cd bizHealth-Dennis-11.29.25/workflow-export

# 2. Install dependencies
npm install

# 3. Configure your API key
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env

# 4. Run the pipeline
npx tsx src/run-pipeline.ts

# 5. View your reports
open output/reports/*/comprehensive.html
```

**Duration**: 10-15 minutes | **Output**: 11 professional HTML reports

---

## 📋 Table of Contents

- [What Is This?](#what-is-this)
- [Key Features](#key-features)
- [Pipeline Architecture](#pipeline-architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Phase Documentation](#phase-documentation)
- [Reports Generated](#reports-generated)
- [Configuration](#configuration)
- [Sample Data](#sample-data)
- [Troubleshooting](#troubleshooting)
- [Performance & Costs](#performance--costs)
- [Recent Updates](#recent-updates)
- [Support](#support)

---

## What Is This?

BizHealth.ai Pipeline is an **end-to-end AI-powered business assessment system** that transforms questionnaire responses into comprehensive strategic insights and professional reports.

### The Flow

```
📝 93 Business Questions
        ↓
🤖 20 AI Analyses (Claude Opus 4)
        ↓
📊 Canonical Data Model (IDM)
        ↓
📄 11 Professional HTML Reports
```

### What You Get

**Input**: JSON webhook with 93 questionnaire responses across 12 business dimensions

**Output**:
- 📊 Overall Business Health Score (0-100)
- 📈 12 Dimension Scores with benchmarking
- 🎯 30+ Strategic findings (strengths, weaknesses, opportunities, threats)
- 💡 10+ Prioritized recommendations
- ⚡ 5+ Quick wins for immediate impact
- ⚠️ Risk assessment with mitigation strategies
- 🗺️ 18-month implementation roadmap
- 📄 11 Stakeholder-specific HTML reports

---

## 🎯 Key Features

✅ **AI-Powered Analysis** - 20 deep analyses using Claude Opus 4
✅ **12 Business Dimensions** - Comprehensive coverage across 4 strategic chapters
✅ **Industry Benchmarking** - Compare against industry standards
✅ **Stakeholder Reports** - 11 tailored reports for different audiences
✅ **Actionable Insights** - Quick wins, roadmaps, and implementation plans
✅ **Professional Quality** - Executive-grade HTML reports, ready to present
✅ **Fast Execution** - Complete pipeline in 10-15 minutes
✅ **Cost Optimized** - Uses Anthropic Batch API for 50% cost reduction

---

## 🏗️ Pipeline Architecture

### 6-Phase Execution Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                   BIZHEALTH AI PIPELINE                      │
│                 6 Phases • 20 AI Analyses                    │
└─────────────────────────────────────────────────────────────┘

📥 INPUT: sample_webhook.json (93 questions)
   │
   ├─► PHASE 0: Data Normalization                    (~26ms)
   │   • Validate questionnaire responses
   │   • Create company profile snapshot
   │   • Map to 12 business dimensions
   │   • Retrieve industry benchmarks
   │   📄 Output: phase0_output.json (95 KB)
   │
   ├─► PHASE 1: 10 Foundational AI Analyses          (4-5 min)
   │   • Revenue Engine Analysis
   │   • Operational Excellence
   │   • Financial & Strategic Health
   │   • People & Leadership
   │   • Compliance & Sustainability
   │   • Growth Readiness
   │   • Market Position
   │   • Resource Optimization
   │   • Risk & Resilience
   │   • Scalability Readiness
   │   📄 Output: phase1_output.json (76 KB)
   │
   ├─► PHASE 2: Cross-Dimensional Analysis           (2-3 min)
   │   • Cross-dimensional synthesis
   │   • Strategic recommendations (15+)
   │   • Consolidated risk assessment (18+)
   │   • Growth opportunities (10+)
   │   • Implementation roadmap
   │   📄 Output: phase2_output.json (57 KB)
   │
   ├─► PHASE 3: Executive Synthesis                  (2-3 min)
   │   • Executive summary
   │   • Business health scorecard
   │   • Action matrix (prioritized)
   │   • Investment roadmap
   │   • Final recommendations
   │   📄 Output: phase3_output.json (67 KB)
   │   🎯 Generates: Overall Health Score
   │
   ├─► PHASE 4: IDM Generation                        (<1 sec)
   │   • Compile canonical Insights Data Model
   │   • 4 strategic chapters
   │   • 12 business dimensions
   │   • 30+ structured findings
   │   • 10+ recommendations
   │   📄 Output: idm_output.json (61 KB)
   │   ⭐ Single source of truth for reports
   │
   └─► PHASE 5: Report Generation                     (~63ms)
       • Generate 11 HTML reports
       • Integrate 26,253 words of AI narrative
       • Apply professional styling
       • Create report manifest
       📄 Output: 11 reports (554 KB total)

📤 OUTPUT: Professional Reports + Structured Data
```

---

## 🔧 Installation

### Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org/))
- **Python** 3.9+ ([download](https://python.org/))
- **Anthropic API Key** ([get one](https://console.anthropic.com/))

### Setup Steps

```bash
# 1. Clone repository
git clone https://github.com/Stackked239/bizHealth-Dennis-11.29.25.git
cd bizHealth-Dennis-11.29.25/workflow-export

# 2. Install Node.js dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Edit .env and add your Anthropic API key
# ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Verify Installation

```bash
# Check Node.js version
node --version  # Should be 18+

# Check Python version
python3 --version  # Should be 3.9+

# Test pipeline configuration
npx tsx src/run-pipeline.ts --help
```

---

## 💻 Usage

### Run Complete Pipeline

```bash
# Execute all 6 phases (0-5)
npx tsx src/run-pipeline.ts

# Expected output:
# ✓ Phase 0: SUCCESS (26ms)
# ✓ Phase 1: SUCCESS (4m 24s)
# ✓ Phase 2: SUCCESS (2m 19s)
# ✓ Phase 3: SUCCESS (3m 6s)
# ✓ Phase 4: SUCCESS (0.02s)
# ✓ Phase 5: SUCCESS (0.06s)
# Total Duration: 10m 15s
```

### Run Individual Phases

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

### Run Phase Ranges

```bash
# Run phases 0-2 only
npx tsx src/run-pipeline.ts --phase=0-2

# Run phases 3-5 only (requires Phase 0-2 outputs)
npx tsx src/run-pipeline.ts --phase=3-5
```

### Use Custom Webhook Data

```bash
# Use your own webhook file
npx tsx src/run-pipeline.ts path/to/your-webhook.json

# Use a sample webhook
npx tsx src/run-pipeline.ts samples/webhook_001_startup_tech.json

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

---

## 📖 Phase Documentation

### Phase 0: Data Normalization
**Duration**: ~26ms | **AI**: No

Transforms raw webhook data into clean, validated structures.

**Process**:
1. Validate 93 questionnaire responses
2. Create immutable company profile snapshot
3. Map responses to 12 business dimensions
4. Retrieve industry benchmarks

**Output**: `phase0_output.json` (95 KB)

---

### Phase 1: 10 Foundational AI Analyses
**Duration**: 4-5 minutes | **AI**: Yes (Claude Opus 4)

**Configuration**:
- Model: `claude-opus-4-20250514`
- Max Tokens: 32,000 per analysis
- Thinking Budget: 16,000 tokens
- Processing: Anthropic Batch API (parallel)

**Analyses**:

**Tier 1 - Core Dimensions** (5):
1. Revenue Engine - Sales, marketing, customer acquisition
2. Operational Excellence - Processes, efficiency, quality
3. Financial & Strategic Health - Cash flow, profitability
4. People & Leadership - Culture, talent, leadership
5. Compliance & Sustainability - Regulatory, governance, ESG

**Tier 2 - Cross-Cutting** (5):
6. Growth Readiness - Scalability assessment
7. Market Position - Competitive advantage
8. Resource Optimization - Technology utilization
9. Risk & Resilience - Threat assessment
10. Scalability Readiness - Systems for growth

**Output**: `phase1_output.json` (76 KB)

---

### Phase 2: Cross-Dimensional Analysis
**Duration**: 2-3 minutes | **AI**: Yes (Claude Opus 4)

Synthesizes insights across all Phase 1 analyses.

**Deliverables**:
1. **Cross-Dimensional Synthesis** - Patterns and connections
2. **Strategic Recommendations** - 15+ prioritized actions
3. **Consolidated Risk Assessment** - 18+ risks with mitigation
4. **Growth Opportunities** - 10+ prioritized opportunities
5. **Implementation Roadmap** - 18-month phased plan

**Output**: `phase2_output.json` (57 KB)

---

### Phase 3: Executive Synthesis
**Duration**: 2-3 minutes | **AI**: Yes (Claude Opus 4)

Creates executive-ready summaries for C-suite stakeholders.

**Deliverables**:
1. **Executive Summary** - C-suite optimized overview
2. **Scorecard** - Business health scores by dimension
3. **Action Matrix** - Prioritized by urgency and impact
4. **Investment Roadmap** - Financial requirements and ROI
5. **Final Recommendations** - Integrated strategic guidance

**Key Output**: Overall Health Score (0-100)

**Output**: `phase3_output.json` (67 KB)

---

### Phase 4: IDM Generation
**Duration**: <1 second | **AI**: No

Compiles all analyses into the canonical Insights Data Model (IDM).

**IDM Structure**:
- 4 Strategic Chapters (Growth Engine, Performance, People, Resilience)
- 12 Business Dimensions with scores
- 30+ Structured findings (SWOT)
- 10+ Prioritized recommendations
- 5+ Quick wins
- Risk assessment with mitigation
- Implementation roadmap

**Output**: `idm_output.json` (61 KB)
⭐ Single source of truth for all reports

---

### Phase 5: Report Generation
**Duration**: ~63ms | **AI**: No

Generates 11 professional HTML reports from the IDM.

**Narrative Integration**: 26,253 words of AI-generated content
- Phase 1: 9,746 words
- Phase 2: 7,317 words
- Phase 3: 9,190 words

**Reports**: See [Reports Generated](#reports-generated) section

**Output**: 11 HTML files (554 KB total) + manifest

---

## 📄 Reports Generated

### Strategic Overview Reports (3)

#### 1. Comprehensive Assessment Report
**Size**: 215 KB | **Audience**: All stakeholders

Complete business analysis across all dimensions with full AI narrative, findings, recommendations, and roadmap.

**Best For**: Board presentations, strategic planning, complete assessments

---

#### 2. Business Owner Report
**Size**: 100 KB | **Audience**: Owners, founders, partners

Owner-focused insights with financial impact analysis, strategic imperatives, and resource allocation recommendations.

**Best For**: Strategic decision-making, investment planning

---

#### 3. Executive Brief
**Size**: 19 KB | **Audience**: C-suite, board members

One-page executive summary with top 3 priorities, critical issues, and key metrics dashboard.

**Best For**: Board meetings, quick reviews, high-level updates

---

### Action Plan Reports (4)

#### 4. Quick Wins Action Plan
**Size**: 25 KB | **Audience**: Operations teams, managers

5+ immediate opportunities (30-90 days) with high impact and low effort.

**Best For**: Building momentum, demonstrating progress

---

#### 5. Risk Assessment Report
**Size**: 21 KB | **Audience**: Risk managers, compliance officers

Comprehensive risk inventory with mitigation strategies and monitoring frameworks.

**Best For**: Risk management, compliance reviews

---

#### 6. Implementation Roadmap
**Size**: 29 KB | **Audience**: Project managers, operations leaders

18-month phased plan with dependencies, resources, and milestones.

**Best For**: Strategic planning, project management

---

#### 7. Financial Impact Analysis
**Size**: 25 KB | **Audience**: CFO, financial planners

Financial projections, ROI calculations, and investment requirements.

**Best For**: Financial planning, budget allocation

---

### Deep Dive Reports (4)

#### 8. Growth Engine Deep Dive
**Size**: 35 KB | **Chapter**: Growth Engine

Revenue, sales, customer acquisition, marketing, and pricing analysis.

---

#### 9. Performance & Health Deep Dive
**Size**: 27 KB | **Chapter**: Performance & Health

Operational excellence, process efficiency, quality, and technology.

---

#### 10. People & Leadership Deep Dive
**Size**: 26 KB | **Chapter**: People & Leadership

Culture, engagement, talent management, and leadership effectiveness.

---

#### 11. Resilience & Safeguards Deep Dive
**Size**: 32 KB | **Chapter**: Resilience & Safeguards

Risk, compliance, business continuity, and cybersecurity.

---

## ⚙️ Configuration

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
# OPTIONAL - Logging
# =============================================================================

# Logging level (default: info)
# Options: debug, info, warn, error
LOG_LEVEL=info
```

### Model Selection Guide

| Model | Quality | Speed | Cost/Run | Best For |
|-------|---------|-------|----------|----------|
| **Claude Opus 4** ⭐ | Highest | Slower | $15-30 | Production analysis |
| Claude Sonnet 4 | Good | Faster | $3-6 | Development, testing |
| Claude Haiku 4 | Basic | Fastest | $0.50-1 | Quick tests |

**Recommendation**: Use **Claude Opus 4** for production runs to ensure highest quality insights.

### Token Configuration

⚠️ **Important**: Claude Opus 4 has a **32,000 token output limit**

```bash
# ✅ CORRECT Configuration
DEFAULT_MAX_TOKENS=32000
DEFAULT_THINKING_TOKENS=16000

# ❌ INCORRECT - Will Fail
DEFAULT_MAX_TOKENS=64000  # Exceeds Opus 4 limits
```

---

## 📊 Sample Data

### Example: EWM Global Assessment

**Company**: EWM Global
**Industry**: Technology Consulting
**Size**: 50-100 employees
**Revenue**: $5-10M

**Latest Pipeline Run**:
- **Run ID**: `7cd8adbd-76fb-4b93-8757-3e6a7489bf3f`
- **Generated**: December 1, 2025 at 06:38:09 UTC
- **Phase 5 Duration**: 63ms
- **Total Duration**: 9 minutes 48 seconds (full pipeline)
- **Reports**: 11/11 (100% success)

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
- Chapters Analyzed: 4
- Dimensions Evaluated: 12
- Questions Processed: 93/93 (100%)
- Findings: 30 (8 strengths, 12 weaknesses, 7 opportunities, 3 threats)
- Recommendations: 10
- Quick Wins: 5
- Critical Risks: 2

**View Reports**:
```bash
open output/reports/7cd8adbd-76fb-4b93-8757-3e6a7489bf3f/comprehensive.html
```

### Test Webhooks

25 sample webhooks included across different industries:

```bash
# Technology startup
npx tsx src/run-pipeline.ts samples/webhook_001_startup_tech.json

# Restaurant chain
npx tsx src/run-pipeline.ts samples/webhook_002_restaurant_chain.json

# SaaS company
npx tsx src/run-pipeline.ts samples/webhook_012_software_saas.json

# Healthcare clinic
npx tsx src/run-pipeline.ts samples/webhook_004_healthcare_clinic.json
```

**Available Industries**: Technology, Restaurant, Manufacturing, Healthcare, Retail, Construction, Consulting, E-commerce, Accounting, Craft Brewery, Fitness, SaaS, Legal, Auto Repair, Real Estate, Logistics, Dental, Marketing, Agriculture, Insurance, Design, Veterinary, Coffee Shop, Plumbing, Tutoring

---

## 🔧 Troubleshooting

### Common Issues

#### 1. "Cannot find package 'dotenv'"
**Solution**:
```bash
npm install
```

#### 2. "No API key found"
**Solution**:
```bash
# Verify .env file exists
ls -la .env

# Check API key is set
grep ANTHROPIC_API_KEY .env

# Get a new key: https://console.anthropic.com/
```

#### 3. "max_tokens: 64000 > 32000"
**Solution**: Fix `.env`:
```bash
DEFAULT_MAX_TOKENS=32000
DEFAULT_THINKING_TOKENS=16000
```

#### 4. "Phase 1 failed: Batch job timeout"
**Solution**:
```bash
# Increase timeout in .env
BATCH_TIMEOUT_MS=7200000  # 2 hours

# Or check Anthropic API status
curl https://status.anthropic.com/
```

#### 5. Pipeline hangs during Phase 1/2/3
**Expected Behavior**: Batch API processing takes time

**Normal Duration**:
- Phase 1: 4-5 minutes
- Phase 2: 2-3 minutes
- Phase 3: 2-3 minutes

#### 6. "No reports in output/reports/"
**Solution**:
```bash
# Run Phase 5 explicitly
npx tsx src/run-pipeline.ts --phase=5

# Check for errors
cat output/phase5_output.json
```

### Debug Mode

```bash
# Set in .env
LOG_LEVEL=debug

# Run with debug output
npx tsx src/run-pipeline.ts 2>&1 | tee debug.log
```

### Verify Pipeline Integrity

```bash
# Check all phase outputs exist
for i in {0..5}; do
  test -f output/phase${i}_output.json && echo "✓ Phase $i" || echo "✗ Phase $i missing"
done

# Check IDM exists
test -f output/idm_output.json && echo "✓ IDM exists" || echo "✗ IDM missing"

# Validate JSON structure
cat output/idm_output.json | python3 -m json.tool > /dev/null && echo "✓ Valid JSON"

# Verify all 11 reports exist
report_count=$(ls output/reports/*/*.html 2>/dev/null | wc -l)
echo "Reports generated: $report_count/11"
```

---

## 📈 Performance & Costs

### Execution Times

| Phase | Duration | Type |
|-------|----------|------|
| Phase 0 | ~26ms | Data processing |
| Phase 1 | 4-5 min | AI analysis (10 analyses) |
| Phase 2 | 2-3 min | AI analysis (5 analyses) |
| Phase 3 | 2-3 min | AI analysis (5 analyses) |
| Phase 4 | <1 sec | Data compilation |
| Phase 5 | ~63ms | Report generation |
| **Total** | **10-15 min** | **Complete pipeline** |

### Resource Usage

**API Calls**: 20 Claude API requests via Batch API
**Tokens**: ~640,000 tokens total (32K per analysis)
**Disk Space**: ~600 KB output per run
**Memory**: ~500 MB during execution

### Cost Estimates

**With Claude Opus 4** (Recommended):
- Cost per Run: $15-30
- Cost per Analysis: ~$0.75-1.50
- Monthly (10 runs): ~$150-300

**With Claude Sonnet 4** (Development):
- Cost per Run: $3-6
- Cost per Analysis: ~$0.15-0.30
- Monthly (10 runs): ~$30-60

**With Claude Haiku 4** (Testing):
- Cost per Run: $0.50-1
- Cost per Analysis: ~$0.025-0.05
- Monthly (10 runs): ~$5-10

### Performance Optimization

**Batch API Benefits**:
- ✅ 50% cost reduction vs standard API
- ✅ Parallel execution of analyses
- ✅ Automatic retry handling
- ✅ Consistent performance

---

## 🆕 Recent Updates

**December 1, 2025** - Critical TypeScript Fixes & Performance Improvements

- ✅ **Fixed**: TypeScript ES module export errors preventing Phase 5 execution
- ✅ **Performance**: Phase 5 now generates all 11 reports in ~63ms (improved from 104ms)
- ✅ **Verified**: Complete pipeline execution with 100% success rate
- 📊 **Latest Run**: `7cd8adbd-76fb-4b93-8757-3e6a7489bf3f` (Generated at 06:38:09 UTC)
- 🔧 **Technical**: Separated type exports using `export type` syntax for TypeScript interfaces

**Fixed Files**:
- `src/orchestration/reports/components/benchmark-callout.component.ts`
- `src/orchestration/reports/components/index.ts`

**Pipeline Status**: ✅ All phases operational, 100% success rate

---

## 📚 Additional Documentation

- **README_COMPLETE.md** - Comprehensive workflow guide (1,100+ lines)
- **PIPELINE_EXECUTION_REPORT.md** - Detailed execution analysis (1,450+ lines)
- **IDM_CONSOLIDATION_BUG_REPORT.md** - Known issues and fixes
- **LOCAL-SETUP-GUIDE.md** - Installation and setup instructions

---

## 💬 Support

**Repository**: https://github.com/Stackked239/bizHealth-Dennis-11.29.25

**For Issues**:
1. Check [Troubleshooting](#troubleshooting) section
2. Review additional documentation
3. Check GitHub issues

---

## 📜 License

Copyright © 2025 BizHealth.ai

All rights reserved. Proprietary and confidential.

---

## 🙏 Acknowledgments

**Built with**:
- [Anthropic Claude API](https://www.anthropic.com/) - AI analysis engine
- [TypeScript](https://www.typescriptlang.org/) - Type-safe development
- [Node.js](https://nodejs.org/) - Runtime environment
- [Python](https://www.python.org/) - Data processing

**AI Model**: Claude Opus 4 (`claude-opus-4-20250514`)

---

## 🎯 Quick Reference

```bash
# Installation
npm install
cp .env.example .env
# Add ANTHROPIC_API_KEY to .env

# Run complete pipeline
npx tsx src/run-pipeline.ts

# Run specific phase
npx tsx src/run-pipeline.ts --phase=5

# Use custom webhook
npx tsx src/run-pipeline.ts samples/webhook_001_startup_tech.json

# View reports
open output/reports/*/comprehensive.html

# Check pipeline status
cat output/pipeline_summary.json

# Validate outputs
test -f output/idm_output.json && echo "✓ IDM exists"
ls -lh output/reports/*/
```

---

**Happy Analyzing! 🚀**

*Powered by Claude Opus 4 • Built with Claude Code*
