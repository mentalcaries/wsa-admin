import type { UserProfile } from '~/types';

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/login' || to.path === '/confirm') {
    return;
  }

  const user = useSupabaseUser();
  const client = useSupabaseClient();

  if (!user.value) {
    return navigateTo('/login');
  }

  const { data: profile, error } = await client
    .from('users')
    .select('role')
    .eq('id', user.value.sub)
    .single<UserProfile>();

  if (error || profile?.role !== 'platform_admin') {
    await client.auth.signOut();
    return navigateTo('/login?unauthorized=true');
  }
});
