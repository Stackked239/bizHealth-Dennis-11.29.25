/**
 * BizHealth.ai Report Styles
 *
 * Exports unified CSS styling framework for all report types.
 * Includes Phase 4 visual patterns integration (2025-12-05).
 * Includes Phase 1.5 premium content styles (2025-12-11).
 *
 * @module styles
 */

export {
  generateUnifiedStyles,
  generateCriticalFixesOnly,
  BRAND_COLORS,
  UNIFIED_STYLES,
} from './unified-bizhealth-styles.js';

// Phase 4 Visual Patterns (for direct access if needed)
export {
  PHASE4_PATTERNS,
  getAllPhase4Styles,
  getPattern,
  getPatterns,
  PATTERN_NAMES,
  type Phase4PatternName,
} from './phase4-visual-patterns.js';

// Phase 1.5 Premium Content Styles (for category-level narratives and visualizations)
export {
  getPhase15Styles,
  getVisualizationStyles,
  getAllPhase15Styles,
  PHASE15_COLORS,
} from './phase15-styles.js';
