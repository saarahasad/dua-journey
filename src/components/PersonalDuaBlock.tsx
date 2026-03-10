"use client";

/** Match bullet: - or * (or • for existing content) */
const BULLET_PREFIX = /^[\-*•]\s*/;

/** Renders personal list content with bullet support: lines starting with • - * or comma-separated lines become bullets. */
export function PersonalDuaBlock({ text }: { text: string }) {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const lines = trimmed.split(/\n/).map((l) => l.trim()).filter(Boolean);
  const items: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (BULLET_PREFIX.test(line)) {
      const bulletItems: string[] = [];
      while (i < lines.length && BULLET_PREFIX.test(lines[i])) {
        bulletItems.push(lines[i].replace(BULLET_PREFIX, "").trim() || lines[i]);
        i++;
      }
      items.push(
        <ul key={items.length} className="list-inside list-disc space-y-0.5 pl-1">
          {bulletItems.map((item, j) => (
            <li key={j}>{item}</li>
          ))}
        </ul>
      );
      continue;
    }
    if (line.includes(", ")) {
      const parts = line.split(/,\s*/).map((p) => p.trim()).filter(Boolean);
      if (parts.length > 1) {
        items.push(
          <ul key={items.length} className="list-inside list-disc space-y-0.5 pl-1">
            {parts.map((part, j) => (
              <li key={j}>{part}</li>
            ))}
          </ul>
        );
        i++;
        continue;
      }
    }
    items.push(
      <p key={items.length} className="leading-relaxed">
        {line}
      </p>
    );
    i++;
  }

  return <div className="space-y-2">{items}</div>;
}
