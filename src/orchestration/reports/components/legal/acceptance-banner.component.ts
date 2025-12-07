/**
 * Acceptance Banner Component
 *
 * A compact, professional banner that displays terms acceptance notice
 * at the top of executive reports. Designed for PDF-first rendering.
 *
 * Brand Colors:
 * - BizNavy: #212653
 * - BizGreen: #969423
 */

// ============================================================================
// TYPES
// ============================================================================

export interface AcceptanceBannerOptions {
  /** Terms version (e.g., '2025.1') */
  termsVersion?: string;
  /** Show link to view full terms */
  showViewTermsLink?: boolean;
  /** Custom acceptance text */
  customText?: string;
  /** Compact mode (smaller text) */
  compact?: boolean;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Generate the acceptance banner HTML
 *
 * @param options - Banner configuration options
 * @returns HTML string for the acceptance banner
 */
export function generateAcceptanceBanner(options: AcceptanceBannerOptions = {}): string {
  const {
    termsVersion = '2025.1',
    showViewTermsLink = true,
    customText,
    compact = false,
  } = options;

  const defaultText = `By accessing this report, you acknowledge acceptance of the BizHealth.ai Terms of Service (v${termsVersion}). This document contains confidential business information.`;

  const bannerText = customText || defaultText;

  return `
    <div class="acceptance-banner ${compact ? 'compact' : ''}" role="alert" aria-label="Terms Acceptance Notice">
      <div class="banner-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8h-2V7h2v2z"/>
        </svg>
      </div>
      <div class="banner-content">
        <span class="banner-text">${bannerText}</span>
        ${showViewTermsLink ? `
          <a href="#legal-terms" class="banner-link">View Full Terms</a>
        ` : ''}
      </div>
    </div>
  `;
}

/**
 * Generate styles for the acceptance banner
 */
export function getAcceptanceBannerStyles(): string {
  return `
    /* Acceptance Banner Styles */
    .acceptance-banner {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 16px;
      background: linear-gradient(135deg, #f8f9fa 0%, #fff 100%);
      border: 1px solid #e9ecef;
      border-left: 4px solid #212653;
      border-radius: 0 8px 8px 0;
      margin-bottom: 1.5rem;
      font-size: 0.85rem;
      line-height: 1.5;
    }

    .acceptance-banner.compact {
      padding: 8px 12px;
      font-size: 0.8rem;
      margin-bottom: 1rem;
    }

    .acceptance-banner .banner-icon {
      flex-shrink: 0;
      color: #212653;
      margin-top: 2px;
    }

    .acceptance-banner .banner-content {
      flex: 1;
      color: #333;
    }

    .acceptance-banner .banner-text {
      display: inline;
    }

    .acceptance-banner .banner-link {
      display: inline-block;
      margin-left: 8px;
      color: #969423;
      font-weight: 600;
      text-decoration: none;
      border-bottom: 1px dotted #969423;
    }

    .acceptance-banner .banner-link:hover {
      color: #212653;
      border-bottom-color: #212653;
    }

    /* Print Styles */
    @media print {
      .acceptance-banner {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        page-break-inside: avoid;
      }

      .acceptance-banner .banner-link {
        display: none;
      }
    }
  `;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  generateAcceptanceBanner,
  getAcceptanceBannerStyles,
};
