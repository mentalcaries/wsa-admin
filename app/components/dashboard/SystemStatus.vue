<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Service, ServiceStatus } from '~/types'

interface Props {
  services: Service[]
}

defineProps<Props>()

const statusConfig: Record<ServiceStatus, { label: string; color: string }> = {
  operational: { label: 'Operational', color: '#10b981' },
  degraded: { label: 'Degraded', color: '#f59e0b' },
  down: { label: 'Down', color: '#ef4444' },
}

const lastChecked = ref(new Date())
const secondsAgo = ref(0)
let interval: ReturnType<typeof setInterval> | null = null

const updateSecondsAgo = () => {
  const now = new Date()
  secondsAgo.value = Math.floor((now.getTime() - lastChecked.value.getTime()) / 1000)
}

onMounted(() => {
  interval = setInterval(() => {
    lastChecked.value = new Date()
    secondsAgo.value = 0
  }, 30000)
  
  const secondInterval = setInterval(updateSecondsAgo, 1000)
  
  onUnmounted(() => {
    if (interval) clearInterval(interval)
    clearInterval(secondInterval)
  })
})
</script>

<template>
  <div class="rounded-lg border border-border bg-card shadow-sm">
    <div class="border-b border-border px-6 py-4">
      <h2 class="text-base font-semibold text-foreground">System Status</h2>
    </div>
    <ul class="divide-y divide-border/50">
      <li
        v-for="service in services"
        :key="service.name"
        class="flex items-center justify-between px-6 py-4 transition-colors hover:bg-muted/50"
      >
        <span class="text-sm font-medium text-foreground">
          {{ service.name }}
        </span>
        <span 
          class="flex items-center gap-2 text-sm"
          :style="{ color: statusConfig[service.status].color }"
        >
          {{ statusConfig[service.status].label }}
          <span 
            class="h-3 w-3 rounded-full"
            :style="{ backgroundColor: statusConfig[service.status].color }"
          />
        </span>
      </li>
    </ul>
    <div class="border-t border-border/50 px-6 py-3">
      <p class="text-xs text-muted-foreground">
        Last checked: {{ secondsAgo }} seconds ago
      </p>
    </div>
  </div>
</template>