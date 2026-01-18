/**
 * Protected route wrapper that handles onboarding gating
 * Redirects to appropriate onboarding step if required
 */

import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '@/services/auth';
import { getOnboardingState, getPostAuthRedirect } from '@/services/onboarding';
import { getSubscriptionCount } from '@/services/subscriptionsStorage';

interface ProtectedRouteProps {
  children: ReactNode;
  requireOnboarding?: boolean; // If true, enforce onboarding completion
}

export function ProtectedRoute({ children, requireOnboarding = true }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      navigate('/auth/login');
      return;
    }

    // If onboarding is not required, just render children
    if (!requireOnboarding) {
      setIsChecking(false);
      return;
    }

    // Check if user has email token
    const hasEmailToken = (): boolean => {
      if (typeof window === 'undefined') return false;
      const googleToken = localStorage.getItem('google_access_token');
      // TODO: Check for Outlook token when implemented
      return !!googleToken;
    };

    const onboardingState = getOnboardingState();
    const subscriptionCount = getSubscriptionCount();
    const hasToken = hasEmailToken();

    // Enforce onboarding gate: If no email token and no scan completed → redirect to connect email
    if (!hasToken && onboardingState.scanStatus !== 'complete') {
      navigate('/onboarding/email-scan');
      return;
    }

    // If user has token but scan not completed, redirect to appropriate step
    if (hasToken && onboardingState.scanStatus !== 'complete') {
      if (onboardingState.scanStatus === 'in_progress') {
        navigate('/onboarding/scanning');
      } else {
        // Token exists but scan not started → start scanning
        navigate('/onboarding/scanning');
      }
      return;
    }

    // If no subscriptions, check if onboarding is complete
    if (subscriptionCount === 0) {
      // Check if user needs onboarding
      if (
        !hasToken ||
        (onboardingState.emailConnectedCount === 0 && onboardingState.scanStatus !== 'complete') ||
        (onboardingState.emailConnectedCount > 0 && onboardingState.scanStatus !== 'complete')
      ) {
        // Redirect to appropriate onboarding step
        if (hasToken && (onboardingState.scanStatus === 'in_progress' || onboardingState.scanStatus === 'not_started')) {
          navigate('/onboarding/scanning');
        } else {
          navigate('/onboarding/email-scan');
        }
        return;
      }
    }

    setIsChecking(false);
  }, [location.pathname, navigate, requireOnboarding]);

  if (isChecking) {
    // Return null or a loading state while checking
    return null;
  }

  return <>{children}</>;
}
