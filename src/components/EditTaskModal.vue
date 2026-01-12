<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="close">
    <div class="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border-2 border-yellow-300/50 max-w-md w-full mx-4" @click.stop>
      <h3 class="text-lg font-semibold text-rich-brown mb-2">Изменить задачу</h3>
      <form @submit.prevent="handleSubmit" class="space-y-3">
        <TaskFormFields :form-data="form" />
        <div class="flex gap-2">
          <BaseButton 
            type="submit"
            class="flex-1"
          >
            Сохранить
          </BaseButton>
          <BaseButton 
            type="button" 
            @click="deleteTask"
            class="flex-1"
            variant="danger"
          >
            Удалить
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useGameStore } from '@/stores/game'
import TaskFormFields from './TaskFormFields.vue'

interface Props {
  isOpen: boolean
  task: any
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const store = useGameStore()
const form = ref({
  title: '',
  description: '',
  tag: '',
  priority: 'средний' as 'низкий' | 'средний' | 'высокий' | 'максимальный',
  difficulty: 'средняя' as 'низкая' | 'средняя' | 'высокая',
  deadline: null as Date | null
})

watch(() => props.task, (newTask) => {
  if (newTask) {
    form.value = { ...newTask }
  }
}, { immediate: true })

const handleSubmit = () => {
  if (form.value.title.trim()) {
    store.updateTask(props.task.id, {
      title: form.value.title.trim(),
      description: form.value.description?.trim() || undefined,
      tag: form.value.tag || undefined,
      priority: form.value.priority,
      difficulty: form.value.difficulty,
      deadline: form.value.deadline || undefined
    })
    close()
  }
}

const deleteTask = () => {
  store.deleteTask(props.task.id)
  close()
}

const close = () => {
  emit('close')
}
</script>