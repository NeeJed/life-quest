<template>
  <div :class="inModal ? '' : 'bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border-4 border-soft-orange/50'">
    <h2 class="text-2xl font-semibold text-rich-brown mb-4 text-center">🏆 Геймификация</h2>
    <div class="grid grid-cols-2 gap-4 mb-4">
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
    <!-- Кнопка закрытия только если не в модалке -->
    <button v-if="!inModal" @click="$emit('close')" class="mt-4 w-full bg-soft-orange hover:bg-muted-gold text-rich-brown py-2 rounded-lg font-semibold">
      Закрыть
    </button>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGameStore } from '../stores/game'

interface Props {
  inModal?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{ close: [] }>()

const store = useGameStore()
const { xp, level, legendChallenge } = storeToRefs(store)
</script>