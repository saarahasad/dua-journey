"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { hasSavedPersonalList } from "@/lib/personalDuaStorage";
import { PersonalDuaBuilderCard, PersonalDuaViewCard } from "@/components/PersonalDuaCards";
import { ExamplePdfDownloadButton } from "@/components/ExamplePdfDownloadButton";

/** Dropdown that contains: Create list, View list (if saved), and Download example PDF. */
export function PersonalDuaDropdown() {
  const [open, setOpen] = useState(false);
  const [hasList, setHasList] = useState(false);

  useEffect(() => {
    setHasList(hasSavedPersonalList());
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#b25d82]/25 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="tap-scale flex w-full items-center gap-4 p-4 text-left"
        aria-expanded={open}
        aria-controls="personal-dua-dropdown-content"
        id="personal-dua-dropdown-trigger"
      >
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#984167]/12 text-[#984167]"
          aria-hidden
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold tracking-tight text-slate-800">My Dua List</h2>
          <p className="mt-0.5 text-sm text-slate-600">
            Create, view, and download your personal dua list with Quranic and Sunnah duas.
          </p>
        </div>
        <span
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      <div
        id="personal-dua-dropdown-content"
        role="region"
        aria-labelledby="personal-dua-dropdown-trigger"
        className={`grid transition-[grid-template-rows] duration-200 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="space-y-3 border-t border-slate-100 bg-slate-50/30 p-4">
            <PersonalDuaBuilderCard />
            {hasList && <PersonalDuaViewCard />}
            <div className="rounded-xl border border-slate-100 bg-white p-4">
              <p className="mb-3 text-sm text-slate-600">
                See an example: a person asking for duas for work, family, health, and more.
              </p>
              <ExamplePdfDownloadButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
