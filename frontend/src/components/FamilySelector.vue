<script setup lang="ts">
const mode = defineModel<'create' | 'join'>('mode')
const familyName = defineModel<string>('familyName')
const inviteCode = defineModel<string>('inviteCode')
</script>

<template>
  <div class="space-y-4">
    <div class="flex gap-4">
      <label class="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          :value="'create'"
          v-model="mode"
          class="w-4 h-4"
        />
        <span>Create new family</span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          :value="'join'"
          v-model="mode"
          class="w-4 h-4"
        />
        <span>Join existing family</span>
      </label>
    </div>

    <div v-if="mode === 'create'">
      <label class="block text-sm font-medium mb-1">Family Name</label>
      <input
        v-model="familyName"
        type="text"
        required
        class="w-full"
        placeholder="My Family"
      />
    </div>

    <div v-else>
      <label class="block text-sm font-medium mb-1">Invite Code</label>
      <input
        v-model="inviteCode"
        type="text"
        required
        class="w-full"
        placeholder="Enter 8-character code"
        maxlength="20"
      />
    </div>
  </div>
</template>