import {syntaxMeta} from './aliases';
import type {Topic} from './schema';

export const popularSearches = [
  'repeat code',
  'add item to list',
  'remove spaces',
  'convert string to number',
  'check condition',
  'find unique items',
  'read json file',
] as const;

export function searchSyntaxTopics(
  topics: Topic[],
  query: string,
  categoryFilter = '',
  difficultyFilter = ''
): Topic[] {
  const clean = query.trim().toLowerCase();

  // Base filter by category and difficulty
  const baseList = topics.filter(t => {
    if (categoryFilter && t.category !== categoryFilter) return false;
    if (difficultyFilter && t.difficulty !== difficultyFilter) return false;
    return true;
  });

  if (!clean) return baseList;

  const tokens = clean.split(/\s+/).filter(Boolean);

  const scored = baseList
    .map(topic => {
      let score = 0;
      const meta = syntaxMeta[topic.id];
      const aliases = meta ? meta.aliases.map(a => a.toLowerCase()) : [];
      const titleLower = topic.title.toLowerCase();
      const idLower = topic.id.toLowerCase();
      const formatLower = topic.format.toLowerCase();
      const defLower = topic.definition.toLowerCase();
      const useLower = topic.use.toLowerCase();
      const symbolsText = topic.symbols.flat().join(' ').toLowerCase();

      // 1. Exact alias match (e.g. user typed "repeat code" -> matches loops)
      if (aliases.includes(clean)) {
        score += 150;
      }

      // 2. Exact title or id match
      if (titleLower === clean) score += 120;
      else if (idLower === clean) score += 110;

      // 3. Title starts with query or contains query
      if (titleLower.startsWith(clean)) score += 90;
      else if (titleLower.includes(clean)) score += 70;

      // 4. Any alias contains query or query contains alias
      if (aliases.some(a => a.includes(clean) || clean.includes(a))) {
        score += 65;
      }

      // 5. Format or ID contains query
      if (formatLower.includes(clean)) score += 55;
      if (idLower.includes(clean)) score += 50;

      // 6. Token matching across all fields
      const searchBlob = [
        titleLower,
        idLower,
        formatLower,
        ...aliases,
        defLower,
        useLower,
        symbolsText,
      ].join(' ');

      const matchedTokens = tokens.filter(tok => searchBlob.includes(tok));
      if (matchedTokens.length === tokens.length) {
        score += 40; // All tokens matched
      } else if (matchedTokens.length > 0) {
        score += matchedTokens.length * 10;
      }

      // If search blob directly includes the whole query string
      if (searchBlob.includes(clean)) {
        score += 25;
      }

      return {topic, score};
    })
    .filter(item => item.score > 0);

  scored.sort((a, b) => b.score - a.score);
  return scored.map(item => item.topic);
}

export function getSyntaxMeta(id: string) {
  return syntaxMeta[id] ?? {
    aliases: [],
    memory: '',
    realWorld: '',
  };
}

