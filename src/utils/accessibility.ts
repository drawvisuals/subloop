/**
 * Accessibility utilities and helpers
 */

/**
 * Get ARIA label for status badge
 */
export function getStatusAriaLabel(status: string): string {
  const labels: Record<string, string> = {
    active: 'Active subscription',
    review: 'Subscription needs review',
    inactive: 'Inactive subscription',
  };
  return labels[status] || status;
}

/**
 * Format currency for screen readers
 */
export function formatCurrencyA11y(amount: number, currency: string): string {
  return `${amount.toFixed(2)} ${currency}`;
}

/**
 * Format date for screen readers
 */
export function formatDateA11y(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Calculate days until renewal for screen readers
 */
export function getRenewalDaysA11y(renewalDate: string): string {
  const today = new Date();
  const renewal = new Date(renewalDate);
  const diffTime = renewal.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'Renewal date has passed';
  } else if (diffDays === 0) {
    return 'Renews today';
  } else if (diffDays === 1) {
    return 'Renews tomorrow';
  } else {
    return `Renews in ${diffDays} days`;
  }
}
