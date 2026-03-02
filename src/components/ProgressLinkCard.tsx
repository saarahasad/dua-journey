"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getMemorisedIds } from "@/lib/localStorage";

export function ProgressLinkCard() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    setCount(getMemorisedIds().length);
  }, []);

  const subtitle =
    count === null
      ? "View memorised duas"
      : count === 0
        ? "No duas memorised yet — start your journey"
        : null;
  const showCount = count !== null && count > 0;

  return (
    <Link
      href="/progress"
      className="tap-scale progress-card flex items-center justify-between gap-4 rounded-2xl p-5 transition-all duration-300 ease-in-out active:scale-[0.99]"
    >
      <div className="min-w-0 flex-1">
        <h2 className="progress-card-heading text-base">My Progress</h2>
        {subtitle !== null ? (
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        ) : showCount ? (
          <p className="mt-1.5 text-sm text-slate-600">
            <span className="progress-number">{count}</span>
            <span className="font-medium"> Duas Memorised</span>
          </p>
        ) : null}
      </div>
      <span className="shrink-0 text-slate-400/90" aria-hidden>
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </Link>
  );
}
