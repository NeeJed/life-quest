<template>
  <input 
    v-if="type !== 'checkbox' && type !== 'range'"
    :type="type"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    :placeholder="placeholder"
    :required="required"
    :class="inputClasses"
  />
  <input 
    v-else-if="type === 'checkbox'"
    type="checkbox"
    :checked="Boolean(modelValue)"
    @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    :class="checkboxClasses"
  />
  <input 
    v-else-if="type === 'range'"
    type="range"
    :min="min"
    :max="max"
    :step="step"
    :value="modelValue"
    @input="$emit('update:modelValue', parseFloat(($event.target as HTMLInputElement).value))"
    :class="rangeClasses"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string | boolean | number
  type?: string
  placeholder?: string
  required?: boolean
  min?: string
  max?: string
  step?: string
  variant?: 'default' | 'primary'
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string | boolean | number]
}>()

const inputClasses = computed(() => [
  'w-full p-3 border-2 border-rich-brown/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-orange bg-gray-50 text-rich-brown placeholder-rich-brown/50',
  props.variant === 'primary' ? 'border-soft-orange' : ''
])

const checkboxClasses = computed(() => [
  'w-5 h-5 text-soft-orange focus:ring-soft-orange border-rich-brown/30 rounded'
])

const rangeClasses = computed(() => [
  'w-full'
])
</script>