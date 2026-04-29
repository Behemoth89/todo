<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import FamilySelector from './FamilySelector.vue'

const router = useRouter()
const authStore = useAuthStore()

const mode = ref<'create' | 'join'>('create')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const familyName = ref('')
const inviteCode = ref('')

const isValid = computed(() => {
  const hasEmail = email.value.includes('@')
  const hasPassword = password.value.length >= 8
  const passwordsMatch = password.value === confirmPassword.value
  const hasFamilyInfo = mode.value === 'create' 
    ? familyName.value.length > 0 
    : inviteCode.value.length >= 8
  return hasEmail && hasPassword && passwordsMatch && hasFamilyInfo
})

async function handleSubmit() {
  if (!isValid.value) return

  let success = false
  if (mode.value === 'create') {
    success = await authStore.registerNewFamily(email.value, password.value, familyName.value)
  } else {
    success = await authStore.registerJoinFamily(email.value, password.value, inviteCode.value)
  }

  if (success) {
    router.push('/dashboard')
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-dark-bg">
    <div class="w-full max-w-md p-8 bg-dark-surface rounded-lg border border-dark-border">
      <h1 class="text-2xl font-bold mb-6 text-center">Create Account</h1>
      
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

        <div>
          <label class="block text-sm font-medium mb-1">Confirm Password</label>
          <input
            v-model="confirmPassword"
            type="password"
            required
            class="w-full"
            placeholder="Confirm password"
          />
          <p v-if="confirmPassword && password !== confirmPassword" class="text-red-400 text-xs mt-1">
            Passwords do not match
          </p>
        </div>

        <FamilySelector v-model:mode="mode" v-model:familyName="familyName" v-model:inviteCode="inviteCode" />

        <button type="submit" :disabled="!isValid || authStore.isLoading" class="w-full">
          {{ authStore.isLoading ? 'Creating account...' : 'Create Account' }}
        </button>
      </form>

      <p class="mt-4 text-center text-sm text-gray-400">
        Already have an account?
        <router-link to="/" class="text-blue-400 hover:text-blue-300">
          Login
        </router-link>
      </p>
    </div>
  </div>
</template>