/**
 * BizHealth Quick Win Card (Owner's Report)
 *
 * Simplified variant of Action Plan Card:
 * - Compact design (100% width, 2 per row)
 * - Focus on speed (all <90 days)
 * - High ROI emphasis
 * - "Learn More" link to Comprehensive Report
 *
 * Deploy to:
 * - Owner's Report: Quick wins section (Page 3)
 * - Executive Brief: Recommended actions
 */

import { BRAND_COLORS } from '../../utils/color-utils.js';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Quick win card data
 */
export interface QuickWinCard {
  /** Unique identifier */
  id: string;
  /** Card title */
  title: string;
  /** Current state description */
  currentState: string; // e.g., "16-hour response time"
  /** Target state description */
  targetState: string; // e.g., "4-hour response time"
  /** Implementation timeline */
  timeline: string; // e.g., "30 days"
  /** Investment range string */
  investment: string; // e.g., "$5K-$10K"
  /** Expected return string */
  expectedReturn: string; // e.g., "$2.3M annually"
  /** ROI string */
  roi: string; // e.g., "20x"
  /** Responsible owner */
  owner: string;
  /** Page reference in comprehensive report */
  comprehensiveReportPage: number;
  /** Card icon (emoji) */
  icon: string;
}

/**
 * Quick win card rendering options
 */
export interface QuickWinCardOptions {
  /** Show "Learn More" link */
  showLearnMore?: boolean;
  /** Custom CSS class */
  className?: string;
}

/**
 * Quick wins grid options
 */
