<template>
  <div class="min-h-screen bg-cover bg-center relative" :style="{ backgroundImage: `url(${store.currentArt})` }">
    <!-- Арт: рисованный фон с лучшей интеграцией -->
    <div class="absolute inset-0 bg-gradient-to-b from-soft-mint/30 to-rich-brown/50"></div> <!-- Градиент для контраста -->

    <!-- Основной контент -->
    <div class="relative z-10 flex flex-col items-center justify-start min-h-screen p-6 gap-6">

      <!-- Компоненты -->
      <div v-if="!store.settings.hideInterface" class="w-full max-w-md flex flex-col gap-6">
        <TaskForm />
        <TaskList />
        <Leaderboard v-if="!store.settings.hideLeaderboard" />
      </div>

      <!-- Иконки в левом нижнем углу -->
      <div class="fixed bottom-4 left-4 flex gap-x-2 items-end">
        <AmbientSounds v-if="!store.settings.hideInterface"/>
        <TimerModal v-if="!store.settings.hideTimers && !store.settings.hideInterface"/>
        <HabitsPanel v-if="!store.settings.hideInterface"/>
      </div>
      <!-- Иконки в правом нижнем углу -->
      <div class="fixed bottom-4 right-132 flex flex-col gap-2">
        <VolumePanel v-if="!store.settings.hideInterface" />
        <BaseButton
          v-if="!store.settings.hideInterface"
          @click="showCalendar = true" 
          class="p-3! rounded-full! shadow-xl border-2 border-rich-brown duration-300!"
          title="Открыть календарь"
        >
          📅
        </BaseButton>
        <BaseButton
          v-if="!store.settings.hideInterface"
          @click="showMap = true" 
          class="p-3! rounded-full! shadow-xl border-2 border-rich-brown duration-300!"
          title="Карта локаций"
        >
          🗺️
        </BaseButton>
        <BaseButton
          v-if="!store.settings.hideInterface"
          @click="showSettings = true" 
          class="p-3! rounded-full! shadow-xl border-2 border-rich-brown duration-300!"
          title="Настройки"
        >
          ⚙️
        </BaseButton>
        <BaseButton 
          @click="store.toggleHide('hideInterface')" 
          class="p-3! rounded-full! shadow-xl border-2 border-rich-brown duration-300!"
          title="Скрыть интерфейс"
        >
          👁️
        </BaseButton>
      </div>
    </div>

    <div v-if="store.activeTimer && !store.settings.hideTimers" class="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white/90 p-2 rounded-lg shadow-lg border-2 border-muted-gold/50 flex items-center gap-2 z-60">
      <span class="text-rich-brown font-semibold">{{ formatTime(store.activeTimer.time) }}</span>
      <BaseButton @click="store.activeTimer.isRunning ? store.pauseTimer() : store.resumeTimer()" variant="secondary" size="sm">
        {{ store.activeTimer.isRunning ? '⏸' : '▶' }}
      </BaseButton>
      <button @click="store.stopTimer()" class="text-red-500 hover:text-red-700 text-lg">✕</button>
    </div>

    <!-- Модальное окно настроек -->
    <SettingsModal :is-open="showSettings" @close="showSettings = false" />

    <!-- Модальное окно календаря -->
    <CalendarModal :is-open="showCalendar" @close="showCalendar = false" />

    <!-- Модуль XP и уровня -->
    <XPLevelDisplay v-if="!store.settings.hideInterface"/>

    <!-- Модуль аудио плеер -->
    <AudioPlayer v-if="!store.settings.hideInterface"/>

    <!-- Модальное окно при повышении уровня -->
    <LevelUpModal :is-open="store.showLevelUpModal" :level="store.level" @close="store.showLevelUpModal = false" />

    <!-- Модальное окно карты -->
    <MapModal :is-open="showMap" @close="showMap = false" />

    <!-- Уведомление о получении нового достижения -->
    <AchievementNotification :achievement="store.currentAchievement" @close="store.closeAchievement" />

    <!-- Уведомление об открытии новой локации -->
    <LocationUnlockModal :is-open="store.showLocationUnlockModal" :location="store.currentLocation" @close="store.showLocationUnlockModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '../stores/game'
import TaskForm from '../components/TaskForm.vue'
import TaskList from '../components/TaskList.vue'
import Leaderboard from '../components/Leaderboard.vue'
import SettingsModal from '../components/SettingsModal.vue'
import CalendarModal from '../components/CalendarModal.vue'
import XPLevelDisplay from '../components/XPLevelDisplay.vue'
import AudioPlayer from '@/components/AudioPlayer.vue'
import LevelUpModal from '@/components/LevelUpModal.vue'
import AmbientSounds from '@/components/AmbientSounds.vue'
import VolumePanel from '@/components/VolumePanel.vue'
import MapModal from '@/components/MapModal.vue'
import TimerModal from '@/components/TimerModal.vue'
import AchievementNotification from '@/components/AchievementNotification.vue'
import LocationUnlockModal from '@/components/LocationUnlockModal.vue'
import HabitsPanel from '@/components/HabitsPanel.vue'

const store = useGameStore()
const showSettings = ref(false)
const showCalendar = ref(false)
const showMap = ref(false)
const showTimers = ref(false)

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
</script>