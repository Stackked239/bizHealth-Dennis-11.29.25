/**
 * Report QA Harness
 *
 * Generates sample reports for manual quality verification.
 * Run with: npx tsx src/qa/report-qa-harness.ts
 *
 * This harness generates test reports using the Phase 5 builders with
 * Phase 4 visual patterns, allowing manual verification of:
 * - Brand compliance (BizNavy, BizGreen)
 * - CSS class application
 * - Visual layout and styling
 * - Print optimization
 * - Interactive features
 *
 * @module report-qa-harness
 * @version 1.0.0
 * @date 2025-12-05
 */

import * as fs from 'fs';
import * as path from 'path';
import { buildOwnersReport } from '../orchestration/reports/owners-report.builder.js';
import { buildComprehensiveReport } from '../orchestration/reports/comprehensive-report.builder.js';
import { buildQuickWinsReport } from '../orchestration/reports/quick-wins-report.builder.js';
import { buildExecutiveBrief } from '../orchestration/reports/executive-brief.builder.js';
import {
  createSampleReportContext,
  createHighPerformingContext,
  createLowPerformingContext,
} from './fixtures/sample-context.js';
import type { ReportRenderOptions } from '../types/report.types.js';

// Brand colors
const BRAND_OPTIONS: ReportRenderOptions['brand'] = {
  primaryColor: '#212653', // BizNavy
  accentColor: '#969423',  // BizGreen
};

/**
 * Generate QA sample reports
 */
async function generateQASamples(): Promise<void> {
  console.log('====================================================');
  console.log('BizHealth Report QA Harness');
  console.log('Phase 4/5 Formatting Consolidation Verification');
  console.log('====================================================\n');

  // Create output directory
  const outputDir = path.join(process.cwd(), 'qa-samples');
  fs.mkdirSync(outputDir, { recursive: true });

  // Create subdirectories for different test scenarios
  const standardDir = path.join(outputDir, 'standard');
  const highDir = path.join(outputDir, 'high-performer');
  const lowDir = path.join(outputDir, 'low-performer');

  fs.mkdirSync(standardDir, { recursive: true });
  fs.mkdirSync(highDir, { recursive: true });
  fs.mkdirSync(lowDir, { recursive: true });

  // Generate standard test reports
  console.log('Generating standard test reports...');
  await generateReportSet(createSampleReportContext(), standardDir, 'standard');

  // Generate high performer reports (Excellence band)
  console.log('\nGenerating high performer reports (Excellence band)...');
  await generateReportSet(createHighPerformingContext(), highDir, 'high-performer');

  // Generate low performer reports (Critical band)
  console.log('\nGenerating low performer reports (Critical band)...');
  await generateReportSet(createLowPerformingContext(), lowDir, 'low-performer');

  // Print verification checklist
  printVerificationChecklist(outputDir);
}

/**
 * Generate a set of reports for a given context
 */
async function generateReportSet(
  ctx: any,
  outputDir: string,
  scenarioName: string
): Promise<void> {
  const renderOptions: ReportRenderOptions = {
    outputDir,
    brand: BRAND_OPTIONS,
    includeTOC: true,
    includeCharts: true,
  };

  const reports = [
    { name: 'owner', builder: buildOwnersReport },
    { name: 'comprehensive', builder: buildComprehensiveReport },
    { name: 'quickWins', builder: buildQuickWinsReport },
    { name: 'executiveBrief', builder: buildExecutiveBrief },
  ];

  for (const report of reports) {
    try {
      console.log(`  Generating ${report.name}...`);
      await report.builder(ctx, renderOptions);
      console.log(`  [OK] ${report.name}.html`);
    } catch (error) {
      console.error(`  [FAIL] ${report.name}:`, (error as Error).message);
    }
  }
}

/**
 * Print the QA verification checklist
 */
function printVerificationChecklist(outputDir: string): void {
  console.log('\n' + '='.repeat(60));
  console.log('QA VERIFICATION CHECKLIST');
  console.log('='.repeat(60));
  console.log(`
Generated reports are available at: ${outputDir}

Open in browser with: file://${outputDir}/standard/owner.html

BRAND COMPLIANCE:
  [ ] BizNavy (#212653) used for headings and primary elements
  [ ] BizGreen (#969423) used for accents and highlights
  [ ] Montserrat font used for all headings (H1-H6)
  [ ] Open Sans font used for body text

PHASE 4 VISUAL PATTERNS:
  [ ] Score circles have gradient backgrounds matching score band
  [ ] Chapter cards have gradient backgrounds with proper colors
  [ ] Tables have rounded corners (10px) and shadows
  [ ] Tables have BizNavy header backgrounds
  [ ] Findings use 3-column gradient card layout
  [ ] Risk items have left border accent (5px)
  [ ] Timeline phases have colored headers with negative margins
  [ ] Quick wins have proper impact score badges

PHASE 5 FEATURES PRESERVED:
  [ ] Interactive Table of Contents works (Comprehensive Report)
  [ ] Cross-references link correctly (Owner's -> Comprehensive)
  [ ] All AI-generated narrative content placeholders are present
  [ ] No content loss compared to previous Phase 5 output

SCORE BAND VERIFICATION:
  Standard (Attention band):
    [ ] Score circle shows attention colors (yellow/amber)
    [ ] Chapter cards show appropriate band colors
    [ ] Priority indicators highlight attention areas

  High Performer (Excellence band):
    [ ] Score circle shows excellence colors (green)
    [ ] Chapter cards show excellence styling
    [ ] Strengths highlighted appropriately

  Low Performer (Critical band):
    [ ] Score circle shows critical colors (red)
    [ ] Chapter cards show critical styling
    [ ] Urgent priorities highlighted

PDF EXPORT TESTING:
  [ ] Page breaks occur at logical section boundaries
  [ ] Colors render correctly (print-color-adjust)
  [ ] Tables don't break awkwardly across pages
  [ ] Headers and footers are consistent

RESPONSIVE DESIGN:
  [ ] Reports display correctly on desktop (1200px+)
  [ ] Reports are readable on tablet (768px)
  [ ] Mobile view (< 768px) shows single-column layout
`);

  console.log('='.repeat(60));
  console.log('To run this harness:');
  console.log('  npx tsx src/qa/report-qa-harness.ts');
  console.log('='.repeat(60));
}

// Run the harness
generateQASamples().catch((error) => {
  console.error('QA Harness failed:', error);
  process.exit(1);
});
