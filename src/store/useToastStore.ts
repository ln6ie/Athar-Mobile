// متجر الإشعارات المنبثقة - إظهار وإخفاء رسائل التوجيه
import { create } from 'zustand';

interface ToastState {
  visible: boolean;
  message: string;
  show: (message: string) => void;
  hide: () => void;
}

export const useToastStore = create<ToastState>((set) => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  
  return {
    visible: false,
    message: '',
    show: (message) => {
      if (timer) clearTimeout(timer);
      set({ visible: true, message });
      
      timer = setTimeout(() => {
        set({ visible: false });
      }, 3500);
    },
    hide: () => {
      if (timer) clearTimeout(timer);
      set({ visible: false });
    },
  };
});
