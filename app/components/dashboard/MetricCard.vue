<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'

interface Props {
  icon: Component
  value: string | number
  label: string
  variant?: 'default' | 'warning' | 'error'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
})

const formattedValue = computed(() => {
  return typeof props.value === 'number' ? props.value.toLocaleString() : props.value
})
</script>

<template>
  <div class="flex flex-col items-center rounded-lg border border-border bg-card p-6 shadow-sm">
    <span
      :class="[
        'mb-3',
        variant === 'error'
          ? 'text-destructive'
          : variant === 'warning'
            ? 'text-warning'
            : 'text-muted-foreground'
      ]"
    >
      <component :is="icon" class="h-6 w-6" />
    </span>
    <span
      :class="[
        'text-3xl font-semibold',
        variant === 'error'
          ? 'text-destructive'
          : variant === 'warning'
            ? 'text-warning'
            : 'text-foreground'
      ]"
    >
      {{ formattedValue }}
    </span>
    <span class="mt-1 text-sm text-muted-foreground">{{ label }}</span>
  </div>
</template>