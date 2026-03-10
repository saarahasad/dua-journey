"use client";

/** Intro text with **keyword** markers for bold. */
export const ESSENTIAL_DUAS_INTRO = `Begin with the **most important duas**

Before asking for your worldly worries, remember that the **greatest need** of every believer is Allah's **forgiveness and protection** in the **Hereafter**.

Start your list with these **essential duas**:

• Ask Allah to **forgive all your sins** — those done knowingly, unknowingly, and out of forgetfulness.
• Ask Allah to erase your **past mistakes** and accept your **repentance**.
• Ask Allah to protect you from the **punishment of Jahannam**, whose punishment is severe and overwhelming.
• Ask Allah to grant you **Jannah**, eternal peace, and safety.
• Ask Allah for the greatest success of all — His **pleasure and closeness to Him** forever.

Remember that every comfort and success in this world is **temporary**, but the success of the Hereafter is **everlasting**. Let your duas reflect your deepest hope: to **meet Allah while He is pleased with you**.`;

function renderWithBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*(?:.+?)\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i}>{p.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}

interface EssentialDuasIntroProps {
  className?: string;
  centered?: boolean;
}

export function EssentialDuasIntro({ className = "", centered }: EssentialDuasIntroProps) {
  return (
    <p
      className={`whitespace-pre-wrap font-medium leading-relaxed ${centered ? "text-center " : ""}${className}`}
    >
      {renderWithBold(ESSENTIAL_DUAS_INTRO)}
    </p>
  );
}
