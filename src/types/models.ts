/**
 * Backend data models
 * Minimal and extensible schema for Subloop
 */

// ============================================================================
// USER MODELS
// ============================================================================

export type UserPlan = 'free' | 'pro-monthly' | 'pro-yearly' | 'lifetime';
export type AuthProvider = 'google' | 'email';

/**
 * User model - represents a user account
 */
export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  auth_provider: AuthProvider;
  plan: UserPlan;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
  last_login: string | null; // ISO 8601 date string
}

/**
 * User creation payload
 */
export interface CreateUserInput {
  email: string;
  password?: string; // Optional for OAuth users
  name?: string;
  auth_provider: AuthProvider;
  google_id?: string; // For Google OAuth
}

/**
 * User update payload
 */
export interface UpdateUserInput {
  name?: string;
  avatar_url?: string;
}

// ============================================================================
// SUBSCRIPTION MODELS
// ============================================================================

export type SubscriptionStatus = 'active' | 'review' | 'inactive';
export type SubscriptionCycle = 'monthly' | 'yearly' | 'weekly' | 'quarterly' | 'one-time';
export type SubscriptionSource = 'email' | 'browser' | 'manual';

/**
 * Subscription model - represents a tracked subscription
 */
export interface Subscription {
  id: string;
  user_id: string;
  name: string;
  price: number;
  currency: string; // ISO 4217 currency code (e.g., 'USD', 'EUR')
  cycle: SubscriptionCycle;
  payment_method: string | null;
  started_on: string | null; // ISO 8601 date string
  renewal_date: string | null; // ISO 8601 date string
  status: SubscriptionStatus;
  notes: string | null;
  source: SubscriptionSource;
  reminder_enabled: boolean;
  cancellation_link: string | null;
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
}

/**
 * Subscription creation payload
 */
export interface CreateSubscriptionInput {
  name: string;
  price: number;
  currency: string;
  cycle: SubscriptionCycle;
  payment_method?: string | null;
  started_on?: string | null;
  renewal_date?: string | null;
  status?: SubscriptionStatus;
  notes?: string | null;
  reminder_enabled?: boolean;
  cancellation_link?: string | null;
}

/**
 * Subscription update payload
 */
export interface UpdateSubscriptionInput {
  name?: string;
  price?: number;
  currency?: string;
  cycle?: SubscriptionCycle;
  payment_method?: string | null;
  started_on?: string | null;
  renewal_date?: string | null;
  status?: SubscriptionStatus;
  notes?: string | null;
  reminder_enabled?: boolean;
  cancellation_link?: string | null;
}

// ============================================================================
// EMAIL CONNECTION MODELS
// ============================================================================

export type EmailProvider = 'gmail' | 'outlook' | 'icloud' | 'imap';

/**
 * Email connection model - represents a connected email inbox
 */
export interface EmailConnection {
  id: string;
  user_id: string;
  provider: EmailProvider;
  email: string;
  connected: boolean;
  access_token: string | null; // Encrypted/stored securely, not exposed in API responses
  refresh_token: string | null; // Encrypted/stored securely
  token_expires_at: string | null; // ISO 8601 date string
  last_scan_date: string | null; // ISO 8601 date string
  last_scan_status: 'success' | 'error' | null;
  last_scan_error: string | null;
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
}

/**
 * Email connection creation payload
 */
export interface CreateEmailConnectionInput {
  provider: EmailProvider;
  email: string;
  access_token: string;
  refresh_token?: string;
  token_expires_at?: string | null;
}

/**
 * Email connection update payload
 */
export interface UpdateEmailConnectionInput {
  connected?: boolean;
  access_token?: string;
  refresh_token?: string;
  token_expires_at?: string | null;
}

// ============================================================================
// PLAN MODELS
// ============================================================================

/**
 * Plan model - represents a subscription plan (for reference/display)
 */
export interface Plan {
  id: string;
  name: string;
  plan_type: UserPlan;
  price_monthly: number | null; // null for free/lifetime
  price_yearly: number | null;
  price_lifetime: number | null; // null for non-lifetime plans
  currency: string;
  features: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Plan feature definition (for comparison tables, etc.)
 */
export interface PlanFeature {
  id: string;
  name: string;
  description: string | null;
}

// ============================================================================
// COMMON TYPES
// ============================================================================

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

/**
 * API error response
 */
export interface ApiError {
  message: string;
  code?: string;
  errors?: Record<string, string[]>; // Field-level validation errors
}
