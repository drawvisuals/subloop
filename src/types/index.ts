// Shared TypeScript types for Subloop

export type SubscriptionStatus = 'active' | 'review' | 'inactive';
export type SubscriptionCycle = 'monthly' | 'yearly' | 'weekly' | 'quarterly' | 'one-time';
export type SubscriptionSource = 'email' | 'browser' | 'manual';

export interface Subscription {
  id: string;
  name: string;
  price: number;
  currency: string;
  cycle: SubscriptionCycle;
  payment_method: string | null;
  started_on: string | null;
  renewal_date: string | null;
  status: SubscriptionStatus;
  notes: string | null;
  source: SubscriptionSource;
}

export type UserPlan = 'free' | 'pro-monthly' | 'pro-yearly' | 'lifetime';

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  auth_provider: 'google' | 'email';
  plan: UserPlan;
  created_at: string;
  last_login: string;
}

export interface ConnectedInbox {
  id: string;
  provider: 'gmail' | 'outlook' | 'icloud' | 'imap';
  email: string;
  connected: boolean;
  last_scan_date: string | null;
}
