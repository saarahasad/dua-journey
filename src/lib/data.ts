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
