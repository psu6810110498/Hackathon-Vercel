import hskVocabRaw from "./hsk_vocab_2025.json";

const hskVocab = hskVocabRaw as Record<string, number>;

/**
 * Get HSK level for a specific word based on 2025 standard
 * @returns 1-6 for basic/intermediate, 7 for advanced (7-9), or null if not in list
 */
export function getWordLevel(word: string): number | null {
  return hskVocab[word] || null;
}

/**
 * Analyze a list of Chinese words and categorize them by HSK 2021/2025 level
 */
export function calculateVocabProfile(words: string[]) {
  const profile = {
    level1: 0,
    level2: 0,
    level3: 0,
    level4: 0,
    level5: 0,
    level6: 0,
    advanced: 0, // 7-9
    unknown: 0
  };

  words.forEach(word => {
    const level = getWordLevel(word);
    if (level === 1) profile.level1++;
    else if (level === 2) profile.level2++;
    else if (level === 3) profile.level3++;
    else if (level === 4) profile.level4++;
    else if (level === 5) profile.level5++;
    else if (level === 6) profile.level6++;
    else if (level === 7) profile.advanced++;
    else profile.unknown++;
  });

  return profile;
}

/**
 * Check if the vocabulary is appropriate for a target HSK level
 * Returns words that are significantly above the target level
 */
export function findOverLimitWords(words: string[], targetLevel: number) {
  return words.filter(word => {
    const level = getWordLevel(word);
    return level !== null && level > targetLevel;
  });
}
