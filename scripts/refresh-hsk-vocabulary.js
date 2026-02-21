#!/usr/bin/env node
/**
 * Merge HSK 4–6 vocabulary from cloned repo into data/hsk-vocabulary.json
 * Run once after: git clone https://github.com/clem109/hsk-vocabulary.git /tmp/hsk-vocabulary
 * Or set HSK_VOCAB_REPO_PATH to your local clone path.
 */

const fs = require("fs");
const path = require("path");

const repoPath = process.env.HSK_VOCAB_REPO_PATH || "/tmp/hsk-vocabulary";
const vocabDir = path.join(repoPath, "hsk-vocab-json");
const outPath = path.join(process.cwd(), "data", "hsk-vocabulary.json");

const out = [];
for (const level of [4, 5, 6]) {
  const file = path.join(vocabDir, `hsk-level-${level}.json`);
  if (!fs.existsSync(file)) {
    console.warn("Skip (not found):", file);
    continue;
  }
  const arr = JSON.parse(fs.readFileSync(file, "utf8"));
  for (const e of arr) {
    out.push({
      word: e.hanzi,
      level,
      pinyin: e.pinyin || "",
      translations: e.translations || [],
    });
  }
  console.log("Level", level, ":", arr.length, "words");
}

fs.writeFileSync(outPath, JSON.stringify(out));
console.log("Written", out.length, "words to", outPath);
