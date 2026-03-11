import categoriesData from "@/data/categories.json";
import duasData from "@/data/duas.json";

export interface Category {
  id: string;
  title: string;
  description: string;
  slug: string;
}

export interface Phrase {
  arabic: string;
  transliteration: string;
  meaning: string;
  /** Start time in seconds in the full audio (optional, for phrase-synced playback) */
  startTime?: number;
  /** End time in seconds in the full audio (optional) */
  endTime?: number;
}

export interface Question {
  question: string;
  answer: string;
  explanation: string;
}

export interface WhenToRead {
  inSalah: string[];
  outsideSalah: string[];
}

export interface Dua {
  id: string;
  categoryId: string;
  audioUrl?: string;
  title: string;
  arabicFull: string;
  transliterationFull: string;
  translationFull: string;
  intro: string;
  story: string;
  benefits: string[];
  phrases: Phrase[];
  questions: Question[];
  whenToRead: WhenToRead;
  /** For in-salah category: where in the prayer this dua is read (e.g. "In Ruku", "Before Tashahhud"). */
  salahPositionCategories?: string[];
}

export const categories: Category[] = categoriesData as Category[];
export const duas: Dua[] = duasData as Dua[];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug || c.id === slug);
}

export function getDuasByCategoryId(categoryId: string): Dua[] {
  return duas.filter((d) => d.categoryId === categoryId);
}

export function getDuaById(id: string): Dua | undefined {
  return duas.find((d) => d.id === id);
}

/** Display order for salah position sub-categories (flow of prayer). Others appear at the end. */
const SALAH_POSITION_ORDER = [
  "Opening Supplication (after Takbir, before Fatiha)",
  "In Ruku",
  "After Ruku (Standing before Sujood)",
  "In Sujood",
  "Between Two Sujood",
  "After Tashahhud Before Salam",
  "Immediately After Salam",
  "Additional Supplications",
];

export function getSalahPositionCategories(categoryId: string): string[] {
  if (categoryId !== "in-salah") return [];
  const seen = new Set<string>();
  for (const d of duas) {
    if (d.categoryId !== "in-salah" || !d.salahPositionCategories) continue;
    for (const pos of d.salahPositionCategories) seen.add(pos);
  }
  return Array.from(seen).sort(
    (a, b) =>
      (SALAH_POSITION_ORDER.indexOf(a) === -1 ? 999 : SALAH_POSITION_ORDER.indexOf(a)) -
      (SALAH_POSITION_ORDER.indexOf(b) === -1 ? 999 : SALAH_POSITION_ORDER.indexOf(b))
  );
}

export function getDuasByCategoryIdAndSalahPosition(
  categoryId: string,
  position: string
): Dua[] {
  if (categoryId !== "in-salah") return [];
  return duas.filter(
    (d) =>
      d.categoryId === categoryId &&
      d.salahPositionCategories?.includes(position)
  );
}

export function getDuasInSalahWithoutPosition(categoryId: string): Dua[] {
  if (categoryId !== "in-salah") return [];
  return duas.filter(
    (d) => d.categoryId === categoryId && (!d.salahPositionCategories || d.salahPositionCategories.length === 0)
  );
}

