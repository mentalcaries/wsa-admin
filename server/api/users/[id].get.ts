import { getSupabaseAdmin } from '~~/server/utils/supabase';

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'id');

  if (!userId) {
    throw createError({
      statusCode: 400,
      message: 'User ID is required',
    });
  }

  const supabase = getSupabaseAdmin();

  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, email, name, created_at, registration_complete')
    .eq('id', userId)
    .single();

  if (userError || !user) {
    throw createError({
      statusCode: 404,
      message: 'User not found',
    });
  }

  const { data: subscription, error: subError } = await supabase
    .from('subscriptions')
    .select(
      'tier, status, current_period_start, current_period_end, reports_used',
    )
    .eq('user_id', userId)
    .maybeSingle();

  // Determine reports limit based on tier
  const tierLimits: Record<string, number> = {
    basic: 25,
    professional: 100,
    enterprise: 500, // Unlimited represented as very large number
  };

  const reportsLimit = subscription?.tier
    ? tierLimits[subscription.tier] || 0
    : 0;

  const { count: completedReports } = await supabase
    .from('reports')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_completed', true);

  const { count: draftReports } = await supabase
    .from('reports')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_draft', true);

  const { data: authUsers } = await supabase.auth.admin.listUsers();
  const authUser = authUsers.users.find((u) => u.id === userId);

  let status: 'Active' | 'Inactive' | 'Pending' | 'Past Due';

  if (!user.registration_complete) {
    status = 'Pending';
  } else if (subscription) {
    if (subscription.status === 'active') {
      status = 'Active';
    } else if (subscription.status === 'past_due') {
      status = 'Past Due';
    } else {
      status = 'Inactive';
    }
  } else {
    status = 'Inactive';
  }

  let billingCycle = 'N/A';
  if (subscription?.current_period_start && subscription?.current_period_end) {
    const start = new Date(subscription.current_period_start);
    const end = new Date(subscription.current_period_end);
    const diffDays = Math.floor(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
    billingCycle = diffDays > 180 ? 'Yearly' : 'Monthly';
  }

  return {
    id: user.id,
    name: user.name || user.email,
    email: user.email,
    tier: subscription?.tier || 'None',
    status,
    joined: new Date(user.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    lastLogin: authUser?.last_sign_in_at
      ? new Date(authUser.last_sign_in_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : 'Never',
    billingCycle,
    nextBillingDate: subscription?.current_period_end
      ? new Date(subscription.current_period_end).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : 'N/A',
    reportsUsed: subscription?.reports_used || 0,
    reportsLimit,
    completedReports: completedReports || 0,
    draftReports: draftReports || 0,
  };
});
