<template>
  <div class="calendar-wrapper pixel-border bg-gradient-to-br from-soft-mint/20 to-rich-brown/20 p-6 rounded-2xl shadow-2xl" style="width: 800px; height: 600px;">
    <div class="flex gap-6 h-full">
      <!-- Левая часть: календарь и переключатель -->
      <div class="flex-1 flex flex-col">
        <!-- Заголовок с навигацией и селектами -->
        <div class="flex justify-between items-center mb-4">
          <BaseButton @click="prevMonth" class="p-0! bg-transparent hover:bg-transparent text-2xl hover:text-soft-orange">◀</BaseButton>
          <div class="flex gap-2">
            <BaseSelect v-model="selectedMonth" @change="changeMonth" class="bg-white/50 text-rich-brown border-0! rounded! px-2 py-1 w-auto!">
              <option v-for="(month, index) in months" :key="index" :value="index">{{ month }}</option>
            </BaseSelect>
            <BaseSelect v-model="selectedYear" @change="changeYear" class="bg-white/50 text-rich-brown border-0! rounded! px-2 py-1 w-auto!">
              <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
            </BaseSelect>
          </div>
          <BaseButton @click="nextMonth" class="p-0! bg-transparent hover:bg-transparent text-2xl hover:text-soft-orange">▶</BaseButton>
        </div>
        
        <!-- Дни недели -->
        <div class="grid grid-cols-7 gap-2 mb-4">
          <div v-for="day in daysOfWeek" :key="day" class="text-center text-rich-brown font-semibold">{{ day }}</div>
        </div>
        
        <!-- Сетка дней (фиксированная) -->
        <div class="grid grid-cols-7 gap-2 flex-1">
          <div 
            v-for="day in daysInMonth" 
            :key="day.date.getTime()" 
            :class="[
              'calendar-day pixel-border p-3 text-center cursor-pointer transition-all duration-300 rounded-lg flex items-center justify-center',
              day.isCurrentMonth ? 'text-rich-brown hover:bg-soft-orange' : 'text-gray-400',
              day.isToday ? 'bg-soft-mint border-soft-mint' : '',
              day.hasTasks ? 'bg-soft-orange text-rich-brown font-bold' : '',
              day.isSelected ? 'bg-very-dark-grayish-blue text-white border-very-dark-grayish-blue' : ''
            ]"
            @click="selectDay(day)"
          >
            {{ day.date.getDate() }}
          </div>
        </div>
      </div>
      
      <!-- Правая часть: блок задач -->
      <div class="w-80 flex flex-col">
        <h4 class="text-lg font-semibold text-rich-brown mb-2">
          {{ selectedDate ? `Выполненные задачи ${selectedDateFormatted}` : 'Выберите день' }}
        </h4>
        <div class="flex-1 overflow-y-auto bg-soft-orange/20 rounded-lg border-2 border-soft-orange pixel-border p-4">
          <ul v-if="selectedDayTasks.length" class="space-y-2">
            <li v-for="task in selectedDayTasks" :key="task.id" class="p-3 bg-white/50 rounded pixel-border">
              <p class="font-medium text-rich-brown">{{ task.title }}</p>
              <p v-if="task.description" class="text-sm text-very-dark-grayish-blue">{{ task.description }}</p>
              <div class="flex justify-between text-xs text-very-dark-grayish-blue mt-1">
                <span>Тег: {{ task.tag || 'Нет' }}</span>
                <span>Приоритет: {{ task.priority }}</span>
                <span>Сложность: {{ task.difficulty }}</span>
              </div>
              <p class="text-xs text-very-dark-grayish-blue">Создано: {{ formatDate(task.createdAt) }}</p>
            </li>
          </ul>
          <p v-else class="text-very-dark-grayish-blue">Нет выполненных задач в этот день.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '../stores/game'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

const store = useGameStore()
const { completedTasksByDate } = storeToRefs(store)

const currentDate = ref(new Date())
const selectedDate = ref<Date | null>(null)
const selectedDayTasks = ref<any[]>([])
const selectedMonth = ref(currentDate.value.getMonth())
const selectedYear = ref(currentDate.value.getFullYear())

const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
const years = Array.from({ length: 11 }, (_, i) => currentDate.value.getFullYear() - 5 + i)

const currentMonthName = computed(() => format(currentDate.value, 'MMMM', { locale: ru }))
const currentYear = computed(() => currentDate.value.getFullYear())

const daysInMonth = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay() + 1) // Понедельник
  
  const days = []
  let date = new Date(startDate)
  const totalCells = 35 // 5 недель * 7 дней
  for (let i = 0; i < totalCells; i++) {
    const dateKey = format(date, 'yyyy-MM-dd')
    days.push({
      date: new Date(date),
      isCurrentMonth: date.getMonth() === month,
      isToday: format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'),
      hasTasks: !!completedTasksByDate.value[dateKey],
      isSelected: selectedDate.value && format(date, 'yyyy-MM-dd') === format(selectedDate.value, 'yyyy-MM-dd')
    })
    date.setDate(date.getDate() + 1)
  }
  return days
})

const selectedDateFormatted = computed(() => {
  return selectedDate.value ? format(selectedDate.value, 'dd.MM.yyyy') : ''
})

const selectDay = (day: any) => {
  selectedDate.value = day.date
  const dateKey = format(day.date, 'yyyy-MM-dd')
  selectedDayTasks.value = completedTasksByDate.value[dateKey] || []
}

const prevMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
  selectedMonth.value = currentDate.value.getMonth()
  selectedYear.value = currentDate.value.getFullYear()
  // Не сбрасывать selectedDate и selectedDayTasks
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
  selectedMonth.value = currentDate.value.getMonth()
  selectedYear.value = currentDate.value.getFullYear()
  // Не сбрасывать selectedDate и selectedDayTasks
}

const changeMonth = () => {
  currentDate.value = new Date(selectedYear.value, selectedMonth.value, 1)
  // Не сбрасывать selectedDate и selectedDayTasks
}

const changeYear = () => {
  currentDate.value = new Date(selectedYear.value, selectedMonth.value, 1)
  // Не сбрасывать selectedDate и selectedDayTasks
}

const formatDate = (date: Date) => {
  return format(date, 'dd.MM.yyyy HH:mm')
}
</script>

<style scoped>
.pixel-border {
  border: 4px solid transparent;
  border-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="20" height="20" fill="%23C2B280"/><rect x="2" y="2" width="16" height="16" fill="none" stroke="%237D5B3A" stroke-width="2"/><rect x="4" y="4" width="12" height="12" fill="none" stroke="%23A8D8B9" stroke-width="1"/></svg>') 10;
}

.calendar-day:hover {
  transform: scale(1.1);
}
</style>