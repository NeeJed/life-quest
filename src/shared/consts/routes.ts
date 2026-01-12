import HomeView from "@/views/HomeView.vue";
import Auth from "@/views/Auth.vue";

export const PAGES = [
  { path: "/", titleKey: "nav.home", component: HomeView },
  { path: "/login", titleKey: "hav.login", component: Auth },
  { path: "/register", titleKey: "nav.register", component: Auth },
];
