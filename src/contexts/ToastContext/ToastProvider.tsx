import { useState, useCallback, useRef, type ReactNode } from 'react';

import { ToastContext } from './ToastContext';
import { ToastViewport } from './ToastViewport';
import type { ToastItem, ToastType, ToastContextValue } from './ToastTypes';

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const removeToast = useCallback((id: number) => {
    setToasts((toasts) =>
      toasts.filter((toast) => toast.id !== id)
    );
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType = "info", duration = 10000) => {
      const id = nextId.current++;
      setToasts((toasts) => ([...toasts, { id, message, type, duration }]));

      setTimeout(() => removeToast(id), duration);
    },
    [removeToast]
  );

  const api: ToastContextValue = {
    info: (msg, d) => addToast(msg, "info", d),
    success: (msg, d) => addToast(msg, "success", d),
    warning: (msg, d) => addToast(msg, "warning", d),
    error: (msg, d) => addToast(msg, "error", d),
  };

  return (
    <ToastContext.Provider value={api}>
      { children }
      <ToastViewport toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}
