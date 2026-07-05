import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GamificationState, UserRole } from "@/types";
import { calculateLevel } from "@/lib/utils";

interface AppState {
  isOnline: boolean;
  userRole: UserRole;
  gamification: GamificationState;
  currentLessonId: string | null;
  darkMode: boolean;
  setOnline: (online: boolean) => void;
  setUserRole: (role: UserRole) => void;
  setCurrentLesson: (id: string | null) => void;
  toggleDarkMode: () => void;
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  incrementStreak: () => void;
  unlockLesson: (lessonId: string) => void;
  earnBadge: (badge: GamificationState["badges"][0]) => void;
}

const defaultGamification: GamificationState = {
  xp: 0,
  coins: 0,
  level: 1,
  streak: 0,
  last_active_date: new Date().toISOString().split("T")[0],
  badges: [],
  unlocked_lessons: ["alphabet-a", "phonics-cvc-a"],
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isOnline: true,
      userRole: "student",
      gamification: defaultGamification,
      currentLessonId: null,
      darkMode: false,

      setOnline: (online) => set({ isOnline: online }),
      setUserRole: (role) => set({ userRole: role }),
      setCurrentLesson: (id) => set({ currentLessonId: id }),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

      addXP: (amount) =>
        set((s) => {
          const xp = s.gamification.xp + amount;
          return {
            gamification: {
              ...s.gamification,
              xp,
              level: calculateLevel(xp),
            },
          };
        }),

      addCoins: (amount) =>
        set((s) => ({
          gamification: {
            ...s.gamification,
            coins: s.gamification.coins + amount,
          },
        })),

      incrementStreak: () =>
        set((s) => {
          const today = new Date().toISOString().split("T")[0];
          const lastActive = s.gamification.last_active_date;
          let streak = s.gamification.streak;

          if (lastActive !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split("T")[0];
            streak = lastActive === yesterdayStr ? streak + 1 : 1;
          }

          return {
            gamification: {
              ...s.gamification,
              streak,
              last_active_date: today,
            },
          };
        }),

      unlockLesson: (lessonId) =>
        set((s) => ({
          gamification: {
            ...s.gamification,
            unlocked_lessons: s.gamification.unlocked_lessons.includes(lessonId)
              ? s.gamification.unlocked_lessons
              : [...s.gamification.unlocked_lessons, lessonId],
          },
        })),

      earnBadge: (badge) =>
        set((s) => {
          if (s.gamification.badges.some((b) => b.id === badge.id)) return s;
          return {
            gamification: {
              ...s.gamification,
              badges: [...s.gamification.badges, badge],
            },
          };
        }),
    }),
    { name: "gigalearn-store" },
  ),
);

export function useGamification() {
  return useAppStore((s) => s.gamification);
}
