import { create } from "zustand";
import { api } from "@/lib/api";

export type PrayerHistoryItem = {
  id: string;
  hours: number;
  minutes: number;
  type: "adicionado" | "editado";
  timestamp: number;
};

type PrayerState = {
  history: PrayerHistoryItem[];
  totalMinutes: () => number;
  setHistoryFromDatabase: (logs: PrayerHistoryItem[]) => void;
  loadFromDatabase: () => Promise<void>;
  addTime: (hours: number, minutes: number) => Promise<void>;
  removeHistoryItem: (id: string) => Promise<void>;
};

export const usePrayer = create<PrayerState>((set, get) => ({
  history: [],

  totalMinutes: () =>
    get().history.reduce(
      (acc, item) => acc + item.hours * 60 + item.minutes,
      0
    ),

  setHistoryFromDatabase: (logs) => {
    set({ history: logs });
  },

  loadFromDatabase: async () => {
    const response = await api.get("/prayer-logs");
    set({ history: response.data });
  },

  addTime: async (hours, minutes) => {
    const response = await api.post("/prayer-logs", {
      hours,
      minutes,
    });

    const newLog = response.data;

    set((state) => ({
      history: [newLog, ...state.history],
    }));
  },

  removeHistoryItem: async (id) => {
    await api.delete(`/prayer-logs/${id}`);

    set((state) => ({
      history: state.history.filter((item) => item.id !== id),
    }));
  },
}));