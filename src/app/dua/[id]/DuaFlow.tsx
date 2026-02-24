"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Dua } from "@/lib/data";
import { StepLayout } from "@/components/StepLayout";
import { PhraseCard } from "@/components/PhraseCard";
import { QuestionCard } from "@/components/QuestionCard";
import { WhenToReadSection } from "@/components/WhenToReadSection";
import { TextWithBold } from "@/components/TextWithBold";
import { AudioPlayer } from "@/components/AudioPlayer";
import { useToast } from "@/components/ToastProvider";
import {
  markAsMemorised,
  unmarkAsMemorised,
  isMemorised,
} from "@/lib/localStorage";
import { getAssetUrl } from "@/lib/basePath";

const TOTAL_STEPS = 8;

interface DuaFlowProps {
  dua: Dua;
}

export function DuaFlow({ dua }: DuaFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [rebuildIndex, setRebuildIndex] = useState(0);
  const [alreadyMemorised, setAlreadyMemorised] = useState(false);
  const [isPhraseAudioPlaying, setIsPhraseAudioPlaying] = useState(false);
  const [phraseLoopCount, setPhraseLoopCount] = useState<1 | 3 | 5 | 10>(1);
  const [fullAudioLoopCount, setFullAudioLoopCount] = useState<
    1 | 3 | 5 | 10
  >(1);
  const touchStartRef = useRef(0);
  const phraseAudioRef = useRef<HTMLAudioElement>(null);
  const phraseStopTimeoutRef = useRef<NodeJS.Timeout | number | null>(null);
  const phraseLoopRemainingRef = useRef(0);
  const { showToast } = useToast();

  useEffect(() => {
    setAlreadyMemorised(isMemorised(dua.id));
  }, [dua.id, step]);

  const nextStep = useCallback(() => {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }, []);

  const prevStep = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  // When phrase changes or we leave phrase step, stop phrase audio
  useEffect(() => {
    phraseAudioRef.current?.pause();
    setIsPhraseAudioPlaying(false);
    phraseLoopRemainingRef.current = 0;
    if (phraseStopTimeoutRef.current) {
      clearTimeout(phraseStopTimeoutRef.current);
      phraseStopTimeoutRef.current = null;
    }
  }, [step, phraseIndex]);

  const handleListenPhrase = useCallback(() => {
    const phrase = dua.phrases[phraseIndex];
    if (!phrase) return;
    const start = phrase.startTime!;
    const end = phrase.endTime!;
    if (typeof start !== "number" || typeof end !== "number") return;
    const a = phraseAudioRef.current;
    if (!a) return;
    const durationMs = (end - start) * 1000;

    const playSegment = () => {
      const audio = phraseAudioRef.current;
      if (!audio) return;
      audio.currentTime = start;
      audio.play();
      phraseStopTimeoutRef.current = window.setTimeout(
        () => {
          audio.pause();
          phraseLoopRemainingRef.current -= 1;
          if (phraseLoopRemainingRef.current > 0) {
            playSegment();
          } else {
            setIsPhraseAudioPlaying(false);
          }
        },
        durationMs
      );
    };

    phraseLoopRemainingRef.current = phraseLoopCount;
    setIsPhraseAudioPlaying(true);
    playSegment();
  }, [dua.phrases, phraseIndex, phraseLoopCount]);

  const handleMarkMemorised = () => {
    markAsMemorised(dua.id);
    setAlreadyMemorised(true);
    showToast("You have memorised this dua.");
    router.push(`/category/${dua.categoryId}`);
  };

  const handleUnmarkMemorised = () => {
    unmarkAsMemorised(dua.id);
    setAlreadyMemorised(false);
    showToast("Removed from memorised.");
  };

  const BackLink = () => (
    <Link
      href={`/category/${dua.categoryId}`}
      className="text-overlay mb-4 inline-block min-h-touch flex items-center gap-1 text-sage-600 hover:text-black"
    >
      ← Back
    </Link>
  );

  // Step 1 - Title Screen
  if (step === 0) {
    return (
      <main className="min-h-screen">
        <div className="mx-auto max-w-md px-4 pb-24 pt-8">
          <BackLink />
          <div className="card-overlay p-6">
            <p
              className="select-text text-center font-arabic text-3xl leading-loose text-black"
              dir="rtl"
            >
              {dua.arabicFull}
            </p>
            <div className="mt-6">
              <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
                <span className="text-sm text-sage-600">Play:</span>
                {([1, 3, 5, 10] as const).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setFullAudioLoopCount(n)}
                    className={`tap-scale min-h-touch rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      fullAudioLoopCount === n
                        ? "bg-[#e4dbe2] text-slate-900"
                        : "bg-white/80 text-sage-600 hover:bg-[#e4dbe2]/50"
                    }`}
                  >
                    {n} {n === 1 ? "time" : "times"}
                  </button>
                ))}
              </div>
              <AudioPlayer
                src={dua.audioUrl ?? getAssetUrl(`/audio/${dua.id}.mp3`)}
                playCount={fullAudioLoopCount}
              />
            </div>
            <label className="mt-6 flex min-h-touch cursor-pointer items-center gap-3 rounded-xl bg-[#e4dbe2]/40 p-3">
              <input
                type="checkbox"
                checked={showTransliteration}
                onChange={(e) => setShowTransliteration(e.target.checked)}
                className="h-5 w-5 rounded accent-[#e4dbe2]"
              />
              <span className="text-slate-700">Show transliteration</span>
            </label>
            {showTransliteration && (
              <TextWithBold
                text={dua.transliterationFull}
                as="p"
                className="mt-4 text-center text-lg italic text-sage-600"
              />
            )}
            <TextWithBold
              text={dua.translationFull}
              as="p"
              className="mt-6 text-center text-black"
            />

          
          </div>
          <br></br>
          <br></br>
          <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-sage-300 bg-white px-4 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
            <div className="mx-auto max-w-md">
              <button
                onClick={nextStep}
                className="tap-scale w-full min-h-touch flex items-center justify-center rounded-xl bg-[#e4dbe2] px-6 py-4 text-lg font-medium text-slate-900 transition-all duration-300 ease-in-out hover:opacity-90 active:scale-[0.99]"
              >
                Begin
              </button>
              <p className="mt-2 text-center text-sm text-sage-500">
                Step 1 of {TOTAL_STEPS}
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Step 2 - Story
  if (step === 1) {
    return (
      <main className="min-h-screen">
        <StepLayout
          step={2}
          totalSteps={TOTAL_STEPS}
          onNext={nextStep}
          nextLabel="Why is it powerful?"
        >
          <BackLink />
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="card-overlay w-full max-w-md p-6">
              <h2 className="text-center text-xl font-semibold text-black ">
                Story Behind the Dua
              </h2>
              <TextWithBold
                text={dua.story}
                as="p"
                className="mt-4 text-center text-black leading-relaxed whitespace-pre-line"
              />
            </div>
          </div>
        </StepLayout>
      </main>
    );
  }

  // Step 3 - Benefits
  if (step === 2) {
    return (
      <main className="min-h-screen">
        <StepLayout
          step={3}
          totalSteps={TOTAL_STEPS}
          onNext={nextStep}
          nextLabel="Let's Memorise"
        >
          <BackLink />
          <div className="space-y-4">
            <h2 className="text-overlay text-center text-xl font-semibold text-black">
              Benefits
            </h2>
            {dua.benefits.map((benefit, i) => (
              <div key={i} className="card-overlay p-5">
                <TextWithBold
                  text={benefit}
                  as="p"
                  className="text-center text-black"
                />
              </div>
            ))}
          </div>
        </StepLayout>
      </main>
    );
  }

  // Step 4 - Phrase by Phrase (with optional swipe)
  if (step === 3) {
    const phrase = dua.phrases[phraseIndex];
    const isLast = phraseIndex === dua.phrases.length - 1;
    const hasPhraseTimes =
      typeof phrase.startTime === "number" &&
      typeof phrase.endTime === "number";

    const handleSwipe = (dir: "left" | "right") => {
      setPhraseIndex((i) => {
        if (dir === "right" && i > 0) return i - 1;
        if (dir === "left" && i < dua.phrases.length - 1) return i + 1;
        return i;
      });
    };

    const onTouchStart = (e: React.TouchEvent) => {
      touchStartRef.current = e.touches[0].clientX;
    };
    const onTouchEnd = (e: React.TouchEvent) => {
      const diff = e.changedTouches[0].clientX - touchStartRef.current;
      if (Math.abs(diff) > 50) handleSwipe(diff > 0 ? "right" : "left");
    };

    return (
      <main className="min-h-screen">
        <div className="mx-auto max-w-md px-4 pb-24 pt-4">
          <BackLink />
          <p className="text-overlay mb-4 text-center text-sm text-sage-500">
            Phrase {phraseIndex + 1} of {dua.phrases.length}
            <span className="ml-2 text-sage-400">• Swipe to navigate</span>
          </p>
          <div
            key={phraseIndex}
            className="transition-opacity duration-300 ease-in-out"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <audio
              ref={phraseAudioRef}
              src={dua.audioUrl ?? getAssetUrl(`/audio/${dua.id}.mp3`)}
              preload="metadata"
              className="sr-only"
              aria-hidden
            />
            {hasPhraseTimes && (
              <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
                <span className="text-sm text-sage-600">Play:</span>
                {([1, 3, 5, 10] as const).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPhraseLoopCount(n)}
                    disabled={isPhraseAudioPlaying}
                    className={`tap-scale min-h-touch rounded-lg px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${
                      phraseLoopCount === n
                        ? "bg-[#e4dbe2] text-slate-900"
                        : "bg-white/80 text-sage-600 hover:bg-[#e4dbe2]/50"
                    }`}
                  >
                    {n} {n === 1 ? "time" : "times"}
                  </button>
                ))}
              </div>
            )}
            <PhraseCard
              phrase={phrase}
              showTransliteration={showTransliteration}
              onRepeat={hasPhraseTimes ? handleListenPhrase : undefined}
              isListenDisabled={isPhraseAudioPlaying}
            />
          </div>
          <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-sage-300 bg-white px-4 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
            <div className="mx-auto max-w-md">
              <button
                onClick={() => {
                  if (isLast) nextStep();
                  else setPhraseIndex((i) => i + 1);
                }}
                className="tap-scale w-full min-h-touch flex items-center justify-center rounded-xl bg-[#e4dbe2] px-6 py-4 text-lg font-medium text-slate-900 transition-all duration-300 ease-in-out hover:opacity-90 active:scale-[0.99]"
              >
                {isLast ? "Next" : "Next Phrase"}
              </button>
              <p className="mt-2 text-center text-sm text-sage-500">
                Step 4 of {TOTAL_STEPS}
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Step 5 - Rebuild Mode
  if (step === 4) {
    const revealedPhrases = dua.phrases.slice(0, rebuildIndex + 1);
    const isComplete = rebuildIndex >= dua.phrases.length - 1;

    return (
      <main className="min-h-screen">
        <StepLayout
          step={5}
          totalSteps={TOTAL_STEPS}
          onNext={isComplete ? nextStep : () => setRebuildIndex((i) => i + 1)}
          nextLabel={isComplete ? "Next" : "Reveal Next Phrase"}
        >
          <BackLink />
          <div className="space-y-4">
            <h2 className="text-overlay text-center text-xl font-semibold text-black">
              Rebuild the Dua
            </h2>
            <p className="text-overlay text-sage-600">
              Think of the next phrase, then reveal to check.
            </p>
            <div className="card-overlay p-6 text-center">
              <p
                className="select-text font-arabic text-3xl leading-loose text-black"
                dir="rtl"
              >
                {revealedPhrases.map((p, i) => {
                  const isLatest = i === revealedPhrases.length - 1;
                  return (
                    <span key={i}>
                      <span className={isLatest ? "font-bold text-[#136207]" : "font-normal"}>
                        {p.arabic}
                      </span>
                      {i < revealedPhrases.length - 1 ? " " : null}
                    </span>
                  );
                })}
              </p>
            </div>
          </div>
        </StepLayout>
      </main>
    );
  }

  // Step 6 - Full Dua View
  if (step === 5) {
    return (
      <main className="min-h-screen">
        <StepLayout
          step={6}
          totalSteps={TOTAL_STEPS}
          onNext={nextStep}
          nextLabel="Reflect"
        >
          <BackLink />
          <div className="card-overlay space-y-6 p-6 text-center">
            <p
              className="select-text font-arabic text-3xl leading-loose text-black"
              dir="rtl"
            >
              {dua.arabicFull}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-sm text-sage-600">Play:</span>
              {([1, 3, 5, 10] as const).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setFullAudioLoopCount(n)}
                  className={`tap-scale min-h-touch rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    fullAudioLoopCount === n
                      ? "bg-[#e4dbe2] text-slate-900"
                      : "bg-white/80 text-sage-600 hover:bg-[#e4dbe2]/50"
                  }`}
                >
                  {n} {n === 1 ? "time" : "times"}
                </button>
              ))}
            </div>
            <AudioPlayer
              src={dua.audioUrl ?? getAssetUrl(`/audio/${dua.id}.mp3`)}
              playCount={fullAudioLoopCount}
            />

            <TextWithBold
              text={dua.transliterationFull}
              as="p"
              className="text-lg italic text-sage-600"
            />
            <TextWithBold
              text={dua.translationFull}
              as="p"
              className="text-black"
            />
          </div>
        </StepLayout>
      </main>
    );
  }

  // Step 7 - 3 Questions
  if (step === 6) {
    return (
      <main className="min-h-screen">
        <StepLayout
          step={7}
          totalSteps={TOTAL_STEPS}
          onNext={nextStep}
          nextLabel="Apply This Dua"
        >
          <BackLink />
          <div className="space-y-6">
            <h2 className="text-overlay text-center text-xl font-semibold text-black">
              Reflection Questions
            </h2>
            {dua.questions.map((q, i) => (
              <QuestionCard key={i} question={q} />
            ))}
          </div>
          <br /> <br />
        </StepLayout>
      </main>
    );
  }

  // Step 8 - When to Read
  if (step === 7) {
    return (
      <main className="min-h-screen">
        <StepLayout
          step={8}
          totalSteps={TOTAL_STEPS}
          onNext={
            alreadyMemorised ? handleUnmarkMemorised : handleMarkMemorised
          }
          nextLabel={
            alreadyMemorised ? "Unmark Memorised" : "Mark as Memorised"
          }
          showNextButton={true}
        >
          <BackLink />
          <div className="space-y-6">
            <h2 className="text-overlay text-center text-xl font-semibold text-black">
              When You Can Read This Dua
            </h2>
            <WhenToReadSection whenToRead={dua.whenToRead} />
            {alreadyMemorised && (
              <p className="text-overlay text-sm text-sage-500">
                You’ve memorised this dua. Tap above to unmark if you’d like to
                practise again.
              </p>
            )}
          </div>
        </StepLayout>
      </main>
    );
  }

  return null;
}
