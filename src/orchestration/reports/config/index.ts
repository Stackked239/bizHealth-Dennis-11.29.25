/**
 * Report Configuration Index
 *
 * Exports all configuration for Owner's Report and Comprehensive Report integration.
 */

export {
  SECTION_MAPPINGS,
  getSectionMapping,
  getComprehensiveTitle,
  getReference,
  getAllSectionMappings,
} from './section-mapping.js';

export type { SectionMapping } from './section-mapping.js';

export {
  OWNER_REPORT_CONSTRAINTS,
  INVESTMENT_BANDS,
  getInvestmentBand,
  formatCurrencyRange,
  formatCurrency,
} from './owner-report-constraints.js';

// Report Visual Configuration
export {
  REPORT_VISUAL_CONFIGS,
  getReportVisualConfig,
  getAllReportTypes,
  getTotalTargetVisualCount,
  getTotalMinVisualCount,
  validateReportVisuals,
} from './report-visuals.config.js';
export type { VisualDefinition, ReportVisualConfig } from './report-visuals.config.js';

// Manager Report Recipes Configuration
export {
  MANAGER_RECIPES,
  getManagerRecipe,
  isManagerReport,
  getAllManagerRecipes,
  getManagerReportsByDimension,
} from './manager-recipes.js';
export type { ManagerRecipe, ManagerReportSection } from './manager-recipes.js';
