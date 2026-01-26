import { getSupabaseAdmin } from '../utils/supabase'
import { queryPostHog, getEventCount, getRecentEvents } from '../utils/posthog'
import { checkAllServices } from '../utils/health'

const TIER_LIMITS = {
  basic: 25,
  professional: 100,
  enterprise: 500
}

export default defineEventHandler(async (event) => {
  try {
    const supabase = getSupabaseAdmin()

    const [
      totalUsersResult,
      newUsersResult,
      activeSubscriptionsResult,
      incompleteSignupsResult,
      usersAtLimitResult,
      reportsThisWeekCount,
      errorsLast24hCount,
      recentActivity,
      servicesHealth,
      checkoutAbandonedCount
    ] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('users').select('id', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      supabase.from('subscriptions').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('users').select('id', { count: 'exact', head: true }).is('email_confirmed_at', null).lt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
      supabase.from('subscriptions').select('tier, reports_used', { count: 'exact', head: true }).eq('status', 'active').or(`tier.eq.basic,reports_used.gte.${TIER_LIMITS.basic},tier.eq.professional,reports_used.gte.${TIER_LIMITS.professional},tier.eq.enterprise,reports_used.gte.${TIER_LIMITS.enterprise}`),
      getEventCount('report_created', 7 * 24),
      getEventCount('$exception', 24),
      getRecentEvents(10),
      checkAllServices(),
      getEventCount('checkout_abandoned', 7 * 24)
    ])

    let usersAtLimitCount = 0
    if (usersAtLimitResult.data) {
      usersAtLimitCount = usersAtLimitResult.data.filter((sub: any) => {
        const limit = TIER_LIMITS[sub.tier as keyof typeof TIER_LIMITS]
        return sub.reports_used >= limit
      }).length
    }

    return {
      metrics: {
        totalUsers: totalUsersResult.count || 0,
        newUsersThisWeek: newUsersResult.count || 0,
        activeSubscriptions: activeSubscriptionsResult.count || 0,
        reportsThisWeek: reportsThisWeekCount,
        errorsLast24h: errorsLast24hCount
      },
      actionRequired: {
        incompleteSignups: incompleteSignupsResult.count || 0,
        paymentFailures: checkoutAbandonedCount,
        usersAtLimit: usersAtLimitCount
      },
      recentActivity,
      servicesHealth
    }
  } catch (error) {
    console.error('Dashboard API error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch dashboard data'
    })
  }
})