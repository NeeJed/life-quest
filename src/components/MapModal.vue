<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="close">
    <div class="bg-cover bg-center w-full h-full relative" :style="{ backgroundImage: `url('/images/map.jpg')` }" @click.stop>
      <!-- Маркеры локаций -->
      <div 
        v-for="location in locations" 
        :key="location.key" 
        class="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
        :style="{ left: location.x + '%', top: location.y + '%' }"
        @click="selectLocation(location)"
        @mouseenter="hoveredLocation = location"
        @mouseleave="hoveredLocation = null"
      >
        <div
          class="w-8 h-8 bg-red-500/50 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
          :class="isUnlocked(location) ? 'bg-red-500' : 'bg-gray-500'"
        >
          <span class="text-white text-xs">{{ isUnlocked(location) ? '📍' : '🔒' }}</span>
        </div>
      </div>

      <!-- Превью при наведении -->
      <div v-if="hoveredLocation" class="absolute top-4 right-4 bg-white/90 p-4 rounded-lg shadow-lg border-2 border-muted-gold/50 w-58" :style="{ left: hoveredLocation.x + '%', top: hoveredLocation.y + '%' }">
        <img :src="hoveredLocation.image" :alt="hoveredLocation.name" class="w-50 h-50 rounded mb-2" />
        <h4 class="text-rich-brown font-semibold text-center">{{ hoveredLocation.name }}</h4>
        <p v-if="!isUnlocked(hoveredLocation)" class="text-red-500 text-sm">Требуется уровень {{ hoveredLocation.requiredLevel }}</p>
      </div>

      <!-- Кнопка закрытия -->
      <button 
        @click="close" 
        class="absolute top-4 left-4 text-rich-brown hover:text-soft-orange text-2xl font-bold bg-white/70 rounded-full w-10 h-10 flex items-center justify-center"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useGameStore } from '../stores/game'
import { locations, type Location } from '@/shared/utils/locations';

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ close: [] }>()

const store = useGameStore()
const hoveredLocation = ref<Location | null>(null)

const isUnlocked = (location: Location) => store.level >= location.requiredLevel

const selectLocation = (location: Location) => {
  if (isUnlocked(location)) {
    store.setCurrentArt(location.background)
    close()
  }
}

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