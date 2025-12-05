/**
 * BizHealth Content Sanitizer
 *
 * Removes orphaned visualization headers from AI-generated narrative content
 * that reference charts which should be rendered separately by Phase 5.
 *
 * @module content-sanitizer
 */

/**
 * Result of content sanitization
 */
export interface SanitizationResult {
  /** Sanitized HTML content */
  html: string;
  /** Number of items removed */
  removedCount: number;
  /** List of removed items for logging */
  removedItems: string[];
}

/**
 * Sanitize orphaned visualization headers from AI-generated content
 *
 * This function removes:
 * - "Visual X" headers followed immediately by <hr> (empty sections)
 * - Explicit visualization section headers with no content
 * - Standalone cascade effects labels without diagrams
 *
 * @param html - The raw HTML content to sanitize
 * @returns Sanitization result with cleaned HTML and removal stats
 */
export function sanitizeOrphanedVisualizationHeaders(html: string): SanitizationResult {
  const removedItems: string[] = [];
  let sanitized = html;

  // Pattern 1: "Visual X" headers followed immediately by <hr> (empty section)
  // Example: <h3>Visual Benchmark Position</h3><hr class="bh-section-divider">
  const visualHeaderPattern = /<h[23][^>]*>\s*Visual[^<]*<\/h[23]>\s*<hr[^>]*>/gi;

  // Pattern 2: Explicit visualization section headers with no content
  const explicitVizHeaders = [
    'Risk Heat Map',
    'Transformation Summary Matrix',
    'Growth Trajectory Model',
    'Scenario Analysis',
    'Pattern Frequency Matrix',
    'Cascade Effects',
    'Implementation Timeline',
    'Financial Impact Visualization',
    'Visual Benchmark Position',
    'Performance Dashboard',
    'Score Distribution',
    'Trend Analysis Chart',
    'Comparison Matrix'
  ];

  // Pattern 3: Standalone "Cascade Effects:" labels without diagrams
  const cascadePattern = /<p[^>]*><strong[^>]*>Cascade Effects:<\/strong><\/p>\s*(?=<p[^>]*><strong)/gi;

  // Pattern 4: Empty visualization placeholders
  const emptyPlaceholderPattern = /<!--\s*VISUALIZATION_PLACEHOLDER_\d+\s*-->/gi;

  // Pattern 5: ASCII art visualization blocks that leaked through
  const asciiVizPattern = /<pre[^>]*class="[^"]*visual[^"]*"[^>]*>[\s\S]*?<\/pre>/gi;

  // Remove Visual X headers
  sanitized = sanitized.replace(visualHeaderPattern, (match) => {
    const truncated = match.length > 60 ? match.substring(0, 60) + '...' : match;
    removedItems.push(`Visual header: ${truncated}`);
    return '';
  });

  // Remove explicit visualization headers that are followed by <hr> (empty)
  explicitVizHeaders.forEach(header => {
    // Match header followed by <hr> or by another header (empty section)
    const pattern = new RegExp(
      `<h[23][^>]*>\\s*${escapeRegex(header)}\\s*<\\/h[23]>\\s*(?:<hr[^>]*>|(?=<h[23]))`,
      'gi'
    );
    sanitized = sanitized.replace(pattern, (match) => {
      removedItems.push(`Orphaned: ${header}`);
      return '';
    });
  });

  // Remove empty cascade effects labels
  sanitized = sanitized.replace(cascadePattern, (match) => {
    removedItems.push('Empty Cascade Effects label');
    return '';
  });

  // Remove empty visualization placeholders
  sanitized = sanitized.replace(emptyPlaceholderPattern, (match) => {
    removedItems.push('Empty visualization placeholder');
    return '';
  });

  // Remove ASCII visualization blocks
  sanitized = sanitized.replace(asciiVizPattern, (match) => {
    removedItems.push('ASCII visualization block');
    return '';
  });

  // Clean up any double <hr> tags that might result
  sanitized = sanitized.replace(/(<hr[^>]*>\s*){2,}/gi, '<hr class="bh-section-divider">');

  // Clean up any empty paragraphs
  sanitized = sanitized.replace(/<p[^>]*>\s*<\/p>/gi, '');

  // Clean up excessive whitespace while preserving structure
  sanitized = sanitized.replace(/\n{3,}/g, '\n\n');

  return {
    html: sanitized,
    removedCount: removedItems.length,
    removedItems
  };
}

