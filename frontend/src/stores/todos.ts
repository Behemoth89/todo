import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { todosApi, type Todo, type CreateTodoInput } from '@/services/todos'

export const useTodoStore = defineStore('todos', () => {
  const items = ref<Todo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const sortBy = ref<string>('dueDate')
  const sortOrder = ref<'asc' | 'desc'>('asc')
  const filters = ref<Record<string, string>>({})

  const sortedItems = computed(() => {
    const sorted = [...items.value]
    sorted.sort((a, b) => {
      const aVal = a[sortBy.value as keyof Todo]
      const bVal = b[sortBy.value as keyof Todo]
      if (aVal === bVal) return 0
      const cmp = aVal < bVal ? -1 : 1
      return sortOrder.value === 'asc' ? cmp : -cmp
    })
    return sorted
  })

  async function fetchTodos() {
    loading.value = true
    try {
      items.value = await todosApi.list({ sortBy: sortBy.value, sortOrder: sortOrder.value })
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function createTodo(input: CreateTodoInput) {
    loading.value = true
    try {
      const todo = await todosApi.create(input)
      items.value.push(todo)
      return todo
    } finally {
      loading.value = false
    }
  }

  async function updateTodo(id: string, input: Partial<CreateTodoInput>) {
    loading.value = true
    try {
      const updated = await todosApi.update(id, input)
      const index = items.value.findIndex(t => t.id === id)
      if (index >= 0) items.value[index] = updated
      return updated
    } finally {
      loading.value = false
    }
  }

  async function deleteTodo(id: string) {
    await todosApi.delete(id)
    items.value = items.value.filter(t => t.id !== id)
  }

  async function completeTodo(id: string) {
    const updated = await todosApi.complete(id)
    const index = items.value.findIndex(t => t.id === id)
    if (index >= 0) items.value[index] = updated
  }

  async function uncompleteTodo(id: string) {
    const updated = await todosApi.uncomplete(id)
    const index = items.value.findIndex(t => t.id === id)
    if (index >= 0) items.value[index] = updated
  }

  return {
    items,
    loading,
    error,
    sortBy,
    sortOrder,
    filters,
    sortedItems,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    completeTodo,
    uncompleteTodo,
  }
})