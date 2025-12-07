/**
 * Data Sanitizer for Report Generation
 * Prevents "undefined" from appearing in rendered HTML
 *
 * This utility ensures all data passed to template generation is properly
 * sanitized with sensible defaults, preventing rendering issues.
 */

// ============================================================================
// DIMENSION NAME MAPPING
// ============================================================================

/**
 * Standard dimension code to name mapping
 */
const DIMENSION_NAMES: Record<string, string> = {
  // Growth Engine Chapter
  STR: 'Strategy',
  SAL: 'Sales',
  MKT: 'Marketing',

  // Performance & Operational Health Chapter
  CX: 'Customer Experience',
  OPS: 'Operations',
  FIN: 'Financials',

  // People & Leadership Chapter
  HR: 'Human Resources',
  LG: 'Leadership & Governance',
  TI: 'Technology & Innovation',

  // Resilience & Safeguards Chapter
  IT: 'IT, Data & Systems',
  RM: 'Risk Management',
  CO: 'Compliance',
};

/**
 * Resolve dimension name from code
 * @param code - Dimension code (e.g., 'STR', 'SAL')
 * @returns Full dimension name or 'General' if not found
 */
export function resolveDimensionName(code: string | undefined | null): string {
  if (!code) return 'General';
  const upperCode = code.toUpperCase().trim();
  return DIMENSION_NAMES[upperCode] || code;
}

/**
 * Get dimension code from name (reverse lookup)
 * @param name - Dimension name
 * @returns Dimension code or undefined
 */
export function getDimensionCode(name: string): string | undefined {
  const entry = Object.entries(DIMENSION_NAMES).find(
    ([_, dimName]) => dimName.toLowerCase() === name.toLowerCase()
  );
  return entry?.[0];
}

// ============================================================================
// SCORE BAND UTILITIES
// ============================================================================

/**
 * Score band thresholds
 */
export const SCORE_BANDS = {
  EXCELLENCE: { min: 80, label: 'Excellence', color: '#28a745' },
  PROFICIENCY: { min: 60, label: 'Proficiency', color: '#0d6efd' },
  ATTENTION: { min: 40, label: 'Attention', color: '#ffc107' },
  CRITICAL: { min: 0, label: 'Critical', color: '#dc3545' },
} as const;

/**
 * Get score band label from numeric score
 */
export function getScoreBand(score: number): string {
  if (score >= 80) return 'Excellence';
  if (score >= 60) return 'Proficiency';
  if (score >= 40) return 'Attention';
  return 'Critical';
}

/**
 * Get score band color from numeric score
 */
export function getBandColor(band: string): string {
  const colors: Record<string, string> = {
    'Excellence': '#28a745',
    'Proficiency': '#0d6efd',
    'Attention': '#ffc107',
    'Critical': '#dc3545',
  };
  return colors[band] || '#212653';
}

// ============================================================================
// TEMPLATE SANITIZATION
// ============================================================================

/**
 * Deep sanitize an object for safe template rendering
 * Replaces undefined/null values with sensible defaults
 *
 * @param obj - Object to sanitize
 * @returns Sanitized copy of the object
 */
export function sanitizeForTemplate<T extends object>(obj: T): T {
  if (obj === null || obj === undefined) {
    return {} as T;
  }

  // Deep clone to avoid mutating original
  const sanitized = JSON.parse(JSON.stringify(obj));

  function walk(node: unknown): unknown {
    if (node === null || node === undefined) {
      return '';
    }

    if (Array.isArray(node)) {
      return node.map(item => walk(item));
    }

    if (typeof node === 'object' && node !== null) {
      const result: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(node)) {
        // Handle undefined/null values based on key type
        if (value === undefined || value === null) {
          if (key.toLowerCase().includes('score')) {
            result[key] = 0;
          } else if (key.toLowerCase().includes('count') || key.toLowerCase().includes('number')) {
            result[key] = 0;
          } else if (key.toLowerCase().includes('name') || key.toLowerCase().includes('title')) {
            result[key] = '—';
          } else if (key.toLowerCase().includes('date')) {
            result[key] = new Date().toISOString();
          } else if (key === 'dimension' || key === 'dimensionCode') {
            result[key] = value;
            result['dimensionName'] = resolveDimensionName(value as string);
          } else if (Array.isArray(value)) {
            result[key] = [];
          } else {
            result[key] = '—';
          }
        } else if (typeof value === 'object') {
          result[key] = walk(value);
        } else {
          result[key] = value;
        }

        // Auto-populate dimensionName if dimension code exists
        if ((key === 'dimension' || key === 'dimensionCode') && typeof value === 'string') {
          result['dimensionName'] = resolveDimensionName(value);
        }
      }

      return result;
    }

    return node;
  }

  return walk(sanitized) as T;
}

/**
 * Sanitize a single value for template rendering
 * @param value - Value to sanitize
 * @param defaultValue - Default value if undefined/null
 */
export function sanitizeValue<T>(value: T | undefined | null, defaultValue: T): T {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  return value;
}

/**
 * Sanitize a numeric score value
 * Ensures value is between 0 and 100
 */
export function sanitizeScore(score: number | undefined | null): number {
  if (score === undefined || score === null || isNaN(score)) {
    return 0;
  }
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Sanitize text for HTML rendering
 * Removes dangerous characters and ensures safe output
 */
export function sanitizeText(text: string | undefined | null): string {
  if (!text) return '';

  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Format a date value safely
 */
export function sanitizeDate(date: Date | string | undefined | null): string {
  if (!date) {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// ============================================================================
// ARRAY UTILITIES
// ============================================================================

/**
 * Safely get array items, returning empty array if undefined
 */
export function safeArray<T>(arr: T[] | undefined | null): T[] {
  return arr || [];
}

/**
 * Safely get first N items from array
 */
export function safeSlice<T>(arr: T[] | undefined | null, count: number): T[] {
  return (arr || []).slice(0, count);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  resolveDimensionName,
  getDimensionCode,
  getScoreBand,
  getBandColor,
  sanitizeForTemplate,
  sanitizeValue,
  sanitizeScore,
  sanitizeText,
  sanitizeDate,
  safeArray,
  safeSlice,
  DIMENSION_NAMES,
  SCORE_BANDS,
};
