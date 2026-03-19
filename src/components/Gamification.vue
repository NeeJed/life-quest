<template>
  <div :class="inModal ? '' : 'bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border-4 border-soft-orange/50'">
    <h2 class="text-2xl font-semibold text-rich-brown mb-4! text-center">🏆 Геймификация</h2>
    <div class="grid grid-cols-2 gap-4 mb-4!">
      <div class="text-center p-3 bg-soft-mint/20 rounded-lg border-2 border-soft-mint">
        <p class="text-lg font-bold text-rich-brown">{{ xp }}</p>
        <p class="text-sm text-very-dark-grayish-blue">XP</p>
      </div>
      <div class="text-center p-3 bg-muted-gold/20 rounded-lg border-2 border-muted-gold">
        <p class="text-lg font-bold text-rich-brown">{{ level }}</p>
        <p class="text-sm text-very-dark-grayish-blue">Уровень</p>
      </div>
    </div>
    <div class="p-3 bg-soft-orange/20 rounded-lg border-2 border-soft-orange">
      <p class="text-sm font-medium text-rich-brown">Соревнование: {{ legendChallenge.name }}</p>
      <p class="text-lg font-bold text-very-dark-grayish-blue">{{ legendChallenge.progress }} / {{ legendChallenge.goal }}</p>
      <div class="w-full bg-rich-brown/20 rounded-full h-2 mt-2">
        <div 
          class="bg-soft-orange h-2 rounded-full transition-all duration-500" 
          :style="{ width: `${(legendChallenge.progress / legendChallenge.goal) * 100}%` }"
        ></div>
      </div>
    </div>
    <div class="mt-4!">
      <button @click="showAchievements = !showAchievements" class="text-rich-brown font-medium p-1 flex items-center gap-2 cursor-pointer hover:bg-soft-orange/25">
        🏆 Достижения {{ showAchievements ? '▼' : '▶' }}
      </button>
      <div v-if="showAchievements" class="mt-2!">
        <div class="grid grid-cols-3 gap-2 mb-4!">
          <div 
            v-for="achievement in achievements" 
            :key="achievement.id" 
            :class="[
              'p-2 rounded-lg text-center cursor-pointer transition-all hover:bg-soft-mint',
              store.unlockedAchievements.includes(achievement.id) ? 'bg-soft-orange/20' : 'bg-gray-200'
            ]"
            @mouseenter="hoveredAchievement = achievement"
            @mouseleave="hoveredAchievement = null"
          >
            <div class="text-2xl">{{ achievement.icon }}</div>
            <div class="text-xs text-rich-brown">{{ achievement.name }}</div>
            <div v-if="achievement.progress" class="mt-1">
              <div class="w-full bg-gray-300 rounded-full h-1">
                <div 
                  class="bg-soft-orange h-1 rounded-full" 
                  :style="{ width: `${Math.min((achievement.progress(store.stats)!.current / achievement.progress(store.stats)!.total) * 100, 100)}%` }"
                ></div>
              </div>
              <div class="text-xs text-rich-brown mt-1">{{ achievement.progress(store.stats)!.current }}/{{ achievement.progress(store.stats)!.total }}</div>
            </div>
          </div>
        </div>
        <div class="flex gap-2">
          <BaseButton @click="store.exportAchievements" variant="secondary">Экспорт</BaseButton>
          <input type="file" @change="store.importAchievements" accept=".json" class="hidden" ref="importInput" />
          <BaseButton @click="triggerImport" variant="secondary">Импорт</BaseButton>
        </div>
      </div>
      <!-- Превью достижения -->
      <div v-if="hoveredAchievement" class="mt-2! p-2 bg-muted-gold/20 rounded-lg flex items-center gap-2">
        <img :src="hoveredAchievement.image" :alt="hoveredAchievement.name" class="w-8 h-8 rounded" />
        <div>
          <div class="text-rich-brown font-medium text-sm">{{ hoveredAchievement.name }}</div>
          <div class="text-rich-brown/70 text-xs">{{ hoveredAchievement.description }}</div>
        </div>
      </div>
    </div>
    <!-- Кнопка закрытия только если не в модалке -->
    <button v-if="!inModal" @click="$emit('close')" class="mt-4 w-full bg-soft-orange hover:bg-muted-gold text-rich-brown py-2 rounded-lg font-semibold">
      Закрыть
    </button>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGameStore } from '../stores/game'
import { achievements } from '@/shared/utils/achievements'
import { ref } from 'vue';

interface Props {
  inModal?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{ close: [] }>()

const store = useGameStore()
const { xp, level, legendChallenge } = storeToRefs(store)

const showAchievements = ref(true)
const hoveredAchievement = ref<any>(null)

const importInput = ref<HTMLInputElement | null>(null)
const triggerImport = () => {
  importInput.value?.click()
}
</script>