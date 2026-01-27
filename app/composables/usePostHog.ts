import type { Activity, ActivityType } from '~/types';

interface PostHogEvent {
  id: string;
  event: string;
  timestamp: string;
  distinct_id: string;
  properties: Record<string, any>;
  person?: {
    properties: Record<string, any>;
  };
}

interface PostHogEventsResponse {
  results: PostHogEvent[];
  next: string | null;
}

const MS_PER_DAY = 86400000;
const MAX_EVENTS_FETCH = 1000;

const EVENT_TYPE_MAP: Record<string, ActivityType> = {
  user_signed_up: 'signup',
  email_verified: 'verified',
  report_created: 'report',
  subscription_active: 'subscription',
  subscription_canceled: 'subscription',
  checkout_abandoned: 'warning',
  report_limit_reached: 'warning',
};

function formatEventMessage(eventName: string, properties: any): string {
  switch (eventName) {
    case 'user_signed_up':
      return `New user signed up via ${properties.method || 'unknown'}`;
    case 'email_verified':
      return 'User verified their email';
    case 'report_created':
      return properties.report_type
        ? `Report created: ${properties.report_type}`
        : 'New report created';
    case 'subscription_active':
      return `Subscription activated: ${properties.tier || 'unknown'} tier`;
    case 'subscription_canceled':
      return `Subscription canceled: ${properties.tier || 'unknown'} tier`;
    case 'checkout_abandoned':
      return `Checkout abandoned: ${properties.reason || 'unknown'}`;
    case 'report_limit_reached':
      return `Report limit reached for ${properties.tier || 'unknown'} tier`;
    default:
      return eventName
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
  }
}

function mapPostHogEventToActivity(event: PostHogEvent): Activity | null {
  const activityType = EVENT_TYPE_MAP[event.event];
  if (!activityType) return null;

  return {
    id: event.id,
    type: activityType,
    message: formatEventMessage(event.event, event.properties),
    details: event.person?.properties?.email || event.distinct_id,
    timestamp: new Date(event.timestamp),
  };
}

export const usePostHog = () => {
  const fetchEvents = async (options?: {
    limit?: number;
    before?: string;
    after?: string;
    event?: string;
  }): Promise<PostHogEventsResponse> => {
    const { limit = 50, before, after, event } = options || {};

    const params: Record<string, string> = {
      limit: String(limit),
    };

    if (before) params.before = before;
    if (after) params.after = after;
    if (event) params.eventName = event;

    const response = await $fetch('/api/posthog/events', {
      method: 'GET',
      params,
    });

    return response;
  };
  const fetchActivities = async (daysAgo: number): Promise<Activity[]> => {
    const afterDate = new Date(Date.now() - daysAgo * MS_PER_DAY).toISOString();

    const response = await fetchEvents({
      limit: MAX_EVENTS_FETCH,
      after: afterDate,
    });

    return response.results
      .map(mapPostHogEventToActivity)
      .filter((activity): activity is Activity => activity !== null)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  return {
    fetchEvents,
    fetchActivities,
  };
};
