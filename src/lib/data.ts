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
  return [...seen].sort(
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
