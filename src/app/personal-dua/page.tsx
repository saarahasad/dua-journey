"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { getPersonalDuaList, savePersonalDuaList } from "@/lib/personalDuaStorage";
import { getSuggestedDuasForPersonalDua } from "@/lib/data";
import { useToast } from "@/components/ToastProvider";
import { PersonalDuaTextarea } from "@/components/PersonalDuaTextarea";
import { PersonalDuaBlock } from "@/components/PersonalDuaBlock";
import { EssentialDuasIntro } from "@/components/EssentialDuasIntro";
import { DuaCard } from "@/components/DuaCard";

export default function PersonalDuaPage() {
  const [worries, setWorries] = useState("");
  const [goals, setGoals] = useState("");
  const [weaknesses, setWeaknesses] = useState("");
  const [people, setPeople] = useState("");
  const router = useRouter();
  const { showToast } = useToast();

  // Pre-fill from saved list when editing (e.g. from "Edit my list" on the list view)
  useEffect(() => {
    const saved = getPersonalDuaList();
    if (saved) {
      setWorries(saved.worries);
      setGoals(saved.goals);
      setWeaknesses(saved.weaknesses);
      setPeople(saved.people);
    }
  }, []);

  const handleSave = useCallback(() => {
    savePersonalDuaList({ worries, goals, weaknesses, people });
    showToast("Your personal dua list has been saved.");
    router.push("/personal-dua/list");
  }, [worries, goals, weaknesses, people, showToast, router]);

  const hasAnyContent = worries.trim() || goals.trim() || weaknesses.trim() || people.trim();

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-md px-4 pb-24 pt-6">
        <Link
          href="/"
          className="mb-4 inline-block text-sm font-medium text-slate-600 underline decoration-slate-400 underline-offset-2 hover:text-slate-800"
        >
          ← Back
        </Link>
        <h1 className="mb-2 text-xl font-semibold text-slate-800">My Personal Dua List</h1>
        <p className="mb-8 text-sm text-slate-600">
          Reflect on each section below and write from the heart. Your answers become a personal list to turn into duas.
        </p>

        {/* Section 1: Worries */}
        <section className="card-overlay mb-8 p-5">
          <h2 className="text-lg font-semibold text-slate-800">1. What is your biggest worry?</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Reflect on the main source of anxiety or difficulty in your life right now.
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-600">
            <li>What problem do you find yourself thinking about again and again?</li>
            <li>What situation causes you stress, fear, or sadness?</li>
          </ul>
          <p className="mt-3 text-sm text-slate-600">This could be related to:</p>
          <ul className="mt-1 list-inside list-disc space-y-0.5 text-sm text-slate-600">
            <li>Your children — their faith, character, education, or future</li>
            <li>Your marriage — misunderstandings, emotional distance, or lack of peace in the home</li>
            <li>Financial burdens — debt, job pressure, or business difficulties</li>
            <li>Personal struggles — uncertainty about the future, loneliness, or feeling overwhelmed</li>
          </ul>
          <p className="mt-3 text-sm text-slate-600">
            Write these worries honestly and turn them into sincere duas asking Allah for relief, guidance, and ease.
          </p>
          <PersonalDuaTextarea
            id="worries"
            value={worries}
            onChange={setWorries}
            placeholder="Write your worries and turn them into duas..."
          />
        </section>

        {/* Section 2: Goals */}
        <section className="card-overlay mb-8 p-5">
          <h2 className="text-lg font-semibold text-slate-800">2. What are your goals, dreams, and wishes?</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Think about the things you truly hope Allah will grant you in your life. These can include both spiritual goals and worldly goals.
          </p>
          <p className="mt-2 text-sm font-medium text-slate-700">Spiritual goals may include:</p>
          <ul className="list-inside list-disc space-y-0.5 text-sm text-slate-600">
            <li>memorising the Qur&apos;an</li>
            <li>improving focus and sincerity in salah</li>
            <li>becoming more consistent in worship</li>
            <li>strengthening your connection with Allah</li>
            <li>becoming a better parent, spouse, or person</li>
          </ul>
          <p className="mt-2 text-sm font-medium text-slate-700">Worldly goals may include:</p>
          <ul className="list-inside list-disc space-y-0.5 text-sm text-slate-600">
            <li>financial stability or increase in halal sustenance</li>
            <li>paying off debts</li>
            <li>success in work, studies, or business</li>
            <li>completing important projects</li>
            <li>clarity in important life decisions</li>
          </ul>
          <p className="mt-3 text-sm text-slate-600">
            Turn these hopes into sincere duas asking Allah for success, barakah, and guidance.
          </p>
          <PersonalDuaTextarea
            id="goals"
            value={goals}
            onChange={setGoals}
            placeholder="Write the things you sincerely hope Allah grants you..."
          />
        </section>

        {/* Section 3: Weaknesses */}
        <section className="card-overlay mb-8 p-5">
          <h2 className="text-lg font-semibold text-slate-800">3. What are your weaknesses?</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Reflect honestly on the areas where you struggle and need improvement. Consider weaknesses in different parts of life.
          </p>
          <p className="mt-2 text-sm font-medium text-slate-700">Physical matters:</p>
          <ul className="list-inside list-disc space-y-0.5 text-sm text-slate-600">
            <li>health struggles</li>
            <li>lack of discipline in eating or exercise</li>
            <li>medical issues you want relief from</li>
          </ul>
          <p className="mt-2 text-sm font-medium text-slate-700">Emotional regulation:</p>
          <ul className="list-inside list-disc space-y-0.5 text-sm text-slate-600">
            <li>anger or frustration</li>
            <li>difficulty controlling emotions</li>
            <li>struggling to stay patient with people</li>
          </ul>
          <p className="mt-2 text-sm font-medium text-slate-700">Financial habits:</p>
          <ul className="list-inside list-disc space-y-0.5 text-sm text-slate-600">
            <li>wasting money</li>
            <li>making poor financial decisions</li>
            <li>struggling with debt</li>
            <li>difficulty giving charity</li>
          </ul>
          <p className="mt-2 text-sm font-medium text-slate-700">Social connections:</p>
          <ul className="list-inside list-disc space-y-0.5 text-sm text-slate-600">
            <li>lacking good friends</li>
            <li>needing righteous companionship</li>
            <li>wanting better influences around you</li>
          </ul>
          <p className="mt-3 text-sm text-slate-600">Ask Allah to help you grow, change, and overcome these weaknesses.</p>
          <PersonalDuaTextarea
            id="weaknesses"
            value={weaknesses}
            onChange={setWeaknesses}
            placeholder="Write the areas of your life where you need Allah's help to improve..."
          />
        </section>

        {/* Section 4: People to pray for */}
        <section className="card-overlay mb-8 p-5">
          <h2 className="text-lg font-semibold text-slate-800">4. Who do you want to make dua for?</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Think about the people in your life and what you wish for them. You can make dua for both those you love and those who cause you difficulty.
          </p>
          <p className="mt-2 text-sm font-medium text-slate-700">Loved ones:</p>
          <ul className="list-inside list-disc space-y-0.5 text-sm text-slate-600">
            <li>parents — health, forgiveness, and high ranks in Paradise</li>
            <li>children — righteousness, love for the Qur&apos;an, and strong faith</li>
            <li>spouse — peace in the marriage, guidance, and well-being</li>
            <li>relatives and friends — health, success, and stability</li>
          </ul>
          <p className="mt-2 text-sm font-medium text-slate-700">People going through hardship:</p>
          <ul className="list-inside list-disc space-y-0.5 text-sm text-slate-600">
            <li>someone struggling with work or finances</li>
            <li>someone facing illness</li>
            <li>someone going through emotional pain</li>
          </ul>
          <p className="mt-2 text-sm font-medium text-slate-700">People who cause stress:</p>
          <p className="mt-1 text-sm text-slate-600">
            Instead of responding with frustration, make dua that Allah grants them guidance, understanding, and improvement.
          </p>
          <p className="mt-3 text-sm text-slate-600">
            Making dua for others is powerful, and the angels make the same dua for you in return.
          </p>
          <PersonalDuaTextarea
            id="people"
            value={people}
            onChange={setPeople}
            placeholder="Write the names or relationships of people you want to pray for..."
          />
        </section>

        {/* Your Personal Dua List */}
        <section className="card-overlay overflow-hidden p-0">
          <div className="border-b border-slate-100 bg-[#984167]/8 px-5 py-4">
            <h2 className="text-lg font-semibold text-slate-800">Your Personal Dua List</h2>
            <p className="mt-1 text-sm text-slate-600">Review and save your list to open it anytime from the home screen.</p>
          </div>
          <div className="max-h-[60vh] overflow-y-auto p-5">
            <div className="space-y-6 text-sm">
              <div className="rounded-xl bg-slate-100 p-4 text-center text-slate-700">
                <EssentialDuasIntro centered />
              </div>
              {worries.trim() && (
                <div>
                  <h3 className="mb-1 font-semibold text-slate-700">Worries & difficulties</h3>
                  <div className="leading-relaxed text-slate-600">
                    <PersonalDuaBlock text={worries} />
                  </div>
                </div>
              )}
              {goals.trim() && (
                <div>
                  <h3 className="mb-1 font-semibold text-slate-700">Goals & wishes</h3>
                  <div className="leading-relaxed text-slate-600">
                    <PersonalDuaBlock text={goals} />
                  </div>
                </div>
              )}
              {weaknesses.trim() && (
                <div>
                  <h3 className="mb-1 font-semibold text-slate-700">Weaknesses to improve</h3>
                  <div className="leading-relaxed text-slate-600">
                    <PersonalDuaBlock text={weaknesses} />
                  </div>
                </div>
              )}
              {people.trim() && (
                <div>
                  <h3 className="mb-1 font-semibold text-slate-700">People to pray for</h3>
                  <div className="leading-relaxed text-slate-600">
                    <PersonalDuaBlock text={people} />
                  </div>
                </div>
              )}
              {!hasAnyContent && (
                <p className="text-slate-500">Fill in the sections above to build your list here.</p>
              )}
            </div>
          </div>
          <div className="border-t border-slate-100 p-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={!hasAnyContent}
              className="tap-scale w-full rounded-xl bg-[#984167] px-4 py-3 font-medium text-white shadow-md transition hover:bg-[#7a3552] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save my list
            </button>
            <Link
              href="/personal-dua/list"
              className="mt-3 block text-center text-sm font-medium text-slate-600 underline decoration-slate-400 underline-offset-2 hover:text-slate-800"
            >
              View saved list →
            </Link>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-2 text-lg font-semibold text-slate-800">Suggested duas to read with your list</h2>
          <p className="mb-4 text-sm text-slate-600">
            When you make personal duas, you can also recite these from the app — for ease, gratitude, forgiveness, and more.
          </p>
          <div className="space-y-3">
            {getSuggestedDuasForPersonalDua(6).map((dua) => (
              <DuaCard key={dua.id} dua={dua} noGlow />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
