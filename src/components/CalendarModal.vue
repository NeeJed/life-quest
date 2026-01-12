<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="close">
    <div class="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border-4 border-muted-gold/50 max-w-4xl w-full mx-4 relative pixel-border animate-fade-in" @click.stop>
      <!-- Кнопка закрытия -->
      <BaseButton 
        @click="close" 
        class="absolute top-3 right-3 text-2xl font-bold bg-transparent p-1! px-2!"
      >
        ✕
      </BaseButton>
      
      <h3 class="text-2xl font-semibold text-rich-brown mb-6 text-center">Календарь</h3>
      
      <!-- Самописный календарь -->
      <CustomCalendar />
    </div>
  </div>
</template>

<script setup lang="ts">
import CustomCalendar from './CustomCalendar.vue'

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
</script>

<style scoped>
.pixel-border {
  border: 4px solid transparent;
  border-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="20" height="20" fill="%23C2B280"/><rect x="2" y="2" width="16" height="16" fill="none" stroke="%237D5B3A" stroke-width="2"/><rect x="4" y="4" width="12" height="12" fill="none" stroke="%23A8D8B9" stroke-width="1"/></svg>') 10;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
</style>