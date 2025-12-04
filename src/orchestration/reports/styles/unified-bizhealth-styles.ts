/**
 * BizHealth.ai Unified CSS Framework
 *
 * Consolidated Phase 4 styling patterns for Phase 5 report generation.
 * This framework addresses all known CSS issues and provides consistent
 * styling across all 17 report types.
 *
 * Key Fixes Applied:
 * 1. Cover page background override (solid BizNavy)
 * 2. Dark section text visibility (all elements white)
 * 3. Removed problematic overlays
 * 4. Typography hierarchy (Montserrat/Open Sans)
 * 5. Score display contrast
 * 6. Information box consistency
 * 7. Score tile cards
 * 8. Score band badges
 * 9. Key takeaways box styling
 * 10. Table styling
 * 11. Interactive ToC
 * 12. Cross-reference links
 * 13. Print optimization
 * 14. Responsive design
 * 15. Accessibility enhancements
 *
 * @module unified-bizhealth-styles
 * @version 1.0.0
 * @date 2025-12-04
 */

// ============================================================================
// BRAND COLOR CONSTANTS
// ============================================================================

export const BRAND_COLORS = {
  /** BizHealth Navy - Primary brand color */
  bizNavy: '#212653',
  /** BizHealth Green - Accent/secondary color */
  bizGreen: '#969423',
  /** BizHealth Grey - Neutral text color */
  bizGrey: '#7C7C7C',
  /** White */
  bizWhite: '#FFFFFF',
  /** Light background */
  lightBg: '#f8f9fa',
  /** Border color */
  border: '#e9ecef',
  /** Score bands */
  bandExcellence: '#28a745',
  bandProficiency: '#0d6efd',
  bandAttention: '#ffc107',
  bandCritical: '#dc3545',
} as const;

// ============================================================================
// UNIFIED CSS FRAMEWORK
// ============================================================================

/**
 * Generate the complete unified CSS framework
 * Includes all Phase 4 styling patterns and critical fixes
 *
 * @param primaryColor - Primary brand color (default: BizNavy)
 * @param accentColor - Accent brand color (default: BizGreen)
 * @returns Complete CSS string for report styling
 */
