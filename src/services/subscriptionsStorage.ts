/**
 * Mock subscription storage service
 * In production, this would use API calls to the backend
 */

import { getCurrentUser } from './auth';

export interface SubscriptionData {
  id: string;
  name: string;
  price: number;
  currency: string;
  cycle: 'Monthly' | 'Annually';
  paymentMethod: string;
  startedOn: Date | string;
  renewalDate: Date | string;
  status: 'Active' | 'Inactive' | 'Review';
  notes: string;
  reminder: boolean;
  isVisible?: boolean;
}

const SUBSCRIPTIONS_KEY = 'subloop_subscriptions';

function getStorageKey(): string {
  const userEmail = getCurrentUser();
  return `${SUBSCRIPTIONS_KEY}_${userEmail || 'default'}`;
}

/**
 * Get all subscriptions for current user
 */
export function getSubscriptions(): SubscriptionData[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(getStorageKey());
    if (stored) {
      const data = JSON.parse(stored);
      // Convert date strings back to Date objects
      return data.map((sub: any) => ({
        ...sub,
        startedOn: sub.startedOn ? new Date(sub.startedOn) : null,
        renewalDate: sub.renewalDate ? new Date(sub.renewalDate) : null,
      }));
    }
    return [];
  } catch (error) {
    console.error('Failed to get subscriptions:', error);
    return [];
  }
}

/**
 * Get subscription count for current user
 */
export function getSubscriptionCount(): number {
  return getSubscriptions().length;
}

/**
 * Get a single subscription by ID
 */
export function getSubscription(id: string): SubscriptionData | null {
  const subscriptions = getSubscriptions();
  return subscriptions.find(sub => sub.id === id) || null;
}

/**
 * Create a new subscription
 */
export function createSubscription(data: Omit<SubscriptionData, 'id'>): SubscriptionData {
  const subscriptions = getSubscriptions();
  const newId = Date.now().toString();
  const newSubscription: SubscriptionData = {
    ...data,
    id: newId,
    startedOn: data.startedOn instanceof Date ? data.startedOn.toISOString() : data.startedOn,
    renewalDate: data.renewalDate instanceof Date ? data.renewalDate.toISOString() : data.renewalDate,
  };

  subscriptions.push(newSubscription);
  saveSubscriptions(subscriptions);

  return {
    ...newSubscription,
    startedOn: new Date(newSubscription.startedOn),
    renewalDate: new Date(newSubscription.renewalDate),
  };
}

/**
 * Update an existing subscription
 */
export function updateSubscription(id: string, updates: Partial<SubscriptionData>): SubscriptionData | null {
  const subscriptions = getSubscriptions();
  const index = subscriptions.findIndex(sub => sub.id === id);

  if (index === -1) return null;

  const updated = {
    ...subscriptions[index],
    ...updates,
    id, // Ensure ID doesn't change
  };

  // Convert dates to ISO strings for storage
  if (updated.startedOn instanceof Date) {
    updated.startedOn = updated.startedOn.toISOString();
  }
  if (updated.renewalDate instanceof Date) {
    updated.renewalDate = updated.renewalDate.toISOString();
  }

  subscriptions[index] = updated;
  saveSubscriptions(subscriptions);

  return {
    ...updated,
    startedOn: new Date(updated.startedOn),
    renewalDate: new Date(updated.renewalDate),
  };
}

/**
 * Delete a subscription
 */
export function deleteSubscription(id: string): boolean {
  const subscriptions = getSubscriptions();
  const filtered = subscriptions.filter(sub => sub.id !== id);

  if (filtered.length === subscriptions.length) {
    return false; // Not found
  }

  saveSubscriptions(filtered);
  return true;
}

/**
 * Duplicate a subscription (create new with same data, new ID)
 */
export function duplicateSubscription(id: string): SubscriptionData | null {
  const subscription = getSubscription(id);
  if (!subscription) return null;

  const { id: _, ...dataWithoutId } = subscription;
  return createSubscription(dataWithoutId);
}

function saveSubscriptions(subscriptions: SubscriptionData[]): void {
  if (typeof window === 'undefined') return;

  try {
    // Convert dates to ISO strings for storage
    const serializable = subscriptions.map(sub => ({
      ...sub,
      startedOn: sub.startedOn instanceof Date ? sub.startedOn.toISOString() : sub.startedOn,
      renewalDate: sub.renewalDate instanceof Date ? sub.renewalDate.toISOString() : sub.renewalDate,
    }));

    localStorage.setItem(getStorageKey(), JSON.stringify(serializable));

    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('subscriptionUpdated'));
  } catch (error) {
    console.error('Failed to save subscriptions:', error);
  }
}
