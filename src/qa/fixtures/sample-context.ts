/**
 * Sample Report Context for Testing
 *
 * Creates a complete ReportContext with realistic test data
 * for use in QA testing and fixture generation.
 */

import type { ReportContext } from '../../types/report.types.js';

/**
 * Create a sample ReportContext for testing
 */
export function createSampleReportContext(): ReportContext {
  return {
    runId: 'test-run-qa-001',

    companyProfile: {
      name: 'Acme Test Corporation',
      industry: 'Technology',
      industrySector: 'Software Development',
      companySize: 'Medium',
      employeeCount: 150,
      annualRevenue: '$15M - $25M',
      yearsInBusiness: 12,
      lifecycleStage: 'Growth',
      location: 'San Francisco, CA',
    },

    overallHealth: {
      score: 72,
      band: 'Proficiency',
      status: 'Your business shows solid fundamentals with opportunities for strategic improvement',
      trajectory: 'Improving',
      benchmarks: {
        industryAverage: 65,
        topPerformer: 88,
        percentile: 72,
      },
    },

    executiveSummary: {
      overview: 'Acme Test Corporation demonstrates strong performance in growth capabilities and people leadership, with opportunities to strengthen operational resilience and financial risk management.',
      keyStrengths: [
        'Strong customer acquisition engine',
        'Effective leadership team alignment',
        'Solid market positioning',
      ],
      keyPriorities: [
        'Enhance operational process documentation',
        'Strengthen financial forecasting capabilities',
        'Improve succession planning',
      ],
      criticalActions: [
        'Implement systematic sales pipeline tracking',
        'Develop comprehensive risk mitigation plan',
        'Establish formal knowledge transfer processes',
      ],
      financialHighlights: 'Estimated annual impact of $1.2M - $1.8M from recommended improvements',
    },

    chapters: [
      {
        code: 'GE',
        name: 'Growth Engine',
        score: 78,
        band: 'Proficiency',
        benchmark: {
          peerPercentile: 75,
          description: 'Performing above 75% of industry peers',
        },
        keyFindings: ['Strong customer acquisition', 'Effective marketing'],
        keyRisks: ['Market concentration risk'],
        keyOpportunities: ['Expand into adjacent markets'],
      },
      {
        code: 'PH',
        name: 'Performance & Health',
        score: 70,
        band: 'Proficiency',
        benchmark: {
          peerPercentile: 68,
          description: 'Performing above 68% of industry peers',
        },
        keyFindings: ['Solid operational metrics', 'Good quality management'],
        keyRisks: ['Process documentation gaps'],
        keyOpportunities: ['Automation opportunities'],
      },
      {
        code: 'PL',
        name: 'People & Leadership',
        score: 75,
        band: 'Proficiency',
        benchmark: {
          peerPercentile: 72,
          description: 'Performing above 72% of industry peers',
        },
        keyFindings: ['Strong leadership alignment', 'Good talent acquisition'],
        keyRisks: ['Succession planning gaps'],
        keyOpportunities: ['Leadership development programs'],
      },
      {
        code: 'RS',
        name: 'Resilience & Safeguards',
        score: 65,
        band: 'Proficiency',
        benchmark: {
          peerPercentile: 60,
          description: 'Performing above 60% of industry peers',
        },
        keyFindings: ['Basic compliance in place', 'Disaster recovery exists'],
        keyRisks: ['Cybersecurity vulnerabilities', 'Key person dependency'],
        keyOpportunities: ['Business continuity planning', 'Insurance review'],
      },
    ],

    dimensions: [
      {
        id: 'dim-sales',
        code: 'SALES',
        chapterCode: 'GE',
        name: 'Sales Effectiveness',
        description: 'Measures the effectiveness of sales processes and revenue generation',
        score: 82,
        band: 'Excellence',
        benchmark: {
          peerPercentile: 80,
          description: 'Top quartile performer',
        },
        subIndicators: [
          { id: 'sub-1', name: 'Pipeline Management', score: 85, band: 'Excellence' },
          { id: 'sub-2', name: 'Conversion Rates', score: 80, band: 'Excellence' },
        ],
        keyFindings: ['Strong sales conversion', 'Effective pipeline'],
        keyRisks: ['Sales concentration'],
        keyOpportunities: ['CRM optimization'],
      },
      {
        id: 'dim-marketing',
        code: 'MARKETING',
        chapterCode: 'GE',
        name: 'Marketing Effectiveness',
        description: 'Measures the effectiveness of marketing strategies and campaigns',
        score: 74,
        band: 'Proficiency',
        benchmark: {
          peerPercentile: 70,
          description: 'Above average performer',
        },
        subIndicators: [
          { id: 'sub-3', name: 'Brand Awareness', score: 76, band: 'Proficiency' },
          { id: 'sub-4', name: 'Lead Generation', score: 72, band: 'Proficiency' },
        ],
        keyFindings: ['Good brand recognition', 'Steady lead flow'],
        keyRisks: ['Channel dependency'],
        keyOpportunities: ['Digital marketing expansion'],
      },
      {
        id: 'dim-operations',
        code: 'OPERATIONS',
        chapterCode: 'PH',
        name: 'Operational Excellence',
        description: 'Measures operational efficiency and process management',
        score: 68,
        band: 'Proficiency',
        benchmark: {
          peerPercentile: 65,
          description: 'Average performer',
        },
        subIndicators: [
          { id: 'sub-5', name: 'Process Efficiency', score: 70, band: 'Proficiency' },
          { id: 'sub-6', name: 'Quality Management', score: 66, band: 'Proficiency' },
        ],
        keyFindings: ['Stable operations', 'Good quality outcomes'],
        keyRisks: ['Process documentation gaps'],
        keyOpportunities: ['Process automation'],
      },
      {
        id: 'dim-finance',
        code: 'FINANCE',
        chapterCode: 'RS',
        name: 'Financial Management',
        description: 'Measures financial planning, reporting, and risk management',
        score: 62,
        band: 'Proficiency',
        benchmark: {
          peerPercentile: 58,
          description: 'Slightly below average',
        },
        subIndicators: [
          { id: 'sub-7', name: 'Financial Planning', score: 65, band: 'Proficiency' },
          { id: 'sub-8', name: 'Cash Flow Management', score: 60, band: 'Proficiency' },
        ],
        keyFindings: ['Basic financial controls', 'Adequate cash reserves'],
        keyRisks: ['Forecasting accuracy'],
        keyOpportunities: ['Financial dashboard implementation'],
      },
    ],

    findings: [
      {
        id: 'find-1',
        type: 'strength',
        dimensionCode: 'SALES',
        dimensionName: 'Sales Effectiveness',
        severity: 'high',
        confidenceLevel: 'high',
        shortLabel: 'Strong Sales Pipeline',
        narrative: 'Your sales team has developed an effective pipeline management process that consistently delivers qualified opportunities.',
        evidenceRefs: {
          questionIds: ['q-sales-1', 'q-sales-2'],
          metrics: ['conversion_rate', 'pipeline_velocity'],
        },
      },
      {
        id: 'find-2',
        type: 'strength',
        dimensionCode: 'MARKETING',
        dimensionName: 'Marketing Effectiveness',
        severity: 'medium',
        confidenceLevel: 'high',
        shortLabel: 'Effective Brand Positioning',
        narrative: 'Your brand messaging resonates well with target customers and differentiates you from competitors.',
        evidenceRefs: {
          questionIds: ['q-mkt-1'],
        },
      },
      {
        id: 'find-3',
        type: 'strength',
        dimensionCode: 'LEADERSHIP',
        dimensionName: 'Leadership & Governance',
        severity: 'high',
        confidenceLevel: 'high',
        shortLabel: 'Aligned Leadership Team',
        narrative: 'Your leadership team demonstrates strong alignment on strategic priorities and effective communication.',
        evidenceRefs: {
          questionIds: ['q-lead-1', 'q-lead-2'],
        },
      },
      {
        id: 'find-4',
        type: 'gap',
        dimensionCode: 'OPERATIONS',
        dimensionName: 'Operational Excellence',
        severity: 'high',
        confidenceLevel: 'high',
        shortLabel: 'Process Documentation Gaps',
        narrative: 'Critical business processes lack comprehensive documentation, creating operational risk and knowledge transfer challenges.',
        evidenceRefs: {
          questionIds: ['q-ops-1', 'q-ops-2'],
        },
      },
      {
        id: 'find-5',
        type: 'risk',
        dimensionCode: 'FINANCE',
        dimensionName: 'Financial Management',
        severity: 'medium',
        confidenceLevel: 'high',
        shortLabel: 'Financial Forecasting Accuracy',
        narrative: 'Financial forecasts have shown significant variance from actuals, impacting strategic planning effectiveness.',
        evidenceRefs: {
          questionIds: ['q-fin-1'],
          metrics: ['forecast_accuracy'],
        },
      },
      {
        id: 'find-6',
        type: 'risk',
        dimensionCode: 'SUCCESSION',
        dimensionName: 'Succession Planning',
        severity: 'high',
        confidenceLevel: 'medium',
        shortLabel: 'Key Person Dependency',
        narrative: 'Several critical functions depend heavily on individual team members without documented backup processes.',
        evidenceRefs: {
          questionIds: ['q-succ-1', 'q-succ-2'],
        },
      },
    ],

    recommendations: [
      {
        id: 'rec-1',
        dimensionCode: 'OPERATIONS',
        dimensionName: 'Operational Excellence',
        linkedFindingIds: ['find-4'],
        theme: 'Process Documentation Initiative',
        priorityRank: 1,
        impactScore: 85,
        effortScore: 45,
        horizon: '90_days',
        horizonLabel: '0-90 Days',
        requiredCapabilities: ['Process mapping', 'Documentation tools'],
        actionSteps: [
          'Identify critical processes requiring documentation',
          'Assign process owners',
          'Implement documentation templates',
          'Train team on documentation standards',
        ],
        expectedOutcomes: 'Reduced operational risk and improved knowledge transfer efficiency',
        isQuickWin: true,
      },
      {
        id: 'rec-2',
        dimensionCode: 'FINANCE',
        dimensionName: 'Financial Management',
        linkedFindingIds: ['find-5'],
        theme: 'Financial Forecasting Enhancement',
        priorityRank: 2,
        impactScore: 78,
        effortScore: 60,
        horizon: '12_months',
        horizonLabel: '3-12 Months',
        requiredCapabilities: ['Financial modeling', 'BI tools'],
        actionSteps: [
          'Review current forecasting methodology',
          'Implement rolling forecast process',
          'Deploy financial dashboard',
          'Establish variance analysis routine',
        ],
        expectedOutcomes: 'Improved forecast accuracy and strategic planning capability',
        isQuickWin: false,
      },
      {
        id: 'rec-3',
        dimensionCode: 'SUCCESSION',
        dimensionName: 'Succession Planning',
        linkedFindingIds: ['find-6'],
        theme: 'Succession Planning Program',
        priorityRank: 3,
        impactScore: 80,
        effortScore: 70,
        horizon: '12_months',
        horizonLabel: '3-12 Months',
        requiredCapabilities: ['HR planning', 'Training programs'],
        actionSteps: [
          'Identify critical roles and key person dependencies',
          'Develop cross-training program',
          'Create succession plans for critical roles',
          'Implement knowledge transfer processes',
        ],
        expectedOutcomes: 'Reduced key person risk and improved business continuity',
        isQuickWin: false,
      },
    ],

    quickWins: [
      {
        id: 'qw-1',
        recommendationId: 'rec-1',
        theme: 'Process Documentation Quick Start',
        impactScore: 85,
        effortScore: 45,
        actionSteps: [
          'Document top 5 critical processes this quarter',
          'Create simple checklist templates',
          'Assign documentation champions',
        ],
        expectedOutcomes: 'Immediate reduction in operational risk and improved team efficiency',
        timeframe: '0-90 Days',
        estimatedInvestment: 15000,
        estimatedROI: 2.5,
      },
      {
        id: 'qw-2',
        recommendationId: 'rec-2',
        theme: 'Financial Dashboard Implementation',
        impactScore: 70,
        effortScore: 35,
        actionSteps: [
          'Define key financial metrics',
          'Configure dashboard tool',
          'Train finance team',
        ],
        expectedOutcomes: 'Real-time visibility into financial performance',
        timeframe: '0-90 Days',
        estimatedInvestment: 12000,
        estimatedROI: 3.0,
      },
    ],

    risks: [
      {
        id: 'risk-1',
        dimensionCode: 'OPERATIONS',
        dimensionName: 'Operational Excellence',
        category: 'Operational',
        severity: 'high',
        likelihood: 'medium',
        narrative: 'Lack of process documentation creates significant operational risk during staff transitions.',
        linkedRecommendationIds: ['rec-1'],
        mitigationSummary: 'Implement comprehensive process documentation initiative',
      },
      {
        id: 'risk-2',
        dimensionCode: 'SUCCESSION',
        dimensionName: 'Succession Planning',
        category: 'People',
        severity: 'high',
        likelihood: 'medium',
        narrative: 'Key person dependencies in critical roles create business continuity risk.',
        linkedRecommendationIds: ['rec-3'],
        mitigationSummary: 'Develop cross-training and succession planning program',
      },
      {
        id: 'risk-3',
        dimensionCode: 'FINANCE',
        dimensionName: 'Financial Management',
        category: 'Financial',
        severity: 'medium',
        likelihood: 'high',
        narrative: 'Inaccurate financial forecasting impacts strategic decision-making quality.',
        linkedRecommendationIds: ['rec-2'],
        mitigationSummary: 'Implement enhanced forecasting methodology and tools',
      },
    ],

    roadmap: {
      phases: [
        {
          id: 'phase-1',
          name: 'Quick Wins',
          timeHorizon: '0-90 Days',
          linkedRecommendationIds: ['rec-1'],
          narrative: 'Focus on immediate impact initiatives that reduce risk and improve visibility.',
          keyMilestones: [
            'Complete critical process documentation',
            'Deploy financial dashboard',
            'Establish monitoring routines',
          ],
        },
        {
          id: 'phase-2',
          name: 'Foundation Building',
          timeHorizon: '3-12 Months',
          linkedRecommendationIds: ['rec-2', 'rec-3'],
          narrative: 'Build foundational capabilities for sustained improvement.',
          keyMilestones: [
            'Implement rolling forecast process',
            'Launch succession planning program',
            'Complete cross-training for critical roles',
          ],
        },
      ],
      totalDuration: '12-18 months',
      criticalPath: ['Process documentation', 'Financial forecasting', 'Succession planning'],
    },

    financialProjections: {
      day90Value: 125000,
      annualValue: 1500000,
      roi90Day: 2.8,
      totalInvestmentRequired: 350000,
      paybackPeriod: '8-12 months',
      riskAdjustedROI: 2.3,
    },

    performanceAnalysis: {
      top3Categories: ['Sales Effectiveness', 'Brand Positioning', 'Leadership Alignment'],
      topPerformanceAvg: 80,
      bottom3Categories: ['Process Documentation', 'Financial Forecasting', 'Succession Planning'],
      bottomPerformanceAvg: 62,
      performanceGap: 18,
    },

    trendAnalysis: {
      decliningCategories: ['Process Documentation'],
      stableCategories: ['Financial Management', 'Operations'],
      improvingCategories: ['Sales', 'Marketing', 'Leadership'],
    },

    keyImperatives: [
      'Address process documentation gaps within 90 days',
      'Strengthen financial forecasting capabilities',
      'Develop comprehensive succession plans',
      'Continue investment in sales and marketing capabilities',
    ],

    metadata: {
      generatedAt: new Date().toISOString(),
      pipelineVersion: '5.0.0-qa',
      assessmentRunId: 'test-run-qa-001',
      companyProfileId: 'acme-test-corp',
      reportType: 'comprehensive',
      pageEstimate: 25,
    },
  };
}
