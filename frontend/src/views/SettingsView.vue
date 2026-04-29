<template>
  <div>
    <h1 class="text-h5 mb-4">Settings</h1>

    <v-card class="mb-4">
      <v-card-title>Family Members</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item v-for="member in familyMembers" :key="member.id">
            <v-list-item-title>{{ member.name }}</v-list-item-title>
            <template #append>
              <v-btn icon size="small" @click="editMember(member)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon size="small" color="error" @click="deleteMember(member.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-list-item>
        </v-list>
        <v-btn color="primary" class="mt-2" @click="addMemberDialog = true">
          <v-icon left>mdi-plus</v-icon>
          Add Member
        </v-btn>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title>Locations</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item v-for="location in locations" :key="location.id">
            <v-list-item-title>{{ location.name }}</v-list-item-title>
            <template #append>
              <v-btn icon size="small" @click="editLocation(location)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon size="small" color="error" @click="deleteLocation(location.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-list-item>
        </v-list>
        <v-btn color="primary" class="mt-2" @click="addLocationDialog = true">
          <v-icon left>mdi-plus</v-icon>
          Add Location
        </v-btn>
      </v-card-text>
    </v-card>

    <v-dialog v-model="addMemberDialog" max-width="400">
      <v-card>
        <v-card-title>Add Family Member</v-card-title>
        <v-card-text>
          <v-text-field v-model="memberName" label="Name" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="addMemberDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="addMember">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="addLocationDialog" max-width="400">
      <v-card>
        <v-card-title>Add Location</v-card-title>
        <v-card-text>
          <v-text-field v-model="locationName" label="Name" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="addLocationDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="addLocation">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()

const familyMembers = computed(() => settingsStore.familyMembers)
const locations = computed(() => settingsStore.locations)

const addMemberDialog = ref(false)
const addLocationDialog = ref(false)
const memberName = ref('')
const locationName = ref('')

onMounted(() => {
  settingsStore.fetchAll()
})

async function addMember() {
  if (memberName.value) {
    await settingsStore.addFamilyMember(memberName.value)
    memberName.value = ''
    addMemberDialog.value = false
  }
}

async function deleteMember(id: string) {
  await settingsStore.deleteFamilyMember(id)
}

async function addLocation() {
  if (locationName.value) {
    await settingsStore.addLocation(locationName.value)
    locationName.value = ''
    addLocationDialog.value = false
  }
}

async function deleteLocation(id: string) {
  await settingsStore.deleteLocation(id)
}

function editMember(member: any) {
  memberName.value = member.name
}

function editLocation(location: any) {
  locationName.value = location.name
}
</script>