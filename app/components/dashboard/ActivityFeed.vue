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
import ScrollArea from '../ui/scroll-area/ScrollArea.vue';

interface Props {
  activities: readonly any[];
}

const props = defineProps<Props>();

const eventTypeMap: Record<
  string,
  { icon: any; color: string; label: string }
> = {
  user_signed_up: {
    icon: UserPlus,
    color: 'text-success',
    label: 'User signed up',
  },
  email_verified: {
    icon: CheckCircle,
    color: 'text-success',
    label: 'Email verified',
  },
  report_created: {
    icon: FileText,
    color: 'text-primary',
    label: 'Report created',
  },
  subscription_active: {
    icon: CreditCard,
    color: 'text-primary',
    label: 'Subscription activated',
  },
  subscription_canceled: {
    icon: XCircle,
    color: 'text-destructive',
    label: 'Subscription canceled',
  },
  checkout_started: {
    icon: CreditCard,
    color: 'text-primary',
    label: 'Checkout started',
  },
  checkout_abandoned: {
    icon: AlertTriangle,
    color: 'text-warning',
    label: 'Checkout abandoned',
  },
  report_limit_reached: {
    icon: AlertTriangle,
    color: 'text-warning',
    label: 'Report limit reached',
  },
  $exception: {
    icon: XCircle,
    color: 'text-destructive',
    label: 'Error occurred',
  },
};

const displayedActivities = computed(() => props.activities.slice(0, 10));

function formatTimeAgo(timestamp: string): string {
  const date = new Date(timestamp);
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

function getEventConfig(eventName: string) {
  return (
    eventTypeMap[eventName] || {
      icon: FileText,
      color: 'text-muted-foreground',
      label: eventName,
    }
  );
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
          v-for="(activity, index) in displayedActivities"
          :key="index"
          class="flex items-start gap-4 px-6 py-4 transition-colors hover:bg-muted/50"
        >
          <span :class="['mt-0.5', getEventConfig(activity[0]).color]">
            <component :is="getEventConfig(activity[0]).icon" class="h-4 w-4" />
          </span>
          <div class="flex-1 min-w-0">
            <p class="text-sm leading-relaxed text-foreground">
              {{ getEventConfig(activity[0]).label }}
            </p>
          </div>
          <span class="shrink-0 text-xs text-muted-foreground">
            {{ formatTimeAgo(activity[1]) }}
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
