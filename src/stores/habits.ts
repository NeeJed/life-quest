import { defineStore } from "pinia";
import { ref, watch } from "vue";

export interface Habit {
  id: string;
  name: string;
  type: "daily" | "weekly" | "tracker";
  streak: number;
  maxStreak: number;
  lastCompleted: Date | null;
  createdAt: Date;
  completedDates: string[]; // Для tracker: даты выполнения
}

export const useHabitsStore = defineStore("habits", () => {
  const habits = ref<Habit[]>(
    JSON.parse(localStorage.getItem("habits") || "[]"),
  );

  watch(
    habits,
    (newHabits) => {
      localStorage.setItem("habits", JSON.stringify(newHabits));
    },
    { deep: true },
  );

  const addHabit = (name: string, type: "daily" | "weekly" | "tracker") => {
    habits.value.push({
      id: Date.now().toString(),
      name,
      type,
      streak: 0,
      maxStreak: 0,
      lastCompleted: null,
      createdAt: new Date(),
      completedDates: [],
    });
  };

  const deleteHabit = (id: string) => {
    habits.value = habits.value.filter((habit) => habit.id !== id);
  };

  const isHabitCompletedToday = (habit: Habit) => {
    const today = new Date().toISOString().split("T")[0]!;
    return habit.completedDates.includes(today);
  };

  const getHabitBonusXP = () => {
    let totalBonus = 0;
    habits.value.forEach((habit) => {
      if (habit.streak > 0) {
        totalBonus += 1;
        if (habit.streak >= 7) totalBonus += 1;
        if (habit.streak >= 30) totalBonus += 2;
      }
    });
    return totalBonus;
  };

  return {
    habits,
    addHabit,
    deleteHabit,
    isHabitCompletedToday,
    getHabitBonusXP,
  };
});
