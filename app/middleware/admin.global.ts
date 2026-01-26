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

  if (error) {
    console.error('Error fetching user profile:', error);
    return navigateTo('/login');
  }

  if (profile?.role !== 'platform_admin') {
    return abortNavigation({
      statusCode: 403,
      statusMessage: 'Access Denied: Admin privileges required',
    });
  }

  // User is authenticated and is an admin - allow access
});
