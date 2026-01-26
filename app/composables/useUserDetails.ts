export interface UserDetail {
  id: string;
  name: string;
  email: string;
  tier: string;
  status: 'Active' | 'Inactive' | 'Pending' | 'Past Due';
  joined: string;
  lastLogin: string;
  billingCycle: string;
  nextBillingDate: string;
  reportsUsed: number;
  reportsLimit: number;
  completedReports: number;
  draftReports: number;
}

export function useUserDetails(userId: Ref<string | null>) {
  const enabled = computed(() => !!userId.value);

  const { data, error, refresh, status } = useFetch<UserDetail>(
    () => `/api/users/${userId.value}`,
    {
      immediate: false,
      server: false,
      watch: false,
    },
  );

  watch(userId, async (newId) => {
    if (newId) {
      await refresh();
    }
  });

  const loading = computed(() => status.value === 'pending');

  return {
    data: readonly(data),
    loading: readonly(loading),
    error: readonly(error),
    refresh,
  };
}
