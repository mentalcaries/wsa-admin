<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'vue-sonner';

definePageMeta({
  layout: false,
  middleware: [],
});

const client = useSupabaseClient();
const user = useSupabaseUser();
const isLoading = ref(false);
const route = useRoute();
const isUnauthorized = ref(route.query.unauthorized === 'true');

watch(
  isUnauthorized,
  (newVal) => {
    if (newVal) {
      toast.error('Access Denied', {
        description: 'You do not have permission to access the admin portal.',
      });
    }
  },
  { immediate: true },
);

watchEffect(() => {
  if (user.value) {
    navigateTo('/dashboard');
  }
});

const handleGoogleSignIn = async () => {
  isLoading.value = true;

  try {
    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/confirm`,
      },
    });

    if (error) throw error;
  } catch (error: any) {
    console.error('Google login error:', error);
    toast({
      title: 'Login Failed',
      description: error.message || 'Could not sign in with Google',
      variant: 'destructive',
    });
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="flex min-h-screen flex-col items-center mt-40 bg-background px-4">
    <div class="w-full max-w-sm space-y-3">
      <!-- Logo -->
      <div class="flex items-center flex-col justify-center gap-2 my-8">
        <img src="/logo-dark.png" alt="WSA Logo" class="rounded-lg h-20" />
        <h2 class="text-2xl font-semibold tracking-tighter text-primary">
          WellSolveAble |
          <span class="font-bold tracking-tight text-foreground"
            >ControlValve</span
          >
        </h2>
      </div>

      <!-- Login Card -->
      <Card class="border-border shadow-sm">
        <CardHeader class="space-y-1 pb-4 text-center">
          <CardTitle class="text-xl font-semibold">Welcome back</CardTitle>
          <CardDescription>
            Sign in to access the WellSolveAble Admin Dashboard
          </CardDescription>
        </CardHeader>
        <CardContent class="pb-6">
          <Button
            variant="outline"
            class="h-11 w-full gap-3 border-border bg-card text-foreground hover:bg-secondary"
            :disabled="isLoading"
            @click="handleGoogleSignIn"
          >
            <template v-if="isLoading">
              <svg
                class="h-5 w-5 animate-spin"
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
              <span>Signing in...</span>
            </template>
            <template v-else>
              <svg class="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </template>
          </Button>

          <p class="mt-6 text-center text-xs text-muted-foreground">
            By signing in, you agree to our
            <a href="#" class="text-primary underline-offset-4 hover:underline">
              Terms of Service
            </a>
            and
            <a href="#" class="text-primary underline-offset-4 hover:underline">
              Privacy Policy
            </a>
          </p>
        </CardContent>
      </Card>

      <div
        class="mx-auto bg-red-100 mb- text-red-600 p-2 rounded-xl"
        v-if="isUnauthorized"
      >
        <p class="text-sm text-gray-600 text-center">
          Your account is not authorized to use ControlValve. If you believe
          this is an error, please contact your administrator.
        </p>
      </div>

      <!-- Footer -->
      <p class="mt-6 text-center text-xs text-muted-foreground">
        Need help?
        <a
          href="mailto:dev@wellsolveable.com"
          class="text-primary underline-offset-4 hover:underline"
        >
          Contact support
        </a>
      </p>
    </div>
  </div>
</template>
