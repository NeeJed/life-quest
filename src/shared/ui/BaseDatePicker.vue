<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-rich-brown mb-1">{{ label }}</label>
    <VueDatePicker 
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :format="'dd.MM.yyyy HH:mm'"
      :locale="ru"
      :enable-time-picker="enableTime"
      :clearable="clearable"
      :placeholder="placeholder"
      class="w-full"
      :text-input="true"
      :auto-apply="true"
      teleport="body"
      menu-class="custom-datepicker-menu"
    />
  </div>
</template>

<script setup lang="ts">
import { VueDatePicker } from '@vuepic/vue-datepicker'
import { ru } from 'date-fns/locale'

interface Props {
  modelValue: Date | null
  label?: string
  placeholder?: string
  enableTime?: boolean
  clearable?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: Date | null]
}>()
</script>

<style scoped>
.custom-datepicker-menu {
  z-index: 9999 !important;
  position: absolute !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
  border-radius: 8px !important;
  background: white !important;
}
</style>