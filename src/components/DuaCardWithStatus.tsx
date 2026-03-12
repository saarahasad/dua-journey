"use client";

import { useCallback, useEffect, useState } from "react";
import type { Dua } from "@/lib/data";
import { DuaCard } from "./DuaCard";
import { isMemorised, unmarkAsMemorised } from "@/lib/localStorage";
import { useToast } from "./ToastProvider";

export function DuaCardWithStatus({ dua, number }: { dua: Dua; number?: number }) {
  const [memorised, setMemorised] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    setMemorised(isMemorised(dua.id));
  }, [dua.id]);

  const handleUnmark = useCallback(() => {
    unmarkAsMemorised(dua.id);
    setMemorised(false);
    showToast("Removed from memorised.");
  }, [dua.id, showToast]);

  return (
    <DuaCard dua={dua} isMemorised={memorised} onUnmark={handleUnmark} number={number} />
  );
}
