import type { Activity, ActivityType } from '~/types';

const emails = [
  'sarah.chen@startup.io',
  'mike.johnson@company.com',
  'emma.wilson@enterprise.co',
  'david.kim@agency.com',
  'alex@freelance.dev',
  'jessica.lee@consulting.com',
  'tom.anderson@startup.io',
  'lisa.park@design.co',
  'james.brown@tech.io',
  'anna.martinez@marketing.com',
  'chris.taylor@sales.net',
  'rachel.green@finance.co',
  'kevin.white@product.io',
  'maria.garcia@support.com',
  'ryan.miller@devops.net',
  'olivia.jones@data.co',
  'daniel.wilson@backend.io',
  'sophia.davis@frontend.dev',
  'matthew.moore@fullstack.io',
  'emily.thomas@ux.design',
  'andrew.jackson@pm.co',
  'hannah.martin@qa.test',
  'nathan.lee@security.io',
  'victoria.clark@admin.net',
  'benjamin.wright@ceo.corp',
  'amanda.hall@cfo.finance',
  'jonathan.allen@cto.tech',
  'stephanie.young@hr.people',
  'brandon.king@legal.law',
  'ashley.scott@ops.run',
];

const reportNames = [
  'Q4 Sales Analysis',
  'Monthly Performance Review',
  'Customer Churn Report',
  'Revenue Forecast 2026',
  'User Engagement Metrics',
  'Marketing ROI Analysis',
  'Product Usage Stats',
  'Support Ticket Summary',
  'Infrastructure Cost Report',
  'A/B Test Results',
  'Conversion Funnel Analysis',
  'Competitor Analysis',
  'Employee Satisfaction Survey',
  'Budget Variance Report',
  'Risk Assessment',
];

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function formatName(email: string): string {
  return email
    .split('@')[0]
    .replace('.', ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function generateActivityForTimestamp(timestamp: Date, id: number): Activity {
  const email = getRandomItem(emails);
  const reportName = getRandomItem(reportNames);
  const rand = Math.random();

  if (rand < 0.2) {
    return {
      id: String(id),
      type: 'signup',
      message: 'User signed up',
      details: email,
      timestamp,
    };
  }

  if (rand < 0.35) {
    return {
      id: String(id),
      type: 'verified',
      message: 'Email verified',
      details: email,
      timestamp,
    };
  }

  if (rand < 0.55) {
    return {
      id: String(id),
      type: 'report',
      message: `Report created by ${formatName(email)}`,
      details: reportName,
      timestamp,
    };
  }

  if (rand < 0.7) {
    const actions = ['activated', 'upgraded', 'renewed', 'cancelled'];
    const tiers = ['Basic', 'Professional', 'Enterprise'];
    return {
      id: String(id),
      type: 'subscription',
      message: `Subscription ${getRandomItem(actions)}`,
      details: `${getRandomItem(tiers)} tier`,
      timestamp,
    };
  }

  if (rand < 0.88) {
    const warnings = [
      'Checkout abandoned - payment failed',
      'User hit report limit',
      'Payment retry scheduled',
      'API rate limit approached',
    ];
    return {
      id: String(id),
      type: 'warning',
      message: getRandomItem(warnings),
      details: email,
      timestamp,
    };
  }

  const errors = [
    'PDF generation failed',
    'Email delivery failed',
    'Webhook timeout',
    'Database connection error',
  ];
  return {
    id: String(id),
    type: 'error',
    message: getRandomItem(errors),
    details: email,
    timestamp,
  };
}

export function generateAllActivities(): Activity[] {
  const now = new Date();
  const activities: Activity[] = [];
  let id = 1;

  // Generate events for the past 14 days
  for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
    const dayStart = new Date(now.getTime() - dayOffset * 86400000);
    dayStart.setHours(8, 0, 0, 0);

    // More events on recent days, fewer on older days
    const eventsPerDay = dayOffset < 2 ? 15 : dayOffset < 5 ? 10 : 6;

    for (let i = 0; i < eventsPerDay; i++) {
      const randomMinutes = Math.floor(Math.random() * 720); // 12 hours of activity
      const timestamp = new Date(dayStart.getTime() + randomMinutes * 60000);

      activities.push(generateActivityForTimestamp(timestamp, id));
      id++;
    }
  }

  // Sort by timestamp descending (newest first)
  return activities.sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
  );
}
