import React, { createContext, useState, useContext, ReactNode, useRef } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

type AlertType = 'success' | 'error';

interface AlertState {
  message: string;
  type: AlertType;
}

interface ErrorContextType {
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

const ErrorContext = createContext<ErrorContextType>({
  showError: () => {},
  showSuccess: () => {},
});

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<AlertState | null>(null);
  const timerRef = useRef<number | null>(null);

  const showAlert = (message: string, type: AlertType) => {
    setAlert({ message, type });
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setAlert(null);
      timerRef.current = null;
    }, 4000);
  };

  const showError = (message: string) => showAlert(message, 'error');
  const showSuccess = (message: string) => showAlert(message, 'success');

  const clearAlert = () => {
    setAlert(null);
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <ErrorContext.Provider value={{ showError, showSuccess }}>
      {children}
      {alert && (
        <div
          role="alert"
          className="fixed inset-0 z-[100] flex items-start justify-center pt-4 px-4 pointer-events-none"
        >
          <div className={`flex items-start gap-3 max-w-sm w-full rounded-xl border ${
            alert.type === 'success' ? 'border-emerald-500/30 bg-surface-800' : 'border-red-500/30 bg-surface-800'
          } px-4 py-3 shadow-card animate-slide-up pointer-events-auto`}>
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
              alert.type === 'success' ? 'bg-emerald-500/20' : 'bg-red-500/20'
            }`}>
              {alert.type === 'success' ? (
                <CheckCircle className="text-emerald-400 w-5 h-5" />
              ) : (
                <AlertCircle className="text-red-400 w-5 h-5" />
              )}
            </div>
            <p className="text-slate-200 text-sm leading-relaxed flex-1 min-w-0 pt-0.5">
              {alert.message}
            </p>
            <button
              type="button"
              onClick={clearAlert}
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
