<template>
  <div v-if="achievement" class="fixed bottom-1/3 left-1/2 transform -translate-x-1/2 bg-white/90 p-4 rounded-2xl shadow-lg border-2 border-muted-gold/50 flex items-center gap-4 animate-bounce-in z-70">
    <img :src="achievement.image" :alt="achievement.name" class="w-16 h-16 rounded" />
    <div>
      <h4 class="text-rich-brown font-semibold">{{ achievement.name }}</h4>
      <p class="text-rich-brown/70 text-sm">{{ achievement.description }}</p>
      <BaseButton @click="close" variant="primary" class="mt-2">ОК</BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Achievement } from '@/shared/utils/achievements'

const props = defineProps<{ achievement: Achievement | null }>()
const emit = defineEmits<{ close: [] }>()

const close = () => {
  emit('close')
}
</script>