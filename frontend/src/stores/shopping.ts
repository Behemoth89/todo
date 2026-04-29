import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { shoppingApi, type ShoppingItem, type CreateShoppingItemInput } from '@/services/shopping'

export const useShoppingStore = defineStore('shopping', () => {
  const items = ref<ShoppingItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const filterBought = ref<boolean | null>(null)
  const filterTodoId = ref<string | null>(null)

  const filteredItems = computed(() => {
    let result = items.value
    if (filterBought.value !== null) {
      result = result.filter(i => i.bought === filterBought.value)
    }
    if (filterTodoId.value) {
      result = result.filter(i => i.todoId === filterTodoId.value)
    }
    return result
  })

  async function fetchItems() {
    loading.value = true
    try {
      items.value = await shoppingApi.list()
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function createItem(input: CreateShoppingItemInput) {
    const item = await shoppingApi.create(input)
    items.value.push(item)
    return item
  }

  async function updateItem(id: string, input: Partial<CreateShoppingItemInput>) {
    const updated = await shoppingApi.update(id, input)
    const index = items.value.findIndex(i => i.id === id)
    if (index >= 0) items.value[index] = updated
    return updated
  }

  async function deleteItem(id: string) {
    await shoppingApi.delete(id)
    items.value = items.value.filter(i => i.id !== id)
  }

  async function toggleBought(id: string) {
    const updated = await shoppingApi.toggleBought(id)
    const index = items.value.findIndex(i => i.id === id)
    if (index >= 0) items.value[index] = updated
  }

  return {
    items,
    loading,
    error,
    filterBought,
    filterTodoId,
    filteredItems,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    toggleBought,
  }
})