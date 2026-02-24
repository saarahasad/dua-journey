"use client";

import { useEffect, useRef } from "react";

interface StepLayoutProps {
  children: React.ReactNode;
  step: number;
  totalSteps: number;
  onNext?: () => void;
  nextLabel?: string;
  showNextButton?: boolean;
}

export function StepLayout({
  children,
  step,
  totalSteps,
  onNext,
  nextLabel = "Next",
  showNextButton = true,
}: StepLayoutProps) {
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [step]);

  return (
    <div className="flex min-h-[calc(100dvh-120px)] flex-col">
      <div ref={topRef} />
      <div className="mx-auto w-full max-w-md flex-1 px-4 pb-24 pt-4">{children}</div>
      {showNextButton && onNext && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-sage-300 bg-white px-4 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div className="mx-auto max-w-md">
            <button
              onClick={onNext}
              className="tap-scale w-full min-h-touch flex items-center justify-center rounded-xl bg-[#e4dbe2] px-6 py-4 text-lg font-medium text-slate-900 transition-all duration-300 ease-in-out hover:opacity-90 active:scale-[0.99]"
            >
              {nextLabel}
            </button>
            <p className="mt-2 text-center text-sm text-sage-500">
              Step {step} of {totalSteps}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
