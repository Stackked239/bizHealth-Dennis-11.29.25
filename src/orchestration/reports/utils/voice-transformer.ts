/**
 * Transform third-person analytical voice to owner-focused voice
 * Used for adapting Comprehensive Report content to Owner's Report
 */

export function transformToOwnerVoice(text: string): string {
  if (!text) return '';

  const transformations: [RegExp, string][] = [
    // Company references -> You/Your
    [/\bThe company\b/gi, 'Your business'],
    [/\bThe organization\b/gi, 'Your organization'],
    [/\bThe business\b/gi, 'Your business'],
    [/\bThe firm\b/gi, 'Your firm'],

    // Third person -> Second person
    [/\bIt should\b/gi, 'You should'],
    [/\bIt is recommended\b/gi, 'We recommend you'],
    [/\bIt would be beneficial\b/gi, 'You would benefit from'],
    [/\bRecommendations include\b/gi, 'We recommend'],
    [/\bThis indicates\b/gi, 'This means you'],
    [/\bThis suggests\b/gi, 'This means you should'],

    // Passive -> Active owner-focused
    [/\bshould be prioritized\b/gi, 'should be your priority'],
    [/\bneeds to be addressed\b/gi, 'you need to address'],
    [/\brequires attention\b/gi, 'needs your attention'],
    [/\bshould be implemented\b/gi, 'you should implement'],
    [/\bmust be considered\b/gi, 'you must consider'],

    // Analysis language -> Advisory language
    [/\bAnalysis indicates that\b/gi, 'This means'],
    [/\bFindings suggest\b/gi, 'You should know that'],
    [/\bData shows\b/gi, 'Your data shows'],
    [/\bResults indicate\b/gi, 'Your results show'],
    [/\bAssessment reveals\b/gi, 'Your assessment shows'],

    // Organizational references
    [/\bThe leadership team\b/gi, 'Your leadership team'],
    [/\bThe management\b/gi, 'Your management'],
    [/\bThe staff\b/gi, 'Your staff'],
    [/\bThe employees\b/gi, 'Your employees'],
    [/\bThe workforce\b/gi, 'Your workforce']
  ];

  let result = text;
  for (const [pattern, replacement] of transformations) {
    result = result.replace(pattern, replacement);
  }

  return result;
}

/**
 * Truncate text to a maximum number of sentences
 */
export function truncateToSentences(text: string, maxSentences: number): string {
  if (!text) return '';

  // Split by sentence-ending punctuation
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

  if (sentences.length <= maxSentences) {
    return text;
  }

  return sentences.slice(0, maxSentences).join(' ').trim();
}

/**
 * Truncate text to a maximum number of words
 */
export function truncateToWords(text: string, maxWords: number): string {
  if (!text) return '';

  const words = text.split(/\s+/);

  if (words.length <= maxWords) {
    return text;
  }

  return words.slice(0, maxWords).join(' ') + '...';
}

/**
 * Ensure text starts with a capital letter
 */
export function capitalizeFirst(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Remove excessive whitespace and normalize line breaks
 */
export function normalizeWhitespace(text: string): string {
  if (!text) return '';
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
}
