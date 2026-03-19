import { defineStore } from "pinia";
import { ref } from "vue";
import { useProgressStore } from "./progress";

export const useTimersStore = defineStore("timers", () => {
  const progressStore = useProgressStore();

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
          progressStore.addXP(0.1);
        } else {
          clearInterval(activeTimer.value!.interval!);
          progressStore.stats.timerTime += seconds;
          // Только сбрасываем таймер, не трогаем тип
          activeTimer.value.time = 0;
          activeTimer.value.isRunning = false;
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
          progressStore.addXP(0.01);
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
          progressStore.addXP(0.01);
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
        progressStore.addXP(0.01);
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

  return {
    activeTimer,
    startTimer,
    startStopwatch,
    resetStopwatch,
    startPomodoro,
    resetPomodoro,
    pauseTimer,
    resumeTimer,
    stopTimer,
  };
});
