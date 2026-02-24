import type { WhenToRead } from "@/lib/data";
import { TextWithBold } from "./TextWithBold";

interface WhenToReadSectionProps {
  whenToRead: WhenToRead;
}

export function WhenToReadSection({ whenToRead }: WhenToReadSectionProps) {
  return (
    <div className="space-y-6">
      <div className="card-overlay p-5">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-black">
          <span>🌙</span> In Salah
        </h3>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sage-700">
          {whenToRead.inSalah.map((item, i) => (
            <li key={i}>
              <TextWithBold text={item} />
            </li>
          ))}
        </ul>
      </div>
      <div className="card-overlay p-5">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-black">
          <span>🤲</span> Outside Salah
        </h3>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sage-700">
          {whenToRead.outsideSalah.map((item, i) => (
            <li key={i}>
              <TextWithBold text={item} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
