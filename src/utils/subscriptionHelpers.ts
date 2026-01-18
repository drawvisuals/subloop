/**
 * Subscription helper utilities
 */

interface Subscription {
  id: string;
  name?: string;
  price?: number;
  cycle?: 'Monthly' | 'Annually';
  paymentMethod?: string;
  renewalDate?: Date;
  status?: 'Active' | 'Inactive' | 'Review';
  [key: string]: any;
}

/**
 * Determines if a subscription should be in Review state
 * Review is triggered when:
 * - Payment method is "Unknown"
 * - Required fields are missing (name, price, cycle, renewalDate)
 */
export function shouldBeInReviewState(subscription: Subscription): boolean {
  // Check for unknown payment method
  if (subscription.paymentMethod === 'Unknown' || !subscription.paymentMethod) {
    return true;
  }

  // Check for missing required fields
  const requiredFields = ['name', 'price', 'cycle', 'renewalDate'];
  const hasMissingRequiredFields = requiredFields.some(field => {
    const value = subscription[field];
    return value === undefined || value === null || value === '';
  });

  return hasMissingRequiredFields;
}

/**
 * Gets review reasons for a subscription
 * Returns array of reasons why subscription needs review
 */
export function getReviewReasons(subscription: Subscription): string[] {
  const reasons: string[] = [];

  if (subscription.paymentMethod === 'Unknown' || !subscription.paymentMethod) {
    reasons.push('Payment method is unknown');
  }

  if (!subscription.name) {
    reasons.push('Subscription name is missing');
  }

  if (subscription.price === undefined || subscription.price === null) {
    reasons.push('Price is missing');
  }

  if (!subscription.cycle) {
    reasons.push('Billing cycle is missing');
  }

  if (!subscription.renewalDate) {
    reasons.push('Renewal date is missing');
  }

  return reasons;
}
