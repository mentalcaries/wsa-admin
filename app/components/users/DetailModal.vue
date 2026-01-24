<script setup lang="ts">
import { computed } from 'vue'
import { X, Download, User as UserIcon, CreditCard, FileText } from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { User } from '~/types'

interface Props {
  user: User | null
  isOpen: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const initials = computed(() => {
  if (!props.user) return ''
  return props.user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
})

const getProgressPercentage = (used: number, limit: number) => {
  return Math.min((used / limit) * 100, 100)
}

const getStoragePercentage = (used: string, limit: string) => {
  const usedNum = parseFloat(used)
  const limitNum = parseFloat(limit)
  return Math.min((usedNum / limitNum) * 100, 100)
}

const reportsPercentage = computed(() => {
  if (!props.user) return 0
  return getProgressPercentage(props.user.reportsUsed, props.user.reportsLimit)
})

const storagePercentage = computed(() => {
  if (!props.user) return 0
  return getStoragePercentage(props.user.storageUsed, props.user.storageLimit)
})

const isReportsNearLimit = computed(() => reportsPercentage.value >= 80)
const isStorageNearLimit = computed(() => storagePercentage.value >= 80)

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <div v-if="isOpen && user" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-foreground/20" @click="handleClose" />

    <!-- Modal -->
    <div class="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-lg border border-border bg-card shadow-lg">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-border px-6 py-4">
        <h2 class="text-lg font-semibold text-foreground">User Details</h2>
        <button
          class="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          @click="handleClose"
        >
          <X class="h-5 w-5" />
        </button>
      </div>

      <!-- Content -->
      <div class="max-h-[calc(90vh-4rem)] overflow-y-auto px-6 py-6">
        <!-- User Info Section -->
        <div class="flex items-start gap-5">
          <Avatar class="h-16 w-16">
            <AvatarImage :src="user.avatar || '/placeholder.svg'" :alt="user.name" />
            <AvatarFallback class="bg-primary/10 text-lg text-primary">
              {{ initials }}
            </AvatarFallback>
          </Avatar>
          <div class="flex-1">
            <div class="flex items-center gap-3">
              <h3 class="text-xl font-semibold text-foreground">{{ user.name }}</h3>
              <span
                :class="[
                  'rounded-full px-3 py-1 text-xs font-medium',
                  user.tier === 'Basic' ? 'bg-muted text-muted-foreground' : '',
                  user.tier === 'Professional' ? 'bg-primary/10 text-primary' : '',
                  user.tier === 'Enterprise' ? 'bg-foreground/10 text-foreground' : ''
                ]"
              >
                {{ user.tier }}
              </span>
            </div>
            <p class="mt-1 text-sm text-muted-foreground">{{ user.email }}</p>
            <div class="mt-3 flex items-center gap-4">
              <span
                :class="[
                  'rounded-full px-2.5 py-0.5 text-xs font-medium',
                  user.status === 'Active' ? 'bg-success/10 text-success' : '',
                  user.status === 'Inactive' ? 'bg-muted text-muted-foreground' : '',
                  user.status === 'Pending' ? 'bg-warning/10 text-warning' : ''
                ]"
              >
                {{ user.status }}
              </span>
              <span class="text-xs text-muted-foreground">Joined {{ user.joined }}</span>
            </div>
          </div>
        </div>

        <!-- User Info Grid -->
        <div class="mt-8 rounded-lg border border-border bg-muted/30 p-5">
          <div class="flex items-center gap-2 text-sm font-medium text-foreground">
            <UserIcon class="h-4 w-4 text-muted-foreground" />
            Account Information
          </div>
          <div class="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p class="text-xs text-muted-foreground">Last Login</p>
              <p class="mt-1 text-sm text-foreground">{{ user.lastLogin }}</p>
            </div>
            <div>
              <p class="text-xs text-muted-foreground">Account Status</p>
              <p class="mt-1 text-sm text-foreground">{{ user.status }}</p>
            </div>
          </div>
        </div>

        <!-- Subscription Section -->
        <div class="mt-6 rounded-lg border border-border bg-muted/30 p-5">
          <div class="flex items-center gap-2 text-sm font-medium text-foreground">
            <CreditCard class="h-4 w-4 text-muted-foreground" />
            Subscription Details
          </div>
          <div class="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p class="text-xs text-muted-foreground">Current Plan</p>
              <p class="mt-1 text-sm font-medium text-foreground">{{ user.tier }}</p>
            </div>
            <div>
              <p class="text-xs text-muted-foreground">Billing Cycle</p>
              <p class="mt-1 text-sm text-foreground">{{ user.billingCycle }}</p>
            </div>
            <div>
              <p class="text-xs text-muted-foreground">Next Billing Date</p>
              <p class="mt-1 text-sm text-foreground">{{ user.nextBillingDate }}</p>
            </div>
          </div>
          <div class="mt-5 space-y-4">
            <!-- Reports Progress Bar -->
            <div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">Reports Used This Cycle</span>
                <span :class="isReportsNearLimit ? 'text-warning font-medium' : 'text-foreground'">
                  {{ user.reportsUsed }} / {{ user.reportsLimit }}
                </span>
              </div>
              <div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  :class="['h-full transition-all', isReportsNearLimit ? 'bg-warning' : 'bg-primary']"
                  :style="{ width: `${reportsPercentage}%` }"
                />
              </div>
            </div>
            <!-- Storage Progress Bar -->
            <div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">Storage Used</span>
                <span :class="isStorageNearLimit ? 'text-warning font-medium' : 'text-foreground'">
                  {{ user.storageUsed }} / {{ user.storageLimit }}
                </span>
              </div>
              <div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  :class="['h-full transition-all', isStorageNearLimit ? 'bg-warning' : 'bg-primary']"
                  :style="{ width: `${storagePercentage}%` }"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Reports Section -->
        <div class="mt-6 rounded-lg border border-border bg-muted/30 p-5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-sm font-medium text-foreground">
              <FileText class="h-4 w-4 text-muted-foreground" />
              Recent Reports
            </div>
            <button
              v-if="user.reports.length > 0"
              class="text-xs font-medium text-primary hover:underline"
            >
              View All
            </button>
          </div>

          <div v-if="user.reports.length === 0" class="mt-4 rounded-lg border border-dashed border-border py-8 text-center">
            <p class="text-sm text-muted-foreground">No reports created yet</p>
          </div>

          <div v-else class="mt-4 overflow-hidden rounded-lg border border-border">
            <table class="w-full">
              <thead>
                <tr class="border-b border-border bg-card">
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Report Name
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Date
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Size
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Download
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border bg-card">
                <tr
                  v-for="report in user.reports.slice(0, 10)"
                  :key="report.id"
                  class="transition-colors hover:bg-muted/30"
                >
                  <td class="px-4 py-3 text-sm font-medium text-foreground">
                    {{ report.name }}
                  </td>
                  <td class="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                    {{ report.dateCreated }}
                  </td>
                  <td class="whitespace-nowrap px-4 py-3">
                    <span
                      :class="[
                        'rounded-full px-2 py-0.5 text-xs font-medium',
                        report.status === 'Completed' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                      ]"
                    >
                      {{ report.status }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                    {{ report.fileSize }}
                  </td>
                  <td class="whitespace-nowrap px-4 py-3 text-right">
                    <button class="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-primary">
                      <Download class="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>