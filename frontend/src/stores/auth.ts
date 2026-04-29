import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api, ApiError } from '../api/client'

interface User {
  id: string
  email: string
  familyId: string
}

interface AuthResponse {
  user: User
}

interface InviteResponse {
  inviteCode: string
}

interface LogoutResponse {
  message: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const familyName = ref<string>('')
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  async function login(email: string, password: string): Promise<boolean> {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.post<AuthResponse>('/auth/login', { email, password })
      user.value = response.user
      return true
    } catch (err) {
      if (err instanceof ApiError) {
        error.value = err.message
      } else {
        error.value = 'Login failed'
      }
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function registerNewFamily(email: string, password: string, familyNameInput: string): Promise<boolean> {
    isLoading.value = true
    error.value = null
    familyName.value = familyNameInput

    try {
      const response = await api.post<AuthResponse>('/auth/register/new-family', {
        email,
        password,
        familyName: familyNameInput,
      })
      user.value = response.user
      familyName.value = familyNameInput
      return true
    } catch (err) {
      if (err instanceof ApiError) {
        error.value = err.message
      } else {
        error.value = 'Registration failed'
      }
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function registerJoinFamily(email: string, password: string, inviteCode: string): Promise<boolean> {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.post<AuthResponse>('/auth/register/join-family', {
        email,
        password,
        inviteCode,
      })
      user.value = response.user
      return true
    } catch (err) {
      if (err instanceof ApiError) {
        error.value = err.message
      } else {
        error.value = 'Failed to join family'
      }
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function logout(): Promise<void> {
    isLoading.value = true

    try {
      await api.post<LogoutResponse>('/auth/logout')
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      user.value = null
      familyName.value = ''
      isLoading.value = false
    }
  }

  async function generateInviteCode(code?: string, oneTimeUse = false): Promise<string | null> {
    try {
      const response = await api.post<InviteResponse>('/auth/family/invite', { code, oneTimeUse })
      return response.inviteCode
    } catch (err) {
      if (err instanceof ApiError) {
        error.value = err.message
      }
      return null
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    user,
    familyName,
    isLoading,
    error,
    isAuthenticated,
    login,
    registerNewFamily,
    registerJoinFamily,
    logout,
    generateInviteCode,
    clearError,
  }
})