export const LEGACY_KEY = 'python-lab.progress.v1';
export const KEY = 'python-lab.progress.v2';

/** @typedef {ReturnType<typeof import('../data/catalog.mjs').buildCatalog>} Catalog */
/** @typedef {{version: number, visited: number[], completed: number[], solved: string[], projects: string[], scores: Record<string, number>, last: number, firstProgram: boolean, bookmarks: number[], recent: number[]}} Progress */
/** @typedef {{getItem: (key: string) => string | null, setItem: (key: string, value: string) => void}} StorageLike */

/** @returns {Progress} */
export function freshProgress() {
  return {version: 2, visited: [], completed: [], solved: [], projects: [], scores: {},
    last: 0, firstProgram: false, bookmarks: [], recent: []};
}

/** @param {unknown} value @param {Catalog} catalog */
function normalizeProgress(value, catalog) {
  if (!value || typeof value !== 'object' || !('version' in value)) return null;
  if (value.version !== 1 && value.version !== 2) return null;
  const record = /** @type {Record<string, unknown>} */ (value);
  /** @template T @param {unknown} items @param {Set<T>} valid */
  function known(items, valid) {
    if (!Array.isArray(items)) return [];
    return [...new Set(items.filter(item => valid.has(item)))];
  }
  const progress = freshProgress();
  progress.visited = known(record.visited, catalog.lessonIds);
  progress.completed = known(record.completed, catalog.lessonIds);
  progress.solved = known(record.solved, catalog.taskIds);
  progress.projects = known(record.projects, catalog.projectIds);
  if (typeof record.last === 'number' && catalog.lessonIds.has(record.last)) {
    progress.last = record.last;
  }
  progress.firstProgram = record.firstProgram === true;
  progress.bookmarks = known(record.bookmarks, catalog.lessonIds);
  const recent = value.version === 1
    ? [progress.last, ...progress.visited.slice().reverse()].filter(id => progress.visited.includes(id))
    : known(record.recent, catalog.lessonIds);
  progress.recent = [...new Set(recent)].slice(0, 10);
  if (record.scores && typeof record.scores === 'object' && !Array.isArray(record.scores)) {
    const keys = new Set([...catalog.lessonIds].map(String).concat('revision','applied'));
    progress.scores = Object.fromEntries(Object.entries(record.scores)
      .filter(([id, score]) => keys.has(id) && typeof score === 'number' && score >= 0 && score <= 100));
  }
  return progress;
}

/** @param {StorageLike} storage @param {Catalog} catalog */
export function loadProgress(storage, catalog) {
  for (const key of [KEY, LEGACY_KEY]) {
    try {
      const raw = storage.getItem(key);
      if (raw === null) continue;
      const progress = normalizeProgress(JSON.parse(raw), catalog);
      if (progress) return progress;
    } catch {
      // Try the original backup if the current record is unreadable.
    }
  }
  return freshProgress();
}

/** @param {StorageLike} storage @param {Progress} progress */
export function saveProgress(storage, progress) {
  try {
    storage.setItem(KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}

/** @param {string} text @param {Catalog} catalog */
export function importProgress(text, catalog) {
  if (text.length > 1_000_000) throw new Error('Choose a progress backup smaller than 1 MB.');
  let raw;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error('This file is not valid JSON.');
  }
  const progress = normalizeProgress(raw, catalog);
  if (!progress || !Array.isArray(raw.visited) || !Array.isArray(raw.completed)
    || !Array.isArray(raw.solved) || !Array.isArray(raw.projects)
    || !raw.scores || typeof raw.scores !== 'object' || Array.isArray(raw.scores)) {
    throw new Error('This file is not a supported Python Lab progress backup.');
  }
  return progress;
}

/** @param {Progress} current @param {Progress} incoming */
export function mergeProgress(current, incoming) {
  /** @template T @param {T[]} first @param {T[]} second */
  const union = (first, second) => [...new Set([...first, ...second])];
  const scores = {...current.scores};
  for (const [key, score] of Object.entries(incoming.scores)) {
    scores[key] = Math.max(scores[key] ?? 0, score);
  }
  return {
    ...current,
    visited: union(current.visited, incoming.visited),
    completed: union(current.completed, incoming.completed),
    solved: union(current.solved, incoming.solved),
    projects: union(current.projects, incoming.projects),
    bookmarks: union(current.bookmarks, incoming.bookmarks),
    recent: union(current.recent, incoming.recent).slice(0, 10),
    scores,
    last: current.visited.length ? current.last : incoming.last,
    firstProgram: current.firstProgram || incoming.firstProgram,
  };
}

/** @param {Progress} progress @param {Catalog} catalog */
export function percentage(progress, catalog) {
  const total = catalog.lessonIds.size * 2 + catalog.taskIds.size + catalog.projectIds.size;
  if (!total) return 0;
  const count = progress.completed.length + progress.solved.length + progress.projects.length
    + Object.keys(progress.scores).filter(key => key !== 'revision' && key !== 'applied').length;
  return Math.round(100 * count / total);
}

/** @param {string} text */
export const normalize = text => text.replace(/\r/g, '').split('\n').map(line => line.trimEnd()).join('\n').trim();
/** @param {string} actual @param {string} expected */
export const matchesOutput = (actual, expected) => normalize(actual) === normalize(expected);
/** @param {{answer: number}[]} questions @param {number[]} answers */
export const scoreQuiz = (questions, answers) => questions.length
  ? Math.round(100 * questions.filter((question, index) => question.answer === answers[index]).length / questions.length)
  : 0;
