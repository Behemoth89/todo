import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue'), meta: { layout: 'auth' } },
  { path: '/register', name: 'register', component: () => import('@/views/RegisterView.vue'), meta: { layout: 'auth' } },
  { path: '/', name: 'todos', component: () => import('@/views/TodosView.vue'), meta: { requiresAuth: true } },
  { path: '/todos/:id', name: 'todo-detail', component: () => import('@/views/TodoDetailView.vue'), meta: { requiresAuth: true } },
  { path: '/shopping', name: 'shopping', component: () => import('@/views/ShoppingView.vue'), meta: { requiresAuth: true } },
  { path: '/photos', name: 'photos', component: () => import('@/views/PhotosView.vue'), meta: { requiresAuth: true } },
  { path: '/settings', name: 'settings', component: () => import('@/views/SettingsView.vue'), meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if ((to.name === 'login' || to.name === 'register') && token) {
    next({ name: 'todos' })
  } else {
    next()
  }
})

export default router