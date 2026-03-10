"use client";

import { useRef, useCallback } from "react";

interface PersonalDuaTextareaProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  rows?: number;
  className?: string;
}

const BULLET = "• ";

export function PersonalDuaTextarea({
  id,
  value,
  onChange,
  placeholder,
  rows = 5,
  className = "",
}: PersonalDuaTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertBullet = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const before = value.slice(0, start);
    const after = value.slice(end);
    const needsNewline = before.length > 0 && !before.endsWith("\n");
    const insert = needsNewline ? `\n${BULLET}` : BULLET;
    const newValue = before + insert + after;
    onChange(newValue);
    const newPos = start + insert.length;
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(newPos, newPos);
    });
  }, [value, onChange]);

  return (
    <div className="mt-4">
      <p className="mb-2 text-xs text-slate-500">
        Write each item on its own line. Use the <strong>Add bullet</strong> button below to insert a bullet, or start a line with <span className="font-medium text-slate-600">•</span> or <span className="font-medium text-slate-600">-</span> — they will show as a list when you save.
      </p>
      <textarea
        ref={textareaRef}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`min-h-[120px] w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-[#984167]/50 focus:outline-none focus:ring-2 focus:ring-[#984167]/20 ${className}`}
      />
      <button
        type="button"
        onClick={insertBullet}
        className="mt-2 flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
      >
        <span aria-hidden>•</span>
        Add bullet
      </button>
    </div>
  );
}
