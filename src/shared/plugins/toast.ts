import { POSITION, type PluginOptions } from "vue-toastification";

export const toastOptions: PluginOptions = {
  position: POSITION.TOP_RIGHT,
  timeout: 3500,
  closeOnClick: false,
  closeButton: "button",
  icon: true,
  rtl: true,
};
