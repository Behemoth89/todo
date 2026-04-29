<template>
  <v-card>
    <v-card-title>{{ isEdit ? 'Edit Item' : 'Add Item' }}</v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid" @submit.prevent="submit">
        <v-select
          v-model="formData.todoId"
          :items="todos"
          item-title="title"
          item-value="id"
          label="Todo"
          :rules="[rules.required]"
        />
        <v-text-field
          v-model="formData.description"
          label="Description"
          :rules="[rules.required]"
        />
        <v-text-field
          v-model.number="formData.amount"
          label="Amount"
          type="number"
        />
        <v-text-field
          v-model.number="formData.price"
          label="Price"
          type="number"
          prefix="$"
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
        {{ isEdit ? 'Update' : 'Add Item' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useShoppingStore } from '@/stores/shopping'
import { useTodoStore } from '@/stores/todos'
import type { ShoppingItem } from '@/services/shopping'

const props = defineProps<{ item?: ShoppingItem }>()
const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'saved'): void
}>()

const shoppingStore = useShoppingStore()
const todoStore = useTodoStore()

const valid = ref(false)
const isEdit = computed(() => !!props.item)

const formData = reactive({
  todoId: props.item?.todoId ?? '',
  description: props.item?.description ?? '',
  amount: props.item?.amount ?? 1,
  price: props.item?.price ?? 0,
  notes: props.item?.notes ?? '',
})

const todos = computed(() => todoStore.items)

const rules = {
  required: (v: string) => !!v || 'Required',
}

onMounted(() => {
  if (!todoStore.items.length) todoStore.fetchTodos()
})

async function submit() {
  if (!valid.value) return
  
  try {
    if (isEdit.value) {
      await shoppingStore.updateItem(props.item!.id, formData)
    } else {
      await shoppingStore.createItem(formData)
    }
    emit('saved')
  } catch (error) {
    console.error('Failed to save item:', error)
  }
}
</script>