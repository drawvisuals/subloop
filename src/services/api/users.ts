/**
 * User API service
 * Defines the contract for user-related API endpoints
 */

import { User, CreateUserInput, UpdateUserInput } from '@/types/models';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get current user');
  }

  return response.json();
}

/**
 * Create a new user account
 */
export async function createUser(input: CreateUserInput): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create user');
  }

  return response.json();
}

/**
 * Update current user
 */
export async function updateUser(input: UpdateUserInput): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update user');
  }

  return response.json();
}

/**
 * Delete current user account
 */
export async function deleteUser(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete user');
  }
}
