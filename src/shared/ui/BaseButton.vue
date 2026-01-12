<template>
  <button 
    :type="type"
    :disabled="disabled"
    :class="buttonClasses"
    @click="$emit('click')"
    v-sound
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type?: 'button' | 'submit'
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
}

const props = defineProps<Props>()
const emit = defineEmits<{
  click: []
}>()

const buttonClasses = computed(() => {
  const base = 'py-3 px-4 rounded-lg transition-all duration-200 font-semibold cursor-pointer'
  if (props.variant === 'primary') return `${base} bg-soft-orange hover:bg-muted-gold text-rich-brown`
  if (props.variant === 'secondary') return `${base} bg-gray-300 hover:bg-gray-400 text-rich-brown`
  if (props.variant === 'danger') return `${base} bg-red-500 hover:bg-red-600 text-white`
  return `${base} bg-soft-orange hover:bg-muted-gold text-rich-brown`
})
</script>