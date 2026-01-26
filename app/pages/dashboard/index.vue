<script setup lang="ts">
import {
  generateDummyActivities,
  defaultServices,
  defaultAlerts,
  defaultQuickLinks,
} from '~/utils/dashboard-data';

definePageMeta({
  layout: 'dashboard'
})

const activities = generateDummyActivities();
</script>

<template>
  <div class="min-h-screen bg-background">
    <main class="pt-14">
      <div class="mx-auto max-w-7xl px-6 py-10">
        <!--` Metrics Cards -->
        <DashboardMetricsBar
          :total-users="2847"
          :new-users-this-week="142"
          :active-subscriptions="1423"
          :reports-this-week="847"
          :error-count="3"
        />

        <div class="mt-10 grid gap-8 lg:grid-cols-[2fr_3fr]">
          <div class="flex flex-col gap-6">
            <DashboardSystemStatus :services="defaultServices" />
            <DashboardQuickLinks :links="defaultQuickLinks" />
          </div>

          <div class="flex flex-col gap-6">
            <DashboardAlertsSection :alerts="defaultAlerts" />
            <DashboardActivityFeed :activities="activities" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
