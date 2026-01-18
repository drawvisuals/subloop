/**
 * Plan API service
 * Defines the contract for plan-related API endpoints
 */

import { Plan } from '@/types/models';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Get all available plans
 */
export async function getPlans(): Promise<Plan[]> {
  const response = await fetch(`${API_BASE_URL}/plans`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get plans');
  }

  return response.json();
}

/**
 * Get a single plan by ID
 */
export async function getPlan(id: string): Promise<Plan> {
  const response = await fetch(`${API_BASE_URL}/plans/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get plan');
  }

  return response.json();
}

/**
 * Get current user's plan details
 */
export async function getCurrentPlan(): Promise<Plan> {
  const response = await fetch(`${API_BASE_URL}/plans/current`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get current plan');
  }

  return response.json();
}
