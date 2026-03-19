import { defineStore } from "pinia";
import { ref, computed, watch, onUnmounted } from "vue";
import { useAudio } from "@/shared/hooks/useAudio";
import { achievements, type Achievement } from "@/shared/utils/achievements";
import { locations } from "@/shared/utils/locations";

export interface Task {
  id: number;
  title: string;
  description?: string;
  tag?: string;
  deadline?: Date;
  priority: "низкий" | "средний" | "высокий" | "максимальный";
  difficulty: "низкая" | "средняя" | "высокая";
  createdAt: Date;
  completed: boolean;
}

export const useGameStore = defineStore("game", () => {
  const currentArt = ref(
    localStorage.getItem("currentArt") ||
      "/images/backgrounds/upscaled/cozy-room.webp",
  );
  const setCurrentArt = (art: string) => {
    currentArt.value = art;
    localStorage.setItem("currentArt", art);
  };

  const masterVolume = ref(
    parseFloat(localStorage.getItem("masterVolume") || "1"),
  );
  const musicVolume = ref(
    parseFloat(localStorage.getItem("musicVolume") || "0.5"),
  );
  const ambientVolume = ref(
    parseFloat(localStorage.getItem("ambientVolume") || "0.3"),
  );
  const interfaceVolume = ref(
    parseFloat(localStorage.getItem("interfaceVolume") || "0.5"),
  );

  watch(masterVolume, (newVol) =>
    localStorage.setItem("masterVolume", newVol.toString()),
  );
  watch(musicVolume, (newVol) =>
    localStorage.setItem("musicVolume", newVol.toString()),
  );
  watch(ambientVolume, (newVol) =>
    localStorage.setItem("ambientVolume", newVol.toString()),
  );
  watch(interfaceVolume, (newVol) =>
    localStorage.setItem("interfaceVolume", newVol.toString()),
  );

  // Загрузка из localStorage
  const loadSettings = () => ({
    hideLeaderboard: JSON.parse(
      localStorage.getItem("hideLeaderboard") || "false",
    ),
    hideInterface: JSON.parse(localStorage.getItem("hideInterface") || "false"),
    hideSounds: JSON.parse(localStorage.getItem("hideSounds") || "false"),
    hideTimers: JSON.parse(localStorage.getItem("hideTimers") || "false"),
    disableMusic: JSON.parse(localStorage.getItem("disableMusic") || "false"),
    disableNotifications: JSON.parse(
      localStorage.getItem("disableNotifications") || "false",
    ),
    optOutLeaderboard: JSON.parse(
      localStorage.getItem("optOutLeaderboard") || "false",
    ),
  });

  const settings = ref(loadSettings());
  const {
    playCompleteSound,
    playLevelUpSound,
    playTimerSound,
    playAchievementSound,
  } = useAudio();

  const xp = ref(parseInt(localStorage.getItem("xp") || "0"));
  const level = ref(parseInt(localStorage.getItem("level") || "1"));
  const showLevelUpModal = ref(false);
  const tasks = ref<Task[]>([]);
  const completedTasksByDate = ref<Record<string, Task[]>>(
    JSON.parse(localStorage.getItem("completedTasksByDate") || "{}"),
  );
  const legendChallenge = ref({
    name: "Великий бегун",
    goal: 10000,
    progress: 0,
  });

  watch(xp, (newXp) => localStorage.setItem("xp", newXp.toString()));
  watch(level, (newLevel) =>
    localStorage.setItem("level", newLevel.toString()),
  );

  const stats = ref({
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    totalXP: 0,
    maxLevel: 1,
    timeSpent: 0, // в секундах
    activeDays: 0,
    bestDayTasks: 0,
    achievementsUnlocked: 0,
    timerTime: 0, // в секундах
    musicPlays: 0,
  });

  const loadStats = () => {
    const saved = localStorage.getItem("stats");
    if (saved) {
      stats.value = { ...stats.value, ...JSON.parse(saved) };
    }
  };

  loadStats();

  watch(
    stats,
    (newStats) => {
      localStorage.setItem("stats", JSON.stringify(newStats));
    },
    { deep: true },
  );

  const timeInterval = setInterval(() => {
    stats.value.timeSpent++;
    console.log("общее время в приложении + 1 минута");
  }, 1000 * 60);

  onUnmounted(() => {
    clearInterval(timeInterval);
  });

  const updateStats = () => {
    stats.value.totalTasks = tasks.value.length;
    stats.value.completedTasks = Object.values(
      completedTasksByDate.value,
    ).flat().length;
    stats.value.overdueTasks = tasks.value.filter(
      (t) => t.deadline && new Date() > t.deadline && !t.completed,
    ).length;
    stats.value.totalXP = xp.value;
    stats.value.maxLevel = Math.max(stats.value.maxLevel, level.value);
    stats.value.achievementsUnlocked = unlockedAchievements.value.length;
    stats.value.bestDayTasks = Math.max(
      stats.value.bestDayTasks,
      ...Object.values(completedTasksByDate.value).map(
        (tasks: any) => tasks.length,
      ),
    );
    stats.value.activeDays = Object.keys(completedTasksByDate.value).length;
  };

  const exportStats = () => {
    const data = {
      stats: stats.value,
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
          stats.value = { ...stats.value, ...data.stats };
          localStorage.setItem("stats", JSON.stringify(stats.value));
        } catch (error) {
          console.error("Error importing stats:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const addTask = (task: Omit<Task, "id" | "completed" | "createdAt">) => {
    // Проверка на максимальный приоритет: только одна задача
    if (task.priority === "максимальный") {
      tasks.value.forEach((t) => {
        if (t.priority === "максимальный") t.priority = "высокий";
      });
    }
    tasks.value.push({
      ...task,
      id: Date.now(),
      completed: false,
      createdAt: new Date(),
    });
    updateStats();
  };

  // Добавлены updateTask и deleteTask
  const updateTask = (
    id: number,
    updates: Partial<Omit<Task, "id" | "createdAt" | "completed">>,
  ) => {
    const task = tasks.value.find((t) => t.id === id);
    if (task) {
      Object.assign(task, updates);
    }
  };

  const deleteTask = (id: number) => {
    const index = tasks.value.findIndex((t) => t.id === id);
    if (index > -1) {
      tasks.value.splice(index, 1);
      updateStats();
    }
  };

  const checkLevelUp = () => {
    const oldLevel = level.value;
    while (xp.value >= getRequiredXP(level.value + 1)) {
      level.value++;
    }
    if (level.value > oldLevel) {
      showLevelUpModal.value = true;
      if (!settings.value.hideSounds) {
        playLevelUpSound();
      }
    }
  };

  const checksAfterXPAdd = () => {
    updateStats();
    checkLevelUp();
    checkAchievements();
    checkLocationUnlocks();
  };

  const completeTask = (id: number) => {
    const task = tasks.value.find((t) => t.id === id);
    if (task) {
      task.completed = true;
      let baseXP = 0;
      if (task.difficulty === "низкая") baseXP = 5;
      else if (task.difficulty === "средняя") baseXP = 10;
      else if (task.difficulty === "высокая") baseXP = 15;

      // Коэффициент за просрочку
      let multiplier = 1;
      if (task.deadline) {
        const now = new Date();
        const diffDays =
          (now.getTime() - task.deadline.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays > 0 && diffDays < 1) multiplier = 0.9;
        else if (diffDays >= 1 && diffDays <= 3) multiplier = 0.7;
        else if (diffDays > 3) multiplier = 0.5;
      }
      xp.value += Math.floor(baseXP * multiplier);

      // Сохранить выполненную задачу по дате
      const dateKey = new Date().toISOString().split("T")[0]!;
      if (!completedTasksByDate.value[dateKey])
        completedTasksByDate.value[dateKey] = [];
      completedTasksByDate.value[dateKey].push(task);
      localStorage.setItem(
        "completedTasksByDate",
        JSON.stringify(completedTasksByDate.value),
      );
      if (!settings.value.hideSounds) {
        playCompleteSound();
      }
      // Повышение уровня, если XP >= требуемый для следующего уровня
      checksAfterXPAdd();
    }
  };

  const toggleHide = (key: keyof typeof settings.value) => {
    settings.value[key] = !settings.value[key];
    localStorage.setItem(key, JSON.stringify(settings.value[key]));
  };

  const resetSettings = () => {
    settings.value = {
      hideLeaderboard: false,
      hideInterface: false,
      hideSounds: false,
      hideTimers: false,
      disableMusic: false,
      disableNotifications: false,
      optOutLeaderboard: false,
    };
    Object.keys(settings.value).forEach((key) => {
      localStorage.setItem(
        key,
        JSON.stringify(settings.value[key as keyof typeof settings.value]),
      );
    });
  };

  const resetProgress = () => {
    xp.value = 0;
    level.value = 1;
    localStorage.removeItem("xp");
    localStorage.removeItem("level");
  };

  // Функция для требуемого XP (по новой логике)
  const getRequiredXP = (lvl: number): number => {
    if (lvl <= 1) return 0;
    if (lvl === 1) return 10;
    return 100 * (((lvl - 1) * lvl) / 2);
  };

  const calculateRemainingTime = (deadline?: Date): string => {
    if (!deadline) return "Без срока";
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    if (diff <= 0) return "Просрочено";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days} д. ${hours} ч. осталось`;
    return `${hours} ч. осталось`;
  };

  const activeTimer = ref<{
    type: "timer" | "stopwatch" | "pomodoro";
    time: number;
    isRunning: boolean;
    interval: number | null;
  } | null>(null);

  const startTimer = (seconds: number) => {
    if (activeTimer.value) clearInterval(activeTimer.value.interval!);
    activeTimer.value = {
      type: "timer",
      time: seconds,
      isRunning: true,
      interval: setInterval(() => {
        if (activeTimer.value!.time > 0) {
          activeTimer.value!.time--;
          xp.value += 0.1;
          checksAfterXPAdd();
        } else {
          clearInterval(activeTimer.value!.interval!);
          activeTimer.value = null;
          console.log(stats.value.timerTime, seconds);
          stats.value.timerTime =
            Number(stats.value.timerTime) + Number(seconds);
          // Звучок завершения
          if (!settings.value.hideSounds) {
            playTimerSound();
          }
        }
      }, 1000),
    };
  };

  const startStopwatch = () => {
    if (activeTimer.value && activeTimer.value.type === "stopwatch") {
      if (activeTimer.value.isRunning) {
        clearInterval(activeTimer.value.interval!);
        activeTimer.value.isRunning = false;
      } else {
        activeTimer.value.interval = setInterval(() => {
          activeTimer.value!.time++;
          xp.value = Number(Number(xp.value + 0.01).toFixed(2));
          checksAfterXPAdd();
        }, 1000);
        activeTimer.value.isRunning = true;
      }
    } else {
      activeTimer.value = {
        type: "stopwatch",
        time: 0,
        isRunning: true,
        interval: setInterval(() => {
          activeTimer.value!.time++;
          xp.value = Number(Number(xp.value + 0.01).toFixed(2));
          checksAfterXPAdd();
        }, 1000),
      };
    }
  };

  const resetStopwatch = () => {
    if (activeTimer.value && activeTimer.value.type === "stopwatch") {
      clearInterval(activeTimer.value.interval!);
      activeTimer.value = null;
    }
  };

  const startPomodoro = () => {
    startTimer(25 * 60); // 25 минут
  };

  const resetPomodoro = () => {
    if (activeTimer.value && activeTimer.value.type === "pomodoro") {
      clearInterval(activeTimer.value.interval!);
      activeTimer.value = null;
    }
  };

  const pauseTimer = () => {
    if (activeTimer.value) {
      clearInterval(activeTimer.value.interval!);
      activeTimer.value.isRunning = false;
    }
  };

  const resumeTimer = () => {
    if (activeTimer.value && !activeTimer.value.isRunning) {
      activeTimer.value.interval = setInterval(() => {
        if (
          activeTimer.value!.type === "timer" &&
          activeTimer.value!.time > 0
        ) {
          activeTimer.value!.time--;
        } else if (activeTimer.value!.type === "stopwatch") {
          activeTimer.value!.time++;
        }
        xp.value = Number(Number(xp.value + 0.01).toFixed(2));
        checksAfterXPAdd();
      }, 1000);
      activeTimer.value.isRunning = true;
    }
  };

  const stopTimer = () => {
    if (activeTimer.value) {
      clearInterval(activeTimer.value.interval!);
      activeTimer.value = null;
    }
  };

  const unlockedAchievements = ref<string[]>(
    JSON.parse(localStorage.getItem("unlockedAchievements") || "[]"),
  );
  const currentAchievement = ref<Achievement | null>(null);
  const achievementQueue = ref<Achievement[]>([]);

  const checkAchievements = () => {
    const stats = {
      totalTasks: tasks.value.length,
      level: level.value,
      maxTasksInDay: Math.max(
        ...Object.values(completedTasksByDate.value).map(
          (tasks: any) => tasks.length,
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

    localStorage.setItem(
      "unlockedAchievements",
      JSON.stringify(unlockedAchievements.value),
    );

    // Показать следующее достижение
    if (!currentAchievement.value && achievementQueue.value.length > 0) {
      currentAchievement.value = achievementQueue.value.shift()!;
      if (!settings.value.hideSounds) {
        playAchievementSound();
      }
    }
  };

  const closeAchievement = () => {
    currentAchievement.value = null;
    // Показать следующее
    if (achievementQueue.value.length > 0) {
      setTimeout(() => {
        currentAchievement.value = achievementQueue.value.shift()!;
        if (!settings.value.hideSounds) {
          playAchievementSound();
        }
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
          localStorage.setItem(
            "unlockedAchievements",
            JSON.stringify(unlockedAchievements.value),
          );
        } catch (error) {
          console.error("Error importing achievements:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const unlockedLocations = ref<string[]>(
    JSON.parse(
      localStorage.getItem("unlockedLocations") || '["forest", "city"]',
    ),
  );
  const showLocationUnlockModal = ref(false);
  const currentLocation = ref<any>(null);

  const checkLocationUnlocks = () => {
    locations.forEach((location) => {
      if (
        !unlockedLocations.value.includes(location.key) &&
        level.value >= location.requiredLevel
      ) {
        unlockedLocations.value.push(location.key);
        showLocationUnlockModal.value = true;
        currentLocation.value = location;
      }
    });
    localStorage.setItem(
      "unlockedLocations",
      JSON.stringify(unlockedLocations.value),
    );
  };

  interface Habit {
    id: string;
    name: string;
    type: "daily" | "weekly" | "tracker";
    streak: number;
    maxStreak: number;
    lastCompleted: Date | null;
    createdAt: Date;
    completedDates: string[]; // Для tracker: даты выполнения
  }

  const habits = ref<Habit[]>(
    JSON.parse(localStorage.getItem("habits") || "[]"),
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
    saveHabits();
  };

  const deleteHabit = (id: string) => {
    if (id) {
      habits.value = habits.value.filter((habit) => habit.id !== id);
    }
    saveHabits();
  };

  const completeHabit = (id: string) => {
    const habit = habits.value.find((h) => h.id === id);
    if (!habit) return;

    const now = new Date();
    const today = now.toISOString().split("T")[0]!;

    if (habit.type === "tracker") {
      if (!habit.completedDates.includes(today)) {
        habit.completedDates.push(today);
        habit.streak++;
        habit.maxStreak = Math.max(habit.maxStreak, habit.streak);
        habit.lastCompleted = now;
        saveHabits();
        xp.value += 1;
      }
    }

    const last = habit.lastCompleted ? new Date(habit.lastCompleted) : null;

    if (habit.type === "daily") {
      const isConsecutive =
        last && now.getTime() - last.getTime() < 24 * 60 * 60 * 1000;
      if (isConsecutive) {
        habit.streak++;
      } else {
        habit.streak = 1;
      }
    } else {
      // weekly
      const isConsecutive =
        last && now.getTime() - last.getTime() < 7 * 24 * 60 * 60 * 1000;
      if (isConsecutive) {
        habit.streak++;
      } else {
        habit.streak = 1;
      }
    }

    habit.maxStreak = Math.max(habit.maxStreak, habit.streak);
    habit.lastCompleted = now;
    saveHabits();

    // Бонусы XP
    let bonusXP = 1; // Базовый бонус
    if (habit.streak >= 7) bonusXP += 1;
    if (habit.streak >= 30) bonusXP += 2;
    xp.value += bonusXP;
    checksAfterXPAdd();
  };

  const isHabitCompletedToday = (habit: Habit) => {
    const today = new Date().toISOString().split("T")[0]!;
    return habit.completedDates.includes(today);
  };

  const saveHabits = () => {
    localStorage.setItem("habits", JSON.stringify(habits.value));
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

  interface EmotionEntry {
    date: string;
    emotions: Record<string, number>;
  }

  const emotions = ref<EmotionEntry[]>(
    JSON.parse(localStorage.getItem("emotions") || "[]"),
  );
  const defaultEmotions = [
    "Счастье",
    "Стресс",
    "Энергия",
    "Агрессия",
    "Спокойствие",
  ];

  const addEmotionEntry = (emotionValues: Record<string, number>) => {
    const today = new Date().toISOString().split("T")[0];
    const existing = emotions.value.find((e) => e.date === today);
    if (existing) {
      existing.emotions = { ...existing.emotions, ...emotionValues };
    } else {
      emotions.value.push({ date: today, emotions: emotionValues });
    }
    localStorage.setItem("emotions", JSON.stringify(emotions.value));
  };

  const getEmotionHistory = (emotion: string) => {
    return emotions.value
      .map((entry) => ({
        date: entry.date,
        value: entry.emotions[emotion] || 0,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  return {
    xp: computed(() => xp.value),
    level: computed(() => level.value),
    tasks: computed(() => tasks.value),
    settings: computed(() => settings.value),
    completedTasksByDate: computed(() => completedTasksByDate.value),
    legendChallenge: computed(() => legendChallenge.value),
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    toggleHide,
    resetSettings,
    resetProgress,
    getRequiredXP,
    calculateRemainingTime,
    showLevelUpModal,
    masterVolume,
    musicVolume,
    ambientVolume,
    interfaceVolume,
    currentArt,
    setCurrentArt,
    unlockedLocations,
    showLocationUnlockModal,
    currentLocation,
    activeTimer,
    startTimer,
    startStopwatch,
    resetStopwatch,
    startPomodoro,
    resetPomodoro,
    pauseTimer,
    resumeTimer,
    stopTimer,
    unlockedAchievements,
    currentAchievement,
    closeAchievement,
    exportAchievements,
    importAchievements,
    stats,
    updateStats,
    exportStats,
    importStats,
    habits,
    addHabit,
    deleteHabit,
    completeHabit,
    isHabitCompletedToday,
    getHabitBonusXP,
    emotions,
    defaultEmotions,
    addEmotionEntry,
    getEmotionHistory,
  };
});
