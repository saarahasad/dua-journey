"use client";

import { createContext, useCallback, useContext, useState } from "react";

type ToastContextType = {
  showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div
          className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-[#e4dbe2] px-6 py-3 text-slate-900 shadow-lg transition-opacity duration-300"
          role="alert"
        >
          {toast}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
