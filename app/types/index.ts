export type ActivityType =
  | 'signup'
  | 'verified'
  | 'report'
  | 'subscription'
  | 'warning'
  | 'error';

export interface Activity {
  id: string;
  type: ActivityType;
  message: string;
  details?: string;
  timestamp: Date;
}

export type ServiceStatus = 'operational' | 'degraded' | 'down';

export interface Service {
  name: string;
  status: ServiceStatus;
}

export interface Alert {
  id: string;
  message: string;
  count?: number;
}

export interface QuickLink {
  name: string;
  href: string;
}

export interface User {
  id: string;
  email: string;
  role: 'user' | 'platform_admin';
  created_at: string;
}

export interface Problem {
  id: string;
  problem_id: string;
  name: string;
  display_order: number;
  is_active: boolean;
  solutions?: Solution[];
}

export interface Solution {
  id: string;
  problem_id: string;
  solution_id: string;
  solution: string;
  display_order: number;
}

export interface Subscription {
  id: string;
  user_id: string;
  status: 'active' | 'canceled' | 'past_due';
  tier: 'basic' | 'professional' | 'enterprise';
}
