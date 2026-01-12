import { ref, computed } from "vue";
import type { Task } from "../stores/game";

export const useTaskSorting = (tasks: Task[]) => {
  const selectedTag = ref("");
  const sortBy = ref<
    "createdAt" | "deadline" | "priority" | "difficulty" | "title"
  >("createdAt");
  const sortOrder = ref<"asc" | "desc">("asc");

  const sortedTasks = computed(() => {
    let filtered = tasks.filter(
      (task) => !selectedTag.value || task.tag === selectedTag.value
    );
    filtered.sort((a, b) => {
      let aVal: any, bVal: any;
      if (sortBy.value === "createdAt") {
        aVal = a.createdAt.getTime();
        bVal = b.createdAt.getTime();
      } else if (sortBy.value === "deadline") {
        aVal = a.deadline ? a.deadline.getTime() : Infinity;
        bVal = b.deadline ? b.deadline.getTime() : Infinity;
      } else if (sortBy.value === "priority") {
        const priorityOrder = {
          максимальный: 4,
          высокий: 3,
          средний: 2,
          низкий: 1,
        };
        aVal = priorityOrder[a.priority];
        bVal = priorityOrder[b.priority];
      } else if (sortBy.value === "difficulty") {
        const difficultyOrder = { высокая: 3, средняя: 2, низкая: 1 };
        aVal = difficultyOrder[a.difficulty];
        bVal = difficultyOrder[b.difficulty];
      } else if (sortBy.value === "title") {
        aVal = a.title.toLowerCase();
        bVal = b.title.toLowerCase();
      }
      if (sortOrder.value === "asc") return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });
    return filtered;
  });

  return { selectedTag, sortBy, sortOrder, sortedTasks };
};
