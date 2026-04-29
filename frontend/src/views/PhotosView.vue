<template>
  <div>
    <h1 class="text-h5 mb-4">Photos</h1>

    <v-card v-if="loading" class="text-center py-8">
      <v-progress-circular indeterminate color="primary" />
    </v-card>

    <v-card v-else-if="!photos.length" class="text-center py-8">
      <v-icon size="64" color="grey-lighten-1">mdi-camera-outline</v-icon>
      <p class="text-h6 mt-4">No photos</p>
      <p class="text-body-2 text-grey">Upload photos from todo details</p>
    </v-card>

    <v-row v-else>
      <v-col v-for="photo in photos" :key="photo.id" cols="6" md="3">
        <v-img
          :src="photo.thumbnailUrl"
          :alt="photo.filename"
          aspect-ratio="1"
          cover
          class="cursor-pointer"
          @click="openPhoto(photo)"
        >
          <template #placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="primary" />
            </v-row>
          </template>
        </v-img>
      </v-col>
    </v-row>

    <v-dialog v-model="viewDialog" max-width="90vw">
      <v-card v-if="selectedPhoto">
        <v-img :src="selectedPhoto.url" contain />
        <v-card-actions>
          <v-spacer />
          <v-btn color="error" @click="deletePhoto(selectedPhoto.id)">
            Delete
          </v-btn>
          <v-btn @click="viewDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { photosApi, type Photo } from '@/services/photos'

const photos = ref<Photo[]>([])
const loading = ref(false)
const viewDialog = ref(false)
const selectedPhoto = ref<Photo | null>()

async function fetchPhotos() {
  loading.value = true
  try {
    photos.value = await photosApi.list()
  } finally {
    loading.value = false
  }
}

function openPhoto(photo: Photo) {
  selectedPhoto.value = photo
  viewDialog.value = true
}

async function deletePhoto(id: string) {
  await photosApi.delete(id)
  photos.value = photos.value.filter(p => p.id !== id)
  viewDialog.value = false
}

onMounted(fetchPhotos)
</script>