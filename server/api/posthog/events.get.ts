export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);

    const apiKey = process.env.POSTHOG_API_KEY;
    const projectId = process.env.POSTHOG_PROJECT_ID;

    console.log('PostHog API Key exists:', !!apiKey);
    console.log('PostHog Project ID:', projectId);

    if (!apiKey || !projectId) {
      throw createError({
        statusCode: 500,
        message: 'Missing PostHog environment variables',
      });
    }

    const { limit = '50', before, after, eventName } = query;

    const url = `https://us.posthog.com/api/projects/${projectId}/events`;

    const params = new URLSearchParams();
    params.append('limit', String(limit));
    params.append('orderBy', '-timestamp');

    if (before) params.append('before', String(before));
    if (after) params.append('after', String(after));
    if (eventName) params.append('event', String(eventName));

    console.log('Fetching from PostHog:', `${url}?${params}`);

    const response = await fetch(`${url}?${params}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('PostHog response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('PostHog API error:', errorText);
      throw createError({
        statusCode: response.status,
        message: `PostHog API error: ${response.statusText}`,
      });
    }

    return await response.json();
  } catch (error) {
    console.error('Server route error:', error);
    throw error;
  }
});
