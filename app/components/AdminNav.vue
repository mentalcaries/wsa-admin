<script setup lang="ts">
import { ChevronDown, LogOut, User } from 'lucide-vue-next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navItems = [
  { name: 'Dashboard', href: '/' },
  { name: 'Users', href: '/users' },
  { name: 'Content Management', href: '/content' },
];

const route = useRoute();

const isActive = (href: string) => {
  if (href === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(href);
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
          <img src="/logo.png" alt="WSA Logo" class="rounded-lg" />
        </div>
        <h2 class="text-xl font-semibold text-foreground tracking-tighter">
          WellSolveAble | <span class="font-bold tracking-tight">Control</span>
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
          <Avatar class="h-7 w-7">
            <AvatarImage src="placeholder-user.jpg" alt="Admin" />
            <AvatarFallback class="bg-muted text-xs text-foreground"
              >AD</AvatarFallback
            >
          </Avatar>
          <ChevronDown class="h-4 w-4 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-48">
          <DropdownMenuItem class="cursor-pointer">
            <User class="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            class="cursor-pointer text-destructive focus:text-destructive"
          >
            <LogOut class="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
</template>
