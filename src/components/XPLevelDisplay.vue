<template>
  <div>
    <button
      @click="setGamificationModuleIsOpen(true)"
      class="fixed top-4 left-4 bg-white/90 backdrop-blur-md p-3 rounded-lg shadow-lg border-2 w-50 border-soft-orange/50 hover:bg-white/95 transition-colors z-10 hover:cursor-pointer"
    >
      <div class="flex flex-col gap-1 text-center">
        <div class="flex flex-col gap-0.5">
          <div class="flex gap-1 items-center justify-center">
            <p class="text-lg font-bold text-rich-brown">{{ xp.toFixed(0) }}</p>
            <p class="text-sm text-very-dark-grayish-blue">XP</p>
          </div>
          <div class="w-full bg-rich-brown/20 rounded-full h-2 mt-2">
            <div 
              class="bg-soft-orange h-2 rounded-full transition-all duration-500" 
              :style="{ width: `${progressToNextLevel}%` }"
            ></div>
          </div>
        </div>
        <div class="flex gap-1 items-center justify-center">
          <p class="text-sm font-bold text-rich-brown">{{ level }}</p>
          <p class="text-xs text-very-dark-grayish-blue">Уровень</p>
        </div>
      </div>
    </button>

    <GamificationModal :is-open="showGamification" @close="setGamificationModuleIsOpen(false)" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '../stores/game'
import GamificationModal from './GamificationModal.vue'

const store = useGameStore()
const { xp, level } = storeToRefs(store)
const showGamification = ref(false)

const progressToNextLevel = computed(() => {
  const currentLevelXP = store.getRequiredXP(level.value)
  const nextLevelXP = store.getRequiredXP(level.value + 1)
  const xpInCurrentLevel = xp.value - currentLevelXP
  const xpNeededForNext = nextLevelXP - currentLevelXP
  return xpNeededForNext > 0 ? (xpInCurrentLevel / xpNeededForNext) * 100 : 100
})

const setGamificationModuleIsOpen = (flag: boolean) => {
  showGamification.value = flag
}
</script>