<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime?: number;
  error?: string;
}

interface Props {
  services: readonly HealthCheckResult[];
}

defineProps<Props>();

const statusConfig = {
  healthy: { label: 'Operational', color: '#10b981' },
  degraded: { label: 'Degraded', color: '#f59e0b' },
  down: { label: 'Down', color: '#ef4444' },
};

const lastChecked = ref(new Date());
const minutesAgo = ref(0);
let interval: ReturnType<typeof setInterval> | null = null;

const updateMinutesAgo = () => {
  const now = new Date();
  minutesAgo.value = Math.floor(
    (now.getTime() - lastChecked.value.getTime()) / (1000 * 60),
  );
};

onMounted(() => {
  const minuteInterval = setInterval(updateMinutesAgo, 60000);

  onUnmounted(() => {
    if (interval) clearInterval(interval);
    clearInterval(minuteInterval);
  });
});
</script>

<template>
  <div class="rounded-lg border border-border bg-card shadow-sm">
    <div class="border-b border-border px-6 py-4">
      <h2 class="text-base font-semibold text-foreground">System Status</h2>
    </div>
    <ul class="divide-y divide-border/50">
      <li
        v-for="service in services"
        :key="service.service"
        class="flex items-center justify-between px-6 py-4 transition-colors hover:bg-muted/50"
      >
        <span class="text-sm font-medium text-foreground">
          {{ service.service }}
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
        Last checked: {{ minutesAgo }} minutes ago
      </p>
    </div>
  </div>
</template>
