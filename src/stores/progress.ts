import { defineStore } from "pinia";
import { ref, watch, onUnmounted } from "vue";

export const useProgressStore = defineStore("progress", () => {
  const xp = ref(parseInt(localStorage.getItem("xp") || "0"));
  const level = ref(parseInt(localStorage.getItem("level") || "1"));
  const showLevelUpModal = ref(false);

  const stats = ref({
    totalXP: 0,
    maxLevel: 1,
    timeSpent: 0, // в секундах
    timerTime: 0, // в секундах
    musicPlays: 0,
  });

  watch(xp, (newXp) => localStorage.setItem("xp", newXp.toString()));
  watch(level, (newLevel) =>
    localStorage.setItem("level", newLevel.toString()),
  );

  watch(
    stats,
    (newStats) => {
      localStorage.setItem("stats", JSON.stringify(newStats));
    },
    { deep: true },
  );

  // Загрузка статистики
  const loadStats = () => {
    const saved = localStorage.getItem("stats");
    if (saved) {
      const savedStats = JSON.parse(saved);
      stats.value = { ...stats.value, ...savedStats };
    }
  };

  loadStats();

  // Таймер для общего времени в приложении
  const timeInterval = setInterval(() => {
    stats.value.timeSpent++;
  }, 1000 * 60);

  onUnmounted(() => {
    clearInterval(timeInterval);
  });

  const getRequiredXP = (lvl: number): number => {
    if (lvl <= 1) return 0;
    if (lvl === 1) return 10;
    return 100 * (((lvl - 1) * lvl) / 2);
  };

  const checkLevelUp = () => {
    const oldLevel = level.value;
    while (xp.value >= getRequiredXP(level.value + 1)) {
      level.value++;
    }
    if (level.value > oldLevel) {
      showLevelUpModal.value = true;
    }
  };

  const addXP = (amount: number) => {
    xp.value += amount;
    stats.value.totalXP = xp.value;
    stats.value.maxLevel = Math.max(stats.value.maxLevel, level.value);
    checkLevelUp();
  };

  const resetProgress = () => {
    xp.value = 0;
    level.value = 1;
    stats.value = {
      totalXP: 0,
      maxLevel: 1,
      timeSpent: 0,
      timerTime: 0,
      musicPlays: 0,
    };
  };

  const exportStats = () => {
    const data = {
      stats: stats.value,
      xp: xp.value,
      level: level.value,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stats.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importStats = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.xp !== undefined) xp.value = data.xp;
          if (data.level !== undefined) level.value = data.level;
          if (data.stats) stats.value = { ...stats.value, ...data.stats };
        } catch (error) {
          console.error("Error importing stats:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  return {
    xp,
    level,
    showLevelUpModal,
    stats,
    getRequiredXP,
    addXP,
    checkLevelUp,
    resetProgress,
    exportStats,
    importStats,
  };
});