export interface QuickWinsGridOptions extends QuickWinCardOptions {
  /** Number of columns (1 or 2) */
  columns?: 1 | 2;
  /** Grid title */
  title?: string;
  /** Show header section */
  showHeader?: boolean;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ============================================================================
// MAIN RENDER FUNCTION
// ============================================================================

/**
 * Generate Quick Win Card
 *
 * @param card - Quick win card data
 * @param options - Optional rendering configuration
 * @returns HTML string containing the quick win card
 *
 * @example
 * ```typescript
 * const html = generateQuickWinCard({
 *   id: 'qw-001',
 *   title: 'Reduce Customer Response Time',
 *   currentState: '16-hour response time',
 *   targetState: '4-hour response time',
 *   timeline: '30 days',
 *   investment: '$5K-$10K',
 *   expectedReturn: '$2.3M annually',
 *   roi: '20x',
 *   owner: 'Customer Service Manager',
 *   comprehensiveReportPage: 45,
 *   icon: '⚡'
 * });
 * ```
 */
export function generateQuickWinCard(
  card: QuickWinCard,
  options: QuickWinCardOptions = {}
): string {
  const { showLearnMore = true, className = '' } = options;

  return `
    <div class="quick-win-card ${className}" data-card-id="${card.id}" style="
      background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
      border: 2px solid #28a745;
      border-radius: 12pt;
      padding: 20pt;
      page-break-inside: avoid;
    ">
      <!-- Header -->
      <div style="display: flex; align-items: flex-start; gap: 12pt; margin-bottom: 16pt;">
        <span style="font-size: 28pt;">${card.icon}</span>
        <div style="flex: 1;">
          <div style="
            display: inline-block;
            padding: 3pt 10pt;
            background: #28a745;
            color: white;
            border-radius: 4pt;
            font-family: 'Montserrat', Arial, sans-serif;
            font-size: 9pt;
            font-weight: 700;
            margin-bottom: 6pt;
          ">⚡ QUICK WIN</div>
          <h3 style="
            font-family: 'Montserrat', Arial, sans-serif;
            font-size: 14pt;
            font-weight: 700;
            color: ${BRAND_COLORS.navy};
            margin: 0;
            line-height: 1.3;
          ">${escapeHtml(card.title)}</h3>
        </div>
        <div style="
          padding: 6pt 14pt;
          background: ${BRAND_COLORS.navy};
          color: white;
          border-radius: 20pt;
          font-family: 'Montserrat', Arial, sans-serif;
          font-size: 11pt;
          font-weight: 700;
          white-space: nowrap;
        ">${escapeHtml(card.timeline)}</div>
      </div>

      <!-- Current → Target -->
      <div style="
        display: flex;
        align-items: center;
        gap: 12pt;
        padding: 12pt 16pt;
        background: white;
        border-radius: 8pt;
        margin-bottom: 16pt;
      ">
        <div style="flex: 1; text-align: center;">
          <div style="font-size: 9pt; color: #dc3545; text-transform: uppercase; letter-spacing: 0.5px;">Current</div>
          <div style="font-family: 'Montserrat', Arial, sans-serif; font-size: 13pt; font-weight: 600; color: #dc3545;">
            ${escapeHtml(card.currentState)}
          </div>
        </div>
        <div style="font-size: 20pt; color: #28a745;">→</div>
        <div style="flex: 1; text-align: center;">
          <div style="font-size: 9pt; color: #28a745; text-transform: uppercase; letter-spacing: 0.5px;">Target</div>
          <div style="font-family: 'Montserrat', Arial, sans-serif; font-size: 13pt; font-weight: 600; color: #28a745;">
            ${escapeHtml(card.targetState)}
          </div>
        </div>
      </div>

      <!-- Metrics Row -->
      <div style="
        display: flex;
        gap: 16pt;
        margin-bottom: 12pt;
      ">
        <div style="flex: 1; text-align: center;">
          <div style="font-size: 9pt; color: #666;">Investment</div>
          <div style="font-family: 'Montserrat', Arial, sans-serif; font-size: 13pt; font-weight: 700; color: ${BRAND_COLORS.navy};">
            ${escapeHtml(card.investment)}
          </div>
        </div>
        <div style="flex: 1; text-align: center;">
          <div style="font-size: 9pt; color: #666;">Return</div>
          <div style="font-family: 'Montserrat', Arial, sans-serif; font-size: 13pt; font-weight: 700; color: #28a745;">
            ${escapeHtml(card.expectedReturn)}
          </div>
        </div>
        <div style="flex: 1; text-align: center;">
          <div style="font-size: 9pt; color: #666;">ROI</div>
          <div style="font-family: 'Montserrat', Arial, sans-serif; font-size: 13pt; font-weight: 700; color: ${BRAND_COLORS.green};">
            ${escapeHtml(card.roi)}
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 12pt;
        border-top: 1px dashed #c3e6cb;
      ">
        <div style="font-size: 10pt; color: #666;">
          <strong>Owner:</strong> ${escapeHtml(card.owner)}
        </div>
        ${
          showLearnMore && card.comprehensiveReportPage
            ? `
          <a href="#page-${card.comprehensiveReportPage}" style="
            font-family: 'Montserrat', Arial, sans-serif;
            font-size: 10pt;
            font-weight: 600;
            color: #0d6efd;
            text-decoration: none;
          ">Learn More →</a>
        `
            : ''
        }
      </div>
    </div>
  `;
}

/**
 * Generate grid of quick win cards
 *
 * @param cards - Array of quick win card data
 * @param options - Optional grid and card rendering configuration
 * @returns HTML string containing the card grid
 */
export function generateQuickWinsGrid(
  cards: QuickWinCard[],
  options: QuickWinsGridOptions = {}
): string {
  const {
    columns = 2,
    title = '⚡ Quick Wins — High Impact, Low Effort',
    showHeader = true,
  } = options;

  const header = showHeader
    ? `
    <div style="margin-bottom: 24pt;">
      <h2 style="
        font-family: 'Montserrat', Arial, sans-serif;
        font-size: 20pt;
        font-weight: 700;
        color: ${BRAND_COLORS.navy};
        margin: 0 0 8pt 0;
      ">${title}</h2>
      <p style="
        font-family: 'Open Sans', Arial, sans-serif;
        font-size: 11pt;
        color: #666;
        margin: 0;
      ">These initiatives can be implemented within 90 days with minimal investment for maximum impact.</p>
    </div>
  `
    : '';

  return `
    <div class="quick-wins-section">
      ${header}

      <div class="quick-wins-grid" style="
        display: grid;
        grid-template-columns: repeat(${columns}, 1fr);
        gap: 20pt;
        margin: 24pt 0;
      ">
        ${cards.map(card => generateQuickWinCard(card, options)).join('')}
      </div>

      <style>
        @media (max-width: 768px) {
          .quick-wins-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media print {
          .quick-wins-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      </style>
    </div>
  `;
}

/**
 * Generate single-column list of quick wins
 */
export function generateQuickWinsList(
  cards: QuickWinCard[],
  options: QuickWinCardOptions = {}
): string {
  return `
    <div class="quick-wins-list" style="
      display: flex;
      flex-direction: column;
      gap: 16pt;
      margin: 24pt 0;
    ">
      ${cards.map(card => generateQuickWinCard(card, options)).join('')}
    </div>
  `;
}

/**
 * Generate compact quick win row (for summary tables)
 */
export function generateQuickWinRow(card: QuickWinCard): string {
  return `
    <div class="quick-win-row" style="
      display: flex;
      align-items: center;
      gap: 16pt;
      padding: 12pt 16pt;
      background: #f0fdf4;
      border-left: 4px solid #28a745;
      border-radius: 0 8pt 8pt 0;
      margin: 8pt 0;
    ">
      <span style="font-size: 20pt;">${card.icon}</span>
      <div style="flex: 1;">
        <div style="
          font-family: 'Montserrat', Arial, sans-serif;
          font-size: 12pt;
          font-weight: 600;
          color: ${BRAND_COLORS.navy};
        ">${escapeHtml(card.title)}</div>
        <div style="font-size: 10pt; color: #666; margin-top: 2pt;">
          ${escapeHtml(card.currentState)} → ${escapeHtml(card.targetState)}
        </div>
      </div>
      <div style="
        padding: 4pt 10pt;
        background: ${BRAND_COLORS.navy};
        color: white;
        border-radius: 12pt;
        font-size: 10pt;
        font-weight: 600;
      ">${escapeHtml(card.timeline)}</div>
      <div style="text-align: right; min-width: 70pt;">
        <div style="font-size: 9pt; color: #666;">ROI</div>
        <div style="font-family: 'Montserrat', Arial, sans-serif; font-size: 14pt; font-weight: 700; color: ${BRAND_COLORS.green};">
          ${escapeHtml(card.roi)}
        </div>
      </div>
    </div>
  `;
}

/**
 * Generate quick wins summary section
 */
export function generateQuickWinsSummary(
  cards: QuickWinCard[],
  title: string = 'Quick Wins Summary'
): string {
  const totalInvestment = cards.length > 0 ? `${cards.length} initiatives` : 'No quick wins';

  return `
    <div class="quick-wins-summary" style="
      background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
      border: 2px solid #28a745;
      border-radius: 16pt;
      padding: 24pt;
      margin: 24pt 0;
    ">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20pt;">
        <h3 style="
          font-family: 'Montserrat', Arial, sans-serif;
          font-size: 16pt;
          font-weight: 700;
          color: ${BRAND_COLORS.navy};
          margin: 0;
        ">⚡ ${escapeHtml(title)}</h3>
        <span style="
          padding: 6pt 14pt;
          background: #28a745;
          color: white;
          border-radius: 20pt;
          font-family: 'Montserrat', Arial, sans-serif;
          font-size: 11pt;
          font-weight: 700;
        ">${totalInvestment}</span>
      </div>

      <div style="display: flex; flex-direction: column; gap: 8pt;">
        ${cards.map(card => generateQuickWinRow(card)).join('')}
      </div>
    </div>
  `;
}

/**
 * Generate quick win badge (for inline use)
 */
export function generateQuickWinBadge(timeline: string = '90 days'): string {
  return `
    <span class="quick-win-badge" style="
      display: inline-flex;
      align-items: center;
      gap: 4pt;
      padding: 4pt 10pt;
      background: #28a745;
      color: white;
      border-radius: 12pt;
      font-family: 'Montserrat', Arial, sans-serif;
      font-size: 9pt;
      font-weight: 700;
    ">
      ⚡ Quick Win (${escapeHtml(timeline)})
    </span>
  `;
}

/**
 * Generate transformation arrow visualization
 */
export function generateTransformationArrow(
  from: string,
  to: string,
  timeline?: string
): string {
  return `
    <div class="transformation-arrow" style="
      display: flex;
      align-items: center;
      gap: 16pt;
      padding: 16pt 20pt;
      background: white;
      border: 1px solid #e9ecef;
      border-radius: 12pt;
      margin: 12pt 0;
    ">
      <div style="flex: 1; text-align: center;">
        <div style="font-size: 9pt; color: #dc3545; text-transform: uppercase; margin-bottom: 4pt;">Before</div>
        <div style="font-family: 'Montserrat', Arial, sans-serif; font-size: 14pt; font-weight: 600; color: #dc3545;">
          ${escapeHtml(from)}
        </div>
      </div>

      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4pt;
      ">
        <span style="font-size: 28pt; color: #28a745;">→</span>
        ${timeline ? `<span style="font-size: 9pt; color: #666;">${escapeHtml(timeline)}</span>` : ''}
      </div>

      <div style="flex: 1; text-align: center;">
        <div style="font-size: 9pt; color: #28a745; text-transform: uppercase; margin-bottom: 4pt;">After</div>
        <div style="font-family: 'Montserrat', Arial, sans-serif; font-size: 14pt; font-weight: 600; color: #28a745;">
          ${escapeHtml(to)}
        </div>
      </div>
    </div>
  `;
}
