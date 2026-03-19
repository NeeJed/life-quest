import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { achievements, type Achievement } from "@/shared/utils/achievements";
import { useProgressStore } from "./progress";
import { useTasksStore } from "./tasks";

export const useAchievementsStore = defineStore("achievements", () => {
  const progressStore = useProgressStore();
  const tasksStore = useTasksStore();

  const unlockedAchievements = ref<string[]>(
    JSON.parse(localStorage.getItem("unlockedAchievements") || "[]"),
  );
  const currentAchievement = ref<Achievement | null>(null);
  const achievementQueue = ref<Achievement[]>([]);

  watch(
    unlockedAchievements,
    (newUnlocked) => {
      localStorage.setItem("unlockedAchievements", JSON.stringify(newUnlocked));
    },
    { deep: true },
  );

  const checkAchievements = () => {
    const stats = {
      totalTasks: tasksStore.tasks.length,
      level: progressStore.level,
      maxTasksInDay: Math.max(
        ...Object.values(tasksStore.completedTasksByDate).map(
          (tasks) => tasks.length,
        ),
        0,
      ),
    };

    achievements.forEach((achievement) => {
      if (
        !unlockedAchievements.value.includes(achievement.id) &&
        achievement.condition(stats)
      ) {
        unlockedAchievements.value.push(achievement.id);
        achievementQueue.value.push(achievement);
      }
    });

    // Показать следующее достижение
    if (!currentAchievement.value && achievementQueue.value.length > 0) {
      currentAchievement.value = achievementQueue.value.shift()!;
    }
  };

  const closeAchievement = () => {
    currentAchievement.value = null;
    // Показать следующее
    if (achievementQueue.value.length > 0) {
      setTimeout(() => {
        currentAchievement.value = achievementQueue.value.shift()!;
      }, 500);
    }
  };

  const exportAchievements = () => {
    const data = {
      unlocked: unlockedAchievements.value,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "achievements.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importAchievements = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          unlockedAchievements.value = data.unlocked || [];
        } catch (error) {
          console.error("Error importing achievements:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  return {
    unlockedAchievements,
    currentAchievement,
    checkAchievements,
    closeAchievement,
    exportAchievements,
    importAchievements,
  };
});
