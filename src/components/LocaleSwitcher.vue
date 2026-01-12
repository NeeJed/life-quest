<template>
  <div class="locale-switcher">
    <label for="locale-select">{{ $t("i18n.language") }}</label>
    <select id="locale-select" v-model="selectedLocale">
      <option value="ru">Русский</option>
      <option value="en">English</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLocaleStore } from '@/stores/locale'

const localeStore = useLocaleStore()
const selectedLocale = computed({
  get: () => localeStore.currentLocale,
  set: (value: 'ru' | 'en') => localeStore.setLocale(value)
})

</script>

<style scoped>
.locale-switcher {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

select {
  padding: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>