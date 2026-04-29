<template>
  <v-card :class="{ 'opacity-50': todo.completed }">
    <v-card-title class="d-flex align-center">
      <v-checkbox
        :model-value="todo.completed"
        hide-details
        class="mr-2"
        @update:model-value="toggleComplete"
      />
      <span :class="{ 'text-decoration-line-through': todo.completed }">
        {{ todo.title }}
      </span>
      <v-chip
        v-if="todo.readyToExecute"
        color="success"
        size="small"
        class="ml-2"
      >
        Ready
      </v-chip>
    </v-card-title>
    
    <v-card-text v-if="todo.description">
      {{ todo.description }}
    </v-card-text>
    
    <v-card-text class="pt-0">
      <v-chip size="small" class="mr-1">{{ todo.priority }}</v-chip>
      <v-chip
        v-for="assignee in todo.assignees"
        :key="assignee.id"
        size="small"
        class="mr-1"
      >
        {{ assignee.name }}
      </v-chip>
      <v-chip v-if="todo.location" size="small">{{ todo.location.name }}</v-chip>
      <span v-if="todo.dueDate" class="ml-2 text-caption">
        Due: {{ todo.dueDate }}
      </span>
    </v-card-text>
    
    <v-card-actions>
      <v-spacer />
      <v-btn icon size="small" @click="$emit('edit', todo)">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn icon size="small" color="error" @click="$emit('delete', todo.id)">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { Todo } from '@/services/todos'

const props = defineProps<{ todo: Todo }>()
const emit = defineEmits<{
  (e: 'edit', todo: Todo): void
  (e: 'delete', id: string): void
  (e: 'complete', id: string): void
  (e: 'uncomplete', id: string): void
}>()

function toggleComplete() {
  if (props.todo.completed) {
    emit('uncomplete', props.todo.id)
  } else {
    emit('complete', props.todo.id)
  }
}
</script>