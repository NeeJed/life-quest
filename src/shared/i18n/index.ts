import { createI18n } from "vue-i18n";
import ru from "@/shared/locales/ru.json";
import en from "@/shared/locales/en.json";

const messages = {
  ru,
  en,
};

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("locale") || "ru",
  fallbackLocale: "ru",
  messages,
});

export default i18n;
