import type { ToastViewportProps } from './ToastTypes';
import { useThemeContext } from '../ThemeContext/UseThemeContext';

export function ToastViewport({ toasts, removeToast }: ToastViewportProps) {
  const { themeType } = useThemeContext();

  const alertStyles = {
    success: 'alert-success',
    error: 'alert-error',
    info: 'alert-info',
    warning: 'alert-warning',
  };

  const progressStyles = {
    dark: {
      success: 'bg-success/70',
      error: 'bg-error/70',
      info: 'bg-info/70',
      warning: 'bg-warning/70',
    },
    light: {
      success: 'bg-base-200/60',
      error: 'bg-base-200/70',
      info: 'bg-base-200/70',
      warning: 'bg-base-200/70',
    },
  };

  const alertType = themeType == 'light' ? '' : 'alert-soft';

    return (
      <div className="toast toast-top top-21 z-50">
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            id={toast.id+""}
            className={`alert ${alertType} ${alertStyles[toast.type]} shadow-sm relative overflow-hidden`}
            onClick={() => removeToast(toast.id)}
          >
            <span>{toast.message}</span>

            <div className={`absolute bottom-0 left-0 h-1 w-full ${progressStyles[themeType][toast.type]} animate-shrink-10s z-51`}></div>
          </div>
        ))}
      </div>
    );
}