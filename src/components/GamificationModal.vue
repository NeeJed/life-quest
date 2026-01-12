<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="close">
    <div class="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl max-w-md w-full mx-4 relative pt-12" @click.stop>
      <!-- Кнопка закрытия (сдвинута вниз, чтобы не перекрывать) -->
      <BaseButton 
        @click="close"
        class="absolute top-3 right-3 text-2xl font-bold bg-transparent p-1! px-2! z-10"
      >
        ✕
      </BaseButton>
      
      <!-- Gamification без бордера, чтобы избежать дублирования -->
      <Gamification :in-modal="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import Gamification from './Gamification.vue'

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const close = () => {
  emit('close')
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>