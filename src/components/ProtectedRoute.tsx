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

    const onboardingState = getOnboardingState();
    const subscriptionCount = getSubscriptionCount();

    // If navigating directly to a protected route without required onboarding
    // Allow access only if user has at least 1 subscription
    if (subscriptionCount === 0) {
      // Check if user needs onboarding
      if (
        onboardingState.emailConnectedCount === 0 ||
        (onboardingState.emailConnectedCount > 0 && onboardingState.scanStatus !== 'complete')
      ) {
        // Redirect to email scan if no subscriptions and not onboarded
        navigate('/onboarding/email-scan');
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
