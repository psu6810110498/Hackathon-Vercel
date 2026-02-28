/**
 * HSK vocabulary helpers
 * Data source: data/hsk-vocabulary.json (expand from https://github.com/clem109/hsk-vocabulary)
 */

import path from "path";
import fs from "fs";

export interface HSKWordEntry {
  word: string;
  level: number;
  pinyin?: string;
  /** English/Thai meanings from hsk-vocabulary repo */
  translations?: string[];
  [key: string]: unknown;
}

let vocabularyCache: HSKWordEntry[] | null = null;

/**
 * Load vocabulary (cached). Uses data/hsk-vocabulary.json.
 */
function getVocabulary(): HSKWordEntry[] {
  if (vocabularyCache) return vocabularyCache;
  try {
    const filePath = path.join(process.cwd(), "data", "hsk-vocabulary.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw) as unknown;
    vocabularyCache = Array.isArray(data) ? (data as HSKWordEntry[]) : [];
  } catch {
    vocabularyCache = [];
  }
  return vocabularyCache;
}

/**
 * Get all words for a given HSK level (4, 5, or 6)
 */
export function getWordsByLevel(level: number): HSKWordEntry[] {
  const list = getVocabulary();
  return list.filter((w) => w.level === level);
}

/**
 * Check if a word is in the HSK list at or below the given level
 */
export function checkIfHSKWord(word: string, level: number): boolean {
  const list = getVocabulary();
  const entry = list.find(
    (w) => w.word === word && w.level >= 4 && w.level <= level
  );
  return !!entry;
}

/**
 * Get "frequency" as count of occurrences in our list (same word might appear in multiple levels).
 * For a single-level list, returns 1 if found else 0.
 */
export function getWordFrequency(word: string): number {
  const list = getVocabulary();
  return list.filter((w) => w.word === word).length;
}
