"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { getPersonalDuaList, type PersonalDuaList } from "@/lib/personalDuaStorage";
import { getDuasForPersonalSectionRotated } from "@/lib/data";
import { PersonalDuaBlock } from "@/components/PersonalDuaBlock";
import { EssentialDuasIntro } from "@/components/EssentialDuasIntro";
import { InlineDuaBlock } from "@/components/InlineDuaBlock";
import { PersonalDuaListPdfContent } from "@/components/PersonalDuaListPdfContent";
import { useToast } from "@/components/ToastProvider";
import { downloadElementAsPdf } from "@/lib/downloadListPdf";

function formatSavedDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { dateStyle: "medium" });
  } catch {
    return "";
  }
}

type ListState = "loading" | "none" | PersonalDuaList;

export default function PersonalDuaListViewPage() {
  const [state, setState] = useState<ListState>("loading");
  const [pdfBusy, setPdfBusy] = useState(false);
  const pdfContentRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const stored = getPersonalDuaList();
    setState(stored ?? "none");
  }, []);

  // Rotate which duas appear: random 4 of 10 per section each visit (hooks must run before any return)
  const rotatedDuas = useMemo(
    () => ({
      worries: getDuasForPersonalSectionRotated("worries", 4),
      goals: getDuasForPersonalSectionRotated("goals", 4),
      weaknesses: getDuasForPersonalSectionRotated("weaknesses", 4),
      people: getDuasForPersonalSectionRotated("people", 4),
    }),
    []
  );

  if (state === "loading") {
    return (
      <main className="min-h-screen">
        <div className="mx-auto max-w-md px-4 pb-24 pt-6">
          <Link
            href="/"
            className="mb-4 inline-block text-sm font-medium text-slate-600 underline decoration-slate-400 underline-offset-2 hover:text-slate-800"
          >
            ← Back
          </Link>
          <div className="card-overlay p-6 text-center">
            <p className="text-slate-600">Loading your list…</p>
          </div>
        </div>
      </main>
    );
  }

  if (state === "none") {
    return (
      <main className="min-h-screen">
        <div className="mx-auto max-w-md px-4 pb-24 pt-6">
          <Link
            href="/"
            className="mb-4 inline-block text-sm font-medium text-slate-600 underline decoration-slate-400 underline-offset-2 hover:text-slate-800"
          >
            ← Back
          </Link>
          <div className="card-overlay p-8 text-center">
            <h1 className="text-lg font-semibold text-slate-800">No saved list yet</h1>
            <p className="mt-2 text-sm text-slate-600">
              Build your personal dua list by reflecting on your worries, goals, weaknesses, and people to pray for.
            </p>
            <Link
              href="/personal-dua"
              className="mt-6 inline-block rounded-xl bg-[#984167] px-5 py-2.5 font-medium text-white hover:bg-[#7a3552]"
            >
              Create my list
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const list = state;
  const empty = !list.worries.trim() && !list.goals.trim() && !list.weaknesses.trim() && !list.people.trim();

  if (empty) {
    return (
      <main className="min-h-screen">
        <div className="mx-auto max-w-md px-4 pb-24 pt-6">
          <Link
            href="/"
            className="mb-4 inline-block text-sm font-medium text-slate-600 underline decoration-slate-400 underline-offset-2 hover:text-slate-800"
          >
            ← Back
          </Link>
          <div className="card-overlay p-8 text-center">
            <h1 className="text-lg font-semibold text-slate-800">Your list is empty</h1>
            <p className="mt-2 text-sm text-slate-600">Add worries, goals, weaknesses, or people to pray for.</p>
            <Link
              href="/personal-dua"
              className="mt-6 inline-block rounded-xl bg-[#984167] px-5 py-2.5 font-medium text-white hover:bg-[#7a3552]"
            >
              Edit my list
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col">
      {/* Off-screen div for PDF capture: no scrollbars, same list + suggested duas */}
      <div
        ref={pdfContentRef}
        aria-hidden
        className="fixed left-[-9999px] top-0 z-[-1] overflow-visible"
        style={{ width: 595, overflow: "visible" }}
      >
        <PersonalDuaListPdfContent list={list} rotatedDuas={rotatedDuas} />
      </div>

      <div className="mx-auto flex min-h-0 w-full max-w-md flex-1 flex-col px-4 pb-6 pt-6">
        <Link
          href="/"
          className="mb-4 shrink-0 inline-block text-sm font-medium text-slate-600 underline decoration-slate-400 underline-offset-2 hover:text-slate-800"
        >
          ← Back
        </Link>
        <div className="mb-4 shrink-0 flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-xl font-semibold text-slate-800">My Dua List</h1>
          <div className="flex items-center gap-2">
            <Link
              href="/personal-dua"
              className="text-sm font-medium text-slate-600 underline decoration-slate-400 underline-offset-2 hover:text-slate-800"
            >
              Edit my list
            </Link>
            {list.savedAt && (
              <span className="text-xs text-slate-500">Saved {formatSavedDate(list.savedAt)}</span>
            )}
            <button
              type="button"
              disabled={pdfBusy}
              onClick={async () => {
                if (!pdfContentRef.current) return;
                setPdfBusy(true);
                try {
                  await downloadElementAsPdf(pdfContentRef.current, "my-dua-list.pdf");
                  showToast("PDF downloaded");
                } catch {
                  showToast("Could not create PDF");
                } finally {
                  setPdfBusy(false);
                }
              }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
            >
              {pdfBusy ? "Creating…" : "Download as PDF"}
            </button>
          </div>
        </div>

        <div className="card-overlay min-h-0 flex-1 overflow-hidden flex flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            <div className="space-y-6 text-sm">
              <div className="rounded-xl bg-slate-100 p-4 text-center text-slate-700 shadow-sm">
                <EssentialDuasIntro centered />
              </div>

              {list.worries.trim() && (
                <>
                  <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                    <h2 className="mb-2 font-semibold text-[#984167]">Worries & difficulties</h2>
                    <div className="leading-relaxed text-black">
                      <PersonalDuaBlock text={list.worries} />
                    </div>
                  </div>
                  {rotatedDuas.worries.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Dua to recite</p>
                      {rotatedDuas.worries.map((dua) => (
                        <InlineDuaBlock key={dua.id} dua={dua} />
                      ))}
                    </div>
                  )}
                </>
              )}

              {list.goals.trim() && (
                <>
                  <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                    <h2 className="mb-2 font-semibold text-[#984167]">Goals & wishes</h2>
                    <div className="leading-relaxed text-black">
                      <PersonalDuaBlock text={list.goals} />
                    </div>
                  </div>
                  {rotatedDuas.goals.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Dua to recite</p>
                      {rotatedDuas.goals.map((dua) => (
                        <InlineDuaBlock key={dua.id} dua={dua} />
                      ))}
                    </div>
                  )}
                </>
              )}

              {list.weaknesses.trim() && (
                <>
                  <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                    <h2 className="mb-2 font-semibold text-[#984167]">Weaknesses to improve</h2>
                    <div className="leading-relaxed text-black">
                      <PersonalDuaBlock text={list.weaknesses} />
                    </div>
                  </div>
                  {rotatedDuas.weaknesses.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Dua to recite</p>
                      {rotatedDuas.weaknesses.map((dua) => (
                        <InlineDuaBlock key={dua.id} dua={dua} />
                      ))}
                    </div>
                  )}
                </>
              )}

              {list.people.trim() && (
                <>
                  <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                    <h2 className="mb-2 font-semibold text-[#984167]">People to pray for</h2>
                    <div className="leading-relaxed text-black">
                      <PersonalDuaBlock text={list.people} />
                    </div>
                  </div>
                  {rotatedDuas.people.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Dua to recite</p>
                      {rotatedDuas.people.map((dua) => (
                        <InlineDuaBlock key={dua.id} dua={dua} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
