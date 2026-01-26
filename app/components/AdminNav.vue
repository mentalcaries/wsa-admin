<script setup lang="ts">
import { ChevronDown, LogOut } from 'lucide-vue-next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'vue-sonner';

const navItems = [
  { name: 'Dashboard', href: '/' },
  { name: 'Users', href: '/users' },
  { name: 'Content Management', href: '/content' },
];

const route = useRoute();
const client = useSupabaseClient();
const user = useSupabaseUser();

const userName = computed(
  () => user.value?.user_metadata?.full_name || 'Admin User',
);
const userEmail = computed(() => user.value?.email || '');
const userAvatar = computed(() => user.value?.user_metadata?.avatar_url);
const userInitials = computed(() => {
  if (user.value?.user_metadata?.full_name) {
    return user.value.user_metadata.full_name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase();
  }
  return user.value?.email?.[0]?.toUpperCase() || 'A';
});

const isActive = (href: string) => {
  if (href === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(href);
};

const handleLogout = async () => {
  try {
    const { error } = await client.auth.signOut();
    if (error) throw error;

    toast.success('Logged out successfully');

    navigateTo('/login');
  } catch (error: any) {
    console.error('Logout error:', error);
    toast.error(error.message || 'Could not log out');
  }
};
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 h-14 border-b border-border bg-card shadow-sm"
  >
    <div class="flex h-full items-center justify-between px-6">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2">
        <div
          class="flex h-8 w-8 items-center justify-center rounded-md bg-primary"
        >
          <img src="/logo-dark.png" alt="WSA Logo" class="rounded-lg" />
        </div>
        <h2 class="text-xl font-semibold tracking-tighter text-primary">
          WellSolveAble |
          <span class="font-bold tracking-tight text-foreground">Control</span>
        </h2>
      </NuxtLink>

      <!-- Center Nav -->
      <nav class="flex items-center gap-1">
        <NuxtLink
          v-for="item in navItems"
          :key="item.name"
          :to="item.href"
          :class="[
            'relative px-4 py-2 text-sm font-medium transition-colors',
            isActive(item.href)
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground',
          ]"
        >
          {{ item.name }}
          <span
            v-if="isActive(item.href)"
            class="absolute bottom-0 left-4 right-4 h-0.5 bg-primary"
          />
        </NuxtLink>
      </nav>

      <!-- User Menu -->
      <DropdownMenu>
        <DropdownMenuTrigger
          class="flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-muted focus:outline-none"
        >
          <Avatar class="h-8 w-8">
            <AvatarImage v-if="userAvatar" :src="userAvatar" :alt="userName" />
            <AvatarFallback>{{ userInitials }}</AvatarFallback>
          </Avatar>
          <ChevronDown class="h-4 w-4 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-56">
          <!-- User Info Header -->
          <div class="px-2 py-1.5 text-sm">
            <p class="font-medium">{{ userName }}</p>
            <p class="text-xs text-muted-foreground">{{ userEmail }}</p>
          </div>
          <DropdownMenuSeparator />
          <!-- Logout -->
          <DropdownMenuItem
            class="cursor-pointer text-destructive focus:text-destructive"
            @click="handleLogout"
          >
            <LogOut class="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
</template>
