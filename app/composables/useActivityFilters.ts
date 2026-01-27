import { computed, ref, watch } from 'vue';
import type { Activity } from '~/types';
import { getDateKey, formatDateHeader } from '~/utils/date';
import { ITEMS_PER_PAGE } from '~/utils/constants';

export const useActivityFilters = (activities: Ref<Activity[]>) => {
  const eventType = ref('all');
  const searchQuery = ref('');
  const currentPage = ref(1);

  const filteredActivities = computed(() => {
    return activities.value.filter((activity) => {
      if (eventType.value !== 'all' && activity.type !== eventType.value) {
        return false;
      }

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
    const start = (currentPage.value - 1) * ITEMS_PER_PAGE;
    const end = currentPage.value * ITEMS_PER_PAGE;
    return filteredActivities.value.slice(start, end);
  });

  const groupedActivities = computed(() => {
    const groups: { date: string; header: string; activities: Activity[] }[] =
      [];
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
        groups[groups.length - 1]?.activities.push(activity);
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

  watch([eventType, searchQuery], () => {
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

  return {
    eventType,
    searchQuery,
    currentPage,
    filteredActivities,
    totalPages,
    paginatedActivities,
    groupedActivities,
    paginationPages,
    goToPrevPage,
    goToNextPage,
    goToPage,
  };
};
