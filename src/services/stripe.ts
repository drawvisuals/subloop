import { loadStripe, Stripe } from '@stripe/stripe-js';

// Stripe publishable key - use test key for development
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51QEXAMPLE'; // Test key placeholder

let stripePromise: Promise<Stripe | null>;

/**
 * Initialize Stripe instance
 */
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export type PlanType = 'pro-monthly' | 'pro-yearly' | 'lifetime';

export interface CheckoutSessionRequest {
  planType: PlanType;
  successUrl: string;
  cancelUrl: string;
}

/**
 * Create a Stripe Checkout Session
 * In production, this would call your backend API to create the session
 * For now, we'll mock this for testing
 */
export async function createCheckoutSession({
  planType,
  successUrl,
  cancelUrl,
}: CheckoutSessionRequest): Promise<{ sessionId: string; url: string }> {
  // Mock implementation - in production, this would call your backend API
  // Example: const response = await fetch('/api/create-checkout-session', { ... })

  // For now, we'll simulate the checkout session creation
  // In a real implementation, your backend would:
  // 1. Create a Stripe Checkout Session using the Stripe API
  // 2. Return the session ID and checkout URL
  // 3. The frontend redirects to the checkout URL

  const mockSessionId = `cs_test_${Date.now()}`;

  // In production, you would redirect to the actual Stripe Checkout URL
  // For testing without a backend, we'll use Stripe's test checkout
  // This requires a backend API endpoint that creates the session

  // Placeholder - replace with actual backend API call
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      planType,
      successUrl,
      cancelUrl,
    }),
  }).catch(() => {
    // Mock fallback if backend is not available
    // In development, this simulates the checkout flow
    return null;
  });

  if (response && response.ok) {
    const data = await response.json();
    return { sessionId: data.sessionId, url: data.url };
  }

  // Mock response for development/testing
  // This would be replaced with actual Stripe Checkout in production
  console.warn('Using mock checkout session. Backend API not available.');

  // Return a mock URL that simulates Stripe Checkout
  // In production, this would be the actual Stripe Checkout URL
  return {
    sessionId: mockSessionId,
    url: `/checkout/mock?session_id=${mockSessionId}&plan=${planType}`,
  };
}

/**
 * Redirect to Stripe Checkout
 */
export async function redirectToCheckout(planType: PlanType): Promise<void> {
  const origin = window.location.origin;
  const successUrl = `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${origin}/checkout/cancel`;

  try {
    const { url } = await createCheckoutSession({
      planType,
      successUrl,
      cancelUrl,
    });

    // Redirect to Stripe Checkout
    window.location.href = url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    // Handle error - show error message to user
    alert('Unable to start checkout. Please try again later.');
  }
}
