export interface AdvancedProgress {
  version: 1;
  completedModules: string[];
  solvedChallenges: string[];
  attemptedChallenges: string[];
  quizScores: Record<string, number>;
  savedDrafts: Record<string, string>;
  predictions: Record<string, string>;
  debugSolved: string[];
}

export const ADVANCED_STORAGE_KEY = 'python-lab.advanced.v1';

export function freshAdvancedProgress(): AdvancedProgress {
  return {
    version: 1,
    completedModules: [],
    solvedChallenges: [],
    attemptedChallenges: [],
    quizScores: {},
    savedDrafts: {},
    predictions: {},
    debugSolved: [],
  };
}

export function loadAdvancedProgress(
  storageLike?: { getItem: (key: string) => string | null }
): AdvancedProgress {
  const s = storageLike || (typeof localStorage !== 'undefined' ? localStorage : null);
  if (!s) return freshAdvancedProgress();
  try {
    const raw = s.getItem(ADVANCED_STORAGE_KEY);
    if (!raw) return freshAdvancedProgress();
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object' || data.version !== 1) return freshAdvancedProgress();

    const filterStrings = (arr: unknown): string[] => {
      if (!Array.isArray(arr)) return [];
      return [...new Set(arr.filter((item: unknown): item is string => typeof item === 'string'))];
    };

    const scores: Record<string, number> = {};
    if (data.quizScores && typeof data.quizScores === 'object' && !Array.isArray(data.quizScores)) {
      for (const [key, val] of Object.entries(data.quizScores)) {
        if (typeof val === 'number' && val >= 0 && val <= 100) {
          scores[key] = val;
        }
      }
    }

    const drafts: Record<string, string> = {};
    if (data.savedDrafts && typeof data.savedDrafts === 'object' && !Array.isArray(data.savedDrafts)) {
      for (const [key, val] of Object.entries(data.savedDrafts)) {
        if (typeof val === 'string') {
          drafts[key] = val;
        }
      }
    }

    const predictions: Record<string, string> = {};
    if (data.predictions && typeof data.predictions === 'object' && !Array.isArray(data.predictions)) {
      for (const [key, val] of Object.entries(data.predictions)) {
        if (typeof val === 'string') {
          predictions[key] = val;
        }
      }
    }

    return {
      version: 1,
      completedModules: filterStrings(data.completedModules),
      solvedChallenges: filterStrings(data.solvedChallenges),
      attemptedChallenges: filterStrings(data.attemptedChallenges),
      quizScores: scores,
      savedDrafts: drafts,
      predictions,
      debugSolved: filterStrings(data.debugSolved),
    };
  } catch {
    return freshAdvancedProgress();
  }
}

export function saveAdvancedProgress(
  progress: AdvancedProgress,
  storageLike?: { setItem: (key: string, value: string) => void }
): boolean {
  const s = storageLike || (typeof localStorage !== 'undefined' ? localStorage : null);
  if (!s) return false;
  try {
    s.setItem(ADVANCED_STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}
