<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border-4 border-muted-gold/50 max-w-lg w-full mx-4 relative">
      <!-- Кнопка закрытия -->
      <BaseButton 
        @click="emit('close')" 
        class="absolute top-3 right-3 text-2xl font-bold bg-transparent p-1! px-2!"
      >
        ✕
      </BaseButton>
        
      <h3 class="text-2xl font-semibold text-rich-brown mb-6! text-center">⚙️ Настройки</h3>
      <div class="space-y-6">
        <div class="grid grid-cols-1 gap-4">
          <label class="flex items-center space-x-3">
            <BaseInput type="checkbox" v-model="localSettings.hideLeaderboard" @change="toggle('hideLeaderboard')" class="w-5! h-5! focus:ring-soft-orange" />
            <span class="text-rich-brown">Скрыть лидерборд</span>
          </label>
          <label class="flex items-center space-x-3">
            <BaseInput type="checkbox" v-model="localSettings.optOutLeaderboard" @change="toggle('optOutLeaderboard')" class="w-5! h-5! focus:ring-soft-orange"/>
            <span class="text-rich-brown">Отказ от участия в лидерборде</span>
          </label>
          <label class="flex items-center space-x-3">
            <BaseInput type="checkbox" v-model="localSettings.hideInterface" @change="toggle('hideInterface')" class="w-5! h-5! focus:ring-soft-orange"/>
            <span class="text-rich-brown">Скрыть интерфейс</span>
          </label>
          <label class="flex items-center space-x-3">
            <BaseInput type="checkbox" v-model="localSettings.hideSounds" @change="toggle('hideSounds')" class="w-5! h-5! focus:ring-soft-orange"/>
            <span class="text-rich-brown">Скрыть звуки</span>
          </label>
          <label class="flex items-center space-x-3">
            <BaseInput type="checkbox" v-model="localSettings.hideTimers" @change="toggle('hideTimers')" class="w-5! h-5! focus:ring-soft-orange"/>
            <span class="text-rich-brown">Скрыть таймеры</span>
          </label>
          <label class="flex items-center space-x-3">
            <BaseInput type="checkbox" v-model="localSettings.disableMusic" @change="toggle('disableMusic')" class="w-5! h-5! focus:ring-soft-orange"/>
            <span class="text-rich-brown">Отключить музыку</span>
          </label>
          <label class="flex items-center space-x-3">
            <BaseInput type="checkbox" v-model="localSettings.disableNotifications" @change="toggle('disableNotifications')" class="w-5! h-5! focus:ring-soft-orange"/>
            <span class="text-rich-brown">Отключить уведомления</span>
          </label>
        </div>
      </div>
      <div class="flex justify-center mt-8!">
        <BaseButton @click="resetSettings" variant="danger" class="px-6!">
          Сброс к умолчанию
        </BaseButton>
        <div class="flex justify-center mt-4">
          <BaseButton @click="showResetModal = true" variant="danger">Сброс прогресса</BaseButton>
        </div>
      </div>
      <ResetProgressModal :is-open="showResetModal" @confirm="resetProgress" @close="showResetModal = false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '../stores/game'
import ResetProgressModal from './ResetProgressModal.vue';

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ close: [] }>()

const store = useGameStore()
const localSettings = reactive({ ...store.settings })
const showResetModal = ref(false)

const toggle = (key: keyof typeof localSettings) => {
  store.toggleHide(key)
  localSettings[key] = store.settings[key]
}

const resetSettings = () => {
  store.resetSettings()
  Object.assign(localSettings, store.settings)
}

const resetProgress = () => {
  store.resetProgress()
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// Синхронизация
watch(() => store.settings, (newSettings) => {
  Object.assign(localSettings, newSettings)
}, { deep: true })
</script>