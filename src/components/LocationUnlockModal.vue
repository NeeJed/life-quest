<template>
  <div v-if="isOpen" class="fixed bottom-1/3 left-1/2 transform -translate-x-1/2 bg-white/90 p-4 rounded-2xl shadow-lg border-2 border-muted-gold/50 flex items-center gap-4 animate-bounce-in z-70" @keydown.esc="close">
    <img :src="location.image" :alt="location.name" class="w-16 h-16 rounded" @click.stop/>
    <div @click.stop>
      <h4 class="text-rich-brown font-semibold">Новая локация!</h4>
      <p class="text-rich-brown/70 text-sm">{{ location.name }} теперь доступна!</p>
      <BaseButton @click="close" variant="primary" class="mt-2">ОК</BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Location } from '@/shared/utils/locations';

const props = defineProps<{ location: Location, isOpen: boolean }>()
const emit = defineEmits<{ close: [] }>()

const close = () => {
  emit('close')
}
</script>

<style scoped>
.animate-bounce-in {
  animation: bounceIn 0.5s ease-out;
}

@keyframes bounceIn {
  0% { transform: translateX(-50%) scale(0.3); opacity: 0; }
  50% { transform: translateX(-50%) scale(1.05); }
  70% { transform: translateX(-50%) scale(0.9); }
  100% { transform: translateX(-50%) scale(1); opacity: 1; }
}
</style>