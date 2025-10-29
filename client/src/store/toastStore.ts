// store/toastStore.js
import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading';

interface ToastState {
  showToast: (type: ToastType, message: string, description?: string) => void;
}

export const useToastStore = create<ToastState>()((set) => ({
  showToast: (type, message, description) => {
    // Cette fonction sera appelée depuis n'importe où dans l'app
    // L'émission réelle du toast se fera via le ToastProvider
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('show-toast', {
          detail: { type, message, description },
        })
      );
    }
  },
}));