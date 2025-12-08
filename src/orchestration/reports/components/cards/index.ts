/**
 * BizHealth.ai Card Components Index
 *
 * Exports card-based visual components for report generation.
 * These components provide structured, scannable formats for
 * recommendations and action items.
 *
 * Components:
 * - Action Plan Cards: Full-featured recommendation cards
 * - Quick Win Cards: Simplified cards for quick wins
 */

// ============================================================================
// ACTION PLAN CARDS
// ============================================================================

export {
  generateActionPlanCard,
  generateActionPlanCardGrid,
  generateActionPlanCardList,
  generateActionPlanSummary,
} from './action-plan-card.component.js';

export type {
  ActionPlanCard,
  ActionPlanCardOptions,
  ActionPlanGridOptions,
  CardPriority,
  CardCategory,
  CardHorizon,
  CurrencyRange,
  ActionStep,
} from './action-plan-card.component.js';

// ============================================================================
// QUICK WIN CARDS
// ============================================================================

export {
  generateQuickWinCard,
  generateQuickWinsGrid,
  generateQuickWinsList,
  generateQuickWinRow,
  generateQuickWinsSummary,
  generateQuickWinBadge,
  generateTransformationArrow,
} from './quick-win-card.component.js';

export type {
  QuickWinCard,
  QuickWinCardOptions,
  QuickWinsGridOptions,
} from './quick-win-card.component.js';
