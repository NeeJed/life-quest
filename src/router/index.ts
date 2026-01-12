import { createRouter, createWebHistory } from "vue-router";
import { PAGES } from "@/shared/consts/routes";
import { useAuthStore } from "@/stores/auth";
import i18n from "@/shared/i18n";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: PAGES.map((page) => ({
    ...page,
    meta: {
      requiresAuth: page.path === "/settings",
    },
  })),
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/login");
  } else {
    next();
  }

  const page = PAGES.find((p) => p.path === to.path);
  if (page) {
    document.title = i18n.global.t(page.titleKey);
  }
});

export default router;
