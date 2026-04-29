<template>
  <v-app>
    <v-app-bar elevation="1">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title>Family Chores</v-app-bar-title>
      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" :rail="rail">
      <v-list>
        <v-list-item to="/" prepend-icon="mdi-checkbox-marked-circle" title="Todos" />
        <v-list-item to="/shopping" prepend-icon="mdi-cart" title="Shopping" />
        <v-list-item to="/photos" prepend-icon="mdi-camera" title="Photos" />
        <v-list-item to="/settings" prepend-icon="mdi-cog" title="Settings" />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid class="pa-2 pa-md-4">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const { mobile } = useDisplay()
const authStore = useAuthStore()
const router = useRouter()

const drawer = ref(!mobile.value)
const rail = ref(false)

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>