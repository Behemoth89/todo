<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-4">
      <h1 class="text-h5">Todos</h1>
      <v-btn color="primary" @click="openCreate">
        <v-icon left>mdi-plus</v-icon>
        Create Todo
      </v-btn>
    </div>

    <v-card v-if="loading">
      <v-card-text class="text-center">
        <v-progress-circular indeterminate color="primary" />
      </v-card-text>
    </v-card>

    <v-card v-else-if="error">
      <v-card-text>
        <v-alert type="error">{{ error }}</v-alert>
      </v-card-text>
    </v-card>

    <v-card v-else-if="!todos.length">
      <v-card-text class="text-center py-8">
        <v-icon size="64" color="grey-lighten-1">mdi-checkbox-marked-circle-outline</v-icon>
        <p class="text-h6 mt-4">No todos yet</p>
        <p class="text-body-2 text-grey">Tap + to create your first todo</p>
      </v-card-text>
    </v-card>

    <div v-else>
      <div class="mb-4">
        <v-btn-toggle v-model="sortBy" mandatory density="compact">
          <v-btn value="dueDate">Due</v-btn>
          <v-btn value="priority">Priority</v-btn>
          <v-btn value="title">Title</v-btn>
          <v-btn value="location">Location</v-btn>
        </v-btn-toggle>
      </div>

      <todo-card
        v-for="todo in sortedTodos"
        :key="todo.id"
        :todo="todo"
        @edit="openEdit(todo)"
        @delete="handleDelete(todo.id)"
        @complete="handleComplete(todo.id)"
        @uncomplete="handleUncomplete(todo.id)"
        class="mb-2"
      />
    </div>

    <v-dialog v-model="dialog" max-width="600">
      <todo-form
        v-if="dialog"
        :todo="selectedTodo"
        @cancel="dialog = false"
        @saved="handleSaved"
      />
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTodoStore } from '@/stores/todos'
import { useSettingsStore } from '@/stores/settings'
import TodoCard from '@/components/todos/TodoCard.vue'
import TodoForm from '@/components/todos/TodoForm.vue'
import type { Todo } from '@/services/todos'

const todoStore = useTodoStore()
const settingsStore = useSettingsStore()

const dialog = ref(false)
const selectedTodo = ref<Todo | undefined>()

const todos = computed(() => todoStore.sortedItems)
const loading = computed(() => todoStore.loading)
const error = computed(() => todoStore.error)
const sortBy = computed({
  get: () => todoStore.sortBy,
  set: (v: any) => { todoStore.sortBy = v; todoStore.fetchTodos() },
})

const sortedTodos = computed(() => todoStore.sortedItems)

onMounted(async () => {
  await Promise.all([todoStore.fetchTodos(), settingsStore.fetchAll()])
})

function openCreate() {
  selectedTodo.value = undefined
  dialog.value = true
}

function openEdit(todo: Todo) {
  selectedTodo.value = todo
  dialog.value = true
}

async function handleDelete(id: string) {
  await todoStore.deleteTodo(id)
}

async function handleComplete(id: string) {
  await todoStore.completeTodo(id)
}

async function handleUncomplete(id: string) {
  await todoStore.uncompleteTodo(id)
}

function handleSaved() {
  dialog.value = false
}
</script>