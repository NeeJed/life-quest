<template>
  <div v-if="!isOnline" class="fixed bottom-4 right-4 bg-red-500 text-white p-2 rounded shadow">
    {{ $t('common.offline') }}
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isOnline = ref(navigator.onLine)

onMounted(() => {
  window.addEventListener('online', () => isOnline.value = true)
  window.addEventListener('offline', () => isOnline.value = false)
})
</script>