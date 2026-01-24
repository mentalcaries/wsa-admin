<script setup lang="ts">
import { computed } from 'vue';
import { AlertTriangle, CheckCircle } from 'lucide-vue-next';
import type { Alert } from '~/types';

interface Props {
  alerts: Alert[];
}

const props = defineProps<Props>();

const hasAlerts = computed(() => props.alerts.length > 0);
</script>

<template>
  <div class="rounded-lg border border-border bg-card shadow-sm">
    <div
      class="flex items-center justify-between border-b border-border px-6 py-4"
    >
      <h2 class="text-base font-semibold text-foreground">Action Required</h2>
      <span
        v-if="hasAlerts"
        class="flex h-6 min-w-6 items-center justify-center rounded-full bg-warning px-2 text-xs font-medium text-warning-foreground"
      >
        {{ alerts.length }}
      </span>
    </div>
    <ul v-if="hasAlerts" class="divide-y divide-border">
      <li
        v-for="alert in alerts"
        :key="alert.id"
        class="flex items-start gap-4 px-6 py-4 transition-colors hover:bg-muted/50 cursor-pointer"
      >
        <AlertTriangle class="mt-0.5 h-4 w-4 shrink-0 text-warning" />
        <span class="text-sm leading-relaxed text-foreground">{{
          alert.message
        }}</span>
      </li>
    </ul>
    <div v-else class="flex items-center gap-3 px-6 py-5">
      <CheckCircle class="h-4 w-4 text-success" />
      <span class="text-sm text-muted-foreground">All clear!</span>
    </div>
  </div>
</template>
