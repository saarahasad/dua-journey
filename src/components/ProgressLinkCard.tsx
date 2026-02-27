"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getMemorisedIds } from "@/lib/localStorage";

export function ProgressLinkCard() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    setCount(getMemorisedIds().length);
  }, []);

  return (
    <Link
      href="/progress"
      className="tap-scale flex items-center justify-between gap-4 rounded-2xl border border-[#d4c8cb] bg-[#e4dbe2]/50 p-5 shadow-[0_4px_16px_rgba(136,107,107,0.12)] backdrop-blur-sm transition-all duration-300 ease-in-out hover:bg-[#e4dbe2]/70 hover:shadow-[0_8px_24px_rgba(136,107,107,0.15)] active:scale-[0.99]"
    >
      <div className="min-w-0 flex-1">
        <h2 className="text-lg font-semibold text-black">My progress</h2>
        <p className="mt-1 text-sm text-sage-600">
          {count === null
            ? "View memorised duas"
            : count === 0
              ? "No duas memorised yet — start your journey"
              : `${count} dua${count === 1 ? "" : "s"} memorised`}
        </p>
      </div>
      <span className="shrink-0 text-2xl text-sage-400" aria-hidden>
        →
      </span>
    </Link>
  );
}
