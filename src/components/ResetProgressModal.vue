<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="close">
    <div class="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border-2 border-muted-gold/50 max-w-md w-full mx-4" @click.stop>
      <h3 class="text-lg font-semibold text-rich-brown mb-2">Сброс прогресса</h3>
      <p class="text-rich-brown mb-4">Вы уверены, что хотите сбросить весь прогресс? Это действие нельзя отменить.</p>
      <div class="flex gap-2">
        <BaseButton @click="confirm" variant="danger">Подтвердить</BaseButton>
        <BaseButton @click="close" variant="secondary">Отмена</BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{
  confirm: []
  close: []
}>()

const confirm = () => {
  emit('confirm')
  emit('close')
}

const close = () => {
  emit('close')
}
</script>