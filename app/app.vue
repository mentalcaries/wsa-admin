<script setup lang="ts">
import { Toaster } from 'vue-sonner';

useHead({
  title: 'WSA Admin - Dashboard',
  meta: [
    { name: 'description', content: 'WellSolveAble Admin Dashboard' },
    { name: 'generator', content: 'v0.app' },
  ],
  link: [
    {
      rel: 'icon',
      href: '/favicon-32x32.png',
      media: '(prefers-color-scheme: light)',
    },
    {
      rel: 'icon',
      href: '/favicon-32x32.png',
      media: '(prefers-color-scheme: dark)',
    },
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
  ],
  htmlAttrs: {
    lang: 'en',
  },
  bodyAttrs: {
    class: 'font-sans antialiased',
  },
});
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toaster />
  </div>
</template>
