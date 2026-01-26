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

export interface Report {
  id: string;
  name: string;
  dateCreated: string;
  status: 'Completed' | 'Draft';
  fileSize: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  tier: 'Basic' | 'Professional' | 'Enterprise';
  status: 'Active' | 'Inactive' | 'Pending';
  joined: string;
  lastLogin: string;
  billingCycle: 'Monthly' | 'Annual';
  nextBillingDate: string;
  reportsUsed: number;
  reportsLimit: number;
  storageUsed: string;
  storageLimit: string;
  reports: Report[];
}

export interface UserProfile {
  id: string;
  role: 'user' | 'platform_admin';
  email?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DatabaseProblem {
  id: string;
  problem_id: string;
  name: string;
  display_order: number;
  is_active: boolean;
  solutions?: DatabaseSolution[];
}

export interface DatabaseSolution {
  id: string;
  problem_id: string;
  solution_id: string;
  solution: string;
  display_order: number;
}

export interface Solution {
  id: string;
  text: string;
  displayOrder: number;
}

export interface Problem {
  id: string;
  name: string;
  solutions: Solution[];
  active: boolean;
  displayOrder: number;
}

export interface Subscription {
  id: string;
  user_id: string;
  status: 'active' | 'canceled' | 'past_due';
  tier: 'basic' | 'professional' | 'enterprise';
}

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  tier: string;
  status: 'Active' | 'Inactive' | 'Pending' | 'Past Due';
  joined: string;
  lastLogin: string;
}

export interface UsersResponse {
  users: UserListItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
