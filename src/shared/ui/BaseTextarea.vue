<template>
  <textarea 
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    :placeholder="placeholder"
    :rows="rows"
    :class="textareaClasses"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string
  placeholder?: string
  rows?: number
  variant?: 'default' | 'primary'
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const textareaClasses = computed(() => [
  'w-full p-3 border-2 border-rich-brown/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-orange bg-gray-50 resize-none text-rich-brown placeholder-rich-brown/50',
  props.variant === 'primary' ? 'border-soft-orange' : ''
])
</script>