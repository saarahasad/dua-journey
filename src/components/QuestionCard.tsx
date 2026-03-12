"use client";

import { useState } from "react";
import type { Question } from "@/lib/data";
import { TextWithBold } from "./TextWithBold";

interface QuestionCardProps {
  question: Question;
}

export function QuestionCard({ question }: QuestionCardProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="rounded-2xl p-5">
      <TextWithBold
        text={question.question}
        as="p"
        className="text-lg font-medium text-black"
      />
      <div className="mt-3">
        <button
          onClick={() => setRevealed(!revealed)}
          className="tap-scale min-h-touch w-full rounded-xl bg-sage-100 px-4 py-3 text-sage-700 transition-colors hover:bg-sage-200"
        >
          {revealed ? "Hide Answer" : "Reveal Answer"}
        </button>
        {revealed && (
          <div className="mt-3 space-y-2 rounded-lg bg-sage-50 p-4">
            <TextWithBold
              text={question.answer}
              as="p"
              className="font-medium text-black"
            />
            <TextWithBold
              text={question.explanation}
              as="p"
              className="text-sm text-sage-600"
            />
          </div>
        )}
      </div>
    </div>
  );
}
