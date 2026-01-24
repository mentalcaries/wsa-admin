<script setup lang="ts">
import { computed } from 'vue';
import {
  UserPlus,
  CheckCircle,
  FileText,
  CreditCard,
  AlertTriangle,
  XCircle,
} from 'lucide-vue-next';
import type { Activity, ActivityType } from '~/types';
import ScrollArea from '../ui/scroll-area/ScrollArea.vue';

interface Props {
  activities: Activity[];
}

const props = defineProps<Props>();

const activityIcons: Record<ActivityType, any> = {
  signup: UserPlus,
  verified: CheckCircle,
  report: FileText,
  subscription: CreditCard,
  warning: AlertTriangle,
  error: XCircle,
};

const activityColors: Record<ActivityType, string> = {
  signup: 'text-success',
  verified: 'text-success',
  report: 'text-primary',
  subscription: 'text-primary',
  warning: 'text-warning',
  error: 'text-destructive',
};

const displayedActivities = computed(() => props.activities.slice(0, 10));

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}
</script>

<template>
  <div
    class="flex h-full flex-col rounded-lg border border-border bg-card shadow-sm"
  >
    <div
      class="flex items-center justify-between border-b border-border px-6 py-4"
    >
      <h2 class="text-base font-semibold text-foreground">Recent Activity</h2>
    </div>
    <ScrollArea class="h-96">
      <ul class="divide-y divide-border">
        <li
          v-for="activity in displayedActivities"
          :key="activity.id"
          class="flex items-start gap-4 px-6 py-4 transition-colors hover:bg-muted/50"
        >
          <span :class="['mt-0.5', activityColors[activity.type]]">
            <component :is="activityIcons[activity.type]" class="h-4 w-4" />
          </span>
          <div class="flex-1 min-w-0">
            <p class="text-sm leading-relaxed text-foreground">
              {{ activity.message }}
            </p>
            <p
              v-if="activity.details"
              class="mt-1 text-xs text-muted-foreground truncate"
            >
              {{ activity.details }}
            </p>
          </div>
          <span class="shrink-0 text-xs text-muted-foreground">
            {{ formatTimeAgo(activity.timestamp) }}
          </span>
        </li>
      </ul>
    </ScrollArea>
    <div class="border-t border-border px-6 py-4">
      <NuxtLink
        to="/activity"
        class="text-sm font-medium text-primary hover:underline"
      >
        View All Activity
      </NuxtLink>
    </div>
  </div>
</template>
