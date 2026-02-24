"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  categories,
  duas,
  getDuaById,
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

  const memorisedDuas = memorisedIds
    .map((id) => getDuaById(id))
    .filter((d): d is Dua => d != null);

  const totalDuas = duas.length;
  const count = memorisedDuas.length;

  const getCategoryTitle = useCallback((categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.title ?? categoryId;
  }, []);

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
    <div className="space-y-6">
      <div className="card-overlay px-5 py-4 text-center">
        <p className="text-lg font-semibold text-sage-800">
          {count} of {totalDuas} duas memorised
        </p>
        <p className="mt-1 text-sm text-sage-600">
          Keep going — may Allah make it easy.
        </p>
      </div>
      <div className="space-y-4">
        {memorisedDuas.map((dua) => (
          <div key={dua.id}>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-sage-500">
              {getCategoryTitle(dua.categoryId)}
            </p>
            <DuaCard
              dua={dua}
              isMemorised
              onUnmark={() => handleUnmark(dua.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
