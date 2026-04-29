import { defineStore } from 'pinia'
import { ref } from 'vue'
import { settingsApi } from '@/services/settings'

export const useSettingsStore = defineStore('settings', () => {
  const familyMembers = ref<{ id: string; name: string }[]>([])
  const locations = ref<{ id: string; name: string }[]>([])
  const priorities = ref<{ id: string; name: string }[]>([])
  const loading = ref(false)

  async function fetchAll() {
    loading.value = true
    try {
      const [members, locationsData, prioritiesData] = await Promise.all([
        settingsApi.getFamilyMembers(),
        settingsApi.getLocations(),
        settingsApi.getPriorities(),
      ])
      familyMembers.value = members
      locations.value = locationsData
      priorities.value = prioritiesData
    } finally {
      loading.value = false
    }
  }

  async function addFamilyMember(name: string) {
    const member = await settingsApi.addFamilyMember(name)
    familyMembers.value.push(member)
  }

  async function updateFamilyMember(id: string, name: string) {
    const updated = await settingsApi.updateFamilyMember(id, name)
    const index = familyMembers.value.findIndex(m => m.id === id)
    if (index >= 0) familyMembers.value[index] = updated
  }

  async function deleteFamilyMember(id: string) {
    await settingsApi.deleteFamilyMember(id)
    familyMembers.value = familyMembers.value.filter(m => m.id !== id)
  }

  async function addLocation(name: string) {
    const location = await settingsApi.addLocation(name)
    locations.value.push(location)
  }

  async function updateLocation(id: string, name: string) {
    const updated = await settingsApi.updateLocation(id, name)
    const index = locations.value.findIndex(l => l.id === id)
    if (index >= 0) locations.value[index] = updated
  }

  async function deleteLocation(id: string) {
    await settingsApi.deleteLocation(id)
    locations.value = locations.value.filter(l => l.id !== id)
  }

  return {
    familyMembers,
    locations,
    priorities,
    loading,
    fetchAll,
    addFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,
    addLocation,
    updateLocation,
    deleteLocation,
  }
})