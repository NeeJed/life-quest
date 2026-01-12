import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { useAudio } from "@/shared/hooks/useAudio";

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
  const { playCompleteSound, playLevelUpSound } = useAudio();

  // Загрузка из localStorage
  const loadSettings = () => ({
    hideLeaderboard: JSON.parse(
      localStorage.getItem("hideLeaderboard") || "false"
    ),
    hideInterface: JSON.parse(localStorage.getItem("hideInterface") || "false"),
    hideSounds: JSON.parse(localStorage.getItem("hideSounds") || "false"),
    hideTimers: JSON.parse(localStorage.getItem("hideTimers") || "false"),
    disableMusic: JSON.parse(localStorage.getItem("disableMusic") || "false"),
    disableNotifications: JSON.parse(
      localStorage.getItem("disableNotifications") || "false"
    ),
    optOutLeaderboard: JSON.parse(
      localStorage.getItem("optOutLeaderboard") || "false"
    ),
  });

  const settings = ref(loadSettings());
  const xp = ref(parseInt(localStorage.getItem("xp") || "0"));
  const level = ref(parseInt(localStorage.getItem("level") || "1"));
  const showLevelUpModal = ref(false);
  const tasks = ref<Task[]>([]);
  const completedTasksByDate = ref<Record<string, Task[]>>(
    JSON.parse(localStorage.getItem("completedTasksByDate") || "{}")
  );
  const legendChallenge = ref({
    name: "Великий бегун",
    goal: 10000,
    progress: 0,
  });

  watch(xp, (newXp) => localStorage.setItem("xp", newXp.toString()));
  watch(level, (newLevel) =>
    localStorage.setItem("level", newLevel.toString())
  );

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
  };

  // Добавлены updateTask и deleteTask
  const updateTask = (
    id: number,
    updates: Partial<Omit<Task, "id" | "createdAt" | "completed">>
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
    }
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
      // Повышение уровня, если XP >= требуемый для следующего уровня
      const oldLevel = level.value;
      while (xp.value >= getRequiredXP(level.value + 1)) {
        level.value++;
      }
      if (level.value > oldLevel) {
        showLevelUpModal.value = true;
        playLevelUpSound();
      }

      // Сохранить выполненную задачу по дате
      const dateKey = new Date().toISOString().split("T")[0]!;
      if (!completedTasksByDate.value[dateKey])
        completedTasksByDate.value[dateKey] = [];
      completedTasksByDate.value[dateKey].push(task);
      localStorage.setItem(
        "completedTasksByDate",
        JSON.stringify(completedTasksByDate.value)
      );

      if (!settings.value.hideSounds) {
        playCompleteSound();
      }
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
        JSON.stringify(settings.value[key as keyof typeof settings.value])
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
  };
});
