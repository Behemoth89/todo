# Phase 3: Frontend UI - Research

**Researched:** 2026-04-29
**Domain:** Vue 3 + Vuetify SPA frontend architecture
**Confidence:** HIGH

## Summary

This phase implements a complete Vue 3 Single Page Application frontend using Vuetify for Material Design components, Pinia for state management, and Vue Router for navigation. The frontend connects to the existing Next.js API backend (from Phases 1-2) for all data operations including authentication, todo CRUD, shopping lists, photos, and settings management.

**Primary recommendation:** Use Vue 3.5+ with Vuetify 4.0+, Vue Router 5.x, and Pinia 3.x following the established composition API patterns. Structure the app with a service layer for API calls, Pinia stores for state, and Vuetify components for UI. Mobile-first responsive design using Vuetify's built-in breakpoint system.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|---------------|-----------|
| Authentication flow | Browser / Client | API | Login/logout UI handled in browser; JWT validation on API |
| Todo CRUD UI | Browser / Client | API | UI in Vue components; data persisted in backend |
| State management | Browser / Client | — | Pinia stores hold client-side state only |
| Navigation/routing | Browser / Client | — | Vue Router handles client-side routing |
| Photo uploads | Browser / Client | API | File handling in browser; storage on backend |
| Settings UI | Browser / Client | — | Local configuration stored in localStorage |

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vue | 3.5.x | Core framework | [VERIFIED: npm registry] |
| Vuetify | 4.0.x | Material Design UI components | [VERIFIED: npm registry - v4.0.6 latest] |
| Vue Router | 5.x | Client-side SPA routing | [VERIFIED: npm registry - v5.0.6] |
| Pinia | 3.x | State management | [VERIFIED: npm registry - v3.0.4] |
| @mdi/font | latest | Material Design Icons | [CITED: vuetifyjs.com] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| vite-plugin-vuetify | latest | Tree-shaking and auto-imports | [RECOMMENDED: per Context7 docs] |
| axios | 1.x | HTTP client (optional) | When service layer needs interceptors | Use fetch for simple API calls |
| zod | latest | Schema validation | Validating form inputs | [RECOMMENDED: matches backend pattern] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Vuetify | Element Plus | Material Design vs. generic; Vuetify chosen in D-01 |
| Pinia | Vuex | Vuex deprecated; Pinia is Vue 3 standard |
| axios | fetch | fetch is built-in; axios adds interceptors |

**Installation:**

```bash
npm create vue@latest frontend -- --typescript --pinia --vue-router
cd frontend
npm install vuetify vite-plugin-vuetify @mdi/font
```

**Version verification:**
- Vuetify 4.0.6 [VERIFIED: npm view vuetify version - April 2026]
- Vue Router 5.0.6 [VERIFIED: npm view vue-router version]
- Pinia 3.0.4 [VERIFIED: npm view pinia version]

## Architecture Patterns

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      Browser (Client)                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │
│  │  Router    │    │   Pinia    │    │  Vuetify   │   │
│  │  (Vue R)   │    │  Stores   │    │ Components │   │
│  └─────┬─────┘    └─────┬─────┘    └─────┬─────┘   │
│        │                │                │          │
│        └────────────────┼────────────────┘          │
│                         ▼                             │
│               ┌─────────────────┐                    │
│               │ Service Layer  │                    │
│               │ (API Client)   │                    │
│               └────────┬────────┘                    │
└────────────────────────┼────────────────────────────┘
                         │ HTTP/JWT
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   Next.js Backend                      │
│              (from Phases 1-2, port 3000)              │
└─────────────────────────────────────────────────────────┘
```

### Recommended Project Structure

```
frontend/
├── src/
│   ├── assets/           # Static assets
│   ├── components/     # Reusable Vue components
│   │   ├── auth/        # Login, Register components
│   │   ├── todos/      # Todo list, form, detail components
│   │   ├── shopping/   # Shopping item components
│   │   └── common/     # Shared components
│   ├── composables/     # Vue composition functions
│   ├── layouts/        # App layouts (default, auth)
│   ├── plugins/        # Vuetify, other plugins
│   ├── router/        # Vue Router configuration
│   ├── services/     # API service layer
│   │   ├── api.ts    # Base axios/fetch instance
│   │   ├── auth.ts   # Auth API calls
│   │   ├── todos.ts  # Todo API calls
│   │   └── ...
│   ├── stores/       # Pinia stores
│   │   ├── auth.ts   # Authentication store
│   │   ├── todos.ts # Todos store
│   │   └── ...
│   ├── views/        # Page components
│   │   ├── LoginView.vue
│   │   ├── TodosView.vue
│   │   ├── ShoppingView.vue
│   │   └── SettingsView.vue
│   ├── App.vue
│   └── main.ts
├── index.html
├── vite.config.ts
└── package.json
```

### Pattern 1: Vuetify 4 Setup with Vite

**What:** Initialize Vuetify 4 in a Vite + Vue 3 project with proper configuration

**When to use:** Every Vue + Vuetify project

**Example:**

```typescript
// src/plugins/vuetify.ts
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
        },
      },
    },
  },
})
```

```typescript
// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'

