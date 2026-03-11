const STORAGE_KEY = "dua-journey-personal-list";

export interface PersonalDuaList {
  worries: string;
  goals: string;
  weaknesses: string;
  people: string;
  savedAt: string; // ISO date
}

export function getPersonalDuaList(): PersonalDuaList | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as PersonalDuaList;
    return parsed && typeof parsed.worries === "string" ? parsed : null;
  } catch {
    return null;
  }
}

export function savePersonalDuaList(data: Omit<PersonalDuaList, "savedAt">): void {
  const withDate: PersonalDuaList = {
    ...data,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(withDate));
}

export function hasSavedPersonalList(): boolean {
  return getPersonalDuaList() !== null;
}

/** Example list for the sample PDF: a person asking for work, family, health, etc. */
export function getExamplePersonalList(): PersonalDuaList {
  return {
    savedAt: new Date().toISOString(),
    worries: `• My job — grant me barakah in my time and focus. Remove anxiety about deadlines and difficult colleagues. Make my work a means of halal provision and not a cause of stress.
• Family health — protect my parents, spouse, and children from illness. Ease any ongoing health worries and give us all strength.
• Fear of failure — help me trust in Your plan. Turn my fear into reliance on You.`,
    goals: `• Excel at work with honesty and excellence. Open doors for growth and responsibility that benefit my family and the ummah.
• Build a peaceful home. Make my marriage a source of mercy and my children righteous and close to the Qur’an.
• Consistency in worship — Fajr on time, more dhikr, and sincerity in every act.`,
    weaknesses: `• Patience with my children when I’m tired. Help me respond with gentleness, not anger.
• Disconnecting from screens and giving my family quality time.
• Being a people-pleaser — I want to please Allah first and live with confidence.`,
    people: `• My parents — long life in health and iman, forgiveness, and the highest ranks in Jannah.
• My spouse — love, understanding, and a bond that grows in obedience to Allah.
• My children — righteousness, love for the Qur’an, and protection from harm. Make them the coolness of our eyes.
• Colleagues and relatives — guide them and grant them ease. For those who wronged me, grant them guidance and forgive.`,
  };
}
