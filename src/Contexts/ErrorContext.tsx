import React, { createContext, useState, useContext, ReactNode, useRef } from 'react';
import { X } from 'lucide-react';

interface ErrorContextType {
  showError: (message: string) => void;
}

const ErrorContext = createContext<ErrorContextType>({
  showError: () => {},
});

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const showError = (message: string) => {
    setError(message);
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setError(null);
      timerRef.current = null;
    }, 3000);
  };

  const clearError = () => {
    setError(null);
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <ErrorContext.Provider value={{ showError }}>
      {children}
      {error && (
        <div
          role="alert"
          className="fixed inset-0 z-[100] flex items-start justify-center pt-4 px-4 pointer-events-none"
        >
          <div className="flex items-start gap-3 max-w-sm w-full rounded-xl border border-red-500/30 bg-surface-800 px-4 py-3 shadow-card animate-slide-up pointer-events-auto">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/20">
            <span className="text-red-400 text-sm font-bold">!</span>
          </div>
          <p className="text-slate-200 text-sm leading-relaxed flex-1 min-w-0 pt-0.5">
            {error}
          </p>
          <button
            type="button"
            onClick={clearError}
            className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
            aria-label="Fechar"
          >
            <X size={18} strokeWidth={2} />
          </button>
          </div>
        </div>
      )}
    </ErrorContext.Provider>
  );
}

export const useError = () => useContext(ErrorContext);