/** Slug for URL: "In Ruku" → "in-ruku". Used for salah position sub-pages. */
export function getSalahPositionSlug(position: string): string {
  return position
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/** Resolve slug back to position name for in-salah. "other" returns the literal "Other". */
export function getSalahPositionBySlug(categoryId: string, positionSlug: string): string | undefined {
  if (categoryId !== "in-salah") return undefined;
  if (positionSlug === "other") return "Other";
  const positions = getSalahPositionCategories(categoryId);
  return positions.find((p) => getSalahPositionSlug(p) === positionSlug);
}

/** Category IDs that are well-suited to recite when making personal duas (outside salah). */
const PERSONAL_DUA_CATEGORY_IDS = [
  "ease-hardship",   // worries & difficulties
  "duniya-akhirah",  // goals & this life / hereafter
  "forgiveness",     // weaknesses, repentance
  "contentment",     // acceptance, peace
  "gratitude",       // thanks
  "after-salah",     // general supplication
  "praise",          // opening praise
  "steadfastness",   // faith
  "parents",
  "children",
  "spouse",
  "knowledge",
  "faith",
  "istikhara",
  "salawat",
];

/** Returns a short list of duas from the app that are good to read while making personal duas. */
export function getSuggestedDuasForPersonalDua(maxCount: number = 8): Dua[] {
  const suggested: Dua[] = [];
  const seenIds = new Set<string>();
  for (const categoryId of PERSONAL_DUA_CATEGORY_IDS) {
    if (categoryId === "in-salah") continue;
    const inCategory = duas.filter((d) => d.categoryId === categoryId);
    for (const d of inCategory) {
      if (seenIds.has(d.id)) continue;
      seenIds.add(d.id);
      suggested.push(d);
      if (suggested.length >= maxCount) return suggested;
    }
  }
  return suggested;
}

/** Personal list section keys for embedding relevant duas. */
export type PersonalSectionKey = "worries" | "goals" | "weaknesses" | "people";

/** Dua IDs to show after each personal section (Arabic + translation inline). 10 per section; rotation picks a subset each visit. */
const DUAS_BY_PERSONAL_SECTION: Record<PersonalSectionKey, string[]> = {
  worries: [
    "dua-contentment-1",
    "dua-contentment-2",
    "dua-contentment-3",
    "dua-contentment-4",
    "dua-ease-1",
    "dua-ease-2",
    "dua-ease-3",
    "dua-ease-4",
    "dua-ease-5",
    "dua-gratitude-1",
  ],
  goals: [
    "dua-duniya-akhirah-1",
    "dua-duniya-akhirah-2",
    "dua-duniya-akhirah-3",
    "dua-knowledge-1",
    "dua-knowledge-2",
    "dua-knowledge-3",
    "dua-istikhara-1",
    "dua-istikhara-2",
    "dua-gratitude-2",
    "dua-gratitude-3",
  ],
  weaknesses: [
    "dua-steadfastness-1",
    "dua-steadfastness-2",
    "dua-steadfastness-3",
    "dua-forgiveness-1",
    "dua-forgiveness-2",
    "dua-forgiveness-3",
    "dua-forgiveness-4",
    "dua-faith-1",
    "dua-faith-2",
    "dua-faith-3",
  ],
  people: [
    "dua-children-1",
    "dua-children-2",
    "dua-children-3",
    "dua-children-4",
    "dua-children-5",
    "dua-children-6",
    "dua-spouse-1",
    "dua-forgiveness-3",
    "dua-faith-4",
    "dua-faith-5",
  ],
};

/** Returns duas to recite inline after each personal list section (Arabic + translation). */
export function getDuasForPersonalSection(section: PersonalSectionKey): Dua[] {
  const ids = DUAS_BY_PERSONAL_SECTION[section];
  return ids.map((id) => getDuaById(id)).filter((d): d is Dua => d != null);
}

/** Fisher–Yates shuffle (returns new array). */
function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Returns a random subset of duas for a section (e.g. 4 of 10) so suggestions rotate each visit. */
export function getDuasForPersonalSectionRotated(
  section: PersonalSectionKey,
  count: number = 4
): Dua[] {
  const all = getDuasForPersonalSection(section);
  return shuffle(all).slice(0, count);
}

/** Returns first N duas per section for the example PDF (deterministic). */
export function getDuasForPersonalSectionExample(section: PersonalSectionKey, count: number = 4): Dua[] {
  return getDuasForPersonalSection(section).slice(0, count);
}

/** Returns suggested duas in random order so the list varies each visit. */
export function getSuggestedDuasForPersonalDuaShuffled(count: number = 8): Dua[] {
  const pool = getSuggestedDuasForPersonalDua(20);
  return shuffle(pool).slice(0, count);
}
