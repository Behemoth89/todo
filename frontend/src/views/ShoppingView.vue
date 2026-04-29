<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-4">
      <h1 class="text-h5">Shopping</h1>
      <v-btn color="primary" @click="addDialog = true">
        <v-icon left>mdi-plus</v-icon>
        Add Item
      </v-btn>
    </div>

    <v-card v-if="loading" class="text-center py-8">
      <v-progress-circular indeterminate color="primary" />
    </v-card>

    <v-card v-else-if="error" class="mb-4">
      <v-card-text><v-alert type="error">{{ error }}</v-alert></v-card-text>
    </v-card>

    <v-card v-else-if="!items.length" class="text-center py-8">
      <v-icon size="64" color="grey-lighten-1">mdi-cart-outline</v-icon>
      <p class="text-h6 mt-4">No shopping items</p>
      <p class="text-body-2 text-grey">Add items from your todo list</p>
    </v-card>

    <div v-else>
      <div class="mb-4">
        <v-btn-toggle v-model="showBought" mandatory density="compact">
          <v-btn :value="null">All</v-btn>
          <v-btn :value="false">To Buy</v-btn>
          <v-btn :value="true">Bought</v-btn>
        </v-btn-toggle>
      </div>

      <v-card v-for="item in filteredItems" :key="item.id" class="mb-2">
        <v-card-title class="d-flex align-center">
          <v-checkbox
            :model-value="item.bought"
            hide-details
            class="mr-2"
            @update:model-value="toggleBought(item.id)"
          />
          <span :class="{ 'text-decoration-line-through': item.bought }">
            {{ item.description }}
          </span>
        </v-card-title>
        <v-card-subtitle>
          {{ item.todoTitle }}
          <span v-if="item.amount || item.price">
            — {{ item.amount }} × ${{ item.price }}
          </span>
        </v-card-subtitle>
        <v-card-actions>
          <v-spacer />
          <v-btn icon size="small" @click="edit(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon size="small" color="error" @click="deleteItem(item.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>

    <v-dialog v-model="addDialog" max-width="500">
      <shopping-item-form @cancel="addDialog = false" @saved="handleSaved" />
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useShoppingStore } from '@/stores/shopping'
import ShoppingItemForm from '@/components/shopping/ShoppingItemForm.vue'
import type { ShoppingItem } from '@/services/shopping'

const shoppingStore = useShoppingStore()

const addDialog = ref(false)
const selectedItem = ref<ShoppingItem | undefined>()

const items = computed(() => shoppingStore.filteredItems)
const loading = computed(() => shoppingStore.loading)
const error = computed(() => shoppingStore.error)
const showBought = computed({
  get: () => shoppingStore.filterBought,
  set: (v: any) => { shoppingStore.filterBought = v },
})

const filteredItems = computed(() => shoppingStore.filteredItems)

onMounted(() => {
  shoppingStore.fetchItems()
})

function edit(item: ShoppingItem) {
  selectedItem.value = item
  addDialog.value = true
}

async function deleteItem(id: string) {
  await shoppingStore.deleteItem(id)
}

async function toggleBought(id: string) {
  await shoppingStore.toggleBought(id)
}

function handleSaved() {
  addDialog.value = false
  selectedItem.value = undefined
}
</script>