import { defineStore } from "pinia";
import { ref, watch } from "vue";

export interface EmotionEntry {
  date: string;
  emotions: Record<string, number>;
}

export const useEmotionsStore = defineStore("emotions", () => {
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

  watch(
    emotions,
    (newEmotions) => {
      localStorage.setItem("emotions", JSON.stringify(newEmotions));
    },
    { deep: true },
  );

  const addEmotionEntry = (emotionValues: Record<string, number>) => {
    const today = new Date().toISOString().split("T")[0];
    const existing = emotions.value.find((e) => e.date === today);
    if (existing) {
      existing.emotions = { ...existing.emotions, ...emotionValues };
    } else {
      emotions.value.push({ date: today, emotions: emotionValues });
    }
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
    emotions,
    defaultEmotions,
    addEmotionEntry,
    getEmotionHistory,
  };
});
