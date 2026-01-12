<template>
  <main class="flex flex-col gap-3 justify-center items-center h-[calc(100vh-66px)]">
    <h1 class="text-2xl mb-4"> {{isRegister ? $t("auth.registerTitle") : $t("auth.loginTitle")}}</h1>
    <form @submit.prevent="onSubmit" class="flex flex-col gap-3 justify-center items-center max-w-180 p-4 border border-green-500 rounded-3xl">
      <transition name="slide" mode="out-in">
        <div v-if="isRegister" class="flex mb-4 gap-3 ">
          <label for="name">{{ $t("auth.name") }}</label>
          <input id="name" v-model="name" type="text" required/>
          <span v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</span>
        </div>
      </transition>
      <div class="flex mb-4 gap-3">
        <label for="login">{{ $t("auth.email") }}</label>
        <input id="login" v-model="emailValue" type="email" required/>
        <span v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</span>
      </div>
      <div class="flex mb-4 gap-3">
        <label for="pass">{{ $t("auth.password") }}</label>
        <input id="pass" v-model="password" type="password" required/>
        <span v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</span>
      </div>
      <button :disabled="loading || !isFormValid" type="submit" :class="isRegister ? 'bg-green-500/20' : 'bg-green-300/40'" class="border border-green-500 p-2 w-full rounded hover:bg-green-500/10 disabled:opacity-50">
        {{ loading ? (isRegister ? $t("auth.registration") : $t("auth.loggining")) : (isRegister ? $t("auth.registerButton") : $t("auth.loginButton")) }}
      </button>
      <p v-if="error" class="text-red-500 mt-4">{{ error }}</p>
      <p class="mt-4">
        {{ isRegister ? $t("auth.hasAccount") : $t("auth.noAccount") }}
        <RouterLink :to="isRegister ? '/login' : '/register'" class="text-green-500">{{isRegister ? $t("nav.login") : $t("nav.register")}}</RouterLink>
      </p>
    </form>
  </main>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { email, required, min, length } from '@vee-validate/rules';
import { useField, useForm } from 'vee-validate';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

  const authStore = useAuthStore()
  const router = useRouter()
  const route = useRoute()
  const toast = useToast()
  const { t } = useI18n()

  const isRegister = computed(() => route.path === '/register')

  const { handleSubmit, errors, } = useForm({
    validationSchema: computed(() => ({
      name: isRegister.value ? required : undefined,
      email: [required, email],
      password: [required]
    })),
  })

  const {value: name} = useField('name')
  const {value: emailValue} = useField('email')
  const {value: password} = useField('password');

  const loading = ref(false)
  const error = ref('')

  const isFormValid = computed(() => !errors.value.name && !errors.value.email && !errors.value.password)

  watch(isRegister, () => {
    name.value = ''
    emailValue.value = ''
    password.value = ''
    error.value = ''
  })

  const onSubmit = handleSubmit(async (values) => {
    loading.value = true
    error.value = ''
    try {
      if (isRegister.value) {
        await authStore.register(values.name, values.email, values.password)
        toast.success(t("auth.registerSuccess"))
      }
        await authStore.login(values.email, values.password)
        toast.success(t("auth.loginSuccess"))
      router.push('/')
    } catch (e: any) {
      error.value = e.message
      isRegister.value ? toast.error(t("auth.registerError")) : toast.error(t("auth.loginError"))
    } finally {
      loading.value = false
    }
  })
</script>

<style scoped>
  .slide-enter-active,

.slide-leave-active {

  transition: all 0.3s ease;

}


.slide-enter-from {

  opacity: 0;

  transform: translateY(-20px);

}


.slide-leave-to {

  opacity: 0;

  transform: translateY(20px);

}
</style>