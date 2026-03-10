const STORAGE_KEY = "dua-journey-personal-list";

export interface PersonalDuaList {
  worries: string;
  goals: string;
  weaknesses: string;
  people: string;
  savedAt: string; // ISO date
}

export function getPersonalDuaList(): PersonalDuaList | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as PersonalDuaList;
    return parsed && typeof parsed.worries === "string" ? parsed : null;
  } catch {
    return null;
  }
}

export function savePersonalDuaList(data: Omit<PersonalDuaList, "savedAt">): void {
  const withDate: PersonalDuaList = {
    ...data,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(withDate));
}

export function hasSavedPersonalList(): boolean {
  return getPersonalDuaList() !== null;
}
