<template>
  <div class="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border-2 border-yellow-300/50 mb-4!">
    <h3 class="text-lg font-semibold text-rich-brown mb-2!">➕ Добавить задачу</h3>
    <form @submit.prevent="handleSubmit" class="space-y-3">
      <TaskFormFields :form-data="form" />
      <BaseButton 
        type="submit"
        class="w-full mt-2!"
      >
        Добавить задачу
      </BaseButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '@/stores/game'
import TaskFormFields from '@/components/TaskFormFields.vue'

const store = useGameStore()
const form = ref({
  title: '',
  description: '',
  tag: '',
  priority: 'средний' as 'низкий' | 'средний' | 'высокий' | 'максимальный',
  difficulty: 'средняя' as 'низкая' | 'средняя' | 'высокая',
  deadline: null as Date | null
})

const handleSubmit = () => {
  if (form.value.title.trim()) {
    store.addTask({
      title: form.value.title.trim(),
      description: form.value.description?.trim() || undefined,
      tag: form.value.tag || undefined,
      priority: form.value.priority,
      difficulty: form.value.difficulty,
      deadline: form.value.deadline || undefined
    })
    form.value = { title: '', description: '', tag: '', priority: 'средний', difficulty: 'средняя', deadline: null }
  }
}
</script>