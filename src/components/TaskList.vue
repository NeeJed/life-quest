<template>
  <div class="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border-4 border-yellow-300/50">
    <h2 class="text-2xl font-semibold text-rich-brown mb-4! text-center">📝 Задачи</h2>
    <div class="flex gap-2 mb-2!">
      <BaseSelect v-model="sortBy" class="w-min">
        <option value="createdAt">По дате создания</option>
        <option value="deadline">По дедлайну</option>
        <option value="priority">По приоритету</option>
        <option value="difficulty">По сложности</option>
        <option value="title">По алфавиту</option>
      </BaseSelect>
      <BaseButton @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'" class="px-3 py-2 rounded-lg">
        {{ sortOrder === 'asc' ? '↑' : '↓' }}
      </BaseButton>
    </div>
    <BaseSelect v-model="selectedTag" class="mb-2!">
      <option value="">Все теги</option>
      <option value="работа">Работа</option>
      <option value="здоровье">Здоровье</option>
      <option value="личное">Личное</option>
      <option value="другое">Другое</option>
    </BaseSelect>
    <ul v-if="sortedTasks.length" class="space-y-3 max-h-64 overflow-y-auto">
      <li 
        v-for="task in sortedTasks" 
        :key="task.id" 
        class="p-4 bg-soft-mint/20 rounded-lg shadow-sm border border-muted-gold/30 mb-1!"
      >
        <div class="flex justify-between items-start">
          <h4 :class="{ 'line-through text-very-dark-grayish-blue': task.completed }" class="font-semibold flex-1 text-rich-brown">{{ task.title }}</h4>
          <div class="flex gap-2">
            <BaseButton 
              v-if="!task.completed" 
              @click="completeTask(task.id)" 
              class="bg-soft-mint! hover:bg-soft-orange-3 py-1! rounded-full!"
            >
              ✅ Выполнить
            </BaseButton>
            <BaseButton 
              @click="editTask(task)" 
              class="bg-blue-500! hover:bg-blue-600! text-white! px-3! py-1! rounded-full!"
            >
              ✏️ Изменить
            </BaseButton>
          </div>
        </div>
        <p v-if="task.description" class="text-sm text-very-dark-grayish-blue mb-1">{{ task.description }}</p>
        <div class="flex justify-between text-xs text-very-dark-grayish-blue mb-1">
          <span v-if="task.tag" class="bg-soft-orange px-2 py-1 rounded">{{ task.tag }}</span>
          <span :class="{ 'text-red-500': remainingTime(task).includes('Просрочено') }">
            {{ remainingTime(task) }}
          </span>
        </div>
        <div class="flex justify-between text-xs text-very-dark-grayish-blue">
          <span :title="`Приоритет: ${task.priority}`">{{ getPriorityIcon(task.priority) }}</span>
          <span :title="`Сложность: ${task.difficulty}`">{{ getDifficultyIcon(task.difficulty) }}</span>
        </div>
      </li>
    </ul>
    <p v-else class="text-very-dark-grayish-blue text-center">Нет задач. Добавьте первую!</p>
    
    <EditTaskModal :is-open="showEditModal" :task="editingTask" @close="showEditModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game'
import { useTaskSorting } from '@/shared/hooks/useTaskSorting'
import { getPriorityIcon, getDifficultyIcon } from '@/shared/utils/taskUtils'
import EditTaskModal from '@/components/EditTaskModal.vue'
import { useAudio } from '@/shared/hooks/useAudio'

const store = useGameStore()
const { playCompleteSound } = useAudio()
const { tasks } = storeToRefs(store)
const { selectedTag, sortBy, sortOrder, sortedTasks } = useTaskSorting(tasks.value)
const showEditModal = ref(false)
const editingTask = ref<any>(null)

const remainingTime = (task: any) => {
  return store.calculateRemainingTime(task.deadline)
}

const completeTask = (id: number) => {
  store.completeTask(id)
  playCompleteSound()
}

const editTask = (task: any) => {
  editingTask.value = task
  showEditModal.value = true
}
</script>