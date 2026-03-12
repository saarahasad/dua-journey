"use client";

import { useState } from "react";
import type { Phrase } from "@/lib/data";
import { TextWithBold } from "./TextWithBold";

interface PhraseCardProps {
  phrase: Phrase;
  showTransliteration: boolean;
  onRepeat?: () => void;
  isListenDisabled?: boolean;
}

export function PhraseCard({
  phrase,
  showTransliteration,
  onRepeat,
  isListenDisabled = false,
}: PhraseCardProps) {
  const [meaningRevealed, setMeaningRevealed] = useState(false);

  return (
    <div className="rounded-2xl p-4">
      <p
        className="select-text text-center font-arabic text-3xl leading-loose text-black"
        dir="rtl"
      >
        {phrase.arabic}
      </p>
      {showTransliteration && (
        <TextWithBold
          text={phrase.transliteration}
          as="p"
          className="mt-4 text-center text-lg italic text-sage-600"
        />
      )}
      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={() => setMeaningRevealed(!meaningRevealed)}
          className="tap-scale min-h-touch rounded-xl bg-sage-100 px-4 py-3 text-black transition-colors hover:bg-sage-200"
        >
          {meaningRevealed ? "Hide Meaning" : "Reveal Meaning"}
        </button>
        {meaningRevealed && (
          <TextWithBold
            text={phrase.meaning}
            as="p"
            className="rounded-lg bg-sage-50 p-4 text-center text-sage-700"
          />
        )}
        {onRepeat && (
          <button
            onClick={onRepeat}
            disabled={isListenDisabled}
            className="tap-scale min-h-touch rounded-xl bg-[#e4dbe2] px-4 py-3 text-slate-900 transition-colors hover:bg-[#d9ced6] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Listen
          </button>
        )}
      </div>
    </div>
  );
}
