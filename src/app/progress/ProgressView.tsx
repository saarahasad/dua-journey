"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  categories,
  duas,
  getDuaById,
  getDuasByCategoryId,
  type Dua,
} from "@/lib/data";
import {
  getMemorisedIds,
  unmarkAsMemorised,
} from "@/lib/localStorage";
import { DuaCard } from "@/components/DuaCard";
import { useToast } from "@/components/ToastProvider";

export function ProgressView() {
  const [memorisedIds, setMemorisedIds] = useState<string[]>([]);
  const { showToast } = useToast();

  const refresh = useCallback(() => {
    setMemorisedIds(getMemorisedIds());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const memorisedDuas = useMemo(
    () =>
      memorisedIds
        .map((id) => getDuaById(id))
        .filter((d): d is Dua => d != null),
    [memorisedIds]
  );

  const totalDuas = duas.length;
  const count = memorisedDuas.length;
  const percent = totalDuas > 0 ? Math.round((count / totalDuas) * 100) : 0;

  const byCategory = useMemo(() => {
    const map = new Map<string, Dua[]>();
    for (const dua of memorisedDuas) {
      const list = map.get(dua.categoryId) ?? [];
      list.push(dua);
      map.set(dua.categoryId, list);
    }
    return map;
  }, [memorisedDuas]);

  const categoriesWithProgress = useMemo(
    () => categories.filter((c) => byCategory.has(c.id)),
    [byCategory]
  );

  const handleUnmark = useCallback(
    (duaId: string) => {
      unmarkAsMemorised(duaId);
      setMemorisedIds(getMemorisedIds());
      showToast("Removed from memorised.");
    },
    [showToast]
  );

  if (memorisedDuas.length === 0) {
    return (
      <div className="card-overlay p-8 text-center">
        <p className="text-sage-600">
          No duas marked as memorised yet. Complete a dua journey and tap “Mark as
          Memorised” to see them here.
        </p>
        <Link
          href="/"
          className="tap-scale mt-6 inline-block min-h-touch rounded-xl bg-[#e4dbe2] px-6 py-3 text-slate-900"
        >
          Browse categories
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Visual progress summary */}
      <div className="card-overlay overflow-hidden p-4">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-3xl font-bold tabular-nums text-sage-800">
            {count}
            <span className="text-lg font-normal text-sage-500">/{totalDuas}</span>
          </span>
          <span className="text-sm font-medium text-sage-600">
            {percent}% memorised
          </span>
        </div>
        <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-sage-200/70">
          <div
            className="h-full rounded-full bg-[#8B2C3E] transition-all duration-500 ease-out"
            style={{ width: `${percent}%` }}
            role="progressbar"
            aria-valuenow={count}
            aria-valuemin={0}
            aria-valuemax={totalDuas}
            aria-label={`${count} of ${totalDuas} duas memorised`}
          />
        </div>
        <p className="mt-3 text-center text-sm text-sage-600">
          Keep going — may Allah make it easy.
        </p>
      </div>

      {/* Per-category sections with mini progress */}
      <div className="space-y-8">
        {categoriesWithProgress.map((category) => {
          const inCategory = byCategory.get(category.id) ?? [];
          const totalInCategory = getDuasByCategoryId(category.id).length;
          const categoryPercent =
            totalInCategory > 0
              ? Math.round((inCategory.length / totalInCategory) * 100)
              : 0;
          return (
            <section key={category.id} className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-semibold text-black">
                  {category.title}
                </h2>
                <span className="text-xs font-medium tabular-nums text-sage-500">
                  {inCategory.length}/{totalInCategory}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-sage-200/70">
                <div
                  className="h-full rounded-full bg-[#e4dbe2] transition-all duration-300"
                  style={{ width: `${categoryPercent}%` }}
                />
              </div>
              <div className="space-y-3 pt-1">
                {inCategory.map((dua, i) => (
                  <DuaCard
                    key={dua.id}
                    dua={dua}
                    isMemorised
                    onUnmark={() => handleUnmark(dua.id)}
                    noGlow
                    number={i + 1}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
