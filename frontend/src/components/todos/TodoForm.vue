<template>
  <v-card>
    <v-card-title>{{ isEdit ? 'Edit Todo' : 'New Todo' }}</v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid" @submit.prevent="submit">
        <v-text-field
          v-model="formData.title"
          label="Title"
          :rules="[rules.required]"
          required
        />
        
        <v-textarea
          v-model="formData.description"
          label="Description"
          rows="3"
        />
        
        <v-select
          v-model="formData.priority"
          :items="priorities"
          label="Priority"
        />
        
        <v-combobox
          v-model="formData.assignees"
          :items="familyMembers"
          item-title="name"
          item-value="id"
          label="Assignees"
          multiple
          chips
        />
        
        <v-select
          v-model="formData.locationId"
          :items="locations"
          item-title="name"
          item-value="id"
          label="Location"
        />
        
        <v-text-field
          v-model="formData.startDate"
          label="Start Date"
          type="date"
        />
        
        <v-text-field
          v-model="formData.dueDate"
          label="Due Date"
          type="date"
        />
        
        <v-textarea
          v-model="formData.notes"
          label="Notes"
          rows="2"
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn @click="$emit('cancel')">Cancel</v-btn>
      <v-btn color="primary" :disabled="!valid" @click="submit">
        {{ isEdit ? 'Update' : 'Create' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useTodoStore } from '@/stores/todos'
import { useSettingsStore } from '@/stores/settings'
import type { Todo } from '@/services/todos'

const props = defineProps<{ todo?: Todo }>()
const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'saved', todo: Todo): void
}>()

const todoStore = useTodoStore()
const settingsStore = useSettingsStore()

const valid = ref(false)
const isEdit = computed(() => !!props.todo)

const formData = reactive({
  title: props.todo?.title ?? '',
  description: props.todo?.description ?? '',
  priority: props.todo?.priority ?? 'medium',
  assignees: props.todo?.assignees ?? [],
  locationId: props.todo?.location?.id ?? '',
  startDate: props.todo?.startDate ?? '',
  dueDate: props.todo?.dueDate ?? '',
  notes: props.todo?.notes ?? '',
})

const priorities = ['low', 'medium', 'high', 'urgent']
const familyMembers = computed(() => settingsStore.familyMembers)
const locations = computed(() => settingsStore.locations)

const rules = {
  required: (v: string) => !!v || 'Required',
}

async function submit() {
  if (!valid.value) return
  
  try {
    const input = {
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      assigneeIds: formData.assignees.map((a: any) => a.id || a),
      locationId: formData.locationId,
      startDate: formData.startDate || undefined,
      dueDate: formData.dueDate || undefined,
      notes: formData.notes,
    }
    
    let saved: Todo
    if (isEdit.value) {
      saved = await todoStore.updateTodo(props.todo!.id, input)
    } else {
      saved = await todoStore.createTodo(input)
    }
    emit('saved', saved)
  } catch (error) {
    console.error('Failed to save todo:', error)
  }
}
</script>