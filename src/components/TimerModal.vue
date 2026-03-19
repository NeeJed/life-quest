<template>
  <div class="timers-panel">
    <div v-if="isPanelOpen" class="w-85 grid grid-cols-3 grid-flow-col gap-10 animate-fade-in bg-white/90 p-4 rounded-2xl shadow-lg border-2 border-muted-gold/50">
      <!-- Таймер -->
      <div class="flex flex-col gap-2 items-center">
        <h4 class="text-rich-brown font-medium text-xl">Таймер</h4>
        <div class="flex flex-col gap-2">
          <BaseInput type="number" v-model="timerMinutes" placeholder="Минуты" class="w-20" />
          <BaseInput type="number" v-model="timerSeconds" placeholder="Секунды" class="w-20" />
          <BaseButton @click="startTimer" variant="primary">Старт</BaseButton>
        </div>
      </div>

      <!-- Секундомер -->
      <div class="flex flex-col gap-2 items-center">
        <h4 class="text-rich-brown font-medium text-xl">Секундомер</h4>
        <BaseButton @click="startStopwatch" variant="primary">Старт/Стоп</BaseButton>
        <BaseButton @click="resetStopwatch" variant="secondary" class="ml-2">Сброс</BaseButton>
      </div>

      <!-- Pomodoro -->
      <div class="flex flex-col gap-2 items-center">
        <h4 class="text-rich-brown font-medium text-xl">Pomodoro</h4>
        <BaseButton @click="startPomodoro" variant="primary">Старт</BaseButton>
        <BaseButton @click="resetPomodoro" variant="secondary" class="ml-2">Сброс</BaseButton>
      </div>
    </div>
    <BaseButton @click="togglePanel" variant="secondary" class="mt-2!" title="Таймеры">
      ⏰
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '../stores/game'

const store = useGameStore()
const isPanelOpen = ref(false)
const timerMinutes = ref(0)
const timerSeconds = ref(0)

const togglePanel = () => {
  isPanelOpen.value = !isPanelOpen.value
}

const startTimer = () => {
  const totalSeconds = timerMinutes.value > 0 ? Number(timerMinutes.value) * 60 + Number(timerSeconds.value) : timerSeconds.value
  store.startTimer(totalSeconds)
  isPanelOpen.value = false
}

const startStopwatch = () => {
  store.startStopwatch()
  isPanelOpen.value = false
}

const resetStopwatch = () => {
  store.resetStopwatch()
}

const startPomodoro = () => {
  store.startPomodoro()
  isPanelOpen.value = false
}

const resetPomodoro = () => {
  store.resetPomodoro()
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>