/**
 * Validate that no orphaned headers remain in the content
 *
 * @param html - The HTML content to validate
 * @returns Validation result with pass/fail and any issues found
 */
export function validateNoOrphanedHeaders(html: string): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  const orphanPatterns = [
    { pattern: /Visual Benchmark Position/gi, name: 'Visual Benchmark Position' },
    { pattern: /<h[23][^>]*>Risk Heat Map<\/h[23]>\s*<hr/gi, name: 'Empty Risk Heat Map' },
    { pattern: /<h[23][^>]*>Transformation Summary Matrix<\/h[23]>\s*<hr/gi, name: 'Empty Summary Matrix' },
    { pattern: /<h[23][^>]*>Cascade Effects<\/h[23]>\s*(?![\s\S]*<svg)/gi, name: 'Empty Cascade Effects' },
    { pattern: /<h[23][^>]*>Growth Trajectory Model<\/h[23]>\s*<hr/gi, name: 'Empty Growth Model' },
    { pattern: /<h[23][^>]*>Scenario Analysis<\/h[23]>\s*<hr/gi, name: 'Empty Scenario Analysis' },
    { pattern: /<h[23][^>]*>Pattern Frequency Matrix<\/h[23]>\s*<hr/gi, name: 'Empty Pattern Matrix' },
    { pattern: /<!--\s*VISUALIZATION_PLACEHOLDER_\d+\s*-->/gi, name: 'Unreplaced placeholder' }
  ];

  orphanPatterns.forEach(({ pattern, name }) => {
    // Reset lastIndex for global patterns
    pattern.lastIndex = 0;
    if (pattern.test(html)) {
      issues.push(`Found orphaned header: ${name}`);
    }
  });

  return { valid: issues.length === 0, issues };
}

/**
 * Process narrative content for a specific section
 * Sanitizes content and logs any removals
 *
 * @param rawContent - The raw narrative content
 * @param sectionId - Identifier for logging purposes
 * @returns Sanitized HTML content
 */
export function processNarrativeForVisualization(rawContent: string, sectionId: string): string {
  const { html, removedCount, removedItems } = sanitizeOrphanedVisualizationHeaders(rawContent);

  if (removedCount > 0) {
    // Log removals for debugging (use console.log for now, could be replaced with logger)
    console.log(`[${sectionId}] Sanitized ${removedCount} orphaned visualization headers:`, removedItems);
  }

  return html;
}

/**
 * Escape special regex characters in a string
 * @param str - String to escape
 * @returns Escaped string safe for use in RegExp
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Check if content has any visualization-related issues
 * Useful for pre-flight checks before report generation
 *
 * @param html - HTML content to check
 * @returns Object with check results
 */
export function checkVisualizationIssues(html: string): {
  hasOrphanedHeaders: boolean;
  hasEmptyPlaceholders: boolean;
  hasAsciiArt: boolean;
  totalIssues: number;
  details: string[];
} {
  const details: string[] = [];

  // Check for orphaned headers
  const orphanedHeaderPattern = /<h[23][^>]*>(?:Visual|Risk Heat Map|Transformation|Growth Trajectory)[^<]*<\/h[23]>\s*<hr/gi;
  const orphanedMatches = html.match(orphanedHeaderPattern) || [];
  if (orphanedMatches.length > 0) {
    details.push(`${orphanedMatches.length} orphaned visualization header(s)`);
  }

  // Check for empty placeholders
  const placeholderPattern = /<!--\s*VISUALIZATION_PLACEHOLDER_\d+\s*-->/gi;
  const placeholderMatches = html.match(placeholderPattern) || [];
  if (placeholderMatches.length > 0) {
    details.push(`${placeholderMatches.length} unreplaced placeholder(s)`);
  }

  // Check for ASCII art that might have leaked through
  const asciiPattern = /[│┌┐└┘├┤┬┴┼═║╔╗╚╝╠╣╦╩╬]/g;
  const asciiMatches = html.match(asciiPattern) || [];
  if (asciiMatches.length > 10) { // Threshold to avoid false positives
    details.push(`Potential ASCII art detected (${asciiMatches.length} box-drawing characters)`);
  }

  return {
    hasOrphanedHeaders: orphanedMatches.length > 0,
    hasEmptyPlaceholders: placeholderMatches.length > 0,
    hasAsciiArt: asciiMatches.length > 10,
    totalIssues: details.length,
    details
  };
}
