<template>
  <select 
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    :class="selectClasses"
  >
    <slot />
  </select>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string
  variant?: 'default' | 'primary'
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const selectClasses = computed(() => [
  'w-full p-3 border-2 border-rich-brown/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-orange bg-gray-50 text-rich-brown',
  props.variant === 'primary' ? 'border-soft-orange' : ''
])
</script>