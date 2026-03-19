import { createApp } from "vue";
import { createPinia } from "pinia";
import "@vuepic/vue-datepicker/dist/main.css";
import "@/assets/main.css";

import App from "@/App.vue";
import router from "@/router";
import { useAuthStore } from "@/stores/auth";
import i18n from "./shared/i18n";
import Toast from "vue-toastification";
import { toastOptions } from "@/shared/plugins/toast";
import "vue-toastification/dist/index.css";

import BaseInput from "@/shared/ui/BaseInput.vue";
import BaseSelect from "@/shared/ui/BaseSelect.vue";
import BaseButton from "@/shared/ui/BaseButton.vue";
import BaseTextarea from "@/shared/ui/BaseTextarea.vue";
import BaseDatePicker from "@/shared/ui/BaseDatePicker.vue";
import components from "@/shared/ui";
import { useGameStore } from "./stores/game";
import { useAudio } from "./shared/hooks/useAudio";

const app = createApp(App);
const pinia = createPinia();

console.log(components);
components.forEach((component) => {
  app.component(component.__name!, component);
});

// app.component("BaseInput", BaseInput);
// app.component("BaseSelect", BaseSelect);
// app.component("BaseButton", BaseButton);
// app.component("BaseTextarea", BaseTextarea);
// app.component("BaseDatePicker", BaseDatePicker);

app.use(Toast, toastOptions);
app.use(pinia);
app.use(router);
app.use(i18n);

app.directive("sound", {
  mounted(el) {
    el.addEventListener("mouseenter", () => {
      playHoverSound();
    });
    el.addEventListener("click", () => {
      initInterfaceSounds();
      playClickSound();
    });
  },
});

const authStore = useAuthStore();
const gameStore = useGameStore();
const { playHoverSound, playClickSound, initInterfaceSounds } = useAudio();
authStore.initAuth();

app.mount("#app");

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(() => console.log("SW registered"));
}
