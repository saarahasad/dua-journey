"use client";

import { useRef, useMemo, useState } from "react";
import { getExamplePersonalList } from "@/lib/personalDuaStorage";
import { getDuasForPersonalSectionExample } from "@/lib/data";
import { PersonalDuaListPdfContent } from "@/components/PersonalDuaListPdfContent";
import { downloadElementAsPdf } from "@/lib/downloadListPdf";
import { useToast } from "@/components/ToastProvider";

/** Button that downloads an example personal dua list PDF (work, family, etc.). */
export function ExamplePdfDownloadButton() {
  const pdfRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const { showToast } = useToast();

  const exampleList = useMemo(() => getExamplePersonalList(), []);
  const exampleRotatedDuas = useMemo(
    () => ({
      worries: getDuasForPersonalSectionExample("worries", 4),
      goals: getDuasForPersonalSectionExample("goals", 4),
      weaknesses: getDuasForPersonalSectionExample("weaknesses", 4),
      people: getDuasForPersonalSectionExample("people", 4),
    }),
    []
  );

  const handleDownload = async () => {
    if (!pdfRef.current) return;
    setBusy(true);
    try {
      await downloadElementAsPdf(pdfRef.current, "example-dua-list.pdf");
      showToast("Example PDF downloaded");
    } catch {
      showToast("Could not create PDF");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div
        ref={pdfRef}
        aria-hidden
        className="fixed left-[-9999px] top-0 z-[-1] overflow-visible"
        style={{ width: 595 }}
      >
        <PersonalDuaListPdfContent list={exampleList} rotatedDuas={exampleRotatedDuas} />
      </div>
      <button
        type="button"
        onClick={handleDownload}
        disabled={busy}
        className="tap-scale w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
      >
        {busy ? "Creating PDF…" : "Download example PDF"}
      </button>
    </>
  );
}
