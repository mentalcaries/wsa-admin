<script setup lang="ts">
import { computed, watch } from 'vue';
import { X, User as UserIcon, CreditCard, FileText } from 'lucide-vue-next';

interface Props {
  userId: string | null;
  isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
}>();

const userIdRef = computed(() => props.userId);
const { data: user, loading } = useUserDetails(userIdRef);

watch(() => props.userId, (newUserId) => {
  if (newUserId && props.isOpen) {
    // Fetch will trigger automatically due to watch in composable
  }
});

const getProgressPercentage = (used: number, limit: number) => {
  return Math.min((used / limit) * 100, 100);
};

const reportsPercentage = computed(() => {
  if (!user.value) return 0;
  return getProgressPercentage(user.value.reportsUsed, user.value.reportsLimit);
});

const isReportsNearLimit = computed(() => reportsPercentage.value >= 80);

const handleClose = () => {
  emit('close');
};
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center"
  >
    <div class="absolute inset-0 bg-foreground/20" @click="handleClose" />

    <div
      class="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-lg border border-border bg-card shadow-lg"
    >
      <div
        class="flex items-center justify-between border-b border-border px-6 py-4"
      >
        <h2 class="text-lg font-semibold text-foreground">User Details</h2>
        <button
          class="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          @click="handleClose"
        >
          <X class="h-5 w-5" />
        </button>
      </div>

      <div v-if="loading" class="px-6 py-12 text-center">
        <p class="text-sm text-muted-foreground">Loading user details...</p>
      </div>

      <div v-else-if="user" class="max-h-[calc(90vh-4rem)] overflow-y-auto px-6 py-6">
        <div class="flex items-start gap-5">
          <div class="flex-1">
            <div class="flex items-center gap-3">
              <h3 class="text-xl font-semibold text-foreground">
                {{ user.name }}
              </h3>
              <span
                :class="[
                  'rounded-full px-3 py-1 text-xs font-medium',
                  user.tier === 'basic' ? 'bg-muted text-muted-foreground' : '',
                  user.tier === 'professional' ? 'bg-primary/10 text-primary' : '',
                  user.tier === 'enterprise' ? 'bg-foreground/10 text-foreground' : '',
                  user.tier === 'None' ? 'bg-muted text-muted-foreground italic' : '',
                ]"
              >
                {{ user.tier === 'None' ? 'No subscription' : user.tier.charAt(0).toUpperCase() + user.tier.slice(1) }}
              </span>
            </div>
            <p class="mt-1 text-sm text-muted-foreground">{{ user.email }}</p>
            <div class="mt-3 flex items-center gap-4">
              <span
                :class="[
                  'rounded-full px-2.5 py-0.5 text-xs font-medium',
                  user.status === 'Active' ? 'bg-success/10 text-success' : '',
                  user.status === 'Inactive' ? 'bg-muted text-muted-foreground' : '',
                  user.status === 'Pending' ? 'bg-warning/10 text-warning' : '',
                  user.status === 'Past Due' ? 'bg-destructive/10 text-destructive' : '',
                ]"
              >
                {{ user.status }}
              </span>
              <span class="text-xs text-muted-foreground">Joined {{ user.joined }}</span>
            </div>
          </div>
        </div>

        <div class="mt-8 rounded-lg border border-border bg-muted/30 p-5">
          <div
            class="flex items-center gap-2 text-sm font-medium text-foreground"
          >
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

        <div class="mt-6 rounded-lg border border-border bg-muted/30 p-5">
          <div
            class="flex items-center gap-2 text-sm font-medium text-foreground"
          >
            <CreditCard class="h-4 w-4 text-muted-foreground" />
            Subscription Details
          </div>
          <div class="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p class="text-xs text-muted-foreground">Current Plan</p>
              <p class="mt-1 text-sm font-medium text-foreground">
                {{ user.tier === 'None' ? 'No subscription' : user.tier.charAt(0).toUpperCase() + user.tier.slice(1) }}
              </p>
            </div>
            <div>
              <p class="text-xs text-muted-foreground">Billing Cycle</p>
              <p class="mt-1 text-sm text-foreground">{{ user.billingCycle }}</p>
            </div>
            <div>
              <p class="text-xs text-muted-foreground">Next Billing Date</p>
              <p class="mt-1 text-sm text-foreground">
                {{ user.nextBillingDate }}
              </p>
            </div>
          </div>
          <div class="mt-5 space-y-4">
            <div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground"
                  >Reports Used This Cycle</span
                >
                <span
                  :class="
                    isReportsNearLimit
                      ? 'text-warning font-medium'
                      : 'text-foreground'
                  "
                >
                  {{ user.reportsUsed }} / {{ user.reportsLimit }}
                </span>
              </div>
              <div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  :class="[
                    'h-full transition-all',
                    isReportsNearLimit ? 'bg-warning' : 'bg-primary',
                  ]"
                  :style="{ width: `${reportsPercentage}%` }"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 rounded-lg border border-border bg-muted/30 p-5">
          <div
            class="flex items-center gap-2 text-sm font-medium text-foreground"
          >
            <FileText class="h-4 w-4 text-muted-foreground" />
            Reports Summary
          </div>

          <div class="mt-4 grid gap-4 sm:grid-cols-2">
            <div class="rounded-lg border border-border bg-card p-4">
              <p class="text-xs text-muted-foreground">Completed Reports</p>
              <p class="mt-2 text-2xl font-semibold text-foreground">
                {{ user.completedReports }}
              </p>
            </div>
            <div class="rounded-lg border border-border bg-card p-4">
              <p class="text-xs text-muted-foreground">Draft Reports</p>
              <p class="mt-2 text-2xl font-semibold text-foreground">
                {{ user.draftReports }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>