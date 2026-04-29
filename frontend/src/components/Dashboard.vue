<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const inviteCode = ref('')
const showInvite = ref(false)

async function handleLogout() {
  await authStore.logout()
  router.push('/')
}

async function generateInvite() {
  const code = await authStore.generateInviteCode()
  if (code) {
    inviteCode.value = code
    showInvite.value = true
  }
}

function copyInviteCode() {
  navigator.clipboard.writeText(inviteCode.value)
}
</script>

<template>
  <div class="min-h-screen bg-dark-bg">
    <nav class="bg-dark-surface border-b border-dark-border p-4">
      <div class="max-w-4xl mx-auto flex justify-between items-center">
        <h1 class="text-xl font-bold">Family Todo</h1>
        <div class="flex items-center gap-4">
          <span class="text-gray-400">{{ authStore.user?.email }}</span>
          <button @click="handleLogout" class="text-sm">Logout</button>
        </div>
      </div>
    </nav>

    <main class="max-w-4xl mx-auto p-8">
      <div class="bg-dark-surface rounded-lg border border-dark-border p-6">
        <h2 class="text-lg font-semibold mb-4">Family</h2>
        
        <div class="space-y-3">
          <button @click="generateInvite" class="text-sm bg-blue-600 px-4 py-2 rounded">
            Generate Invite Code
          </button>

          <div v-if="showInvite" class="flex items-center gap-2 mt-2">
            <code class="bg-dark-bg px-3 py-2 rounded">{{ inviteCode }}</code>
            <button @click="copyInviteCode" class="text-sm text-gray-400 hover:text-white">
              Copy
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>