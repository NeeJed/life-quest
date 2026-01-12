import { defineStore } from "pinia";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

export const useLocaleStore = defineStore("locale", () => {
  const { locale } = useI18n();
  const currentLocale = ref(locale.value);

  const setLocale = (newLocale: "ru" | "en") => {
    locale.value = newLocale;
    currentLocale.value = newLocale;
    localStorage.setItem("locale", newLocale);
  };

  return { currentLocale, setLocale };
});
