<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

const isValid = computed(() => {
  return email.value.includes('@') && password.value.length >= 8
})

async function handleSubmit() {
  if (!isValid.value) return

  const success = await authStore.login(email.value, password.value)
  if (success) {
    router.push('/dashboard')
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-dark-bg">
    <div class="w-full max-w-md p-8 bg-dark-surface rounded-lg border border-dark-border">
      <h1 class="text-2xl font-bold mb-6 text-center">Login</h1>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="authStore.error" class="p-3 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm">
          {{ authStore.error }}
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full"
            placeholder="Minimum 8 characters"
          />
        </div>

        <button type="submit" :disabled="!isValid || authStore.isLoading" class="w-full">
          {{ authStore.isLoading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <p class="mt-4 text-center text-sm text-gray-400">
        Don't have an account?
        <router-link to="/register" class="text-blue-400 hover:text-blue-300">
          Register
        </router-link>
      </p>
    </div>
  </div>
</template>