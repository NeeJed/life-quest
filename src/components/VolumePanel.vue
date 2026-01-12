<template>
  <div class="volume-panel">
    <BaseButton @click="togglePanel" variant="secondary" class="mb-2! p-3! rounded-full! shadow-xl border-2 border-rich-brown duration-300!">
      🔊
    </BaseButton>
    <div v-if="isPanelOpen" class="flex flex-col gap-2 animate-fade-in bg-white/90 p-4 rounded-2xl shadow-lg border-2 border-muted-gold/50">
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
import { ref, watch } from 'vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import { useAudio } from '@/shared/hooks/useAudio'

const isPanelOpen = ref(false)
const { masterVolume, musicVolume, ambientVolume, interfaceVolume } = useAudio()

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