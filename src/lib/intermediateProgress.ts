export interface IntermediateProgress {
  version: 1;
  completedModules: string[];
  solvedChallenges: string[];
  attemptedChallenges: string[];
  quizScores: Record<string, number>;
  capstoneCompleted: boolean;
  capstoneCode?: string;
}

export const INTERMEDIATE_STORAGE_KEY = 'python-lab.intermediate.v1';

export function freshIntermediateProgress(): IntermediateProgress {
  return {
    version: 1,
    completedModules: [],
    solvedChallenges: [],
    attemptedChallenges: [],
    quizScores: {},
    capstoneCompleted: false,
  };
}

export function loadIntermediateProgress(
  storageLike?: { getItem: (key: string) => string | null }
): IntermediateProgress {
  const s = storageLike || (typeof localStorage !== 'undefined' ? localStorage : null);
  if (!s) return freshIntermediateProgress();
  try {
    const raw = s.getItem(INTERMEDIATE_STORAGE_KEY);
    if (!raw) return freshIntermediateProgress();
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object' || data.version !== 1) return freshIntermediateProgress();
    
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

    const result: IntermediateProgress = {
      version: 1,
      completedModules: filterStrings(data.completedModules),
      solvedChallenges: filterStrings(data.solvedChallenges),
      attemptedChallenges: filterStrings(data.attemptedChallenges),
      quizScores: scores,
      capstoneCompleted: Boolean(data.capstoneCompleted),
    };

    if (typeof data.capstoneCode === 'string') {
      result.capstoneCode = data.capstoneCode;
    }

    return result;
  } catch {
    return freshIntermediateProgress();
  }
}

export function saveIntermediateProgress(
  progress: IntermediateProgress,
  storageLike?: { setItem: (key: string, value: string) => void }
): boolean {
  const s = storageLike || (typeof localStorage !== 'undefined' ? localStorage : null);
  if (!s) return false;
  try {
    s.setItem(INTERMEDIATE_STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}
