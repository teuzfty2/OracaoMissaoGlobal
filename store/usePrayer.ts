import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type PrayerHistoryItem = {
  id: string;
  hours: number;
  minutes: number;
  type: "adicionado" | "editado";
  timestamp: number;
};

type PrayerState = {
  totalMinutes: number;
  history: PrayerHistoryItem[];
  addTime: (hours: number, minutes: number, type?: "adicionado" | "editado") => void;
  clearHistory: () => void;
};

export const usePrayer = create<PrayerState>()(
  persist(
    (set) => ({
      totalMinutes: 0,
      history: [],

      addTime: (hours, minutes, type = "adicionado") => {
        const addedMinutes = (hours * 60) + minutes;
        
        set((state) => {
          const newItem: PrayerHistoryItem = {
            id: Math.random().toString(36).substring(2, 9),
            hours,
            minutes,
            type,
            timestamp: Date.now(),
          };

          return {
            totalMinutes: state.totalMinutes + addedMinutes,
            history: [newItem, ...state.history].slice(0, 50), // Mantém os últimos 50 registros
          };
        });
      },

      clearHistory: () => set({ totalMinutes: 0, history: [] }),
    }),
    {
      name: "prayer-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);