export function generateUnifiedStyles(
  primaryColor: string = BRAND_COLORS.bizNavy,
  accentColor: string = BRAND_COLORS.bizGreen
): string {
  return `
/* ============================================================
   BIZHEALTH.AI UNIFIED CSS FRAMEWORK
   Phase 4 Styling Patterns for Phase 5 Report Generation
   Generated: ${new Date().toISOString().split('T')[0]}
   ============================================================ */

/* ===== BRAND COLOR VARIABLES ===== */
:root {
  --biz-navy: ${primaryColor};
  --biz-green: ${accentColor};
  --biz-grey: ${BRAND_COLORS.bizGrey};
  --biz-white: ${BRAND_COLORS.bizWhite};
  --biz-light-bg: ${BRAND_COLORS.lightBg};
  --biz-border: ${BRAND_COLORS.border};

  /* Score Band Colors */
  --band-excellence: ${BRAND_COLORS.bandExcellence};
  --band-proficiency: ${BRAND_COLORS.bandProficiency};
  --band-attention: ${BRAND_COLORS.bandAttention};
  --band-critical: ${BRAND_COLORS.bandCritical};

  /* Spacing Scale (8px base) */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-xxl: 48px;
}

/* ===== CRITICAL FIX 1: Cover Page Background Override ===== */
/* Issue: .page class white background overrides .cover-page BizNavy */
.cover-page {
  background: ${primaryColor} !important;
  background-color: ${primaryColor} !important;
}

.page.cover-page {
  background: ${primaryColor} !important;
  background-color: ${primaryColor} !important;
}

/* ===== CRITICAL FIX 2: Dark Section Text Visibility ===== */
/* Issue: Only strong/em styled in Phase 5; regular p text inherits dark color */
.dark-section,
.dark-section p,
.dark-section span,
.dark-section li,
.dark-section strong,
.dark-section em,
.dark-section a,
.dark-section h1,
.dark-section h2,
.dark-section h3,
.dark-section h4,
.dark-section h5,
.dark-section h6,
.dark-section label,
.dark-section td,
.dark-section th {
  color: #FFFFFF !important;
}

.cover-page,
.cover-page p,
.cover-page span,
.cover-page h1,
.cover-page h2,
.cover-page h3,
.cover-page .subtitle,
.cover-page .tagline {
  color: #FFFFFF !important;
}

/* ===== CRITICAL FIX 3: Remove Problematic Overlays ===== */
/* Issue: Light gradient overlays (5-8% opacity) reducing legibility */
.cover-page::before,
.cover-page::after,
.dark-section::before,
.dark-section::after {
  display: none !important;
  content: none !important;
}

/* ===== FIX 4: Typography Hierarchy ===== */
body {
  font-family: 'Open Sans', Arial, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #333333;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Montserrat', 'Open Sans', Arial, sans-serif;
  color: ${primaryColor};
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

h1 { font-size: 2.5rem; font-weight: 700; }
h2 { font-size: 2rem; font-weight: 600; border-bottom: 2px solid ${accentColor}; padding-bottom: 0.5rem; }
h3 { font-size: 1.5rem; font-weight: 600; }
h4 { font-size: 1.25rem; font-weight: 500; }

/* ===== FIX 5: Score Display Contrast ===== */
.score-value {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 3.5rem;
  color: inherit;
}

.score-denominator,
.score-out-of {
  color: #CCCCCC; /* Intentional subtle hierarchy - not a bug */
  font-size: 1.5rem;
}

.health-score-circle {
  width: 180px;
  height: 180px;
  background: linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}cc 100%);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  color: #FFFFFF;
}

.health-score-circle .score {
  font-size: 3.5rem;
  font-weight: 700;
  font-family: 'Montserrat', sans-serif;
  line-height: 1;
  color: #FFFFFF;
}

.health-score-circle .out-of {
  font-size: 1rem;
  opacity: 0.8;
  color: #FFFFFF;
}

/* ===== FIX 6: Information Box Consistency ===== */
.strength-box,
.box-strength {
  background: rgba(150, 148, 35, 0.1);
  border-left: 4px solid ${accentColor};
  padding: 15px 20px;
  margin: 15px 0;
  border-radius: 0 4px 4px 0;
}

.gap-box,
.risk-box,
.box-gap,
.box-risk {
  background: rgba(211, 47, 47, 0.1);
  border-left: 4px solid #D32F2F;
  padding: 15px 20px;
  margin: 15px 0;
  border-radius: 0 4px 4px 0;
}

.action-box,
.box-action,
.recommendation-box {
  background: rgba(33, 38, 83, 0.05);
  border-left: 4px solid ${primaryColor};
  padding: 15px 20px;
  margin: 15px 0;
  border-radius: 0 4px 4px 0;
}

.opportunity-box,
.box-opportunity {
  background: rgba(13, 110, 253, 0.1);
  border-left: 4px solid #0d6efd;
  padding: 15px 20px;
  margin: 15px 0;
  border-radius: 0 4px 4px 0;
}

/* ===== FIX 7: Score Tile Cards ===== */
.score-tile,
.score-card {
  background: #FFFFFF;
  border-left: 4px solid ${accentColor};
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-radius: 0 8px 8px 0;
  margin-bottom: 16px;
}

.score-card .score-value {
  font-size: 3rem;
  font-weight: 700;
  font-family: 'Montserrat', sans-serif;
}

.score-card .score-label {
  font-size: 0.9rem;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ===== FIX 8: Score Band Badges ===== */
.band-badge,
.score-band {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
}

.band-badge.Excellence,
.score-band.excellence {
  background-color: #d4edda;
  color: #155724;
}

.band-badge.Proficiency,
.score-band.proficiency {
  background-color: #cce5ff;
  color: #004085;
}

.band-badge.Attention,
.score-band.attention {
  background-color: #fff3cd;
  color: #856404;
}

.band-badge.Critical,
.score-band.critical {
  background-color: #f8d7da;
  color: #721c24;
}

/* ===== FIX 9: Key Takeaways Box (Dark Section) ===== */
.key-takeaways {
  background: ${primaryColor} !important;
  color: #FFFFFF !important;
  padding: 24px;
  border-radius: 8px;
  margin: 24px 0;
}

.key-takeaways h3,
.key-takeaways h4,
.key-takeaways p,
.key-takeaways li,
.key-takeaways span,
.key-takeaways .takeaway-title,
.key-takeaways .takeaway-text {
  color: #FFFFFF !important;
}

.key-takeaways .takeaway-icon {
  color: ${accentColor} !important;
}

/* ===== FIX 10: Table Styling ===== */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
}

th {
  background-color: ${primaryColor};
  color: #FFFFFF;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
}

td {
  padding: 12px 16px;
  border-bottom: 1px solid #e9ecef;
}

tr:nth-child(even) {
  background-color: #f8f9fa;
}

/* ===== FIX 11: Interactive Table of Contents ===== */
.table-of-contents {
  background: #f8f9fa;
  padding: 24px;
  border-radius: 8px;
  margin: 24px 0;
}

.table-of-contents h3 {
  color: ${primaryColor};
  margin-bottom: 1rem;
}

.table-of-contents ul {
  list-style: none;
  padding-left: 0;
}

.table-of-contents li {
  margin: 8px 0;
}

.table-of-contents a {
  color: ${primaryColor};
  text-decoration: none;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.table-of-contents a:hover {
  background-color: #e9ecef;
  color: ${accentColor};
}

.table-of-contents .section-icon {
  margin-right: 12px;
  color: ${accentColor};
}

/* Nested TOC items */
.table-of-contents ul ul {
  padding-left: 24px;
  margin-top: 4px;
}

.table-of-contents ul ul a {
  font-size: 0.9rem;
  padding: 6px 12px;
}

/* ===== FIX 12: Cross-Reference Links ===== */
.cross-reference,
.see-comprehensive,
.comprehensive-reference {
  background: rgba(150, 148, 35, 0.1);
  padding: 12px 16px;
  border-radius: 4px;
  margin: 16px 0;
  font-style: italic;
  border-left: 3px solid ${accentColor};
}

.cross-reference a,
.see-comprehensive a,
.comprehensive-reference a {
  color: ${accentColor};
  font-weight: 600;
}

/* ===== FIX 13: Print Optimization ===== */
@media print {
  body {
    font-size: 12pt;
    line-height: 1.4;
    max-width: none;
    padding: 0;
  }

  .cover-page {
    background: ${primaryColor} !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .key-takeaways {
    background: ${primaryColor} !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .key-takeaways,
  .key-takeaways * {
    color: #FFFFFF !important;
  }

  h2 {
    page-break-before: always;
  }

  h2:first-of-type {
    page-break-before: auto;
  }

  .score-card,
  .score-tile,
  .insight-card,
  .recommendation-box,
  .risk-box,
  .strength-box,
  .gap-box {
    page-break-inside: avoid;
  }

  .svg-chart-container,
  .chart-container {
    page-break-inside: avoid;
  }

  .table-of-contents {
    page-break-after: always;
  }

  .no-print {
    display: none !important;
  }

  th {
    background-color: ${primaryColor} !important;
    color: #FFFFFF !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .band-badge.Excellence { background-color: #d4edda !important; color: #155724 !important; }
  .band-badge.Proficiency { background-color: #cce5ff !important; color: #004085 !important; }
  .band-badge.Attention { background-color: #fff3cd !important; color: #856404 !important; }
  .band-badge.Critical { background-color: #f8d7da !important; color: #721c24 !important; }
}

/* ===== FIX 14: Responsive Design ===== */
@media (max-width: 768px) {
  h1 { font-size: 1.75rem; }
  h2 { font-size: 1.5rem; }
  h3 { font-size: 1.25rem; }

  .executive-highlights,
  .insight-cards-container,
  .owner-implications-grid,
  .financial-summary-grid,
  .bundle-grid {
    grid-template-columns: 1fr;
  }

  .health-score-circle {
    width: 140px;
    height: 140px;
  }

  .score-value {
    font-size: 2.5rem;
  }

  .dashboard-row,
  .chart-grid {
    flex-direction: column;
  }

  table {
    font-size: 0.875rem;
  }

  th, td {
    padding: 8px 12px;
  }
}

/* ===== FIX 15: Accessibility Enhancements ===== */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Focus states for keyboard navigation */
a:focus,
button:focus {
  outline: 3px solid ${accentColor};
  outline-offset: 2px;
}

/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* ===== ADDITIONAL COMPONENT STYLES ===== */

/* Finding Cards */
.finding-card {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  border-left: 4px solid;
}

.finding-card.strength { background: #d4edda; border-left-color: #28a745; }
.finding-card.gap { background: #f8d7da; border-left-color: #dc3545; }
.finding-card.risk { background: #ffeeba; border-left-color: #ffc107; }
.finding-card.opportunity { background: #cce5ff; border-left-color: #0d6efd; }

.finding-card .label {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.finding-card .dimension {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
}

/* Quick Win Cards */
.quick-win-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #fff 100%);
  border-left: 4px solid ${accentColor};
  padding: 1.25rem;
  border-radius: 0 8px 8px 0;
  margin-bottom: 1rem;
}

.quick-win-card .title {
  font-weight: 600;
  color: ${primaryColor};
  margin-bottom: 0.5rem;
}

.quick-win-card .metrics {
  display: flex;
  gap: 1.5rem;
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.75rem;
}

.quick-win-card .metrics span {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Risk Cards */
.risk-card {
  border-left: 4px solid #dc3545;
  background: #fff;
  padding: 1rem;
  border-radius: 0 8px 8px 0;
  margin-bottom: 1rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}

.risk-card.high { border-left-color: #dc3545; }
.risk-card.medium { border-left-color: #ffc107; }
.risk-card.low { border-left-color: #28a745; }

.risk-card .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.risk-card .category {
  font-weight: 600;
  color: ${primaryColor};
}

/* Timeline/Roadmap */
.timeline {
  position: relative;
  padding-left: 2rem;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0.5rem;
  top: 0;
  bottom: 0;
  width: 3px;
  background: ${primaryColor};
  border-radius: 3px;
}

.timeline-item {
  position: relative;
  padding-bottom: 1.5rem;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -1.75rem;
  top: 0.5rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${accentColor};
  border: 3px solid #fff;
  box-shadow: 0 0 0 3px ${primaryColor};
}

.timeline-item .phase-name {
  font-weight: 600;
  color: ${primaryColor};
  font-size: 1.1rem;
}

.timeline-item .time-horizon {
  font-size: 0.9rem;
  color: ${accentColor};
  margin-bottom: 0.5rem;
}

/* Callout Boxes */
.callout {
  padding: 1.25rem;
  border-radius: 8px;
  margin: 1.5rem 0;
}

.callout.info {
  background: #e7f3ff;
  border-left: 4px solid #0d6efd;
}

.callout.success {
  background: #d4edda;
  border-left: 4px solid #28a745;
}

.callout.warning {
  background: #fff3cd;
  border-left: 4px solid #ffc107;
}

.callout.danger {
  background: #f8d7da;
  border-left: 4px solid #dc3545;
}

.callout .title {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

/* Insight Cards */
.insight-card {
  border-radius: 8px;
  padding: 1rem;
  margin: 0.75rem 0;
  border-left: 4px solid;
}

.insight-card.strength { background: #d4edda; border-left-color: #28a745; }
.insight-card.strength .insight-label { color: #155724; }

.insight-card.weakness,
.insight-card.gap { background: #f8d7da; border-left-color: #dc3545; }
.insight-card.weakness .insight-label,
.insight-card.gap .insight-label { color: #721c24; }

.insight-card.opportunity { background: #cce5ff; border-left-color: #0d6efd; }
.insight-card.opportunity .insight-label { color: #004085; }

.insight-card.warning,
.insight-card.risk { background: #fff3cd; border-left-color: #ffc107; }
.insight-card.warning .insight-label,
.insight-card.risk .insight-label { color: #856404; }

.insight-card .insight-label {
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.25rem;
}

.insight-card .insight-title {
  font-weight: 600;
  color: ${primaryColor};
  margin-bottom: 0.5rem;
}

.insight-card .insight-detail {
  font-size: 0.95rem;
  color: #333;
}

/* Grid Layouts */
.insight-cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.insight-cards-container .insight-card {
  margin: 0;
}

/* Progress Bar */
.progress-bar {
  height: 24px;
  background: #e9ecef;
  border-radius: 12px;
  overflow: hidden;
}

.progress-bar .fill {
  height: 100%;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  transition: width 0.3s ease;
}

/* Benchmark Callouts */
.benchmark-callout {
  background: #e7f3ff;
  border: 1px solid #b8daff;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.benchmark-callout .benchmark-icon {
  font-size: 2rem;
  color: ${primaryColor};
}

.benchmark-callout .benchmark-content { flex: 1; }

.benchmark-callout .benchmark-label {
  font-size: 0.85rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.benchmark-callout .benchmark-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: ${primaryColor};
  font-family: 'Montserrat', sans-serif;
}

.benchmark-callout .benchmark-context {
  font-size: 0.9rem;
  color: #555;
}

/* Evidence Citations */
.evidence-citation {
  background: #f8f9fa;
  border-left: 4px solid ${accentColor};
  border-radius: 0 8px 8px 0;
  padding: 0.75rem 1rem;
  margin: 0.75rem 0 1.25rem 0;
  font-size: 0.9rem;
}

.evidence-citation .citation-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: ${primaryColor};
  margin-bottom: 0.5rem;
}

.evidence-citation .citation-icon {
  color: ${accentColor};
}

.evidence-citation .question-ref {
  color: #666;
  font-size: 0.85rem;
}

.evidence-citation .response-text {
  color: #333;
  font-style: italic;
  margin: 0.5rem 0;
  padding-left: 1rem;
  border-left: 2px solid #ddd;
}

.evidence-citation .benchmark-comparison {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #e0e0e0;
  font-size: 0.85rem;
}

.evidence-citation .benchmark-comparison.above { color: #28a745; }
.evidence-citation .benchmark-comparison.below { color: #dc3545; }
.evidence-citation .benchmark-comparison.at { color: #6c757d; }

/* Bundle Grid (Owner Report) */
.bundle-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.bundle-item {
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 4px;
}

.bundle-item.primary {
  border-left: 3px solid ${primaryColor};
}

.bundle-item a {
  color: ${primaryColor};
  font-weight: 600;
  text-decoration: none;
}

.bundle-item a:hover {
  color: ${accentColor};
}

.bundle-item p {
  font-size: 0.85rem;
  color: #666;
  margin: 0.25rem 0 0 0;
}
`;
}

