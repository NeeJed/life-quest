<template>
  <div class="flex items-center gap-1 text-green-500 dark:text-green-100">
    <label for="theme-select">{{ $t('theme.label') }}</label>
    <select id="theme-select" v-model="currentTheme" class="p-0.5 pr-2 pl-2 border border-gray-300 rounded-2xl bg-green-500 dark:bg-green-900 text-green-800 dark:text-green-100">
      <option value="light">{{ $t('theme.light') }}</option>
      <option value="dark">{{ $t('theme.dark') }}</option>
      <option value="system">{{ $t('theme.system') }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore, type ITheme } from '@/stores/theme';
import { computed } from 'vue';

  const themeStore = useThemeStore()
  const currentTheme = computed({
    get: () => themeStore.theme,
    set: (value: ITheme) => {
      themeStore.applyTheme(value)
      console.log('Переключение на тему:', value)
    }
  }) 
</script>

<style scoped>
</style>