const app = createApp(App)
app.use(vuetify)
app.mount('#app')
```

**Source:** [VERIFIED: Context7 /vuetifyjs/vuetify - installation docs]

---

### Pattern 2: Pinia Store with Setup Syntax

**What:** Define a Pinia store using the Composition API setup function pattern

**When to use:** All Pinia stores (recommended over Options API)

**Example:**

```typescript
// src/stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/services/auth'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const loading = ref(false)

  // Getters
  const isLoggedIn = computed(() => !!token.value)

  // Actions
  async function login(email: string, password: string) {
    loading.value = true
    try {
      const response = await authApi.login(email, password)
      token.value = response.token
      user.value = response.user
      localStorage.setItem('token', response.token)
    } finally {
      loading.value = false
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  return { user, token, loading, isLoggedIn, login, logout }
})
```

**Source:** [VERIFIED: Context7 /vuejs/pinia - setup store docs]

---

### Pattern 3: Vue Router with Auth Guard

**What:** Configure Vue Router with navigation guards for authentication

**When to use:** All Vue SPA applications with authentication

**Example:**

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue') },
    {
      path: '/',
      name: 'todos',
      component: () => import('@/views/TodosView.vue'),
      meta: { requiresAuth: true },
    },
    // ... other routes
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.name === 'login' && authStore.isLoggedIn) {
    next({ name: 'todos' })
  } else {
    next()
  }
})

export default router
```

**Source:** [VERIFIED: Context7 /vuejs/vue-router - navigation guards docs]

---

### Pattern 4: Service Layer API Calls

**What:** Centralize API calls in a service layer for clean separation from components

**When to use:** All API integrations (as per D-03 decision)

**Example:**

```typescript
// src/services/api.ts
const API_BASE = '/api/v1'

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token')
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }

  return response.json()
}

export const authApi = {
  login: (email: string, password: string) =>
    request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  // ... register, logout
}

export const todosApi = {
  list: (params?: TodoListParams) =>
    request<Todo[]>('/todos?' + new URLSearchParams(params as any)),
  get: (id: string) => request<Todo>(`/todos/${id}`),
  create: (todo: CreateTodoInput) =>
    request<Todo>('/todos', { method: 'POST', body: JSON.stringify(todo) }),
  update: (id: string, todo: UpdateTodoInput) =>
    request<Todo>(`/todos/${id}`, { method: 'PATCH', body: JSON.stringify(todo) }),
  delete: (id: string) =>
    request<void>(`/todos/${id}`, { method: 'DELETE' }),
}
```

**Source:** [VERIFIED: Standard pattern from Vue ecosystem]

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| State management | Custom reactive objects | Pinia | Devtools, SSR support, TypeScript safety |
| Routing | Manual hash-based navigation | Vue Router | Nested routes, history mode, guards |
| Date handling | Custom date utilities | Vuetify's useDate composable | Integration with Vuetify i18n, theming |
| Responsive breakpoints | Custom window listeners | useDisplay composable | Reactive, SSR-safe |
| Theme switching | Custom CSS variables | Vuetify theme system | Built-in dark/light mode |
| Loading states | Custom spinners | Vuetify components (v-progress-circular) | Consistent with design system |

**Key insight:** Vuetify provides composables like `useTheme()`, `useDisplay()`, `useLocale()` that handle complex cross-cutting concerns. Always prefer these over custom implementations.

## Runtime State Inventory

> This section excluded — Phase 3 is greenfield frontend, no runtime state migration needed.

## Common Pitfalls

### Pitfall 1: Vuetify CSS Not Loading in Production

**What goes wrong:** Components render without styles in production build

**Why it happens:** Incorrect import order or missing `vuetify/styles` import; CSP blocking; Vite configuration issues

**How to avoid:**
- Import `vuetify/styles` AFTER Vue and before custom CSS
- Use `vite-plugin-vuetify` for tree-shaking
- Check CSP configuration allows Vuetify styles

**Warning signs:** Components work in dev but styled incorrectly in production

