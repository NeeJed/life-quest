import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useSettingsStore = defineStore("settings", () => {
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

  const settings = ref({
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

  // Watchers для сохранения в localStorage
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

  watch(
    settings,
    (newSettings) => {
      Object.keys(newSettings).forEach((key) => {
        localStorage.setItem(
          key,
          JSON.stringify(newSettings[key as keyof typeof newSettings]),
        );
      });
    },
    { deep: true },
  );

  // Сохраняем оригинальное название функции
  const toggleHide = (key: keyof typeof settings.value) => {
    settings.value[key] = !settings.value[key];
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

  const loadSettings = () => {
    return {
      hideLeaderboard: JSON.parse(
        localStorage.getItem("hideLeaderboard") || "false",
      ),
      hideInterface: JSON.parse(
        localStorage.getItem("hideInterface") || "false",
      ),
      hideSounds: JSON.parse(localStorage.getItem("hideSounds") || "false"),
      hideTimers: JSON.parse(localStorage.getItem("hideTimers") || "false"),
      disableMusic: JSON.parse(localStorage.getItem("disableMusic") || "false"),
      disableNotifications: JSON.parse(
        localStorage.getItem("disableNotifications") || "false",
      ),
      optOutLeaderboard: JSON.parse(
        localStorage.getItem("optOutLeaderboard") || "false",
      ),
    };
  };

  return {
    masterVolume,
    musicVolume,
    ambientVolume,
    interfaceVolume,
    settings,
    toggleHide, // Оригинальное название
    resetSettings,
    loadSettings,
  };
});
