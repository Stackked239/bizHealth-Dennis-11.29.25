/**
 * Legal Accordion Component
 *
 * A collapsible accordion for displaying legal terms and disclaimers
 * at the end of executive reports. Uses native HTML5 <details>/<summary>
 * for PDF compatibility (no JavaScript required).
 *
 * Brand Colors:
 * - BizNavy: #212653
 * - BizGreen: #969423
 */

// ============================================================================
// TYPES
// ============================================================================

export interface LegalSection {
  /** Section ID (e.g., '1', '2a') */
  id: string;
  /** Section title */
  title: string;
  /** Section HTML content */
  content: string;
  /** Whether section is expanded by default */
  expanded?: boolean;
}

export interface LegalAccordionOptions {
  /** Show section numbers */
  showNumbers?: boolean;
  /** Number of sections to expand by default */
  expandFirst?: number;
  /** Collapse all sections */
  collapseAll?: boolean;
}

// ============================================================================
// CONTENT PARSER
// ============================================================================

/**
 * Parse legal content HTML into structured sections
 *
 * @param htmlContent - Raw HTML content with h3 section headers
 * @returns Array of parsed legal sections
 */
export function parseLegalContent(htmlContent: string): LegalSection[] {
  const sections: LegalSection[] = [];

  // Match section patterns: <h3>Title</h3> followed by content
  const sectionRegex = /<h3>([^<]+)<\/h3>([\s\S]*?)(?=<h3>|$)/gi;
  let match: RegExpExecArray | null;
  let index = 1;

  while ((match = sectionRegex.exec(htmlContent)) !== null) {
    const title = match[1].trim();
    const content = match[2].trim();

    sections.push({
      id: String(index),
      title,
      content,
      expanded: index <= 2, // First 2 sections expanded by default
    });

    index++;
  }

  // If no h3 sections found, try h2 or just return the whole content
  if (sections.length === 0 && htmlContent.trim()) {
    sections.push({
      id: '1',
      title: 'Legal Terms & Disclaimers',
      content: htmlContent,
      expanded: false,
    });
  }

  return sections;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Generate the legal accordion HTML
 *
 * @param sections - Array of legal sections
 * @param options - Accordion configuration options
 * @returns HTML string for the legal accordion
 */
export function generateLegalAccordion(
  sections: LegalSection[],
  options: LegalAccordionOptions = {}
): string {
  const {
    showNumbers = true,
    expandFirst = 0,
    collapseAll = true,
  } = options;

  if (sections.length === 0) {
    return '';
  }

  const sectionItems = sections.map((section, index) => {
    const sectionNumber = showNumbers ? `${section.id}. ` : '';
    const isExpanded = collapseAll
      ? false
      : (expandFirst > 0 ? index < expandFirst : section.expanded);

    return `
      <details class="legal-accordion-item" ${isExpanded ? 'open' : ''}>
        <summary class="legal-accordion-header">
          <span class="accordion-title">${sectionNumber}${escapeHtml(section.title)}</span>
          <span class="accordion-icon"></span>
        </summary>
        <div class="legal-accordion-content">
          ${section.content}
        </div>
      </details>
    `;
  }).join('');

  return `
    <div class="legal-accordion" id="legal-terms" role="region" aria-label="Legal Terms and Disclaimers">
      <div class="legal-accordion-header-bar">
        <h3 class="legal-accordion-title">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
          </svg>
          Legal Terms & Disclaimers
        </h3>
        <span class="legal-version">Document Version 2025.1</span>
      </div>
      <div class="legal-accordion-body">
        ${sectionItems}
      </div>
      <div class="legal-accordion-footer">
        <p>For complete Terms of Service and Privacy Policy, visit: <a href="https://www.bizhealth.ai/legal">www.bizhealth.ai/legal</a></p>
        <p>&copy; 2025 BizHealth.ai, LLC. All Rights Reserved.</p>
      </div>
    </div>
  `;
}

/**
 * Generate styles for the legal accordion
 */
export function getLegalAccordionStyles(): string {
  return `
    /* Legal Accordion Container */
    .legal-accordion {
      margin-top: 3rem;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      overflow: hidden;
      font-family: 'Open Sans', Arial, sans-serif;
      background: #fff;
    }

    /* Header Bar */
    .legal-accordion-header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: #212653;
      color: #fff;
    }

    .legal-accordion-title {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      font-family: 'Montserrat', 'Open Sans', sans-serif;
    }

    .legal-accordion-title svg {
      opacity: 0.9;
    }

    .legal-version {
      font-size: 0.75rem;
      opacity: 0.8;
    }

    /* Accordion Body */
    .legal-accordion-body {
      max-height: 400px;
      overflow-y: auto;
      border-top: 1px solid #e9ecef;
    }

    /* Accordion Items */
    .legal-accordion-item {
      border-bottom: 1px solid #e9ecef;
    }

    .legal-accordion-item:last-child {
      border-bottom: none;
    }

    .legal-accordion-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 20px;
      background: #f8f9fa;
      cursor: pointer;
      list-style: none;
      font-weight: 600;
      font-size: 0.9rem;
      color: #212653;
      transition: background-color 0.2s ease;
    }

    .legal-accordion-header::-webkit-details-marker {
      display: none;
    }

    .legal-accordion-header:hover {
      background: #e9ecef;
    }

    .accordion-icon {
      position: relative;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .accordion-icon::before,
    .accordion-icon::after {
      content: '';
      position: absolute;
      background: #969423;
      transition: transform 0.2s ease;
    }

    .accordion-icon::before {
      top: 50%;
      left: 4px;
      width: 12px;
      height: 2px;
      transform: translateY(-50%);
    }

    .accordion-icon::after {
      top: 4px;
      left: 50%;
      width: 2px;
      height: 12px;
      transform: translateX(-50%);
    }

    details[open] .accordion-icon::after {
      transform: translateX(-50%) rotate(90deg);
      opacity: 0;
    }

    .legal-accordion-content {
      padding: 16px 20px;
      font-size: 0.85rem;
      line-height: 1.6;
      color: #333;
      background: #fff;
    }

    .legal-accordion-content p {
      margin: 0 0 12px 0;
    }

    .legal-accordion-content p:last-child {
      margin-bottom: 0;
    }

    /* Footer */
    .legal-accordion-footer {
      padding: 12px 20px;
      background: #f8f9fa;
      border-top: 1px solid #e9ecef;
      text-align: center;
      font-size: 0.75rem;
      color: #666;
    }

    .legal-accordion-footer p {
      margin: 4px 0;
    }

    .legal-accordion-footer a {
      color: #212653;
      text-decoration: underline;
    }

    .legal-accordion-footer a:hover {
      color: #969423;
    }

    /* Print Styles */
    @media print {
      .legal-accordion {
        page-break-before: always;
        border: none;
      }

      .legal-accordion-body {
        max-height: none;
        overflow: visible;
      }

      .legal-accordion-header {
        background: #f8f9fa !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .legal-accordion-item {
        page-break-inside: avoid;
      }

      details {
        display: block;
      }

      details[open] summary ~ * {
        display: block;
      }

      details:not([open]) summary ~ * {
        display: none;
      }
    }
  `;
}

// ============================================================================
// DEFAULT LEGAL CONTENT
// ============================================================================

/**
 * Get default legal content for executive reports
 */
export function getDefaultLegalContent(): string {
  return `
    <h3>Professional Services Disclaimer</h3>
    <p>This Report is provided for general informational and educational purposes only. It does not constitute professional advice of any kind, including but not limited to legal, financial, tax, accounting, investment, or business consulting advice. BizHealth.ai is not a law firm, accounting firm, or licensed professional advisor.</p>

    <h3>Data Accuracy & Limitations</h3>
    <p>The analyses, scores, recommendations, and other outputs in this Report are based solely on the information provided through the assessment questionnaire. BizHealth.ai does not independently verify the accuracy, completeness, or reliability of the data submitted. The quality of insights directly depends on the quality of input data.</p>

    <h3>Limitation of Liability</h3>
    <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, BIZHEALTH.AI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES ARISING FROM USE OF THIS REPORT. This includes but is not limited to damages for loss of profits, goodwill, use, data, or other intangible losses.</p>

    <h3>AI-Generated Content Notice</h3>
    <p>This Report is generated using artificial intelligence and machine learning technologies. AI outputs may contain errors, omissions, or inaccuracies. All recommendations and insights should be independently verified by qualified professionals before implementation.</p>

    <h3>Intellectual Property</h3>
    <p>This Report constitutes proprietary intellectual property of BizHealth.ai. You are granted a limited, non-exclusive, non-transferable license for internal business purposes only. Reproduction, distribution, or modification without prior written consent is prohibited.</p>

    <h3>Confidentiality</h3>
    <p>This Report contains confidential business information. Do not disclose to third parties without prior written consent from both BizHealth.ai and the assessed entity. Protect this document as you would your own confidential business information.</p>

    <h3>Governing Law</h3>
    <p>These terms shall be governed by the laws of the State of Delaware, United States, without regard to conflict of laws principles. Any disputes shall be resolved through binding arbitration in accordance with the American Arbitration Association rules.</p>
  `;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  generateLegalAccordion,
  getLegalAccordionStyles,
  parseLegalContent,
  getDefaultLegalContent,
};
