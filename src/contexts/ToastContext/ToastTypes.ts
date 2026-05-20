export type ToastType = "info" | "success" | "warning" | "error";

export interface ToastItem {
    id: number;
    message: string;
    type: ToastType;
    duration: number;
};

export interface ToastContextValue {
    info: (msg: string, duration?: number) => void;
    success: (msg: string, duration?: number) => void;
    warning: (msg: string, duration?: number) => void;
    error: (msg: string, duration?: number) => void;
};

export interface ToastViewportProps {
  toasts: ToastItem[];
  removeToast: (id: number) => void;
}
