import { getSupabaseAdmin } from '~~/server/utils/supabase';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = parseInt(query.page as string) || 1;
  const limit = 15;
  const offset = (page - 1) * limit;

  const supabase = getSupabaseAdmin();

  const { data: users, error: usersError, count } = await supabase
    .from('users')
    .select('id, email, name, created_at, registration_complete', { count: 'exact' })
    .neq('role', 'platform_admin')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (usersError) {
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch users',
    });
  }

  const userIds = users?.map(u => u.id) || [];
  
  // Fetch subscriptions for all users
  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('user_id, tier, status')
    .in('user_id', userIds);

  const subscriptionsMap = new Map(
    subscriptions?.map(sub => [sub.user_id, sub]) || []
  );
  
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

  if (authError) {
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch auth data',
    });
  }

  const authUsersMap = new Map(
    authUsers.users.map(u => [u.id, u.last_sign_in_at])
  );

  const formattedUsers = users?.map(user => {
    const subscription = subscriptionsMap.get(user.id);
    
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
      lastLogin: authUsersMap.get(user.id) 
        ? new Date(authUsersMap.get(user.id)!).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : 'Never',
    };
  }) || [];

  return {
    users: formattedUsers,
    pagination: {
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    },
  };
});