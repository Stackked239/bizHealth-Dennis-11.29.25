/**
 * BizHealth IDM Tests
 *
 * Tests for IDM schema validation, data extraction, and transformation.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import {
  IDMSchema,
  MetaSchema,
  ChapterSchema,
  DimensionSchema,
  SubIndicatorSchema,
  FindingSchema,
  RecommendationSchema,
  RiskSchema,
  RoadmapSchema,
  ScoresSummarySchema,
  validateIDM,
  safeValidateIDM,
  getScoreBand,
  getChapterForDimension,
  getDimensionsForChapter,
  calculateChapterScore,
  calculateOverallHealthScore,
  getHealthDescriptor,
  determineTrajectory,
  CHAPTER_NAMES,
  DIMENSION_METADATA,
  SUB_INDICATOR_DEFINITIONS,
  QUESTION_MAPPINGS,
  ChapterCode,
  DimensionCode,
  DimensionCodeSchema,
  ChapterCodeSchema
} from '../src/types/idm.types';

// ============================================================================
// SCHEMA VALIDATION TESTS
// ============================================================================

describe('IDM Schema Validation', () => {
  describe('MetaSchema', () => {
    it('should validate valid meta data', () => {
      const validMeta = {
        assessment_run_id: '123e4567-e89b-12d3-a456-426614174000',
        company_profile_id: '123e4567-e89b-12d3-a456-426614174001',
        created_at: '2025-01-15T10:30:00.000Z',
        methodology_version: '1.0.0',
        scoring_version: '1.0.0',
        idm_schema_version: '1.0.0'
      };

      const result = MetaSchema.safeParse(validMeta);
      expect(result.success).toBe(true);
    });

    it('should reject invalid UUID', () => {
      const invalidMeta = {
        assessment_run_id: 'not-a-uuid',
        company_profile_id: '123e4567-e89b-12d3-a456-426614174001',
        created_at: '2025-01-15T10:30:00.000Z'
      };

      const result = MetaSchema.safeParse(invalidMeta);
      expect(result.success).toBe(false);
    });
  });

  describe('ChapterSchema', () => {
    it('should validate valid chapter', () => {
      const validChapter = {
        chapter_code: 'GE',
        name: 'Growth Engine',
        score_overall: 75,
        score_band: 'Proficiency'
      };

      const result = ChapterSchema.safeParse(validChapter);
      expect(result.success).toBe(true);
    });

    it('should reject invalid chapter code', () => {
      const invalidChapter = {
        chapter_code: 'INVALID',
        name: 'Test',
        score_overall: 75,
        score_band: 'Proficiency'
      };

      const result = ChapterSchema.safeParse(invalidChapter);
      expect(result.success).toBe(false);
    });

    it('should reject score outside 0-100 range', () => {
      const invalidChapter = {
        chapter_code: 'GE',
        name: 'Test',
        score_overall: 150,
        score_band: 'Excellence'
      };

      const result = ChapterSchema.safeParse(invalidChapter);
      expect(result.success).toBe(false);
    });
  });

  describe('DimensionSchema', () => {
    it('should validate valid dimension with sub-indicators', () => {
      const validDimension = {
        dimension_code: 'STR',
        chapter_code: 'GE',
        name: 'Strategy',
        description: 'Strategic planning and positioning',
        score_overall: 68,
        score_band: 'Proficiency',
        sub_indicators: [
          {
            id: 'STR_001',
            dimension_code: 'STR',
            name: 'Competitive Differentiation',
            score: 70,
            score_band: 'Proficiency',
            contributing_question_ids: ['strategy_q1']
          }
        ]
      };

      const result = DimensionSchema.safeParse(validDimension);
      expect(result.success).toBe(true);
    });
  });

  describe('FindingSchema', () => {
    it('should validate valid finding', () => {
      const validFinding = {
        id: 'finding-gap-MKT',
        dimension_code: 'MKT',
        type: 'gap',
        severity: 'High',
        confidence_level: 'High',
        short_label: 'Marketing Gap',
        narrative: 'Marketing performance is below expectations.',
        evidence_refs: {
          question_ids: ['marketing_q1', 'marketing_q2'],
          metrics: ['MKT_score']
        }
      };

      const result = FindingSchema.safeParse(validFinding);
      expect(result.success).toBe(true);
    });

    it('should accept numeric severity', () => {
      const findingWithNumericSeverity = {
        id: 'finding-risk-FIN',
        dimension_code: 'FIN',
        type: 'risk',
        severity: 85,
        confidence_level: 90,
        short_label: 'Financial Risk',
        narrative: 'Significant financial risk identified.'
      };

      const result = FindingSchema.safeParse(findingWithNumericSeverity);
      expect(result.success).toBe(true);
    });
  });

  describe('RecommendationSchema', () => {
    it('should validate valid recommendation', () => {
      const validRecommendation = {
        id: 'rec-MKT-1',
        dimension_code: 'MKT',
        linked_finding_ids: ['finding-gap-MKT'],
        theme: 'Marketing Improvement Initiative',
        priority_rank: 1,
        impact_score: 75,
        effort_score: 45,
        horizon: '90_days',
        required_capabilities: ['Marketing', 'Change Management'],
        action_steps: ['Step 1', 'Step 2', 'Step 3'],
        expected_outcomes: 'Improve marketing score by 20 points.'
      };

      const result = RecommendationSchema.safeParse(validRecommendation);
      expect(result.success).toBe(true);
    });
  });
});

// ============================================================================
// HELPER FUNCTION TESTS
// ============================================================================

describe('IDM Helper Functions', () => {
  describe('getScoreBand', () => {
    it('should return Excellence for scores >= 80', () => {
      expect(getScoreBand(80)).toBe('Excellence');
      expect(getScoreBand(95)).toBe('Excellence');
      expect(getScoreBand(100)).toBe('Excellence');
    });

    it('should return Proficiency for scores 60-79', () => {
      expect(getScoreBand(60)).toBe('Proficiency');
      expect(getScoreBand(70)).toBe('Proficiency');
      expect(getScoreBand(79)).toBe('Proficiency');
    });

    it('should return Attention for scores 40-59', () => {
      expect(getScoreBand(40)).toBe('Attention');
      expect(getScoreBand(50)).toBe('Attention');
      expect(getScoreBand(59)).toBe('Attention');
    });

    it('should return Critical for scores < 40', () => {
      expect(getScoreBand(0)).toBe('Critical');
      expect(getScoreBand(20)).toBe('Critical');
      expect(getScoreBand(39)).toBe('Critical');
    });
  });

  describe('getChapterForDimension', () => {
    it('should return correct chapter for Growth Engine dimensions', () => {
      expect(getChapterForDimension('STR')).toBe('GE');
      expect(getChapterForDimension('SAL')).toBe('GE');
      expect(getChapterForDimension('MKT')).toBe('GE');
      expect(getChapterForDimension('CXP')).toBe('GE');
    });

    it('should return correct chapter for Performance Health dimensions', () => {
      expect(getChapterForDimension('OPS')).toBe('PH');
      expect(getChapterForDimension('FIN')).toBe('PH');
    });

    it('should return correct chapter for People & Leadership dimensions', () => {
      expect(getChapterForDimension('HRS')).toBe('PL');
      expect(getChapterForDimension('LDG')).toBe('PL');
    });

    it('should return correct chapter for Resilience & Safeguards dimensions', () => {
      expect(getChapterForDimension('TIN')).toBe('RS');
      expect(getChapterForDimension('IDS')).toBe('RS');
      expect(getChapterForDimension('RMS')).toBe('RS');
      expect(getChapterForDimension('CMP')).toBe('RS');
    });
  });

  describe('getDimensionsForChapter', () => {
    it('should return 4 dimensions for GE chapter', () => {
      const dims = getDimensionsForChapter('GE');
      expect(dims).toHaveLength(4);
      expect(dims).toContain('STR');
      expect(dims).toContain('SAL');
      expect(dims).toContain('MKT');
      expect(dims).toContain('CXP');
    });

    it('should return 2 dimensions for PH chapter', () => {
      const dims = getDimensionsForChapter('PH');
      expect(dims).toHaveLength(2);
      expect(dims).toContain('OPS');
      expect(dims).toContain('FIN');
    });
  });

  describe('getHealthDescriptor', () => {
    it('should return correct descriptors', () => {
      expect(getHealthDescriptor(90)).toBe('Excellent Health');
      expect(getHealthDescriptor(80)).toBe('Good Health');
      expect(getHealthDescriptor(70)).toBe('Fair Health');
      expect(getHealthDescriptor(55)).toBe('Needs Improvement');
      expect(getHealthDescriptor(30)).toBe('Critical Condition');
    });
  });

  describe('determineTrajectory', () => {
    it('should return Improving when score increased significantly', () => {
      expect(determineTrajectory(75, 65)).toBe('Improving');
    });

    it('should return Declining when score decreased significantly', () => {
      expect(determineTrajectory(60, 72)).toBe('Declining');
    });

    it('should return Flat when change is small', () => {
      expect(determineTrajectory(70, 68)).toBe('Flat');
    });

    it('should return Flat when no previous score', () => {
      expect(determineTrajectory(70)).toBe('Flat');
    });
  });
});

// ============================================================================
// CONSTANTS TESTS
// ============================================================================

describe('IDM Constants', () => {
  describe('CHAPTER_NAMES', () => {
    it('should have 4 chapters', () => {
      expect(Object.keys(CHAPTER_NAMES)).toHaveLength(4);
    });

    it('should have correct chapter names', () => {
      expect(CHAPTER_NAMES.GE).toBe('Growth Engine');
      expect(CHAPTER_NAMES.PH).toBe('Performance & Health');
      expect(CHAPTER_NAMES.PL).toBe('People & Leadership');
      expect(CHAPTER_NAMES.RS).toBe('Resilience & Safeguards');
    });
  });

  describe('DIMENSION_METADATA', () => {
    it('should have 12 dimensions', () => {
      expect(Object.keys(DIMENSION_METADATA)).toHaveLength(12);
    });

    it('should have correct metadata structure', () => {
      const strMeta = DIMENSION_METADATA.STR;
      expect(strMeta.name).toBe('Strategy');
      expect(strMeta.chapter).toBe('GE');
      expect(strMeta.description).toBeDefined();
    });
  });

  describe('SUB_INDICATOR_DEFINITIONS', () => {
    it('should have sub-indicators for all 12 dimensions', () => {
      expect(Object.keys(SUB_INDICATOR_DEFINITIONS)).toHaveLength(12);
    });

    it('should have 3-5 sub-indicators per dimension', () => {
      for (const [code, indicators] of Object.entries(SUB_INDICATOR_DEFINITIONS)) {
        expect(indicators.length).toBeGreaterThanOrEqual(3);
        expect(indicators.length).toBeLessThanOrEqual(5);
      }
    });
  });

  describe('QUESTION_MAPPINGS', () => {
    it('should have mappings for all question categories', () => {
      expect(QUESTION_MAPPINGS.length).toBeGreaterThan(80);
    });

    it('should have valid dimension codes', () => {
      const validCodes = DimensionCodeSchema.options;
      for (const mapping of QUESTION_MAPPINGS) {
        expect(validCodes).toContain(mapping.dimension_code);
      }
    });
  });
});

// ============================================================================
// FULL IDM VALIDATION TESTS
// ============================================================================

describe('Full IDM Validation', () => {
  const validIDM = {
    meta: {
      assessment_run_id: '123e4567-e89b-12d3-a456-426614174000',
      company_profile_id: '123e4567-e89b-12d3-a456-426614174001',
      created_at: '2025-01-15T10:30:00.000Z',
      methodology_version: '1.0.0',
      scoring_version: '1.0.0',
      idm_schema_version: '1.0.0'
    },
    chapters: [
      { chapter_code: 'GE', name: 'Growth Engine', score_overall: 70, score_band: 'Proficiency' },
      { chapter_code: 'PH', name: 'Performance & Health', score_overall: 75, score_band: 'Proficiency' },
      { chapter_code: 'PL', name: 'People & Leadership', score_overall: 55, score_band: 'Attention' },
      { chapter_code: 'RS', name: 'Resilience & Safeguards', score_overall: 80, score_band: 'Excellence' }
    ],
    dimensions: [
      {
        dimension_code: 'STR',
        chapter_code: 'GE',
        name: 'Strategy',
        description: 'Strategic planning',
        score_overall: 68,
        score_band: 'Proficiency',
        sub_indicators: []
      }
    ],
    questions: [],
    findings: [
      {
        id: 'finding-1',
        dimension_code: 'STR',
        type: 'strength',
        severity: 'Low',
        confidence_level: 'High',
        short_label: 'Test Finding',
        narrative: 'Test narrative'
      }
    ],
    recommendations: [
      {
        id: 'rec-1',
        dimension_code: 'STR',
        linked_finding_ids: ['finding-1'],
        theme: 'Test Theme',
        priority_rank: 1,
        impact_score: 70,
        effort_score: 50,
        horizon: '90_days',
        action_steps: ['Step 1'],
        expected_outcomes: 'Test outcomes'
      }
    ],
    quick_wins: [
      { recommendation_id: 'rec-1' }
    ],
    risks: [],
    roadmap: {
      phases: [
        {
          id: 'phase-1',
          name: 'Phase 1',
          time_horizon: '0-90 days',
          linked_recommendation_ids: ['rec-1'],
          narrative: 'Test phase'
        }
      ]
    },
    scores_summary: {
      overall_health_score: 70,
      descriptor: 'Fair Health',
      trajectory: 'Flat',
      key_imperatives: ['Improve Strategy']
    }
  };

  it('should validate a complete valid IDM', () => {
    const result = safeValidateIDM(validIDM);
    expect(result.success).toBe(true);
  });

  it('should reject IDM with missing required fields', () => {
    const invalidIDM = { ...validIDM };
    delete (invalidIDM as any).meta;

    const result = safeValidateIDM(invalidIDM);
    expect(result.success).toBe(false);
  });

  it('validateIDM should throw on invalid data', () => {
    expect(() => validateIDM({})).toThrow();
  });

  it('validateIDM should return parsed data on valid input', () => {
    const parsed = validateIDM(validIDM);
    expect(parsed.meta.assessment_run_id).toBe(validIDM.meta.assessment_run_id);
  });
});
