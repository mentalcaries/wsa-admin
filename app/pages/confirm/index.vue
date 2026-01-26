<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: [], // Skip auth middleware
});

const user = useSupabaseUser();

// Watch for user to be set (happens automatically when Supabase detects the session)
watch(
  user,
  () => {
    if (user.value) {
      navigateTo('/');
    }
  },
  { immediate: true },
);
</script>

<template>
  <div
    class="flex min-h-screen flex-col items-center justify-center bg-background"
  >
    <div class="text-center">
      <div class="mb-4 inline-flex items-center gap-2">
        <svg
          class="h-8 w-8 animate-spin text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
      <p class="text-sm text-muted-foreground">Completing sign in...</p>
    </div>
  </div>
</template>
