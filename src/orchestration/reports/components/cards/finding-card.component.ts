/**
 * Finding Card Component for Manager Reports
 *
 * Rich finding cards for displaying:
 * - Strengths
 * - Gaps/Weaknesses
 * - Risks
 * - Opportunities
 *
 * @module finding-card
 */

import type { ReportFinding } from '../../../../types/report.types.js';
import {
  safeStringValue,
  safeArray,
  safeHtml,
} from '../../utils/safe-extract.js';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Finding type for styling
 */
export type FindingType = 'strength' | 'gap' | 'risk' | 'opportunity';

/**
 * Finding card rendering options
 */
export interface FindingCardOptions {
  /** Show evidence references */
  showEvidence?: boolean;
  /** Show dimension context */
  showDimension?: boolean;
  /** Custom CSS class */
  className?: string;
}

/**
 * Finding type configuration
 */
interface FindingTypeConfig {
  icon: string;
  borderColor: string;
  bgColor: string;
  labelColor: string;
  label: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Configuration for each finding type
 */
const FINDING_TYPE_CONFIG: Record<FindingType, FindingTypeConfig> = {
  strength: {
    icon: '✓',
    borderColor: '#059669',
    bgColor: '#f0fdf4',
    labelColor: '#059669',
    label: 'Strength'
  },
  gap: {
    icon: '⚠',
    borderColor: '#d97706',
    bgColor: '#fffbeb',
    labelColor: '#d97706',
    label: 'Area for Improvement'
  },
  risk: {
    icon: '⚡',
    borderColor: '#dc2626',
    bgColor: '#fef2f2',
    labelColor: '#dc2626',
    label: 'Risk'
  },
  opportunity: {
    icon: '↗',
    borderColor: '#2563eb',
    bgColor: '#eff6ff',
    labelColor: '#2563eb',
    label: 'Opportunity'
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Determine finding type from ReportFinding
 */
function getFindingType(finding: ReportFinding): FindingType {
  const type = finding.type?.toLowerCase() || 'gap';
  if (type === 'strength') return 'strength';
  if (type === 'gap' || type === 'weakness') return 'gap';
  if (type === 'risk') return 'risk';
  if (type === 'opportunity') return 'opportunity';
  return 'gap';
}

/**
 * Get configuration for a finding type
 */
function getTypeConfig(type: FindingType): FindingTypeConfig {
  return FINDING_TYPE_CONFIG[type] || FINDING_TYPE_CONFIG.gap;
}

// ============================================================================
// MAIN RENDER FUNCTIONS
// ============================================================================

/**
 * Render a single finding card
 */
export function renderFindingCard(
  finding: ReportFinding,
  options: FindingCardOptions = {}
): string {
  const {
    showEvidence = false,
    showDimension = true,
    className = ''
  } = options;

  const type = getFindingType(finding);
  const config = getTypeConfig(type);

  const shortLabel = safeStringValue(finding.shortLabel, 'Finding');
  const narrative = safeStringValue(finding.narrative, 'Details pending analysis');
  const dimensionName = safeStringValue(finding.dimensionName, '');

  // Extract evidence if available
  const evidenceRefs = finding.evidenceRefs || {};
  const hasEvidence = showEvidence && (
    (evidenceRefs.metrics?.length || 0) > 0 ||
    (evidenceRefs.benchmarks?.length || 0) > 0
  );

  return `
    <div class="finding-card ${className}" style="
      border-left: 4px solid ${config.borderColor};
      background: ${config.bgColor};
      border-radius: 0 8px 8px 0;
      padding: 1rem;
      margin-bottom: 0.75rem;
      page-break-inside: avoid;
    ">
      <!-- Header -->
      <div style="display: flex; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.5rem;">
        <span style="
          font-size: 1.25rem;
          color: ${config.borderColor};
          line-height: 1;
        ">${config.icon}</span>

        <div style="flex: 1;">
          <div style="
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.25rem;
          ">
            <span style="
              font-size: 0.7rem;
              font-weight: 600;
              color: ${config.labelColor};
              text-transform: uppercase;
              letter-spacing: 0.5px;
            ">${config.label}</span>
            ${showDimension && dimensionName ? `
              <span style="
                font-size: 0.7rem;
                color: #6b7280;
                padding-left: 0.5rem;
                border-left: 1px solid #d1d5db;
              ">${safeHtml(dimensionName)}</span>
            ` : ''}
          </div>
          <h4 style="
            font-family: 'Montserrat', sans-serif;
            font-size: 0.9375rem;
            font-weight: 600;
            color: #212653;
            margin: 0;
            line-height: 1.4;
          ">${safeHtml(shortLabel)}</h4>
        </div>
      </div>

      <!-- Narrative -->
      <p style="
        margin: 0;
        font-size: 0.875rem;
        color: #374151;
        line-height: 1.6;
      ">${safeHtml(narrative)}</p>

      <!-- Evidence (if shown) -->
      ${hasEvidence ? `
        <div style="
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px dashed ${config.borderColor}40;
          font-size: 0.75rem;
          color: #6b7280;
        ">
          <span style="font-weight: 600;">Supporting Evidence:</span>
          ${evidenceRefs.metrics?.length ? `<span style="margin-left: 0.5rem;">${safeArray(evidenceRefs.metrics).join(', ')}</span>` : ''}
          ${evidenceRefs.benchmarks?.length ? `<span style="margin-left: 0.5rem;">Benchmarks: ${safeArray(evidenceRefs.benchmarks).join(', ')}</span>` : ''}
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Render findings grouped by type
 */
export function renderFindingsGrouped(
  findings: ReportFinding[],
  options: FindingCardOptions & {
    maxStrengths?: number;
    maxGaps?: number;
    maxRisks?: number;
    maxOpportunities?: number;
  } = {}
): string {
  const {
    maxStrengths = 3,
    maxGaps = 3,
    maxRisks = 3,
    maxOpportunities = 3,
    ...cardOptions
  } = options;

  const items = safeArray(findings);

  if (items.length === 0) {
    return `
      <div style="
        padding: 2rem;
        background: #f9fafb;
        border: 1px dashed #d1d5db;
        border-radius: 8px;
        text-align: center;
        color: #6b7280;
      ">
        <p style="margin: 0;">No findings available for this dimension.</p>
      </div>
    `;
  }

  const strengths = items.filter(f => f.type === 'strength').slice(0, maxStrengths);
  const gaps = items.filter(f => f.type === 'gap').slice(0, maxGaps);
  const risks = items.filter(f => f.type === 'risk').slice(0, maxRisks);
  const opportunities = items.filter(f => f.type === 'opportunity').slice(0, maxOpportunities);

  let html = '';

  // Strengths
  if (strengths.length > 0) {
    html += `
      <div class="findings-section strengths-section" style="margin-bottom: 1.5rem;">
        <h5 style="
          font-family: 'Montserrat', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          color: #059669;
          margin: 0 0 0.75rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        ">
          <span style="font-size: 1rem;">✓</span>
          Key Strengths
        </h5>
        ${strengths.map(f => renderFindingCard(f, cardOptions)).join('')}
      </div>
    `;
  }

  // Gaps
  if (gaps.length > 0) {
    html += `
      <div class="findings-section gaps-section" style="margin-bottom: 1.5rem;">
        <h5 style="
          font-family: 'Montserrat', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          color: #d97706;
          margin: 0 0 0.75rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        ">
          <span style="font-size: 1rem;">⚠</span>
          Areas for Improvement
        </h5>
        ${gaps.map(f => renderFindingCard(f, cardOptions)).join('')}
      </div>
    `;
  }

  // Risks
  if (risks.length > 0) {
    html += `
      <div class="findings-section risks-section" style="margin-bottom: 1.5rem;">
        <h5 style="
          font-family: 'Montserrat', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          color: #dc2626;
          margin: 0 0 0.75rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        ">
          <span style="font-size: 1rem;">⚡</span>
          Key Risks
        </h5>
        ${risks.map(f => renderFindingCard(f, cardOptions)).join('')}
      </div>
    `;
  }

  // Opportunities
  if (opportunities.length > 0) {
    html += `
      <div class="findings-section opportunities-section" style="margin-bottom: 1.5rem;">
        <h5 style="
          font-family: 'Montserrat', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          color: #2563eb;
          margin: 0 0 0.75rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        ">
          <span style="font-size: 1rem;">↗</span>
          Opportunities
        </h5>
        ${opportunities.map(f => renderFindingCard(f, cardOptions)).join('')}
      </div>
    `;
  }

  if (html === '') {
    return `
      <div style="
        padding: 2rem;
        background: #f9fafb;
        border: 1px dashed #d1d5db;
        border-radius: 8px;
        text-align: center;
        color: #6b7280;
      ">
        <p style="margin: 0;">Detailed findings pending analysis.</p>
      </div>
    `;
  }

  return html;
}

/**
 * Render findings as a simple list (for compact display)
 */
export function renderFindingsList(
  findings: ReportFinding[],
  options: { maxItems?: number; showType?: boolean } = {}
): string {
  const { maxItems = 5, showType = true } = options;
  const items = safeArray(findings).slice(0, maxItems);

  if (items.length === 0) {
    return `<p style="color: #6b7280; font-style: italic;">No findings available.</p>`;
  }

  return `
    <ul style="
      list-style: none;
      margin: 0;
      padding: 0;
    ">
      ${items.map(finding => {
        const type = getFindingType(finding);
        const config = getTypeConfig(type);
        const shortLabel = safeStringValue(finding.shortLabel, 'Finding');

        return `
          <li style="
            display: flex;
            align-items: flex-start;
            gap: 0.5rem;
            padding: 0.5rem 0;
            border-bottom: 1px solid #f3f4f6;
          ">
            <span style="color: ${config.borderColor}; font-size: 1rem; line-height: 1.4;">${config.icon}</span>
            <div>
              ${showType ? `<span style="font-size: 0.7rem; color: ${config.labelColor}; font-weight: 600; text-transform: uppercase;">${config.label}: </span>` : ''}
              <span style="font-size: 0.875rem; color: #374151;">${safeHtml(shortLabel)}</span>
            </div>
          </li>
        `;
      }).join('')}
    </ul>
  `;
}

/**
 * Render a compact finding row
 */
export function renderFindingRow(finding: ReportFinding): string {
  const type = getFindingType(finding);
  const config = getTypeConfig(type);
  const shortLabel = safeStringValue(finding.shortLabel, 'Finding');
  const dimensionName = safeStringValue(finding.dimensionName, '');

  return `
    <div style="
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 0.875rem;
      background: ${config.bgColor};
      border-left: 3px solid ${config.borderColor};
      border-radius: 0 6px 6px 0;
      margin-bottom: 0.5rem;
    ">
      <span style="font-size: 1rem; color: ${config.borderColor};">${config.icon}</span>
      <div style="flex: 1;">
        <div style="font-weight: 600; font-size: 0.875rem; color: #212653;">${safeHtml(shortLabel)}</div>
        ${dimensionName ? `<div style="font-size: 0.75rem; color: #6b7280; margin-top: 0.125rem;">${safeHtml(dimensionName)}</div>` : ''}
      </div>
      <span style="
        font-size: 0.7rem;
        font-weight: 600;
        color: ${config.labelColor};
        text-transform: uppercase;
      ">${config.label}</span>
    </div>
  `;
}

/**
 * Count findings by type
 */
export function countFindingsByType(findings: ReportFinding[]): {
  strengths: number;
  gaps: number;
  risks: number;
  opportunities: number;
  total: number;
} {
  const items = safeArray(findings);
  return {
    strengths: items.filter(f => f.type === 'strength').length,
    gaps: items.filter(f => f.type === 'gap').length,
    risks: items.filter(f => f.type === 'risk').length,
    opportunities: items.filter(f => f.type === 'opportunity').length,
    total: items.length
  };
}

/**
 * Render findings summary badges
 */
export function renderFindingsSummaryBadges(findings: ReportFinding[]): string {
  const counts = countFindingsByType(findings);

  return `
    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
      ${counts.strengths > 0 ? `
        <span style="
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          background: #f0fdf4;
          color: #059669;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
        ">✓ ${counts.strengths} Strength${counts.strengths !== 1 ? 's' : ''}</span>
      ` : ''}
      ${counts.gaps > 0 ? `
        <span style="
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          background: #fffbeb;
          color: #d97706;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
        ">⚠ ${counts.gaps} Gap${counts.gaps !== 1 ? 's' : ''}</span>
      ` : ''}
      ${counts.risks > 0 ? `
        <span style="
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          background: #fef2f2;
          color: #dc2626;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
        ">⚡ ${counts.risks} Risk${counts.risks !== 1 ? 's' : ''}</span>
      ` : ''}
      ${counts.opportunities > 0 ? `
        <span style="
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          background: #eff6ff;
          color: #2563eb;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
        ">↗ ${counts.opportunities} Opportunit${counts.opportunities !== 1 ? 'ies' : 'y'}</span>
      ` : ''}
    </div>
  `;
}
