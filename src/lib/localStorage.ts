const STORAGE_KEY = "dua-journey-memorised";

export function getMemorisedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isMemorised(duaId: string): boolean {
  return getMemorisedIds().includes(duaId);
}

export function markAsMemorised(duaId: string): void {
  const ids = getMemorisedIds();
  if (ids.includes(duaId)) return;
  ids.push(duaId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function unmarkAsMemorised(duaId: string): void {
  const ids = getMemorisedIds().filter((id) => id !== duaId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}
