// store/toastStore.js
import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading';

interface ToastState {
  showToast: (type: ToastType, message: string, description?: string) => void;
}

const toastCache = new Map<string, number>();
const DEDUPE_WINDOW = 1000;

export const useToastStore = create<ToastState>()((set) => ({
  showToast: (type, message, description) => {
    const key = `${type}-${message}`;
    const now = Date.now();
    const lastShown = toastCache.get(key);
    
    // Si le même toast a été montré il y a moins de 1 seconde, ignorer
    if (lastShown && now - lastShown < DEDUPE_WINDOW) {
      console.log('[DEV] Toast deduplicated:', message);
      return;
    }
    
    toastCache.set(key, now);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('show-toast', {
          detail: { type, message, description },
        })
      );
    }
  },
}));