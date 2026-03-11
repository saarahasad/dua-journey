"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getPersonalDuaList, type PersonalDuaList } from "@/lib/personalDuaStorage";
import { getDuasForPersonalSectionRotated } from "@/lib/data";
import { PersonalDuaBlock } from "@/components/PersonalDuaBlock";
import { EssentialDuasIntro } from "@/components/EssentialDuasIntro";
import { InlineDuaBlock } from "@/components/InlineDuaBlock";
import { useToast } from "@/components/ToastProvider";

function formatSavedDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { dateStyle: "medium" });
  } catch {
    return "";
  }
}

function listAsPlainText(list: PersonalDuaList): string {
  const parts: string[] = ["My Dua List"];
  if (list.savedAt) {
    try {
      parts.push(`Saved ${formatSavedDate(list.savedAt)}`);
    } catch {
      // ignore
    }
  }
  parts.push("");
  if (list.worries.trim()) {
    parts.push("Worries & difficulties");
    parts.push(list.worries.trim());
    parts.push("");
  }
  if (list.goals.trim()) {
    parts.push("Goals & wishes");
    parts.push(list.goals.trim());
    parts.push("");
  }
  if (list.weaknesses.trim()) {
    parts.push("Weaknesses to improve");
    parts.push(list.weaknesses.trim());
    parts.push("");
  }
  if (list.people.trim()) {
    parts.push("People to pray for");
    parts.push(list.people.trim());
  }
  return parts.join("\n");
}

type ListState = "loading" | "none" | PersonalDuaList;

export default function PersonalDuaListViewPage() {
  const [state, setState] = useState<ListState>("loading");
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
    <main className="min-h-screen">
      <div className="mx-auto max-w-md px-4 pb-24 pt-6">
        <Link
          href="/"
          className="mb-4 inline-block text-sm font-medium text-slate-600 underline decoration-slate-400 underline-offset-2 hover:text-slate-800"
        >
          ← Back
        </Link>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-xl font-semibold text-slate-800">My Dua List</h1>
          <div className="flex items-center gap-2">
            {list.savedAt && (
              <span className="text-xs text-slate-500">Saved {formatSavedDate(list.savedAt)}</span>
            )}
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(listAsPlainText(list));
                  showToast("List copied to clipboard");
                } catch {
                  showToast("Could not copy");
                }
              }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Copy list
            </button>
          </div>
        </div>

        <div className="card-overlay overflow-hidden">
          <div className="max-h-[75vh] overflow-y-auto p-5">
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

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link href="/personal-dua" className="underline decoration-slate-400 underline-offset-2 hover:text-slate-700">
            Edit my list
          </Link>
        </p>
      </div>
    </main>
  );
}
