import { defineStore } from "pinia";
import { ref, watch } from "vue";

export type ITheme = "light" | "dark" | "system";

export const useThemeStore = defineStore("theme", () => {
  const theme = ref<ITheme>(
    (localStorage.getItem("theme") as ITheme) || "system"
  );

  const applyTheme = (newTheme: ITheme) => {
    theme.value = newTheme;
    localStorage.setItem("theme", newTheme);

    const root = document.documentElement;
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else if (newTheme === "light") {
      root.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      root.classList.toggle("dark", prefersDark);
    }
  };
  applyTheme(theme.value);

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", () => {
    if (theme.value === "system") {
      applyTheme("system");
    }
  });

  watch(theme, applyTheme);

  return { theme, applyTheme };
});
