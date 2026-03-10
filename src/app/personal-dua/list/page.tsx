"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getPersonalDuaList, type PersonalDuaList } from "@/lib/personalDuaStorage";
import { getSuggestedDuasForPersonalDua } from "@/lib/data";
import { PersonalDuaBlock } from "@/components/PersonalDuaBlock";
import { EssentialDuasIntro } from "@/components/EssentialDuasIntro";
import { DuaCard } from "@/components/DuaCard";
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
                <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                  <h2 className="mb-2 font-semibold text-[#984167]">Worries & difficulties</h2>
                  <div className="leading-relaxed text-slate-600">
                    <PersonalDuaBlock text={list.worries} />
                  </div>
                </div>
              )}
              {list.goals.trim() && (
                <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                  <h2 className="mb-2 font-semibold text-[#984167]">Goals & wishes</h2>
                  <div className="leading-relaxed text-slate-600">
                    <PersonalDuaBlock text={list.goals} />
                  </div>
                </div>
              )}
              {list.weaknesses.trim() && (
                <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                  <h2 className="mb-2 font-semibold text-[#984167]">Weaknesses to improve</h2>
                  <div className="leading-relaxed text-slate-600">
                    <PersonalDuaBlock text={list.weaknesses} />
                  </div>
                </div>
              )}
              {list.people.trim() && (
                <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                  <h2 className="mb-2 font-semibold text-[#984167]">People to pray for</h2>
                  <div className="leading-relaxed text-slate-600">
                    <PersonalDuaBlock text={list.people} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold text-slate-800">Suggested duas to read with your list</h2>
          <p className="mb-4 text-sm text-slate-600">
            These duas from the app go well with personal supplication — for ease, gratitude, forgiveness, and more.
          </p>
          <div className="space-y-3">
            {getSuggestedDuasForPersonalDua(8).map((dua) => (
              <DuaCard key={dua.id} dua={dua} noGlow />
            ))}
          </div>
        </section>

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link href="/personal-dua" className="underline decoration-slate-400 underline-offset-2 hover:text-slate-700">
            Edit my list
          </Link>
        </p>
      </div>
    </main>
  );
}
