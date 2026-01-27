import {
  UserPlus,
  CheckCircle,
  FileText,
  CreditCard,
  AlertTriangle,
  XCircle,
} from 'lucide-vue-next';
import type { ActivityType } from '~/types';

export const ACTIVITY_ICONS: Record<ActivityType, any> = {
  signup: UserPlus,
  verified: CheckCircle,
  report: FileText,
  subscription: CreditCard,
  warning: AlertTriangle,
  error: XCircle,
};

export const ACTIVITY_COLORS: Record<ActivityType, string> = {
  signup: 'text-success',
  verified: 'text-success',
  report: 'text-primary',
  subscription: 'text-primary',
  warning: 'text-warning',
  error: 'text-destructive',
};

export const EVENT_TYPE_LABELS: Record<string, string> = {
  all: 'All Events',
  signup: 'Signups',
  verified: 'Verified',
  report: 'Reports',
  subscription: 'Subscriptions',
  warning: 'Warnings',
  error: 'Errors',
};

export const ITEMS_PER_PAGE = 50;
