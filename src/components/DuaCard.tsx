import Link from "next/link";
import type { Dua } from "@/lib/data";
import { ProgressBadge } from "./ProgressBadge";
import { TextWithBold } from "./TextWithBold";

export function DuaCard({
  dua,
  isMemorised,
  onUnmark,
  noGlow,
}: {
  dua: Dua;
  isMemorised?: boolean;
  onUnmark?: () => void;
  /** When true, use flat shadow (no glow) – e.g. on progress page */
  noGlow?: boolean;
}) {
  return (
    <div className={noGlow ? "card-overlay-no-glow p-5" : "card-overlay p-5"}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-black">{dua.title}</h2>
          <TextWithBold
            text={dua.intro}
            className="mt-1 text-sm text-sage-600 line-clamp-2"
          />
        </div>
        {isMemorised && (
          <div className="flex shrink-0 flex-col items-end gap-0.5">
            <ProgressBadge />
            {onUnmark && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onUnmark();
                }}
                className="tap-scale text-xs text-sage-500 underline decoration-dotted underline-offset-1 hover:text-sage-700"
              >
                Unmark
              </button>
            )}
          </div>
        )}
      </div>
      <Link
        href={`/dua/${dua.id}`}
        className="tap-scale mt-4 flex min-h-[48px] items-center justify-center rounded-xl bg-[#e4dbe2] text-slate-900 transition-opacity hover:opacity-90 active:scale-[0.99]"
      >
        Begin Journey
      </Link>
    </div>
  );
}
