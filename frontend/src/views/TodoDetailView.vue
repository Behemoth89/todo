<template>
  <div v-if="loading" class="text-center py-8">
    <v-progress-circular indeterminate color="primary" />
  </div>

  <div v-else-if="todo">
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="d-flex align-center">
        <v-btn icon="mdi-arrow-left" variant="text" to="/" />
        <h1 class="text-h5 ml-2">{{ todo.title }}</h1>
      </div>
      <div>
        <v-btn color="primary" @click="editDialog = true">Edit</v-btn>
        <v-btn color="error" @click="deleteDialog = true" class="ml-2">Delete</v-btn>
      </div>
    </div>

    <v-card class="mb-4">
      <v-card-text>
        <p v-if="todo.description">{{ todo.description }}</p>
        
        <div class="mt-4">
          <v-chip class="mr-2">{{ todo.priority }}</v-chip>
          <v-chip v-for="a in todo.assignees" :key="a.id" class="mr-2">
            {{ a.name }}
          </v-chip>
          <v-chip v-if="todo.location">{{ todo.location.name }}</v-chip>
        </div>
        
        <v-row class="mt-4">
          <v-col cols="6">
            <strong>Start:</strong> {{ todo.startDate || '—' }}
          </v-col>
          <v-col cols="6">
            <strong>Due:</strong> {{ todo.dueDate || '—' }}
          </v-col>
        </v-row>
        
        <v-row v-if="todo.completedAt">
          <v-col>
            <strong>Completed:</strong> {{ todo.completedAt }}
          </v-col>
        </v-row>
        
        <div class="mt-4">
          <v-chip v-if="todo.readyToExecute" color="success">Ready to Execute</v-chip>
          <v-chip v-else color="warning">Not Ready</v-chip>
        </div>
      </v-card-text>
    </v-card>

    <!-- Shopping Items Section -->
    <v-card class="mb-4">
      <v-card-title class="d-flex align-center">
        Shopping Items
        <v-spacer />
        <v-btn size="small" @click="addShoppingDialog = true">
          <v-icon left>mdi-plus</v-icon>
          Add
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-list v-if="shoppingItems.length">
          <v-list-item v-for="item in shoppingItems" :key="item.id">
            <template #prepend>
              <v-checkbox :model-value="item.bought" @update:model-value="toggleBought(item.id)" />
            </template>
            <v-list-item-title :class="{ 'text-decoration-line-through': item.bought }">
              {{ item.description }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ item.amount }} × ${{ item.price }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
        <p v-else class="text-grey">No shopping items</p>
      </v-card-text>
    </v-card>

    <!-- Photos Section -->
    <v-card>
      <v-card-title class="d-flex align-center">
        Photos
        <v-spacer />
        <v-btn size="small" @click="uploadPhoto">
          <v-icon left>mdi-camera</v-icon>
          Upload
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row v-if="photos.length">
          <v-col v-for="photo in photos" :key="photo.id" cols="4">
            <v-img :src="photo.thumbnailUrl" aspect-ratio="1" cover @click="viewPhoto(photo)" />
          </v-col>
        </v-row>
        <p v-else class="text-grey">No photos</p>
      </v-card-text>
    </v-card>
  </div>

  <v-dialog v-model="editDialog" max-width="600">
    <todo-form v-if="todo" :todo="todo" @cancel="editDialog = false" @saved="handleSaved" />
  </v-dialog>

  <v-dialog v-model="addShoppingDialog" max-width="400">
    <shopping-item-form v-if="todo" :todo-id="todo.id" @cancel="addShoppingDialog = false" @saved="handleShoppingSaved" />
  </v-dialog>

  <input ref="fileInput" type="file" accept="image/*" multiple hidden @change="handleFileSelect" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { todosApi, type Todo } from '@/services/todos'
import { shoppingApi, type ShoppingItem } from '@/services/shopping'
import { photosApi, type Photo } from '@/services/photos'
import TodoForm from '@/components/todos/TodoForm.vue'
import ShoppingItemForm from '@/components/shopping/ShoppingItemForm.vue'

const route = useRoute()
const router = useRouter()

const todo = ref<Todo | null>(null)
const shoppingItems = ref<ShoppingItem[]>([])
const photos = ref<Photo[]>([])
const loading = ref(false)
const editDialog = ref(false)
const addShoppingDialog = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

async function fetchDetail() {
  loading.value = true
  try {
    const id = route.params.id as string
    todo.value = await todosApi.get(id)
    shoppingItems.value = await shoppingApi.list({ todoId: id })
    photos.value = await photosApi.list(id)
  } finally {
    loading.value = false
  }
}

async function handleSaved() {
  editDialog.value = false
  await fetchDetail()
}

async function handleShoppingSaved() {
  addShoppingDialog.value = false
  const id = route.params.id as string
  shoppingItems.value = await shoppingApi.list({ todoId: id })
}

async function toggleBought(id: string) {
  await shoppingApi.toggleBought(id)
  shoppingItems.value = shoppingItems.value.map(i =>
    i.id === id ? { ...i, bought: !i.bought } : i
  )
}

function uploadPhoto() {
  fileInput.value?.click()
}

async function handleFileSelect(e: Event) {
  const input = e.target as HTMLInputElement
  const files = input.files
  if (!files?.length || !todo.value) return
  
  for (const file of files) {
    await photosApi.upload(todo.value.id, file)
  }
  await fetchDetail()
}

function viewPhoto(photo: Photo) {
  // Open photo viewer
}

onMounted(fetchDetail)
</script>