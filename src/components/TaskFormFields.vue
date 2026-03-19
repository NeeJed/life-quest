<template>
  <div class="flex flex-col space-y-3 gap-1">
    <BaseInput v-model="formData.title" placeholder="Название задачи*" required />
    <BaseTextarea v-model="formData.description" placeholder="Описание (опционально)" :rows="3" />
    <BaseSelect v-model="formData.tag">
      <option value="">Выберите тег (опционально)</option>
      <option value="работа">Работа</option>
      <option value="здоровье">Здоровье</option>
      <option value="личное">Личное</option>
      <option value="другое">Другое</option>
    </BaseSelect>
    <BaseSelect v-model="formData.priority">
      <option value="средний">Приоритет: Средний</option>
      <option value="низкий">Приоритет: Низкий</option>
      <option value="высокий">Приоритет: Высокий</option>
      <option value="максимальный">Приоритет: Максимальный</option>
    </BaseSelect>
    <BaseSelect v-model="formData.difficulty">
      <option value="средняя">Сложность: Средняя</option>
      <option value="низкая">Сложность: Низкая</option>
      <option value="высокая">Сложность: Высокая</option>
    </BaseSelect>
    <BaseDatePicker v-model="formData.deadline" label="Крайний срок (опционально)" placeholder="Выберите дату и время" :enable-time="true" :clearable="true" />
  </div>
</template>

<script setup lang="ts">
interface FormData {
  title: string
  description: string
  tag: string
  priority: 'низкий' | 'средний' | 'высокий' | 'максимальный'
  difficulty: 'низкая' | 'средняя' | 'высокая'
  deadline: Date | null
}

const props = defineProps<{ formData: FormData }>()
</script>