<template>
  <div class="min-h-screen bg-cover bg-center relative" :style="{ backgroundImage: `url(${currentArt})` }">
    <!-- Арт: рисованный фон с лучшей интеграцией -->
    <div class="absolute inset-0 bg-gradient-to-b from-soft-mint/30 to-rich-brown/50"></div> <!-- Градиент для контраста -->

    <!-- Основной контент -->
    <div class="relative z-10 flex flex-col items-center justify-start min-h-screen p-6 gap-6">
      <!-- Заголовок -->
      <h1 v-if="!store.settings.hideInterface" class="text-3xl font-bold text-rich-brown bg-white/70 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border-2 border-muted-gold mt-4">
        LifeQuest
      </h1>

      <!-- Компоненты -->
      <div v-if="!store.settings.hideInterface" class="w-full max-w-md flex flex-col gap-6">
        <TaskForm v-if="!store.settings.hideTimers" />
        <TaskList />
        <Leaderboard v-if="!store.settings.hideLeaderboard" />
      </div>

      <!-- Иконки в левом нижнем углу -->
      <div class="fixed bottom-4 left-4">
        <AmbientSounds/>
      </div>
      <!-- Иконки в правом нижнем углу -->
      <div class="fixed bottom-4 right-132 flex flex-col gap-2">
        <VolumePanel />
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
import homepage from '@/assets/homepage.png'
import AudioPlayer from '@/components/AudioPlayer.vue'
import LevelUpModal from '@/components/LevelUpModal.vue'
import AmbientSounds from '@/components/AmbientSounds.vue'
import VolumePanel from '@/components/VolumePanel.vue'

const store = useGameStore()
const currentArt = ref(homepage)
const showSettings = ref(false)
const showCalendar = ref(false)
</script>