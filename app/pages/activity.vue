<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  CheckCircle,
  FileText,
  CreditCard,
  AlertTriangle,
  XCircle,
} from 'lucide-vue-next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Activity, ActivityType } from '~/types';
import { generateAllActivities } from '~/utils/activity-data';

const ITEMS_PER_PAGE = 50;

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

const eventTypeLabels: Record<string, string> = {
  all: 'All Events',
  signup: 'Signups',
  verified: 'Verified',
  report: 'Reports',
  subscription: 'Subscriptions',
  warning: 'Warnings',
  error: 'Errors',
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function formatDateHeader(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const dateOnly = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  if (dateOnly.getTime() === today.getTime()) return 'Today';
  if (dateOnly.getTime() === yesterday.getTime()) return 'Yesterday';

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function getDateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

const allActivities = generateAllActivities();
const dateRange = ref('7');
const eventType = ref('all');
const searchQuery = ref('');
const currentPage = ref(1);

const filteredActivities = computed(() => {
  const now = new Date();
  const daysAgo = parseInt(dateRange.value);
  const cutoffDate = new Date(now.getTime() - daysAgo * 86400000);

  return allActivities.filter((activity) => {
    if (activity.timestamp < cutoffDate) return false;

    if (eventType.value !== 'all' && activity.type !== eventType.value)
      return false;

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      const matchesMessage = activity.message.toLowerCase().includes(query);
      const matchesDetails = activity.details?.toLowerCase().includes(query);
      if (!matchesMessage && !matchesDetails) return false;
    }

    return true;
  });
});

const totalPages = computed(() =>
  Math.ceil(filteredActivities.value.length / ITEMS_PER_PAGE),
);

const paginatedActivities = computed(() => {
  return filteredActivities.value.slice(
    (currentPage.value - 1) * ITEMS_PER_PAGE,
    currentPage.value * ITEMS_PER_PAGE,
  );
});

const groupedActivities = computed(() => {
  const groups: { date: string; header: string; activities: Activity[] }[] = [];
  let currentDateKey = '';

  for (const activity of paginatedActivities.value) {
    const dateKey = getDateKey(activity.timestamp);
    if (dateKey !== currentDateKey) {
      currentDateKey = dateKey;
      groups.push({
        date: dateKey,
        header: formatDateHeader(activity.timestamp),
        activities: [activity],
      });
    } else {
      const lastGroup = groups[groups.length - 1];
      if (lastGroup) {
        lastGroup.activities.push(activity);
      }
    }
  }

  return groups;
});

const paginationPages = computed(() => {
  const pages: number[] = [];
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else if (current <= 3) {
    for (let i = 1; i <= 5; i++) pages.push(i);
  } else if (current >= total - 2) {
    for (let i = total - 4; i <= total; i++) pages.push(i);
  } else {
    for (let i = current - 2; i <= current + 2; i++) pages.push(i);
  }

  return pages;
});

watch([dateRange, eventType, searchQuery], () => {
  currentPage.value = 1;
});

const goToPrevPage = () => {
  currentPage.value = Math.max(1, currentPage.value - 1);
};

const goToNextPage = () => {
  currentPage.value = Math.min(totalPages.value, currentPage.value + 1);
};

const goToPage = (page: number) => {
  currentPage.value = page;
};
</script>

<template>
  <div class="min-h-screen bg-background">
    <AdminNav />

    <main class="pt-14">
      <div class="mx-auto max-w-5xl px-6 py-10">
        <!-- Header -->
        <div class="mb-8">
          <div
            class="flex items-center gap-2 text-sm text-muted-foreground mb-2"
          >
            <NuxtLink to="/" class="hover:text-foreground">Dashboard</NuxtLink>
            <span>/</span>
            <span>Activity History</span>
          </div>
          <h1 class="text-2xl font-semibold text-foreground">
            Activity History
          </h1>
        </div>

        <!-- Filters -->
        <div class="mb-6 flex flex-wrap items-center gap-4">
          <Select v-model="dateRange">
            <SelectTrigger class="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>

          <Select v-model="eventType">
            <SelectTrigger class="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="(label, value) in eventTypeLabels"
                :key="value"
                :value="value"
              >
                {{ label }}
              </SelectItem>
            </SelectContent>
          </Select>

          <div class="relative flex-1 min-w-50 max-w-75">
            <Search
              class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              v-model="searchQuery"
              placeholder="Search activity..."
              class="pl-9"
            />
          </div>
        </div>

        <!-- Results count -->
        <p class="mb-4 text-sm text-muted-foreground">
          Showing {{ (currentPage - 1) * ITEMS_PER_PAGE + 1 }}-{{
            Math.min(currentPage * ITEMS_PER_PAGE, filteredActivities.length)
          }}
          of {{ filteredActivities.length }} events
        </p>

        <!-- Activity List -->
        <div class="rounded-lg border border-border bg-card shadow-sm">
          <div
            v-if="groupedActivities.length === 0"
            class="px-6 py-12 text-center text-muted-foreground"
          >
            No activities found matching your filters.
          </div>

          <div v-else v-for="group in groupedActivities" :key="group.date">
            <!-- Date Header -->
            <div
              class="sticky top-14 z-10 border-b border-border bg-muted/80 px-6 py-3 backdrop-blur-sm"
            >
              <h3 class="text-sm font-medium text-foreground">
                {{ group.header }}
              </h3>
            </div>

            <!-- Activities for this date -->
            <ul class="divide-y divide-border">
              <li
                v-for="activity in group.activities"
                :key="activity.id"
                class="flex items-start gap-4 px-6 py-4 transition-colors hover:bg-muted/50"
              >
                <span :class="['mt-0.5', activityColors[activity.type]]">
                  <component
                    :is="activityIcons[activity.type]"
                    class="h-4 w-4"
                  />
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
                  {{ formatTime(activity.timestamp) }}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Pagination -->
        <div
          v-if="totalPages > 1"
          class="mt-6 flex items-center justify-center gap-2"
        >
          <Button
            variant="outline"
            size="sm"
            :disabled="currentPage === 1"
            @click="goToPrevPage"
          >
            <ChevronLeft class="h-4 w-4 mr-1" />
            Previous
          </Button>

          <div class="flex items-center gap-1">
            <Button
              v-for="pageNum in paginationPages"
              :key="pageNum"
              :variant="currentPage === pageNum ? 'default' : 'outline'"
              size="sm"
              class="w-9"
              @click="goToPage(pageNum)"
            >
              {{ pageNum }}
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            :disabled="currentPage === totalPages"
            @click="goToNextPage"
          >
            Next
            <ChevronRight class="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </main>
  </div>
</template>
