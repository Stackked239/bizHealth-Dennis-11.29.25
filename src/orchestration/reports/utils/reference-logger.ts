/**
 * Debug logger for tracking reference usage in Owner's Report
 * Enable via BIZHEALTH_DEBUG_REFS=true environment variable
 *
 * Usage:
 *   export BIZHEALTH_DEBUG_REFS=true
 *   npx tsx src/run-pipeline.ts
 */

export interface ReferenceUsage {
  sectionId: string;
  referenceId: string | null;
  mappingFound: boolean;
  comprehensiveTitle: string | null;
  timestamp: string;
}

class ReferenceLogger {
  private enabled: boolean;
  private usages: ReferenceUsage[] = [];
  private missingRefs: Set<string> = new Set();
  private initialized: boolean = false;

  constructor() {
    this.enabled = process.env.BIZHEALTH_DEBUG_REFS === 'true';
  }

  /**
   * Initialize logger (call at start of report generation)
   */
  init(): void {
    if (this.enabled && !this.initialized) {
      console.log('\n+--------------------------------------------------------+');
      console.log('|  REFERENCE LOGGING ENABLED (BIZHEALTH_DEBUG_REFS)       |');
      console.log('+--------------------------------------------------------+\n');
      this.initialized = true;
    }
  }

  /**
   * Log a reference usage attempt
   */
  logReference(
    sectionId: string,
    referenceId: string | null,
    mappingFound: boolean,
    comprehensiveTitle: string | null
  ): void {
    if (!this.enabled) return;

    this.init();

    const usage: ReferenceUsage = {
      sectionId,
      referenceId,
      mappingFound,
      comprehensiveTitle,
      timestamp: new Date().toISOString()
    };

    this.usages.push(usage);

    // Track missing references
    if (referenceId && !mappingFound) {
      this.missingRefs.add(referenceId);
    }

    // Real-time logging
    if (mappingFound) {
      console.log(`  [OK] [${sectionId}] -> "${comprehensiveTitle}"`);
    } else if (referenceId) {
      console.log(`  [MISS] [${sectionId}] Missing mapping for ref: "${referenceId}"`);
    } else {
      console.log(`  [SKIP] [${sectionId}] No reference specified`);
    }
  }

  /**
   * Output summary at end of report generation
   */
  printSummary(): void {
    if (!this.enabled) return;

    console.log('\n+--------------------------------------------------------+');
    console.log('|              REFERENCE USAGE SUMMARY                    |');
    console.log('+--------------------------------------------------------+\n');

    const successful = this.usages.filter(u => u.mappingFound).length;
    const failed = this.usages.filter(u => u.referenceId && !u.mappingFound).length;
    const noRef = this.usages.filter(u => !u.referenceId).length;

    console.log(`  Total sections processed: ${this.usages.length}`);
    console.log(`  [OK] Successful references:  ${successful}`);
    console.log(`  [MISS] Missing references:   ${failed}`);
    console.log(`  [SKIP] Sections without refs: ${noRef}`);

    if (this.missingRefs.size > 0) {
      console.log('\n  WARNING: MISSING REFERENCE IDs (add to SECTION_MAPPINGS):');
      for (const ref of this.missingRefs) {
        console.log(`     - "${ref}"`);
      }
    } else if (failed === 0) {
      console.log('\n  All references resolved successfully!');
    }

    console.log('\n');
  }

  /**
   * Get all usages (for testing/export)
   */
  getUsages(): ReferenceUsage[] {
    return [...this.usages];
  }

  /**
   * Get missing references
   */
  getMissingRefs(): string[] {
    return [...this.missingRefs];
  }

  /**
   * Check if logging is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Reset for new report generation
   */
  reset(): void {
    this.usages = [];
    this.missingRefs.clear();
    this.initialized = false;
  }
}

// Singleton instance
export const referenceLogger = new ReferenceLogger();
