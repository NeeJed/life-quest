<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @keydown.esc="close">
    <div class="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border-2 border-muted-gold/50 max-w-md w-full mx-4 text-center" @click.stop>
      <p class="text-rich-brown mb-4">Вы достигли уровня {{ level }}!</p>
      <div class="mb-4">
        <!-- <img src="/images/level-up.png" alt="Level Up" class="w-32 h-32 mx-auto" /> -->
      </div>
      <BaseButton @click="close" variant="primary">ОК</BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
  level: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const close = () => {
  emit('close')
}
</script>