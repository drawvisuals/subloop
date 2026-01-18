/**
 * Onboarding state management
 * Handles user onboarding flow state and determines post-auth redirects
 */

import { getCurrentUser } from './auth';
import { getSubscriptionCount } from './subscriptionsStorage';

export interface OnboardingState {
  emailConnectedCount: number;
  scanStatus: 'not_started' | 'in_progress' | 'complete';
  browserExtensionStatus: 'unknown' | 'connected' | 'skipped';
  completedAt?: string; // ISO 8601
}

const ONBOARDING_STATE_KEY = 'subloop_onboarding_state';

/**
 * Get onboarding state for current user
 */
export function getOnboardingState(): OnboardingState {
  if (typeof window === 'undefined') {
    return {
      emailConnectedCount: 0,
      scanStatus: 'not_started',
      browserExtensionStatus: 'unknown',
    };
  }

  try {
    const userEmail = getCurrentUser();
    if (!userEmail) {
      return {
        emailConnectedCount: 0,
        scanStatus: 'not_started',
        browserExtensionStatus: 'unknown',
      };
    }

    const stored = localStorage.getItem(`${ONBOARDING_STATE_KEY}_${userEmail}`);
    if (stored) {
      return JSON.parse(stored);
    }

    // Default state for new users
    return {
      emailConnectedCount: 0,
      scanStatus: 'not_started',
      browserExtensionStatus: 'unknown',
    };
  } catch (error) {
    console.error('Failed to get onboarding state:', error);
    return {
      emailConnectedCount: 0,
      scanStatus: 'not_started',
      browserExtensionStatus: 'unknown',
    };
  }
}

/**
 * Update onboarding state for current user
 */
export function updateOnboardingState(updates: Partial<OnboardingState>): void {
  if (typeof window === 'undefined') return;

  try {
    const userEmail = getCurrentUser();
    if (!userEmail) return;

    const current = getOnboardingState();
    const updated = { ...current, ...updates };

    localStorage.setItem(`${ONBOARDING_STATE_KEY}_${userEmail}`, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to update onboarding state:', error);
  }
}

/**
 * Check if user has email token (Gmail/Outlook access token)
 */
function hasEmailToken(): boolean {
  if (typeof window === 'undefined') return false;

  // Check for Google access token
  const googleToken = localStorage.getItem('google_access_token');
  if (googleToken) return true;

  // TODO: Check for Outlook token when implemented
  // const outlookToken = localStorage.getItem('outlook_access_token');
  // if (outlookToken) return true;

  return false;
}

/**
 * Determine post-auth redirect route based on onboarding state
 * Enforces: no token + no scan → /onboarding/email-scan
 */
export function getPostAuthRedirect(): string {
  const state = getOnboardingState();

  // Get subscription count - check if we're in a browser environment
  let subscriptionCount = 0;
  if (typeof window !== 'undefined') {
    try {
      subscriptionCount = getSubscriptionCount();
    } catch (error) {
      // If storage service not available yet, assume 0
      subscriptionCount = 0;
    }
  }

  // Check if user has email token
  const hasToken = hasEmailToken();

  // If no email token and scan not complete → must connect email first
  if (!hasToken && state.scanStatus !== 'complete') {
    return '/onboarding/email-scan';
  }

  // If no emails connected (according to state) and no subscriptions, go to email scan
  if (state.emailConnectedCount === 0 && subscriptionCount === 0 && !hasToken) {
    return '/onboarding/email-scan';
  }

  // If emails connected but scan not completed, go to scanning
  if ((state.emailConnectedCount > 0 || hasToken) && state.scanStatus !== 'complete') {
    if (state.scanStatus === 'in_progress') {
      return '/onboarding/scanning';
    }
    // If token exists but scan not started, start scanning
    if (hasToken && state.scanStatus === 'not_started') {
      return '/onboarding/scanning';
    }
    return '/onboarding/email-scan';
  }

  // If scan complete but extension not connected and not skipped, show extension step
  if (
    state.scanStatus === 'complete' &&
    state.browserExtensionStatus === 'unknown'
  ) {
    return '/onboarding/browser-extension';
  }

  // Otherwise, go to subscriptions
  return '/app/subscriptions';
}

/**
 * Mark email as connected (called after email connection)
 */
export function markEmailConnected(count: number = 1): void {
  updateOnboardingState({
    emailConnectedCount: count,
  });
}

/**
 * Mark scan as started
 */
export function markScanStarted(): void {
  updateOnboardingState({
    scanStatus: 'in_progress',
  });
}

/**
 * Mark scan as complete
 */
export function markScanComplete(): void {
  updateOnboardingState({
    scanStatus: 'complete',
  });
}

/**
 * Mark browser extension as connected
 */
export function markExtensionConnected(): void {
  updateOnboardingState({
    browserExtensionStatus: 'connected',
  });
}

/**
 * Mark browser extension as skipped
 */
export function markExtensionSkipped(): void {
  updateOnboardingState({
    browserExtensionStatus: 'skipped',
  });
}
