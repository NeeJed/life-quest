<template>
  <div class="ambient-sounds">
    <div v-if="isMenuOpen" class="flex flex-col gap-1 animate-fade-in">
      <BaseButton v-for="sound in sounds" :key="sound.key" @click="toggleSound(sound.key)" :variant="activeSounds.includes(sound.key) ? 'primary' : 'secondary'" class="w-28 h-12">
        {{ sound.icon }} {{ sound.label }}
      </BaseButton>
    </div>
    <BaseButton @click="toggleMenu" variant="secondary" class="mt-2!" title="Фоновые звуки">
      🌤️
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useGameStore } from '@/stores/game'
import { useAudio } from '@/shared/hooks/useAudio'

const store = useGameStore()
const { masterVolume, ambientVolume } = useAudio()
const isMenuOpen = ref(false)
const activeSounds = ref<string[]>([])
const soundInstances = ref<Record<string, HTMLAudioElement>>({})

const sounds = [
  { key: 'morning', label: 'Утро', icon: '🌅', url: '/audio/ambient/morning.mp3' },
  { key: 'day', label: 'День', icon: '☀️', url: '/audio/ambient/day.mp3' },
  { key: 'evening', label: 'Вечер', icon: '🌆', url: '/audio/ambient/evening.mp3' },
  { key: 'night', label: 'Ночь', icon: '🌙', url: '/audio/ambient/night.mp3' },
  { key: 'rain', label: 'Дождь', icon: '🌧️', url: '/audio/ambient/rain.mp3' },
  { key: 'snow', label: 'Снег', icon: '❄️', url: '/audio/ambient/snow.mp3' },
  { key: 'storm', label: 'Буря', icon: '⛈️', url: '/audio/ambient/storm.mp3' }
]

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const toggleSound = (key: string) => {
  if (store.settings.hideSounds) return // Не включать, если звуки скрыты

  const sound = sounds.find(s => s.key === key)
  if (!sound) return

  if (activeSounds.value.includes(key)) {
    // Выключить
    if (soundInstances.value[key]) {
      soundInstances.value[key].pause()
      delete soundInstances.value[key]
    }
    activeSounds.value = activeSounds.value.filter(s => s !== key)
  } else {
    // Включить
    const audio = new Audio(sound.url)
    audio.loop = true
    audio.volume = store.ambientVolume * store.masterVolume // Низкая громкость для фона
    audio.play().catch(err => console.error('Ambient sound failed:', err))
    soundInstances.value[key] = audio
    activeSounds.value.push(key)
  }
}

watch([() => store.ambientVolume, () => store.masterVolume], ([ambient, master]) => {
  activeSounds.value.forEach(key => {
    if (soundInstances.value[key]) {
      soundInstances.value[key].volume = 0.3 * ambient * master
    }
  })
}, { immediate: true })

// Отключать все звуки при активации hideSounds

watch(() => store.settings.hideSounds, (hideSounds) => {
  if (hideSounds) {
    activeSounds.value.forEach(key => {
      if (soundInstances.value[key]) {
        soundInstances.value[key].pause()
        delete soundInstances.value[key]
      }
    })
    activeSounds.value = []
  }
})
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