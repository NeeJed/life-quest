import { defineStore } from "pinia";
import { ref, watch } from "vue";

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

export const useTasksStore = defineStore("tasks", () => {
  const tasks = ref<Task[]>([]);
  const completedTasksByDate = ref<Record<string, Task[]>>(
    JSON.parse(localStorage.getItem("completedTasksByDate") || "{}"),
  );

  watch(
    completedTasksByDate,
    (newCompleted) => {
      localStorage.setItem(
        "completedTasksByDate",
        JSON.stringify(newCompleted),
      );
    },
    { deep: true },
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
    }
  };

  const completeTask = (id: number) => {
    const task = tasks.value.find((t) => t.id === id);
    if (task) {
      task.completed = true;

      // Сохранить выполненную задачу по дате
      const dateKey = new Date().toISOString().split("T")[0]!;
      if (!completedTasksByDate.value[dateKey])
        completedTasksByDate.value[dateKey] = [];
      completedTasksByDate.value[dateKey].push(task);
    }
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

  const getTasksStats = () => {
    const totalTasks = tasks.value.length;
    const completedTasks = Object.values(completedTasksByDate.value).flat()
      .length;
    const overdueTasks = tasks.value.filter(
      (t) => t.deadline && new Date() > t.deadline && !t.completed,
    ).length;

    return {
      totalTasks,
      completedTasks,
      overdueTasks,
      bestDayTasks: Math.max(
        ...Object.values(completedTasksByDate.value).map(
          (tasks) => tasks.length,
        ),
        0,
      ),
      activeDays: Object.keys(completedTasksByDate.value).length,
    };
  };

  return {
    tasks,
    completedTasksByDate,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    calculateRemainingTime,
    getTasksStats,
  };
});
