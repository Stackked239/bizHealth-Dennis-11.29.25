/**
 * Manager Report Recipes Configuration
 *
 * Defines the recipe configurations for each manager report type,
 * including target audience, relevant dimensions, and section structure.
 *
 * @module manager-recipes
 */

import type { DimensionCode } from '../utils/index.js';

/**
 * Section types available for manager reports
 */
export type ManagerReportSection =
  | 'companySnapshot'
  | 'dimensionDeepDive'
  | 'departmentRoadmap'
  | 'riskOverview'
  | 'metricsDashboard'
  | 'managerClosing'
  | 'adaptiveAppendix';

/**
 * Manager report recipe configuration
 */
export interface ManagerRecipe {
  /** Unique report type identifier */
  reportType: string;
  /** Display title for the report */
  title: string;
  /** Subtitle shown below title */
  subtitle: string;
  /** Target audience description */
  targetAudience: string;
  /** Primary dimensions this report focuses on */
  primaryDimensions: DimensionCode[];
  /** Secondary/related dimensions to include */
  secondaryDimensions: DimensionCode[];
  /** Ordered list of sections to include */
  sections: ManagerReportSection[];
  /** Key focus areas for this manager type */
  focusAreas: string[];
}

/**
 * All manager report recipes
 */
export const MANAGER_RECIPES: Record<string, ManagerRecipe> = {
  managersOperations: {
    reportType: 'managersOperations',
    title: 'Operations Manager Report',
    subtitle: 'Your Operational Excellence & Team Performance Toolkit',
    targetAudience: 'Operations Manager, VP Operations, COO',
    primaryDimensions: ['OPS', 'HRS'],
    secondaryDimensions: ['TIN', 'CXP'],
    sections: [
      'companySnapshot',
      'dimensionDeepDive',
      'metricsDashboard',
      'departmentRoadmap',
      'riskOverview',
      'managerClosing',
    ],
    focusAreas: [
      'operational_efficiency',
      'process_optimization',
      'team_performance',
      'capacity_utilization',
    ],
  },

  managersSalesMarketing: {
    reportType: 'managersSalesMarketing',
    title: 'Sales & Marketing Manager Report',
    subtitle: 'Your Revenue Growth & Customer Acquisition Playbook',
    targetAudience: 'Sales Manager, Marketing Manager, VP Sales/Marketing, CRO',
    primaryDimensions: ['SAL', 'MKT'],
    secondaryDimensions: ['CXP', 'STR'],
    sections: [
      'companySnapshot',
      'dimensionDeepDive',
      'metricsDashboard',
      'departmentRoadmap',
      'riskOverview',
      'managerClosing',
    ],
    focusAreas: [
      'revenue_growth',
      'pipeline_health',
      'customer_acquisition',
      'brand_positioning',
    ],
  },

  managersFinancials: {
    reportType: 'managersFinancials',
    title: 'Finance Manager Report',
    subtitle: 'Your Financial Health & Profitability Roadmap',
    targetAudience: 'CFO, Controller, Finance Manager, FP&A Lead',
    primaryDimensions: ['FIN'],
    secondaryDimensions: ['RMS', 'CMP'],
    sections: [
      'companySnapshot',
      'dimensionDeepDive',
      'metricsDashboard',
      'departmentRoadmap',
      'riskOverview',
      'managerClosing',
    ],
    focusAreas: [
      'profitability',
      'cash_flow',
      'cost_optimization',
      'financial_controls',
    ],
  },

  managersStrategy: {
    reportType: 'managersStrategy',
    title: 'Strategy & Leadership Manager Report',
    subtitle: 'Your Strategic Direction & Organizational Leadership Toolkit',
    targetAudience: 'Strategy Lead, COO, Chief of Staff, VP Strategy',
    primaryDimensions: ['STR', 'LDG'],
    secondaryDimensions: ['RMS'],
    sections: [
      'companySnapshot',
      'dimensionDeepDive',
      'metricsDashboard',
      'departmentRoadmap',
      'riskOverview',
      'managerClosing',
    ],
    focusAreas: [
      'strategic_alignment',
      'leadership_effectiveness',
      'governance',
      'succession_planning',
    ],
  },

  managersItTechnology: {
    reportType: 'managersItTechnology',
    title: 'IT & Technology Manager Report',
    subtitle: 'Your Technology Stack & Digital Transformation Roadmap',
    targetAudience: 'IT Manager, CTO, CIO, VP Technology',
    primaryDimensions: ['TIN', 'IDS'],
    secondaryDimensions: ['RMS', 'CMP'],
    sections: [
      'companySnapshot',
      'dimensionDeepDive',
      'metricsDashboard',
      'departmentRoadmap',
      'riskOverview',
      'managerClosing',
    ],
    focusAreas: [
      'technology_modernization',
      'security_posture',
      'digital_transformation',
      'system_integration',
    ],
  },
};

/**
 * Get a manager recipe by report type
 *
 * @param reportType - The report type key (e.g., 'managersOperations')
 * @returns The recipe configuration or undefined if not found
 */
export function getManagerRecipe(reportType: string): ManagerRecipe | undefined {
  return MANAGER_RECIPES[reportType];
}

/**
 * Check if a report type is a manager report
 *
 * @param reportType - The report type to check
 * @returns True if this is a manager report type
 */
export function isManagerReport(reportType: string): boolean {
  return reportType in MANAGER_RECIPES;
}

/**
 * Get all manager recipe configurations
 *
 * @returns Array of all manager recipes
 */
export function getAllManagerRecipes(): ManagerRecipe[] {
  return Object.values(MANAGER_RECIPES);
}

/**
 * Get manager report types that include a specific dimension
 *
 * @param dimensionCode - The dimension code to search for
 * @returns Array of report types that include this dimension
 */
export function getManagerReportsByDimension(dimensionCode: DimensionCode): string[] {
  return Object.entries(MANAGER_RECIPES)
    .filter(([_, recipe]) =>
      recipe.primaryDimensions.includes(dimensionCode) ||
      recipe.secondaryDimensions.includes(dimensionCode)
    )
    .map(([key]) => key);
}
