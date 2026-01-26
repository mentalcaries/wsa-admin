<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

const { data, loading, error } = useDashboard()
</script>

<template>
  <div class="min-h-screen bg-background">
    <main class="pt-14">
      <div class="mx-auto max-w-7xl px-6 py-10">
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
          <p class="mt-2 text-sm text-gray-600">Loading dashboard...</p>
        </div>

        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <p class="text-red-800">Failed to load dashboard data</p>
        </div>

        <template v-else-if="data">
          <DashboardMetricsBar
            :total-users="data.metrics.totalUsers"
            :new-users-this-week="data.metrics.newUsersThisWeek"
            :active-subscriptions="data.metrics.activeSubscriptions"
            :reports-this-week="data.metrics.reportsThisWeek"
            :error-count="data.metrics.errorsLast24h"
          />

          <div class="mt-10 grid gap-8 lg:grid-cols-[2fr_3fr]">
            <div class="flex flex-col gap-6">
              <DashboardSystemStatus :services="data.servicesHealth" />
              <DashboardQuickLinks />
            </div>

            <div class="flex flex-col gap-6">
              <DashboardAlertsSection :alerts="data.actionRequired" />
              <DashboardActivityFeed :activities="data.recentActivity" />
            </div>
          </div>
        </template>
      </div>
    </main>
  </div>
</template>