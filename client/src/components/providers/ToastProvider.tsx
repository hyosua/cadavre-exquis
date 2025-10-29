'use client';

import { useEffect } from 'react';
import { Toaster, toast } from 'sonner';

export function ToastProvider() {
  useEffect(() => {
    const handleToast = (event: CustomEvent) => {
      const { type, message, description } = event.detail;

      switch (type) {
        case 'success':
          toast.success(message, { description });
          break;
        case 'error':
          toast.error(message, { description });
          break;
        case 'info':
          toast.info(message, { description });
          break;
        case 'warning':
          toast.warning(message, { description });
          break;
        case 'loading':
          toast.loading(message, { description });
          break;
      }
    };

    window.addEventListener('show-toast', handleToast as EventListener);
    return () => window.removeEventListener('show-toast', handleToast as EventListener);
  }, []);

  return (
    <Toaster
        duration={4000}
        richColors={false}
        toastOptions={{
        unstyled: true, // Supprime les styles par défaut de Sonner
        classNames: {
          toast: 'alert flex items-center gap-3 shadow-lg w-full min-w-[300px]',
          title: 'font-semibold text-sm',
          description: 'text-xs opacity-90',
          actionButton: 'btn btn-sm',
          cancelButton: 'btn btn-sm btn-ghost',
          closeButton: 'btn btn-sm btn-circle btn-ghost absolute right-2 top-2',
          
          // Types de toast avec classes DaisyUI
          success: 'alert-success',
          error: 'alert-error',
          warning: 'alert-warning',
          info: 'alert-info',
          loading: 'alert-info',
        },
      }}
    />
  );
}