export async function queryPostHog(hogqlQuery: string) {
  const projectId = process.env.POSTHOG_PROJECT_ID
  const apiKey = process.env.POSTHOG_API_KEY
  const host = process.env.POSTHOG_HOST || 'https://us.posthog.com'

  if (!projectId || !apiKey) {
    throw new Error('Missing PostHog environment variables')
  }

  const response = await fetch(`${host}/api/projects/${projectId}/query/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      query: {
        kind: 'HogQLQuery',
        query: hogqlQuery
      }
    })
  })

  if (!response.ok) {
    throw new Error(`PostHog query failed: ${response.statusText}`)
  }

  return await response.json()
}

export async function getEventCount(eventName: string, hoursAgo: number = 24) {
  const query = `
    SELECT COUNT(*) as count
    FROM events
    WHERE event = '${eventName}'
      AND timestamp >= now() - INTERVAL ${hoursAgo} HOUR
  `
  
  const result = await queryPostHog(query)
  return result.results?.[0]?.[0] || 0
}

export async function getRecentEvents(limit: number = 10) {
  const query = `
    SELECT 
      event,
      timestamp,
      distinct_id,
      properties
    FROM events
    WHERE event IN (
      'user_signed_up',
      'email_verified',
      'checkout_started',
      'checkout_abandoned',
      'subscription_active',
      'subscription_canceled',
      'report_created',
      'report_limit_reached'
    )
    ORDER BY timestamp DESC
    LIMIT ${limit}
  `
  
  const result = await queryPostHog(query)
  return result.results || []
}