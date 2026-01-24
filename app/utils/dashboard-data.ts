import type { Activity, Service, Alert, QuickLink } from '~/types';

export function generateDummyActivities(): Activity[] {
  const now = new Date();

  return [
    {
      id: '1',
      type: 'signup',
      message: 'User signed up',
      details: 'sarah.chen@startup.io',
      timestamp: new Date(now.getTime() - 2 * 60000),
    },
    {
      id: '2',
      type: 'verified',
      message: 'Email verified',
      details: 'sarah.chen@startup.io',
      timestamp: new Date(now.getTime() - 5 * 60000),
    },
    {
      id: '3',
      type: 'report',
      message: 'Report created by John Doe',
      details: 'Q4 Sales Analysis',
      timestamp: new Date(now.getTime() - 8 * 60000),
    },
    {
      id: '4',
      type: 'subscription',
      message: 'Subscription activated',
      details: 'Professional tier',
      timestamp: new Date(now.getTime() - 12 * 60000),
    },
    {
      id: '5',
      type: 'warning',
      message: 'Checkout abandoned - payment failed',
      details: 'mike.johnson@company.com',
      timestamp: new Date(now.getTime() - 15 * 60000),
    },
    {
      id: '6',
      type: 'warning',
      message: 'User hit report limit',
      details: 'Basic tier - alex@freelance.dev',
      timestamp: new Date(now.getTime() - 18 * 60000),
    },
    {
      id: '7',
      type: 'error',
      message: 'PDF generation failed',
      details: 'emma.wilson@enterprise.co',
      timestamp: new Date(now.getTime() - 25 * 60000),
    },
    {
      id: '8',
      type: 'signup',
      message: 'User signed up',
      details: 'david.kim@agency.com',
      timestamp: new Date(now.getTime() - 35 * 60000),
    },
    {
      id: '9',
      type: 'subscription',
      message: 'Subscription upgraded',
      details: 'Enterprise tier',
      timestamp: new Date(now.getTime() - 45 * 60000),
    },
    {
      id: '10',
      type: 'verified',
      message: 'Email verified',
      details: 'david.kim@agency.com',
      timestamp: new Date(now.getTime() - 52 * 60000),
    },
  ];
}

export const defaultServices: Service[] = [
  { name: 'Database (Supabase)', status: 'operational' },
  { name: 'Authentication (Supabase Auth)', status: 'operational' },
  { name: 'Billing (Polar)', status: 'operational' },
  { name: 'Email (Resend)', status: 'operational' },
  { name: 'PDF Generation', status: 'operational' },
  { name: 'Storage (Supabase)', status: 'operational' },
];

export const defaultAlerts: Alert[] = [
  { id: '1', message: "5 users haven't verified email (>48h)" },
  { id: '2', message: '2 payment failures in last 24h' },
  { id: '3', message: '3 users at report limit' },
];

export const defaultQuickLinks: QuickLink[] = [
  { name: 'Polar Dashboard', href: '#' },
  { name: 'Resend Analytics', href: '#' },
  { name: 'PostHog Insights', href: '#' },
  { name: 'Supabase Console', href: '#' },
  { name: 'Notion Docs', href: '#' },
];
