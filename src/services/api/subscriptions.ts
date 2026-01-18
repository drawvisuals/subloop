/**
 * Subscription API service
 * Defines the contract for subscription-related API endpoints
 */

import {
  Subscription,
  CreateSubscriptionInput,
  UpdateSubscriptionInput,
  PaginationParams,
  PaginatedResponse,
} from '@/types/models';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Get all subscriptions for current user
 */
export async function getSubscriptions(
  params?: PaginationParams & {
    status?: string;
    search?: string;
  }
): Promise<PaginatedResponse<Subscription>> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set('page', params.page.toString());
  if (params?.limit) queryParams.set('limit', params.limit.toString());
  if (params?.status) queryParams.set('status', params.status);
  if (params?.search) queryParams.set('search', params.search);

  const url = `${API_BASE_URL}/subscriptions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get subscriptions');
  }

  return response.json();
}

/**
 * Get a single subscription by ID
 */
export async function getSubscription(id: string): Promise<Subscription> {
  const response = await fetch(`${API_BASE_URL}/subscriptions/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get subscription');
  }

  return response.json();
}

/**
 * Create a new subscription
 */
export async function createSubscription(input: CreateSubscriptionInput): Promise<Subscription> {
  const response = await fetch(`${API_BASE_URL}/subscriptions`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create subscription');
  }

  return response.json();
}

/**
 * Update an existing subscription
 */
export async function updateSubscription(
  id: string,
  input: UpdateSubscriptionInput
): Promise<Subscription> {
  const response = await fetch(`${API_BASE_URL}/subscriptions/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update subscription');
  }

  return response.json();
}

/**
 * Delete a subscription
 */
export async function deleteSubscription(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/subscriptions/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete subscription');
  }
}

/**
 * Export subscriptions (CSV/XLS/PDF)
 */
export async function exportSubscriptions(
  format: 'csv' | 'xls' | 'pdf'
): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/subscriptions/export?format=${format}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to export subscriptions');
  }

  return response.blob();
}
