"use client";

import type { PersonalDuaList } from "@/lib/personalDuaStorage";
import type { Dua } from "@/lib/data";
import { EssentialDuasIntro } from "@/components/EssentialDuasIntro";

function formatSavedDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { dateStyle: "medium" });
  } catch {
    return "";
  }
}

/** Split long paragraphs into smaller chunks so the PDF isn't a wall of text. */
function splitForReadability(text: string): string[] {
  const trimmed = text.replace(/^[\-*•]\s*/, "• ").trim();
  if (!trimmed) return [];
  const maxChars = 200;
  const sentences = trimmed.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let current = "";
  for (const s of sentences) {
    if (current.length + s.length + 1 <= maxChars && current.length > 0) {
      current += " " + s;
    } else {
      if (current) chunks.push(current);
      current = s;
    }
  }
  if (current) chunks.push(current);
  // If any chunk is still too long (no sentence breaks), split by length at spaces
  const result: string[] = [];
  for (const c of chunks) {
    if (c.length <= maxChars) {
      result.push(c);
    } else {
      let rest = c;
      while (rest.length > maxChars) {
        const slice = rest.slice(0, maxChars);
        const lastSpace = slice.lastIndexOf(" ");
        const breakAt = lastSpace > maxChars / 2 ? lastSpace : maxChars;
        result.push(rest.slice(0, breakAt).trim());
        rest = rest.slice(breakAt).trim();
      }
      if (rest) result.push(rest);
    }
  }
  return result.length > 0 ? result : [trimmed];
}

function SectionBlock({
  title,
  content,
  children,
}: {
  title: string;
  content: string;
  children?: React.ReactNode;
}) {
  const lines = content.trim().split(/\n/).map((l) => l.trim()).filter(Boolean);
  return (
    <div style={{ marginBottom: 40, marginTop: 8 }}>
      <h2 style={{ color: "#984167", fontWeight: 600, fontSize: 17, marginBottom: 14, marginTop: 0 }}>
        {title}
      </h2>
      <div style={{ color: "#111", fontSize: 15, lineHeight: 1.85, marginBottom: 20 }}>
        {lines.map((line, i) => {
          const chunks = splitForReadability(line);
          return (
            <div key={i} style={{ marginBottom: 18 }}>
              {chunks.map((chunk, j) => (
                <p key={j} style={{ margin: "0 0 10px 0" }}>
                  {chunk}
                </p>
              ))}
            </div>
          );
        })}
      </div>
      {children}
    </div>
  );
}

function DuaBlockPdf({ dua }: { dua: Dua }) {
  return (
    <div
      style={{
        border: "1px solid rgba(152, 65, 103, 0.12)",
        borderRadius: 12,
        background: "rgba(152, 65, 103, 0.05)",
        padding: 20,
        marginBottom: 20,
      }}
    >
      <p
        style={{
          fontFamily: "serif",
          fontSize: 20,
          textAlign: "center",
          color: "#111",
          lineHeight: 1.8,
          margin: 0,
          direction: "rtl",
        }}
        dir="rtl"
        lang="ar"
      >
        {dua.arabicFull}
      </p>
      <p
        style={{
          fontSize: 15,
          textAlign: "center",
          fontStyle: "italic",
          color: "#111",
          lineHeight: 1.6,
          margin: "16px 0 0 0",
        }}
      >
        {dua.translationFull}
      </p>
    </div>
  );
}

interface PersonalDuaListPdfContentProps {
  list: PersonalDuaList;
  rotatedDuas: {
    worries: Dua[];
    goals: Dua[];
    weaknesses: Dua[];
    people: Dua[];
  };
}

/** Renders the full list + suggested duas for PDF capture. Fixed width for A4. */
export function PersonalDuaListPdfContent({ list, rotatedDuas }: PersonalDuaListPdfContentProps) {
  return (
    <div
      className="personal-dua-pdf-content font-uthmanic"
      style={{
        width: 595,
        padding: 48,
        background: "#fff",
        color: "#111",
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ fontSize: 26, fontWeight: 700, color: "#111", margin: "0 0 10px 0" }}>
        My Dua List
      </h1>
      {list.savedAt ? (
        <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 32px 0" }}>
          Saved {formatSavedDate(list.savedAt)}
        </p>
      ) : (
        <div style={{ marginBottom: 28 }} />
      )}

      <div
        style={{
          background: "#f1f5f9",
          borderRadius: 12,
          padding: 24,
          marginBottom: 36,
          fontSize: 14,
          lineHeight: 1.7,
        }}
      >
        <EssentialDuasIntro centered />
      </div>

      {list.worries.trim() && (
        <SectionBlock title="Worries & difficulties" content={list.worries}>
          {rotatedDuas.worries.length > 0 && (
            <>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 14, marginTop: 8, letterSpacing: "0.05em" }}>
                DUA TO RECITE
              </p>
              {rotatedDuas.worries.map((dua) => (
                <DuaBlockPdf key={dua.id} dua={dua} />
              ))}
            </>
          )}
        </SectionBlock>
      )}

      {list.goals.trim() && (
        <SectionBlock title="Goals & wishes" content={list.goals}>
          {rotatedDuas.goals.length > 0 && (
            <>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 14, marginTop: 8, letterSpacing: "0.05em" }}>
                DUA TO RECITE
              </p>
              {rotatedDuas.goals.map((dua) => (
                <DuaBlockPdf key={dua.id} dua={dua} />
              ))}
            </>
          )}
        </SectionBlock>
      )}

      {list.weaknesses.trim() && (
        <SectionBlock title="Weaknesses to improve" content={list.weaknesses}>
          {rotatedDuas.weaknesses.length > 0 && (
            <>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 14, marginTop: 8, letterSpacing: "0.05em" }}>
                DUA TO RECITE
              </p>
              {rotatedDuas.weaknesses.map((dua) => (
                <DuaBlockPdf key={dua.id} dua={dua} />
              ))}
            </>
          )}
        </SectionBlock>
      )}

      {list.people.trim() && (
        <SectionBlock title="People to pray for" content={list.people}>
          {rotatedDuas.people.length > 0 && (
            <>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 14, marginTop: 8, letterSpacing: "0.05em" }}>
                DUA TO RECITE
              </p>
              {rotatedDuas.people.map((dua) => (
                <DuaBlockPdf key={dua.id} dua={dua} />
              ))}
            </>
          )}
        </SectionBlock>
      )}

      <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 48, paddingTop: 24, textAlign: "center" }}>
        Indeed, I am near — When My servants ask about Me
      </p>
    </div>
  );
}
