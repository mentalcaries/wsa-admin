<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { Search, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatTime } from '~/utils/date';
import {
  ACTIVITY_ICONS,
  ACTIVITY_COLORS,
  EVENT_TYPE_LABELS,
  ITEMS_PER_PAGE,
} from '~/utils/constants';
import type { Activity } from '~/types';
import { useActivityFilters } from '~/composables/useActivityFilters';

definePageMeta({
  layout: 'dashboard',
});

const { fetchActivities } = usePostHog();

const allActivities = ref<Activity[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const dateRange = ref('7');

const {
  eventType,
  searchQuery,
  currentPage,
  filteredActivities,
  totalPages,
  groupedActivities,
  paginationPages,
  goToPrevPage,
  goToNextPage,
  goToPage,
} = useActivityFilters(allActivities);

const loadActivities = async () => {
  loading.value = true;
  error.value = null;

  try {
    allActivities.value = await fetchActivities(parseInt(dateRange.value));
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load activities';
    console.error('Error loading activities:', e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadActivities();
});

watch(dateRange, () => {
  loadActivities();
});
</script>

<template>
  <div class="min-h-screen bg-background">
    <AdminNav />

    <main class="pt-14">
      <div class="mx-auto max-w-5xl px-6 py-10">
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

        <div
          v-if="error"
          class="mb-6 rounded-lg border border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {{ error }}
        </div>

        <div class="mb-6 flex flex-wrap items-center gap-4">
          <Select v-model="dateRange">
            <SelectTrigger class="w-40">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>

          <Select v-model="eventType">
            <SelectTrigger class="w-40">
              <SelectValue placeholder="Event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="(label, value) in EVENT_TYPE_LABELS"
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

        <div v-if="loading" class="space-y-4">
          <Skeleton class="h-10 w-full" />
          <Skeleton class="h-64 w-full" />
        </div>

        <template v-else>
          <p class="mb-4 text-sm text-muted-foreground">
            Showing {{ (currentPage - 1) * ITEMS_PER_PAGE + 1 }}-{{
              Math.min(currentPage * ITEMS_PER_PAGE, filteredActivities.length)
            }}
            of {{ filteredActivities.length }} events
          </p>

          <div class="rounded-lg border border-border bg-card shadow-sm">
            <div
              v-if="groupedActivities.length === 0"
              class="px-6 py-12 text-center text-muted-foreground"
            >
              No activities found matching your filters.
            </div>

            <div v-for="group in groupedActivities" :key="group.date">
              <div
                class="sticky top-14 z-10 border-b border-border bg-muted/80 px-6 py-3 backdrop-blur-sm"
              >
                <h3 class="text-sm font-medium text-foreground">
                  {{ group.header }}
                </h3>
              </div>

              <ul class="divide-y divide-border">
                <li
                  v-for="activity in group.activities"
                  :key="activity.id"
                  class="flex items-start gap-4 px-6 py-4 transition-colors hover:bg-muted/50"
                >
                  <span :class="['mt-0.5', ACTIVITY_COLORS[activity.type]]">
                    <component
                      :is="ACTIVITY_ICONS[activity.type]"
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
        </template>
      </div>
    </main>
  </div>
</template>
