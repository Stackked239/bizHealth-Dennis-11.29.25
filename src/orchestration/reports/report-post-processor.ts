/**
 * REPORT POST-PROCESSOR
 *
 * Final failsafe before report output. Scans generated HTML for any
 * ASCII diagram content that escaped previous layers and removes it.
 *
 * This is the LAST LINE OF DEFENSE before client-facing output.
 */

import { asciiSanitizer, SanitizationResult } from '../../services/ascii-sanitization.service';
import { createLogger } from '../../utils/logger';

const logger = createLogger('report-post-processor');

export interface PostProcessingResult {
  html: string;
  asciiDetected: boolean;
  asciiRemoved: number;
  processingWarnings: string[];
  sanitizationReport?: {
    blocksRemoved: number;
    linesRemoved: number;
    charactersRemoved: number;
  };
}

export interface PostProcessingOptions {
  /** If true, throw an error instead of sanitizing (for strict mode) */
  strictMode?: boolean;
  /** If true, log detailed sanitization info */
  verbose?: boolean;
}

/**
 * Post-process a generated report HTML to remove any ASCII diagram content
 *
 * @param html The generated report HTML
 * @param reportType The type of report being processed
 * @param reportId Unique identifier for the report
 * @param options Processing options
 * @returns PostProcessingResult with sanitized HTML and metadata
 */
export async function postProcessReport(
  html: string,
  reportType: string,
  reportId: string,
  options: PostProcessingOptions = {}
): Promise<PostProcessingResult> {
  const { strictMode = false, verbose = false } = options;

  const result: PostProcessingResult = {
    html,
    asciiDetected: false,
    asciiRemoved: 0,
    processingWarnings: []
  };

  const context = `${reportType}:${reportId}`;

  // Check for ASCII presence
  if (asciiSanitizer.containsAscii(html)) {
    result.asciiDetected = true;

    const asciiCount = asciiSanitizer.countAsciiOccurrences(html);

    // In strict mode, throw an error instead of sanitizing
    if (strictMode) {
      const error = new Error(
        `ASCII DIAGRAM VIOLATION in ${context}: ` +
          `${asciiCount} forbidden characters detected. ` +
          `Report generation failed in strict mode.`
      );
      logger.error({ reportType, reportId, asciiCount }, error.message);
      throw error;
    }

    // Sanitize the HTML
    const sanitization = asciiSanitizer.sanitizeHtml(html, context);
    result.html = sanitization.sanitized;
    result.asciiRemoved = sanitization.removedBlocks.length;

    // Build sanitization report
    result.sanitizationReport = {
      blocksRemoved: sanitization.removedBlocks.length,
      linesRemoved: sanitization.removedBlocks.reduce((sum, b) => sum + b.lineCount, 0),
      charactersRemoved: sanitization.removedCharCount
    };

    // Generate warnings for each removed block
    for (const block of sanitization.removedBlocks) {
      result.processingWarnings.push(
        `Removed ${block.lineCount}-line ASCII block at position ${block.startIndex}`
      );
    }

    // Log critical warning - this indicates upstream failure
    logger.error(
      {
        reportType,
        reportId,
        asciiCount,
        blocksRemoved: result.asciiRemoved,
        linesRemoved: result.sanitizationReport.linesRemoved,
        charactersRemoved: result.sanitizationReport.charactersRemoved
      },
      'ASCII FAILSAFE ACTIVATED - Report required sanitization'
    );

    if (verbose) {
      logger.debug(
        {
          reportType,
          reportId,
          warnings: result.processingWarnings
        },
        'Detailed sanitization warnings'
      );
    }
  }

  return result;
}

/**
 * Batch post-process multiple reports
 */
export async function postProcessReports(
  reports: Array<{ html: string; reportType: string; reportId: string }>,
  options: PostProcessingOptions = {}
): Promise<Array<{ reportType: string; reportId: string; result: PostProcessingResult }>> {
  const results: Array<{
    reportType: string;
    reportId: string;
    result: PostProcessingResult;
  }> = [];

  for (const report of reports) {
    const result = await postProcessReport(
      report.html,
      report.reportType,
      report.reportId,
      options
    );
    results.push({
      reportType: report.reportType,
      reportId: report.reportId,
      result
    });
  }

  // Summary log
  const reportsWithAscii = results.filter((r) => r.result.asciiDetected);
  if (reportsWithAscii.length > 0) {
    logger.warn(
      {
        totalReports: reports.length,
        reportsWithAscii: reportsWithAscii.length,
        affectedReports: reportsWithAscii.map((r) => r.reportType)
      },
      'Batch post-processing complete - ASCII detected in some reports'
    );
  } else {
    logger.info(
      {
        totalReports: reports.length
      },
      'Batch post-processing complete - All reports clean'
    );
  }

  return results;
}

/**
 * Validate that a report contains no ASCII diagrams (non-sanitizing)
 * Returns validation result without modifying content
 */
export function validateReportAscii(
  html: string,
  reportType: string,
  reportId: string
): {
  isValid: boolean;
  asciiCount: number;
  uniqueChars: string[];
  message: string;
} {
  const containsAscii = asciiSanitizer.containsAscii(html);
  const asciiCount = containsAscii ? asciiSanitizer.countAsciiOccurrences(html) : 0;
  const uniqueChars = containsAscii
    ? [...new Set(html.match(/[┌┐└┘│─┬┴├┤═║╔╗╚╝╠╣╦╩╬█▓░▲▼►◄●○■□▪▫╭╮╯╰┼]/g) || [])]
    : [];

  return {
    isValid: !containsAscii,
    asciiCount,
    uniqueChars,
    message: containsAscii
      ? `FAIL: ${reportType}:${reportId} contains ${asciiCount} ASCII diagram characters: ${uniqueChars.join('')}`
      : `PASS: ${reportType}:${reportId} is ASCII-free`
  };
}
