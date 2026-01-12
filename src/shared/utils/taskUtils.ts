export const getPriorityIcon = (priority: string): string => {
  switch (priority) {
    case "максимальный":
      return "🔥";
    case "высокий":
      return "🔴";
    case "средний":
      return "➖";
    case "низкий":
      return "⬇️";
    default:
      return "➖";
  }
};

export const getDifficultyIcon = (difficulty: string): string => {
  switch (difficulty) {
    case "высокая":
      return "⭐⭐⭐";
    case "средняя":
      return "⭐⭐";
    case "низкая":
      return "⭐";
    default:
      return "⭐⭐";
  }
};
