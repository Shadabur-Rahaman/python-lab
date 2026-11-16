export type DsaArenaProgress = {
  version: 1;
  solvedProblems: string[];
  attemptedProblems: string[];
  completedModules: string[];
  savedDrafts: Record<string, string>;
  activeProblemId: string | null;
  notes: Record<string, string>;
};

export const DSA_STORAGE_KEY = 'python-lab.dsa-arena.v1';

export function defaultDsaProgress(): DsaArenaProgress {
  return {
    version: 1,
    solvedProblems: [],
    attemptedProblems: [],
    completedModules: [],
    savedDrafts: {},
    activeProblemId: null,
    notes: {},
  };
}

export function loadDsaProgress(
  storageLike?: { getItem: (key: string) => string | null }
): DsaArenaProgress {
  const s = storageLike || (typeof localStorage !== 'undefined' ? localStorage : null);
  if (!s) return defaultDsaProgress();
  try {
    const raw = s.getItem(DSA_STORAGE_KEY);
    if (!raw) return defaultDsaProgress();
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object' || data.version !== 1) {
      return defaultDsaProgress();
    }

    const toStringArray = (val: unknown): string[] => {
      if (!Array.isArray(val)) return [];
      return [...new Set(val.filter((x): x is string => typeof x === 'string'))];
    };

    const toRecord = (val: unknown): Record<string, string> => {
      if (!val || typeof val !== 'object' || Array.isArray(val)) return {};
      const res: Record<string, string> = {};
      for (const [k, v] of Object.entries(val)) {
        if (typeof v === 'string') res[k] = v;
      }
      return res;
    };

    return {
      version: 1,
      solvedProblems: toStringArray(data.solvedProblems),
      attemptedProblems: toStringArray(data.attemptedProblems),
      completedModules: toStringArray(data.completedModules),
      savedDrafts: toRecord(data.savedDrafts),
      activeProblemId: typeof data.activeProblemId === 'string' ? data.activeProblemId : null,
      notes: toRecord(data.notes),
    };
  } catch {
    return defaultDsaProgress();
  }
}

export function saveDsaProgress(
  progress: DsaArenaProgress,
  storageLike?: { setItem: (key: string, val: string) => void }
): boolean {
  const s = storageLike || (typeof localStorage !== 'undefined' ? localStorage : null);
  if (!s) return false;
  try {
    s.setItem(DSA_STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}

export function markProblemSolved(id: string): DsaArenaProgress {
  const current = loadDsaProgress();
  if (!current.solvedProblems.includes(id)) {
    current.solvedProblems.push(id);
  }
  if (!current.attemptedProblems.includes(id)) {
    current.attemptedProblems.push(id);
  }
  saveDsaProgress(current);
  return current;
}

export function markProblemAttempted(id: string): DsaArenaProgress {
  const current = loadDsaProgress();
  if (!current.attemptedProblems.includes(id)) {
    current.attemptedProblems.push(id);
    saveDsaProgress(current);
  }
  return current;
}

export function saveProblemDraft(id: string, code: string): DsaArenaProgress {
  const current = loadDsaProgress();
  current.savedDrafts[id] = code;
  saveDsaProgress(current);
  return current;
}
