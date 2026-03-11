"use client";

import Link from "next/link";
import type { Dua } from "@/lib/data";

interface InlineDuaBlockProps {
  dua: Dua;
}

/** Inline Arabic + translation block to embed between personal list sections. */
export function InlineDuaBlock({ dua }: InlineDuaBlockProps) {
  return (
    <div className="rounded-xl border border-[#984167]/20 bg-[#984167]/6 p-4">
      <p
        className="font-uthmanic text-center text-2xl leading-relaxed text-black"
        dir="rtl"
        lang="ar"
      >
        {dua.arabicFull}
      </p>
      <p className="mt-2 text-center text-base italic leading-relaxed text-black">
        {dua.translationFull}
      </p>
      <Link
        href={`/dua/${dua.id}`}
        className="tap-scale mt-3 block text-center text-sm font-medium text-[#984167] underline decoration-[#984167]/40 underline-offset-2 hover:text-[#7a3552]"
      >
        Learn this dua →
      </Link>
    </div>
  );
}
