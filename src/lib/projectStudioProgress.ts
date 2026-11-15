export interface ProjectStudioProgress {
  version: 1;
  verifiedProjects: string[];
  milestoneProgress: Record<string, number[]>; // projectId -> array of completed milestone indices
  savedCode: Record<string, string>; // projectId -> last verified or user working code
}

export const PROJECT_STUDIO_STORAGE_KEY = 'python-lab.project-studio.v1';

export function freshProjectStudioProgress(): ProjectStudioProgress {
  return {
    version: 1,
    verifiedProjects: [],
    milestoneProgress: {},
    savedCode: {},
  };
}

export function loadProjectStudioProgress(
  storageLike?: { getItem: (key: string) => string | null }
): ProjectStudioProgress {
  const s = storageLike || (typeof localStorage !== 'undefined' ? localStorage : null);
  if (!s) return freshProjectStudioProgress();
  try {
    const raw = s.getItem(PROJECT_STUDIO_STORAGE_KEY);
    if (!raw) return freshProjectStudioProgress();
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object' || data.version !== 1) return freshProjectStudioProgress();

    const verifiedProjects: string[] = Array.isArray(data.verifiedProjects)
      ? Array.from(new Set(data.verifiedProjects.filter((id: unknown): id is string => typeof id === 'string')))
      : [];

    const milestoneProgress: Record<string, number[]> = {};
    if (data.milestoneProgress && typeof data.milestoneProgress === 'object' && !Array.isArray(data.milestoneProgress)) {
      for (const [pId, list] of Object.entries(data.milestoneProgress)) {
        if (Array.isArray(list)) {
          milestoneProgress[pId] = Array.from(
            new Set(list.filter((m: unknown): m is number => typeof m === 'number'))
          );
        }
      }
    }

    const savedCode: Record<string, string> = {};
    if (data.savedCode && typeof data.savedCode === 'object' && !Array.isArray(data.savedCode)) {
      for (const [pId, code] of Object.entries(data.savedCode)) {
        if (typeof code === 'string') {
          savedCode[pId] = code;
        }
      }
    }

    return {
      version: 1,
      verifiedProjects,
      milestoneProgress,
      savedCode,
    };
  } catch {
    return freshProjectStudioProgress();
  }
}

export function saveProjectStudioProgress(
  progress: ProjectStudioProgress,
  storageLike?: { setItem: (key: string, value: string) => void }
): boolean {
  const s = storageLike || (typeof localStorage !== 'undefined' ? localStorage : null);
  if (!s) return false;
  try {
    s.setItem(PROJECT_STUDIO_STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}

export function exportFile(filename: string, content: string, mimeType = 'text/plain') {
  if (typeof document === 'undefined') return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
