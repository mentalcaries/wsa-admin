<script setup lang="ts">
import { Users, TrendingUp, CreditCard, FileText, AlertTriangle } from 'lucide-vue-next'
import { computed } from 'vue'
import MetricCard from './MetricCard.vue'

interface Props {
  totalUsers: number
  newUsersThisWeek: number
  activeSubscriptions: number
  reportsThisWeek: number
  errorCount: number
}

const props = defineProps<Props>()

const errorVariant = computed(() => {
  if (props.errorCount > 5) return 'error'
  if (props.errorCount > 0) return 'warning'
  return 'default'
})
</script>

<template>
  <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
    <MetricCard
      :icon="Users"
      :value="totalUsers"
      label="Users"
    />
    <MetricCard
      :icon="TrendingUp"
      :value="`+${newUsersThisWeek}`"
      label="New This Week"
    />
    <MetricCard
      :icon="CreditCard"
      :value="activeSubscriptions"
      label="Active Subscriptions"
    />
    <MetricCard
      :icon="FileText"
      :value="reportsThisWeek"
      label="Reports This Week"
    />
    <MetricCard
      :icon="AlertTriangle"
      :value="errorCount"
      label="Errors"
      :variant="errorVariant"
    />
  </div>
</template>