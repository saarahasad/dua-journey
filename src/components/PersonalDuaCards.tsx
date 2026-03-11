"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { hasSavedPersonalList } from "@/lib/personalDuaStorage";

/** Card to start building a personal dua list (guided flow). */
export function PersonalDuaBuilderCard() {
  return (
    <Link
      href="/personal-dua"
      className="tap-scale app-card"
    >
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#984167]/12 text-[#984167]"
        aria-hidden
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="text-base font-semibold tracking-tight text-slate-800">My Personal Dua List</h2>
        <p className="mt-1 text-sm leading-snug text-slate-600">
          Reflect on your worries, goals, weaknesses, and loved ones — then build a personal dua list.
        </p>
      </div>
      <span className="shrink-0 text-slate-400" aria-hidden>
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </Link>
  );
}

/** Card to view the saved personal dua list (only shown when a list exists). */
export function PersonalDuaViewCard() {
  const [hasList, setHasList] = useState(false);

  useEffect(() => {
    setHasList(hasSavedPersonalList());
  }, []);

  if (!hasList) return null;

  return (
    <Link
      href="/personal-dua/list"
      className="tap-scale app-card justify-between"
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#984167]/10 text-[#984167]"
          aria-hidden
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-tight text-slate-800">View My Dua List</h2>
          <p className="mt-0.5 text-sm leading-snug text-slate-600">
            Open your saved list. Beautify your duas with Quranic and Sunnah duas. Download as PDF for yourself.
          </p>
        </div>
      </div>
      <span className="shrink-0 text-slate-400" aria-hidden>
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </Link>
  );
}
