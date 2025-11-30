# BizHealth.ai Pipeline

**AI-Powered Business Health Assessment & Report Generation System**

Transform business questionnaire data into comprehensive, actionable insights using Claude AI's advanced analysis capabilities.

[![Pipeline Status](https://img.shields.io/badge/pipeline-operational-success)](https://github.com/Stackked239/bizHealth-Dennis-11.29.25)
[![Phase Coverage](https://img.shields.io/badge/phases-0--5-blue)](https://github.com/Stackked239/bizHealth-Dennis-11.29.25)
[![Reports](https://img.shields.io/badge/reports-11%20types-orange)](https://github.com/Stackked239/bizHealth-Dennis-11.29.25)

---

## 🎯 What Is This?

The BizHealth.ai Pipeline is a complete end-to-end system that:

1. **Ingests** business assessment questionnaire data (93 questions across 12 dimensions)
2. **Analyzes** using 20 AI-powered analyses with Claude Opus 4
3. **Generates** a canonical Insights Data Model (IDM)
4. **Produces** 11 professional HTML reports for different stakeholders
5. **Delivers** actionable insights, risk assessments, and implementation roadmaps

**Built with**: TypeScript, Node.js, Python, Anthropic Claude API

---

## 📊 Quick Start

### Prerequisites

- Node.js 18+ ([download](https://nodejs.org/))
- Python 3.9+ ([download](https://python.org/))
- Anthropic API Key ([get one](https://console.anthropic.com/))

### Installation

```bash
# Clone the repository
git clone https://github.com/Stackked239/bizHealth-Dennis-11.29.25.git
cd bizHealth-Dennis-11.29.25

# Install dependencies
npm install

# Configure your API key
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

### Run the Pipeline

```bash
# Complete pipeline (Phases 0-5)
npx tsx src/run-pipeline.ts

# Takes ~10-15 minutes
# Generates 11 HTML reports + IDM data model
```

**Output**: Check `output/reports/[run-id]/` for generated HTML reports!

---

## 🏗️ Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    BIZHEALTH PIPELINE                        │
└─────────────────────────────────────────────────────────────┘

INPUT: Business Assessment Webhook (JSON)
   │
   ├─> PHASE 0: Data Normalization (26ms)
   │   └─> Validates, structures, and snapshots data
   │
   ├─> PHASE 1: 10 Foundational AI Analyses (4-5 min)
   │   ├─> Revenue Engine Analysis
   │   ├─> Operational Excellence
   │   ├─> Financial & Strategic Health
   │   ├─> People & Leadership
   │   ├─> Compliance & Sustainability
   │   ├─> Growth Readiness
   │   ├─> Market Position
   │   ├─> Resource Optimization
   │   ├─> Risk & Resilience
   │   └─> Scalability Readiness
   │
   ├─> PHASE 2: 5 Cross-Dimensional Analyses (2-3 min)
   │   ├─> Cross-Dimensional Synthesis
   │   ├─> Strategic Recommendations (15+)
   │   ├─> Consolidated Risk Assessment (18+)
   │   ├─> Growth Opportunities (10+)
   │   └─> Implementation Roadmap (18 months)
   │
   ├─> PHASE 3: 5 Executive Syntheses (2-3 min)
   │   ├─> Executive Summary
   │   ├─> Scorecard (with health score)
   │   ├─> Action Matrix
   │   ├─> Investment Roadmap
   │   └─> Final Recommendations
   │
   ├─> PHASE 4: IDM Generation (<1s)
   │   └─> Canonical Insights Data Model (61 KB)
   │
   └─> PHASE 5: Report Generation (<1s)
       └─> 11 Professional HTML Reports (328 KB)

OUTPUT: HTML Reports + JSON Data Models
```

---

## 📁 Project Structure

```
bizHealth-Dennis-11.29.25/
├── src/
│   ├── run-pipeline.ts              ⭐ Main pipeline orchestrator
│   ├── phase0-index.ts              Phase 0 entry point
│   ├── index.ts                     Legacy Phase 1 entry
│   │
│   ├── orchestration/               Phase orchestrators
│   │   ├── phase0-orchestrator.ts   Data normalization
│   │   ├── phase1-orchestrator.ts   10 foundational analyses
│   │   ├── phase2-orchestrator.ts   5 cross-dimensional analyses
│   │   ├── phase3-orchestrator.ts   5 executive syntheses
│   │   ├── phase4-orchestrator.ts   IDM generation
│   │   ├── phase5-orchestrator.ts   Report generation
│   │   └── idm-consolidator.ts      IDM builder
│   │
│   ├── prompts/                     AI analysis prompts
│   │   ├── tier1/                   Core dimension prompts
│   │   └── tier2/                   Cross-cutting prompts
│   │
│   ├── services/                    Core services
│   │   ├── anthropic-batch.ts       Batch API client
│   │   ├── assessment-index.ts      Assessment tracking
│   │   └── benchmark-lookup-service.ts
│   │
│   ├── types/                       TypeScript types
│   │   ├── webhook.types.ts         Input schemas
│   │   ├── normalized.types.ts      Phase 0 schemas
│   │   └── idm.types.ts             IDM schema
│   │
│   └── utils/                       Utilities
│       ├── logger.ts                Structured logging
│       └── errors.ts                Error handling
│
├── scripts/                         Python scripts
│   ├── phase4-idm-compiler.py       IDM compiler
│   ├── idm_models.py                IDM data models
│   └── report-generator/            Report generators
│
├── output/                          ⭐ Generated outputs
│   ├── idm_output.json              Canonical IDM (61 KB)
│   ├── phase0_output.json           Normalized data
│   ├── phase1_output.json           10 analyses
│   ├── phase2_output.json           5 syntheses
│   ├── phase3_output.json           5 executive outputs
│   ├── phase4_output.json           Phase 4 metadata
│   ├── phase5_output.json           Report metadata
│   └── reports/[run-id]/            11 HTML reports
│
├── samples/                         25 test webhooks
├── config/                          Configuration
├── docs/                            Documentation
│   ├── README_COMPLETE.md           Complete guide (1,100 lines)
│   ├── PIPELINE_EXECUTION_REPORT.md Execution analysis (1,450 lines)
│   ├── IDM_CONSOLIDATION_BUG_REPORT.md Bug analysis
│   └── LOCAL-SETUP-GUIDE.md         Setup instructions
│
├── package.json
├── tsconfig.json
└── .env                             API configuration
```

---

## 🚀 Pipeline Phases

### Phase 0: Data Normalization
**Duration**: ~26ms
**Purpose**: Transform raw webhook data into clean, validated structures

- Validates 93 questionnaire responses
- Creates immutable snapshot of company profile
- Maps responses to 12 business dimensions
- Retrieves benchmark data by industry/size

**Output**: `output/phase0_output.json` (95 KB)

---

### Phase 1: 10 Foundational AI Analyses
**Duration**: 4-5 minutes
**Purpose**: Deep analysis of 10 core business dimensions

**AI Model**: Claude Opus 4
**Configuration**: 32K output tokens, 16K thinking tokens
**Processing**: Anthropic Batch API (parallel execution)

**Analyses**:
1. Revenue Engine - Sales, marketing, pricing strategy
2. Operational Excellence - Processes, efficiency, delivery
3. Financial & Strategic Health - Cash flow, profitability
4. People & Leadership - Culture, talent, leadership
5. Compliance & Sustainability - Regulatory, governance, ESG
6. Growth Readiness - Scalability, market opportunity
7. Market Position - Competitive advantage, differentiation
8. Resource Optimization - Technology, infrastructure
9. Risk & Resilience - Threats, vulnerabilities, continuity
10. Scalability Readiness - Systems, processes for growth

**Output**: `output/phase1_output.json` (76 KB)

---

### Phase 2: Cross-Dimensional Analysis
**Duration**: 2-3 minutes
**Purpose**: Synthesize insights across all Phase 1 analyses

**Analyses**:
1. **Cross-Dimensional Synthesis** - Patterns, contradictions, leverage points
2. **Strategic Recommendations** - 15+ prioritized recommendations
3. **Consolidated Risk Assessment** - 18+ risks with mitigation strategies
4. **Growth Opportunities** - 10+ opportunities with impact assessment
5. **Implementation Roadmap** - 18-month phased plan

**Output**: `output/phase2_output.json` (57 KB)

---

### Phase 3: Executive Synthesis
**Duration**: 2-3 minutes
**Purpose**: Create executive-ready summaries and frameworks

**Analyses**:
1. **Executive Summary** - C-suite overview with key findings
2. **Scorecard** - Health scores by dimension with benchmarks
3. **Action Matrix** - Prioritized actions by urgency/impact
4. **Investment Roadmap** - Financial requirements and ROI
5. **Final Recommendations** - Consolidated strategic guidance

**Key Output**: **Overall Health Score** (0-100)

**Output**: `output/phase3_output.json` (67 KB)

---

### Phase 4: IDM Generation
**Duration**: <1 second
**Purpose**: Compile all analyses into canonical data model

**The Insights Data Model (IDM)** is the single source of truth for report generation:

```json
{
  "meta": {
    "assessment_run_id": "...",
    "company_name": "...",
    "generated_at": "..."
  },
  "chapters": [
    {
      "chapter_code": "GE",
      "chapter_name": "Growth Engine",
      "score": 3.2,
      "score_band": "needs_improvement",
      "dimensions": [...],
      "questions": [...]
    }
  ],
  "findings": [30+ structured findings],
  "recommendations": [10+ prioritized recommendations],
  "quick_wins": [5+ high-impact opportunities],
  "risks": [2+ critical risks],
  "roadmap": {18-month implementation plan},
  "scores_summary": {
    "overall_score": 53,
    "health_status": "Needs Improvement"
  }
}
```

**Output**: `output/idm_output.json` (61 KB)

---

### Phase 5: Report Generation
**Duration**: <1 second
**Purpose**: Generate 11 professional HTML reports

**Reports Generated**:

**Strategic Overview** (3 reports):
- **Comprehensive Assessment** (66 KB) - Complete business analysis
- **Business Owner Report** (22 KB) - Owner-focused insights
- **Executive Brief** (19 KB) - C-suite summary

**Action Plans** (4 reports):
- **Quick Wins Action Plan** (25 KB) - Immediate opportunities
- **Risk Assessment Report** (21 KB) - Risk analysis & mitigation
- **Implementation Roadmap** (29 KB) - Phased implementation
- **Financial Impact Analysis** (25 KB) - Financial projections

**Deep Dives** (4 reports):
- **Growth Engine** (35 KB) - Revenue & sales deep dive
- **Performance & Health** (27 KB) - Operations deep dive
- **People & Leadership** (26 KB) - HR & culture deep dive
- **Resilience & Safeguards** (32 KB) - Risk & compliance deep dive

**Output**: `output/reports/[run-id]/` (328 KB total)

---

## 💻 Usage Examples

### Run Complete Pipeline
```bash
npx tsx src/run-pipeline.ts
```

### Run Specific Phase
```bash
# Phase 0 only
npx tsx src/phase0-index.ts

# Phase 4 only (requires Phase 0-3 outputs)
npx tsx src/run-pipeline.ts --phase=4

# Phase 5 only (requires Phase 0-4 outputs)
npx tsx src/run-pipeline.ts --phase=5
```

### Run Phase Range
```bash
# Phases 0-2
npx tsx src/run-pipeline.ts --phase=0-2

# Phases 3-5
npx tsx src/run-pipeline.ts --phase=3-5
```

### Custom Webhook
```bash
# Use your own webhook data
npx tsx src/run-pipeline.ts path/to/webhook.json

# Use sample webhook
npx tsx src/run-pipeline.ts samples/webhook_001_startup_tech.json
```

### Custom Output Directory
```bash
npx tsx src/run-pipeline.ts --output-dir=./custom-output
```

---

## ⚙️ Configuration

### Environment Variables (`.env`)

```bash
# REQUIRED: Anthropic API Key
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# OPTIONAL: Model Configuration
DEFAULT_MODEL=claude-opus-4-20250514
DEFAULT_MAX_TOKENS=32000              # Max: 32K for Opus 4
DEFAULT_THINKING_TOKENS=16000         # Extended reasoning
DEFAULT_TEMPERATURE=1.0               # 0.0-1.0

# OPTIONAL: Batch API Settings
BATCH_POLL_INTERVAL_MS=30000          # 30 seconds
BATCH_TIMEOUT_MS=3600000              # 1 hour

# OPTIONAL: Logging
LOG_LEVEL=info                        # debug, info, warn, error
NODE_ENV=development
```

### Model Selection

| Model | Quality | Speed | Cost/Run | Best For |
|-------|---------|-------|----------|----------|
| **Claude Opus 4** | Highest | Slower | $15-30 | Production, deep insights |
| Claude Sonnet 4 | Good | Faster | $3-6 | Development, quick analysis |
| Claude Haiku 4 | Basic | Fastest | $0.50-1 | Testing, simple analysis |

**Recommendation**: Use **Opus 4** for production analysis.

---

## 📊 Sample Output

### Example: EWM Global Assessment

**Company**: EWM Global
**Industry**: Technology Consulting
**Size**: 50-100 employees
**Revenue**: $5-10M annually

**Results**:
- **Health Score**: 53/100
- **Status**: "Needs Improvement"
- **Chapters Analyzed**: 4
- **Questions Processed**: 93/93 (100%)
- **Findings**: 30
- **Recommendations**: 10
- **Quick Wins**: 5
- **Risks Identified**: 2

**Execution Time**: 9.8 minutes

**Reports Generated**: View in `output/reports/4fd8d702-c64e-4f07-8230-39ab790381b0/`

---

## 🎯 Key Features

### AI-Powered Analysis
- **20 AI Analyses** using Claude Opus 4
- **Extended Thinking** (16K tokens) for deep reasoning
- **Batch Processing** for cost-effective parallel execution

### Comprehensive Coverage
- **12 Business Dimensions** analyzed
- **4 Strategic Chapters** organized
- **93 Questionnaire Questions** evaluated

### Professional Reports
- **11 HTML Reports** for different stakeholders
- **328 KB** of formatted analysis
- **Browser-viewable** - no special software needed

### Canonical Data Model
- **IDM (Insights Data Model)** - single source of truth
- **61 KB** structured JSON
- **API-ready** for integrations

### Flexible Architecture
- **Phase-by-Phase** execution
- **Resume from any phase** with cached outputs
- **25 Sample Webhooks** for testing

---

## 🧪 Testing

### Test with Sample Data
```bash
# Use included sample webhooks
npx tsx src/run-pipeline.ts samples/webhook_001_startup_tech.json
npx tsx src/run-pipeline.ts samples/webhook_012_software_saas.json
```

### Available Sample Industries
- Technology startups
- Restaurant chains
- Manufacturing
- Healthcare clinics
- Retail boutiques
- Construction firms
- Consulting agencies
- E-commerce
- And 17 more!

### Validate Output
```bash
# Check IDM file exists and is valid JSON
ls -lh output/idm_output.json
cat output/idm_output.json | python3 -m json.tool > /dev/null && echo "✓ Valid"

# Check reports generated
ls -lh output/reports/*/
```

---

## 🐛 Known Issues

### Issue #1: TypeScript Compilation Warnings
**Severity**: Low
**Impact**: Pipeline runs successfully, but shows syntax warnings

**Affected Files**:
- `src/prompts/tier1/revenue-engine.prompts.ts`
- `src/prompts/tier2/growth-readiness.prompts.ts`
- `src/prompts/tier2/market-position.prompts.ts`
- `src/prompts/tier2/resource-optimization.prompts.ts`

**Workaround**: Pipeline uses `|| true` in build script to continue

**Fix Status**: Documented in `IDM_CONSOLIDATION_BUG_REPORT.md`

### Issue #2: Missing Questionnaire Responses
**Severity**: Low
**Impact**: 4/93 questions not answered (95.7% completion)

**Effect**: Pipeline handles gracefully, minor accuracy reduction possible

---

## 📚 Documentation

Comprehensive guides available:

- **README_COMPLETE.md** (1,100+ lines) - Complete workflow guide
- **PIPELINE_EXECUTION_REPORT.md** (1,450+ lines) - Execution analysis
- **IDM_CONSOLIDATION_BUG_REPORT.md** - Bug analysis with fixes
- **LOCAL-SETUP-GUIDE.md** - Setup instructions

---

## 🔧 Troubleshooting

### "Cannot find package 'dotenv'"
```bash
npm install
```

### "Phase 1 failed: Batch job timeout"
Increase timeout in `.env`:
```bash
BATCH_TIMEOUT_MS=7200000  # 2 hours
```

### "max_tokens: 64000 > 32000"
Fix `.env` configuration:
```bash
DEFAULT_MAX_TOKENS=32000
DEFAULT_THINKING_TOKENS=16000
```

### Pipeline hangs during Phase 1/2/3
**Expected behavior** - Batch API processing takes time:
- Phase 1: 4-5 minutes
- Phase 2: 2-3 minutes
- Phase 3: 2-3 minutes

Check progress in logs or Anthropic console.

### No reports in output/reports/
Run Phase 5:
```bash
npx tsx src/run-pipeline.ts --phase=5
```

---

## 🚦 Performance

### Execution Times
- **Phase 0**: ~26ms
- **Phase 1**: 4-5 minutes (10 AI analyses)
- **Phase 2**: 2-3 minutes (5 AI analyses)
- **Phase 3**: 2-3 minutes (5 AI analyses)
- **Phase 4**: <1 second (IDM compilation)
- **Phase 5**: <1 second (11 reports)

**Total**: ~10-15 minutes for complete pipeline

### Resource Usage
- **API Calls**: 20 Claude API requests
- **Tokens**: ~640,000 tokens total
- **Cost**: $15-30 per run (Opus 4)
- **Disk Space**: ~600 KB output per run

### Optimization
- **Batch API** reduces costs by 50%
- **Parallel execution** in Phases 1-3
- **Cached outputs** allow phase resumption

---

## 🔐 Security

### API Key Security
- ✅ `.env` files are gitignored
- ✅ Never commit API keys
- ✅ Use environment variables only

### Data Privacy
- ✅ All processing local or via Anthropic API
- ✅ No third-party data storage
- ✅ Output files user-controlled

### Best Practices
- Rotate API keys regularly
- Use separate keys for dev/prod
- Monitor API usage in Anthropic console

---

## 📈 Roadmap

### Planned Features
- [ ] Real-time progress tracking
- [ ] Web-based report viewer
- [ ] PDF export for reports
- [ ] Custom report templates
- [ ] Multi-company batch processing
- [ ] Historical trend analysis
- [ ] Automated email delivery

### In Progress
- [x] Phase 5 report generation
- [x] IDM consolidation
- [x] Comprehensive documentation

---

## 🤝 Contributing

This is a private repository. For questions or issues:

1. Review documentation in `docs/`
2. Check troubleshooting section
3. Contact repository owner

---

## 📄 License

Copyright © 2025 BizHealth.ai

All rights reserved. Proprietary and confidential.

---

## 🙏 Acknowledgments

**Built with**:
- [Anthropic Claude API](https://www.anthropic.com/) - AI analysis engine
- [TypeScript](https://www.typescriptlang.org/) - Type-safe development
- [Node.js](https://nodejs.org/) - Runtime environment
- [Python](https://www.python.org/) - Data processing

**AI Model**: Claude Opus 4 (claude-opus-4-20250514)

---

## 📞 Support

**Repository**: https://github.com/Stackked239/bizHealth-Dennis-11.29.25

**Documentation**:
- [Complete Guide](./README_COMPLETE.md)
- [Setup Guide](./LOCAL-SETUP-GUIDE.md)
- [Execution Report](./PIPELINE_EXECUTION_REPORT.md)
- [Bug Reports](./IDM_CONSOLIDATION_BUG_REPORT.md)

---

## 🎉 Quick Reference

```bash
# Complete pipeline
npx tsx src/run-pipeline.ts

# Specific phase
npx tsx src/run-pipeline.ts --phase=5

# Custom webhook
npx tsx src/run-pipeline.ts samples/webhook_001_startup_tech.json

# View reports
open output/reports/[run-id]/comprehensive.html
```

**Happy Analyzing! 🚀**
