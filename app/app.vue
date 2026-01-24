<script setup lang="ts">
useHead({
  title: 'WSA Admin - Dashboard',
  meta: [
    { name: 'description', content: 'WellSolveAble Admin Dashboard' },
    { name: 'generator', content: 'v0.app' },
  ],
  link: [
    {
      rel: 'icon',
      href: '/icon-light-32x32.png',
      media: '(prefers-color-scheme: light)',
    },
    {
      rel: 'icon',
      href: '/icon-dark-32x32.png',
      media: '(prefers-color-scheme: dark)',
    },
    { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' },
    { rel: 'apple-touch-icon', href: '/apple-icon.png' },
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
    <NuxtPage />
  </div>
</template>
