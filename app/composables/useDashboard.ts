import { useIntervalFn } from "@vueuse/core"

interface DashboardMetrics {
  totalUsers: number
  newUsersThisWeek: number
  activeSubscriptions: number
  reportsThisWeek: number
  errorsLast24h: number
}

interface ActionRequired {
  incompleteSignups: number
  paymentFailures: number
  usersAtLimit: number
}

interface HealthCheckResult {
  service: string
  status: 'healthy' | 'degraded' | 'down'
  responseTime?: number
  error?: string
}

interface DashboardData {
  metrics: DashboardMetrics
  actionRequired: ActionRequired
  recentActivity: any[]
  servicesHealth: HealthCheckResult[]
}

export function useDashboard(autoRefreshMs: number = 60000) {
  const { data, error, refresh, status } = useFetch<DashboardData>('/api/dashboard', {
    lazy: true,
    server: false
  })

  const loading = computed(() => status.value === 'pending')

  useIntervalFn(refresh, autoRefreshMs)

  return {
    data: readonly(data),
    loading: readonly(loading),
    error: readonly(error),
    refresh
  }
}