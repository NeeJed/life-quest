<template>
  <div class="volume-panel relative">
    <BaseButton @click="togglePanel" variant="secondary" class="p-3! rounded-full! shadow-xl border-2 border-rich-brown duration-300!" title="Настройки громкости">
      🔊
    </BaseButton>
    <div v-if="isPanelOpen" class="absolute top-0 right-15 w-85 flex flex-col gap-2 animate-fade-in bg-white/90 p-4 rounded-2xl shadow-lg border-2 border-muted-gold/50">
      <div class="flex items-center gap-2">
        <span class="text-rich-brown w-20">Общая:</span>
        <BaseInput type="range" v-model="masterVolume" :min="'0'" :max="'1'" :step="'0.01'" @update:modelValue="setMasterVolume" class="flex-1" />
        <span class="text-rich-brown w-8">{{ Math.round(masterVolume * 100) }}%</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-rich-brown w-20">Музыка:</span>
        <BaseInput type="range" v-model="musicVolume" :min="'0'" :max="'1'" :step="'0.01'" @update:modelValue="setMusicVolume" class="flex-1" />
        <span class="text-rich-brown w-8">{{ Math.round(musicVolume * 100) }}%</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-rich-brown w-20">Фон:</span>
        <BaseInput type="range" v-model="ambientVolume" :min="'0'" :max="'1'" :step="'0.01'" @update:modelValue="setAmbientVolume" class="flex-1" />
        <span class="text-rich-brown w-8">{{ Math.round(ambientVolume * 100) }}%</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-rich-brown w-20">Интерфейс:</span>
        <BaseInput type="range" v-model="interfaceVolume" :min="'0'" :max="'1'" :step="'0.01'" @update:modelValue="setInterfaceVolume" class="flex-1" />
        <span class="text-rich-brown w-8">{{ Math.round(interfaceVolume * 100) }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game'

const isPanelOpen = ref(false)
const store = useGameStore()
const { masterVolume, musicVolume, ambientVolume, interfaceVolume } = storeToRefs(store)

const togglePanel = () => {
  isPanelOpen.value = !isPanelOpen.value
}

const setMasterVolume = (value: number) => {
  masterVolume.value = value
  // Применить к всем звукам
}

const setMusicVolume = (value: number) => {
  musicVolume.value = value
}

const setAmbientVolume = (value: number) => {
  ambientVolume.value = value
}

const setInterfaceVolume = (value: number) => {
  interfaceVolume.value = value
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