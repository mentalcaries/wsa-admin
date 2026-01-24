<script setup lang="ts">
import { ref, computed } from 'vue';
import { Search, Download, Eye } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import type { User } from '~/types';
import { testUsers } from '~/utils/user-data';

const searchQuery = ref('');
const selectedUser = ref<User | null>(null);
const isModalOpen = ref(false);

const filteredUsers = computed(() => {
  return testUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

const handleViewUser = (user: User) => {
  selectedUser.value = user;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedUser.value = null;
};
</script>

<template>
  <div class="min-h-screen bg-background">
    <AdminNav />

    <main class="pt-14">
      <div class="mx-auto max-w-7xl px-6 py-10">
        <!-- Header -->
        <div
          class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 class="text-2xl font-semibold text-foreground">
              User Management
            </h1>
            <p class="mt-1 text-sm text-muted-foreground">
              View and manage user accounts, subscriptions, and reports
            </p>
          </div>
          <Button variant="outline" class="gap-2 bg-transparent">
            <Download class="h-4 w-4" />
            Export Users
          </Button>
        </div>

        <!-- Search Bar -->
        <div class="mt-8">
          <div class="relative max-w-md">
            <Search
              class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search users by name or email..."
              class="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <!-- Table -->
        <div
          class="mt-6 overflow-hidden rounded-lg border border-border bg-card shadow-sm"
        >
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-border bg-muted/50">
                  <th
                    class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    Name
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    Email
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    Tier
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    Status
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    Joined
                  </th>
                  <th
                    class="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border">
                <tr
                  v-for="user in filteredUsers"
                  :key="user.id"
                  class="transition-colors hover:bg-muted/30 cursor-pointer"
                  @click="handleViewUser(user)"
                >
                  <td
                    class="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground"
                  >
                    {{ user.name }}
                  </td>
                  <td
                    class="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground"
                  >
                    {{ user.email }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    <span
                      :class="[
                        'text-sm',
                        user.tier === 'Basic' ? 'text-muted-foreground' : '',
                        user.tier === 'Professional'
                          ? 'text-primary font-medium'
                          : '',
                        user.tier === 'Enterprise'
                          ? 'text-foreground font-semibold'
                          : '',
                      ]"
                    >
                      {{ user.tier }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    <span
                      :class="[
                        'rounded-full px-2.5 py-0.5 text-xs font-medium',
                        user.status === 'Active'
                          ? 'bg-success/10 text-success'
                          : '',
                        user.status === 'Inactive'
                          ? 'bg-muted text-muted-foreground'
                          : '',
                        user.status === 'Pending'
                          ? 'bg-warning/10 text-warning'
                          : '',
                      ]"
                    >
                      {{ user.status }}
                    </span>
                  </td>
                  <td
                    class="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground"
                  >
                    {{ user.joined }}
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      class="h-8 w-8 p-0"
                      @click.stop="handleViewUser(user)"
                    >
                      <Eye class="h-4 w-4" />
                      <span class="sr-only">View</span>
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <!-- User Detail Modal -->
    <UsersDetailModal
      :user="selectedUser"
      :is-open="isModalOpen"
      @close="closeModal"
    />
  </div>
</template>
