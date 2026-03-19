import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useArtStore = defineStore("art", () => {
  const currentArt = ref(
    localStorage.getItem("currentArt") ||
      "/images/backgrounds/upscaled/cozy-room.webp",
  );

  watch(currentArt, (newArt) => {
    localStorage.setItem("currentArt", newArt);
  });

  const setCurrentArt = (art: string) => {
    currentArt.value = art;
  };

  return {
    currentArt,
    setCurrentArt,
  };
});
