export function useUsers(page: Ref<number>) {
  const { data, error, refresh, status } = useFetch('/api/users', {
    query: { page },
    watch: [page],
  });

  const loading = computed(() => status.value === 'pending');

  return {
    data: readonly(data),
    loading: readonly(loading),
    error: readonly(error),
    refresh,
  };
}