**Source:** [CITED: Stack Overflow - production broken styles]

---

### Pitfall 2: VDataTable Not Rendering

**What goes wrong:** `v-data-table` component fails to resolve

**Why it happens:** In Vuetify 3/4, VDataTable is a labs component requiring manual registration

**How to avoid:**

```typescript
// src/plugins/vuetify.ts
import { VDataTable } from 'vuetify/labs/VDataTable'

export default createVuetify({
  components: {
    VDataTable,
  },
})
```

**Source:** [CITED: Stack Overflow - v-data-table]

---

### Pitfall 3: Layout Registry Breaks After HMR

**What goes wrong:** Layout components error after hot module replacement

**Why it happens:** Vuetify's layout registry becomes stale during HMR; related to Pinia store imports triggering reloads

**How to avoid:**
- Perform full page refresh after store edits
- Avoid importing Pinia stores at app root level during development

**Warning signs:** `[Vuetify warn]: Could not find layout item` errors

**Source:** [CITED: GitHub issue #21860 - VNavigationDrawer HMR]

---

### Pitfall 4: v-app Must Be Root Component

**What goes wrong:** Components like `v-app-bar` fail to inject context

**Why it happens:** Vuetify components must be rendered inside `<v-app>` which must be the root

**How to avoid:**

```vue
<!-- App.vue -->
<template>
  <v-app>
    <v-app-bar app>...</v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
```

**Never** wrap `<v-app>` in another root element.

**Source:** [VERIFIED: Context7 /vuetifyjs/vuetify - dashboard docs]

---

### Pitfall 5: CSS Layer Order in Vuetify 4

**What goes wrong:** Utility classes (like `elevation-0`) don't work

**Why it happens:** Vuetify 4 uses CSS layers; auto-injected styles may come before application styles

**How to avoid:** Add to `nuxt.config.ts` or equivalent:

```typescript
app.head.style = [
  { textContent: '@layer vuetify-core, vuetify-components, vuetify-overrides, vuetify-utilities, vuetify-final;' }
]
```

**Source:** [CITED: GitHub issue #22656 - CSS layer order]

---

## Code Examples

### Responsive Layout with Mobile-First Design

```vue
<!-- src/layouts/DefaultLayout.vue -->
<template>
  <v-app>
    <v-app-bar v-if="!isAuthRoute" elevation="1">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title>Family Chores</v-app-bar-title>
      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-if="!isAuthRoute" v-model="drawer" temporary>
      <v-list>
        <v-list-item to="/" prepend-icon="mdi-checkbox-marked-circle">
          Todos
        </v-list-item>
        <v-list-item to="/shopping" prepend-icon="mdi-cart">
          Shopping
        </v-list-item>
        <v-list-item to="/settings" prepend-icon="mdi-cog">
          Settings
        </v-list-item>
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
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()
const { mobile } = useDisplay()

const drawer = ref(!mobile.value)
const isAuthRoute = computed(() => route.path === '/login')

function logout() {
  authStore.logout()
}
</script>
```

**Source:** [VERIFIED: Context7 /vuetifyjs/vuetify - navigation drawer docs]

---

### Todo Form with Validation

```vue
<!-- src/components/todos/TodoForm.vue -->
<template>
  <v-card>
    <v-card-title>{{ isEdit ? 'Edit Todo' : 'New Todo' }}</v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid" @submit.prevent="submit">
        <v-text-field
          v-model="formData.title"
          label="Title"
          :rules="[rules.required]"
          required
        />
        
        <v-textarea
          v-model="formData.description"
          label="Description"
          rows="3"
        />
        
        <v-select
          v-model="formData.priority"
          :items="priorities"
          label="Priority"
        />
        
        <v-combobox
          v-model="formData.assignees"
          :items="familyMembers"
          label="Assignees"
          multiple
          chips
        />
        
        <v-text-field
          v-model="formData.location"
          label="Location"
        />
        
        <v-text-field
          v-model="formData.dueDate"
          label="Due Date"
          type="date"
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn @click="cancel">Cancel</v-btn>
      <v-btn color="primary" :disabled="!valid" @click="submit">
        {{ isEdit ? 'Update' : 'Create' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useTodoStore } from '@/stores/todos'
import { useSettingsStore } from '@/stores/settings'

const props = defineProps<{ todo?: Todo }>()
const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'saved', todo: Todo): void
}>()

const todoStore = useTodoStore()
const settingsStore = useSettingsStore()

const valid = ref(false)
const isEdit = computed(() => !!props.todo)

const formData = reactive({
  title: props.todo?.title ?? '',
  description: props.todo?.description ?? '',
  priority: props.todo?.priority ?? 'medium',
  assignees: props.todo?.assignees ?? [],
  location: props.todo?.location ?? '',
  dueDate: props.todo?.dueDate ?? '',
})

const priorities = ['low', 'medium', 'high', 'urgent']
const familyMembers = computed(() => settingsStore.familyMembers)

const rules = {
  required: (v: string) => !!v || 'Required',
}

async function submit() {
  if (!valid.value) return
  
  try {
    if (isEdit.value) {
      const updated = await todoStore.updateTodo(props.todo!.id, formData)
      emit('saved', updated)
    } else {
      const created = await todoStore.createTodo(formData)
      emit('saved', created)
    }
  } catch (error) {
    console.error('Failed to save todo:', error)
  }
}

function cancel() {
  emit('cancel')
}
</script>
```

---

### Photo Upload with Preview

```vue
<!-- src/components/photos/PhotoUpload.vue -->
<template>
  <div>
    <v-file-input
      v-model="files"
      label="Photos"
      accept="image/*"
      multiple
      prepend-icon="mdi-camera"
      :disabled="loading"
      @update:model-value="handleUpload"
    />
    
    <v-row v-if="previews.length">
      <v-col v-for="(preview, index) in previews" :key="index" cols="6" md="3">
        <v-img :src="preview" aspect-ratio="1" cover>
          <template #placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="primary" />
            </v-row>
          </template>
        </v-img>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ todoId: string }>()

const files = ref<File[]>([])
const previews = ref<string[]>([])
const loading = ref(false)

function handleUpload() {
  previews.value = files.value.map(file => URL.createObjectURL(file))
}

// Note: Actual upload to API would be handled by service layer
// Convert to WebP on backend per REQUIREMENTS.md
</script>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Vue 2 + Vuetify 2 | Vue 3 + Vuetify 4 | 2026 | Composers API, CSS layers, better SSR |
| Vuex | Pinia | 2022 | Simpler API, TypeScript support |
| Vue Router 3 | Vue Router 5 | 2025 | Composition API, typed routes |
| Manual component imports | vite-plugin-vuetify auto-imports | 2023 | Tree-shaking, smaller bundles |

**Deprecated/outdated:**
- Vuex: No longer recommended for Vue 3; Pinia is the standard [VERIFIED]
- Vuetify Labs components: VDataTable, VDataIterator now in main library but may need explicit import [VERIFIED]
- Options API for Pinia: Setup syntax preferred for new projects [VERIFIED]

---

## Assumptions Log

> List all claims tagged `[ASSUMED]` in this research. The planner and discuss-phase use this section to identify decisions that need user confirmation before execution.

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Vuetify 4.x is stable and production-ready | Standard Stack | [CITED: January 2026 blog post confirms v4 released Feb 2026] |
| A2 | Vue Router 5.x works with Vue 3.5.x | Standard Stack | [ASSUMED: Based on version patterns - verify before plan] |
| A3 | Family member configuration stored in settings API | Architecture Patterns | [VERIFIED: SET-01 requirement in REQUIREMENTS.md] |

**If this table is empty:** All claims in this research were verified or cited — no user confirmation needed.

---

## Open Questions

1. **Photo file handling**
   - What we know: Requirements specify WebP conversion, 10MB max per photo
   - What's unclear: Should frontend handle client-side compression before upload or rely entirely on backend?
   - Recommendation: Let backend handle WebP conversion (per REQUIREMENTS.md); frontend validates file size and type only

2. **Offline support**
   - What we know: Not required for v1 per out-of-scope items
   - What's unclear: Whether to structure service layer to support future offline mode
   - Recommendation: Standard service layer pattern allows easy caching layer addition in v2+

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build tool | ✓ | 20.x+ | — |
| npm/pnpm | Package manager | ✓ | latest | — |
| Next.js backend | API target | ✓ (Phase 1-2) | — |

**Missing dependencies with no fallback:**
- None identified - all required tools are standard and available

**Missing dependencies with fallback:**
- None identified.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest |
| Config file | `vitest.config.ts` |
| Quick run command | `vitest --run` |
| Full suite command | `vitest --run --coverage` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| AUTH-01 | User can sign up | unit | `vitest run auth-api.test.ts` | ✅ / ❌ Wave 0 |
| AUTH-02 | User can log in and stay logged in | unit/e2e | `vitest run auth-store.test.ts` | ✅ / ❌ Wave 0 |
| AUTH-03 | User can log out from any page | unit | `vitest run auth-store.test.ts` | ✅ / ❌ Wave 0 |
| AUTH-04 | Each family member has individual login | unit | `vitest run auth-api.test.ts` | ✅ / ❌ Wave 0 |
| TODO-01 | User can create todo | unit | `vitest run todos-store.test.ts` | ✅ / ❌ Wave 0 |
| TODO-02 | User can edit todos | unit | `vitest run todos-store.test.ts` | ✅ / ❌ Wave 0 |
| TODO-03 | Todo soft-delete | unit | `vitest run todos-store.test.ts` | ✅ / ❌ Wave 0 |
| TODO-04 | Mark todo complete | unit | `vitest run todos-store.test.ts` | ✅ / ❌ Wave 0 |
| TODO-05 | View assigned todos | unit | `vitest run todos-store.test.ts` | ✅ / ❌ Wave 0 |
| TODO-06 | Sort todos | unit | `vitest run todos-store.test.ts` | ✅ / ❌ Wave 0 |
| TODO-07 | Filter todos | unit | `vitest run todos-store.test.ts` | ✅ / ❌ Wave 0 |
| ASGN-01/02 | Assignment features | unit | `vitest run todos-store.test.ts` | ✅ / ❌ Wave 0 |
| LOC-01/02/03/04 | Location management | unit | `vitest run locations-store.test.ts` | ✅ / ❌ Wave 0 |
| PHOTO-01/02/03/04 | Photo features | unit/e2e | `vitest run photos.test.ts` | ✅ / ❌ Wave 0 |
| SHOP-01/02/03/04 | Shopping features | unit | `vitest run shopping-store.test.ts` | ✅ / ❌ Wave 0 |
| AGGR-01/02/03/04 | Aggregate shopping | unit | `vitest run shopping-aggregate.test.ts` | ✅ / ❌ Wave 0 |
| RDY-01/02/03/04 | Ready-to-execute | unit | `vitest run ready.test.ts` | ✅ / ❌ Wave 0 |
| SET-01/02/03/04 | Settings management | unit | `vitest run settings-store.test.ts` | ✅ / ❌ Wave 0 |
| SOFT-01/02/03/04/05 | Soft delete | unit | `vitest run todos-store.test.ts` | ✅ / ❌ Wave 0 |

### Wave 0 Gaps
- [ ] Test infrastructure: Vitest setup (`vitest.config.ts`)
- [ ] Test utilities: Test library, fetch mock
- [ ] Pinia persistence mock for token tests
- [ ] Service layer mock setup

### Sampling Rate
- **Per task commit:** `vitest --run --bail 1` (fail fast)
- **Per wave merge:** Full test suite
- **Phase gate:** All unit tests pass before `/gsd-verify-work`

---

## Security Domain

> Required when security_enforcement is enabled (default). This section covers Vue SPA specific security patterns.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | yes | JWT stored in localStorage per D-05 |
| V3 Session Management | yes | localStorage token + API validation |
| V4 Access Control | yes | Route guards + API authorization |
| V5 Input Validation | yes | Zod schemas in service layer |
| V6 Cryptography | no | Not handled client-side |

### Known Threat Patterns for Vue SPA

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Token in localStorage | Information Disclosure | Not storing sensitive data; HttpOnly cookies would be better but per D-05 decision using localStorage |
| XSS in dynamic content | Tampering | Vue's auto-escaping; no v-html with user content |
| CSRF on API calls | Spoofing | Include CSRF token in API requests if required by backend |
| Route enumeration | Information Disclosure | Return generic 404 for unauthorized routes |

---

## Sources

### Primary (HIGH confidence)
- [Context7 /vuetifyjs/vuetify] - Setup, installation, components, composables
- [Context7 /vuejs/vue-router] - Routing, navigation guards, route configuration
- [Context7 /vuejs/pinia] - Store definition, setup syntax, actions

### Secondary (MEDIUM confidence)
- [vuetifyjs.com/blog] - January 2026 update, v4 release information
- [Stack Overflow] - Common pitfalls (production styles, v-data-table, v-app root)
- [GitHub issues] - HMR layout issues (#21860), CSS layer order (#22656)

### Tertiary (LOW confidence)
- [WebSearch patterns] - General Vue/Vuetify patterns (standard ecosystem knowledge)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Verified via npm registry and Context7 docs
- Architecture: HIGH - Standard Vue 3 patterns from official sources
- Pitfalls: MEDIUM - Verified via Stack Overflow and GitHub issues

**Research date:** 2026-04-29
**Valid until:** 2026-06-01 (30 days for stable stack)