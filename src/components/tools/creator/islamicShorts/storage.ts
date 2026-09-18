import { ProjectData } from './types';

const STORAGE_KEY_PREFIX = 'islamic_shorts_project_';
const LAST_PROJECT_KEY = 'islamic_shorts_last_active';

export function saveProjectToStorage(project: ProjectData): boolean {
  try {
    const key = `${STORAGE_KEY_PREFIX}${project.name || 'untitled'}`;
    localStorage.setItem(key, JSON.stringify(project));
    localStorage.setItem(LAST_PROJECT_KEY, key);
    return true;
  } catch (err) {
    console.error('Failed to save project to localStorage', err);
    return false;
  }
}

export function loadLastActiveProject(): ProjectData | null {
  try {
    const lastKey = localStorage.getItem(LAST_PROJECT_KEY);
    if (lastKey) {
      const raw = localStorage.getItem(lastKey);
      if (raw) return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load last project', err);
  }
  return null;
}

export function getAllSavedProjects(): { name: string; key: string; updatedAt: string }[] {
  const result: { name: string; key: string; updatedAt: string }[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          result.push({
            name: parsed.name || key.replace(STORAGE_KEY_PREFIX, ''),
            key,
            updatedAt: new Date().toLocaleDateString()
          });
        }
      }
    }
  } catch (err) {
    console.error('Failed to list saved projects', err);
  }
  return result;
}

export function exportProjectJSON(project: ProjectData) {
  const str = JSON.stringify(project, null, 2);
  const blob = new Blob([str], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.name.toLowerCase().replace(/\s+/g, '-')}-project.json`;
  a.click();
  URL.revokeObjectURL(url);
}