/**
 * Generate critical fix styles only
 * Use when you want to layer fixes on top of existing styles
 */
export function generateCriticalFixesOnly(
  primaryColor: string = BRAND_COLORS.bizNavy,
  accentColor: string = BRAND_COLORS.bizGreen
): string {
  return `
/* ===== CRITICAL FIXES ONLY ===== */
/* Apply these to fix known Phase 5 CSS issues */

/* FIX 1: Cover Page Background */
.cover-page,
.page.cover-page {
  background: ${primaryColor} !important;
  background-color: ${primaryColor} !important;
}

/* FIX 2: Dark Section Text */
.dark-section *,
.cover-page *,
.key-takeaways * {
  color: #FFFFFF !important;
}

.key-takeaways .takeaway-icon {
  color: ${accentColor} !important;
}

/* FIX 3: Remove Overlays */
.cover-page::before,
.cover-page::after,
.dark-section::before,
.dark-section::after {
  display: none !important;
}

/* FIX 9: Key Takeaways */
.key-takeaways {
  background: ${primaryColor} !important;
}

/* Print fixes */
@media print {
  .cover-page,
  .key-takeaways {
    background: ${primaryColor} !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .cover-page *,
  .key-takeaways * {
    color: #FFFFFF !important;
  }
}
`;
}

/**
 * Export all styles as a single constant for quick import
 */
export const UNIFIED_STYLES = generateUnifiedStyles();
