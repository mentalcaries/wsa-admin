<script setup lang="ts">
import { ExternalLink } from 'lucide-vue-next';
import type { QuickLink } from '~/types';

interface Props {
  links: QuickLink[];
}

defineProps<Props>();
</script>

<template>
  <div class="rounded-lg border border-border bg-card shadow-sm">
    <div class="border-b border-border px-6 py-4">
      <h2 class="text-base font-semibold text-foreground">Quick Links</h2>
    </div>
    <ul class="divide-y divide-border">
      <li v-for="link in links" :key="link.name">
        <a
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center justify-between px-6 py-4 text-sm text-foreground transition-colors hover:bg-muted/50 hover:text-primary"
        >
          <span>{{ link.name }}</span>
          <ExternalLink class="h-4 w-4 text-muted-foreground" />
        </a>
      </li>
    </ul>
  </div>
</template>
