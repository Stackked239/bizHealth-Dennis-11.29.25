/**
 * Report Utilities
 */

export {
  convertMarkdownToHtml,
  processNarrativeForReport,
  processNarrativeContent,
  validateNoRawMarkdown,
} from './markdown-sanitizer.js';

export {
  referenceLogger,
} from './reference-logger.js';

export type { ReferenceUsage } from './reference-logger.js';

export {
  transformToOwnerVoice,
  truncateToSentences,
  truncateToWords,
  capitalizeFirst,
  normalizeWhitespace,
} from './voice-transformer.js';
