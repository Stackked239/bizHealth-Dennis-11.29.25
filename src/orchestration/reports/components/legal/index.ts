/**
 * Legal Components Index
 *
 * Exports all legal-related components for BizHealth reports.
 */

// Acceptance Banner
export {
  generateAcceptanceBanner,
  getAcceptanceBannerStyles,
} from './acceptance-banner.component.js';

export type { AcceptanceBannerOptions } from './acceptance-banner.component.js';

// Legal Accordion
export {
  generateLegalAccordion,
  getLegalAccordionStyles,
  parseLegalContent,
  getDefaultLegalContent,
} from './legal-accordion.component.js';

export type {
  LegalSection,
  LegalAccordionOptions,
} from './legal-accordion.component.js';
