<template>
  <header class="text-white p-4 shadow-md">
    <nav class="container mx-auto flex justify-between items-center">
      <div class="flex gap-3 items-center">
        <router-link to="/" class="dark:text-white text-black text-xl font-bold hover:bg-transparent">
          <h1>Finance Tracker</h1>
        </router-link>
        <ul class="flex space-x-4 gap-0.5 items-center">
          <li v-for="page in navUrls">
            <router-link :to="page.path" class="hover:underline">{{ $t(page.titleKey) }}</router-link>
          </li>
        </ul>
      </div>
      <div class="flex items-center gap-4">
        <div v-if="authStore.isAuthenticated" class="flex items-center gap-1">
          <span>{{ $t("nav.hello") }}, {{ authStore.user?.name }}</span>
          <button @click="authStore.logout" class="border border-red-500/40 hover:border-red-500 px-3 py-1 rounded cursor-pointer">
            {{ $t("nav.logout") }}
          </button> 
        </div>
        <ul v-else class="flex space-x-4 gap-1">
          <li><router-link to="/login">{{ $t("nav.login") }}</router-link></li>
          <li><router-link to="/register">{{ $t("nav.register") }}</router-link></li>
        </ul>
        <button 
          @click="requestNotifications" 
          class="bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-600"
        >
          {{ $t("notifications.acceptNotifications") }}
        </button>
        <theme-switcher/>
        <locale-switcher/>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { PAGES } from '@/shared/consts/routes';
import ThemeSwitcher from './ThemeSwitcher.vue';
import { useAuthStore } from '@/stores/auth';
import { useBudgetsStore } from '@/stores/budgets';
import LocaleSwitcher from './LocaleSwitcher.vue';
const authStore = useAuthStore()
const budgetsStore = useBudgetsStore()

const requestNotifications = async () => {
  await budgetsStore.requestNotificationPermission()
}

const navUrls = PAGES.filter(page => !page.path.includes('/login') && !page.path.includes('/register'))

</script>

<style scoped>
  .router-link-active {
    font-weight: bold;
    text-decoration: underline;
  }
</style>