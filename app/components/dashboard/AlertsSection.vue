<script setup lang="ts">
import { computed } from 'vue'
import { AlertTriangle, CheckCircle } from 'lucide-vue-next'

interface ActionRequired {
  incompleteSignups: number
  paymentFailures: number
  usersAtLimit: number
}

interface Props {
  alerts: Readonly<ActionRequired>
}

const props = defineProps<Props>()

const alertsList = computed(() => {
  const items = []
  
  if (props.alerts.incompleteSignups > 0) {
    items.push({
      id: 'incomplete-signups',
      message: `${props.alerts.incompleteSignups} incomplete signup${props.alerts.incompleteSignups > 1 ? 's' : ''} (no email verification)`
    })
  }
  
  if (props.alerts.paymentFailures > 0) {
    items.push({
      id: 'payment-failures',
      message: `${props.alerts.paymentFailures} abandoned checkout${props.alerts.paymentFailures > 1 ? 's' : ''} in the last 7 days`
    })
  }
  
  if (props.alerts.usersAtLimit > 0) {
    items.push({
      id: 'users-at-limit',
      message: `${props.alerts.usersAtLimit} user${props.alerts.usersAtLimit > 1 ? 's' : ''} at report limit`
    })
  }
  
  return items
})

const hasAlerts = computed(() => alertsList.value.length > 0)
</script>

<template>
  <div class="rounded-lg border border-border bg-card shadow-sm">
    <div
      class="flex items-center justify-between border-b border-border px-6 py-4"
    >
      <h2 class="text-base font-semibold text-foreground">Action Required</h2>
      <span
        v-if="hasAlerts"
        class="flex h-6 min-w-6 items-center justify-center rounded-full bg-warning px-2 text-xs font-medium text-warning-foreground"
      >
        {{ alertsList.length }}
      </span>
    </div>
    <ul v-if="hasAlerts" class="divide-y divide-border">
      <li
        v-for="alert in alertsList"
        :key="alert.id"
        class="flex items-start gap-4 px-6 py-4 transition-colors hover:bg-muted/50 cursor-pointer"
      >
        <AlertTriangle class="mt-0.5 h-4 w-4 shrink-0 text-warning" />
        <span class="text-sm leading-relaxed text-foreground">{{
          alert.message
        }}</span>
      </li>
    </ul>
    <div v-else class="flex items-center gap-3 px-6 py-5">
      <CheckCircle class="h-4 w-4 text-success" />
      <span class="text-sm text-muted-foreground">All clear!</span>
    </div>
  </div>
</template>