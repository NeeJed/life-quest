<template>
  <div class="habits-panel max-w-150!">
    <div v-if="isPanelOpen" class="flex flex-col gap-2 animate-fade-in bg-white/90 p-4 rounded-2xl shadow-lg border-2 border-muted-gold/50">
      <!-- Вкладки -->
      <div class="flex border-b mb-4 text-rich-brown">
        <BaseButton class="bg-transparent rounded-none" @click="activeTab = 'list'" :class="['py-2 px-4', activeTab === 'list' ? 'border-b-2 border-soft-orange' : '']">Список</BaseButton>
        <BaseButton class="bg-transparent rounded-none" @click="activeTab = 'tracker'" :class="['py-2 px-4', activeTab === 'tracker' ? 'border-b-2 border-soft-orange' : '']">Трекер</BaseButton>
        <BaseButton class="bg-transparent rounded-none" @click="activeTab = 'emotions'" :class="['py-2 px-4', activeTab === 'emotions' ? 'border-b-2 border-soft-orange' : '']">Эмоции</BaseButton>
      </div>

      <!-- Эмоциональный трекер -->
      <div v-if="activeTab === 'emotions'" class="space-y-4 text-rich-brown">
        <div class="flex border-b mb-4">
          <button @click="emotionTab = 'log'" :class="['py-2 px-4', emotionTab === 'log' ? 'border-b-2 border-soft-orange' : '']">Запись</button>
          <button @click="emotionTab = 'history'" :class="['py-2 px-4', emotionTab === 'history' ? 'border-b-2 border-soft-orange' : '']">История</button>
        </div>

        <!-- Запись эмоций -->
        <div v-if="emotionTab === 'log'" class="space-y-4">
          <div v-for="emotion in store.defaultEmotions" :key="emotion" class="flex items-center gap-4">
            <span class="w-24 text-sm">{{ emotion }}</span>
            <BaseInput type="range" v-model="currentEmotions[emotion]" :min="'0'" :max="'100'" :step="'1'" class="flex-1" />
            <span class="w-12 text-sm">{{ currentEmotions[emotion] }}/100</span>
          </div>
          <BaseButton @click="saveEmotions" variant="primary">Сохранить</BaseButton>
        </div>

        <!-- История эмоций -->
        <div v-if="emotionTab === 'history'" class="space-y-4">
          <BaseSelect v-model="selectedEmotion" class="w-full">
            <option v-for="emotion in store.defaultEmotions" :key="emotion" :value="emotion">{{ emotion }}</option>
          </BaseSelect>
          <div class="h-32 flex items-end gap-1">
            <div 
              v-for="entry in store.getEmotionHistory(selectedEmotion)" 
              :key="entry.date" 
              class="bg-soft-orange rounded-t flex-1"
              :style="{ height: (entry.value / 100) * 100 + '%' }"
              :title="`${entry.date}: ${entry.value}`"
            ></div>
          </div>
        </div>
      </div>

      <!-- Список привычек -->
      <div v-if="activeTab === 'list'" class="space-y-4">
        <form class="flex gap-2 mb-4" @submit.prevent>
          <BaseInput v-model="newHabitName" placeholder="Название привычки" class="" />
          <BaseSelect v-model="newHabitType" class="w-32">
            <option value="daily">Ежедневная</option>
            <option value="weekly">Еженедельная</option>
            <option value="tracker">Трекер</option>
          </BaseSelect>
          <BaseButton @click="addHabit" variant="primary">Добавить</BaseButton>
        </form>
  
        <div class="space-y-2 max-h-96 overflow-auto">
          <div v-for="habit in store.habits" :key="habit.id" class="flex items-center justify-between gap-2 p-2 bg-muted-gold/20 rounded">
            <div>
              <div class="font-medium text-rich-brown text-wrap">{{ habit.name }}</div>
              <div v-if="habit.type === 'tracker'" class="text-sm text-rich-brown/70">
                Сегодня: 
                <div class="rounded-full w-3 h-3 inline-block" :class="store.isHabitCompletedToday(habit) ? 'bg-green-600' : 'bg-red-600'"></div>
              </div>
              <div v-else class="text-sm text-rich-brown/70">Цепочка: {{ habit.streak }} (макс: {{ habit.maxStreak }})</div>
            </div>
            <div class="flex gap-4">
              <BaseButton @click="deleteHabit(habit.id)" variant="danger">Удалить</BaseButton>
              <BaseButton @click="completeHabit(habit.id)" variant="primary" size="sm" :disabled="habit.type === 'tracker' && store.isHabitCompletedToday(habit)">✓</BaseButton>
            </div>
          </div>
        </div>
  
        <div class="mt-4 text-sm text-rich-brown">
          Бонус XP от привычек: {{ store.getHabitBonusXP() }}
        </div>
      </div>

      <!-- Трекер привычек -->
      <div v-if="activeTab === 'tracker'" class="overflow-x-auto">
        <div class="min-w-max">
          <!-- Заголовки дат -->
          <div class="flex mb-2!">
            <div class="w-32"></div>
            <div v-for="date in dates" :key="date" class="w-8 text-center text-xs text-rich-brown">
              {{ formatDate(date) }}
            </div>
          </div>

          <!-- Привычки -->
          <div v-for="habit in store.habits.filter(h => h.type === 'tracker')" :key="habit.id" class="flex items-center mb-1!">
            <div class="w-32 text-sm font-medium truncate text-rich-brown">{{ habit.name }}</div>
            <div v-for="date in dates" :key="date" class="flex justify-center w-8 text-center">
              <div 
                class="w-6 h-6 rounded-full mx-auto"
                :class="isCompleted(habit, date) ? 'bg-green-500' : 'bg-red-500'"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <BaseButton @click="togglePanel" variant="secondary" class="mt-2!" title="Привычки">
      💪
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useGameStore } from '@/stores/game'

const store = useGameStore()
const isPanelOpen = ref(false)
const activeTab = ref<'list' | 'tracker' | 'emotions'>('list')
const newHabitName = ref('')
const newHabitType = ref<'daily' | 'weekly' | 'tracker'>('daily')
const emotionTab = ref<'log' | 'history'>('log')
const selectedEmotion = ref('Счастье')
const currentEmotions = reactive<Record<string, number>>({})

// Инициализация текущих эмоций
store.defaultEmotions.forEach(emotion => {
  currentEmotions[emotion] = 50
})

const saveEmotions = () => {
  store.addEmotionEntry({ ...currentEmotions })
}

const dates = computed(() => {
  const dates = []
  const today = new Date()
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    dates.push(date.toISOString().split('T')[0])
  }
  return dates
})

const togglePanel = () => {
  isPanelOpen.value = !isPanelOpen.value
}

const addHabit = () => {
  if (newHabitName.value.trim()) {
    store.addHabit(newHabitName.value.trim(), newHabitType.value)
    newHabitName.value = ''
  }
}

const deleteHabit = (id: string) => {
  if (id) {
    store.deleteHabit(id)
  }
}

const completeHabit = (id: string) => {
  store.completeHabit(id)
}

const isCompleted = (habit: any, date: string) => {
  return habit.completedDates.includes(date)
}

const formatDate = (date: string) => {
  const d = new Date(date)
  return d.getDate().toString()
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>